# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Anyone whose work has been hit by AI, served equally when needs conflict:

- **Laid off:** a role eliminated, often with AI as the stated reason or part of it. Includes mid/late-career people who haven't job-searched in decades, and early-career people locked out of entry-level work.
- **Work drying up:** freelancers and creatives (writers, translators, designers, voice actors) whose clients disappear gradually, with no layoff date, no severance, and murky unemployment eligibility.
- **Job hollowed out:** still employed, income intact, but the meaningful parts of the work handed to AI; often pressured to adopt AI and waiting for "the meeting."
- Also welcome: people worried it's coming, and people who simply want more meaningful work.

Their situation when they arrive: many are in money trouble measured in weeks, grieving a craft identity, angry at the people who made the decisions, exhausted by hundreds of job applications, surrounded by people who don't understand, and some are in crisis. Most are not technical. They are using a phone as often as a laptop.

The job they're doing: get steady first, then figure out what matters to them and find work that fits it.

## Product Purpose

Keel is a free, open-source companion for people whose work has been disrupted or reshaped by AI. Instead of starting with a résumé, it starts with the person: what happened, what they need right now, what they value, and the story only they can tell. It helps them get steady (benefits, health coverage, reaching back out, bridge income), put their experience into words employers use, reflect on their values, and write a personal mission statement in their own words, then (later) find work that fits it.

Success: someone leaves steadier than they arrived, feeling their skill was real, with a concrete next step and words for what happened that aren't self-blame.

## Positioning

Values first, then vocation, and on the worker's side. Keel is not a job board, an AI career coach, or an employer tool. It is donation-funded and open source, never sells data, never scores or ranks people, and refuses the "upskill / learn AI / learn a trade" script its users mock. It is honest that nobody knows where AI is headed, so it never forecasts or promises an "AI-proof" path; it helps people build on what goes with them: their values, skills, and relationships.

## Operating Context

- Four-stage journey: **Ground** (where am I now?), **Discover** (what matters to me?), **Declare** (what is my work for?), **Navigate** (where can I live it out?). Stages 1 to 3 are built; Navigate is planned.
- Onboarding triages first: what happened (and what part AI played, where "I don't know" is a full answer), weeks of runway, first need (income, clarity, rest), work and identity tie, constraints, who still values their work, feelings (never stored), and an AI choice. An acknowledgment screen comes before any values work.
- **Steady ground (Bridge)** track: benefits, health coverage, severance, reaching back out with copyable scripts, "translate your work" into skills, bridge income, keeping a rhythm, explaining it to family, and stress-testing a new path before investing.
- **Support** page with human help (crisis lines, 211, benefits, legal aid, unions, peers) is always one tap away.
- People may come back over days or weeks, often in low moments, often on a phone.
- Tester round 1 (10 to 15 people affected by AI) is next; see docs/TESTING.md.

## Capabilities and Constraints

- Stack: React + Vite + TypeScript on Convex (database, functions, and web hosting via the static-hosting component). AI through OpenRouter or any OpenAI-compatible endpoint.
- **AI is optional, opt-in, and enforced on the server.** It only reflects the person's words and offers labeled drafts they can change or discard. It never decides, scores, ranks, or judges employability, and never claims to understand or know the person. Everything works with AI off.
- AI cost guardrails: a per-person daily limit and a monthly spend cap; when either is reached the guide "rests" and everything else keeps working.
- Privacy: feelings from onboarding are never stored. People can export everything (readable Markdown or JSON) and delete everything. Data is never sold or used for training.
- Identity is currently a browser session, not an account; work is saved only in that browser until Convex Auth replaces it.
- Help links are US-focused for now.
- Keel is not a therapist, counselor, lawyer, or financial advisor, and says so. Thoughts of self-harm stop career work and route to crisis help.

## Brand Commitments

- **Name and tagline:** Keel. "AI changed your job. It didn't change who you are." The keel metaphor: below the waterline, keeping a boat upright in rough water; your values are your keel.
- **Voice:** the Manifesto's voice. Warm, plain, honest, on the worker's side. Use: "What happened to your work wasn't a verdict on you." "Your skill was real." "You don't have to prove it was AI." "No one knows where AI is headed, not even us." Avoid: future-proof, AI-proof, upskill, pivot to AI, opportunity, disruption, reinvent yourself, learn a trade, "just take any job," AI-powered coach. Full list in docs/USER_RESEARCH.md#language.
- Not binding: the current logo mark, palette, and fonts may be revisited.

## Evidence on Hand

- User research: docs/USER_RESEARCH.md (desk research plus Reddit read directly: 138 posts and 1,782 comments, October 2026) and docs/research/desk-research-2026-10.md (full desk report with citations).
- Research foundations: docs/FOUNDATIONS.md. Principles: MANIFESTO.md. Onboarding spec: docs/ONBOARDING.md. Funding: docs/FUNDING.md.
- No real users, testimonials, usage numbers, or press yet. Do not fabricate any. Quotes in research docs are from public Reddit and published sources and must stay attributed to those sources.

## Product Principles

1. **Humans first, AI second.** When efficient and humane conflict, choose humane. The AI is a mirror, never a judge.
2. **Steady ground before reflection.** Money and safety come first; values work is never a gate in front of help.
3. **Acknowledge before asking.** Name what happened without self-blame before asking anything of someone.
4. **Honest about the unknown.** No forecasts, no "safe" careers, no cheering a bet just to be encouraging. Test before investing.
5. **People over portals.** What helped was human: former coworkers, peers, unions, mutual aid. Keel points people toward each other.

## Accessibility & Inclusion

- **WCAG 2.2 AA** throughout: contrast, keyboard, screen readers, focus, reduced motion.
- **Plain language:** copy readable at about an 8th-grade level, with no jargon. Many users arrive exhausted or distressed.
- Every question is skippable. Never assume the cause of someone's job loss.
