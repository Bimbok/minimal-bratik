import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    // Dynamically retrieve ADMIN_PASSWORD from process.env (.env or .env.local)
    const expectedPassword =
      process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (!expectedPassword) {
      return NextResponse.json(
        { success: false, error: "ADMIN_PASSWORD is not configured in .env" },
        { status: 500 }
      );
    }

    if (typeof password === "string" && password.trim() === expectedPassword.trim()) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Invalid admin password" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request payload" },
      { status: 400 }
    );
  }
}
