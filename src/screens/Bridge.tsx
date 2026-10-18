import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import type { View } from "../App";
import { sessionId } from "../session";
import { TranslateWork } from "../components/TranslateWork";
import { bridgePlan, type FreelanceItem, type PrepareItem, type ProtectItem } from "../logic/journey";

const PROTECT: Record<ProtectItem, { title: string; body: React.ReactNode }> = {
  unemployment: {
    title: "Apply for unemployment now.",
    body: (
      <>
        Don't wait until savings run out; start dates and rules vary by state.{" "}
        <a href="https://www.usa.gov/unemployment-benefits" target="_blank" rel="noreferrer">Find your state's office</a>.
      </>
    ),
  },
  health: {
    title: "Keep health coverage.",
    body: (
      <>
        Losing job-based coverage usually opens a 60-day window on{" "}
        <a href="https://www.healthcare.gov/coverage-outside-open-enrollment/special-enrollment-period/" target="_blank" rel="noreferrer">HealthCare.gov</a>.
        COBRA is another option, but often costs more.
      </>
    ),
  },
  severance: {
    title: "Don't rush a severance agreement.",
    body: (
      <>
        You can usually ask for time to review it, and it's worth having someone look it over.{" "}
        <a href="https://www.lawhelp.org" target="_blank" rel="noreferrer">Free legal help</a>.
      </>
    ),
  },
  "211": {
    title: "Call 211 for local help with rent, food, and utilities.",
    body: (
      <>
        Telling landlords and lenders early often opens hardship options.{" "}
        <a href="https://www.211.org" target="_blank" rel="noreferrer">211.org</a>
      </>
    ),
  },
};

const SEVERANCE_DEADLINE = {
  title: "Before your severance deadline, slow down.",
  body: (
    <>
      You can usually ask for more time to review it, and some terms can be negotiated. Have someone look it over
      before you sign; signing often means giving up the right to bring claims later.{" "}
      <a href="https://www.lawhelp.org" target="_blank" rel="noreferrer">Free legal help</a>.
    </>
  ),
};

const PREPARE: Record<PrepareItem, { title: string; body: React.ReactNode }> = {
  buffer: {
    title: "Make a little breathing room.",
    body: "Write down what your essentials cost each month, and set aside what you can, even a small amount. Knowing the number takes some of the fear out of it.",
  },
  record: {
    title: "Keep a copy of your own record.",
    body: "Save your reviews, thank-you notes, and results somewhere personal. Only your own record, never your employer's confidential material.",
  },
  net: {
    title: "Learn your safety net before you need it.",
    body: (
      <>
        Look up how unemployment works in your state, and what happens to your health coverage if your job ends.{" "}
        <a href="https://www.usa.gov/unemployment-benefits" target="_blank" rel="noreferrer">Unemployment by state</a>.
      </>
    ),
  },
  reconnect: {
    title: "Reconnect while nothing is urgent.",
    body: "Send one friendly message to a former coworker or client. It's much easier now than later.",
  },
};

const FREELANCE: Record<FreelanceItem, React.ReactNode> = {
  pricing: <><strong>Price for the work, not the platform.</strong> Direct clients often pay more than platform rates. If rates are sliding, say what your judgment adds before you agree to less.</>,
  editing: <><strong>If clients want you to edit AI drafts,</strong> price it as editing, not as a discount on your craft, and name what you fix that the draft gets wrong.</>,
  past_clients: <><strong>Go back to past clients first,</strong> by email, not through the platform. They already trust your work.</>,
  niche: <><strong>Pick a niche you know</strong> and reach out to a few businesses in it directly, with a short example of what you'd do for them.</>,
  portfolio: <><strong>Keep a simple portfolio</strong> you control. For creative work, it speaks louder than a résumé.</>,
};

/**
 * Bridge track: steady ground for people who need income soon.
 * Framed as a bridge, not a verdict. Research: docs/USER_RESEARCH.md.
 * Only what applies is shown; "This week" comes first and can be checked off; everything else folds away.
 * Most links are US-focused for now.
 */
export function Bridge({ profile, goTo }: { profile: Doc<"profiles"> | null; goTo: (v: View) => void }) {
  const upsert = useMutation(api.profiles.upsert);
  // What this person sees is decided in src/logic/journey.ts (covered by the persona tests).
  const plan = bridgePlan(profile ?? {});
  const { freelancer, roleWork, needsFlex } = plan;
  const lostWork = plan.scripts === "lost";

  const [done, setDone] = useState<string[]>(profile?.bridgeDone ?? []);
  useEffect(() => setDone(profile?.bridgeDone ?? []), [profile?.bridgeDone]);
  const toggleDone = (id: string) => {
    const next = done.includes(id) ? done.filter((x) => x !== id) : [...done, id];
    setDone(next);
    void upsert({ sessionId, bridgeDone: next }).catch(() => setDone(done));
  };

  return (
    <section className="bridge">
      <h1 className="screen-title">Steady ground</h1>
      <p className="lede">
        {plan.thisWeek === "prepare"
          ? plan.prepareTone === "urgent"
            ? "If layoffs are coming, a few steps now can make a hard turn much easier. Take what's useful and skip the rest."
            : "Nothing here is urgent. A few quiet steps now can make a hard turn easier, if it ever comes. Take what's useful and skip the rest."
          : "Getting income and stability back isn't giving up on what matters to you. It's what makes the rest possible. Take what's useful here and skip the rest."}
      </p>

      {plan.thisWeek === "prepare" && (
        <section className="this-week" aria-labelledby="this-week-title">
          <h2 id="this-week-title">
            {plan.prepareTone === "gentle" ? "No rush: get ready, quietly" : "This week: get ready, quietly"}
          </h2>
          <ol className="week-list">
            {plan.prepare.map((item) => {
              const { title, body } = PREPARE[item];
              return (
                <WeekItem key={item} id={`prep-${item}`} done={done} onToggle={toggleDone} title={title}>{body}</WeekItem>
              );
            })}
          </ol>
        </section>
      )}

      {plan.thisWeek === "protect" && (
        <section className="this-week" aria-labelledby="this-week-title">
          <h2 id="this-week-title">This week: protect what you have</h2>
          <ol className="week-list">
            {plan.protect.map((item) => {
              const severanceDeadline = item === "severance" && profile?.aiImpact === "lost_job" && profile.severance === "deadline";
              const { title, body } = severanceDeadline ? SEVERANCE_DEADLINE : PROTECT[item];
              return (
                <WeekItem key={item} id={item} done={done} onToggle={toggleDone} title={title}>
                  {body}
                  {item === "unemployment" && freelancer && (
                    <> If you were freelance or self-employed, you may not qualify for regular unemployment, but check with your state anyway.</>
                  )}
                </WeekItem>
              );
            })}
          </ol>
        </section>
      )}

      <Fold id="reach-out" title="Reach back out to people who value your work">
        <p>
          The people who helped most in our research weren't job boards. They were former managers, clients, and
          coworkers. Some people were even asked back after AI didn't work out, usually as contractors.
        </p>
        <p className="helper">Replace anything in [brackets] before you send it.</p>
        {profile?.valuedBy && (
          <p className="callout">You mentioned: <em>{profile.valuedBy}</em></p>
        )}
        <Script title="To a former client or manager">
          {lostWork
            ? `Hi [name], I hope you're doing well. My situation has changed and I'm looking for ${roleWork} again. You know my work better than most, so I wanted to reach out first. If anything comes up, or if you know someone who could use help, I'd be grateful.`
            : "Hi [name], I hope you're doing well. I've been thinking about what's next in my work, and you know my work better than most. Would you be up for a quick call sometime? I'd value your perspective."}
        </Script>
        <Script title="To a former coworker">
          {`Hey [name], it's been a while. ${lostWork ? "I'm looking for my next thing" : "I've been thinking about what's next for me"} and thought of you. Would you be up for a quick call sometime? I'd love to hear how things are going for you, too.`}
        </Script>
        <Script title="To someone doing work you're curious about">
          Hi [name], I came across your work at [organization] and I'm exploring [kind of work]. Would you be open to a
          15-minute call about how you got into it and what the work is really like? No pressure either way.
        </Script>
        <p className="helper">
          Ask people about their work rather than asking them for a job. It's easier to say yes to, and it's how many
          people in our research actually found their next role.
        </p>
        <p className="helper">
          <strong>If you're asked back as a contractor:</strong> what you know about how things really work there has
          value. Contract work doesn't come with benefits, paid time off, or job security, so a common rule of thumb is
          to charge well above your old hourly pay.
        </p>
      </Fold>

      <Fold id="your-words" title="Put your experience into words">
        <TranslateWork profile={profile} />
      </Fold>

      {freelancer && (
        <Fold id="clients" title="Finding clients off the platforms">
          <p>
            Freelancers in our research described platforms burying them despite years of five-star work. What helped
            was owning the relationship directly.
          </p>
          <ul className="rows">
            {plan.freelance.map((item) => <li key={item}>{FREELANCE[item]}</li>)}
          </ul>
        </Fold>
      )}

      <Fold id="bridge-income" title="Bridge income">
        <p>
          A bridge job isn't a verdict on who you are. People in our research drove school buses, tended bar, and took
          contract work while they figured out what was next.
          {needsFlex && <strong> Since you need flexibility, look first at the options marked "flexible."</strong>}
        </p>
        <ul className="rows">
          <li><strong>Contract or temp work in your field</strong> through staffing agencies. Often the fastest path to pay that matches your experience.</li>
          <li><strong>Consulting or project work</strong> for past employers or clients. <span className="tag">flexible</span></li>
          <li><strong>Teaching or tutoring what you know,</strong> privately or through community programs. <span className="tag">flexible</span></li>
          <li><strong>Hourly work with quick starts:</strong> retail, hospitality, delivery, warehouse, transit. Seasonal hiring picks up before the holidays.</li>
          <li><strong>Your local American Job Center</strong> offers free help and often knows who's hiring now. <a href="https://www.careeronestop.org" target="_blank" rel="noreferrer">CareerOneStop</a></li>
        </ul>
      </Fold>

      <Fold id="footing" title="Keep your footing">
        <ul className="rows">
          <li><strong>Keep a daily rhythm.</strong> A job gives structure without our noticing. Keep a wake-up time and a few anchors in your day.</li>
          <li><strong>Cap the search.</strong> A few focused hours on a few days a week beats all day, every day. Some people apply every other day just to keep from burning out, and that's sensible.</li>
          <li><strong>Favor people over portals.</strong> Hundreds of cold applications wear you down. A handful of warm conversations usually go further.</li>
          <li><strong>See people.</strong> Plan at least one thing a week with other people: a friend, a job club at the library, a volunteer shift.</li>
          <li><strong>Do one useful thing a day,</strong> even something small. Being useful matters as much as being paid.</li>
        </ul>
      </Fold>

      <Fold id="family" title="Explaining it to the people around you">
        <p>
          Family and friends often mean well and still say things like "just get a job in AI." It can help to tell them
          what's actually going on, and what would help.
        </p>
        <Script title="To family or friends">
          The job market right now isn't what it was. A lot of experienced people are applying to hundreds of jobs and
          hearing nothing back, and it isn't about effort. What would help me most is [encouragement / introductions to
          people you know / not asking about it every day]. I'll tell you when there's news.
        </Script>
      </Fold>

      <Fold id="new-path" title="Before you invest in a new path">
        <p>
          No one can tell you which jobs AI won't touch, including us. Some people in our research retrained into
          something AI then hit too. So instead of looking for a safe bet, test before you spend months or savings:
        </p>
        <ul className="rows">
          <li>Are employers actually hiring people with this training near me?</li>
          <li>How long and how much does it cost? Can I earn while I train?</li>
          <li>Does it rely on judgment, physical presence, trust, or accountability that people still want from a person?</li>
          <li>Have I talked to two people who do this work today?</li>
          <li>Can I try it small first, like a weekend, a short course, or shadowing someone, before committing?</li>
        </ul>
      </Fold>

      <div className="actions closing lake">
        <button className="quiet" onClick={() => goTo("support")}>Talk to a person</button>
        <button className="primary" onClick={() => goTo("discover")}>When you're ready: what matters to me</button>
      </div>
    </section>
  );
}

/** One "This week" item: a fixed row whose done state restyles it in place. */
function WeekItem(props: {
  id: string;
  title: string;
  done: string[];
  onToggle: (id: string) => void;
  children: React.ReactNode;
}) {
  const isDone = props.done.includes(props.id);
  return (
    <li className={isDone ? "week-item done" : "week-item"}>
      <div className="week-body">
        <strong>{props.title}</strong> {props.children}
      </div>
      <label className="week-check">
        <input type="checkbox" checked={isDone} onChange={() => props.onToggle(props.id)} />
        <span>{isDone ? "Done" : "Mark done"}</span>
      </label>
    </li>
  );
}

function Fold(props: { id: string; title: string; children: React.ReactNode }) {
  return (
    <details className="fold" id={props.id}>
      <summary>
        <h2>{props.title}</h2>
      </summary>
      <div className="fold-body">{props.children}</div>
    </details>
  );
}

function Script(props: { title: string; children: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const copy = async () => {
    try {
      if (!navigator.clipboard) throw new Error("no clipboard");
      await navigator.clipboard.writeText(props.children);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  };
  useEffect(() => {
    if (status !== "copied") return;
    const t = setTimeout(() => setStatus("idle"), 2500);
    return () => clearTimeout(t);
  }, [status]);
  return (
    <div className="script">
      <div className="script-head">
        <span>{props.title}</span>
        <button className="link" onClick={copy}>{status === "copied" ? "Copied" : "Copy"}</button>
      </div>
      <p>{props.children}</p>
      <p className="helper" role="status">
        {status === "copied" && "Copied. You can paste it into an email or message."}
        {status === "failed" && "Couldn't copy automatically. Press and hold the text above to select and copy it."}
      </p>
    </div>
  );
}
