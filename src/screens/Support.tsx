/**
 * Human support. Keel is not a therapist; this list is part of the product.
 * Links are US-focused for now, with international options where they exist.
 */

const RESOURCES = [
  {
    group: "If you're in crisis",
    items: [
      { name: "988 Suicide & Crisis Lifeline", detail: "Call or text 988 (US and Canada). Free, 24/7.", href: "https://988lifeline.org" },
      { name: "Find a helpline", detail: "Free crisis lines in many other countries.", href: "https://findahelpline.com" },
      { name: "Emergency services", detail: "If you or someone else is in immediate danger, call your local emergency number." },
    ],
  },
  {
    group: "Rent, food, bills",
    items: [
      { name: "211", detail: "Call 211 or visit the site for local help with rent, food, and utilities (US and Canada).", href: "https://www.211.org" },
      { name: "Unemployment benefits", detail: "How to apply in your state.", href: "https://www.usa.gov/unemployment-benefits" },
      { name: "Health coverage after job loss", detail: "Losing job-based coverage usually opens a 60-day window to enroll.", href: "https://www.healthcare.gov/coverage-outside-open-enrollment/special-enrollment-period/" },
      { name: "Nonprofit financial counseling", detail: "Free or low-cost help with debt and budgets.", href: "https://www.nfcc.org" },
    ],
  },
  {
    group: "Legal and work help",
    items: [
      { name: "Free legal help", detail: "Find legal aid near you, including employment questions.", href: "https://www.lawhelp.org" },
      { name: "American Job Centers", detail: "Free local career help, workshops, and job clubs.", href: "https://www.careeronestop.org" },
      { name: "Freelancers Union", detail: "Community and resources for independent workers.", href: "https://www.freelancersunion.org" },
    ],
  },
  {
    group: "People",
    items: [
      { name: "Someone you trust", detail: "A friend, family member, former coworker, or faith community. You don't have to carry this alone." },
      { name: "A counselor or therapist", detail: "Many offer sliding-scale fees. Your doctor or 211 can help you find one." },
    ],
  },
];

export function SupportList() {
  return (
    <div className="support-list">
      {RESOURCES.map((g) => (
        <div key={g.group}>
          <h3>{g.group}</h3>
          <ul>
            {g.items.map((r) => (
              <li key={r.name}>
                {"href" in r && r.href ? (
                  <a href={r.href} target="_blank" rel="noreferrer">{r.name}</a>
                ) : (
                  <strong>{r.name}</strong>
                )}
                <span>{r.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function Support() {
  return (
    <section>
      <h2 className="stage-question">You don't have to do this alone.</h2>
      <p className="helper">
        Keel can help you think things through, but it's not a therapist, counselor, lawyer, or financial advisor. These
        people and places can help in ways Keel can't. Most links are US-focused for now.
      </p>
      <SupportList />
    </section>
  );
}
