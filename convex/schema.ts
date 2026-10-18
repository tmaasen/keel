import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Keel data model. Data flows one way:
 *   profile (onboarding) -> reflections -> values -> missionStatements -> (later) careerPaths
 *
 * Every table is keyed by `owner`, resolved via convex/lib/owner.ts.
 * Answer labels live in src/content/onboarding.ts. See docs/ONBOARDING.md.
 */

export const aiImpact = v.union(
  v.literal("lost_job"), // my role was eliminated
  v.literal("drying_up"), // my work has been drying up (freelancers: no "layoff date")
  v.literal("job_changing"), // my job changed into something I don't recognize ("hollowed out")
  v.literal("worried"), // nothing yet, but I'm worried
  v.literal("exploring"), // I want work that means more
);

/**
 * What part AI played, in the person's own terms. Multi-select, and "not_sure" is a full answer.
 * Research: many people never get a straight answer, and AI is often tangled with offshoring and cost-cutting.
 */
export const aiRole = v.union(
  v.literal("told_ai"), // they said AI was the reason
  v.literal("suspect_ai"), // nobody said it, but I think AI was part of it
  v.literal("other_reasons"), // offshoring, cost-cutting, or restructuring was part of it
  v.literal("trained_it"), // I was asked to use or train the AI tools
  v.literal("not_sure"),
);

/** Situation-specific follow-ups: each is asked of one situation only (src/logic/journey.ts). */
export const severance = v.union(
  v.literal("deadline"), // offered, with a deadline to sign
  v.literal("offered"), // offered, no deadline
  v.literal("none"),
  v.literal("not_sure"),
);
export const clientChange = v.union(
  v.literal("fewer"),
  v.literal("paying_less"),
  v.literal("editing_ai"),
  v.literal("platforms"),
);
export const worryReason = v.union(
  v.literal("layoffs"),
  v.literal("ai_push"),
  v.literal("news"),
  v.literal("other"),
);

export const runway = v.union(
  v.literal("under_1m"),
  v.literal("1_2m"),
  v.literal("over_2m"),
  v.literal("has_income"),
  v.literal("rather_not"),
);

export const firstNeed = v.union(
  v.literal("income"),
  v.literal("clarity"),
  v.literal("rest"),
  v.literal("not_sure"),
);

export const identityTie = v.union(
  v.literal("a_little"),
  v.literal("a_lot"),
  v.literal("who_i_was"),
);

export const workOrientation = v.union(
  v.literal("job"),
  v.literal("career"),
  v.literal("calling"),
  v.literal("mixed"),
  v.literal("unsure"),
);

export const constraint = v.union(
  v.literal("no_relocate"),
  v.literal("caregiver"),
  v.literal("flexible_hours"),
  v.literal("no_school"),
  v.literal("remote"),
  v.literal("keep_current_job"),
);

export const aiPreference = v.union(v.literal("on"), v.literal("off"));

export const stage = v.union(
  v.literal("ground"),
  v.literal("discover"),
  v.literal("declare"),
  v.literal("navigate"),
);

/** Fields a person can set on their own profile. Shared by schema and profiles.upsert. */
export const profileFields = {
  displayName: v.optional(v.string()),
  aiImpact: v.optional(aiImpact),
  aiRole: v.optional(v.array(aiRole)),
  severance: v.optional(severance), // laid off only
  clientChange: v.optional(v.array(clientChange)), // work drying up only
  missMost: v.optional(v.string()), // job changing only: in their words
  worryReason: v.optional(worryReason), // worried only
  runway: v.optional(runway),
  firstNeed: v.optional(firstNeed),
  work: v.optional(
    v.object({
      role: v.optional(v.string()),
      yearsBand: v.optional(v.string()),
    }),
  ),
  identityTie: v.optional(identityTie),
  workOrientation: v.optional(workOrientation),
  constraints: v.optional(v.array(constraint)),
  valuedBy: v.optional(v.string()),
  aiPreference: v.optional(aiPreference),
  /** Steady ground "This week" items the person has marked done. */
  bridgeDone: v.optional(v.array(v.string())),
  onboardingCompletedAt: v.optional(v.number()),
  /** @deprecated replaced by work.role */
  currentOrRecentWork: v.optional(v.string()),
};

export default defineSchema({
  profiles: defineTable({
    owner: v.string(),
    ...profileFields,
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

  /**
   * "Translate your work": what someone did, put into words employers use.
   * Research: the most-upvoted help on Reddit was someone doing exactly this. One per person.
   */
  workTranslations: defineTable({
    owner: v.string(),
    whatIDid: v.string(),
    skills: v.string(),
    skillsBy: v.union(v.literal("person"), v.literal("guide_draft")),
    updatedAt: v.number(),
  }).index("by_owner", ["owner"]),

  /** Tester and user feedback. Read it in the Convex dashboard. */
  feedback: defineTable({
    owner: v.string(),
    screen: v.string(),
    kind: v.union(v.literal("felt"), v.literal("bug"), v.literal("idea")),
    message: v.string(),
    contact: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_owner", ["owner"])
    .index("by_created", ["createdAt"]),

  /** Per-person daily AI usage, to keep a donation-funded budget safe. */
  aiUsage: defineTable({
    owner: v.string(),
    day: v.string(), // YYYY-MM-DD (UTC)
    count: v.number(),
  }).index("by_owner_day", ["owner", "day"]),

  /** Total AI spend across everyone, per month. Not tied to any person. */
  aiSpend: defineTable({
    month: v.string(), // YYYY-MM (UTC)
    usd: v.number(),
    calls: v.number(),
  }).index("by_month", ["month"]),
});
