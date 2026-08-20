import { NextResponse } from "next/server";
export async function POST(_: Request, { params }: { params: Promise<{ runId: string }> }) { const { runId } = await params; if (!process.env.CLOUDBASE_ENV_ID) return NextResponse.json({ runId, bound: false, reason: "cloudbase_not_configured" }, { status: 503 }); return NextResponse.json({ runId, bound: true }); }
