import { NextRequest, NextResponse } from "next/server";
import { validateMagicLinkUser } from "@/app/lib/dal";
import { getMagicLinkPayloadByRequest, type MagicLinkPayload } from "@/app/lib/magic-link.server";
import { redirect } from "next/navigation";
import { createSetupProfile } from "@/app/lib/sessions";


export async function GET(request: NextRequest) {
  const magicLinkPayload = await getMagicLinkPayloadByRequest(request) as MagicLinkPayload;
  const user = await validateMagicLinkUser(magicLinkPayload.email);
  if (user) {
    redirect("/dashboard");
  }
  await createSetupProfile({ email: magicLinkPayload.email });
  redirect("/setup-profile");
  // const redirectUrl = `${request.nextUrl.origin}/setup-profile${request.nextUrl.search}`;
  // return NextResponse.redirect(redirectUrl);
}
