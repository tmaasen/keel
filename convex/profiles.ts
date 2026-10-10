import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { profileFields, stage } from "./schema";
import { ownerKey } from "./lib/owner";

/** Stage 1: Ground (onboarding). */

const MAX_TEXT = 500;
const clean = (s: string | undefined) => (s === undefined ? undefined : s.trim().slice(0, MAX_TEXT));

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
  args: { sessionId: v.string(), stage: v.optional(stage), ...profileFields },
  handler: async (ctx, { sessionId, ...fields }) => {
    const owner = await ownerKey(ctx, sessionId);
    const patch = {
      ...fields,
      displayName: clean(fields.displayName),
      valuedBy: clean(fields.valuedBy),
      work: fields.work && { role: clean(fields.work.role), yearsBand: clean(fields.work.yearsBand) },
    };
    // Don't overwrite stored values with "undefined" from fields that weren't sent.
    for (const key of Object.keys(patch) as (keyof typeof patch)[]) {
      if (patch[key] === undefined) delete patch[key];
    }

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_owner", (q) => q.eq("owner", owner))
      .unique();
    const updatedAt = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, { ...patch, updatedAt });
      return existing._id;
    }
    return await ctx.db.insert("profiles", {
      owner,
      ...patch,
      stage: patch.stage ?? "ground",
      updatedAt,
    });
  },
});

/** Let someone walk through onboarding again. Their answers are kept as defaults. */
export const restartOnboarding = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    const owner = await ownerKey(ctx, sessionId);
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_owner", (q) => q.eq("owner", owner))
      .unique();
    if (existing) await ctx.db.patch(existing._id, { onboardingCompletedAt: undefined, updatedAt: Date.now() });
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
      feedback: await ctx.db
        .query("feedback")
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
      ...(await ctx.db.query("feedback").withIndex("by_owner", (q) => q.eq("owner", owner)).collect()),
    ];
    for (const row of rows) await ctx.db.delete(row._id);
  },
});
