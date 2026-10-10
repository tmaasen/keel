import type { Doc } from "../../convex/_generated/dataModel";
import type { View } from "../App";

/**
 * Bridge track: steady ground for people who need income soon.
 * Framed as a bridge, not a verdict. Research: docs/USER_RESEARCH.md.
 * Most links are US-focused for now.
 */
export function Bridge({ profile, goTo }: { profile: Doc<"profiles"> | null; goTo: (v: View) => void }) {
  const freelancer = profile?.aiImpact === "drying_up";
  const stillEmployed = profile?.aiImpact === "job_changing" || profile?.runway === "has_income";
  const needsFlex = profile?.constraints?.some((c) => c === "flexible_hours" || c === "caregiver");

  return (
    <section className="bridge">
      <h2 className="stage-question">Steady ground first.</h2>
      <p className="helper">
        Getting income and stability back isn't giving up on what matters to you. It's what makes the rest possible.
        Take what's useful here and skip the rest.
      </p>

      {!stillEmployed && (
        <Block title="This week: protect what you have">
          <ul className="checklist">
            <li>
              <strong>Apply for unemployment now.</strong> Don't wait until savings run out; start dates and rules
              vary by state. <a href="https://www.usa.gov/unemployment-benefits" target="_blank" rel="noreferrer">Find your state's office</a>.
              {freelancer && (
                <em> If you were freelance or self-employed, you may not qualify for regular unemployment, but check with your state anyway.</em>
              )}
            </li>
            <li>
              <strong>Keep health coverage.</strong> Losing job-based coverage usually opens a 60-day window on{" "}
              <a href="https://www.healthcare.gov/coverage-outside-open-enrollment/special-enrollment-period/" target="_blank" rel="noreferrer">HealthCare.gov</a>.
              COBRA is another option, but often costs more.
            </li>
            <li>
              <strong>Don't rush a severance agreement.</strong> You can usually ask for time to review it, and it's worth
              having someone look it over. <a href="https://www.lawhelp.org" target="_blank" rel="noreferrer">Free legal help</a>.
            </li>
            <li>
              <strong>Call 211</strong> for local help with rent, food, and utilities. Telling landlords and lenders early
              often opens hardship options. <a href="https://www.211.org" target="_blank" rel="noreferrer">211.org</a>
            </li>
          </ul>
        </Block>
      )}

      <Block title="Reach back out to people who value your work">
        <p>
          The people who helped most in our research weren't job boards. They were former managers, clients, and
          coworkers. Some companies that replaced people with AI are quietly hiring them back, often as contractors.
        </p>
        {profile?.valuedBy && (
          <p className="callout">You mentioned: <em>{profile.valuedBy}</em></p>
        )}
        <Script title="To a former client or manager">
          Hi [name], I hope you're doing well. My situation has changed and I'm taking on [kind of work] again. You know
          my work better than most, so I wanted to reach out first. If anything comes up, or if you know someone who
          could use help, I'd be grateful.
        </Script>
        <Script title="To a former coworker">
          Hey [name], it's been a while. I'm looking for my next thing and thought of you. Would you be up for a quick
          call sometime? I'd love to hear how things are going for you, too.
        </Script>
        <p className="helper">
          <strong>If you're asked back as a contractor:</strong> what you know about how things really work there has
          value. Contract work doesn't come with benefits, paid time off, or job security, so a common rule of thumb is
          to charge well above your old hourly pay.
        </p>
      </Block>

      <Block title="Bridge income">
        <p>
          A bridge job isn't a verdict on who you are. People in our research drove school buses, tended bar, and took
          contract work while they figured out what was next.
          {needsFlex && <strong> Since you need flexibility, look first at the options marked "flexible."</strong>}
        </p>
        <ul className="options">
          <li><strong>Contract or temp work in your field</strong> through staffing agencies. Often the fastest path to pay that matches your experience.</li>
          <li><strong>Consulting or project work</strong> for past employers or clients. <span className="tag">flexible</span></li>
          <li><strong>Teaching or tutoring what you know,</strong> privately or through community programs. <span className="tag">flexible</span></li>
          <li><strong>Hourly work with quick starts:</strong> retail, hospitality, delivery, warehouse, transit. Seasonal hiring picks up before the holidays.</li>
          <li><strong>Your local American Job Center</strong> offers free help and often knows who's hiring now. <a href="https://www.careeronestop.org" target="_blank" rel="noreferrer">CareerOneStop</a></li>
        </ul>
      </Block>

      <Block title="Keep your footing">
        <ul className="checklist">
          <li><strong>Keep a daily rhythm.</strong> A job gives structure without our noticing. Keep a wake-up time and a few anchors in your day.</li>
          <li><strong>Cap the search.</strong> A few focused hours on a few days a week beats all day, every day.</li>
          <li><strong>See people.</strong> Plan at least one thing a week with other people: a friend, a job club at the library, a volunteer shift.</li>
          <li><strong>Do one useful thing a day,</strong> even something small. Being useful matters as much as being paid.</li>
        </ul>
      </Block>

      <Block title="Before you invest in a new path">
        <p>
          Some people in our research retrained into something AI then hit too. Before you spend months or savings on a
          new direction, ask:
        </p>
        <ul className="checklist">
          <li>Are employers actually hiring people with this training near me?</li>
          <li>How long and how much does it cost? Can I earn while I train?</li>
          <li>Does it rely on judgment, physical presence, trust, or accountability that people still want from a person?</li>
          <li>Have I talked to two people who do this work today?</li>
        </ul>
      </Block>

      <div className="actions">
        <button onClick={() => goTo("support")}>Talk to a person</button>
        <button className="primary" onClick={() => goTo("discover")}>When you're ready: what matters to me</button>
      </div>
    </section>
  );
}

function Block(props: { title: string; children: React.ReactNode }) {
  return (
    <div className="block">
      <h3>{props.title}</h3>
      {props.children}
    </div>
  );
}

function Script(props: { title: string; children: string }) {
  const copy = () => {
    void navigator.clipboard?.writeText(props.children).catch(() => {});
  };
  return (
    <div className="script">
      <div className="script-head">
        <span>{props.title}</span>
        <button className="link" onClick={copy}>Copy</button>
      </div>
      <p>{props.children}</p>
    </div>
  );
}
