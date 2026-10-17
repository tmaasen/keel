import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import { sessionId } from "../session";
import { MultiChoice, SingleChoice } from "../components/Choices";
import { SupportList } from "./Support";
import { acknowledgment } from "../content/acknowledgment";
import {
  AI_CHOICE,
  AI_ROLE,
  CONSTRAINTS,
  FEELINGS,
  FIRST_NEED,
  IDENTITY_TIE,
  ORIENTATION,
  RUNWAY,
  SITUATION,
  YEARS,
  type FeelingId,
} from "../content/onboarding";
import type { View } from "../App";

type Profile = Doc<"profiles">;
type Answers = Partial<Profile>;
type ProfileInput = Partial<Omit<Profile, "_id" | "_creationTime" | "owner" | "updatedAt" | "stage">>;

const STEPS = [
  "welcome",
  "name",
  "situation",
  "aiRole",
  "runway",
  "firstNeed",
  "work",
  "orientation",
  "constraints",
  "valuedBy",
  "feelings",
  "ai",
  "acknowledge",
  "start",
] as const;
type Step = (typeof STEPS)[number];
const NOT_QUESTIONS: readonly Step[] = ["welcome", "acknowledge", "start"];
const QUESTIONS = STEPS.filter((s) => !NOT_QUESTIONS.includes(s));

/** Remember the step so a reload or app switch doesn't send someone back to the start. */
const STEP_KEY = "keel.onboardingStep";
const readStep = () => {
  try {
    const n = Number(localStorage.getItem(STEP_KEY));
    return Number.isInteger(n) && n > 0 && n < STEPS.length ? n : 0;
  } catch {
    return 0;
  }
};
const writeStep = (n: number | null) => {
  try {
    if (n === null) localStorage.removeItem(STEP_KEY);
    else localStorage.setItem(STEP_KEY, String(n));
  } catch {
    /* storage unavailable: the flow still works, it just won't survive a reload */
  }
};

export function Onboarding({
  profile,
  onDone,
  onRise,
}: {
  profile: Profile | null;
  onDone: (view: View) => void;
  /** How high the horizon's sun should stand, 0 to 1. */
  onRise: (rise: number) => void;
}) {
  const upsert = useMutation(api.profiles.upsert);
  const [i, setI] = useState(readStep);
  const [a, setA] = useState<Answers>(profile ?? {});
  const [feelings, setFeelings] = useState<FeelingId[]>([]);
  const [showSupport, setShowSupport] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const step: Step = STEPS[i];

  const wasHit = a.aiImpact === "lost_job" || a.aiImpact === "drying_up" || a.aiImpact === "job_changing";
  const struggling = feelings.includes("struggling");
  const set = (patch: Answers) => setA((prev) => ({ ...prev, ...patch }));
  const save = (patch: ProfileInput) => upsert({ sessionId, ...patch });

  // Questions shown to this person (the AI-role question only appears when their work was hit).
  const shown = QUESTIONS.filter((s) => s !== "aiRole" || wasHit);
  const questionNumber = shown.indexOf(step) + 1;
  const isQuestion = !NOT_QUESTIONS.includes(step);

  // The sun rises with every answer and stands fully risen at the acknowledgment.
  useEffect(() => {
    const rise = step === "welcome" ? 0.12 : isQuestion ? 0.15 + (0.75 * questionNumber) / shown.length : 1;
    onRise(rise);
  }, [step, isQuestion, questionNumber, shown.length, onRise]);

  // Move focus to the new screen's heading so keyboard and screen reader users land on the question.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
    const title = headingRef.current?.textContent;
    if (title) document.title = `${title} · Keel`;
  }, [i, showSupport]);

  /** Fields each step owns, so "Next" saves only that step's answers. */
  const fieldsFor = (s: Step): ProfileInput => {
    switch (s) {
      case "name": return { displayName: a.displayName ?? "" };
      case "situation": return { aiImpact: a.aiImpact, ...(wasHit ? {} : { aiRole: [] }) };
      case "aiRole": return { aiRole: a.aiRole ?? [] };
      case "runway": return { runway: a.runway };
      case "firstNeed": return { firstNeed: a.firstNeed };
      case "work": return { work: a.work, identityTie: a.identityTie };
      case "orientation": return { workOrientation: a.workOrientation };
      case "constraints": return { constraints: a.constraints ?? [] };
      case "valuedBy": return { valuedBy: a.valuedBy ?? "" };
      case "ai": return { aiPreference: a.aiPreference ?? "off" }; // skipping = off
      default: return {};
    }
  };

  const go = (delta: number) => {
    setSaveError(null);
    setI((n) => {
      let to = Math.min(Math.max(n + delta, 0), STEPS.length - 1);
      if (STEPS[to] === "aiRole" && !wasHit) to += delta;
      writeStep(to);
      return to;
    });
    window.scrollTo({ top: 0 });
  };
  /** Someone who says they're really struggling sees human support first, whether they press Next or Skip. */
  const offerSupportFirst = () => {
    if (step === "feelings" && struggling && !showSupport) {
      setShowSupport(true);
      window.scrollTo({ top: 0 });
      return true;
    }
    return false;
  };
  // Convex queues writes while offline and retries, so advance right away; only a real rejection shows an error.
  const next = () => {
    save(fieldsFor(step)).catch(() =>
      setSaveError("Some of your answers didn't save. You can go back and try that question again."),
    );
    if (offerSupportFirst()) return;
    go(1);
  };
  const skip = async () => {
    if (offerSupportFirst()) return;
    // AI defaults to off, so a failed save here changes nothing.
    if (step === "ai") await save({ aiPreference: "off" }).catch(() => {});
    go(1);
  };

  const bridgeFirst = a.runway === "under_1m" || a.runway === "1_2m" || a.firstNeed === "income";
  const finish = async (view: View) => {
    try {
      await save({ onboardingCompletedAt: Date.now() });
    } catch {
      setSaveError("We couldn't save that just now. Check your connection and try again.");
      return;
    }
    writeStep(null);
    onDone(view);
  };

  const ackLines = acknowledgment(a, feelings);
  if (a.displayName && ackLines[0]) {
    ackLines[0] = `${a.displayName}, ${ackLines[0][0].toLowerCase()}${ackLines[0].slice(1)}`;
  }
  const strugglingLine = ackLines.find((l) => l.startsWith("You told us you're really struggling"));

  const heading = (text: string) => (
    <h1 id="q-title" className="question-title" ref={headingRef} tabIndex={-1}>{text}</h1>
  );

  return (
    <section className="onboarding">
      {showSupport ? (
        <div className="step">
          {heading("Thank you for telling us.")}
          <p className="lede">
            It sounds like things are really hard right now. You don't have to figure out your career today. Talking to
            someone can help, whether that's a person you trust or one of the people below.
          </p>
          <SupportList />
          <WaterBar>
            <button className="link" onClick={() => setShowSupport(false)}>Back</button>
            <span className="spacer" />
            <button className="primary" onClick={() => { setShowSupport(false); go(1); }}>
              Continue when you're ready
            </button>
          </WaterBar>
        </div>
      ) : (
        <>
          {step === "welcome" && (
            <div className="step welcome">
              <h1 ref={headingRef} tabIndex={-1}>AI changed your work. It didn't change who you are.</h1>
              <p className="lede">
                Keel helps you get steady, then figure out what matters to you and find work that fits. It's free, and
                it's on your side.
              </p>
              <ul className="facts">
                <li><strong>About 5 minutes.</strong> Every question can be skipped.</li>
                <li>
                  <strong>No predictions.</strong> Nobody knows where AI is headed, and Keel won't pretend to or sell
                  you an "AI-proof" career.
                </li>
                <li><strong>Your answers are private.</strong> Not sold, not shared with employers, deletable any time.</li>
                <li>
                  <strong>AI is optional.</strong> If you turn it on, it only reflects your own words back and offers
                  drafts you can change. It never scores, ranks, or judges you.
                </li>
              </ul>
              <WaterBar>
                <span className="spacer" />
                <button className="primary" onClick={() => go(1)}>Let's start</button>
              </WaterBar>
            </div>
          )}

          {step === "name" && (
            <Question heading={heading("What should we call you?")} why="So this feels like a conversation, not a form.">
              <label className="sr-only" htmlFor="displayName">Your name</label>
              <input
                id="displayName"
                value={a.displayName ?? ""}
                onChange={(e) => set({ displayName: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") next();
                }}
                placeholder="First name or nickname"
                autoComplete="given-name"
                autoFocus
              />
            </Question>
          )}

          {step === "situation" && (
            <Question heading={heading("What happened to your work?")} why="There's more than one way this happens. Each one needs something different.">
              <SingleChoice name="situation" options={SITUATION} value={a.aiImpact} labelledBy="q-title"
                onChange={(id) => set({ aiImpact: id as Profile["aiImpact"] })} />
            </Question>
          )}

          {step === "aiRole" && (
            <Question heading={heading("What part did AI play?")} why="You don't have to know. Choose any that fit, or skip.">
              <MultiChoice options={AI_ROLE} value={a.aiRole ?? []} labelledBy="q-title"
                onChange={(ids) => set({ aiRole: ids as Profile["aiRole"] })} />
            </Question>
          )}

          {step === "runway" && (
            <Question
              heading={heading("If no new income came in, how long could you cover essentials like rent, food, and bills?")}
              why="If you need income soon, we won't make you wait on reflection first. Only you can see this."
            >
              <SingleChoice name="runway" options={RUNWAY} value={a.runway} labelledBy="q-title"
                onChange={(id) => set({ runway: id as Profile["runway"] })} />
            </Question>
          )}

          {step === "firstNeed" && (
            <Question heading={heading("What do you need most right now?")} why="You know better than we do what comes first.">
              <SingleChoice name="firstNeed" options={FIRST_NEED} value={a.firstNeed} labelledBy="q-title"
                onChange={(id) => set({ firstNeed: id as Profile["firstNeed"] })} />
            </Question>
          )}

          {step === "work" && (
            <Question heading={heading("Tell us a little about your work.")} why="Your experience is worth more than a job title. We'll help you see what carries over.">
              <label className="field">
                <span>What do you do, or what did you do?</span>
                <input
                  value={a.work?.role ?? ""}
                  onChange={(e) => set({ work: { ...a.work, role: e.target.value } })}
                  placeholder="For example: freelance copywriter, support lead, illustrator"
                />
              </label>
              <label className="field">
                <span>For how long?</span>
                <select value={a.work?.yearsBand ?? ""} onChange={(e) => set({ work: { ...a.work, yearsBand: e.target.value || undefined } })}>
                  <option value="">Choose…</option>
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </label>
              <p className="field-label" id="identity-q">How much of who you are was tied to this work?</p>
              <SingleChoice name="identity" options={IDENTITY_TIE} value={a.identityTie} labelledBy="identity-q"
                onChange={(id) => set({ identityTie: id as Profile["identityTie"] })} />
            </Question>
          )}

          {step === "orientation" && (
            <Question heading={heading("Whose story sounds most like yours?")} why="There's no right answer. People find meaning in different places, and Keel should respect yours.">
              <SingleChoice
                name="orientation"
                labelledBy="q-title"
                options={ORIENTATION.map((o) => ({
                  id: o.id,
                  label: o.name,
                  hint: o.story,
                  group: "group" in o ? o.group : undefined,
                }))}
                value={a.workOrientation}
                onChange={(id) => set({ workOrientation: id as Profile["workOrientation"] })}
              />
            </Question>
          )}

          {step === "constraints" && (
            <Question heading={heading("What should we keep in mind?")} why="So we only suggest things that fit your real life. Choose any that apply.">
              <MultiChoice options={CONSTRAINTS} value={a.constraints ?? []} labelledBy="q-title"
                onChange={(ids) => set({ constraints: ids as Profile["constraints"] })} />
            </Question>
          )}

          {step === "valuedBy" && (
            <Question
              heading={heading("Who still knows your work and values it?")}
              why="A former manager, a client, a coworker. People who know your work often matter more than any job board."
            >
              <textarea rows={3} value={a.valuedBy ?? ""} onChange={(e) => set({ valuedBy: e.target.value })}
                aria-labelledby="q-title" placeholder="Names or roles are fine. Only you will see this." />
            </Question>
          )}

          {step === "feelings" && (
            <Question heading={heading("How are you feeling about all of this?")} why="Change like this can be heavy. This isn't saved. It just helps us meet you where you are.">
              <MultiChoice options={FEELINGS} value={feelings} labelledBy="q-title"
                onChange={(ids) => setFeelings(ids as FeelingId[])} />
            </Question>
          )}

          {step === "ai" && (
            <Question heading={heading("How should Keel use AI?")} why="We know it may feel strange to see AI here. It's your choice, and you can change it any time.">
              <SingleChoice name="ai" options={AI_CHOICE} value={a.aiPreference} labelledBy="q-title"
                onChange={(id) => set({ aiPreference: id as Profile["aiPreference"] })} />
              <p className="helper">
                Either way: AI never decides anything for you, never rates you, and nothing is shared with employers.
              </p>
            </Question>
          )}

          {step === "acknowledge" && (
            <div className="step acknowledge">
              <h1 className="sr-only" ref={headingRef} tabIndex={-1}>Before we go on</h1>
              {ackLines.map((line, n) =>
                line === strugglingLine ? (
                  <p key={line} className="ack-help">{line}</p>
                ) : (
                  <p key={line} className={n === 0 ? "ack-first" : undefined}>{line}</p>
                ),
              )}
              <WaterBar>
                <span className="spacer" />
                <button className="primary" onClick={() => go(1)}>Choose where to start</button>
              </WaterBar>
            </div>
          )}

          {step === "start" && (
            <div className="step">
              {heading("Where would you like to start?")}
              {a.firstNeed === "rest" && (
                <p className="lede">
                  Rest is allowed. Nothing here is on a clock. You can look around, or just come back when you're ready.
                  Your answers are saved in this browser.
                </p>
              )}
              {struggling && (
                <p className="lede">
                  You told us you're really struggling. Talking to someone today matters more than anything else here.
                </p>
              )}
              <ul className="paths">
                {struggling && (
                  <PathRow recommended title="Talk to a person"
                    text="Crisis lines, benefits help, financial counseling, and community. Keel is not a substitute for people."
                    onClick={() => finish("support")} />
                )}
                <PathRow recommended={bridgeFirst && !struggling} title="Steady ground"
                  text="Practical help for right now: benefits, health coverage, reaching back out to people who value your work, and bridge income."
                  onClick={() => finish("bridge")} />
                <PathRow recommended={!bridgeFirst && !struggling} title="What matters to me"
                  text="Reflect on your values and your life outside work, then write a personal mission statement in your own words."
                  onClick={() => finish("discover")} />
                {!struggling && (
                  <PathRow title="Talk to a person"
                    text="Crisis lines, benefits help, financial counseling, and community. Keel is not a substitute for people."
                    onClick={() => finish("support")} />
                )}
              </ul>
              <p className="helper">You can switch between these any time.</p>
              {saveError && <p className="error" role="alert">{saveError}</p>}
            </div>
          )}

          {isQuestion && (
            <WaterBar>
              <button className="link" onClick={() => go(-1)}>Back</button>
              <span className="count" aria-live="polite">
                <span className="sr-only">Question </span>{questionNumber} of {shown.length}
              </span>
              <span className="spacer" />
              <button className="quiet" onClick={skip}>Skip</button>
              <button className="primary" onClick={next}>Next</button>
            </WaterBar>
          )}
          {isQuestion && saveError && <p className="error" role="alert">{saveError}</p>}
        </>
      )}
    </section>
  );
}

function Question(props: { heading: React.ReactNode; why?: string; children: React.ReactNode }) {
  return (
    <div className="step">
      {props.heading}
      {props.why && <p className="why">{props.why}</p>}
      {props.children}
    </div>
  );
}

/** The action bar lives in the water, below the waterline. */
function WaterBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="waterbar">
      <div className="waterbar-inner">{children}</div>
    </div>
  );
}

function PathRow(props: { title: string; text: string; recommended?: boolean; onClick: () => void }) {
  return (
    <li>
      <button className={props.recommended ? "path recommended" : "path"} onClick={props.onClick}>
        <strong>{props.title}</strong>
        {props.recommended && <span className="suggested">Suggested for you</span>}
        <span className="path-text">{props.text}</span>
      </button>
    </li>
  );
}
