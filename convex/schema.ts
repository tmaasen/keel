import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Keel data model. Data flows one way:
 *   reflections -> values -> missionStatements -> (later) careerPaths
 *
 * Every table is keyed by `owner`, resolved via convex/lib/owner.ts.
 */

export const aiImpact = v.union(
  v.literal("lost_job"), // my role was eliminated
  v.literal("job_changing"), // my job still exists but is changing a lot
  v.literal("worried"), // nothing has happened yet, but I'm anxious
  v.literal("exploring"), // I want work that matters more
);

export const stage = v.union(
  v.literal("ground"),
  v.literal("discover"),
  v.literal("declare"),
  v.literal("navigate"),
);

export default defineSchema({
  profiles: defineTable({
    owner: v.string(),
    displayName: v.optional(v.string()),
    aiImpact: v.optional(aiImpact),
    currentOrRecentWork: v.optional(v.string()),
    stage,
    updatedAt: v.number(),
  }).index("by_owner", ["owner"]),

  reflections: defineTable({
    owner: v.string(),
    stage,
    promptId: v.string(), // see convex/journey.ts
    response: v.string(),
    updatedAt: v.number(),
  })
    .index("by_owner", ["owner"])
    .index("by_owner_prompt", ["owner", "promptId"]),

  values: defineTable({
    owner: v.string(),
    name: v.string(),
    catalogId: v.optional(v.string()), // undefined = custom value
    whyItMatters: v.optional(v.string()),
    rank: v.number(), // 1 = most important
  }).index("by_owner", ["owner"]),

  missionStatements: defineTable({
    owner: v.string(),
    text: v.string(),
    version: v.number(),
    status: v.union(v.literal("draft"), v.literal("accepted")),
    authoredBy: v.union(v.literal("person"), v.literal("guide_draft")),
    valuesSnapshot: v.array(v.string()),
    createdAt: v.number(),
  }).index("by_owner", ["owner"]),
});
