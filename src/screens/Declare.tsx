import { useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import { sessionId } from "../session";

/** Stage 3: Declare. A personal mission statement, written by the person, optionally drafted with AI. */
export function Declare({ profile }: { profile: Doc<"profiles"> | null }) {
  const missions = useQuery(api.missions.list, { sessionId });
  const values = useQuery(api.values.list, { sessionId });
  const saveDraft = useMutation(api.missions.saveDraft);
  const accept = useMutation(api.missions.accept);
  const draftWithGuide = useAction(api.missions.draftWithGuide);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const aiOn = profile?.aiPreference === "on";
  const justAJob = profile?.workOrientation === "job";

  const askGuide = async () => {
    setBusy(true);
    setError(null);
    try {
      setText(await draftWithGuide({ sessionId }));
    } catch (e) {
      // Convex wraps server errors; show only the human-readable part.
      const msg = e instanceof Error ? e.message : "";
      setError(msg.split("Uncaught Error: ").pop()?.split("\n")[0] || "Something went wrong. Try again in a moment.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section>
      <h2 className="stage-question">{justAJob ? "How do you want to live?" : "What is your work for?"}</h2>
      <p className="helper">
        {justAJob
          ? "A personal mission statement can be about your whole life, not just work. A sentence or two about what matters and how you want to show up."
          : "A personal mission statement connects what you value to what you want your work to do. A sentence or two is plenty."}{" "}
        It's yours to write and change.
      </p>
      {values && values.length > 0 && (
        <p className="values-line">Your values: {values.map((v) => v.name).join(" · ")}</p>
      )}

      <textarea
        className="mission-input"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={justAJob ? "I want to live in a way that…" : "I want my work to…"}
      />
      <div className="row">
        <button className="primary" disabled={!text.trim()} onClick={() => { void saveDraft({ sessionId, text, authoredBy: "person" }); }}>
          Save this version
        </button>
        {aiOn && (
          <button onClick={askGuide} disabled={busy || !values?.length}>
            {busy ? "Drafting…" : "Ask for a first draft"}
          </button>
        )}
      </div>
      {!aiOn && (
        <p className="helper">AI is off, so this is all you. You can turn AI on in "Where you are" if you'd like a first draft.</p>
      )}
      {error && <p className="error" role="alert">{error}</p>}

      {missions && missions.length > 0 && (
        <>
          <h3>Your versions</h3>
          <ul className="missions">
            {missions.map((m) => (
              <li key={m._id} className={m.status === "accepted" ? "mission accepted" : "mission"}>
                <p>{m.text}</p>
                <div className="meta">
                  <span>v{m.version} · {m.authoredBy === "guide_draft" ? "AI draft" : "written by you"}</span>
                  {m.status === "accepted" ? (
                    <strong>Your mission</strong>
                  ) : (
                    <span className="row">
                      <button className="link" onClick={() => setText(m.text)}>Edit</button>
                      <button className="link" onClick={() => accept({ sessionId, missionId: m._id })}>This is mine</button>
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
