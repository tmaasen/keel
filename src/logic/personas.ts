import type { FeelingId } from "../content/onboarding";
import type { Answers } from "./journey";

/**
 * Realistic people who might arrive at Keel, drawn from docs/USER_RESEARCH.md.
 * Used by the persona tests and the QA report (docs/qa/PERSONAS.md).
 */
export interface Persona {
  id: string;
  who: string;
  answers: Answers;
  feelings: FeelingId[];
}

export const PERSONAS: Persona[] = [
  {
    id: "denise",
    who: "Laid off after 25 years running a newspaper's customer operations; no degree; one to two months of savings.",
    answers: { displayName: "Denise", aiImpact: "lost_job", aiRole: ["told_ai"], severance: "deadline", runway: "1_2m", firstNeed: "income",
      work: { role: "customer operations manager", yearsBand: "20–30 years" }, identityTie: "who_i_was", workOrientation: "career" },
    feelings: ["sad", "anxious"],
  },
  {
    id: "marcus",
    who: "Support lead who was told to train the chatbot, then cut. Angry, not sure AI was really the reason.",
    answers: { displayName: "Marcus", aiImpact: "lost_job", aiRole: ["trained_it", "not_sure"], severance: "none", runway: "under_1m", firstNeed: "income",
      work: { role: "support lead", yearsBand: "5–10 years" }, identityTie: "a_lot" },
    feelings: ["angry"],
  },
  {
    id: "priya",
    who: "Freelance translator whose clients have quietly disappeared over a year.",
    answers: { displayName: "Priya", aiImpact: "drying_up", aiRole: ["suspect_ai"], clientChange: ["paying_less", "editing_ai"], runway: "1_2m", firstNeed: "income",
      work: { role: "freelance translator", yearsBand: "10–20 years" }, identityTie: "who_i_was", workOrientation: "calling",
      constraints: ["caregiver", "flexible_hours"] },
    feelings: ["ashamed", "sad"],
  },
  {
    id: "jo",
    who: "Illustrator whose work has dried up and who is in crisis.",
    answers: { displayName: "Jo", aiImpact: "drying_up", clientChange: ["fewer"], runway: "under_1m", firstNeed: "not_sure", work: { role: "illustrator" } },
    feelings: ["struggling", "numb"],
  },
  {
    id: "sam",
    who: "Data analyst whose job was rewritten around AI tools. Still paid, meaning gone.",
    answers: { displayName: "Sam", aiImpact: "job_changing", aiRole: ["told_ai"], missMost: "Finding the story in messy data myself", runway: "has_income", firstNeed: "clarity",
      work: { role: "data analyst", yearsBand: "5–10 years" }, identityTie: "a_lot", workOrientation: "calling",
      constraints: ["keep_current_job"] },
    feelings: ["anxious"],
  },
  {
    id: "lee",
    who: "Still employed, worried about layoffs, and money is tight anyway.",
    answers: { displayName: "Lee", aiImpact: "worried", worryReason: "layoffs", runway: "under_1m", firstNeed: "income", work: { role: "paralegal" } },
    feelings: ["anxious"],
  },
  {
    id: "rosa",
    who: "Worried about what's coming, comfortable financially, wants clarity.",
    answers: { displayName: "Rosa", aiImpact: "worried", worryReason: "news", runway: "over_2m", firstNeed: "clarity", work: { role: "copywriter" },
      workOrientation: "mixed" },
    feelings: ["anxious", "okay"],
  },
  {
    id: "dev",
    who: "Wants work that means more; nothing has happened to their job.",
    answers: { displayName: "Dev", aiImpact: "exploring", runway: "has_income", firstNeed: "clarity", workOrientation: "calling" },
    feelings: ["okay"],
  },
  {
    id: "alex",
    who: "Sees work as just a job; laid off; needs rest before anything else.",
    answers: { displayName: "Alex", aiImpact: "lost_job", aiRole: ["other_reasons"], severance: "offered", runway: "over_2m", firstNeed: "rest",
      work: { role: "warehouse coordinator" }, identityTie: "a_little", workOrientation: "job" },
    feelings: ["relieved"],
  },
  {
    id: "skipper",
    who: "Skipped every question.",
    answers: {},
    feelings: [],
  },
  {
    id: "quiet-money",
    who: "Skipped what happened, but said money runs out within a month.",
    answers: { runway: "under_1m" },
    feelings: [],
  },
  {
    id: "junior",
    who: "New grad laid off from a first job; nobody hiring juniors.",
    answers: { displayName: "Kai", aiImpact: "lost_job", aiRole: ["suspect_ai"], severance: "not_sure", runway: "under_1m", firstNeed: "income",
      work: { role: "junior developer", yearsBand: "Under 2 years" }, identityTie: "a_lot" },
    feelings: ["anxious", "ashamed"],
  },
  {
    id: "rather-not",
    who: "Laid off, would rather not say about money, needs clarity.",
    answers: { aiImpact: "lost_job", runway: "rather_not", firstNeed: "clarity", work: { role: "technical writer" } },
    feelings: ["sad"],
  },
  {
    id: "income-but-hit",
    who: "Lost a contract role but a partner's income covers the bills.",
    answers: { aiImpact: "lost_job", runway: "has_income", firstNeed: "clarity", work: { role: "QA engineer" } },
    feelings: ["numb"],
  },
  {
    id: "changing-struggling",
    who: "Job hollowed out and really struggling.",
    answers: { aiImpact: "job_changing", missMost: "Talking to customers instead of supervising a chatbot", runway: "has_income", firstNeed: "rest" },
    feelings: ["struggling"],
  },
  {
    id: "ai-push",
    who: "Marketing coordinator being pushed to use AI tools at work, worried it's a prelude to cuts.",
    answers: { displayName: "Morgan", aiImpact: "worried", worryReason: "ai_push", runway: "over_2m", firstNeed: "clarity",
      work: { role: "marketing coordinator" } },
    feelings: ["anxious", "angry"],
  },
  {
    id: "changed-mind",
    who: "First said laid off (with a severance deadline), then went back and changed it to worried.",
    answers: { aiImpact: "worried", severance: "deadline", runway: "1_2m", firstNeed: "income" },
    feelings: [],
  },
  {
    id: "exploring-broke",
    who: "Wants more meaningful work but is short on money (left a job by choice).",
    answers: { aiImpact: "exploring", runway: "1_2m", firstNeed: "income" },
    feelings: ["okay"],
  },
];
