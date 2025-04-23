import { verifySession } from "@/app/lib/dal";
import { getProgramName } from "@/models/program.server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await verifySession();
  const programName = await getProgramName(request.nextUrl.searchParams.get("id") as string);
  return NextResponse.json(programName);
}