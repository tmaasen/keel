# Navigate: where can I live it out?

*Plan, October 2026. Stage 4 of the journey. Not built yet; the first brick, "Translate your work," already ships on Steady ground.*

## Approach

Navigate is built natively in Keel (Convex + React), for people on a phone, not in a terminal. It borrows **methods**, not code, from two open-source job-search projects, both MIT-licensed:

- **[career-ops](https://github.com/career-ops-hq/career-ops)** (primary model). Its values match ours: "A human decides. Dignity on both sides of the table." It never submits an application or sends a message; it drafts, the person acts. We adopt its paste-a-job evaluation, its check that a posting is real and still open, and its outreach-first habit of finding the right person and drafting a short note.
- **[ai-job-search](https://github.com/MadsLorentzen/ai-job-search)**. We adopt its "latent opportunity discovery" (surfacing paths from what someone actually did, not their title) and its drafter-reviewer pattern for honest CV and cover-letter drafts that never invent experience.

If we ever copy code rather than ideas, we keep the original MIT notices with it.

## How it fits Keel's rules

- **Reasons, never scores.** career-ops scores jobs 1 to 5. Keel explains fit in words, against the person's own mission, values, constraints, and skills. A job can be scored; a person never is.
- **People over portals.** Outreach comes before applications, matching what helped in our research.
- **Honest about the unknown.** No "AI-proof" paths. Every new direction gets the "Before you invest" stress-test.
- **Drafts only.** Keel never submits, sends, or clicks on anyone's behalf.
- **Legal data only.** No scraping sites whose terms forbid it (that rules out LinkedIn). Sources:
  - **USAJobs API** (US federal jobs, all fields)
  - **CareerOneStop / National Labor Exchange** (US Department of Labor; all industries and regions)
  - **Public company job boards** on Greenhouse, Lever, and Ashby (structured, public APIs)

## Build order

1. **Paths that fit your mission.** From the person's skills translation, values, mission, and constraints, the guide suggests a few kinds of work worth exploring, each with why it might fit and what to check first. Works with AI off through guided prompts.
2. **Paste a job.** The person pastes a posting or link. Keel checks it is real and still open, then explains fit and gaps in plain words, including what to ask before applying.
3. **Who to talk to.** For a path or a posting, Keel suggests the kind of person to reach and drafts a short note. Builds on the Steady ground scripts.
4. **Honest drafts.** A tailored CV and cover letter, drafted then reviewed, verified against the person's own words. Nothing invented.
5. **Search.** Listings from the legal sources above, filtered by constraints (location, remote, hours) and explained against the mission.

## Open questions for testers

- Do people want listings inside Keel at all, or mostly help deciding and reaching out?
- Which non-tech fields do testers come from? That decides which data sources matter most.
