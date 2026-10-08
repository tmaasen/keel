import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { PROMPTS } from "./journey";
import { ownerKey } from "./lib/owner";

/** Stages 1 & 2: free-text reflections on journey prompts. */

export const list = query({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    const owner = await ownerKey(ctx, sessionId);
    return await ctx.db
      .query("reflections")
      .withIndex("by_owner", (q) => q.eq("owner", owner))
      .collect();
  },
});

export const save = mutation({
  args: { sessionId: v.string(), promptId: v.string(), response: v.string() },
  handler: async (ctx, { sessionId, promptId, response }) => {
    const owner = await ownerKey(ctx, sessionId);
    const prompt = PROMPTS.find((p) => p.id === promptId);
    if (!prompt) throw new Error(`Unknown prompt: ${promptId}`);

    const existing = await ctx.db
      .query("reflections")
      .withIndex("by_owner_prompt", (q) => q.eq("owner", owner).eq("promptId", promptId))
      .unique();

    const trimmed = response.trim();
    if (existing && !trimmed) {
      await ctx.db.delete(existing._id); // skipping a prompt is always OK
      return null;
    }
    if (existing) {
      await ctx.db.patch(existing._id, { response: trimmed, updatedAt: Date.now() });
      return existing._id;
    }
    if (!trimmed) return null;
    return await ctx.db.insert("reflections", {
      owner,
      stage: prompt.stage,
      promptId,
      response: trimmed,
      updatedAt: Date.now(),
    });
  },
});
