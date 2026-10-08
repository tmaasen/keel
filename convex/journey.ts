/**
 * The Keel journey: four stages and the reflection prompts that guide each.
 * Wording matters more than anything else in this repo. Keep it plain,
 * warm, and free of jargon. Every prompt should be skippable.
 */

export type StageId = "ground" | "discover" | "declare" | "navigate";

export interface ReflectionPrompt {
  id: string;
  stage: StageId;
  question: string;
  helper?: string;
}

export const STAGES: { id: StageId; title: string; question: string }[] = [
  { id: "ground", title: "Ground", question: "Where am I right now?" },
  { id: "discover", title: "Discover", question: "What truly matters to me?" },
  { id: "declare", title: "Declare", question: "What is my work for?" },
  { id: "navigate", title: "Navigate", question: "Where can I live that out?" },
];

export const PROMPTS: ReflectionPrompt[] = [
  // Stage 1: Ground
  {
    id: "ground.what_changed",
    stage: "ground",
    question: "What has changed in your work because of AI?",
    helper: "There's no wrong answer. A sentence or two is plenty.",
  },
  {
    id: "ground.how_it_feels",
    stage: "ground",
    question: "How are you feeling about it, honestly?",
    helper: "Uncertain, angry, relieved, numb, curious. All of it counts.",
  },
  {
    id: "ground.what_you_miss",
    stage: "ground",
    question: "What part of your work do you miss most, or are afraid of losing?",
  },

  // Stage 2: Discover (deliberately reaches beyond work)
  {
    id: "discover.proud_moment",
    stage: "discover",
    question: "Tell me about a time you felt proud of yourself. It doesn't have to be at work.",
  },
  {
    id: "discover.lose_track_of_time",
    stage: "discover",
    question: "When do you lose track of time?",
  },
  {
    id: "discover.people_come_to_you",
    stage: "discover",
    question: "What do people tend to come to you for?",
  },
  {
    id: "discover.what_angers_you",
    stage: "discover",
    question: "What injustice or problem in the world bothers you most?",
    helper: "What frustrates us often points to what we care about.",
  },
  {
    id: "discover.remembered_for",
    stage: "discover",
    question: "What would you want the people closest to you to say about you?",
  },
  {
    id: "discover.outside_work",
    stage: "discover",
    question: "Outside of a paycheck, what makes a day feel well spent?",
  },
];

export const promptsForStage = (stage: StageId) =>
  PROMPTS.filter((p) => p.stage === stage);
