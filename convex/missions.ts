import { v } from "convex/values";
import { action, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { GUIDE_SYSTEM_PROMPT, MISSION_DRAFT_INSTRUCTIONS } from "./guide";
import { PROMPTS } from "./journey";
import { ownerKey } from "./lib/owner";
import { chat } from "./lib/llm";
import { consumeAiQuota } from "./lib/aiQuota";
import { profileSummary } from "./lib/profileSummary";

/** Stage 3: Declare. Versioned mission statements; exactly one may be accepted. */

export const list = query({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    const owner = await ownerKey(ctx, sessionId);
    const rows = await ctx.db
      .query("missionStatements")
      .withIndex("by_owner", (q) => q.eq("owner", owner))
      .collect();
    return rows.sort((a, b) => b.version - a.version);
  },
});

export const saveDraft = mutation({
  args: {
    sessionId: v.string(),
    text: v.string(),
    authoredBy: v.union(v.literal("person"), v.literal("guide_draft")),
  },
  handler: async (ctx, { sessionId, text, authoredBy }) => {
    const owner = await ownerKey(ctx, sessionId);
    const existing = await ctx.db
      .query("missionStatements")
      .withIndex("by_owner", (q) => q.eq("owner", owner))
      .collect();
    const values = await ctx.db
      .query("values")
      .withIndex("by_owner", (q) => q.eq("owner", owner))
      .collect();
    return await ctx.db.insert("missionStatements", {
      owner,
      text: text.trim(),
      version: existing.reduce((max, m) => Math.max(max, m.version), 0) + 1,
      status: "draft",
      authoredBy,
      valuesSnapshot: values.sort((a, b) => a.rank - b.rank).map((x) => x.name),
      createdAt: Date.now(),
    });
  },
});

/** Only the person can accept a mission. The guide never does. */
export const accept = mutation({
  args: { sessionId: v.string(), missionId: v.id("missionStatements") },
  handler: async (ctx, { sessionId, missionId }) => {
    const owner = await ownerKey(ctx, sessionId);
    const target = await ctx.db.get(missionId);
    if (!target || target.owner !== owner) throw new Error("Not found");
    const all = await ctx.db
      .query("missionStatements")
      .withIndex("by_owner", (q) => q.eq("owner", owner))
      .collect();
    for (const m of all) {
      const status = m._id === missionId ? "accepted" : "draft";
      if (m.status !== status) await ctx.db.patch(m._id, { status });
    }
  },
});

export const contextForDraft = internalQuery({
  args: { owner: v.string() },
  handler: async (ctx, { owner }) => {
    const values = await ctx.db
      .query("values")
      .withIndex("by_owner", (q) => q.eq("owner", owner))
      .collect();
    const reflections = await ctx.db
      .query("reflections")
      .withIndex("by_owner", (q) => q.eq("owner", owner))
      .collect();
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_owner", (q) => q.eq("owner", owner))
      .unique();
    return {
      about: profileSummary(profile),
      values: values.sort((a, b) => a.rank - b.rank),
      reflections: reflections.map((r) => ({
        question: PROMPTS.find((p) => p.id === r.promptId)?.question ?? r.promptId,
        response: r.response,
      })),
    };
  },
});

/**
 * Every AI call goes through here first: the person must have turned AI on,
 * and must be under their daily limit. Enforced on the server, not just the UI.
 */
export const authorizeAi = internalMutation({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    const owner = await ownerKey(ctx, sessionId);
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_owner", (q) => q.eq("owner", owner))
      .unique();
    if (profile?.aiPreference !== "on") {
      throw new Error("AI is turned off. You can turn it on in your settings, or keep writing on your own.");
    }
    await consumeAiQuota(ctx, owner);
    return owner;
  },
});

/**
 * Ask the guide for a draft. The result is saved as a *draft* the person
 * can edit or discard. Provider config lives in convex/lib/llm.ts.
 */
export const draftWithGuide = action({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }): Promise<string> => {
    const owner: string = await ctx.runMutation(internal.missions.authorizeAi, { sessionId });
    const { about, values, reflections } = await ctx.runQuery(internal.missions.contextForDraft, { owner });
    if (values.length === 0) {
      throw new Error("Choose at least one value before drafting a mission.");
    }

    const shared = [
      ...(about ? [`About me: ${about}`, ""] : []),
      "My core values, most important first:",
      ...values.map((v, i) => `${i + 1}. ${v.name}${v.whyItMatters ? `: ${v.whyItMatters}` : ""}`),
      "",
      "My reflections:",
      ...reflections.map((r) => `Q: ${r.question}\nA: ${r.response}`),
    ].join("\n");

    const text = await chat([
      { role: "system", content: `${GUIDE_SYSTEM_PROMPT}\n\n${MISSION_DRAFT_INSTRUCTIONS}` },
      { role: "user", content: shared },
    ]);

    await ctx.runMutation(internal.missions.insertGuideDraft, { owner, text });
    return text;
  },
});

export const insertGuideDraft = internalMutation({
  args: { owner: v.string(), text: v.string() },
  handler: async (ctx, { owner, text }) => {
    const existing = await ctx.db
      .query("missionStatements")
      .withIndex("by_owner", (q) => q.eq("owner", owner))
      .collect();
    const values = await ctx.db
      .query("values")
      .withIndex("by_owner", (q) => q.eq("owner", owner))
      .collect();
    await ctx.db.insert("missionStatements", {
      owner,
      text,
      version: existing.reduce((max, m) => Math.max(max, m.version), 0) + 1,
      status: "draft",
      authoredBy: "guide_draft",
      valuesSnapshot: values.sort((a, b) => a.rank - b.rank).map((x) => x.name),
      createdAt: Date.now(),
    });
  },
});
