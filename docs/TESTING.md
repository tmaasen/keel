# Tester round 1

Goal: put Keel in front of 10–15 people affected by AI and learn whether the onboarding, the acknowledgment, the Bridge track, and the AI choice feel right. See [USER_RESEARCH.md](./USER_RESEARCH.md#still-to-learn-from-testers) for the open questions.

## 1. Deploy

**Convex (backend)**

```bash
pnpm exec convex deploy        # creates/updates your production deployment
```

In the Convex dashboard for the **production** deployment, set (Settings → Environment Variables):

| Variable | Value |
|---|---|
| `LLM_API_KEY` | your OpenRouter key |
| `LLM_MODEL` | any model id from openrouter.ai/models |
| `AI_DAILY_LIMIT` | optional, defaults to 10 AI drafts per person per day |
| `APP_URL` | your site URL (optional) |

**Frontend (Vercel, Netlify, or similar)**

- Build command: `npx convex deploy --cmd 'pnpm build'`
- Output directory: `dist`
- Environment variable: `CONVEX_DEPLOY_KEY` (Convex dashboard → Settings → Deploy keys → production)

**Budget safety:** set a monthly credit limit on your OpenRouter key before sharing the link.

## 2. Check it yourself first

On your phone, go through the whole flow at least twice:

- [ ] Onboarding with "My work has been drying up" + "Less than a month" → Steady ground is suggested
- [ ] Choose "I'm really struggling" → the support screen appears before continuing
- [ ] AI **off** → no draft button on Your mission; the server refuses AI calls
- [ ] AI **on** → "Ask for a first draft" works after choosing values
- [ ] Share feedback → a row appears in Convex dashboard → Data → `feedback`
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
