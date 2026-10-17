---
name: Keel
description: Works Program Poster under one word, peace. Flat silkscreen dawn over still water; actions live below the waterline.
colors:
  sky: "#e7f0ee"
  raised: "#f6faf9"
  band-sky: "#d9e8e5"
  haze: "#f1d6b4"
  ridge-far: "#a9c4bd"
  ridge-near: "#6f9a92"
  sun: "#efb84a"
  on-sun: "#13252a"
  water: "#144a56"
  water-deep: "#0e3640"
  glint: "#f6d58e"
  on-water: "#eef6f5"
  on-water-muted: "#bcd5d3"
  ink: "#13252a"
  muted: "#43585d"
  title: "#144a56"
  accent: "#144a56"
  edge: "#6c8784"
  rule: "#c5d6d3"
  select: "#fbe8bf"
  error: "#9b2d20"
  on-error: "#ffffff"
  focus: "#0e3640"
typography:
  display:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(2.5rem, 10.5vw, 3.9rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "0.01em"
  headline:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(2.1rem, 8vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.02em"
  question:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(1.95rem, 7.2vw, 2.4rem)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "0.01em"
  title:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "1.45rem"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0.03em"
  heading:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 700
    lineHeight: 1.3
  lede:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "1.12rem"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.08em"
rounded:
  flat: "0px"
  cut: "2px"
  disc: "50%"
spacing:
  hairline: "6px"
  gap: "10px"
  row: "12px"
  gutter: "16px"
  block: "32px"
  closing: "56px"
  footer: "72px"
components:
  button-primary:
    backgroundColor: "{colors.sun}"
    textColor: "{colors.on-sun}"
    rounded: "{rounded.cut}"
    padding: "10px 18px"
    height: "48px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.cut}"
    padding: "10px 18px"
    height: "48px"
  button-quiet-hover:
    backgroundColor: "{colors.raised}"
  button-quiet-on-water:
    backgroundColor: "transparent"
    textColor: "{colors.on-water}"
    rounded: "{rounded.cut}"
    padding: "10px 18px"
    height: "48px"
  button-quiet-on-water-hover:
    backgroundColor: "{colors.water-deep}"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
    padding: "4px 6px"
    height: "44px"
  button-small:
    padding: "6px 12px"
    height: "44px"
  button-danger-solid:
    backgroundColor: "{colors.error}"
    textColor: "{colors.on-error}"
    rounded: "{rounded.cut}"
    padding: "10px 18px"
    height: "48px"
  input:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.cut}"
    padding: "12px 14px"
  choice:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.flat}"
    padding: "15px 12px"
    height: "56px"
  choice-hover:
    backgroundColor: "{colors.raised}"
  choice-selected:
    backgroundColor: "{colors.select}"
  path:
    backgroundColor: "transparent"
    rounded: "{rounded.flat}"
    padding: "20px 14px"
  path-recommended:
    backgroundColor: "{colors.haze}"
  tab:
    textColor: "{colors.muted}"
    rounded: "{rounded.flat}"
    padding: "12px 2px"
    height: "48px"
  tab-active:
    textColor: "{colors.ink}"
  waterbar:
    backgroundColor: "{colors.water}"
    textColor: "{colors.on-water}"
    padding: "12px 16px"
  lake:
    backgroundColor: "{colors.water}"
    textColor: "{colors.on-water}"
  field-haze:
    backgroundColor: "{colors.haze}"
    textColor: "{colors.ink}"
    rounded: "{rounded.flat}"
    padding: "20px 18px 8px"
  field-band:
    backgroundColor: "{colors.band-sky}"
    textColor: "{colors.ink}"
    rounded: "{rounded.flat}"
    padding: "14px 16px"
  counter-disc:
    backgroundColor: "{colors.water}"
    textColor: "{colors.on-water}"
    rounded: "{rounded.disc}"
    size: "30px"
  counter-disc-done:
    backgroundColor: "{colors.sun}"
    textColor: "{colors.on-sun}"
  tag:
    backgroundColor: "{colors.select}"
    textColor: "{colors.ink}"
    rounded: "{rounded.cut}"
    padding: "1px 8px"
---

# Design System: Keel

## Overview

**Creative North Star: "The Works Program Poster, under one word: peace"**

Keel is drawn the way the 1930s public works posters were printed: flat silkscreen layers, each one a single ink, stacked into a dawn over still water. A pale sky ground carries the reading; an apricot haze, a gold sun, two sage ridges and a deep teal lake make up the horizon band at the top of every screen; and the same lake comes back at the bottom, where the actions and the footer sit. The visitor reads in the sky and acts in the water. The governing feeling is peace: unhurried, one thing per screen, help always one tap away.

The system is plain and civic rather than soft. It refuses the calm-wellness default (cream ground, rounded white cards, soft serif) and the clinical portal. Density is low: a single 40rem column, generous rows, large tap targets, large type for questions. Depth comes from stacked flat color, never from shadow or gradient. Night is the same lake with the sun turned to a low gold moon, not an inverted palette.

Signage type does the talking in short bursts (Big Shoulders); everything a person must read is set in a face built for low vision (Atkinson Hyperlegible Next). Motion is slow and settles: the sun rises with progress through onboarding over 1.6 seconds and simply stands still under reduced motion.

**Key Characteristics:**
- Flat silkscreen color fields; no gradients, textures, or soft cards.
- A horizon band header (sky, haze, sun, ridges, water) on every screen; the sun's height carries progress.
- Actions live below the waterline: the fixed water bar in onboarding, the closing lake band on content screens, the lake footer.
- Hard 2px corners on controls; the only round forms are discs (sun, counters, ranks).
- Big Shoulders for short display, Atkinson Hyperlegible Next for all reading, 17px body.
- One calm ease for everything; nothing bounces.

## Colors

A dawn palette of pale teal-grey sky, apricot haze, marigold sun and deep lake teal, printed as flat inks; every role has a night counterpart in the dark scheme (see sidecar).

### Primary
- **Marigold Sun** (#efb84a): the way forward. Fills primary buttons, the sun disc, completed week counters and value ranks. Ink on sun measures 8.77:1. Night: Moon Gold (#f2c25c), which also becomes the title and focus color.
- **Lake Teal** (#144a56): the water. The water bar, the closing lake band, the footer, the horizon's water strip, and open counters. On-water text measures 8.93:1. In light mode it is also the title, link, accent and selected-edge color.

### Secondary
- **Apricot Haze** (#f1d6b4): the horizon's haze strip, reused as the warm field behind "This week", the recommended start path, accepted missions, selected values and the acknowledgment's help line. Ink on haze 11.33:1, muted on haze 5.38:1.
- **Morning Light** (#fbe8bf): selection. Chosen choice rows, chosen chips, callouts, tags, and text selection.

### Tertiary
- **Far Ridge** (#a9c4bd) and **Near Ridge** (#6f9a92): horizon art only. Never text, never a control fill.
- **Glint** (#f6d58e): the sun's reflection bars on the water; fades in as the sun rises.

### Neutral
- **Dawn Sky** (#e7f0ee): the page ground. Not cream. Ink on sky 13.65:1; muted on sky 6.48:1.
- **Raised Mist** (#f6faf9): input fill and the hover state of quiet rows and buttons.
- **Band Sky** (#d9e8e5): the horizon's sky and the cool flat field behind scripts, missions and value tiles; the hover state of start paths.
- **Shore Ink** (#13252a): all reading text and the text on sun.
- **Slate Muted** (#43585d): ledes, helpers, hints, unchosen tabs.
- **Reed Edge** (#6c8784): form-control and quiet-button borders, 3.67:1 against raised (night 4.40:1).
- **Tide Rule** (#c5d6d3): quiet 1px dividers between rows and folds.
- **Deep Water** (#0e3640): tester strip ground, focus ring, hover on water.
- **Ember Error** (#9b2d20): error text and the solid danger button. At night the error turns to #f0a091 and the solid danger button takes dark ink (on-error #13252a), because white on #f0a091 is only 2.07:1.

### Named Rules
**The Sun Is the Way Forward Rule.** Marigold fills only the primary action, the sun, and completed or ranked discs. In light mode it is never text on sky; one sun-gold button per decision.

**The Flat Ink Rule.** Every surface is one flat color from the palette. No gradients, no textures, no translucent overlays; layering is done by stacking fields.

**The Night Lake Rule.** Dark mode is the same scene at night, not an inversion: ground goes to deep teal (#0f252c), the sun becomes moon gold, titles turn gold (9.57:1 on night sky), links turn pale teal (#8fd0cf).

## Typography

**Display Font:** Big Shoulders 600/700 (with Arial Narrow, sans-serif)
**Body Font:** Atkinson Hyperlegible Next 400/600/700 (with system-ui, sans-serif)

**Character:** Condensed civic signage set against a reading face designed for low vision: the poster shouts briefly and kindly, then the text speaks plainly.

### Hierarchy
- **Display** (Big Shoulders 700, clamp(2.5rem, 10.5vw, 3.9rem), 0.98, uppercase): the welcome screen headline only.
- **Headline** (Big Shoulders 700, clamp(2.1rem, 8vw, 2.75rem), 1, uppercase, 0.02em): one screen title per screen, in the title color, balanced wrap.
- **Question** (Big Shoulders 700, clamp(1.95rem, 7.2vw, 2.4rem), 1.06, sentence case): onboarding questions and the first line of the acknowledgment (2rem to 2.5rem). Sentence case because they are read as sentences.
- **Title** (Big Shoulders 700, 1.45rem, 1.05, uppercase, 0.03em): the heading of a flat field such as "This week"; start path names use the same face at 1.6rem in sentence case.
- **Heading** (Atkinson 700, 1.2rem, 1.3): section and fold headings (1.1rem to 1.2rem).
- **Lede** (Atkinson 400, 1.12rem, muted, max 36rem): the sentence under a screen title.
- **Body** (Atkinson 400, 17px root, 1.55, column max 40rem): all reading. Inputs set at 1.0625rem; helpers at 0.95rem.
- **Label** (Big Shoulders 600, 0.9rem, uppercase, 0.08em, muted): names a group of choices or a footer group. Nothing else.

### Named Rules
**The Two Voices Rule.** Big Shoulders sets only short display text: titles, questions, path names, numerals in discs, group labels. Anything longer than a sentence, any instruction, every control label is Atkinson.

**The Label Names a Group Rule.** The uppercase label exists to name a set of controls beneath it. It never sits above a title as decoration.

## Layout

A single centered column: content max 40rem plus 16px gutters on each side (calc(40rem + 32px)), shared by the horizon top row, the tabs and the page. Page padding is 28px top on phones and 40px at 720px and wider. Rhythm: 6px inside fields, 10px between buttons, 12px to 15px row padding, 18px between form fields, 32px between blocks, 56px before the closing lake band, 72px before the footer.

The horizon band is 104px tall on phones and 128px at 720px and wider, where the sun moves from a small disc between the wordmark and "Talk to a person" to a larger centered disc. Under 560px the four tabs form a 2 by 2 grid so none scroll out of sight. In onboarding the actions sit in a fixed water bar at the bottom (with safe-area inset) and the page reserves 96px to 120px so nothing hides behind it.

Every screen ends in water: content screens close with a full-bleed lake band holding the screen's actions, which runs straight into the lake footer.

## Elevation & Depth

The system is flat. Depth is told the poster way, by stacking flat fields in landscape order: sky above, haze and ridges at the horizon, water at the bottom. A field's color says where it sits (sky for reading, haze for warmth and "start here", band sky for quotable or reusable text, water for acting). Selection and hover change the fill, never the elevation.

### Named Rules
**The Waterline Rule.** Depth is position in the landscape, not shadow. Nothing on the sky casts a shadow.

## Shapes

Silkscreen is cut flat. Controls and inputs take a hard 2px corner; rows, paths, tabs and flat fields take none and are separated by 1px rules rather than enclosed. Borders are 1.5px Reed Edge on controls; a selected value tile shows a 1.5px accent edge. The only round shapes are discs: the sun, numbered week counters (30px) and value ranks (32px), set in Big Shoulders numerals. The fold indicator is a drawn 2px chevron that rotates, not a glyph.

**The Hard Edge Rule.** No rectangle rounds beyond 2px. If it is round, it is a sun-like disc.

## Components

### Buttons
Plain, firm, and tall.
- **Shape:** hard 2px corner; 48px minimum height, 10px 18px padding. Small and link buttons keep a 44px floor.
- **Primary:** sun fill and border, ink text, 700 weight. Hover brightens 5%.
- **Quiet:** transparent with a 1.5px edge border, ink text; hover fills raised. On water: on-water text, on-water-muted border, hover fills deep water.
- **Link:** underlined accent text, no border, offset 3px; on water it turns on-water.
- **Danger:** a link-style "Delete everything" in error color leads to a confirm with a solid error button beside a focused quiet Cancel.
- **Focus:** 3px solid focus ring offset 2px; inside water the ring turns sun gold.

### Chips
- **Style:** feedback-panel chips are small quiet buttons (44px, 0.92rem).
- **State:** selected takes a 2px accent border and morning-light fill.

### Cards / Containers
There are no cards. Containers are flat fields.
- **Corner Style:** none.
- **Background:** haze (This week, recommended path, accepted mission, acknowledgment help) or band sky (scripts, missions, value tiles).
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** none; inner rows use 1px rules (inside haze, ink at 18%).
- **Internal Padding:** 14px to 20px.

### Inputs / Fields
- **Style:** raised fill, 1.5px Reed Edge border, 2px corner, 12px 14px padding, 1.0625rem text. Labels sit above in 700; helpers below in muted.
- **Focus:** 3px focus ring, caret in accent.
- **Checkboxes and radios:** native, 20px, accent-colored.

### Choices
Quiet rows on the sky, never boxed. Each row is at least 56px with 15px 12px padding, a 20px native control at left, a 600 label and an optional muted hint, and a 1px rule below. Hover fills raised, selected fills morning light, keyboard focus draws the ring inside the row. At most four options per group; larger sets split into labeled groups.

### Navigation
Text tabs under the horizon: 48px tall, 600 weight, muted at rest, ink on hover. Active is ink with a 3px accent underline drawn inset. A 1px rule closes the tab row. Under 560px the tabs form a 2 by 2 grid.

### Horizon Band (signature)
A full-width SVG of flat layers: band sky, a haze strip, the sun disc, far and near ridges, a water strip with three glint bars. The wordmark (Big Shoulders 700, uppercase, 1.75rem, title color) with the mark sits left in the sky; "Talk to a person" sits right. The sun's height is the progress: onboarding raises it with every answer over 1.6s on the calm ease, and the glint fades in with it. The band is decorative; progress is always also given in text.

### Water Bar
The onboarding action bar: fixed to the bottom, water fill, max 40rem inner row holding Back (link), the "N of M" count in on-water-muted, Skip (quiet) and Next (primary).

### Lake Band and Footer
The closing lake band breaks out to full bleed and holds a screen's final actions; the footer continues the same water with the crisis line, footer groups under labels, and the danger zone set off by a 22% on-water rule.

### Start Paths
Full-width rows with a Big Shoulders 1.6rem name and a muted description. Hover fills band sky; the recommended path sits in haze with "Suggested for you" in bold text.

## Do's and Don'ts

### Do:
- **Do** put every screen's actions in the water: the water bar in onboarding, the closing lake band elsewhere.
- **Do** keep one sun-gold primary per decision; give everything else the quiet or link treatment.
- **Do** separate rows with 1px rules on the sky and use flat haze or band-sky fields for grouped content.
- **Do** set questions in Big Shoulders sentence case at the question size, with at most four options per group.
- **Do** keep targets at 48px for buttons and never under 44px for any control.
- **Do** animate with the calm ease (cubic-bezier(0.16, 1, 0.3, 1)) at 400ms to 1600ms, and let reduced motion stop it.
- **Do** keep form borders at 3:1 or better against their fill (Reed Edge on raised: 3.67:1).

### Don't:
- **Don't** use a cream ground, rounded white cards, or a soft serif; that is the wellness default Keel refuses.
- **Don't** use gradients, textures, or shadows on anything that sits on the sky.
- **Don't** round a rectangle beyond 2px; circles are reserved for discs.
- **Don't** set paragraphs, instructions, or control labels in Big Shoulders.
- **Don't** put an uppercase label above a title as decoration.
- **Don't** use ridge colors for text or controls, or sun gold for text on the light sky.
- **Don't** put white text on the night error color; it uses dark ink.
