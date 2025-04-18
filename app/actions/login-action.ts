"use server";

import { cookies } from "next/headers";

import { redirect } from "next/navigation";
import { loginSchema } from "@/app/lib/definitions";
import { v4 as uuid } from "uuid";
import { createNonce } from "@/app/lib/sessions";
import { sendMagicLinkEmail } from "../lib/magic-link.server";
import { generateMagicLink } from "../lib/magic-link.server";

export async function login(prevState: unknown, formData: FormData) {
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email") as string,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email } = validatedFields.data;

  try {
    const nonce = uuid();
    const magicLink = await generateMagicLink(email, nonce)
    await sendMagicLinkEmail(magicLink, email);
    await createNonce(nonce)
    return {
      success: "Magic link sent to email",
    };
  } catch (err) {
    console.error("Login error:", err);
    return {
      server_error: "An unexpected error occurred. Please try again later.",
    };
  }
  // redirect("/dashboard");
}