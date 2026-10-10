# Keel

**AI changed your job. It didn't change who you are.**

Keel is a free, open-source companion for people whose work has been disrupted or reshaped by AI. Instead of starting with your résumé, Keel starts with *you*: what you value, what matters to you outside of work, and the story only you can tell. From there it helps you write a personal mission statement and find work that fits it. Not just a job, but a vocation.

> A keel sits below the waterline and keeps a boat upright in rough water. AI is changing the weather for millions of workers. Your values are your keel.

---

## Why Keel exists

Most career tools assume you already know what you want and just need help getting it. But when AI eliminates or hollows out the work you built your identity around, the first question isn't *"Which job should I apply for?"* It's *"Who am I now, and what do I actually care about?"*

That's the AI-induced identity crisis, and it's what Keel is built for.

## How it works: the journey

Keel guides you through four stages. You can move at your own pace, pause, and come back.

| Stage | Question it answers | What you leave with |
|---|---|---|
| **1. Ground** | Where am I right now? | A safe, honest starting point: how AI has affected your work and how you're feeling about it |
| **2. Discover** | What truly matters to me? | Your core values, drawn from reflection on your whole life, not just your job |
| **3. Declare** | What is my work *for*? | A personal mission statement you wrote (with help), in your own words |
| **4. Navigate** | Where can I live that out? | Career paths, roles, and next steps filtered through your mission |

Stages 1–3 are the heart of Keel. Stage 4 builds on the job-search ideas proven by projects like [career-ops](https://github.com/santifer/career-ops), but every match is measured against *your* mission, not someone else's defaults.

## Principles

Keel is built around one premise: **humans first, AI second.** Read the full [Manifesto](./MANIFESTO.md) and the research behind it in [Foundations](./docs/FOUNDATIONS.md).

## Status

🧪 **Early testing.** Onboarding, the Steady ground (Bridge) track, values, and mission statement work end to end. See the [roadmap](./docs/ARCHITECTURE.md#roadmap) for what's next. Contributions are very welcome. See [Contributing](#contributing).

## Tech stack

- **[Convex](https://convex.dev)**: reactive database, server functions, and (soon) the Agent component for guided conversations. Can run on Convex Cloud or be self-hosted.
- **React + Vite + TypeScript** for the web app, so anyone can use Keel in a browser, with no terminal required.
- **[OpenRouter](https://openrouter.ai)** for AI by default: one key, any model, with routing restricted to providers that don't keep or train on data. Any OpenAI-compatible endpoint (including a local model) also works.

## Run it locally

```bash
git clone https://github.com/tmaasen/keel.git
cd keel
pnpm install
pnpm exec convex dev  # creates a Convex project and generates types
pnpm dev              # in a second terminal
```

To enable the AI guide, set these in your Convex dashboard (Settings → Environment Variables):

```
LLM_API_KEY=...     # your OpenRouter key
LLM_MODEL=...       # any model id from openrouter.ai/models
```

Optional: `LLM_BASE_URL` to use a different OpenAI-compatible endpoint (OpenAI, Azure, a local Ollama server), and `APP_URL` to identify your deployment to OpenRouter.

## Project layout

```
convex/
  schema.ts          # profiles, reflections, values, mission statements
  journey.ts         # the four stages and their reflection prompts
  valuesCatalog.ts   # starter list of human values
  guide.ts           # the guide's system prompt (humans-first rules live here)
  profiles.ts        # stage 1 – Ground
  reflections.ts     # stage 2 – Discover
  values.ts          # stage 2 – Discover
  missions.ts        # stage 3 – Declare (incl. AI draft action)
  lib/llm.ts         # the one place Keel calls an AI model
  lib/owner.ts       # who owns a piece of data (auth swaps in here)
src/                 # React web app
docs/
  ARCHITECTURE.md    # design + roadmap
  ONBOARDING.md      # Stage 1 intake spec
  FOUNDATIONS.md     # the research and teaching Keel is built on
  FUNDING.md         # how Keel is funded (donations) and kept free
  USER_RESEARCH.md   # what people displaced by AI actually say
  TESTING.md         # deploying and running a tester round
```

## Contributing

Keel is for people going through one of the hardest moments of their working lives, so it needs more than code. Everyone who helps is held to one test: **does this put the human first?**

**You don't need to code to help.** Some of the most valuable contributions are:

- **Career counselors, coaches, and therapists:** review the reflection prompts (`convex/journey.ts`), the onboarding questions ([ONBOARDING.md](./docs/ONBOARDING.md)), and the guide's rules (`convex/guide.ts`). Tell us what's missing or could hurt.
- **People who've lived through an AI-driven career change:** your story shapes Keel. Open an issue and tell us what would have helped.
- **Researchers:** add findings on wellbeing, meaning, and work to [FOUNDATIONS.md](./docs/FOUNDATIONS.md), with what each one should change in Keel.
- **Writers and translators:** make every screen plainer, warmer, and available in more languages.
- **Designers:** accessibility, mobile, and the brand.
- **Workforce programs, libraries, unions, and faith communities:** tell us what you'd need to run Keel for the people you serve.

**Developers:** pick an item from the [roadmap](./docs/ARCHITECTURE.md#roadmap) and open an issue before starting large work. Run `pnpm typecheck` before opening a PR.

Read [CONTRIBUTING.md](./CONTRIBUTING.md) for the ground rules.

## Supporting Keel

Keel is free for everyone and funded entirely by donations: never ads, never your data. Every dollar in and out will be public. See [FUNDING.md](./docs/FUNDING.md).

## License

[MIT](./LICENSE)
