# Funding

Keel is free for everyone and funded by donations. It will never be funded by ads, by selling data, or by charging the people it serves.

## Principles

1. **Never gate help behind payment.** Every feature works for someone who gives nothing. No "premium" tier, no nag walls.
2. **Never ask someone who is struggling.** Many people using Keel just lost their income. Asks go to people who are in a better place, and to supporters who never use Keel at all.
3. **Radical transparency.** Every dollar in and out is public. People trust a project with their most personal reflections only if they can see how it's run.
4. **Pay it forward.** The core story: *someone's donation covered your journey; when you're back on your feet, you can cover someone else's.*

## Where money goes

| Cost | Notes |
|---|---|
| **AI usage (OpenRouter)** | The main variable cost. Scales with active users. |
| **Convex** | Free tier to start; paid plan as usage grows. |
| **Hosting + domain** | Small. |
| **Future:** accessibility audit, translation, counselor review stipends | Funded once the basics are covered. |

### Estimating AI cost

Track this from day one, then set donation goals from real numbers:

```
cost per journey ≈ (guide messages per journey) × (avg tokens per message) × (model price per token)
monthly AI budget ≈ cost per journey × journeys started per month
```

Choosing a smaller, cheaper model for routine guide turns and a stronger one only for mission drafting can cut costs significantly. Re-check model prices on OpenRouter before setting goals.

## Platforms

| Platform | Fees | Why |
|---|---|---|
| **[Open Collective](https://opencollective.com)** via **Open Source Collective** (fiscal host) — *primary* | Host fee set by the fiscal host (confirm current rate when applying) + payment processing | Public ledger of every donation and expense. Money belongs to the project, not to one person, so it can outlive any single maintainer. Expenses (like the OpenRouter bill) are submitted and approved in public. |
| **[GitHub Sponsors](https://github.com/sponsors)** — *secondary* | No GitHub fee on sponsorships from personal accounts | Easy for developers. Shows a "Sponsor" button on the repo via `.github/FUNDING.yml`. |

**Tax note:** Open Source Collective is a 501(c)(6), so US donations to it are generally **not** tax-deductible. If tax-deductible giving becomes important (for example, for grants or larger donors), look into a 501(c)(3) fiscal sponsor later. Sponsorship income paid to an individual is generally personal taxable income. *This isn't legal or tax advice. Check with a professional.*

## When and how Keel asks

| Moment | Ask? |
|---|---|
| Onboarding | **Never** |
| Wellbeing check-in was low (1–2) | **Never**, for the whole session |
| Urgency = "within weeks" / Bridge track | **Never** |
| During reflection or drafting | **Never** |
| Right after someone accepts their mission statement | A single, gentle line: *"Keel is free because people gave. If it helped, you can help someone else find their keel."* Dismissible, shown once. |
| Footer and About page | A quiet "Support Keel" link, always |
| Landing page | A section for supporters who'll never use Keel themselves: employers, people who've been through it, faith and community groups |

Never use guilt, countdowns, fake scarcity, or "Keel will shut down" messages.

## When money runs low

Keel must degrade gracefully, never break:

1. **Per-person limits** on AI messages per day (Convex rate-limiter component) protect the budget from abuse.
2. **A hard monthly spend cap** in OpenRouter matches what's actually in the bank.
3. **If the AI budget runs out:** every non-AI part of Keel keeps working (reflection prompts, values, writing your own mission, export). The guide says plainly: *"The guide is resting until next month. Everything you've written is safe, and you can keep going on your own."*
4. **Bring your own key (optional, later):** people who want unlimited AI can add their own OpenRouter key.

## Partnerships (later)

Libraries, workforce boards, unions, churches, and schools that run Keel for their communities can self-host it at their own cost. Grants from foundations focused on workforce transitions are another path once Keel has real stories to tell.

## Setup checklist

- [ ] Apply to Open Source Collective as fiscal host
- [ ] Set up GitHub Sponsors and add `.github/FUNDING.yml`
- [ ] Set a monthly spend cap in OpenRouter
- [ ] Add per-user AI rate limits (Convex rate-limiter)
- [ ] "Support Keel" link in footer + About page
- [ ] One-time ask after mission acceptance (respecting the rules above)
- [ ] Graceful "guide is resting" state when the AI budget is spent
- [ ] Publish a monthly cost update on Open Collective
