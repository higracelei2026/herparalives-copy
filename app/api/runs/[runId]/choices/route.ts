import { idempotencyKeys, runtimeRuns } from "@/lib/server/runtime";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ runId: string }> }) { const { runId } = await params; const key = request.headers.get("idempotency-key"); if (!key) return NextResponse.json({ error: "idempotency_key_required" }, { status: 400 }); if (idempotencyKeys.has(key)) return NextResponse.json({ accepted: true, duplicate: true }); idempotencyKeys.add(key); const body = await request.json(); const run = runtimeRuns.get(runId); if (run) runtimeRuns.set(runId, { ...run, updatedAt: Date.now() }); return NextResponse.json({ accepted: true, duplicate: false, choiceId: body.choiceId }); }
