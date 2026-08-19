import { NextResponse } from "next/server";
import { PORTFOLIO_DATA, AnimeItem } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

interface JikanAnimeEntry {
  node?: {
    id?: number;
    title?: string;
    main_picture?: {
      medium?: string;
      large?: string;
    };
    num_episodes?: number;
    genres?: Array<{ name: string }>;
  };
  entry?: {
    mal_id?: number;
    title?: string;
    images?: {
      jpg?: {
        image_url?: string;
        large_image_url?: string;
      };
      webp?: {
        image_url?: string;
        large_image_url?: string;
      };
    };
    url?: string;
  };
  score?: number;
  status?: string;
  episodes_seen?: number;
  num_watched_episodes?: number;
  watched_episodes?: number;
  episodes_total?: number;
  total_episodes?: number;
  updated_at?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || PORTFOLIO_DATA.hobbies.myAnimeListUsername || "Bimbok";

  try {
    // 1. Attempt fetching user's live anime list from Jikan v4 with a 4-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const jikanUrl = `https://api.jikan.moe/v4/users/${encodeURIComponent(username)}/animelist/all`;
    const res = await fetch(jikanUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "MinimalBratikPortfolio/1.0",
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.data) && data.data.length > 0) {
        const mappedAnime: AnimeItem[] = data.data.map((item: JikanAnimeEntry) => {
          const malId = item.entry?.mal_id || item.node?.id || Math.floor(Math.random() * 100000);
          const title = item.entry?.title || item.node?.title || "Anime Title";
          const imageUrl =
            item.entry?.images?.webp?.large_image_url ||
            item.entry?.images?.jpg?.large_image_url ||
            item.entry?.images?.jpg?.image_url ||
            item.node?.main_picture?.large ||
            item.node?.main_picture?.medium ||
            "https://cdn.myanimelist.net/images/anime/1090/144577l.jpg";
          const episodesWatched = item.episodes_seen ?? item.watched_episodes ?? item.num_watched_episodes ?? 0;
          const totalEpisodes = item.episodes_total ?? item.total_episodes ?? item.node?.num_episodes ?? 12;
          const rawStatus = (item.status || "watching").toLowerCase();
          
          let status: "watching" | "completed" | "on_hold" | "plan_to_watch" = "watching";
          if (rawStatus.includes("complete")) status = "completed";
          else if (rawStatus.includes("hold")) status = "on_hold";
          else if (rawStatus.includes("plan")) status = "plan_to_watch";

          return {
            id: malId,
            title,
            imageUrl,
            episodesWatched,
            totalEpisodes: totalEpisodes || 12,
            score: item.score || 8.5,
            status,
            isFavorite: (item.score ?? 0) >= 9 || status === "watching",
            genres: item.node?.genres?.map((g) => g.name) || ["Action", "Anime"],
            url: item.entry?.url || `https://myanimelist.net/anime/${malId}`,
            updatedAt: item.updated_at,
          };
        });

        return NextResponse.json({
          source: "jikan_live",
          username,
          profileUrl: `https://myanimelist.net/profile/${username}`,
          anime: mappedAnime,
        });
      }
    }
  } catch {
    // Graceful silent fallback to curated portfolio dataset
  }

  // Fallback to rich curated offline dataset
  return NextResponse.json({
    source: "curated_fallback",
    username,
    profileUrl: PORTFOLIO_DATA.hobbies.animeProfileUrl,
    anime: PORTFOLIO_DATA.hobbies.anime,
  });
}
