import { useEffect, useMemo, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { STAGES, promptsForStage, type StageId } from "../convex/journey";
import { getSessionId } from "./session";

const IMPACT_OPTIONS = [
  { id: "lost_job", label: "My role was eliminated" },
  { id: "job_changing", label: "My job still exists, but it's changing a lot" },
  { id: "worried", label: "Nothing has happened yet, but I'm worried" },
  { id: "exploring", label: "I want work that means more" },
] as const;

export default function App() {
  const sessionId = useMemo(getSessionId, []);
  const profile = useQuery(api.profiles.get, { sessionId });
  const upsertProfile = useMutation(api.profiles.upsert);
  const [stage, setStage] = useState<StageId>("ground");

  useEffect(() => {
    if (profile?.stage) setStage(profile.stage);
  }, [profile?.stage]);

  const goTo = (next: StageId) => {
    setStage(next);
    void upsertProfile({ sessionId, stage: next });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">Keel</p>
        <h1>AI changed your job. It didn't change who you are.</h1>
        <p className="lede">
          Let's start with what matters to you. The job search can wait.
        </p>
      </header>

      <nav className="stages" aria-label="Journey stages">
        {STAGES.map((s, i) => (
          <button
            key={s.id}
            className={s.id === stage ? "stage active" : "stage"}
            onClick={() => goTo(s.id)}
            disabled={s.id === "navigate"}
            aria-current={s.id === stage ? "step" : undefined}
          >
            <span className="num">{i + 1}</span>
            <span>{s.title}</span>
          </button>
        ))}
      </nav>

      <main>
        <h2 className="stage-question">{STAGES.find((s) => s.id === stage)?.question}</h2>
        {stage === "ground" && <Ground sessionId={sessionId} profile={profile} onNext={() => goTo("discover")} />}
        {stage === "discover" && <Discover sessionId={sessionId} onNext={() => goTo("declare")} />}
        {stage === "declare" && <Declare sessionId={sessionId} />}
      </main>

      <Footer sessionId={sessionId} />
    </div>
  );
}

type Profile = ReturnType<typeof useQuery<typeof api.profiles.get>>;

function Ground({ sessionId, profile, onNext }: { sessionId: string; profile: Profile; onNext: () => void }) {
  const upsert = useMutation(api.profiles.upsert);
  return (
    <section>
      <fieldset className="choices">
        <legend>Which of these sounds most like you?</legend>
        {IMPACT_OPTIONS.map((o) => (
          <label key={o.id} className={profile?.aiImpact === o.id ? "choice selected" : "choice"}>
            <input
              type="radio"
              name="impact"
              checked={profile?.aiImpact === o.id}
              onChange={() => upsert({ sessionId, aiImpact: o.id })}
            />
            {o.label}
          </label>
        ))}
      </fieldset>
      <Prompts sessionId={sessionId} stage="ground" />
      <button className="primary" onClick={onNext}>Continue to Discover</button>
    </section>
  );
}

function Prompts({ sessionId, stage }: { sessionId: string; stage: StageId }) {
  const saved = useQuery(api.reflections.list, { sessionId });
  const save = useMutation(api.reflections.save);
  return (
    <div className="prompts">
      {promptsForStage(stage).map((p) => (
        <ReflectionField
          key={p.id}
          question={p.question}
          helper={p.helper}
          initial={saved?.find((r) => r.promptId === p.id)?.response ?? ""}
          loaded={saved !== undefined}
          onSave={(response) => save({ sessionId, promptId: p.id, response })}
        />
      ))}
    </div>
  );
}

function ReflectionField(props: {
  question: string;
  helper?: string;
  initial: string;
  loaded: boolean;
  onSave: (text: string) => Promise<unknown>;
}) {
  const [text, setText] = useState(props.initial);
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (!touched) setText(props.initial);
  }, [props.initial, touched]);

  return (
    <label className="reflection">
      <span className="question">{props.question}</span>
      {props.helper && <span className="helper">{props.helper}</span>}
      <textarea
        rows={3}
        value={text}
        disabled={!props.loaded}
        placeholder="Optional. Skip anything you'd rather not answer."
        onChange={(e) => {
          setTouched(true);
          setText(e.target.value);
        }}
        onBlur={() => touched && props.onSave(text)}
      />
    </label>
  );
}

function Discover({ sessionId, onNext }: { sessionId: string; onNext: () => void }) {
  const catalog = useQuery(api.values.catalog, {});
  const mine = useQuery(api.values.list, { sessionId });
  const setRanked = useMutation(api.values.setRanked);
  const [custom, setCustom] = useState("");

  const chosen = (mine ?? []).map((v) => ({ name: v.name, catalogId: v.catalogId, whyItMatters: v.whyItMatters }));
  const isChosen = (name: string) => chosen.some((c) => c.name === name);

  const toggle = (name: string, catalogId?: string) => {
    const next = isChosen(name)
      ? chosen.filter((c) => c.name !== name)
      : chosen.length < 5
        ? [...chosen, { name, catalogId }]
        : chosen;
    void setRanked({ sessionId, values: next });
  };

  return (
    <section>
      <Prompts sessionId={sessionId} stage="discover" />

      <h3>Choose up to five core values</h3>
      <p className="helper">Pick them in order of importance. Think about your whole life, not just work.</p>

      {chosen.length > 0 && (
        <ol className="chosen">
          {chosen.map((c) => (
            <li key={c.name}>
              {c.name}
              <button className="link" onClick={() => toggle(c.name)} aria-label={`Remove ${c.name}`}>remove</button>
            </li>
          ))}
        </ol>
      )}

      <div className="value-grid">
        {catalog?.map((v) => (
          <button
            key={v.id}
            className={isChosen(v.name) ? "value selected" : "value"}
            onClick={() => toggle(v.name, v.id)}
            aria-pressed={isChosen(v.name)}
          >
            <strong>{v.name}</strong>
            <span>{v.description}</span>
          </button>
        ))}
      </div>

      <form
        className="custom"
        onSubmit={(e) => {
          e.preventDefault();
          if (custom.trim()) toggle(custom.trim());
          setCustom("");
        }}
      >
        <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Add your own value" />
        <button type="submit">Add</button>
      </form>

      <button className="primary" onClick={onNext} disabled={chosen.length === 0}>Continue to Declare</button>
    </section>
  );
}

function Declare({ sessionId }: { sessionId: string }) {
  const missions = useQuery(api.missions.list, { sessionId });
  const values = useQuery(api.values.list, { sessionId });
  const saveDraft = useMutation(api.missions.saveDraft);
  const accept = useMutation(api.missions.accept);
  const draftWithGuide = useAction(api.missions.draftWithGuide);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askGuide = async () => {
    setBusy(true);
    setError(null);
    try {
      setText(await draftWithGuide({ sessionId }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section>
      <p className="helper">
        A personal mission statement connects what you value to what you want your work to <em>do</em>.
        Write it yourself, or ask the guide for a first draft. Either way, it's yours to change.
      </p>
      {values && values.length > 0 && (
        <p className="values-line">Your values: {values.map((v) => v.name).join(" · ")}</p>
      )}

      <textarea
        className="mission-input"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="I want my work to…"
      />
      <div className="row">
        <button className="primary" disabled={!text.trim()} onClick={() => { void saveDraft({ sessionId, text, authoredBy: "person" }); }}>
          Save this version
        </button>
        <button onClick={askGuide} disabled={busy || !values?.length}>
          {busy ? "Drafting…" : "Ask the guide for a draft"}
        </button>
      </div>
      {error && <p className="error" role="alert">{error}</p>}

      {missions && missions.length > 0 && (
        <>
          <h3>Your versions</h3>
          <ul className="missions">
            {missions.map((m) => (
              <li key={m._id} className={m.status === "accepted" ? "mission accepted" : "mission"}>
                <p>{m.text}</p>
                <div className="meta">
                  <span>v{m.version} · {m.authoredBy === "guide_draft" ? "guide draft" : "written by you"}</span>
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

function Footer({ sessionId }: { sessionId: string }) {
  const data = useQuery(api.profiles.exportAll, { sessionId });
  const deleteEverything = useMutation(api.profiles.deleteEverything);

  const download = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "keel-export.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <footer>
      <p className="support">
        Keel is not a therapist or counselor. If this is weighing heavily on you, please talk with someone you trust.
        If you're in crisis, contact your local emergency number or a crisis line right away.
      </p>
      <div className="row">
        <button className="link" onClick={download} disabled={!data}>Download my data</button>
        <button
          className="link danger"
          onClick={() => {
            if (confirm("Permanently delete everything you've written in Keel?")) void deleteEverything({ sessionId });
          }}
        >
          Delete everything
        </button>
      </div>
    </footer>
  );
}
