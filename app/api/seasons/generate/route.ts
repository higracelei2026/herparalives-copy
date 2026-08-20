import { NextResponse } from "next/server";
export async function POST() { return NextResponse.json({ jobId: crypto.randomUUID(), status: "first_chapter_ready", chapters: 5, provider: process.env.DASHSCOPE_API_KEY ? "bailian" : "safe-template" }); }
