import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import { sessionId } from "../session";
import { MultiChoice, SingleChoice } from "../components/Choices";
import { SupportList } from "./Support";
import { acknowledgment } from "../content/acknowledgment";
import {
  AI_CHOICE,
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
const QUESTION_COUNT = STEPS.length - 3; // excludes welcome, acknowledge, start

export function Onboarding({ profile, onDone }: { profile: Profile | null; onDone: (view: View) => void }) {
  const upsert = useMutation(api.profiles.upsert);
  const [i, setI] = useState(0);
  const [a, setA] = useState<Answers>(profile ?? {});
  const [feelings, setFeelings] = useState<FeelingId[]>([]);
  const [showSupport, setShowSupport] = useState(false);
  const step: Step = STEPS[i];

  const set = (patch: Answers) => setA((prev) => ({ ...prev, ...patch }));
  const save = (patch: ProfileInput) => upsert({ sessionId, ...patch });

  /** Fields each step owns, so "Next" saves only that step's answers. */
  const fieldsFor = (s: Step): ProfileInput => {
    switch (s) {
      case "name": return { displayName: a.displayName ?? "" };
      case "situation": return { aiImpact: a.aiImpact };
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
    setI((n) => Math.min(Math.max(n + delta, 0), STEPS.length - 1));
    window.scrollTo({ top: 0 });
  };
  const next = async () => {
    await save(fieldsFor(step));
    if (step === "feelings" && feelings.includes("struggling") && !showSupport) {
      setShowSupport(true);
      return;
    }
    setShowSupport(false);
    go(1);
  };
  const skip = async () => {
    if (step === "ai") await save({ aiPreference: "off" });
    setShowSupport(false);
    go(1);
  };

  const bridgeFirst = a.runway === "under_1m" || a.runway === "1_2m" || a.firstNeed === "income";
  const finish = async (view: View) => {
    await save({ onboardingCompletedAt: Date.now() });
    onDone(view);
  };

  const questionNumber = i; // welcome is 0
  const isQuestion = step !== "welcome" && step !== "acknowledge" && step !== "start";

  return (
    <section className="onboarding">
      {isQuestion && (
        <p className="progress" aria-live="polite">
          {questionNumber} of {QUESTION_COUNT}
        </p>
      )}

      {showSupport ? (
        <Card title="Thank you for telling us.">
          <p>
            It sounds like things are really hard right now. You don't have to figure out your career today. Talking to
            someone can help, whether that's a person you trust or one of the people below.
          </p>
          <SupportList />
          <div className="actions">
            <button className="primary" onClick={() => { setShowSupport(false); go(1); }}>
              Continue when you're ready
            </button>
          </div>
        </Card>
      ) : (
        <>
          {step === "welcome" && (
            <div className="card welcome">
              <h1>AI changed your work. It didn't change who you are.</h1>
              <p className="lede">
                Keel helps you get steady, then figure out what matters to you and find work that fits. It's free, and
                it's on your side.
              </p>
              <ul className="facts">
                <li><strong>About 5 minutes.</strong> Every question can be skipped.</li>
                <li><strong>Your answers are private.</strong> Not sold, not shared with employers, deletable any time.</li>
                <li>
                  <strong>AI is optional.</strong> If you turn it on, it only reflects your own words back and offers
                  drafts you can change. It never scores, ranks, or judges you.
                </li>
              </ul>
              <button className="primary" onClick={() => go(1)}>Let's start</button>
            </div>
          )}

          {step === "name" && (
            <Card title="What should we call you?" why="So this feels like a conversation, not a form.">
              <input
                value={a.displayName ?? ""}
                onChange={(e) => set({ displayName: e.target.value })}
                placeholder="First name or nickname"
                autoFocus
              />
            </Card>
          )}

          {step === "situation" && (
            <Card title="What happened to your work?" why="There's more than one way this happens. Each one needs something different.">
              <SingleChoice name="situation" options={SITUATION} value={a.aiImpact}
                onChange={(id) => set({ aiImpact: id as Profile["aiImpact"] })} />
            </Card>
          )}

          {step === "runway" && (
            <Card
              title="If no new income came in, how long could you cover essentials like rent, food, and bills?"
              why="If you need income soon, we won't make you wait on reflection first."
            >
              <SingleChoice name="runway" options={RUNWAY} value={a.runway}
                onChange={(id) => set({ runway: id as Profile["runway"] })} />
            </Card>
          )}

          {step === "firstNeed" && (
            <Card title="What do you need most right now?" why="You know better than we do what comes first.">
              <SingleChoice name="firstNeed" options={FIRST_NEED} value={a.firstNeed}
                onChange={(id) => set({ firstNeed: id as Profile["firstNeed"] })} />
            </Card>
          )}

          {step === "work" && (
            <Card title="Tell us a little about your work." why="Your experience is worth more than a job title. We'll help you see what carries over.">
              <label className="field">
                <span>What do you do, or what did you do?</span>
                <input
                  value={a.work?.role ?? ""}
                  onChange={(e) => set({ work: { ...a.work, role: e.target.value } })}
                  placeholder="e.g. freelance copywriter, support lead, illustrator"
                />
              </label>
              <label className="field">
                <span>For how long?</span>
                <select value={a.work?.yearsBand ?? ""} onChange={(e) => set({ work: { ...a.work, yearsBand: e.target.value || undefined } })}>
                  <option value="">Choose…</option>
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </label>
              <p className="field-label">How much of who you are was tied to this work?</p>
              <SingleChoice name="identity" options={IDENTITY_TIE} value={a.identityTie}
                onChange={(id) => set({ identityTie: id as Profile["identityTie"] })} />
            </Card>
          )}

          {step === "orientation" && (
            <Card title="Whose story sounds most like yours?" why="There's no right answer. People find meaning in different places, and Keel should respect yours.">
              <SingleChoice
                name="orientation"
                options={ORIENTATION.map((o) => ({ id: o.id, label: o.name, hint: o.story }))}
                value={a.workOrientation}
                onChange={(id) => set({ workOrientation: id as Profile["workOrientation"] })}
              />
            </Card>
          )}

          {step === "constraints" && (
            <Card title="What should we keep in mind?" why="So we only suggest things that fit your real life. Choose any that apply.">
              <MultiChoice options={CONSTRAINTS} value={a.constraints ?? []}
                onChange={(ids) => set({ constraints: ids as Profile["constraints"] })} />
            </Card>
          )}

          {step === "valuedBy" && (
            <Card
              title="Who still knows your work and values it?"
              why="A former manager, a client, a coworker. People who know your work often matter more than any job board."
            >
              <textarea rows={3} value={a.valuedBy ?? ""} onChange={(e) => set({ valuedBy: e.target.value })}
                placeholder="Names or roles are fine. Only you will see this." />
            </Card>
          )}

          {step === "feelings" && (
            <Card title="How are you feeling about all of this?" why="Change like this can be heavy. This isn't saved. It just helps us meet you where you are.">
              <MultiChoice options={FEELINGS} value={feelings} onChange={(ids) => setFeelings(ids as FeelingId[])} />
            </Card>
          )}

          {step === "ai" && (
            <Card title="How should Keel use AI?" why="We know it may feel strange to see AI here. It's your choice, and you can change it any time.">
              <SingleChoice name="ai" options={AI_CHOICE} value={a.aiPreference}
                onChange={(id) => set({ aiPreference: id as Profile["aiPreference"] })} />
              <p className="helper">
                Either way: AI never decides anything for you, never rates you, and nothing is shared with employers.
              </p>
            </Card>
          )}

          {step === "acknowledge" && (
            <div className="card acknowledge">
              {a.displayName && <p className="eyebrow">{a.displayName},</p>}
              {acknowledgment(a, feelings).map((line) => <p key={line}>{line}</p>)}
              <button className="primary" onClick={() => go(1)}>Thank you</button>
            </div>
          )}

          {step === "start" && (
            <div className="card">
              <h2>Where would you like to start?</h2>
              {a.firstNeed === "rest" && (
                <p>
                  Rest is allowed. Nothing here is on a clock. You can look around, or just come back when you're ready.
                  Your answers are saved in this browser.
                </p>
              )}
              <div className="paths">
                <PathCard
                  recommended={bridgeFirst}
                  title="Steady ground"
                  text="Practical help for right now: benefits, health coverage, reaching back out to people who value your work, and bridge income."
                  onClick={() => finish("bridge")}
                />
                <PathCard
                  recommended={!bridgeFirst}
                  title="What matters to me"
                  text="Reflect on your values and your life outside work, then write a personal mission statement in your own words."
                  onClick={() => finish("discover")}
                />
                <PathCard
                  title="Talk to a person"
                  text="Crisis lines, benefits help, financial counseling, and community. Keel is not a substitute for people."
                  onClick={() => finish("support")}
                />
              </div>
              <p className="helper">You can switch between these any time.</p>
            </div>
          )}
        </>
      )}

      {isQuestion && !showSupport && (
        <div className="actions">
          <button className="link" onClick={() => go(-1)}>Back</button>
          <span className="spacer" />
          <button onClick={skip}>Skip</button>
          <button className="primary" onClick={next}>Next</button>
        </div>
      )}
    </section>
  );
}

function Card(props: { title: string; why?: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <h2>{props.title}</h2>
      {props.why && <p className="why">{props.why}</p>}
      {props.children}
    </div>
  );
}

function PathCard(props: { title: string; text: string; recommended?: boolean; onClick: () => void }) {
  return (
    <button className={props.recommended ? "path recommended" : "path"} onClick={props.onClick}>
      {props.recommended && <span className="badge">Suggested for you</span>}
      <strong>{props.title}</strong>
      <span>{props.text}</span>
    </button>
  );
}
