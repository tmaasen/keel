import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import { sessionId } from "../session";
import { Prompts } from "../components/Prompts";
import { CONSTRAINTS, FIRST_NEED, ORIENTATION, RUNWAY, SITUATION, labelFor } from "../content/onboarding";
import type { View } from "../App";

/** Stage 1: Ground. A summary of onboarding, the AI setting, and optional reflection. */
export function Ground({ profile, goTo }: { profile: Doc<"profiles"> | null; goTo: (v: View) => void }) {
  const upsert = useMutation(api.profiles.upsert);
  const restart = useMutation(api.profiles.restartOnboarding);
  const p = profile;

  const rows: [string, string | undefined][] = [
    ["What happened", labelFor(SITUATION, p?.aiImpact)],
    ["Runway", labelFor(RUNWAY, p?.runway)],
    ["Most needed right now", labelFor(FIRST_NEED, p?.firstNeed)],
    ["Your work", [p?.work?.role, p?.work?.yearsBand].filter(Boolean).join(", ") || undefined],
    ["Whose story fits", labelFor(ORIENTATION, p?.workOrientation)],
    ["Keep in mind", p?.constraints?.map((c) => labelFor(CONSTRAINTS, c)).join("; ") || undefined],
    ["People who value your work", p?.valuedBy || undefined],
  ];

  return (
    <section>
      <h2 className="stage-question">Where you are right now</h2>
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
        <h3>AI in Keel</h3>
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
        <h3>If you want to write more</h3>
        <Prompts stage="ground" />
      </div>

      <div className="actions">
        <button onClick={() => goTo("bridge")}>Steady ground</button>
        <button className="primary" onClick={() => goTo("discover")}>What matters to me</button>
      </div>
    </section>
  );
}
