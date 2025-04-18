"use server";

import { registerWithEmailSchema } from "@/app/lib/definitions";
import { createUser, createUserWithProvider } from "@/models/user.server";
import { redirect } from "next/navigation";
import { decrypt, deleteSetupProfile, deleteNonce, createAuthSession } from "../lib/sessions";
import { cookies, headers } from "next/headers";

export async function registerWithEmail(prevState: unknown, formData: FormData) {
  const validatedFields = registerWithEmailSchema.safeParse({
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
    const setupProfileCookie = (await cookies()).get('fitizen__setup_profile')?.value
    const setupProfilePayload = await decrypt(setupProfileCookie)
  
    let user
    if (setupProfilePayload?.provider) {
      const userWithProviderData = await createUserWithProvider(setupProfilePayload?.email as string, first_name, last_name, setupProfilePayload?.provider as string, setupProfilePayload?.provider_user_id as string);
      user = userWithProviderData.user
    } else {
      const userData = await createUser(setupProfilePayload?.email as string, first_name, last_name);
      user = userData[0]
    }

    if (user) {
      await deleteSetupProfile();
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