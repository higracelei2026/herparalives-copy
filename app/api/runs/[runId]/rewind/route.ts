import { runtimeRuns } from "@/lib/server/runtime";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ runId: string }> }) { const { runId } = await params; const body = await request.json(); const source = runtimeRuns.get(runId); if (!source) return NextResponse.json({ error: "run_not_found" }, { status: 404 }); const next = { ...source, id: crypto.randomUUID(), branch: source.branch + 1, currentIndex: Number(body.nodeIndex || 0), choices: source.choices.slice(0, Number(body.nodeIndex || 0)), finished: false, updatedAt: Date.now() }; runtimeRuns.set(next.id, next); return NextResponse.json({ run: next }); }
