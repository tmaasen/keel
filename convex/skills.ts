import { v } from "convex/values";
import { action, internalMutation, mutation, query, type MutationCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import { GUIDE_SYSTEM_PROMPT, SKILLS_DRAFT_INSTRUCTIONS } from "./guide";
import { ownerKey } from "./lib/owner";
import { chat } from "./lib/llm";
import { recordAiSpend } from "./lib/aiQuota";

/** "Translate your work": what someone did, in words employers use. */

const MAX_TEXT = 4000;

async function upsert(
  ctx: MutationCtx,
  owner: string,
  fields: { whatIDid: string; skills: string; skillsBy: "person" | "guide_draft" },
) {
  const existing = await ctx.db
    .query("workTranslations")
    .withIndex("by_owner", (q) => q.eq("owner", owner))
    .unique();
  const row = {
    whatIDid: fields.whatIDid.trim().slice(0, MAX_TEXT),
    skills: fields.skills.trim().slice(0, MAX_TEXT),
    skillsBy: fields.skillsBy,
    updatedAt: Date.now(),
  };
  if (existing) await ctx.db.patch(existing._id, row);
  else await ctx.db.insert("workTranslations", { owner, ...row });
}

export const get = query({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    const owner = await ownerKey(ctx, sessionId);
    return await ctx.db
      .query("workTranslations")
      .withIndex("by_owner", (q) => q.eq("owner", owner))
      .unique();
  },
});

export const save = mutation({
  args: {
    sessionId: v.string(),
    whatIDid: v.string(),
    skills: v.string(),
    skillsBy: v.union(v.literal("person"), v.literal("guide_draft")),
  },
  handler: async (ctx, { sessionId, ...fields }) => {
    const owner = await ownerKey(ctx, sessionId);
    await upsert(ctx, owner, fields);
  },
});

/** Ask the guide for a first draft. Saved as a draft the person can edit or replace. */
export const draftWithGuide = action({
  args: { sessionId: v.string(), whatIDid: v.string() },
  handler: async (ctx, { sessionId, whatIDid }): Promise<string> => {
    const described = whatIDid.trim().slice(0, MAX_TEXT);
    if (described.length < 20) throw new Error("Write a little more about what you did first.");
    const owner: string = await ctx.runMutation(internal.missions.authorizeAi, { sessionId });
    const { text, costUsd } = await chat([
      { role: "system", content: `${GUIDE_SYSTEM_PROMPT}\n\n${SKILLS_DRAFT_INSTRUCTIONS}` },
      { role: "user", content: `What I did at work:\n${described}` },
    ]);
    await ctx.runMutation(internal.skills.storeDraft, { owner, whatIDid: described, skills: text, costUsd });
    return text;
  },
});

export const storeDraft = internalMutation({
  args: { owner: v.string(), whatIDid: v.string(), skills: v.string(), costUsd: v.number() },
  handler: async (ctx, { owner, whatIDid, skills, costUsd }) => {
    await recordAiSpend(ctx, costUsd);
    await upsert(ctx, owner, { whatIDid, skills, skillsBy: "guide_draft" });
  },
});
