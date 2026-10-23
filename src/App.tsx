import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { sessionId } from "./session";
import { Onboarding } from "./screens/Onboarding";
import { Ground } from "./screens/Ground";
import { Bridge } from "./screens/Bridge";
import { Discover } from "./screens/Discover";
import { Declare } from "./screens/Declare";
import { Support } from "./screens/Support";
import { downloadExport } from "./exportMarkdown";
import { Feedback } from "./components/Feedback";
import { Horizon } from "./components/Horizon";

export type View = "ground" | "bridge" | "discover" | "declare" | "support";

const NAV: { id: View; label: string }[] = [
  { id: "ground", label: "Where you are" },
  { id: "bridge", label: "Steady ground" },
  { id: "discover", label: "What matters" },
  { id: "declare", label: "Your mission" },
];

/** How high the sun stands on each screen: the journey rises from Ground to Declare; Steady ground holds still. */
const RISE: Record<View, number> = { ground: 0.35, bridge: 0.5, discover: 0.65, declare: 0.85, support: 0.5 };

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
  // During onboarding, support opens over the flow; the flow stays mounted so nobody loses their place.
  const [supportOverOnboarding, setSupportOverOnboarding] = useState(false);
  const [onboardingRise, setOnboardingRise] = useState(0.12);
  const onRise = useCallback((r: number) => setOnboardingRise(r), []);

  useEffect(() => {
    try { localStorage.setItem(VIEW_KEY, view); } catch { /* storage unavailable */ }
  }, [view]);

  const goTo = (next: View) => {
    setView(next);
    window.scrollTo({ top: 0 });
  };

  const onboarding = !profile?.onboardingCompletedAt;

  useEffect(() => {
    if (profile === undefined || onboarding) return; // onboarding titles each question itself
    const label = view === "support" ? "Talk to a person" : NAV.find((n) => n.id === view)?.label;
    document.title = label ? `${label} · Keel` : "Keel";
  }, [view, onboarding, profile]);
  const rise = profile === undefined ? 0.12 : onboarding ? onboardingRise : RISE[view];

  return (
    <>
      <a className="skip-link" href="#content">Skip to content</a>
      <TesterStrip onFeedback={() => setFeedbackOpen(true)} />
      <Horizon rise={rise}>
        <span className="brand">
          <img className="brand-mark" src="/favicon.svg" alt="" width="32" height="32" />
          Keel
        </span>
        <button
          className="link on-sky"
          onClick={() => {
            if (onboarding) {
              setSupportOverOnboarding(true);
              window.scrollTo({ top: 0 });
            } else {
              goTo("support");
            }
          }}
        >
          Talk to a person
        </button>
      </Horizon>

      {profile !== undefined && !onboarding && (
        <nav className="tabs" aria-label="Sections">
          <div className="tabs-inner">
            {NAV.map((n) => (
              <button
                key={n.id}
                className={n.id === view ? "tab active" : "tab"}
                onClick={() => goTo(n.id)}
                aria-current={n.id === view ? "page" : undefined}
              >
                {n.label}
              </button>
            ))}
          </div>
        </nav>
      )}

      <div className="page" id="content">
        {profile === undefined ? (
          <p className="muted" role="status">Loading…</p>
        ) : onboarding ? (
          <>
            {supportOverOnboarding && (
              <main>
                <Support onBack={() => setSupportOverOnboarding(false)} />
              </main>
            )}
            <main hidden={supportOverOnboarding}>
              <Onboarding profile={profile} onDone={goTo} onRise={onRise} />
            </main>
          </>
        ) : (
          <main>
            {view === "ground" && <Ground profile={profile} goTo={goTo} />}
            {view === "bridge" && <Bridge profile={profile} goTo={goTo} />}
            {view === "discover" && <Discover onNext={() => goTo("declare")} />}
            {view === "declare" && <Declare profile={profile} goTo={goTo} />}
            {view === "support" && <Support />}
          </main>
        )}

        <Footer onboarding={onboarding} onFeedback={() => setFeedbackOpen(true)} />
      </div>
      <Feedback screen={onboarding ? "onboarding" : view} open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </>
  );
}

function TesterStrip({ onFeedback }: { onFeedback: () => void }) {
  return (
    <div className="tester-strip">
      <span>Keel is in testing.</span>
      <button className="link" onClick={onFeedback}>Share feedback</button>
    </div>
  );
}

function Footer({ onboarding, onFeedback }: { onboarding: boolean; onFeedback: () => void }) {
  const data = useQuery(api.profiles.exportAll, { sessionId });
  const deleteEverything = useMutation(api.profiles.deleteEverything);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const download = (format: "md" | "json") => {
    if (data) downloadExport(data, format);
  };

  return (
    <footer className="lake">
      <p className="crisis-line">
        Keel is not a therapist or counselor. If you're in crisis, <a href="tel:988">call</a> or{" "}
        <a href="sms:988">text 988</a> (US and Canada), or your local emergency number.
      </p>

      {!onboarding && (
        <div className="footer-groups">
          <div className="footer-group">
            <h2 className="footer-heading">Your writing</h2>
            <button className="link" onClick={() => download("md")} disabled={!data}>Save what I wrote</button>
            <button className="link" onClick={() => download("json")} disabled={!data}>Download all data (JSON)</button>
          </div>
          <div className="footer-group">
            <h2 className="footer-heading">Keel</h2>
            <button className="link" onClick={onFeedback}>Share feedback</button>
            <a className="link" href="https://github.com/tmaasen/keel" target="_blank" rel="noreferrer">
              Source code (opens in a new tab)
            </a>
          </div>
        </div>
      )}

      {/* Destructive action stands alone, away from everything else. */}
      {!onboarding && (
        <div className="danger-zone">
          {confirmingDelete ? (
            <div role="alertdialog" aria-labelledby="delete-q" aria-describedby="delete-d">
              <p id="delete-q"><strong>Delete everything you've written in Keel?</strong></p>
              <p id="delete-d" className="helper">
                Your answers, reflections, values, and mission are removed for good. This can't be undone. You may want
                to save what you wrote first.
              </p>
              <div className="row">
                <button className="danger-solid" onClick={() => void deleteEverything({ sessionId })}>
                  Delete everything
                </button>
                <button className="quiet" onClick={() => setConfirmingDelete(false)} autoFocus>
                  Keep my writing
                </button>
              </div>
            </div>
          ) : (
            <button className="link danger" onClick={() => setConfirmingDelete(true)}>Delete everything</button>
          )}
        </div>
      )}
    </footer>
  );
}
