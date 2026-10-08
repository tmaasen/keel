import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { aiImpact, stage } from "./schema";
import { ownerKey } from "./lib/owner";

/** Stage 1: Ground. */

export const get = query({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    const owner = await ownerKey(ctx, sessionId);
    return await ctx.db
      .query("profiles")
      .withIndex("by_owner", (q) => q.eq("owner", owner))
      .unique();
  },
});

export const upsert = mutation({
  args: {
    sessionId: v.string(),
    displayName: v.optional(v.string()),
    aiImpact: v.optional(aiImpact),
    currentOrRecentWork: v.optional(v.string()),
    stage: v.optional(stage),
  },
  handler: async (ctx, { sessionId, ...fields }) => {
    const owner = await ownerKey(ctx, sessionId);
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_owner", (q) => q.eq("owner", owner))
      .unique();
    const updatedAt = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, { ...fields, updatedAt });
      return existing._id;
    }
    return await ctx.db.insert("profiles", {
      owner,
      ...fields,
      stage: fields.stage ?? "ground",
      updatedAt,
    });
  },
});

/** Manifesto #6: your story is yours. Export everything. */
export const exportAll = query({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    const owner = await ownerKey(ctx, sessionId);
    return {
      exportedAt: new Date().toISOString(),
      profile: await ctx.db
        .query("profiles")
        .withIndex("by_owner", (q) => q.eq("owner", owner))
        .unique(),
      reflections: await ctx.db
        .query("reflections")
        .withIndex("by_owner", (q) => q.eq("owner", owner))
        .collect(),
      values: await ctx.db
        .query("values")
        .withIndex("by_owner", (q) => q.eq("owner", owner))
        .collect(),
      missionStatements: await ctx.db
        .query("missionStatements")
        .withIndex("by_owner", (q) => q.eq("owner", owner))
        .collect(),
    };
  },
});

/** Manifesto #6: delete everything, permanently. */
export const deleteEverything = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    const owner = await ownerKey(ctx, sessionId);
    const rows = [
      ...(await ctx.db.query("profiles").withIndex("by_owner", (q) => q.eq("owner", owner)).collect()),
      ...(await ctx.db.query("reflections").withIndex("by_owner", (q) => q.eq("owner", owner)).collect()),
      ...(await ctx.db.query("values").withIndex("by_owner", (q) => q.eq("owner", owner)).collect()),
      ...(await ctx.db.query("missionStatements").withIndex("by_owner", (q) => q.eq("owner", owner)).collect()),
    ];
    for (const row of rows) await ctx.db.delete(row._id);
  },
});
