import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { VALUES_CATALOG } from "./valuesCatalog";
import { ownerKey } from "./lib/owner";

/** Stage 2: Discover. A person's chosen values, ranked. */

export const MAX_CORE_VALUES = 5;

export const catalog = query({
  args: {},
  handler: async () => VALUES_CATALOG,
});

export const list = query({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    const owner = await ownerKey(ctx, sessionId);
    const rows = await ctx.db
      .query("values")
      .withIndex("by_owner", (q) => q.eq("owner", owner))
      .collect();
    return rows.sort((a, b) => a.rank - b.rank);
  },
});

/** Replace the person's ranked values in one go (order = rank). */
export const setRanked = mutation({
  args: {
    sessionId: v.string(),
    values: v.array(
      v.object({
        name: v.string(),
        catalogId: v.optional(v.string()),
        whyItMatters: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, { sessionId, values }) => {
    const owner = await ownerKey(ctx, sessionId);
    if (values.length > MAX_CORE_VALUES) {
      throw new Error(`Choose up to ${MAX_CORE_VALUES} core values`);
    }
    const existing = await ctx.db
      .query("values")
      .withIndex("by_owner", (q) => q.eq("owner", owner))
      .collect();
    for (const row of existing) await ctx.db.delete(row._id);

    for (const [i, value] of values.entries()) {
      const name = value.name.trim();
      if (!name) continue;
      await ctx.db.insert("values", {
        owner,
        name,
        catalogId: value.catalogId,
        whyItMatters: value.whyItMatters?.trim() || undefined,
        rank: i + 1,
      });
    }
  },
});
