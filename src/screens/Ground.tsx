import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import { sessionId } from "../session";
import { Prompts } from "../components/Prompts";
import {
  CLIENT_CHANGE,
  CONSTRAINTS,
  FIRST_NEED,
  ORIENTATION,
  RUNWAY,
  SEVERANCE,
  SITUATION,
  WORRY_REASON,
  labelFor,
} from "../content/onboarding";
import type { View } from "../App";

/** Stage 1: Ground. A summary of onboarding, the AI setting, and optional reflection. */
export function Ground({ profile, goTo }: { profile: Doc<"profiles"> | null; goTo: (v: View) => void }) {
  const upsert = useMutation(api.profiles.upsert);
  const restart = useMutation(api.profiles.restartOnboarding);
  const p = profile;

  const rows: [string, string | undefined][] = [
    ["What happened", labelFor(SITUATION, p?.aiImpact)],
    ...(p?.aiImpact === "lost_job" ? [["Severance", labelFor(SEVERANCE, p?.severance)] as [string, string | undefined]] : []),
    ...(p?.aiImpact === "drying_up"
      ? [["With your clients", p?.clientChange?.map((c) => labelFor(CLIENT_CHANGE, c)).join("; ") || undefined] as [string, string | undefined]]
      : []),
    ...(p?.aiImpact === "job_changing" ? [["What you miss most", p?.missMost || undefined] as [string, string | undefined]] : []),
    ...(p?.aiImpact === "worried" ? [["What's behind the worry", labelFor(WORRY_REASON, p?.worryReason)] as [string, string | undefined]] : []),
    ["Runway", labelFor(RUNWAY, p?.runway)],
    ["Most needed right now", labelFor(FIRST_NEED, p?.firstNeed)],
    ["Your work", [p?.work?.role, p?.work?.yearsBand].filter(Boolean).join(", ") || undefined],
    ["Whose story fits", labelFor(ORIENTATION, p?.workOrientation)],
    ["Keep in mind", p?.constraints?.map((c) => labelFor(CONSTRAINTS, c)).join("; ") || undefined],
    ["People who value your work", p?.valuedBy || undefined],
  ];

  return (
    <section>
      <h1 className="screen-title">Where you are right now</h1>
      <p className="helper">In your words. Change anything, any time.</p>

      <dl className="summary">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v ?? <span className="muted">Skipped</span>}</dd>
          </div>
        ))}
      </dl>
      <button onClick={() => restart({ sessionId })}>Edit my answers</button>

      <div className="block">
        <h2>AI in Keel</h2>
        <p className="helper">
          When on, AI only reflects your own words back and offers drafts you can change or discard. It never scores or
          judges you.
        </p>
        <label className="toggle">
          <input
            type="checkbox"
            checked={p?.aiPreference === "on"}
            onChange={(e) => upsert({ sessionId, aiPreference: e.target.checked ? "on" : "off" })}
          />
          <span>{p?.aiPreference === "on" ? "AI is on" : "AI is off"}</span>
        </label>
      </div>

      <div className="block">
        <h2>If you want to write more</h2>
        <Prompts stage="ground" />
      </div>

      <div className="actions closing lake">
        <button onClick={() => goTo("bridge")}>Steady ground</button>
        <button className="primary" onClick={() => goTo("discover")}>What matters to me</button>
      </div>
    </section>
  );
}
