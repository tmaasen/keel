/**
 * Onboarding wording and answer options. This is the source of truth for
 * what people see. Rationale for each question: docs/ONBOARDING.md.
 * Language rules: docs/USER_RESEARCH.md#language.
 */

export const SITUATION = [
  { id: "lost_job", label: "My role was eliminated" },
  { id: "drying_up", label: "My work has been drying up" },
  { id: "job_changing", label: "My job changed into something I don't recognize" },
  { id: "worried", label: "Nothing has happened yet, but I'm worried", group: "Looking ahead" },
  { id: "exploring", label: "I want work that means more", group: "Looking ahead" },
] as const;

/** Shown with "What happened?" for people whose work was hit. Nobody has to prove it was AI. */
export const AI_ROLE = [
  { id: "told_ai", label: "They said AI was the reason" },
  { id: "suspect_ai", label: "Nobody said so, but I think AI was part of it" },
  { id: "other_reasons", label: "Outsourcing, cost-cutting, or restructuring was part of it" },
  { id: "not_sure", label: "I honestly don't know" },
  { id: "trained_it", label: "I was asked to use or train the AI tools", group: "Also" },
] as const;

/** Laid off only. */
export const SEVERANCE = [
  { id: "deadline", label: "Yes, and there's a deadline to sign" },
  { id: "offered", label: "Yes, with no deadline yet" },
  { id: "none", label: "No severance" },
  { id: "not_sure", label: "I'm not sure" },
] as const;

/** Work drying up only. */
export const CLIENT_CHANGE = [
  { id: "fewer", label: "Fewer clients or projects" },
  { id: "paying_less", label: "Clients paying less for the same work" },
  { id: "editing_ai", label: "Clients asking me to edit AI drafts instead" },
  { id: "platforms", label: "Platforms showing my work less" },
] as const;

/** Worried only. */
export const WORRY_REASON = [
  { id: "layoffs", label: "Layoffs have been announced or are rumored" },
  { id: "ai_push", label: "AI is being pushed into my work" },
  { id: "news", label: "Mostly the news and what people are saying" },
  { id: "other", label: "Something else" },
] as const;

export const RUNWAY = [
  { id: "under_1m", label: "Less than a month" },
  { id: "1_2m", label: "One to two months" },
  { id: "over_2m", label: "More than two months" },
  { id: "has_income", label: "I have steady income right now", group: "Or" },
  { id: "rather_not", label: "I'd rather not say", group: "Or" },
] as const;

export const FIRST_NEED = [
  { id: "income", label: "Income", hint: "I need money coming in" },
  { id: "clarity", label: "Clarity", hint: "I need to figure out what's next" },
  { id: "rest", label: "Rest", hint: "I need a moment to breathe" },
  { id: "not_sure", label: "I'm not sure", hint: "That's okay too" },
] as const;

export const YEARS = ["Under 2 years", "2–5 years", "5–10 years", "10–20 years", "20–30 years", "30+ years"] as const;

export const IDENTITY_TIE = [
  { id: "a_little", label: "A little. It was mostly a job." },
  { id: "a_lot", label: "A lot" },
  { id: "who_i_was", label: "It was who I was" },
] as const;

export const ORIENTATION = [
  {
    id: "job",
    name: "Alex",
    story:
      "Alex works mainly to support life outside of work. Work pays the bills; the things that matter most happen elsewhere.",
  },
  {
    id: "career",
    name: "Sam",
    story: "Sam cares about growing and moving forward. New challenges, progress, and recognition keep Sam going.",
  },
  {
    id: "calling",
    name: "Jordan",
    story: "Jordan sees their work as part of who they are. Jordan would want to do something like it even without the paycheck.",
  },
  { id: "mixed", name: "Some of each", story: "A bit of all three.", group: "Or" },
  { id: "unsure", name: "I'm not sure anymore", story: "That's a real answer, especially right now.", group: "Or" },
] as const;

export const CONSTRAINTS = [
  { id: "no_relocate", label: "I can't relocate", group: "Where and when" },
  { id: "remote", label: "I need remote work", group: "Where and when" },
  { id: "flexible_hours", label: "I need flexible hours", group: "Where and when" },
  { id: "caregiver", label: "I care for someone", group: "Life right now" },
  { id: "no_school", label: "I can't go back to school right now", group: "Life right now" },
  { id: "keep_current_job", label: "I'm keeping my current job while I figure things out", group: "Life right now" },
] as const;

/** Feelings are used on screen only and are never saved. */
export const FEELINGS = [
  { id: "sad", label: "Sad" },
  { id: "angry", label: "Angry" },
  { id: "ashamed", label: "Ashamed" },
  { id: "anxious", label: "Anxious" },
  { id: "numb", label: "Numb", group: "Or" },
  { id: "relieved", label: "Relieved", group: "Or" },
  { id: "okay", label: "Okay, actually", group: "Or" },
  { id: "struggling", label: "I'm really struggling", hint: "We'll show you people who can help first.", group: "If it's a lot right now" },
] as const;
export type FeelingId = (typeof FEELINGS)[number]["id"];

export const AI_CHOICE = [
  {
    id: "on",
    label: "Use AI to help me reflect and draft",
    hint: "It can reflect your words back and offer a first draft you can change or throw away.",
  },
  {
    id: "off",
    label: "Keep AI out of it",
    hint: "Everything in Keel still works. You'll write in your own words, with prompts to guide you.",
  },
] as const;

export const labelFor = <T extends readonly { id: string; label?: string; name?: string }[]>(
  list: T,
  id: string | undefined,
) => {
  const item = list.find((x) => x.id === id);
  return item ? (item.label ?? item.name) : undefined;
};
