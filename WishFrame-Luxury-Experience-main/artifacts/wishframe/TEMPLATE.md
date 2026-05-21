# WishFrame — Premium Birthday Surprise Template

A cinematic, scroll-driven birthday experience built to sell at ₹499–₹999 per delivery. Every element is designed for maximum emotional impact and luxury feel.

---

## Quick Customization (30 seconds)

Open `src/pages/WishFrame.tsx` and edit the variables at the very top:

```ts
const name = "Buddy";               // → Recipient's name (appears in preloader, cake, final reveal)
const friendshipYears = 3;          // → Years of friendship (drives all 4 stats automatically)
const videoId = "jfKfPfyJRdk";      // → YouTube video ID (replace with a personal video)
const finalMessage = "From your friend, with all the respect in the world.";

const memories = [
  {
    text: "That trip we almost didn't take",
    subtext: "We were broke, tired, and somehow it became the best story we ever tell.",
    image: "https://your-image-url.jpg",  // ← swap with a real photo
    tag: "Adventure",
    year: "2022",
  },
  // Add or remove memory objects here
];
```

That's it. The entire experience re-renders from these 5 variables.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | React 18 + Vite 7 | Instant HMR, zero-config build |
| Language | TypeScript 5 | Safe props, no runtime surprises |
| Styling | Pure CSS3 custom properties | No runtime CSS-in-JS cost, easy to theme |
| Parallax | Scroll + `position: sticky` | GPU-composited, 60 fps, no library needed |
| Animations | CSS keyframes + Web Animations API | Hardware-accelerated, battery-friendly |
| Audio | Web Audio API | No audio files — piano chords synthesised in-browser |
| Particles | Canvas 2D API | Zero-dependency star field and shooting stars |
| Scroll triggers | Intersection Observer | Native browser API, no scroll jank |
| Confetti | Canvas 2D (custom) | Physics-based, gold-palette only |
| State | React useState / useRef | No Redux needed — app is linear |
| Build output | Static HTML + CSS + JS | Deploy anywhere: Vercel, Netlify, GitHub Pages |

---

## File Structure

```
src/
├── pages/
│   └── WishFrame.tsx          ← Main page + ALL customization vars at top
├── components/
│   ├── SceneParallax.tsx      ← 3-phase scroll-driven cinematic intro
│   ├── Preloader.tsx          ← Cinematic name reveal (typewriter + orbs)
│   ├── FilmGrain.tsx          ← Animated canvas noise overlay
│   ├── BirthdayCake.tsx       ← Interactive SVG candles (click/mic to blow)
│   ├── SecretLetter.tsx       ← Envelope that opens with typewriter reveal
│   ├── PhotoGallery.tsx       ← Polaroid grid with lightbox
│   ├── AmbientAudio.tsx       ← Web Audio API synthesised piano
│   ├── Confetti.tsx           ← Gold confetti on final reveal
│   ├── ParticleField.tsx      ← Canvas star field
│   └── ShootingStars.tsx      ← Canvas shooting stars
├── wishframe.css              ← All styles (CSS custom properties at top)
└── index.css                  ← Body reset + Google Fonts import
```

---

## Theming

All colours and fonts live as CSS custom properties in `wishframe.css`:

```css
:root {
  --dark:       #07070e;   /* Background */
  --dark-2:     #0c0b18;
  --gold:       #c9a96e;   /* Primary gold */
  --gold-light: #f0d080;   /* Bright gold (headings) */
  --text-primary: rgba(240,232,215,0.95);
  --text-muted:   rgba(200,185,165,0.55);
  --font-serif: 'Cormorant Garamond', serif;
  --font-sans:  'Inter', sans-serif;
}
```

To change the colour palette, edit only these 8 lines.

---

## Section Order & What Each Does

1. **Preloader** — Cinematic 3.5s intro: star → "a birthday surprise for…" → types the name → fades out
2. **SceneParallax** — 3-phase scroll: mountains/trees/arches converge as text phases transition
3. **Memories** — 3D-tilt cards with photos, tags, and emotional copy
4. **FriendshipStats** — 4 animated counters driven by `friendshipYears`
5. **PhotoGallery** — Polaroid grid with gold-border lightbox
6. **VideoMemory** — YouTube embed (autoplay, muted, looped) with cinematic corners
7. **Emotional Buildup** — Particle field + floating orbs + poetic copy
8. **BirthdayCake** — Interactive SVG candles; click or use microphone to blow them out
9. **SecretLetter** — Envelope tap → opens → typewriter letter reveal
10. **Final Reveal** — Pulsing rings + "Happy Birthday, [name]" + confetti burst
11. **CTA** — Convert viewers into buyers ("Create WishFrame · Starting ₹499")

---

## Adding More Memories

Add an object to the `memories` array:

```ts
{
  text: "The concert we almost missed",
  subtext: "Last-minute tickets, front row, and we still talk about it.",
  image: "https://your-cdn.com/photo.jpg",
  tag: "Night to Remember",
  year: "2025",
}
```

The layout automatically stacks and the gallery adds the photo to the polaroid grid.

---

## Replacing the Video

1. Find a YouTube video URL, e.g. `https://youtu.be/dQw4w9WgXcQ`
2. Copy the ID after `/youtu.be/` or `?v=` → `dQw4w9WgXcQ`
3. Set `const videoId = "dQw4w9WgXcQ";` at the top of `WishFrame.tsx`

---

## Replacing the Secret Letter

Edit the `SecretLetter` component (`src/components/SecretLetter.tsx`). The letter text is a simple string array — each item is one paragraph rendered with the typewriter effect.

---

## Deployment

```bash
pnpm --filter @workspace/wishframe run build
# Output → artifacts/wishframe/dist/
```

Upload the `dist/` folder to any static host. No server required.

- **Vercel**: `vercel --cwd artifacts/wishframe`
- **Netlify**: drag-and-drop `dist/` in the dashboard
- **GitHub Pages**: push `dist/` to a `gh-pages` branch

---

## Selling This Template

Suggested pricing tiers:

| Tier | Price | What to include |
|---|---|---|
| Starter | ₹499 | Customise name + message only |
| Standard | ₹749 | Name + memories + photos |
| Premium | ₹999 | Everything + personal video |

All customisation happens in one file (`WishFrame.tsx`) — you can deliver a finished experience in under 10 minutes per order.
