# Onboarding (Stage 1: Ground)

Onboarding *is* Stage 1. It's a short, warm intake that shapes everything after it. It was revised after the [user research](./USER_RESEARCH.md): **money and acknowledgment come before values.**

The question text and answer options live in code at `src/content/onboarding.ts`, so this doc describes the *why*; the code is the source of truth for wording.

## Ground rules

1. **One question per screen.** Mobile-first, large tap targets.
2. **Every question is skippable**, and "Skip" is always visible.
3. **Say why we ask** in one line under each question.
4. **Coarse, not precise.** Ranges, never exact income, debts, or savings.
5. **No health questions.** "I need flexible hours" covers the need without asking why.
6. **No labels shown back.** We never tell someone what "type" they are.
7. **Feelings are used in the moment and never stored.**

## The flow

| # | Screen | Stored as | Why it's here |
|---|---|---|---|
| 1 | **Welcome + AI disclosure** | — | Research: distrust of AI is high. Say on screen one exactly what AI does and doesn't do here, and that it's optional. |
| 2 | **What should we call you?** | `displayName` | Feels like a conversation, not a form. |
| 3 | **What happened to your work?** Role eliminated · Work drying up · Job changed into something I don't recognize · Worried it's coming · Want more meaningful work | `aiImpact` | Freelancers have no "layoff date," and people with hollowed-out jobs aren't unemployed. Both need their own door. |
| 3b | **What part did AI play? You don't have to know.** (only if work was hit; choose any) They said AI · I think AI was part of it · Outsourcing, cost-cutting, or restructuring · I was asked to use or train the AI tools · I honestly don't know | `aiRole` | Reddit research: many people never get a straight answer, and AI is tangled with offshoring and cost-cutting. Nobody has to prove it. "Trained the AI" unlocks an acknowledgment that adapting didn't protect them. |
| 3c | **One follow-up for that situation only.** Laid off: *Were you offered severance?* (deadline / no deadline / none / not sure). Work drying up: *What's happened with your clients?* (fewer / paying less / asked to edit AI drafts / platforms showing less). Job changing: *Which parts of your work do you miss most?* (their words). Worried: *What's making you worried?* (layoffs / AI pushed at work / the news / other) | `severance`, `clientChange`, `missMost`, `worryReason` | Makes the questionnaire answer-based. Each answer changes what follows: a severance deadline moves to #1 on Steady ground, freelance help follows what changed, the acknowledgment names what they miss, and announced layoffs make preparation more urgent while news-driven worry gets a gentler tone. Rules and tests: `src/logic/journey.ts`, `src/logic/journey.test.ts`, report in [qa/PERSONAS.md](./qa/PERSONAS.md). |
| 4 | **How long could you cover essentials without new income?** Under a month · 1–2 months · More than 2 months · I have steady income · Rather not say | `runway` | Triage. Values work before rent is handled reads as privileged. |
| 5 | **What do you need most right now?** Income · Clarity · Rest · Not sure | `firstNeed` | Lets people tell us what comes first instead of us guessing. |
| 6 | **Your work:** role, years, how much of who you are was tied to it | `work.role`, `work.yearsBand`, `identityTie` | Long tenure + strong identity tie = acknowledge grief more carefully. |
| 7 | **How do you see work?** Three short stories (job / career / calling) | `workOrientation` | Wrzesniewski et al. (1997). "Just a job" is respected; we don't push vocation on everyone. |
| 8 | **What should we keep in mind?** Can't relocate · Caring for someone · Need flexible hours · Can't go back to school now · Need remote · Keeping current job while I explore | `constraints` | Filters Bridge and Navigate suggestions to real life. |
| 9 | **Who still knows your work and values it?** | `valuedBy` | Research: personal networks and callbacks helped more than job boards. Seeds the Bridge "reach back out" step. |
| 10 | **How are you feeling about it?** Sad · Angry · Ashamed · Anxious · Numb · Relieved · Okay · *Really struggling* | **not stored** | Shapes the acknowledgment screen. "Really struggling" shows human support first. |
| 11 | **How should Keel use AI?** Help me reflect and draft · Keep AI out of it | `aiPreference` | AI is opt-in, changeable any time, and enforced on the server. Skipping = off. |
| 12 | **Acknowledgment** | — | Not a question. Names what happened without self-blame, says they don't have to prove it was AI (or that doing what was asked didn't protect them), validates anger if they chose it, says their skill was real, and says honestly that nobody knows where AI is headed. |
| 13 | **Where to start** | `onboardingCompletedAt` | Recommends a path (below). Every path stays open. |

## Where to start (routing)

| If… | Recommend first |
|---|---|
| Runway under 2 months, **or** first need = income | **Bridge**: steady ground now (benefits, health coverage, reaching back out, bridge work) |
| First need = rest | A short "rest is allowed" note, the Support page, and an open door to come back |
| Everyone else | **Discover**: what truly matters to you |

The Bridge is framed as *a bridge, not a verdict*. Discover is always one tap away.

## Language

Follow the "use / avoid" list in [USER_RESEARCH.md](./USER_RESEARCH.md#language). Never say *upskill, future-proof, AI-proof, pivot, opportunity, disruption, reinvent yourself*, and never predict where AI is going.

## Open questions for testers

- Does the AI choice screen feel respectful, or like a sales pitch?
- Are the runway and "what happened" questions caring or intrusive?
- Is anything missing for freelancers?
