import { NextResponse } from "next/server";
import {
  PORTFOLIO_DATA,
  TraktData,
  TraktHistoryItem,
  TraktShowItem,
  TraktMovieItem,
} from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

interface RawTraktWatchedShow {
  plays: number;
  show?: {
    title: string;
    year?: number;
    rating?: number;
    runtime?: number;
    genres?: string[];
    network?: string;
    ids?: { trakt?: number; slug?: string };
  };
}

interface RawTraktWatchedMovie {
  plays: number;
  movie?: {
    title: string;
    year?: number;
    rating?: number;
    runtime?: number;
    genres?: string[];
    ids?: { trakt?: number; slug?: string };
  };
}

interface RawTraktHistoryEntry {
  id: number | string;
  watched_at: string;
  type: "movie" | "episode";
  episode?: {
    title: string;
    season: number;
    number: number;
    rating?: number;
    overview?: string;
    images?: { screenshot?: string[] };
    ids?: { trakt?: number };
  };
  show?: {
    title: string;
    year?: number;
    rating?: number;
    overview?: string;
    genres?: string[];
    images?: { poster?: string[]; fanart?: string[] };
    ids?: { trakt?: number; slug?: string };
  };
  movie?: {
    title: string;
    year?: number;
    rating?: number;
    overview?: string;
    genres?: string[];
    images?: { poster?: string[]; fanart?: string[] };
    ids?: { trakt?: number; slug?: string };
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username =
    searchParams.get("username") ||
    process.env.TRAKT_USERNAME ||
    PORTFOLIO_DATA.hobbies.cinema?.traktUsername ||
    "bimbok";

  const clientId =
    process.env.TRAKT_CLIENT_ID ||
    process.env.NEXT_PUBLIC_TRAKT_CLIENT_ID ||
    "Xn0k4zuEAPZpB0XobHMqy3Z97zqt8mu9Q-XFJLhTRfk";

  if (!clientId) {
    return NextResponse.json({
      success: true,
      isLiveSynced: false,
      cinema: PORTFOLIO_DATA.hobbies.cinema,
    });
  }

  const headers = {
    "Content-Type": "application/json",
    "trakt-api-version": "2",
    "trakt-api-key": clientId,
    "User-Agent": "BratikPortfolio/1.0 (Next.js)",
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    // 1. Live Watching (200 = currently playing, 204 = idle)
    const watchingUrl = `https://api.trakt.tv/users/${encodeURIComponent(username)}/watching`;

    // 2. Watched Shows (contains all completed shows and episode counts)
    const showsUrl = `https://api.trakt.tv/users/${encodeURIComponent(username)}/watched/shows?extended=full`;

    // 3. Watched Movies (contains all 48+ watched movies)
    const moviesUrl = `https://api.trakt.tv/users/${encodeURIComponent(username)}/watched/movies?extended=full`;

    // 4. Recent History (contains chronological feed of episodes & movies)
    const historyUrl = `https://api.trakt.tv/users/${encodeURIComponent(username)}/history?extended=full&limit=30`;

    const [watchingRes, showsRes, moviesRes, historyRes] = await Promise.allSettled([
      fetch(watchingUrl, { headers, signal: controller.signal, cache: "no-store" }),
      fetch(showsUrl, { headers, signal: controller.signal, cache: "no-store" }),
      fetch(moviesUrl, { headers, signal: controller.signal, cache: "no-store" }),
      fetch(historyUrl, { headers, signal: controller.signal, cache: "no-store" }),
    ]);

    clearTimeout(timeoutId);

    let nowWatching: TraktHistoryItem | null = null;
    let recentHistory: TraktHistoryItem[] = PORTFOLIO_DATA.hobbies.cinema?.recentHistory || [];
    let showsList: TraktShowItem[] = [];
    let moviesList: TraktMovieItem[] = [];

    let totalShowsCount = 0;
    let totalEpisodesCount = 0;
    let totalMoviesCount = 0;
    let totalMinutesWatched = 0;

    // Parse Live Watching
    if (watchingRes.status === "fulfilled" && watchingRes.value.status === 200) {
      const liveData = await watchingRes.value.json();
      if (liveData?.type === "episode" && liveData?.episode && liveData?.show) {
        const ep = liveData.episode;
        const sh = liveData.show;
        const posterImg = sh.ids?.trakt
          ? `https://media.trakt.tv/shows/${sh.ids.trakt}/medium/poster.webp`
          : undefined;

        nowWatching = {
          id: ep.ids?.trakt || ep.title,
          type: "episode",
          title: ep.title,
          showTitle: sh.title,
          season: ep.season,
          number: ep.number,
          year: sh.year,
          rating: ep.rating ? Math.round(ep.rating * 10) / 10 : undefined,
          posterUrl: posterImg,
          screenshotUrl: posterImg,
          watchedAt: "Watching Now",
          overview: ep.overview || sh.overview,
          url: `https://trakt.tv/shows/${sh.ids?.slug || "show"}/seasons/${ep.season}/episodes/${ep.number}`,
        };
      } else if (liveData?.type === "movie" && liveData?.movie) {
        const mv = liveData.movie;
        const posterImg = mv.ids?.trakt
          ? `https://media.trakt.tv/movies/${mv.ids.trakt}/medium/poster.webp`
          : undefined;

        nowWatching = {
          id: mv.ids?.trakt || mv.title,
          type: "movie",
          title: mv.title,
          year: mv.year,
          rating: mv.rating ? Math.round(mv.rating * 10) / 10 : undefined,
          posterUrl: posterImg,
          screenshotUrl: posterImg,
          watchedAt: "Watching Now",
          overview: mv.overview,
          url: `https://trakt.tv/movies/${mv.ids?.slug || "movie"}`,
        };
      }
    }

    // Parse Watched Shows
    if (showsRes.status === "fulfilled" && showsRes.value.ok) {
      const rawShows = await showsRes.value.json();
      if (Array.isArray(rawShows)) {
        totalShowsCount = rawShows.length;
        showsList = rawShows.map((s: RawTraktWatchedShow) => {
          const sh = s.show;
          const plays = s.plays || 0;
          totalEpisodesCount += plays;
          const runtime = sh?.runtime || 45;
          totalMinutesWatched += runtime * plays;

          const posterUrl = sh?.ids?.trakt
            ? `https://media.trakt.tv/shows/${sh.ids.trakt}/medium/poster.webp`
            : undefined;
          const fanartUrl = sh?.ids?.trakt
            ? `https://media.trakt.tv/shows/${sh.ids.trakt}/medium/fanart.webp`
            : undefined;

          return {
            id: sh?.ids?.trakt || sh?.title || "trakt-show",
            title: sh?.title || "Unknown Show",
            year: sh?.year,
            plays,
            rating: sh?.rating ? Math.round(sh.rating * 10) / 10 : undefined,
            posterUrl,
            fanartUrl,
            genres: sh?.genres || [],
            network: sh?.network || undefined,
            url: sh?.ids?.slug ? `https://trakt.tv/shows/${sh.ids.slug}` : undefined,
          };
        });
      }
    }

    // Parse Watched Movies
    if (moviesRes.status === "fulfilled" && moviesRes.value.ok) {
      const rawMovies = await moviesRes.value.json();
      if (Array.isArray(rawMovies)) {
        totalMoviesCount = rawMovies.length;
        moviesList = rawMovies.map((m: RawTraktWatchedMovie) => {
          const mv = m.movie;
          const runtime = mv?.runtime || 110;
          totalMinutesWatched += runtime * (m.plays || 1);

          const posterUrl = mv?.ids?.trakt
            ? `https://media.trakt.tv/movies/${mv.ids.trakt}/medium/poster.webp`
            : undefined;

          return {
            id: mv?.ids?.trakt || mv?.title || "trakt-movie",
            title: mv?.title || "Unknown Movie",
            year: mv?.year,
            rating: mv?.rating ? Math.round(mv.rating * 10) / 10 : undefined,
            posterUrl,
            genres: mv?.genres || [],
            url: mv?.ids?.slug ? `https://trakt.tv/movies/${mv.ids.slug}` : undefined,
          };
        });
      }
    }

    // Parse Recent History
    if (historyRes.status === "fulfilled" && historyRes.value.ok) {
      const historyData = await historyRes.value.json();
      if (Array.isArray(historyData) && historyData.length > 0) {
        recentHistory = historyData.map((item: RawTraktHistoryEntry) => {
          if (item.type === "episode" && item.episode && item.show) {
            const ep = item.episode;
            const sh = item.show;
            const posterImg = sh.ids?.trakt
              ? `https://media.trakt.tv/shows/${sh.ids.trakt}/medium/poster.webp`
              : undefined;
            const screenshotImg = ep.images?.screenshot?.[0]
              ? `https://${ep.images.screenshot[0]}`
              : posterImg;

            return {
              id: item.id || ep.ids?.trakt || `${sh.title}-${ep.season}-${ep.number}`,
              type: "episode",
              title: ep.title || `Episode ${ep.number}`,
              showTitle: sh.title,
              season: ep.season,
              number: ep.number,
              year: sh.year,
              rating: ep.rating ? Math.round(ep.rating * 10) / 10 : (sh.rating ? Math.round(sh.rating * 10) / 10 : 7.8),
              posterUrl: posterImg,
              screenshotUrl: screenshotImg,
              watchedAt: item.watched_at
                ? new Date(item.watched_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                : "Recently",
              overview: ep.overview || sh.overview,
              genres: sh.genres || ["Drama"],
              url: `https://trakt.tv/shows/${sh.ids?.slug || "show"}/seasons/${ep.season}/episodes/${ep.number}`,
            };
          } else if (item.type === "movie" && item.movie) {
            const mv = item.movie;
            const posterImg = mv.ids?.trakt
              ? `https://media.trakt.tv/movies/${mv.ids.trakt}/medium/poster.webp`
              : undefined;

            return {
              id: item.id || mv.ids?.trakt || `${mv.title}-${mv.year}`,
              type: "movie",
              title: mv.title,
              year: mv.year,
              rating: mv.rating ? Math.round(mv.rating * 10) / 10 : 8.0,
              posterUrl: posterImg,
              screenshotUrl: posterImg,
              watchedAt: item.watched_at
                ? new Date(item.watched_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                : "Recently",
              overview: mv.overview,
              genres: mv.genres || ["Cinema"],
              url: `https://trakt.tv/movies/${mv.ids?.slug || "movie"}`,
            };
          }

          return {
            id: item.id || "history-item",
            type: "episode",
            title: "Watched Entry",
            watchedAt: "Recently",
          };
        });
      }
    }

    // Determine Dynamic Featured Spotlight (Latest watched show from showsList or fallback)
    const featuredShow = showsList[0];
    const featured = featuredShow
      ? {
          title: featuredShow.title,
          year: featuredShow.year || 2021,
          posterUrl: featuredShow.posterUrl || PORTFOLIO_DATA.hobbies.cinema?.featured?.posterUrl || "",
          bannerUrl: featuredShow.fanartUrl || PORTFOLIO_DATA.hobbies.cinema?.featured?.bannerUrl,
          rating: featuredShow.rating || 8.2,
          genres: featuredShow.genres && featuredShow.genres.length > 0 ? featuredShow.genres : ["Sci-Fi", "Drama"],
          overview: `Completed ${featuredShow.plays} episodes of ${featuredShow.title} on Trakt.`,
          url: featuredShow.url || `https://trakt.tv/shows/${encodeURIComponent(featuredShow.title)}`,
        }
      : PORTFOLIO_DATA.hobbies.cinema?.featured;

    const payload: TraktData = {
      traktUsername: username,
      traktProfileUrl: `https://trakt.tv/users/${encodeURIComponent(username)}`,
      stats: {
        moviesWatched: totalMoviesCount || PORTFOLIO_DATA.hobbies.cinema?.stats.moviesWatched || 48,
        episodesWatched: totalEpisodesCount || PORTFOLIO_DATA.hobbies.cinema?.stats.episodesWatched || 123,
        showsWatched: totalShowsCount || PORTFOLIO_DATA.hobbies.cinema?.stats.showsWatched || 6,
        totalHours: Math.round(totalMinutesWatched / 60) || PORTFOLIO_DATA.hobbies.cinema?.stats.totalHours || 224,
      },
      nowWatching,
      featured,
      recentHistory,
      shows: showsList,
      movies: moviesList,
    };

    return NextResponse.json({
      success: true,
      isLiveSynced: true,
      cinema: payload,
    });
  } catch (error) {
    console.error("Trakt API error:", error);
    return NextResponse.json({
      success: true,
      isLiveSynced: false,
      cinema: PORTFOLIO_DATA.hobbies.cinema,
    });
  }
}
