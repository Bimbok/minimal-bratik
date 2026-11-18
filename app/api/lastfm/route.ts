import { NextResponse } from "next/server";
import { PORTFOLIO_DATA, MusicData, MusicTrack, MusicArtist } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

interface RawLastFmTrack {
  name: string;
  url?: string;
  artist?: { "#text"?: string; name?: string };
  album?: { "#text"?: string };
  image?: Array<{ "#text"?: string; size?: string }>;
  "@attr"?: { nowplaying?: string };
  date?: { "#text"?: string };
}

interface RawLastFmArtist {
  name: string;
  playcount?: string;
  url?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username =
    searchParams.get("username") ||
    PORTFOLIO_DATA.hobbies.music?.lastfmUsername ||
    "bimbokmkj";

  const apiKey =
    process.env.LASTFM_API_KEY ||
    process.env.NEXT_PUBLIC_LASTFM_API_KEY ||
    "";

  // If no API key is configured yet, return realistic cached/fallback data immediately
  if (!apiKey) {
    return NextResponse.json({
      success: true,
      isLiveSynced: false,
      message: "Add LASTFM_API_KEY to .env to enable real-time scrobbles",
      music: PORTFOLIO_DATA.hobbies.music,
    });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    // 1. Fetch Recent Tracks (including live Now Playing track)
    const recentUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(
      username
    )}&api_key=${apiKey}&format=json&limit=15`;

    // 2. Fetch User Stats (playcount, artist count, loved count)
    const infoUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${encodeURIComponent(
      username
    )}&api_key=${apiKey}&format=json`;

    // 3. Fetch Top Artists
    const topArtistsUrl = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${encodeURIComponent(
      username
    )}&api_key=${apiKey}&format=json&period=7day&limit=6`;

    const [recentRes, infoRes, artistsRes] = await Promise.allSettled([
      fetch(recentUrl, { signal: controller.signal, next: { revalidate: 30 } }),
      fetch(infoUrl, { signal: controller.signal, next: { revalidate: 60 } }),
      fetch(topArtistsUrl, { signal: controller.signal, next: { revalidate: 120 } }),
    ]);

    clearTimeout(timeoutId);

    let recentTracks: MusicTrack[] = PORTFOLIO_DATA.hobbies.music?.recentTracks || [];
    let nowPlayingTrack: MusicTrack | null = null;
    let totalScrobbles = PORTFOLIO_DATA.hobbies.music?.stats.scrobbles || 521;
    let totalArtists = PORTFOLIO_DATA.hobbies.music?.stats.artists || 222;
    const totalLoved = PORTFOLIO_DATA.hobbies.music?.stats.lovedTracks || 132;
    let topArtists: MusicArtist[] = PORTFOLIO_DATA.hobbies.music?.topArtists || [];

    // Parse Recent Tracks
    if (recentRes.status === "fulfilled" && recentRes.value.ok) {
      const data = await recentRes.value.json();
      const rawTracks = data?.recenttracks?.track;
      if (Array.isArray(rawTracks)) {
        recentTracks = rawTracks.map((t: RawLastFmTrack) => {
          const isNowPlaying = t["@attr"]?.nowplaying === "true";
          const img =
            t.image?.find((i) => i.size === "extralarge")?.["#text"] ||
            t.image?.find((i) => i.size === "large")?.["#text"] ||
            "";

          const trackItem: MusicTrack = {
            name: t.name || "Unknown Track",
            artist: t.artist?.["#text"] || t.artist?.name || "Unknown Artist",
            album: t.album?.["#text"] || "",
            imageUrl: img || undefined,
            url: t.url || `https://www.last.fm/music/${encodeURIComponent(t.artist?.["#text"] || "")}/_/${encodeURIComponent(t.name || "")}`,
            nowPlaying: isNowPlaying,
            playedAt: isNowPlaying ? "Now Playing" : t.date?.["#text"] || "Recently",
          };

          if (isNowPlaying && !nowPlayingTrack) {
            nowPlayingTrack = trackItem;
          }

          return trackItem;
        });

        const totalAttr = data?.recenttracks?.["@attr"]?.total;
        if (totalAttr) {
          totalScrobbles = parseInt(totalAttr, 10);
        }
      }
    }

    // Parse User Info Stats
    if (infoRes.status === "fulfilled" && infoRes.value.ok) {
      const infoData = await infoRes.value.json();
      const user = infoData?.user;
      if (user) {
        if (user.playcount) totalScrobbles = parseInt(user.playcount, 10);
        if (user.artist_count) totalArtists = parseInt(user.artist_count, 10);
      }
    }

    // Parse Top Artists
    if (artistsRes.status === "fulfilled" && artistsRes.value.ok) {
      const artistData = await artistsRes.value.json();
      const rawArtists = artistData?.topartists?.artist;
      if (Array.isArray(rawArtists)) {
        topArtists = rawArtists.map((a: RawLastFmArtist) => ({
          name: a.name || "",
          playcount: a.playcount ? parseInt(a.playcount, 10) : undefined,
          url: a.url || `https://www.last.fm/music/${encodeURIComponent(a.name || "")}`,
        }));
      }
    }

    const payload: MusicData = {
      lastfmUsername: username,
      lastfmProfileUrl: `https://www.last.fm/user/${encodeURIComponent(username)}`,
      stats: {
        scrobbles: totalScrobbles,
        artists: totalArtists,
        lovedTracks: totalLoved,
        scrobblesThisWeek: 125,
      },
      topTrack: nowPlayingTrack || PORTFOLIO_DATA.hobbies.music?.topTrack,
      recentTracks,
      topArtists,
      topGenres: PORTFOLIO_DATA.hobbies.music?.topGenres || ["Bollywood", "Indian Indie", "Sufi & Acoustic"],
    };

    return NextResponse.json({
      success: true,
      isLiveSynced: true,
      music: payload,
    });
  } catch (error) {
    console.error("Last.fm API Error:", error);
    return NextResponse.json({
      success: true,
      isLiveSynced: false,
      music: PORTFOLIO_DATA.hobbies.music,
    });
  }
}
