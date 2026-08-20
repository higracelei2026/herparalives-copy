import { NextResponse } from "next/server";
export async function POST(request: Request, { params }: { params: Promise<{ runId: string }> }) { const { runId } = await params; const body = await request.json(); return NextResponse.json({ cardId: crypto.randomUUID(), runId, type: body.type === "chapter" ? "chapter" : "ending", status: "saved" }); }
