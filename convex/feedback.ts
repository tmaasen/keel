import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { ownerKey } from "./lib/owner";

/**
 * Feedback from testers and users. Read submissions in the Convex dashboard
 * (Data → feedback). Contact info is optional and only used to follow up.
 */
export const submit = mutation({
  args: {
    sessionId: v.string(),
    screen: v.string(),
    kind: v.union(v.literal("felt"), v.literal("bug"), v.literal("idea")),
    message: v.string(),
    contact: v.optional(v.string()),
  },
  handler: async (ctx, { sessionId, screen, kind, message, contact }) => {
    const owner = await ownerKey(ctx, sessionId);
    const text = message.trim().slice(0, 5000);
    if (!text) throw new Error("Write a few words first.");

    // Light spam guard: at most 20 submissions per person per day.
    const since = Date.now() - 24 * 60 * 60 * 1000;
    const recent = await ctx.db
      .query("feedback")
      .withIndex("by_owner", (q) => q.eq("owner", owner))
      .filter((q) => q.gt(q.field("createdAt"), since))
      .collect();
    if (recent.length >= 20) throw new Error("Thanks! That's plenty for today.");

    await ctx.db.insert("feedback", {
      owner,
      screen: screen.slice(0, 50),
      kind,
      message: text,
      contact: contact?.trim().slice(0, 200) || undefined,
      createdAt: Date.now(),
    });
  },
});
