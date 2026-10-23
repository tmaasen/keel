import { useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import type { View } from "../App";
import { sessionId } from "../session";
import { humanError } from "../errors";
import { downloadExport } from "../exportMarkdown";

/** Stage 3: Declare. A personal mission statement, written by the person, optionally drafted with AI. */
export function Declare({ profile, goTo }: { profile: Doc<"profiles"> | null; goTo: (v: View) => void }) {
  const missions = useQuery(api.missions.list, { sessionId });
  const values = useQuery(api.values.list, { sessionId });
  const exportData = useQuery(api.profiles.exportAll, { sessionId });
  const saveDraft = useMutation(api.missions.saveDraft);
  const accept = useMutation(api.missions.accept);
  const draftWithGuide = useAction(api.missions.draftWithGuide);
  const aiStatus = useQuery(api.missions.aiStatus, { sessionId });
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const aiOn = profile?.aiPreference === "on";
  const resting = aiStatus?.resting;
  const justAJob = profile?.workOrientation === "job";
  const accepted = missions?.find((m) => m.status === "accepted");

  const askGuide = async () => {
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      setText(await draftWithGuide({ sessionId }));
      setStatus(
        "Here's a first draft. It's saved below as an AI draft. Change anything that isn't true and save it as your own, or choose \"This is mine\" if it already fits.",
      );
    } catch (e) {
      setError(humanError(e));
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setError(null);
    // The same words are already saved (often the AI draft, unchanged): don't make a duplicate.
    if (missions?.some((m) => m.text.trim() === trimmed)) {
      setStatus('That version is already saved below. When it feels true, choose "This is mine."');
      return;
    }
    try {
      await saveDraft({ sessionId, text: trimmed, authoredBy: "person" });
      setStatus('Saved below as a new version. When one feels true, choose "This is mine."');
    } catch (e) {
      setError(humanError(e));
    }
  };

  return (
    <section>
      <h1 className="screen-title">{justAJob ? "How do you want to live?" : "What is your work for?"}</h1>

      {accepted && (
        <section className="mission-mine" aria-labelledby="mission-mine-title">
          <h2 id="mission-mine-title">Your mission</h2>
          <p>{accepted.text}</p>
          <p className="helper">It's yours. You can write a new version and choose it any time.</p>
        </section>
      )}

      <p className="helper">
        {justAJob
          ? "A personal mission statement can be about your whole life, not just work. A sentence or two about what matters and how you want to show up."
          : "A personal mission statement connects what you value to what you want your work to do. A sentence or two is plenty."}{" "}
        It's yours to write and change.
      </p>
      {values && values.length > 0 && (
        <p className="values-line">Your values: {values.map((v) => v.name).join(" · ")}</p>
      )}

      <label className="sr-only" htmlFor="mission-text">Your mission statement</label>
      <textarea
        id="mission-text"
        className="mission-input"
        rows={4}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setStatus(null);
        }}
        placeholder={justAJob ? "I want to live in a way that…" : "I want my work to…"}
      />
      <div className="row">
        <button className="primary" disabled={!text.trim()} onClick={() => void save()}>
          Save this version
        </button>
        {aiOn && !resting && (
          <button onClick={askGuide} disabled={busy || !values?.length}>
            {busy ? "Drafting…" : "Ask for a first draft"}
          </button>
        )}
      </div>
      <p className="helper" role="status">{status}</p>
      {!aiOn && (
        <p className="helper">AI is off, so this is all you. You can turn AI on in "Where you are" if you'd like a first draft.</p>
      )}
      {aiOn && resting && <p className="helper">{resting}</p>}
      {error && <p className="error" role="alert">{error}</p>}

      {missions && missions.length > 0 && (
        <>
          <h2>Your versions</h2>
          {!accepted && (
            <p className="helper">When a version feels true, choose "This is mine." You can change it any time.</p>
          )}
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
                      <button className="link" onClick={() => { setText(m.text); setStatus(null); }}>Edit</button>
                      <button
                        className="link"
                        onClick={() => {
                          void accept({ sessionId, missionId: m._id });
                          setStatus(null);
                          window.scrollTo({ top: 0 });
                        }}
                      >
                        This is mine
                      </button>
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {accepted && (
        <div className="closing lake mission-next">
          <h2>What comes next</h2>
          <p>
            Next, Keel will help you find work that fits your mission. That part is being built now. Until then, keep
            what you wrote, and come back any time.
          </p>
          <div className="row">
            <button className="primary" onClick={() => exportData && downloadExport(exportData, "md")} disabled={!exportData}>
              Save what I wrote
            </button>
            <button className="quiet" onClick={() => goTo("bridge")}>Back to Steady ground</button>
          </div>
        </div>
      )}
    </section>
  );
}
