# Meditation for Dad

Offline guided meditation PWA in English and Hindi. No account, no network after the first voice download. Everything runs on-device.

Live: https://arshcheema4570.github.io/meditation-for-dad/

## What's inside

**🧘 Meditate** — eight guided sessions, spoken by the natural Kokoro-82M voice (CPU/WASM, offline after a one-time ~92 MB download):
- Focus Reset (5 min), Deep Calm (10 min), Sleep Wind-Down (8 min), Stress Reset (5 min box breathing)
- Morning Energy (5 min), Body Scan (10 min), Gratitude (5 min), Anxiety Relief (6 min)
- Visual breathing pacer with phase tones, timed quiet pauses, session completion tracking

**🌐 English + हिन्दी** — a language toggle switches the scripts and the Kokoro voice (English: af_heart; Hindi: hf_alpha). Phonon 31M stays available as an alternate English voice; the device voice is a last-resort fallback.

**📊 Progress** — day streak, total meditation minutes, sessions done, last-7-days activity bars. All in localStorage, on your device.

## Honest notes

- Kokoro-82M is slow on CPU — the first sentence of a step takes a few seconds to generate. The voice itself is the natural one; the wait is the price of running it fully offline on-device.
- The model (~92 MB) and the ONNX runtime wasm (~21 MB) download once, then live in the browser cache / service worker for offline use.
- iOS: if installed-app audio behaves oddly, open the page in Safari.
- No analytics, no accounts, zero external URLs after the voice is cached.

## Run locally

Any static server, e.g. `python3 -m http.server`, then open http://localhost:8000.

## Build

`pnpm install` then `pnpm build`. The GitHub Actions workflow deploys `dist/` to GitHub Pages on every push to `main`.
