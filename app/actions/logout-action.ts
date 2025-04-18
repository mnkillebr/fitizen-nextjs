"use server";

import { redirect } from "next/navigation";
import { deleteAuthSession } from "../lib/sessions";

export async function logout() {
  await deleteAuthSession();
  redirect(`/`);
}