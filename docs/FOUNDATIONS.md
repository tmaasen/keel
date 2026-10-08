# Foundations

Keel's design rests on research about what makes people happy and on long traditions of thought about the dignity of work. This file lists those foundations and, more importantly, **what each one changes in Keel.** If a feature can't trace back to something here or to the [Manifesto](../MANIFESTO.md), question it.

Keel serves people of every faith and none. We draw on religious and secular sources as wisdom about being human, and we phrase Keel's own principles so anyone can hold them.

---

## Part 1: What makes people happy

### Relationships matter most
**Source:** Harvard Study of Adult Development (begun 1938, among the longest-running studies of adult life). See Waldinger & Schulz, *The Good Life* (2023).
**Finding:** The quality of people's close relationships is one of the strongest predictors of their long-term happiness and health, stronger than wealth or career success.
**In Keel:**
- Discover always asks about people and relationships, not just work.
- Navigate weighs a role's effect on relationships (hours, location, schedule) alongside pay and fit.
- The guide encourages human connection during the transition: peers, mentors, community.

### Three basic psychological needs
**Source:** Self-Determination Theory, Deci & Ryan.
**Finding:** Wellbeing depends on three needs: **autonomy** (choosing your own path), **competence** (feeling capable), and **relatedness** (connection to others).
**In Keel:**
- *Autonomy:* The person chooses. The AI reflects and drafts; it never decides (Manifesto #4).
- *Competence:* Help people see the skills they already have before talking about gaps. Disruption makes people feel incompetent; Keel should counter that with evidence.
- *Relatedness:* See above.
- Career paths in Navigate are evaluated against all three.

### What a job gives besides money
**Source:** Marie Jahoda's latent deprivation model (1982), from research on unemployment.
**Finding:** Employment provides five hidden benefits beyond income: **time structure, social contact, shared purpose, status and identity, and regular activity.** Losing a job hurts partly because all five disappear at once.
**In Keel:** This is the best explanation of the "AI-induced identity crisis," and it gives Keel a concrete job during the in-between time:
- A *Rebuilding* toolkit (planned) helps people restore each of the five while they search: a daily rhythm, people to talk to, a project with purpose, an identity statement that isn't a job title, and things to do.
- Their mission statement becomes an identity that doesn't depend on an employer.

### Jobs, careers, and callings
**Source:** Wrzesniewski, McCauley, Rozin & Schwartz (1997), *Jobs, Careers, and Callings*; Wrzesniewski & Dutton (2001) on *job crafting*.
**Finding:** People relate to their work as a **job** (income for the rest of life), a **career** (advancement), or a **calling** (meaningful in itself). People in many kinds of jobs can experience them as callings, and people can reshape their tasks, relationships, and outlook to make work more meaningful.
**In Keel:**
- Onboarding asks which story sounds like them ([ONBOARDING.md](./ONBOARDING.md)).
- "Just a job" is respected. Keel doesn't push vocation on everyone.
- *Job crafting* becomes a Navigate option: sometimes the answer isn't a new job but reshaping the current one, including the parts AI hasn't taken.

### Meaning vs. pleasure
**Sources:** Martin Seligman's PERMA model (Positive emotion, Engagement, Relationships, Meaning, Accomplishment); Carol Ryff's psychological wellbeing; Mihaly Csikszentmihalyi on *flow*.
**Finding:** Lasting wellbeing comes from engagement, meaning, and growth, not just good feelings.
**In Keel:**
- "When do you lose track of time?" (a flow prompt) is already in Discover.
- The mission statement is about meaning and contribution, not just satisfaction.

### Ikigai
**Source:** Japanese concept of a "reason for being." The popular four-circle diagram (what you love, what you're good at, what the world needs, what you can be paid for) is a Western adaptation; in Japan, ikigai is often found in small daily joys and roles, not only work.
**In Keel:** Useful as a reflection frame, but we keep the original spirit: meaning can live outside work.

---

## Part 2: *Magnifica Humanitas* (Pope Leo XIV, 2026)

**Source:** [Magnifica Humanitas](https://www.vatican.va/content/leo-xiv/en/encyclicals/documents/20260515-magnifica-humanitas.html), encyclical on human dignity in the age of AI (May 15, 2026). Paragraph numbers below are from Chapters 1–2.

> ⚠️ **To do:** Chapter 4 ("Safeguarding Humanity at a Time of Transformation: Truth, Work, Freedom") covers the dignity of work and unemployment directly. Read it and add its guidance here. It is likely the most relevant section for Keel.

| Teaching | In Keel |
|---|---|
| **Dignity isn't earned through productivity.** It doesn't depend on ability, wealth, or output, and the encyclical warns against measuring people by efficiency (¶50–53). | Keel never frames a person's worth around employability. Copy and guide prompts should say this explicitly, especially for people who lost work. |
| **Work is a good for the person, not just income.** Automation should be judged by its effect on the worker's dignity, not only efficiency (¶37). | Keel helps people find work that is good *for them*, not just any job. It also supports Jahoda's point: work gives more than money. |
| **People find themselves through self-giving.** Fulfillment comes from freedom and responsibility joined with mutual care (¶12, ¶48). | Discover includes service and contribution. The mission statement connects values to *who they serve*. |
| **Discernment, not fixed answers.** Social teaching is a process of discernment, not a rulebook (¶6, ¶27). | Keel is a discernment tool. It asks good questions instead of handing out answers. |
| **Technology is never neutral.** It reflects the values of those who design, fund, and use it (¶4, ¶9). | The guide's rules are public in `convex/guide.ts`, so anyone can see the values built into Keel. |
| **Subsidiarity and local voice.** Communities, schools, religious bodies, and civil society should help shape digital tools (¶71–72). | Keel is self-hostable so a library, union, parish, school, or workforce program can run it for its own community (Manifesto #8). |
| **Include the most vulnerable; promote digital literacy** (¶14). | Plain language, accessibility, mobile-first, no assumed tech skills (Manifesto #7). |
| **No one is saved alone; build a culture of encounter** (¶62, ¶73). | Keel points people to real human support and, later, facilitator mode and community. |

---

## How to use this file

- When proposing a feature, name which foundation it serves.
- When writing prompts or copy, check them against Part 1's findings and Part 2's dignity principles.
- New research is welcome. Add the source, the finding in plain language, and what it changes in Keel.
