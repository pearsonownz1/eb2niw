export type WaitlistState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const idleWaitlistState: WaitlistState = {
  status: "idle",
  message: "",
};

export const waitlistSavedMessage =
  "Thanks. Your email is saved for updates when this site has something new to send.";
