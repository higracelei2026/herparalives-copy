import { presets } from "@/lib/presets";
import { NextResponse } from "next/server";
export async function GET() { return NextResponse.json({ version: "demo-2026.08.19", presets }); }
