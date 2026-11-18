import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  let resolvedUrl = targetUrl;

  // Handle mp:external/... Discord proxy format
  if (resolvedUrl.startsWith("mp:external/")) {
    const match = resolvedUrl.match(/https?\/(.*)$/);
    if (match) {
      const protocol = resolvedUrl.includes("/http/") ? "http://" : "https://";
      resolvedUrl = protocol + decodeURIComponent(match[1]);
    } else {
      resolvedUrl = `https://media.discordapp.net/${resolvedUrl.replace("mp:", "")}`;
    }
  } else if (resolvedUrl.includes("%3D") || resolvedUrl.includes("%2F")) {
    try {
      resolvedUrl = decodeURIComponent(resolvedUrl);
    } catch {
      // keep resolvedUrl as is
    }
  }

  try {
    const response = await fetch(resolvedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      // If direct URL failed and it originated from mp:external, try media.discordapp.net as secondary fallback
      if (targetUrl.startsWith("mp:external/")) {
        const fallbackDiscordUrl = `https://media.discordapp.net/${targetUrl.replace("mp:", "")}`;
        const fallbackRes = await fetch(fallbackDiscordUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });
        if (fallbackRes.ok) {
          const buffer = await fallbackRes.arrayBuffer();
          const contentType = fallbackRes.headers.get("content-type") || "image/jpeg";
          return new NextResponse(buffer, {
            status: 200,
            headers: {
              "Content-Type": contentType,
              "Content-Disposition": "inline",
              "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
            },
          });
        }
      }
      return new NextResponse("Failed to fetch image", { status: response.status });
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("Error proxying Discord image:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
