/** Convex wraps server errors; show only the human-readable part. */
export function humanError(e: unknown): string {
  const msg = e instanceof Error ? e.message : "";
  return msg.split("Uncaught Error: ").pop()?.split("\n")[0] || "Something went wrong. Try again in a moment.";
}
