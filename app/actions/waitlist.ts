"use server";

import { createClient } from "@/lib/supabase/server";
import {
  idleWaitlistState,
  waitlistSavedMessage,
  type WaitlistState,
} from "@/lib/waitlist";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const notConfigured: WaitlistState = {
  status: "error",
  message:
    "Email signup is not available yet. Supabase is not configured on this deployment.",
};

export async function joinWaitlist(
  previous: WaitlistState = idleWaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  void previous;
  const honeypot = formData.get("company");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { status: "success", message: waitlistSavedMessage };
  }

  const rawEmail = formData.get("email");
  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

  if (
    email.length < 6 ||
    email.length > 320 ||
    !EMAIL_PATTERN.test(email)
  ) {
    return { status: "error", message: "Enter a valid email address." };
  }

  try {
    const supabase = await createClient();
    if (!supabase) {
      return notConfigured;
    }

    const { error } = await supabase.from("waitlist").insert({ email });

    if (error) {
      console.error("waitlist insert failed", error.code ?? "unknown");

      if (error.code === "23505") {
        return {
          status: "error",
          message: "That email is already on the list.",
        };
      }

      if (error.code === "23514") {
        return { status: "error", message: "Enter a valid email address." };
      }

      return {
        status: "error",
        message: "We could not save your email. Please try again later.",
      };
    }
  } catch {
    console.error("waitlist insert failed", "exception");
    return {
      status: "error",
      message: "We could not save your email. Please try again later.",
    };
  }

  return { status: "success", message: waitlistSavedMessage };
}
