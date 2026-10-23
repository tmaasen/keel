import type { FunctionReturnType } from "convex/server";
import type { api } from "../convex/_generated/api";
import { PROMPTS, STAGES } from "../convex/journey";
import { SITUATION } from "./content/onboarding";

type Export = FunctionReturnType<typeof api.profiles.exportAll>;

/** Everything someone wrote in Keel, as a Markdown file they can keep, print, or paste anywhere. */
export function toMarkdown(data: Export): string {
  const { profile, reflections, values, missionStatements, workTranslation } = data;
  const date = new Date(data.exportedAt).toLocaleDateString(undefined, { dateStyle: "long" });
  const out: string[] = [`# ${profile?.displayName ? `${profile.displayName}'s` : "My"} Keel`, "", `*Saved ${date}*`, ""];

  const accepted = missionStatements.find((m) => m.status === "accepted");
  if (accepted) out.push("## My mission", "", `> ${accepted.text.replace(/\n/g, "\n> ")}`, "");

  if (values.length > 0) {
    out.push("## What matters to me", "");
    for (const [i, v] of [...values].sort((a, b) => a.rank - b.rank).entries()) {
      out.push(`${i + 1}. **${v.name}**${v.whyItMatters ? `: ${v.whyItMatters}` : ""}`);
    }
    out.push("");
  }

  const situation = SITUATION.find((s) => s.id === profile?.aiImpact)?.label;
  if (situation || profile?.work?.role) {
    out.push("## Where I was when I started", "");
    if (situation) out.push(`- ${situation}`);
    if (profile?.work?.role) out.push(`- My work: ${profile.work.role}${profile.work.yearsBand ? ` (${profile.work.yearsBand})` : ""}`);
    out.push("");
  }

  if (workTranslation && (workTranslation.whatIDid || workTranslation.skills)) {
    out.push("## My work, in words employers use", "");
    if (workTranslation.whatIDid) out.push("### What I did", "", workTranslation.whatIDid, "");
    if (workTranslation.skills) out.push("### Skills", "", workTranslation.skills, "");
  }

  const answered = reflections.filter((r) => r.response.trim());
  if (answered.length > 0) {
    out.push("## My reflections", "");
    for (const stage of STAGES) {
      const prompts = PROMPTS.filter((p) => p.stage === stage.id);
      for (const p of prompts) {
        const r = answered.find((x) => x.promptId === p.id);
        if (r) out.push(`### ${p.question}`, "", r.response.trim(), "");
      }
    }
  }

  const drafts = missionStatements.filter((m) => m !== accepted).sort((a, b) => b.version - a.version);
  if (drafts.length > 0) {
    out.push("## Other versions of my mission", "");
    for (const m of drafts) out.push(`- v${m.version}${m.authoredBy === "guide_draft" ? " (AI draft)" : ""}: ${m.text}`);
    out.push("");
  }

  return out.join("\n");
}

/** Save everything someone wrote as a file: readable Markdown or full JSON. */
export function downloadExport(data: Export, format: "md" | "json") {
  const blob =
    format === "md"
      ? new Blob([toMarkdown(data)], { type: "text/markdown" })
      : new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `keel.${format}`;
  a.click();
  URL.revokeObjectURL(a.href);
}
