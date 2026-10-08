import { QueryCtx, MutationCtx } from "../_generated/server";

/**
 * Resolves who owns a piece of data.
 *
 * FOUNDATION ONLY: falls back to a browser-generated sessionId so Keel runs
 * with zero setup. Before public launch, wire up Convex Auth and remove the
 * sessionId fallback. This is the only function that needs to change.
 */
export async function ownerKey(
  ctx: QueryCtx | MutationCtx,
  sessionId: string,
): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (identity) return identity.tokenIdentifier;
  if (!sessionId || sessionId.length < 16) {
    throw new Error("Missing session");
  }
  return `session:${sessionId}`;
}
