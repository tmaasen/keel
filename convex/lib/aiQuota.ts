import { MutationCtx, QueryCtx } from "../_generated/server";

/**
 * Keeps a donation-funded AI budget safe (see docs/FUNDING.md).
 * Set these in the Convex dashboard:
 *   AI_DAILY_LIMIT          per-person drafts per day (default 10)
 *   AI_MONTHLY_BUDGET_USD   total spend across everyone per month (default: no cap here,
 *                           so set a limit on the OpenRouter key too)
 */
const DEFAULT_DAILY_LIMIT = 10;

export const RESTING_TODAY =
  "The guide is resting for today. Everything you've written is safe, and you can keep going on your own.";
export const RESTING_THIS_MONTH =
  "The guide is resting until next month. Everything you've written is safe, and you can keep going on your own.";

const today = () => new Date().toISOString().slice(0, 10);
const thisMonth = () => new Date().toISOString().slice(0, 7);

async function monthRow(ctx: QueryCtx | MutationCtx) {
  return await ctx.db
    .query("aiSpend")
    .withIndex("by_month", (q) => q.eq("month", thisMonth()))
    .unique();
}

async function dayRow(ctx: QueryCtx | MutationCtx, owner: string) {
  return await ctx.db
    .query("aiUsage")
    .withIndex("by_owner_day", (q) => q.eq("owner", owner).eq("day", today()))
    .unique();
}

/** Why the guide can't help right now, in words for the person, or null if it can. */
export async function aiRestingMessage(ctx: QueryCtx | MutationCtx, owner: string): Promise<string | null> {
  const budget = Number(process.env.AI_MONTHLY_BUDGET_USD);
  if (budget > 0 && ((await monthRow(ctx))?.usd ?? 0) >= budget) return RESTING_THIS_MONTH;
  const limit = Number(process.env.AI_DAILY_LIMIT) || DEFAULT_DAILY_LIMIT;
  if (((await dayRow(ctx, owner))?.count ?? 0) >= limit) return RESTING_TODAY;
  return null;
}

export async function consumeAiQuota(ctx: MutationCtx, owner: string) {
  const resting = await aiRestingMessage(ctx, owner);
  if (resting) throw new Error(resting);
  const row = await dayRow(ctx, owner);
  if (row) await ctx.db.patch(row._id, { count: row.count + 1 });
  else await ctx.db.insert("aiUsage", { owner, day: today(), count: 1 });
}

export async function recordAiSpend(ctx: MutationCtx, costUsd: number) {
  const row = await monthRow(ctx);
  if (row) await ctx.db.patch(row._id, { usd: row.usd + costUsd, calls: row.calls + 1 });
  else await ctx.db.insert("aiSpend", { month: thisMonth(), usd: costUsd, calls: 1 });
}
