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
  // Clean file title
  const clean = fileTitle.replace(/\.pdf$/i, "").trim();
  
  // Extract version string if present (e.g. v5.3, v5, v4, etc.)
  const versionMatch = clean.match(/v\d+(\.\d+)?/i);
  const versionStr = versionMatch ? versionMatch[0].toLowerCase() : "";

  // Strip prefix like "Bratik Mukherjee" or "Bratik_Mukherjee"
  let stripped = clean
    .replace(/^Bratik[_ ]Mukherjee[_ ]?/i, "")
    .replace(/_/g, " ")
    .trim();

  // If stripped becomes empty, fallback to clean
  if (!stripped) stripped = clean.replace(/_/g, " ");

  // Capitalize words properly
  const formattedTitle = stripped
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  let tag = "PDF";
  let name = formattedTitle;

  if (versionStr) {
    if (versionStr.includes("v5")) {
      if (/fullstack/i.test(stripped)) {
        tag = "v5 Fullstack";
        name = "v5.3 - Fullstack Engineer";
      } else if (/backend/i.test(stripped)) {
        tag = "v5 Backend";
        name = "v5.2 - Backend Engineer";
      } else if (/frontend/i.test(stripped)) {
        tag = "v5 Frontend";
        name = "v5.1 - Frontend Engineer";
      } else if (/data/i.test(stripped)) {
        tag = "v5 Data Eng";
        name = "v5.0 - Data Engineer";
      } else if (/gameberry/i.test(stripped)) {
        tag = "v5 Gameberry";
        name = "v5.0 - Gameberry Systems";
      } else if (/image/i.test(stripped)) {
        tag = "v5 Visual";
        name = "v5.0 - Visual Photo Resume";
      } else {
        tag = `${versionStr.toUpperCase()} Resume`;
        name = formattedTitle;
      }
    } else if (versionStr.includes("v4")) {
      tag = "v4 Analytics";
      name = `v4.0 - ${formattedTitle.replace(/^V4\s*/i, "")}`;
    } else if (versionStr.includes("v3")) {
      tag = "v3 Systems";
      name = `v3.0 - ${formattedTitle.replace(/^V3\s*/i, "")}`;
    } else if (versionStr.includes("v2")) {
      tag = "v2 Legacy";
      name = "v2.0 - Core Fullstack";
    } else if (versionStr.includes("v1")) {
      tag = "v1 Initial";
      name = "v1.0 - Foundation Resume";
    } else {
      tag = `${versionStr.toUpperCase()} Version`;
      name = formattedTitle;
    }
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
