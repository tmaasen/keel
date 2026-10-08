# Onboarding (Stage 1: Ground)

Onboarding *is* Stage 1. It's a short, warm intake that shapes everything after it, so the journey stays four stages: **Ground → Discover → Declare → Navigate**.

**Goal:** In about 5 minutes, learn enough about the person to personalize the journey, without making them feel assessed, sorted, or judged.

## Ground rules

1. **One question per screen.** Conversational, mobile-first, large tap targets.
2. **Every question is skippable.** "Skip" is always visible, never hidden in small text.
3. **Say why we ask.** Each question has a one-line "Why we ask" that's visible by default.
4. **Coarse, not precise.** Ranges and buckets, never exact income, debts, or savings.
5. **No health questions.** "I need flexible hours" covers the need without asking why.
6. **Always editable.** Everything can be changed later from the profile page.
7. **No scoring or labels shown back.** We never tell someone "You are a Job-type person." We use answers to adjust the journey, and we can reflect them back in their own words.

## The questions

Order matters: start easy and concrete, end with the most personal.

### 1. Welcome
Not a question. One screen: what Keel is, what will happen next ("about 5 minutes, then you decide where to go"), and that their answers are private and deletable.

### 2. What should we call you?
| Field | Type |
|---|---|
| `displayName` | free text, optional |

**Why we ask:** "So this feels like a conversation, not a form."

### 3. Where are you in life right now?
Single choice:
- Early in my working life
- Building my career
- Mid-career
- Later in my career
- Nearing or in retirement
- Starting over

| Field | Type |
|---|---|
| `lifeStage` | enum, optional |

**Why we ask:** "What matters most often shifts across life. This helps us ask better questions."

**Shapes the journey:** Tunes Discover prompts and examples (e.g., *legacy* prompts for later career, *exploration* prompts for early career). It never limits options.

### 4. What do you do, or what did you do?
- Role / kind of work (free text)
- Industry (single choice from a short list + "Other")
- Roughly how long (Under 2 yrs · 2–5 · 5–10 · 10–20 · 20+)

| Field | Type |
|---|---|
| `work.role` | free text |
| `work.industry` | enum + other |
| `work.yearsBand` | enum |

**Why we ask:** "Your experience is worth more than a job title. We'll help you see what carries over."

**Shapes the journey:** Feeds the transferable-skills inventory in Navigate.

### 5. How has AI affected your work?
*(Already built as `aiImpact`.)*
- My role was eliminated
- My job still exists, but it's changing a lot
- Nothing has happened yet, but I'm worried
- I want work that means more

**Shapes the journey:** "Role eliminated" gets acknowledgment of loss first. "Worried" gets a gentler, exploratory pace.

### 6. How do you see work?
Based on Wrzesniewski et al. (1997), *Jobs, Careers, and Callings* (see [FOUNDATIONS.md](./FOUNDATIONS.md)). Show three short stories of people (not labels), and ask **"Whose story sounds most like yours?"**

- **Alex** works mainly to support their life outside of work. Work pays the bills; the things that matter most happen elsewhere.
- **Sam** cares about growing and moving up. Progress, new challenges, and recognition keep Sam going.
- **Jordan** sees their work as part of who they are. Jordan would want to do something like it even without the paycheck.
- *"Some of each"* · *"I'm not sure anymore"*

| Field | Type |
|---|---|
| `workOrientation` | `job` · `career` · `calling` · `mixed` · `unsure` |

**Why we ask:** "There's no right answer. People find meaning in different places, and Keel should respect yours."

**Shapes the journey (important):**
- **job:** Don't push "vocation." Emphasize meaning *outside* work (Discover leans on family, community, play) and a job that fits that life. Mission statement framing: "how I want to live," not just "what my work is for."
- **career:** Emphasize growth, mastery, and where their skills are rising in value.
- **calling:** Full vocation journey. Also gently acknowledge that losing work that *was* your calling can feel like grief.
- **unsure:** Common after disruption. Treat it as a valid starting point, not a gap to fix.

### 7. How soon do you need income?
- Within the next few weeks
- Within a few months
- I have some time
- I'm not looking for income right now

| Field | Type |
|---|---|
| `urgency` | enum, optional |

**Why we ask:** "If you need work soon, we won't make you wait on reflection first."

**Shapes the journey: the two-track model.** "Within weeks" unlocks a **Bridge track** alongside the main journey: a short path to stable income now (transferable skills, nearby roles, practical next steps), framed as *a bridge, not a destination*. The deeper journey stays open whenever they're ready.

### 8. What should we keep in mind?
Multi-select, all optional:
- I can't relocate
- I care for someone
- I need flexible hours
- I can't go back to school right now
- I need remote work
- I need to keep my current job while I explore

| Field | Type |
|---|---|
| `constraints` | array of enum |

**Why we ask:** "So we only suggest paths that fit your real life."

**Shapes the journey:** Filters in Navigate. Never shown as "limitations."

### 9. How open are you to learning something new?
- Very, I'd love to learn something new
- Open, if it's short or affordable
- I'd rather build on what I already know

| Field | Type |
|---|---|
| `retrainingOpenness` | enum |

### 10. How are you doing, honestly?
A simple 1–5 scale with words, not just numbers: *Really struggling · Having a hard time · Getting by · Doing okay · Doing well*.

**Why we ask:** "Change like this can be heavy. We want to meet you where you are."

**Shapes the journey:**
- 1–2: Before continuing, show a calm screen that names it ("This sounds really hard"), offers human support (people they trust, a counselor, a crisis line if they're in danger), and makes it clear they can continue whenever they're ready. It doesn't block them.
- The guide's tone and pace adjust for the session.

**Privacy:** This answer is used in the moment and **not stored by default.** Storing a mood history needs a separate, explicit opt-in design.

### 11. Summary
Reflect back what we heard in plain language, using their words ("You've spent 15 years in marketing, you're caring for a parent, and right now you need income within a few months"). Then two buttons:
- **"That's me, let's continue"**
- **"Edit something"**

If `urgency = weeks`, show both tracks here: *"Start the Bridge track"* and *"Start with what matters to me."*

## Proposed schema changes

Extend `profiles`:

```ts
lifeStage: v.optional(v.union(
  v.literal("early"), v.literal("building"), v.literal("mid"),
  v.literal("late"), v.literal("retiring"), v.literal("starting_over"))),
work: v.optional(v.object({
  role: v.optional(v.string()),
  industry: v.optional(v.string()),
  yearsBand: v.optional(v.string()),
})),
workOrientation: v.optional(v.union(
  v.literal("job"), v.literal("career"), v.literal("calling"),
  v.literal("mixed"), v.literal("unsure"))),
urgency: v.optional(v.union(
  v.literal("weeks"), v.literal("months"), v.literal("time"), v.literal("not_looking"))),
constraints: v.optional(v.array(v.string())),
retrainingOpenness: v.optional(v.union(
  v.literal("eager"), v.literal("open"), v.literal("build_on"))),
onboardingCompletedAt: v.optional(v.number()),
```

The wellbeing check-in (question 10) is intentionally **not** in the schema.

## Passing it to the guide

Give the guide a short plain-language summary of the profile, not raw fields. For example: *"Mid-career. 15 years in marketing. Role changing a lot due to AI. Sees work mostly as a way to support life outside work. Needs income within a few months. Can't relocate."* The guide should use it to adjust tone and examples, and never quote it back as a label.

## Open questions

- Should Bridge track be its own stage, or a mode within Navigate?
- Do we offer the work-orientation question again after Declare, to see if it shifted? (Could be a meaningful moment.)
- Industry list: start short (~12) and grow from "Other" answers.
