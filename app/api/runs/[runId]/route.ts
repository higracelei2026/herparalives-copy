import { runtimeMode, runtimeRuns } from "@/lib/server/runtime";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ runId: string }> }) { const { runId } = await params; const run = runtimeRuns.get(runId); if (!run) return NextResponse.json({ error: "run_not_found", storage: runtimeMode() }, { status: 404 }); return NextResponse.json({ run, storage: runtimeMode() }); }
