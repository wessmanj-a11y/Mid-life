# MID-LIFE

A dark, funny, single-player browser deckbuilder about surviving age 40 to 50 without becoming a weird bitter goblin.

## What this is

This is a playable React + TypeScript + Tailwind prototype inspired by Slay the Spire structure and absurd midlife comedy.

You choose a character class, survive yearly encounters, fight enemies that attack your life stats, collect cards and relics, defeat bosses, and unlock an ending at age 50.

## Install and run

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in your terminal.

## Build

```bash
npm run build
npm run preview
```

## Game loop

- Start at age 40.
- Each year has 3 encounters and 1 boss.
- Encounters may be combat or life events.
- Combat uses a draw pile, discard pile, 5-card hand, and energy costs.
- Enemies attack Health, Relationships, Wealth, Purpose, Sanity, or Energy.
- If Health or Sanity hits 0, the run ends.
- At age 50, the game reveals an ending based on final stats.

## Editable data

Most of the game content lives in:

```text
src/gameData.ts
```

Edit these arrays to add content:

- `actionCards`
- `enemies`
- `bosses`
- `relics`
- `lifeEvents`
- `classes`

## Art

The current prototype uses emoji and gradient placeholder art blocks so the game is functional immediately.

Future improvement: create individual PNG/SVG card art and add an `image` field to each card, enemy, relic, and event object.

Example:

```ts
{
  id: 'burnout',
  title: 'Burnout',
  image: '/cards/burnout.png',
  ...
}
```

Then update the card components to render the image instead of the emoji.

## Suggested GitHub structure

```text
mid-life-game/
  README.md
  package.json
  index.html
  src/
    App.tsx
    gameData.ts
    index.css
    main.tsx
```

## Future ideas

- Add branching map paths.
- Add card upgrades.
- Add card removal.
- Add status effects like Panic, Clarity, Exhaustion, and Dad Mode.
- Add unlockable classes.
- Add sound effects.
- Add individual card art.
- Add save/load using localStorage.
- Add balancing controls for enemy difficulty.
- Add a “Daily Mid-Life Crisis” seeded run.

## Tone guide

Keep the game funny, warm, and unhinged. The goal is not to mock aging. The goal is to make the chaos of adult life playable.
