import type { Doc } from "../../convex/_generated/dataModel";
import type { FeelingId } from "../content/onboarding";

/**
 * Every answer-driven decision in Keel, in one place, so the screens and the persona tests share one truth.
 * Research and rules: docs/USER_RESEARCH.md, docs/ONBOARDING.md.
 */

export type Answers = Partial<Doc<"profiles">>;

export const QUESTION_IDS = [
  "name",
  "situation",
  "aiRole",
  // One follow-up only that situation needs:
  "severance",
  "clientChange",
  "missMost",
  "worryReason",
  "runway",
  "firstNeed",
  "work",
  "orientation",
  "constraints",
  "valuedBy",
  "feelings",
  "ai",
] as const;
export type QuestionId = (typeof QUESTION_IDS)[number];

/** Their role is gone or their work dried up: income has stopped or is stopping. */
export const lostWork = (a: Answers) => a.aiImpact === "lost_job" || a.aiImpact === "drying_up";
/** Their work was hit in some way, including a job hollowed out but still paid. */
export const workHit = (a: Answers) => lostWork(a) || a.aiImpact === "job_changing";
/** They still have the work they had: hollowed out, or worried about what's coming. */
export const stillWorking = (a: Answers) => a.aiImpact === "job_changing" || a.aiImpact === "worried";
export const shortOnMoney = (a: Answers) => a.runway === "under_1m" || a.runway === "1_2m";

/** The follow-up each situation gets, and no other situation sees. */
const FOLLOW_UP: Partial<Record<NonNullable<Answers["aiImpact"]>, QuestionId>> = {
  lost_job: "severance",
  drying_up: "clientChange",
  job_changing: "missMost",
  worried: "worryReason",
};
const FOLLOW_UPS: QuestionId[] = ["severance", "clientChange", "missMost", "worryReason"];

/** Which questions this person is asked, in order. */
export function shownQuestions(a: Answers): QuestionId[] {
  const followUp = a.aiImpact ? FOLLOW_UP[a.aiImpact] : undefined;
  return QUESTION_IDS.filter((q) => {
    if (q === "aiRole") return workHit(a);
    if (FOLLOW_UPS.includes(q)) return q === followUp;
    return true;
  });
}

export type PathId = "support" | "bridge" | "discover";

/** The start screen: which paths, in what order, and which one is suggested. */
export function startPaths(a: Answers, feelings: readonly FeelingId[]): { id: PathId; recommended: boolean }[] {
  if (feelings.includes("struggling")) {
    return [
      { id: "support", recommended: true },
      { id: "bridge", recommended: false },
      { id: "discover", recommended: false },
    ];
  }
  const bridgeFirst = shortOnMoney(a) || a.firstNeed === "income";
  return [
    { id: "bridge", recommended: bridgeFirst },
    { id: "discover", recommended: !bridgeFirst },
    { id: "support", recommended: false },
  ];
}

export type ThisWeek = "protect" | "prepare" | null;
export type ProtectItem = "unemployment" | "health" | "severance" | "211";
export type PrepareItem = "buffer" | "record" | "net" | "reconnect";
export type FreelanceItem = "past_clients" | "niche" | "portfolio" | "pricing" | "editing";

/** What Steady ground shows this person. */
export function bridgePlan(a: Answers) {
  // Unemployment, COBRA, and severance only apply to people whose income stopped. People who still have
  // their work get quiet preparation instead. If we don't know, short money is the signal to show protection.
  const thisWeek: ThisWeek = lostWork(a)
    ? "protect"
    : stillWorking(a)
      ? "prepare"
      : !a.aiImpact && shortOnMoney(a) && a.runway !== "has_income"
        ? "protect"
        : null;
  const role = a.work?.role?.trim();
  // A follow-up only counts for its own situation, even if an older answer is still saved.
  const severance = a.aiImpact === "lost_job" ? a.severance : undefined;
  const worryReason = a.aiImpact === "worried" ? a.worryReason : undefined;
  const change = a.aiImpact === "drying_up" ? (a.clientChange ?? []) : [];

  // Severance with a deadline goes first; no severance means the item doesn't apply.
  const protect: ProtectItem[] =
    severance === "deadline"
      ? ["severance", "unemployment", "health", "211"]
      : severance === "none"
        ? ["unemployment", "health", "211"]
        : ["unemployment", "health", "severance", "211"];

  // Announced layoffs make the safety net the first thing to learn.
  const prepare: PrepareItem[] =
    worryReason === "layoffs" ? ["net", "buffer", "record", "reconnect"] : ["buffer", "record", "net", "reconnect"];

  // Freelance help follows what actually changed with their clients.
  const freelance: FreelanceItem[] = [];
  if (change.includes("paying_less")) freelance.push("pricing");
  if (change.includes("editing_ai")) freelance.push("editing");
  freelance.push("past_clients", "niche", "portfolio");
  if (!freelance.includes("pricing")) freelance.push("pricing");

  return {
    thisWeek,
    protect,
    prepare,
    /** Worry mostly from the news gets a gentler framing than announced layoffs. */
    prepareTone: worryReason === "layoffs" ? ("urgent" as const) : worryReason === "news" ? ("gentle" as const) : ("calm" as const),
    freelance,
    freelancer: a.aiImpact === "drying_up",
    /** "My situation has changed" only for people whose situation did change. */
    scripts: lostWork(a) ? ("lost" as const) : ("reconnect" as const),
    roleWork: role ? `${role} work` : "[the kind of work you do]",
    needsFlex: a.constraints?.some((c) => c === "flexible_hours" || c === "caregiver") ?? false,
  };
}
