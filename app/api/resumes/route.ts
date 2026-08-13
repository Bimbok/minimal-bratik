import { NextResponse } from "next/server";

export interface ResumeDriveFile {
  id: string;
  name: string;
  tag: string;
  fileTitle: string;
}

// In-memory cache for fast response times
let cachedResumes: ResumeDriveFile[] | null = null;
let lastFetchTime = 0;

const FOLDER_ID = "1jrQeaxm-0_bdUqakMt73KvuC6j-t6Mbl";

function parseTitleToTagAndName(fileTitle: string): { name: string; tag: string } {
  const cleanTitle = fileTitle.replace(/\.pdf$/i, "").replace(/_/g, " ");

  let tag = "PDF";
  let name = cleanTitle;

  if (/v5/i.test(cleanTitle)) {
    if (/fullstack/i.test(cleanTitle)) {
      tag = "v5 Fullstack";
      name = "v5.3 - Fullstack Engineer";
    } else if (/backend/i.test(cleanTitle)) {
      tag = "v5 Backend";
      name = "v5.2 - Backend Engineer";
    } else if (/frontend/i.test(cleanTitle)) {
      tag = "v5 Frontend";
      name = "v5.1 - Frontend Engineer";
    } else if (/data/i.test(cleanTitle)) {
      tag = "v5 Data Eng";
      name = "v5.0 - Data Engineer";
    } else if (/gameberry/i.test(cleanTitle)) {
      tag = "v5 Gameberry";
      name = "v5.0 - Gameberry Systems";
    } else if (/image/i.test(cleanTitle)) {
      tag = "v5 Visual";
      name = "v5.0 - Visual Photo Resume";
    } else {
      tag = "v5 Resume";
      name = cleanTitle;
    }
  } else if (/v4/i.test(cleanTitle)) {
    tag = "v4 Resume";
    name = cleanTitle;
  } else if (/v3/i.test(cleanTitle)) {
    tag = "v3 Resume";
    name = cleanTitle;
  } else if (/v2/i.test(cleanTitle)) {
    tag = "v2 Legacy";
    name = cleanTitle;
  } else if (/v1/i.test(cleanTitle)) {
    tag = "v1 Initial";
    name = cleanTitle;
  }

  return { name, tag };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get("refresh") === "true";
  const now = Date.now();

  // Return cached result if available and fresh (less than 60s)
  if (!forceRefresh && cachedResumes && now - lastFetchTime < 60000) {
    return NextResponse.json({ success: true, resumes: cachedResumes, cached: true });
  }

  try {
    const folderUrl = `https://drive.google.com/drive/folders/${FOLDER_ID}`;
    const res = await fetch(folderUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch Google Drive folder: ${res.statusText}`);
    }

    const html = await res.text();
    const rawIds = Array.from(new Set(html.match(/"([a-zA-Z0-9_-]{33})"/g) || []))
      .map((s) => s.replace(/"/g, ""))
      .filter((id) => id !== FOLDER_ID);

    const items: ResumeDriveFile[] = [];

    // Fetch titles for each file ID concurrently (up to 15 files)
    const fetchPromises = rawIds.slice(0, 20).map(async (fid) => {
      try {
        const furl = `https://drive.google.com/file/d/${fid}/view`;
        const fres = await fetch(furl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        });
        const fhtml = await fres.text();
        const match = fhtml.match(/<title>(.*?)<\/title>/i);

        if (match && match[1] && match[1].toLowerCase().includes("pdf")) {
          const fileTitle = match[1].replace(/ - Google Drive/i, "").trim();
          const { name, tag } = parseTitleToTagAndName(fileTitle);
          return {
            id: fid,
            name,
            tag,
            fileTitle,
          };
        }
      } catch {
        // Skip failed items
      }
      return null;
    });

    const results = await Promise.all(fetchPromises);
    for (const item of results) {
      if (item && !items.some((existing) => existing.id === item.id)) {
        items.push(item);
      }
    }

    // Sort items descending by version/name
    items.sort((a, b) => b.fileTitle.localeCompare(a.fileTitle));

    if (items.length > 0) {
      cachedResumes = items;
      lastFetchTime = now;
    }

    return NextResponse.json({
      success: true,
      resumes: items.length > 0 ? items : cachedResumes || [],
      count: items.length,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to scan Google Drive";
    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
        resumes: cachedResumes || [],
      },
      { status: 500 }
    );
  }
}
