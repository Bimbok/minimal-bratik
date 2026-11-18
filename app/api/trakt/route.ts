import { NextResponse } from "next/server";
import { PORTFOLIO_DATA, TraktData, TraktHistoryItem } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

interface RawTraktHistoryItem {
  id: number | string;
  watched_at: string;
  action: string;
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
    ids?: { slug?: string };
  };
  movie?: {
    title: string;
    year?: number;
    rating?: number;
    overview?: string;
    genres?: string[];
    images?: { poster?: string[]; fanart?: string[] };
    ids?: { slug?: string; trakt?: number };
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
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    // 1. Live Watching (200 = currently playing, 204 = idle)
    const watchingUrl = `https://api.trakt.tv/users/${encodeURIComponent(username)}/watching`;

    // 2. Full History with posters & screenshots
    const historyUrl = `https://api.trakt.tv/users/${encodeURIComponent(username)}/history?extended=full&limit=15`;

    // 3. Lifetime Stats
    const statsUrl = `https://api.trakt.tv/users/${encodeURIComponent(username)}/stats`;

    const [watchingRes, historyRes, statsRes] = await Promise.allSettled([
      fetch(watchingUrl, { headers, signal: controller.signal, cache: "no-store" }),
      fetch(historyUrl, { headers, signal: controller.signal, cache: "no-store" }),
      fetch(statsUrl, { headers, signal: controller.signal, next: { revalidate: 300 } }),
    ]);

    clearTimeout(timeoutId);

    let nowWatching: TraktHistoryItem | null = null;
    let recentHistory: TraktHistoryItem[] = PORTFOLIO_DATA.hobbies.cinema?.recentHistory || [];
    let moviesCount = PORTFOLIO_DATA.hobbies.cinema?.stats.moviesWatched || 0;
    let episodesCount = PORTFOLIO_DATA.hobbies.cinema?.stats.episodesWatched || 16;
    let showsCount = PORTFOLIO_DATA.hobbies.cinema?.stats.showsWatched || 1;
    let totalHours = PORTFOLIO_DATA.hobbies.cinema?.stats.totalHours || 13;

    // Parse Live Watching
    if (watchingRes.status === "fulfilled" && watchingRes.value.status === 200) {
      const liveData = await watchingRes.value.json();
      if (liveData?.type === "episode" && liveData?.episode && liveData?.show) {
        const ep = liveData.episode;
        const sh = liveData.show;
        const posterImg = sh.images?.poster?.[0] ? `https://${sh.images.poster[0]}` : undefined;
        const screenshotImg = ep.images?.screenshot?.[0] ? `https://${ep.images.screenshot[0]}` : undefined;

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
          screenshotUrl: screenshotImg || posterImg,
          watchedAt: "Watching Now",
          overview: ep.overview || sh.overview,
          url: `https://trakt.tv/shows/${sh.ids?.slug || "show"}/seasons/${ep.season}/episodes/${ep.number}`,
        };
      } else if (liveData?.type === "movie" && liveData?.movie) {
        const mv = liveData.movie;
        const posterImg = mv.images?.poster?.[0] ? `https://${mv.images.poster[0]}` : undefined;

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

    // Parse History
    if (historyRes.status === "fulfilled" && historyRes.value.ok) {
      const historyData = await historyRes.value.json();
      if (Array.isArray(historyData) && historyData.length > 0) {
        recentHistory = historyData.map((item: RawTraktHistoryItem) => {
          if (item.type === "episode" && item.episode && item.show) {
            const ep = item.episode;
            const sh = item.show;
            const posterImg = sh.images?.poster?.[0] ? `https://${sh.images.poster[0]}` : undefined;
            const screenshotImg = ep.images?.screenshot?.[0] ? `https://${ep.images.screenshot[0]}` : undefined;

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
              screenshotUrl: screenshotImg || posterImg,
              watchedAt: item.watched_at ? new Date(item.watched_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Recently",
              overview: ep.overview || sh.overview,
              genres: sh.genres || ["Drama", "Thriller"],
              url: `https://trakt.tv/shows/${sh.ids?.slug || "show"}/seasons/${ep.season}/episodes/${ep.number}`,
            };
          } else if (item.type === "movie" && item.movie) {
            const mv = item.movie;
            const posterImg = mv.images?.poster?.[0] ? `https://${mv.images.poster[0]}` : undefined;

            return {
              id: item.id || mv.ids?.trakt || `${mv.title}-${mv.year}`,
              type: "movie",
              title: mv.title,
              year: mv.year,
              rating: mv.rating ? Math.round(mv.rating * 10) / 10 : 8.0,
              posterUrl: posterImg,
              screenshotUrl: posterImg,
              watchedAt: item.watched_at ? new Date(item.watched_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Recently",
              overview: mv.overview,
              genres: mv.genres || ["Cinema"],
              url: `https://trakt.tv/movies/${mv.ids?.slug || "movie"}`,
            };
          }

          return {
            id: item.id,
            type: "episode",
            title: "Watched Entry",
            watchedAt: "Recently",
          };
        });
      }
    }

    // Parse Stats
    if (statsRes.status === "fulfilled" && statsRes.value.ok) {
      const statsData = await statsRes.value.json();
      if (statsData) {
        if (statsData.movies?.watched !== undefined) moviesCount = statsData.movies.watched;
        if (statsData.episodes?.watched !== undefined) episodesCount = statsData.episodes.watched;
        if (statsData.shows?.watched !== undefined) showsCount = statsData.shows.watched;
        if (statsData.episodes?.minutes) totalHours = Math.round(statsData.episodes.minutes / 60);
      }
    }

    const payload: TraktData = {
      traktUsername: username,
      traktProfileUrl: `https://trakt.tv/users/${encodeURIComponent(username)}`,
      stats: {
        moviesWatched: moviesCount,
        episodesWatched: episodesCount || recentHistory.filter(h => h.type === "episode").length,
        showsWatched: showsCount || 1,
        totalHours: totalHours || 13,
      },
      nowWatching,
      featured: PORTFOLIO_DATA.hobbies.cinema?.featured,
      recentHistory,
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
