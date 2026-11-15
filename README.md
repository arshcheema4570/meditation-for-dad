# Meditation for Dad

Offline guided meditation PWA in English and Hindi. No account, no network after the first voice download. Everything runs on-device.

Live: https://arshcheema4570.github.io/meditation-for-dad/

## What's inside

**🧘 Meditate** — eight guided sessions, spoken by the natural Phonon 31M voice in English (CPU/WASM, offline after a one-time ~35 MB download):
- Focus Reset (5 min), Deep Calm (10 min), Sleep Wind-Down (8 min), Stress Reset (5 min box breathing)
- Morning Energy (5 min), Body Scan (10 min), Gratitude (5 min), Anxiety Relief (6 min)
- Visual breathing pacer with phase tones, timed quiet pauses, session completion tracking

**🌐 English + हिन्दी** — a language toggle switches the scripts. English is spoken by Phonon 31M (natural voice, ~35 MB one-time download, then offline); Hindi is spoken by the device's built-in Hindi voice (hi-IN). The device voice is also the fallback if the natural voice is unavailable.

**📊 Progress** — day streak, total meditation minutes, sessions done, last-7-days activity bars. All in localStorage, on your device.

## Honest notes

- The Phonon 31M voice (~35 MB) downloads once from the CDN, then lives in the browser cache for offline use — see `NOTICE.md`.
- iOS: if installed-app audio behaves oddly, open the page in Safari.
- No analytics, no accounts, zero external URLs after the voice is cached.

## Run locally

Any static server, e.g. `python3 -m http.server`, then open http://localhost:8000.

## Build

`pnpm install` then `pnpm build`. The GitHub Actions workflow deploys `dist/` to GitHub Pages on every push to `main`.
