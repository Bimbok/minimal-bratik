import { NextResponse } from "next/server";
import { PORTFOLIO_DATA, AnimeItem } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

interface MALDirectEntry {
  status: number; // 1 = watching, 2 = completed, 3 = on_hold, 4 = dropped, 6 = plan_to_watch
  score: number;
  num_watched_episodes: number;
  anime_title: string;
  anime_title_eng?: string;
  anime_num_episodes: number;
  anime_id: number;
  anime_score_val?: number;
  genres?: Array<{ id: number; name: string }>;
  anime_url?: string;
  anime_image_path?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || PORTFOLIO_DATA.hobbies.myAnimeListUsername || "Bimbok";

  try {
    // 1. Fetch live anime list directly from MyAnimeList
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const malDirectUrl = `https://myanimelist.net/animelist/${encodeURIComponent(username)}/load.json?status=7&offset=0`;
    const res = await fetch(malDirectUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json, text/javascript, */*; q=0.01",
        Referer: `https://myanimelist.net/animelist/${encodeURIComponent(username)}`,
      },
      next: { revalidate: 120 }, // Revalidate every 2 minutes for fresh updates
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data: MALDirectEntry[] = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const mappedAnime: AnimeItem[] = data.map((item) => {
          const malId = item.anime_id;
          const title = item.anime_title || "Anime Title";
          const titleEnglish = item.anime_title_eng || item.anime_title;
          const score = item.score > 0 ? item.score : (item.anime_score_val || 8.0);
          const episodesWatched = item.num_watched_episodes || 0;
          const totalEpisodes = item.anime_num_episodes || 12;

          let status: "watching" | "completed" | "on_hold" | "plan_to_watch" = "completed";
          if (item.status === 1) status = "watching";
          else if (item.status === 3) status = "on_hold";
          else if (item.status === 6) status = "plan_to_watch";

          // Extract exact full-resolution MAL CDN image URL
          const rawImg = item.anime_image_path || "";
          const fullMalImageUrl = rawImg
            ? rawImg.replace(/\/r\/\d+x\d+/, "").split("?")[0]
            : "";
          const imageUrl = fullMalImageUrl || rawImg;

          return {
            id: malId,
            title,
            titleEnglish,
            imageUrl,
            episodesWatched,
            totalEpisodes,
            score,
            status,
            isFavorite: score >= 9 || status === "watching",
            genres: (item.genres || []).map((g) => g.name),
            url: `https://myanimelist.net/anime/${malId}`,
          };
        });

        // Sort: Watching items first, then highest score
        mappedAnime.sort((a, b) => {
          if (a.status === "watching" && b.status !== "watching") return -1;
          if (b.status === "watching" && a.status !== "watching") return 1;
          return b.score - a.score;
        });

        // Dynamically compute live statistics directly from the user's MAL list
        const totalEps = mappedAnime.reduce((sum, a) => sum + (a.episodesWatched || 0), 0);
        const scoredItems = mappedAnime.filter((a) => a.score > 0);
        const meanScore = scoredItems.length > 0
          ? parseFloat((scoredItems.reduce((sum, a) => sum + a.score, 0) / scoredItems.length).toFixed(2))
          : 8.47;
        const daysWatched = parseFloat(((totalEps * 24) / (60 * 24)).toFixed(1));

        return NextResponse.json({
          source: "myanimelist_live",
          username,
          profileUrl: `https://myanimelist.net/profile/${username}`,
          stats: {
            daysWatched,
            meanScore,
            totalEntries: mappedAnime.length,
            episodesWatched: totalEps,
            watching: mappedAnime.filter((a) => a.status === "watching").length,
            completed: mappedAnime.filter((a) => a.status === "completed").length,
          },
          anime: mappedAnime,
        });
      }
    }
  } catch {
    // Graceful fallback
  }

  // Fallback to portfolio dataset
  return NextResponse.json({
    source: "curated_fallback",
    username,
    profileUrl: PORTFOLIO_DATA.hobbies.animeProfileUrl,
    stats: PORTFOLIO_DATA.hobbies.stats,
    anime: PORTFOLIO_DATA.hobbies.anime,
  });
}
