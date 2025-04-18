import { NextRequest, NextResponse } from "next/server";
import { validateMagicLinkUser } from "@/app/lib/dal";
import { getMagicLinkPayloadByRequest, type MagicLinkPayload } from "@/app/lib/magic-link.server";
import { redirect } from "next/navigation";
import { createMagicLinkEmail } from "@/app/lib/sessions";


export async function GET(request: NextRequest) {
  const magicLinkPayload = await getMagicLinkPayloadByRequest(request) as MagicLinkPayload;
  const user = await validateMagicLinkUser(magicLinkPayload.email);
  if (user) {
    redirect("/dashboard");
  }
  await createMagicLinkEmail(magicLinkPayload.email);
  const redirectUrl = `${request.nextUrl.origin}/validate-magic-link${request.nextUrl.search}`;
  return NextResponse.redirect(redirectUrl);
}
