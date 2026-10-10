import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { sessionId } from "./session";
import { Onboarding } from "./screens/Onboarding";
import { Ground } from "./screens/Ground";
import { Bridge } from "./screens/Bridge";
import { Discover } from "./screens/Discover";
import { Declare } from "./screens/Declare";
import { Support } from "./screens/Support";
import { Feedback } from "./components/Feedback";

export type View = "ground" | "bridge" | "discover" | "declare" | "support";

const NAV: { id: View; label: string }[] = [
  { id: "ground", label: "Where you are" },
  { id: "bridge", label: "Steady ground" },
  { id: "discover", label: "What matters" },
  { id: "declare", label: "Your mission" },
];

const VIEW_KEY = "keel.view";
const readView = (): View => {
  try {
    const v = localStorage.getItem(VIEW_KEY) as View | null;
    return v && ["ground", "bridge", "discover", "declare", "support"].includes(v) ? v : "ground";
  } catch {
    return "ground";
  }
};

export default function App() {
  const profile = useQuery(api.profiles.get, { sessionId });
  const [view, setView] = useState<View>(readView);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(VIEW_KEY, view); } catch { /* storage unavailable */ }
  }, [view]);

  const goTo = (next: View) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (profile === undefined) return <div className="page"><p className="muted">Loading…</p></div>;

  const onboarding = !profile?.onboardingCompletedAt;

  return (
    <div className="page">
      <TesterBanner onFeedback={() => setFeedbackOpen(true)} />

      <header className="topbar">
        <span className="brand">Keel</span>
        <button className="link" onClick={() => goTo("support")}>Talk to a person</button>
      </header>

      {onboarding ? (
        <Onboarding profile={profile} onDone={goTo} />
      ) : (
        <>
          <nav className="stages" aria-label="Sections">
            {NAV.map((n) => (
              <button
                key={n.id}
                className={n.id === view ? "stage active" : "stage"}
                onClick={() => goTo(n.id)}
                aria-current={n.id === view ? "page" : undefined}
              >
                {n.label}
              </button>
            ))}
            <button className="stage" disabled title="Coming soon">Find work that fits</button>
          </nav>

          <main>
            {view === "ground" && <Ground profile={profile} goTo={goTo} />}
            {view === "bridge" && <Bridge profile={profile} goTo={goTo} />}
            {view === "discover" && <Discover onNext={() => goTo("declare")} />}
            {view === "declare" && <Declare profile={profile} />}
            {view === "support" && <Support />}
          </main>
        </>
      )}

      <Footer onFeedback={() => setFeedbackOpen(true)} />
      <Feedback screen={onboarding ? "onboarding" : view} open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </div>
  );
}

function TesterBanner({ onFeedback }: { onFeedback: () => void }) {
  return (
    <div className="tester-banner">
      <span>
        <strong>Early test version.</strong> Your answers are saved only in this browser. Your feedback shapes what Keel
        becomes.
      </span>
      <button className="link" onClick={onFeedback}>Share feedback</button>
    </div>
  );
}

function Footer({ onFeedback }: { onFeedback: () => void }) {
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
        Keel is free, open source, and on your side. It's not a therapist or counselor. If you're in crisis, call or
        text 988 (US and Canada) or your local emergency number.
      </p>
      <div className="row">
        <button className="link" onClick={onFeedback}>Share feedback</button>
        <button className="link" onClick={download} disabled={!data}>Download my data</button>
        <button
          className="link danger"
          onClick={() => {
            if (confirm("Permanently delete everything you've written in Keel?")) void deleteEverything({ sessionId });
          }}
        >
          Delete everything
        </button>
        <a className="link" href="https://github.com/tmaasen/keel" target="_blank" rel="noreferrer">Source code</a>
      </div>
    </footer>
  );
}
