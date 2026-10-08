# Keel Architecture

## Design goals

1. **Values before jobs.** Data flows one way: reflections → values → mission → career paths. Nothing in stage 4 should be computed without a mission to measure against.
2. **The AI is a guide, not an oracle.** Every AI output is stored as a *draft* that the person must accept or edit. The guide's rules live in one place (`convex/guide.ts`) so contributors can review them.
3. **Privacy by default.** All user data is scoped to the owner. Export and delete are first-class features, not afterthoughts.
4. **Swappable AI provider.** Any OpenAI-compatible endpoint works, so self-hosters can use local models.

## Data model

```
profiles            one per person: name, how AI has affected their work, current stage
  └─ reflections    free-text answers to journey prompts (stage 1 & 2)
  └─ values         chosen/custom values, ranked, with optional "why this matters"
  └─ missionStatements  versioned drafts; exactly one may be "accepted"
  └─ careerPaths    (planned) paths scored against the accepted mission
```

## Identity (temporary)

The foundation uses an anonymous `sessionId` generated in the browser so the app works with zero setup. **Before any public launch**, replace this with [Convex Auth](https://labs.convex.dev/auth) (anonymous + email/magic link). All functions resolve the owner through one helper, `ownerKey()` in `convex/lib/owner.ts`, so the swap touches one file.

## Safety & wellbeing

- The guide's system prompt instructs it to recognize distress and point people to human support, never to diagnose, and never to present itself as a replacement for counseling.
- Crisis resources should be shown in the UI itself (not only via AI) and localized by region. *(Planned)*

## Roadmap

### Phase 0 — Foundation ✅
- [x] Story, manifesto, principles
- [x] Schema and core functions for stages 1–3
- [x] Guide system prompt with humans-first rules
- [x] Minimal web app: Ground → Discover (values) → Declare (mission draft)

### Phase 1 — Guided reflection
- [ ] Onboarding intake for Stage 1 (spec: [ONBOARDING.md](./ONBOARDING.md))
- [ ] Bridge track for people who need income within weeks
- [ ] Replace sessionId with Convex Auth
- [ ] Conversational guide using the Convex Agent component (threads per stage)
- [ ] Values card-sort UI (accessible, mobile-first)
- [ ] Export (Markdown/PDF) and delete-everything
- [ ] Crisis/support resources page

### Phase 2 — Mission statement
- [ ] Iterative drafting with side-by-side versions
- [ ] Shareable, public "mission page" (opt-in)

### Phase 3 — Navigate
- [ ] Transferable-skills inventory from work history
- [ ] Rebuilding toolkit: restore rhythm, connection, purpose, identity, and activity during the search (see [FOUNDATIONS.md](./FOUNDATIONS.md))
- [ ] Job crafting: reshape a current role instead of leaving it
- [ ] Career path exploration scored against the accepted mission
- [ ] Job search and tracking (ideas borrowed from career-ops), always draft-only

### Phase 4 — Community
- [ ] Self-hosting guide for workforce programs, libraries, unions
- [ ] Facilitator mode: a counselor guides someone through Keel
- [ ] Translations
