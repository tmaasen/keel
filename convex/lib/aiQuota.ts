import { MutationCtx } from "../_generated/server";

/**
 * Keeps a donation-funded AI budget safe (see docs/FUNDING.md).
 * Set AI_DAILY_LIMIT in the Convex dashboard to change the per-person cap.
 */
const DEFAULT_DAILY_LIMIT = 10;

export async function consumeAiQuota(ctx: MutationCtx, owner: string) {
  const limit = Number(process.env.AI_DAILY_LIMIT) || DEFAULT_DAILY_LIMIT;
  const day = new Date().toISOString().slice(0, 10);
  const row = await ctx.db
    .query("aiUsage")
    .withIndex("by_owner_day", (q) => q.eq("owner", owner).eq("day", day))
    .unique();
  if (row && row.count >= limit) {
    throw new Error(
      "The guide is resting for today. Everything you've written is safe, and you can keep going on your own.",
    );
  }
  if (row) await ctx.db.patch(row._id, { count: row.count + 1 });
  else await ctx.db.insert("aiUsage", { owner, day, count: 1 });
}
