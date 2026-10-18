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
  const role: Record<string, string> = {
    told_ai: "They were told AI was the reason.",
    suspect_ai: "Nobody said so, but they think AI was part of it.",
    other_reasons: "Outsourcing, cost-cutting, or restructuring was part of it.",
    trained_it: "They were asked to use or train the AI tools.",
    not_sure: "They don't know for sure what caused it.",
  };
  for (const r of p.aiRole ?? []) parts.push(role[r]);
  if (p.aiImpact === "lost_job" && p.severance === "deadline") parts.push("They have a severance offer with a deadline to sign.");
  if (p.aiImpact === "drying_up" && p.clientChange?.length) {
    const change: Record<string, string> = {
      fewer: "fewer clients", paying_less: "clients paying less", editing_ai: "clients asking them to edit AI drafts",
      platforms: "platforms showing their work less",
    };
    parts.push(`With their clients: ${p.clientChange.map((c) => change[c]).join(", ")}.`);
  }
  if (p.aiImpact === "job_changing" && p.missMost) parts.push(`What they miss most about their work, in their words: "${p.missMost}".`);
  if (p.aiImpact === "worried" && p.worryReason) {
    const why: Record<string, string> = {
      layoffs: "Layoffs have been announced or rumored where they work.", ai_push: "AI is being pushed into their work.",
      news: "The worry comes mostly from the news.", other: "",
    };
    if (why[p.worryReason]) parts.push(why[p.worryReason]);
  }
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
