import { mkdirSync, writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { acknowledgment } from "../content/acknowledgment";
import type { FeelingId } from "../content/onboarding";
import {
  bridgePlan,
  lostWork,
  shortOnMoney,
  shownQuestions,
  startPaths,
  stillWorking,
  workHit,
  type Answers,
} from "./journey";
import { PERSONAS } from "./personas";

// ---------- Every combination of the answers that drive the journey ----------

const SITUATIONS = [undefined, "lost_job", "drying_up", "job_changing", "worried", "exploring"] as const;
const RUNWAYS = [undefined, "under_1m", "1_2m", "over_2m", "has_income", "rather_not"] as const;
const NEEDS = [undefined, "income", "clarity", "rest", "not_sure"] as const;
const FEELING_SETS: FeelingId[][] = [[], ["angry"], ["struggling"], ["sad", "ashamed"], ["relieved"], ["numb", "struggling"]];
const ROLE_SETS = [[], ["told_ai"], ["trained_it"], ["not_sure", "other_reasons"]] as const;
const TIES = [undefined, "who_i_was"] as const;
/** Follow-up answers, each crossed with every situation to prove stale answers are ignored. */
const FOLLOW_UPS: Answers[] = [
  {},
  { severance: "deadline" },
  { severance: "none" },
  { clientChange: ["paying_less", "editing_ai"] },
  { clientChange: ["platforms"] },
  { missMost: "writing in my own voice" },
  { worryReason: "layoffs" },
  { worryReason: "news" },
  { worryReason: "ai_push" },
];

interface Case { a: Answers; feelings: FeelingId[] }
const ALL: Case[] = [];
for (const aiImpact of SITUATIONS)
  for (const runway of RUNWAYS)
    for (const firstNeed of NEEDS)
      for (const feelings of FEELING_SETS)
        for (const aiRole of ROLE_SETS)
          for (const identityTie of TIES)
            for (const f of FOLLOW_UPS)
              ALL.push({ a: { aiImpact, runway, firstNeed, aiRole: [...aiRole], identityTie, ...f }, feelings });

const BANNED = [/upskill/i, /future-proof/i, /ai-proof/i, /\bpivot\b/i, /reinvent/i, /opportunit/i, /disruption/i,
  /learn a trade/i, /just take any job/i, /someone using ai/i];

const describeCase = (c: Case) => JSON.stringify({ ...c.a, feelings: c.feelings });

describe(`journey rules hold for all ${ALL.length} answer combinations`, () => {
  it("only people whose work was hit are asked what part AI played", () => {
    for (const c of ALL) expect(shownQuestions(c.a).includes("aiRole"), describeCase(c)).toBe(workHit(c.a));
  });

  it("each situation gets exactly its own follow-up question, and only that one", () => {
    const expected: Record<string, string | undefined> = {
      lost_job: "severance", drying_up: "clientChange", job_changing: "missMost", worried: "worryReason",
    };
    const followUps = ["severance", "clientChange", "missMost", "worryReason"];
    for (const c of ALL) {
      const asked = shownQuestions(c.a).filter((q) => followUps.includes(q));
      const want = c.a.aiImpact ? expected[c.a.aiImpact] : undefined;
      expect(asked, describeCase(c)).toEqual(want ? [want] : []);
    }
  });

  it("a severance deadline goes first; no severance removes the item; other situations ignore it", () => {
    for (const c of ALL) {
      const plan = bridgePlan(c.a);
      if (plan.thisWeek !== "protect") continue;
      const laidOff = c.a.aiImpact === "lost_job";
      if (laidOff && c.a.severance === "deadline") expect(plan.protect[0], describeCase(c)).toBe("severance");
      else if (laidOff && c.a.severance === "none") expect(plan.protect, describeCase(c)).not.toContain("severance");
      else expect(plan.protect, describeCase(c)).toEqual(["unemployment", "health", "severance", "211"]);
    }
  });

  it("announced layoffs put the safety net first; news gets a gentler tone; only for worried people", () => {
    for (const c of ALL) {
      const plan = bridgePlan(c.a);
      const worried = c.a.aiImpact === "worried";
      expect(plan.prepare[0], describeCase(c)).toBe(worried && c.a.worryReason === "layoffs" ? "net" : "buffer");
      expect(plan.prepareTone, describeCase(c)).toBe(
        worried && c.a.worryReason === "layoffs" ? "urgent" : worried && c.a.worryReason === "news" ? "gentle" : "calm",
      );
    }
  });

  it("freelance help follows what changed with clients, and only for freelancers", () => {
    for (const c of ALL) {
      const plan = bridgePlan(c.a);
      const freelance = c.a.aiImpact === "drying_up";
      const change = freelance ? (c.a.clientChange ?? []) : [];
      expect(plan.freelance.includes("editing"), describeCase(c)).toBe(change.includes("editing_ai"));
      expect(plan.freelance[0], describeCase(c)).toBe(change.includes("paying_less") ? "pricing" : change.includes("editing_ai") ? "editing" : "past_clients");
    }
  });

  it("nobody who still has their work is told to apply for unemployment", () => {
    for (const c of ALL) {
      const plan = bridgePlan(c.a);
      if (stillWorking(c.a) || c.a.aiImpact === "exploring") expect(plan.thisWeek, describeCase(c)).not.toBe("protect");
      if (plan.thisWeek === "protect") expect(lostWork(c.a) || (!c.a.aiImpact && shortOnMoney(c.a)), describeCase(c)).toBe(true);
    }
  });

  it("people who lost work always see how to protect what they have", () => {
    for (const c of ALL) if (lostWork(c.a)) expect(bridgePlan(c.a).thisWeek, describeCase(c)).toBe("protect");
  });

  it("people who still have their work get quiet preparation", () => {
    for (const c of ALL) if (stillWorking(c.a)) expect(bridgePlan(c.a).thisWeek, describeCase(c)).toBe("prepare");
  });

  it('"My situation has changed" is only written for people whose situation changed', () => {
    for (const c of ALL) expect(bridgePlan(c.a).scripts === "lost", describeCase(c)).toBe(lostWork(c.a));
  });

  it("exactly one path is suggested, and it is a person first for anyone struggling", () => {
    for (const c of ALL) {
      const paths = startPaths(c.a, c.feelings);
      expect(paths.filter((p) => p.recommended), describeCase(c)).toHaveLength(1);
      expect(new Set(paths.map((p) => p.id)).size).toBe(3);
      if (c.feelings.includes("struggling")) expect(paths[0], describeCase(c)).toEqual({ id: "support", recommended: true });
    }
  });

  it("anyone short on money or putting income first is pointed to Steady ground (unless struggling)", () => {
    for (const c of ALL) {
      if (c.feelings.includes("struggling")) continue;
      const suggested = startPaths(c.a, c.feelings).find((p) => p.recommended)!.id;
      expect(suggested, describeCase(c)).toBe(shortOnMoney(c.a) || c.a.firstNeed === "income" ? "bridge" : "discover");
    }
  });

  it("the acknowledgment fits the person and never uses language the research rules out", () => {
    // Collect problems and assert once: tens of thousands of cases.
    const problems: string[] = [];
    const check = (ok: boolean, why: string, c: Case) => {
      if (!ok && problems.length < 20) problems.push(`${why}: ${describeCase(c)}`);
    };
    for (const c of ALL) {
      const lines = acknowledgment(c.a, c.feelings);
      const text = lines.join(" ");
      check(lines.length > 1, "too short", c);
      for (const re of BANNED) check(!re.test(text), `banned phrase ${re}`, c);
      check(text.includes("really struggling") === c.feelings.includes("struggling"), "struggling line", c);
      check(text.includes("You did what they asked") === (c.a.aiRole?.includes("trained_it") ?? false), "trained line", c);
      if (!workHit(c.a)) check(!text.includes("prove it was AI"), "prove line for someone not hit", c);
      if (!workHit(c.a)) check(!text.includes("Your skill was real"), "skill line for someone not hit", c);
      if (c.feelings.includes("angry")) check(text.includes("decisions people made"), "anger line", c);
      if (c.a.aiImpact === "exploring") check(!text.includes("no one knows where AI is headed"), "unknown line for exploring", c);
      check(text.includes("You told us you miss this") === (c.a.aiImpact === "job_changing" && !!c.a.missMost), "miss line", c);
      check(
        text.includes("polish a machine's draft") === (c.a.aiImpact === "drying_up" && (c.a.clientChange?.includes("editing_ai") ?? false)),
        "editing line",
        c,
      );
      if (c.a.aiImpact !== "worried") {
        check(!/layoffs have been announced|use AI at work while|comes from the news/.test(text), "worry line outside worried", c);
      }
    }
    expect(problems).toEqual([]);
  }, 60_000);
});

describe("named personas", () => {
  const get = (id: string) => PERSONAS.find((p) => p.id === id)!;

  it("Lee (worried, money tight, income first) is pointed to Steady ground but never told to apply for unemployment", () => {
    const lee = get("lee");
    expect(startPaths(lee.answers, lee.feelings)[0]).toEqual({ id: "bridge", recommended: true });
    expect(bridgePlan(lee.answers).thisWeek).toBe("prepare");
  });

  it("Jo (in crisis) is pointed to a person first", () => {
    const jo = get("jo");
    expect(startPaths(jo.answers, jo.feelings)[0].id).toBe("support");
  });

  it("Priya (freelancer) sees the off-platform clients help and flexible options", () => {
    const plan = bridgePlan(get("priya").answers);
    expect(plan.freelancer).toBe(true);
    expect(plan.needsFlex).toBe(true);
  });

  it("Denise (severance deadline) sees the deadline first on Steady ground", () => {
    expect(bridgePlan(get("denise").answers).protect[0]).toBe("severance");
  });

  it("someone who changed their answer from laid off to worried isn't shown stale severance advice", () => {
    const plan = bridgePlan(get("changed-mind").answers);
    expect(plan.thisWeek).toBe("prepare");
    expect(shownQuestions(get("changed-mind").answers)).toContain("worryReason");
    expect(shownQuestions(get("changed-mind").answers)).not.toContain("severance");
  });

  it("someone who skipped everything still gets a sensible, gentle journey", () => {
    const s = get("skipper");
    expect(shownQuestions(s.answers)).not.toContain("aiRole");
    expect(bridgePlan(s.answers).thisWeek).toBeNull();
    expect(startPaths(s.answers, s.feelings).find((p) => p.recommended)!.id).toBe("discover");
  });
});

// ---------- QA report: how different the journeys really are ----------

describe("persona report", () => {
  it("writes docs/qa/PERSONAS.md", () => {
    const flows = new Set(ALL.map((c) => shownQuestions(c.a).join(",")));
    const acks = new Set(ALL.map((c) => acknowledgment(c.a, c.feelings).join("|")));
    const starts = new Set(ALL.map((c) => startPaths(c.a, c.feelings).map((p) => p.id + (p.recommended ? "*" : "")).join(",")));
    const bridges = new Set(ALL.map((c) => JSON.stringify({ ...bridgePlan(c.a), roleWork: undefined })));
    const out: string[] = [
      "# Persona QA report",
      "",
      "*Generated by `pnpm test` from `src/logic/personas.ts` and `src/logic/journey.ts`. Do not edit by hand.*",
      "",
      "## How much the journey adapts",
      "",
      `Across ${ALL.length} combinations of situation, money, first need, feelings, what part AI played, and identity tie:`,
      "",
      `- **Question sets:** ${flows.size} distinct (${[...flows].map((f) => f.split(",").length).join(" or ")} questions)`,
      `- **Acknowledgments:** ${acks.size} distinct`,
      `- **Start screen suggestions:** ${starts.size} distinct`,
      `- **Steady ground plans:** ${bridges.size} distinct`,
      "",
      "## Personas",
      "",
    ];
    for (const p of PERSONAS) {
      const plan = bridgePlan(p.answers);
      const asked = shownQuestions(p.answers);
      const paths = startPaths(p.answers, p.feelings);
      out.push(
        `### ${p.answers.displayName ?? p.id}: ${p.who}`,
        "",
        `- **Asked:** ${asked.length} questions${asked.includes("aiRole") ? ", including what part AI played" : ""}${
          (["severance", "clientChange", "missMost", "worryReason"] as const).filter((q) => asked.includes(q)).map((q) => `, and the "${q}" follow-up`).join("")
        }`,
        `- **Feeling:** ${p.feelings.join(", ") || "skipped"}`,
        `- **Suggested first:** ${paths.find((x) => x.recommended)!.id}`,
        `- **Steady ground, this week:** ${
          plan.thisWeek === "protect" ? `protect (${plan.protect.join(" → ")})` : plan.thisWeek === "prepare" ? `prepare, ${plan.prepareTone} (${plan.prepare.join(" → ")})` : "nothing urgent shown"
        }${plan.freelancer ? `; freelancer help (${plan.freelance.join(" → ")})` : ""}${plan.needsFlex ? "; flexible options highlighted" : ""}`,
        `- **Outreach scripts:** ${plan.scripts === "lost" ? `"My situation has changed…" (${plan.roleWork})` : `"I've been thinking about what's next…"`}`,
        "- **Acknowledgment:**",
        ...acknowledgment(p.answers, p.feelings).map((l) => `  > ${l}`),
        "",
      );
    }
    mkdirSync("docs/qa", { recursive: true });
    writeFileSync("docs/qa/PERSONAS.md", out.join("\n"));
  });
});
