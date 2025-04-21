import { sendEmail } from "./emails";
import { magicLinkEmailTemplate } from "./email-templates";
import { NextRequest, NextResponse } from "next/server";
import { encrypt, decrypt } from "./sessions";
import { MAGIC_LINK_MAX_AGE } from "@/lib/magicNumbers";
import { MagicLinkPayload } from "./definitions";


const { NODE_ENV, ORIGIN } = process.env


export async function generateMagicLink(email: string, nonce: string) {
  const payload: MagicLinkPayload = {
    email,
    nonce,
    createdAt: new Date().toISOString(),
  };
  const encryptedPayload = await encrypt(payload);
  if (typeof ORIGIN !== "string") {
    throw new Error("Missing env: ORIGIN");
  }
  const url = new URL(ORIGIN);
  url.pathname = "/validate-magic-link";
  url.searchParams.set("magic", encryptedPayload);
  return url.toString();
};


function isMagicLinkPayload(value: any): value is MagicLinkPayload {
  return (
    typeof value === "object" &&
    typeof value.email === "string" &&
    typeof value.nonce === "string" &&
    typeof value.createdAt === "string"
  )
};


export async function invalidMagicLink(message: string, request: NextRequest) {
  return NextResponse.redirect(`${request.nextUrl.origin}/login`, {
    headers: {
      "Set-Cookie": `fitizen__magic_link_error=${message}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=15`,
    },
  })
};


export async function getMagicLinkPayloadByRequest(request: NextRequest) {
  const url = new URL(request.url);
  const magic = url.searchParams.get("magic") as string;
  
  if (typeof magic !== "string") {
    return invalidMagicLink("'magic' search parameter does not exist", request);
  }

  const magicLinkPayload = await decrypt(magic);
  if (!isMagicLinkPayload(magicLinkPayload)) {
    return invalidMagicLink("invalid magic link payload", request);
  }
  return magicLinkPayload;
};


export async function getMagicLinkPayloadByString(magic: string) {
  if (typeof magic !== "string") {
    const message = "'magic' search parameter does not exist"
    return NextResponse.redirect(`${process.env.ORIGIN}/login`, {
      headers: {
        "Set-Cookie": `fitizen__magic_link_error=${encodeURIComponent(message)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=15`,
      },
    })
  }

  const magicLinkPayload = await decrypt(magic);
  if (!isMagicLinkPayload(magicLinkPayload)) {
    const message = "invalid magic link payload"
    return NextResponse.redirect(`${process.env.ORIGIN}/login`, {
      headers: {
        "Set-Cookie": `fitizen__magic_link_error=${encodeURIComponent(message)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=15`,
      },
    })
  }

  // Check magic link expiration
  const createdAt = new Date(magicLinkPayload.createdAt);
  const expiresAt = createdAt.getTime() + MAGIC_LINK_MAX_AGE;

  if (Date.now() > expiresAt) {
    const message = "The magic link has expired"
    return NextResponse.redirect(`${process.env.ORIGIN}/login`, {
      headers: {
        "Set-Cookie": `fitizen__magic_link_error=${encodeURIComponent(message)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=15`,
      },
    })
  }
  return magicLinkPayload;
};


export async function sendMagicLinkEmail(link: string, email: string) {
  if (NODE_ENV === "production") {
    const html = magicLinkEmailTemplate(link);
    return sendEmail({
      from: "Fitizen <coach.mkillebrew@gmail.com>",
      to: [email],
      subject: "Log in to Fitizen",
      html,
    });
  } else {
    console.log(link);
    return link;
  }
}