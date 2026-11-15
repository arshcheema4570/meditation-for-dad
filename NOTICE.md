# Third-party notices — Phonon voice (English)

The natural English voice in this app is the offline **Phonon 31M**
text-to-speech model, loaded from the `phonon-tts` npm package
(bundled by Vite; its weights download once from the CDN, then live in the
browser cache for offline use). Hindi is spoken by the device's built-in
speech synthesis (hi-IN) — no third-party voice is used for Hindi.

| Component | License | Source |
|---|---|---|
| Phonon 31M model + `phonon-tts` 0.6.0 (WASM runtime) | MIT OR Apache-2.0 | Gradium — `phonon-tts` (github.com/gradium-ai/xn-ptts, `ptts-wasm`) |
