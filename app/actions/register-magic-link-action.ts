"use server";

import { registerMagicLinkSchema } from "@/app/lib/definitions";
import { createUser } from "@/models/user.server";
import { redirect } from "next/navigation";
import { decrypt, deleteMagicLinkEmail, deleteNonce, createAuthSession } from "../lib/sessions";
import { cookies, headers } from "next/headers";

export async function register(prevState: unknown, formData: FormData) {
  const validatedFields = registerMagicLinkSchema.safeParse({
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { first_name, last_name } = validatedFields.data;

  try {
    const magicLinkEmailCookie = (await cookies()).get('fitizen__magic_link_email')?.value
    const emailPayload = await decrypt(magicLinkEmailCookie)
  
    const data = await createUser(emailPayload?.email as string, first_name, last_name);
    const user = data[0]
    if (user) {
      await deleteMagicLinkEmail();
      await deleteNonce();
      await createAuthSession({ id: user.id });
    }
  } catch (err) {
    console.error("Registration error:", err);
    return {
      server_error: "An unexpected error occurred. Please try again later.",
    };
  }
  redirect("/dashboard");
}