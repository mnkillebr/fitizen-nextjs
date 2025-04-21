import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getMagicLinkPayloadByRequest, invalidMagicLink } from "./app/lib/magic-link.server";
import { MAGIC_LINK_MAX_AGE } from "./lib/magicNumbers";
import { cookies } from "next/headers";
import { decrypt } from "./app/lib/sessions";
import { MagicLinkPayload } from "./app/lib/definitions";
export async function middleware(request: NextRequest) {
  const magicLinkPayload = await getMagicLinkPayloadByRequest(request) as MagicLinkPayload;
  
  // Check magic link expiration
  const createdAt = new Date(magicLinkPayload.createdAt);
  const expiresAt = createdAt.getTime() + MAGIC_LINK_MAX_AGE;

  if (Date.now() > expiresAt) {
    return invalidMagicLink("The magic link has expired", request);
  }

  // Validate magic link nonce
  const cookieStore = await cookies()
  const nonce = cookieStore.get('fitizen__nonce')
  const noncePayload = await decrypt(nonce?.value)
  if (!noncePayload) {
    return invalidMagicLink("The magic link has expired", request);
  }
  if (noncePayload.nonce !== magicLinkPayload.nonce) {
    return invalidMagicLink("The magic link is invalid", request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/validate-magic-link"],
};