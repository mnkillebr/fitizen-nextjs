import { createAuthSession, createSetupProfile } from "@/app/lib/sessions";
import { createClient } from "@/app/lib/supabase.server";
import { getUserByProvider } from "@/models/user.server";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return redirect("/login?error=Missing authorization code");
  }
  const supabase = await createClient();
  // Exchange the code for an access token and refresh token
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  try {
    const userData = await getUserByProvider(data.user.email!, data.user.id);
    const existingUser = userData[0];

    if (existingUser) {
      // Store the session in a cookie
      // redirect
      await createAuthSession({ id: existingUser.User.id });
      return NextResponse.redirect(`${request.nextUrl.origin}/dashboard`);
    }
    // if no existing user redirect to setup
    await createSetupProfile({ email: data.user.email!, provider: data.user.app_metadata.provider, provider_user_id: data.user.id });
  } catch (error) {
    console.error("Auth callback error:", error);
    redirect(`/login`);
  }
  redirect(`/setup-profile`);
};