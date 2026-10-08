# Contributing to Keel

Thank you for wanting to help. Keel exists for people going through one of the hardest moments of their working lives, so we hold contributions to a simple test: **does this put the human first?**

## Ways to help

- **Not a developer?** You're especially welcome. We need career counselors, coaches, therapists, workforce-program staff, writers, designers, translators, and people who have lived through an AI-driven career change. Open an issue with your perspective.
- **Reflection prompts and values** live in `convex/journey.ts` and `convex/valuesCatalog.ts`. Improving their wording is one of the highest-impact contributions you can make.
- **The guide's rules** live in `convex/guide.ts`. Changes here get extra review.
- **Code:** pick an item from the [roadmap](./docs/ARCHITECTURE.md#roadmap) and open an issue before starting large work.

## Ground rules

1. Read the [Manifesto](./MANIFESTO.md). PRs that conflict with it won't be merged.
2. Write in plain language. Assume the reader is not technical and may be having a hard week.
3. Never add analytics, tracking, or data sharing without an explicit, opt-in design discussion.
4. AI output is always a draft the person can accept, edit, or discard.

## Development

```bash
npm install
npx convex dev
npm run dev
```

Run `npm run typecheck` before opening a PR.
