import { Doc } from "../_generated/dataModel";

/**
 * A short plain-language description of the person for the guide.
 * The guide uses it to adjust tone and examples, never to label them.
 * Feelings from onboarding are never stored, so they never appear here.
 */
export function profileSummary(p: Doc<"profiles"> | null): string {
  if (!p) return "";
  const parts: string[] = [];
  const situation: Record<string, string> = {
    lost_job: "Their role was eliminated.",
    drying_up: "Their work has been drying up gradually.",
    job_changing: "They still have their job, but it has changed into something they don't recognize.",
    worried: "Nothing has happened yet, but they're worried about their work.",
    exploring: "They want work that means more.",
  };
  if (p.aiImpact) parts.push(situation[p.aiImpact]);
  if (p.work?.role) parts.push(`Their work: ${p.work.role}${p.work.yearsBand ? ` (${p.work.yearsBand})` : ""}.`);
  if (p.identityTie === "who_i_was") parts.push("This work was a big part of who they were.");
  if (p.identityTie === "a_lot") parts.push("Much of who they are was tied to this work.");
  const orientation: Record<string, string> = {
    job: "They mostly see work as a way to support the life they care about outside it. Respect that; don't push 'calling'.",
    career: "They care about growth and progress in their work.",
    calling: "They see their work as part of who they are.",
    mixed: "They see work as a mix of paycheck, growth, and meaning.",
    unsure: "They aren't sure anymore how they see work.",
  };
  if (p.workOrientation) parts.push(orientation[p.workOrientation]);
  if (p.firstNeed === "income") parts.push("Right now, income comes first for them.");
  if (p.firstNeed === "rest") parts.push("Right now, they mostly need rest.");
  return parts.join(" ");
}
