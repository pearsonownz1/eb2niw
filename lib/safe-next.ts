/** Only same-site paths. Reject protocol-relative and off-site targets. */
export function safeNextPath(value: unknown, fallback: string): string {
  if (typeof value !== "string") {
    return fallback;
  }
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\") || value.includes("\n")) {
    return fallback;
  }
  return value;
}
