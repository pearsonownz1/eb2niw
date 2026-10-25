"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { readPlanId } from "@/lib/plans";
import { safeNextPath } from "@/lib/safe-next";

export type AuthFormState = {
  message: string;
};

function googleMessage(raw: string): string {
  const lowered = raw.toLowerCase();
  if (
    lowered.includes("not enabled") ||
    lowered.includes("unsupported provider") ||
    lowered.includes("provider is not enabled")
  ) {
    return "Google sign-in is not turned on yet. Use email and password, or enable the Google provider in Supabase Auth.";
  }
  return "Google sign-in could not start. Use email and password for now.";
}

async function siteOrigin(): Promise<string> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

function readEmail(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const email = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320) {
    return null;
  }
  return email;
}

function readPassword(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string" || value.length < 8 || value.length > 72) {
    return null;
  }
  return value;
}

export async function signUp(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = readEmail(formData.get("email"));
  const password = readPassword(formData.get("password"));
  if (!email) {
    return { message: "Enter a valid email address." };
  }
  if (!password) {
    return { message: "Use a password of at least 8 characters." };
  }

  const plan = readPlanId(formData.get("plan"));
  const next = plan ? `/checkout?plan=${plan}` : "/dashboard";
  const supabase = await createClient();
  if (!supabase) {
    return { message: "Accounts are unavailable until Supabase is configured." };
  }

  const origin = await siteOrigin();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    const lowered = error.message.toLowerCase();
    if (lowered.includes("already")) {
      return { message: "An account with that email already exists. Log in instead." };
    }
    return { message: "The account could not be created. Check the email and password, then try again." };
  }

  if (data.session) {
    redirect(next);
  }

  return {
    message:
      "Check your email to confirm the account, then log in. To skip that step while testing, turn off Confirm email in Supabase Auth.",
  };
}

export async function signIn(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = readEmail(formData.get("email"));
  const password = formData.get("password");
  if (!email || typeof password !== "string" || password.length < 1) {
    return { message: "Enter your email and password." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { message: "Accounts are unavailable until Supabase is configured." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { message: "That email and password did not match an account." };
  }

  const plan = readPlanId(formData.get("plan"));
  const fallback = plan ? `/checkout?plan=${plan}` : "/dashboard";
  redirect(safeNextPath(formData.get("next"), fallback));
}

export async function signInWithGoogle(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const supabase = await createClient();
  if (!supabase) {
    return { message: "Accounts are unavailable until Supabase is configured." };
  }

  const plan = readPlanId(formData.get("plan"));
  const fallback = plan ? `/checkout?plan=${plan}` : "/dashboard";
  const next = safeNextPath(formData.get("next"), fallback);
  const origin = await siteOrigin();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error || !data.url) {
    return { message: googleMessage(error?.message ?? "") };
  }

  redirect(data.url);
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/");
}
