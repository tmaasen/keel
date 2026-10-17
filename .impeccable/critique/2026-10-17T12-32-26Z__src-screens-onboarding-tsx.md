---
target: onboarding and steady ground screen
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
target_identity: "file:/Users/tannermaasen/Documents/git/keel/src/screens/Onboarding.tsx"
target_fingerprint: "sha256:54b9076cc47eba5d648f7f34c1b3535f21b52e07a5fec7d8539e91db34443606"
target_path: /Users/tannermaasen/Documents/git/keel/src/screens/Onboarding.tsx
timestamp: 2026-10-17T12-32-26Z
slug: src-screens-onboarding-tsx
---
Method: dual-agent (A: design review · B: detector + browser overlay). Note: both agents shared one Playwright browser context; one detector overlay briefly appeared in a reviewer screenshot and was disregarded.

## Design Health Score: 24/40 (Acceptable)
| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 2 | Text-only progress, no save confirmation, silent Copy, silent Delete everything |
| 2 | Match system / real world | 4 | Plain, warm language; "Thank you" CTA slightly off |
| 3 | User control and freedom | 2 | "Talk to a person" dead during onboarding; reload resets step; no Back on acknowledgment/struggling |
| 4 | Consistency and standards | 3 | Paged onboarding vs single-scroll Bridge |
| 5 | Error prevention | 2 | Unemployment advice shown to "worried"; Skip bypasses struggling interstitial |
| 6 | Recognition rather than recall | 3 | Scripts keep [name]/[kind of work] though Keel knows them |
| 7 | Flexibility and efficiency | 2 | Enter doesn't advance; no in-page nav on 7-section Bridge |
| 8 | Aesthetic and minimalist | 2 | Bridge ~6.7 phone screens; acknowledgment lines all equal weight |
| 9 | Error recovery | 2 | Copy fails silently; no offline handling on save |
| 10 | Help and documentation | 2 | "Why" lines good; help entry broken in onboarding; 988 not tel:/sms: |

## Design Specificity
Words authored for Keel; visuals category-interchangeable (cream + white cards + Fraunces/Inter + teal). Detector agrees: cream-palette on every view; overused-font x9 (styles.css); line-length x6 on Bridge (91-100ch, no max-width); low-contrast p.eyebrow 4.3:1; dark textarea placeholder 3.4:1 (TranslateWork). False positive: .brand wordmark 3.9:1 is large bold text (3:1 applies).

## Priority Issues
1. [P0] "Talk to a person" no-op during onboarding (App.tsx renders Onboarding regardless of view). Fix: support overlay with return-to-step. /impeccable harden
2. [P1] Struggling path leaks: skip() ignores struggling; interstitial shows "9 of 10" and no Back; ack/start ignore struggling; 988 not tel:/sms:. /impeccable harden, /impeccable clarify
3. [P1] Bridge 5,617px wall, wrong-audience blocks (unemployment for worried/exploring), scripts not prefilled, lines up to 100ch. Gate on aiImpact, numbered "This week" first card, disclosures + index, max-width ~68ch. /impeccable distill then /impeccable layout
4. [P2] Phone: banner+topbar ~250px; Let's start and Next below fold; destructive footer on screen one. Sticky bottom action bar, slim banner. /impeccable adapt
5. [P2] WCAG AA gaps: warm #b8643a small text 4.27-4.3:1; input borders 1.35:1; unnamed radiogroup/checkbox groups; no focus move to new h2; no <main>; smooth scroll ignores reduced motion; dark placeholder 3.4:1. /impeccable audit

## Persona Red Flags
- Jordan: "Jordan" reused as orientation persona; unexplained nav labels; disabled pill reads broken; "Thank you" CTA unclear.
- Casey: reload resets onboarding; Next below fold; no anchors on Bridge; Copy no feedback.
- Sam: unnamed groups; focus stays on Next; contrast fails; new-tab links unannounced.
- Denise (53, 25 yrs, cheap Android): "20+ years" band; runway at step 3; dead support link; Bridge opens "Apply for unemployment now"; placeholder-only instructions; bracket placeholders in scripts.

## Minor
Name counts as question 1 of 10; "About 5 minutes" undersells; static <title>; unsourced "quietly hiring them back"; Rest path has no "stop here".

## Questions
1. Why end on a 6-screen checklist instead of one "do this today" card and permission to stop?
2. Should "I'm really struggling" change the rest of the product?
3. Does someone with under a month of runway need ten questions before help?
