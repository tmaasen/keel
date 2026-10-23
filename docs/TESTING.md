# Tester round 1

Goal: put Keel in front of 10–15 people affected by AI and learn whether the onboarding, the acknowledgment, the Bridge track, and the AI choice feel right. See [USER_RESEARCH.md](./USER_RESEARCH.md#still-to-learn-from-testers) for the open questions.

## 1. Deploy

Keel runs entirely on Convex: the backend and the web app. The site is served by the
[`@convex-dev/static-hosting`](https://www.npmjs.com/package/@convex-dev/static-hosting) component
at `https://<production-deployment>.convex.site`, so there's no Vercel or Netlify to set up. It works
on the Convex free plan.

**First time only**

```bash
pnpm exec convex login                  # if you aren't logged in
pnpm exec convex deploy                 # creates the production deployment
```

Production has its own settings; nothing carries over from dev. Set them from the terminal
(`--prod` targets production) or in the dashboard for the **production** deployment:

```bash
pnpm exec convex env set --prod LLM_API_KEY <your OpenRouter key>
pnpm exec convex env set --prod LLM_MODEL z-ai/glm-5.3-flash
pnpm exec convex env set --prod AI_MONTHLY_BUDGET_USD 10
pnpm exec convex env set --prod APP_URL https://<production-deployment>.convex.site
```

| Variable | Value |
|---|---|
| `LLM_API_KEY` | your OpenRouter key |
| `LLM_MODEL` | any model id from openrouter.ai/models |
| `AI_DAILY_LIMIT` | optional, defaults to 10 AI drafts per person per day |
| `AI_MONTHLY_BUDGET_USD` | optional, total AI spend across everyone per month (e.g. `10`). When it's reached, the guide shows a "resting until next month" message and everything else keeps working |
| `APP_URL` | your site URL (optional, identifies Keel to OpenRouter) |

**Every deploy**

```bash
pnpm run deploy
```

This builds the web app against production, deploys the Convex backend, and uploads the site, in
that order, so the two never drift apart. Old files are cleaned up automatically.

**How we work: branches, dev, and production**

- **Production is for testers.** It only changes when you run *Deploy to production* by hand, from `main`.
- **Dev is the sandbox.** Every push on any branch deploys there (https://qualified-scorpion-293.convex.site), so it always shows the latest work in progress. Nobody outside the team uses it.
- **`main` holds finished features only.** Build each feature on its own branch, merge it when it's done, then deploy to production when you're ready for testers to see it.

**Automatic deploys (GitHub Actions)**

- **Dev** (`.github/workflows/deploy-dev.yml`): every push, on any branch, typechecks, runs the persona tests, and deploys to dev.
- **Production** (`.github/workflows/deploy-prod.yml`): only when you run it by hand (Actions → *Deploy to production* → *Run workflow*, then type `deploy`). It deploys whatever branch you pick, so pick `main`.
- **Checks** (`.github/workflows/ci.yml`): every pull request is typechecked, tested, and built. No secrets, so it's safe for contributions from forks.

One-time setup:

1. Create two deploy keys, one per deployment:
   ```bash
   pnpm exec convex deployment token create github-dev                     # the dev deployment in .env.local
   pnpm exec convex deployment token create github-prod --deployment prod  # production
   ```
   (Or in the Convex dashboard: each deployment's Settings → Deploy keys.)
2. In GitHub: repository Settings → Environments. Create `dev` and `production`. Add the dev key to `dev` as the secret `CONVEX_DEPLOY_KEY_DEV`, and the production key to `production` as `CONVEX_DEPLOY_KEY_PROD`. In `production`, limit deployment branches to `main` and optionally require yourself as a reviewer.
3. Push a branch and check the Actions tab.

**Budget safety:** set `AI_MONTHLY_BUDGET_USD` and also a credit limit on your OpenRouter key before sharing the link. Keel's cap uses the cost OpenRouter reports for each call; the key limit is the backstop. If the key runs out, Keel shows the same resting message.

## 2. Check it yourself first

On your phone, go through the whole flow at least twice:

- [ ] Onboarding with "My work has been drying up" + "Less than a month" → Steady ground is suggested
- [ ] Choose "I'm really struggling" → the support screen appears before continuing
- [ ] AI **off** → no draft button on Your mission; the server refuses AI calls
- [ ] AI **on** → "Ask for a first draft" works after choosing values
- [ ] Share feedback → a row appears in Convex dashboard → Data → `feedback`
- [ ] Save what I wrote → a readable `keel.md` downloads with your mission, values, and reflections
- [ ] Delete everything → you're back at the welcome screen

## 3. Recruit

Good places (from the research): r/freelanceWriters, r/copywriting, r/TranslationStudies, r/VoiceActing, r/cscareerquestions, r/careerguidance, r/findapath, r/careerchange.

- **Read each subreddit's rules first.** Many ban self-promotion. Message the mods, explain that Keel is free, open source, and has nothing to sell, and ask if a post is okay.
- Post in a few places, not everywhere at once.
- Be honest that you're one person, that it's early, and that AI is part of it but optional.

### Draft post

> **Title:** I'm building a free, open-source tool for people whose work was changed by AI. Looking for 10–15 people to try it and tell me what's wrong with it.
>
> Hi all. I'm a software developer, and I've been reading a lot of threads here from people whose work has dried up or been "hollowed out" by AI. Most career tools jump straight to résumés. I wanted to build something that starts with what people are actually dealing with: income first, then what matters to you, then work that fits.
>
> It's called Keel. It's free, open source, funded by donations, has no ads, and doesn't sell or share your data. It uses AI in a couple of places, but that's **optional**, and you can turn it off on the first screen. I know AI is a sore subject here, and I'd especially like to hear if that part feels wrong.
>
> It's an early test, so things will be rough. It takes about 10 minutes. There's a "Share feedback" button on every screen, and I read everything.
>
> Link: [your URL]
> Code: https://github.com/tmaasen/keel
>
> If you're going through a really hard time right now, please don't feel any obligation. And if you're in crisis, 988 (US/Canada) is there 24/7.

## 4. Read and act on feedback

- Feedback lives in Convex dashboard → Data → `feedback` (filter by `screen` to see where it came from).
- Check daily during the first week. Reply to anyone who left contact info.
- Look for patterns, not single comments. Write what you learn into [USER_RESEARCH.md](./USER_RESEARCH.md).

## Known limitations of this build

- Answers live in the tester's browser (no accounts yet). Clearing browser data or switching devices starts over.
- Most support links are US-focused.
- "Find work that fits" (Navigate) isn't built yet.
