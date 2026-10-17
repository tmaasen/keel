import type { Doc } from "../../convex/_generated/dataModel";
import type { FeelingId } from "./onboarding";

/**
 * The acknowledgment screen, shown before any values work.
 * Research: people describe a dignity wound first. Name it, don't rush past it.
 * Also: many never get a straight answer about why, and many did everything asked of them.
 */
export function acknowledgment(profile: Partial<Doc<"profiles">>, feelings: FeelingId[]): string[] {
  const lines: string[] = [];

  switch (profile.aiImpact) {
    case "lost_job":
      lines.push("Losing work you were good at is a real loss. What happened to your work wasn't a verdict on you.");
      break;
    case "drying_up":
      lines.push(
        "When work dries up slowly, there's no single moment to point to, and that can make it harder to name. It's still real, and it's not a verdict on you.",
      );
      break;
    case "job_changing":
      lines.push(
        "Watching your work get rewritten into something you don't recognize is its own kind of loss, even with a paycheck still coming in.",
      );
      break;
    case "worried":
      lines.push("Worrying about what's coming is exhausting. You don't have to wait for something to happen to take care of yourself.");
      break;
    case "exploring":
      lines.push("Wanting work that means more is worth taking seriously.");
      break;
    default:
      lines.push("Whatever brought you here, you're welcome.");
  }

  if (feelings.includes("struggling")) {
    lines.push(
      "You told us you're really struggling. That matters more than anything else here. Please reach out to someone today: a person you trust, or one of the people on the support page.",
    );
  }

  const hit = profile.aiImpact && profile.aiImpact !== "exploring" && profile.aiImpact !== "worried";
  if (hit && (profile.identityTie === "who_i_was" || profile.identityTie === "a_lot")) {
    lines.push("If this work was a big part of who you are, it makes sense that this feels bigger than a job.");
  }

  const role = profile.aiRole ?? [];
  if (role.includes("trained_it")) {
    lines.push("You did what they asked, and it didn't protect you. That isn't a failure to adapt.");
  }
  const causeUnclear = role.length === 0 || role.some((r) => r === "suspect_ai" || r === "other_reasons" || r === "not_sure");
  if (hit && causeUnclear) {
    lines.push(
      "You don't have to prove it was AI. Most people never get a straight answer, and it's often more than one thing.",
    );
  }

  if (feelings.includes("angry")) {
    lines.push("If you're angry, that makes sense. A lot of this came from decisions people made, not from anything you did.");
  }
  if (feelings.includes("ashamed")) {
    lines.push("There's nothing to be ashamed of. Many skilled people are going through this right now.");
  }
  if (feelings.includes("numb")) lines.push("Feeling numb is a normal response too.");
  if (feelings.includes("relieved")) lines.push("Relief is allowed. Sometimes an ending makes room for something better.");

  if (hit) lines.push("Your skill was real. Your experience still counts.");
  if (profile.aiImpact !== "exploring") {
    lines.push(
      "And honestly, no one knows where AI is headed. Not the companies building it, not the experts, not us. You're not behind for not having it figured out.",
    );
  }
  lines.push("Let's figure out what comes next, at your pace.");
  return lines;
}
