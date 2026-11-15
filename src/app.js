/* Meditation for Dad — offline guided meditation (English + Hindi). */
import { PhononTTS } from 'phonon-tts';
import './styles.css';

const $ = (id) => document.getElementById(id);

/* ================= language ================= */
let lang = localStorage.getItem('meditation.lang') || 'en';
if (lang !== 'hi') lang = 'en';
const STR = {
  en: {
    subtitle: 'offline guided meditation',
    meditate: '🧘 Meditate', progress: '📊 Progress', why: '❓ Why it works',
    voiceSettings: '⚙︎ Voice settings', stop: '⏹ Stop', rate: 'Rate',
    minLabel: 'meditation min', streakLabel: 'day streak', sessLabel: 'sessions done',
    last7: 'Last 7 days', today: 'today', minUnit: ' min',
    listening: 'Listening…', quiet: 'Quiet',
    breathingRound: (i, n) => `Breathing · round ${i} of ${n}`,
    complete: '✓ Complete — ', minutes: ' minutes. Well done.',
    breatheIn: 'Breathe in', hold: 'Hold', breatheOut: 'Breathe out', ready: 'ready',
    preparingPhonon: 'Preparing natural voice…',
    preparingKokoro: 'Preparing Kokoro voice…',
    phononReady: (n) => `Natural voice ready · ${n} voices · offline from now on`,
    kokoroReady: 'Kokoro voice ready · offline from now on',
    phononUnavailable: 'Natural voice unavailable — using device voice.',
    kokoroUnavailable: 'Kokoro voice unavailable — using device voice.',
    downloadFailed: 'Download failed — check connection and retry. (Needs HTTPS or localhost.)',
    loadPhononFirst: 'Load the natural voice first',
    loadKokoroFirst: 'Load the Kokoro voice first',
    kokoroDownload: 'Download Kokoro voice',
    kokoroStatus: 'One-time download (~137 MB), then offline forever.',
    phononDownload: 'Download natural voice',
    phononStatus: 'One-time download (~35 MB), then offline forever.',
    downloading: 'Downloading…', tryAgain: 'Try again',
    phononOnlyEn: 'Phonon speaks English only.',
    whyMind: 'Mindfulness → stress & focus',
    whyMindP: 'Meta-analyses link regular mindfulness practice to lower perceived stress and better sustained attention.',
    whyBreath: 'Slow breathing → calm physiology',
    whyBreathP: 'Extended exhales stimulate the vagus nerve and shift the nervous system toward rest — measurable within minutes.',
    whyNote: 'Sessions are short on purpose: a few minutes a day, done regularly, beats one long session a week.',
  },
  hi: {
    subtitle: 'ऑफ़लाइन निर्देशित ध्यान',
    meditate: '🧘 ध्यान करें', progress: '📊 प्रगति', why: '❓ यह कैसे काम करता है',
    voiceSettings: '⚙︎ आवाज़ सेटिंग्स', stop: '⏹ रुकें', rate: 'गति',
    minLabel: 'ध्यान मिनट', streakLabel: 'दिन की लड़ी', sessLabel: 'सत्र पूरे',
    last7: 'पिछले 7 दिन', today: 'आज', minUnit: ' मिनट',
    listening: 'सुनिए…', quiet: 'शांत',
    breathingRound: (i, n) => `साँस · चक्र ${i} / ${n}`,
    complete: '✓ पूरा हुआ — ', minutes: ' मिनट। बहुत अच्छा।',
    breatheIn: 'साँस अंदर', hold: 'रुकें', breatheOut: 'साँस बाहर', ready: 'तैयार',
    preparingPhonon: 'नेचुरल आवाज़ तैयार हो रही है…',
    preparingKokoro: 'Kokoro आवाज़ तैयार हो रही है…',
    phononReady: (n) => `नेचुरल आवाज़ तैयार · ${n} आवाज़ें · अब से ऑफ़लाइन`,
    kokoroReady: 'Kokoro आवाज़ तैयार · अब से ऑफ़लाइन',
    phononUnavailable: 'नेचुरल आवाज़ उपलब्ध नहीं — डिवाइस आवाज़ इस्तेमाल हो रही है।',
    kokoroUnavailable: 'Kokoro आवाज़ उपलब्ध नहीं — डिवाइस आवाज़ इस्तेमाल हो रही है।',
    downloadFailed: 'डाउनलोड नहीं हुआ — कनेक्शन जाँचें और फिर कोशिश करें। (HTTPS या localhost चाहिए।)',
    loadPhononFirst: 'पहले नेचुरल आवाज़ लोड करें',
    loadKokoroFirst: 'पहले Kokoro आवाज़ लोड करें',
    kokoroDownload: 'Kokoro आवाज़ डाउनलोड करें',
    kokoroStatus: 'एक बार डाउनलोड (~137 MB), फिर हमेशा ऑफ़लाइन।',
    phononDownload: 'नेचुरल आवाज़ डाउनलोड करें',
    phononStatus: 'एक बार डाउनलोड (~35 MB), फिर हमेशा ऑफ़लाइन।',
    downloading: 'डाउनलोड हो रहा है…', tryAgain: 'फिर कोशिश करें',
    phononOnlyEn: 'Phonon सिर्फ अंग्रेज़ी बोलता है।',
    whyMind: 'माइंडफुलनेस → तनाव और फोकस में राहत',
    whyMindP: 'अध्ययनों से पता चलता है कि नियमित माइंडफुलनेस से तनाव कम होता है और ध्यान बेहतर होता है।',
    whyBreath: 'धीमी साँस → शरीर शांत होता है',
    whyBreathP: 'लंबी साँस छोड़ने से वेगस नर्व सक्रिय होती है और शरीर आराम की ओर बढ़ता है — कुछ ही मिनटों में असर दिखता है।',
    whyNote: 'सत्र जानबूझकर छोटे रखे गए हैं: रोज़ कुछ मिनट, नियमित रूप से, हफ़्ते में एक लंबा सत्र करने से बेहतर है।',
  },
};
const t = (k, ...a) => { const v = (STR[lang] && STR[lang][k]) ?? STR.en[k]; return typeof v === 'function' ? v(...a) : v; };
function L(sess) { // localized session view (name, sub, steps in the current language)
  if (lang === 'hi' && sess.hi) return { ...sess, name: sess.hi.name, sub: sess.hi.sub, steps: sess.hi.steps };
  return sess;
}
function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const v = STR[lang][el.dataset.i18n];
    if (typeof v === 'string') el.textContent = v;
  });
  $('breathLabel').textContent = t('ready');
  document.querySelectorAll('#langSeg button').forEach((b) => b.classList.toggle('on', b.dataset.lang === lang));
  setEngine(engine, true);
  renderSessions();
}
document.querySelectorAll('#langSeg button').forEach((b) => {
  b.addEventListener('click', (e) => {
    e.preventDefault();
    const next = b.dataset.lang;
    if (next !== 'en' && next !== 'hi') return;
    if (next === lang) return;
    stopMeditation();
    lang = next;
    localStorage.setItem('meditation.lang', lang);
    applyLang(); // switches UI + session list synchronously, before any session can start
  });
});

/* ================= TTS ================= */
let voices = [], voiceIdx = 0, ttsRate = 0.95;
// 'kokoro' = Kokoro-82M, the default voice for both languages · 'phonon' = Phonon 31M, English-only alternate · 'device' = built-in TTS, last resort only
let engine = localStorage.getItem('meditation.engine') || 'kokoro';
if (!['kokoro', 'phonon', 'device'].includes(engine)) engine = 'kokoro';
let tts = null, phononVoice = null;
let kokoro = null, kokoroLoading = null;
let kokoroVoice = localStorage.getItem('meditation.kokoroVoice') || '';
const KOKORO_VOICES = {
  en: ['af_heart', 'af_bella', 'af_nicole', 'am_adam', 'am_michael'],
  hi: ['hf_alpha', 'hf_beta', 'hm_omega', 'hm_psi'],
};
const kokoroDefaultVoice = () => (lang === 'hi' ? 'hf_alpha' : 'af_heart');
function kokoroVoiceFor() {
  const list = KOKORO_VOICES[lang];
  return list.includes(kokoroVoice) ? kokoroVoice : kokoroDefaultVoice();
}
let phononAudio = null, phononGain = null;
let activeSources = [];
let lastEnd = 0;

function effectiveEngine() { return lang === 'hi' ? 'kokoro' : engine; } // Phonon is English-only

function loadVoices() {
  const prefix = lang === 'hi' ? 'hi' : 'en';
  voices = speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith(prefix));
  if (effectiveEngine() !== 'device') return;
  const pick = $('voicePick'); pick.innerHTML = '';
  voices.forEach((v, i) => {
    const o = document.createElement('option');
    o.value = i; o.textContent = v.name + ' (' + v.lang + ')'; pick.appendChild(o);
  });
  if (voiceIdx >= voices.length) voiceIdx = 0;
  const d = voices.findIndex((v) => v.default); if (d >= 0) { pick.value = d; voiceIdx = d; }
  pick.disabled = false;
}
if ('speechSynthesis' in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
$('rateIn').oninput = (e) => { ttsRate = parseFloat(e.target.value) || 0.95; };

function populateVoicePick() {
  const pick = $('voicePick'); pick.innerHTML = '';
  const eff = effectiveEngine();
  if (eff === 'kokoro') {
    if (!kokoro) { pick.innerHTML = '<option>' + t('loadKokoroFirst') + '</option>'; pick.disabled = true; }
    else {
      KOKORO_VOICES[lang].forEach((v) => {
        const o = document.createElement('option');
        o.value = v; o.textContent = v + (v === kokoroDefaultVoice() ? ' ★' : ''); pick.appendChild(o);
      });
      pick.value = kokoroVoiceFor(); pick.disabled = false;
    }
  } else if (eff === 'phonon') {
    if (tts) {
      tts.voices.forEach((v) => { const o = document.createElement('option'); o.value = v; o.textContent = v; pick.appendChild(o); });
      pick.value = phononVoice; pick.disabled = false;
    } else { pick.innerHTML = '<option>' + t('loadPhononFirst') + '</option>'; pick.disabled = true; }
  } else {
    loadVoices();
  }
  pick.onchange = () => {
    const e2 = effectiveEngine();
    if (e2 === 'kokoro') { kokoroVoice = pick.value; localStorage.setItem('meditation.kokoroVoice', kokoroVoice); }
    else if (e2 === 'phonon') phononVoice = pick.value;
    else voiceIdx = +pick.value;
  };
}

/* engine switch */
function setEngine(e, silent) {
  engine = e; localStorage.setItem('meditation.engine', engine);
  const eff = effectiveEngine();
  document.querySelectorAll('#engineSeg button').forEach((x) => x.classList.toggle('on', x.dataset.eng === eff));
  const phBtn = document.querySelector('#engineSeg button[data-eng="phonon"]');
  if (phBtn) { phBtn.disabled = lang === 'hi'; phBtn.title = lang === 'hi' ? t('phononOnlyEn') : ''; }
  $('kokoroRow').style.display = eff === 'kokoro' ? '' : 'none';
  $('phononRow').style.display = eff === 'phonon' ? '' : 'none';
  populateVoicePick();
  if (!silent) { /* voice pick refreshes via populateVoicePick */ }
}
document.querySelectorAll('#engineSeg button').forEach((b) => { b.onclick = () => setEngine(b.dataset.eng); });

function ensureAudio() {
  try {
    if (!phononAudio) {
      phononAudio = new (window.AudioContext || window.webkitAudioContext)();
      phononGain = phononAudio.createGain(); phononGain.gain.value = 1;
      phononGain.connect(phononAudio.destination);
    }
    if (phononAudio.state === 'suspended') phononAudio.resume();
  } catch (e) {}
}

// Patched Hindi-capable Kokoro bundle, vendored same-origin (stock kokoro-js
// cannot speak Hindi: its Hindi voices are commented out and its phonemizer is
// English-only). Loaded lazily as a separate module — NOT bundled by Vite — so
// its importmap ('espeak-ng') and its import.meta.url-relative worker file
// (vendor/kokoro/ort.bundle.min.mjs) resolve correctly.
let kokoroModule = null;
async function getKokoroModule() {
  if (kokoroModule) return kokoroModule;
  const url = new URL('vendor/kokoro/kokoro-hindi.web.js', document.baseURI).href;
  kokoroModule = await import(url);
  return kokoroModule;
}

async function loadKokoro() {
  if (kokoro) return kokoro;
  if (kokoroLoading) return kokoroLoading;
  ensureAudio(); // user gesture: unlock audio now
  const btn = $('kokoroBtn'), st = $('kokoroStatus');
  const say = (x) => { st.textContent = x; if (!$('player').hidden) $('plStep').textContent = x; };
  if (btn) { btn.disabled = true; btn.textContent = t('downloading'); }
  say(t('preparingKokoro'));
  kokoroLoading = (async () => {
    try {
      // Model + voices vendored under models/ — no Hugging Face fetch at runtime.
      const { KokoroTTS, env, setVoiceDataUrl } = await getKokoroModule();
      env.allowLocalModels = true;    // browser default is false
      env.allowRemoteModels = false;  // a missing local file throws instead of fetching from HF
      env.wasmPaths = './vendor/ort/'; // ORT wasm + jsep .mjs live here (trailing slash)
      setVoiceDataUrl('./models/Kokoro-82M-v1.0-ONNX/voices'); // no trailing slash
      kokoro = await KokoroTTS.from_pretrained('./models/Kokoro-82M-v1.0-ONNX', {
        dtype: 'q8', device: 'wasm',
        progress_callback: (p) => {
          if (p.status === 'progress' || p.status === 'downloading') {
            const pct = p.total ? Math.round((p.loaded / p.total) * 100) : null;
            say(pct != null ? `${t('preparingKokoro')} ${pct}%` : `${t('preparingKokoro')} ${Math.round((p.loaded || 0) / 1048576)} MB`);
          } else if (p.status === 'done') say(t('kokoroReady'));
        },
      });
      if (btn) btn.textContent = 'Kokoro voice ready ✓';
      say(t('kokoroReady'));
      populateVoicePick();
      return kokoro;
    } catch (e) {
      console.error('Kokoro load failed', e);
      kokoroLoading = null;
      if (btn) { btn.disabled = false; btn.textContent = t('tryAgain'); }
      say(t('downloadFailed'));
      return null;
    }
  })();
  return kokoroLoading;
}
$('kokoroBtn').onclick = loadKokoro;

async function loadPhonon() {
  if (tts) return;
  ensureAudio(); // user gesture: unlock audio now
  const btn = $('phononBtn'), st = $('phononStatus');
  const say = (x) => { st.textContent = x; if (!$('player').hidden) $('plStep').textContent = x; };
  btn.disabled = true; btn.textContent = t('downloading');
  say(t('preparingPhonon'));
  try {
    tts = await PhononTTS.load({ lang: 'en', device: 'auto', quant: 'q8',
      onProgress: ({ loaded, total, cached }) => {
        say(cached ? 'Reading the local voice cache…'
          : total ? `${t('preparingPhonon')} ${Math.round((loaded / total) * 100)}%`
          : `${t('preparingPhonon')} ${Math.round(loaded / 1048576)} MB`);
      } });
    phononVoice = tts.voices[0];
    populateVoicePick();
    btn.textContent = 'Natural voice ready ✓';
    say(t('phononReady', tts.voices.length));
  } catch (e) {
    console.error(e);
    btn.disabled = false; btn.textContent = t('tryAgain');
    say(t('downloadFailed'));
  }
}
$('phononBtn').onclick = loadPhonon;
$('voiceSettingsBtn').onclick = () => { $('voiceCard').hidden = !$('voiceCard').hidden; };

function speakDevice(text) {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) return resolve();
    const u = new SpeechSynthesisUtterance(text);
    const v = voices[voiceIdx]; if (v) u.voice = v;
    u.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    u.rate = ttsRate;
    let done = false;
    const fin = () => { if (!done) { done = true; resolve(); } };
    u.onend = fin; u.onerror = fin;
    setTimeout(fin, Math.max(3000, (text.length * 95) / ttsRate + 2500)); // fallback if onend never fires
    try { speechSynthesis.speak(u); } catch (e) { fin(); }
  });
}

function splitSentences(text) {
  return text.match(/[^.!?]+[.!?]+["']?|\S[^.!?]*$/g)?.map((s) => s.trim()).filter(Boolean) || [text];
}

async function speakPhononPart(part, run) {
  ensureAudio();
  const stream = tts.stream(part, { voice: phononVoice, signal: run.abort.signal });
  let cursor = Math.max(phononAudio.currentTime, lastEnd);
  for await (const pcm of stream) {
    if (run.cancelled) break;
    const buf = phononAudio.createBuffer(1, pcm.length, tts.sampleRate);
    buf.getChannelData(0).set(pcm);
    const src = phononAudio.createBufferSource();
    src.buffer = buf; src.playbackRate.value = ttsRate; src.connect(phononGain);
    activeSources.push(src);
    src.onended = () => { const i = activeSources.indexOf(src); if (i >= 0) activeSources.splice(i, 1); };
    cursor = Math.max(cursor, phononAudio.currentTime);
    src.start(cursor); cursor += buf.duration / ttsRate;
  }
  await stream.done.catch(() => {});
  lastEnd = cursor;
  const waitMs = Math.max(0, (cursor - phononAudio.currentTime) * 1000);
  await csleep(waitMs + 250, run);
}

async function speakKokoroPart(part, run) {
  ensureAudio();
  const k = await loadKokoro();
  if (!k || run.cancelled) return speakDevice(part);
  try {
    const audio = await k.generate(part, { voice: kokoroVoiceFor() });
    if (run.cancelled) return;
    const buf = phononAudio.createBuffer(1, audio.audio.length, audio.sampling_rate);
    buf.getChannelData(0).set(audio.audio);
    const src = phononAudio.createBufferSource();
    src.buffer = buf; src.playbackRate.value = ttsRate; src.connect(phononGain);
    activeSources.push(src);
    const ended = new Promise((res) => { src.onended = () => res(); });
    const startAt = Math.max(phononAudio.currentTime, lastEnd);
    src.start(startAt);
    lastEnd = startAt + buf.duration / ttsRate;
    await Promise.race([ended, csleep((buf.duration / ttsRate) * 1000 + 500, run)]);
    if (run.cancelled) { try { src.stop(); } catch (e) {} }
  } catch (e) {
    if (!run.cancelled) { console.error('Kokoro speak failed, falling back to device voice', e); return speakDevice(part); }
  }
}

async function speak(text, run) {
  const eff = effectiveEngine();
  for (const part of splitSentences(text)) {
    if (run.cancelled) break;
    try {
      if (eff === 'kokoro') await speakKokoroPart(part, run);
      else if (eff === 'phonon' && tts) await speakPhononPart(part, run);
      else await speakDevice(part);
    } catch (e) { if (!run.cancelled) console.error('speak failed', e); }
  }
}

function stopTTS() {
  try { speechSynthesis.cancel(); } catch (e) {}
  activeSources.splice(0).forEach((s) => { try { s.stop(); } catch (e) {} });
}

/* soft phase-change tone (WebAudio, offline) */
let actx = null;
function tone(freq) {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.12, actx.currentTime + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + 0.6);
    o.connect(g); g.connect(actx.destination);
    o.start(); o.stop(actx.currentTime + 0.7);
  } catch (e) {}
}

/* ================= progress store ================= */
const SKEY = 'mindgym.v1';
const store = {
  d: (() => { try { return JSON.parse(localStorage.getItem(SKEY)) || {}; } catch (e) { return {}; } })(),
  save() { try { localStorage.setItem(SKEY, JSON.stringify(this.d)); } catch (e) {} },
  day() { return new Date().toISOString().slice(0, 10); },
  dayRec() { const k = this.day(); this.d.days = this.d.days || {}; this.d.days[k] = this.d.days[k] || { med: 0, sessions: 0 }; return this.d.days[k]; },
  addMed(min) { this.dayRec().med += min; this.save(); refreshHeader(); },
  addSession() { this.dayRec().sessions += 1; this.save(); refreshHeader(); },
  streak() {
    const days = this.d.days || {}; let s = 0; const d = new Date();
    if (!days[d.toISOString().slice(0, 10)]) d.setDate(d.getDate() - 1); // streak alive if yesterday active
    while (days[d.toISOString().slice(0, 10)]) { s++; d.setDate(d.getDate() - 1); }
    return s;
  },
};
function refreshHeader() { const s = store.streak(); $('streakN').textContent = s; }
refreshHeader();

/* ================= tabs ================= */
document.querySelectorAll('#tabs button').forEach((b) => {
  b.onclick = () => {
    stopMeditation();
    document.querySelectorAll('#tabs button').forEach((x) => x.classList.remove('on'));
    document.querySelectorAll('.tab').forEach((x) => x.classList.remove('on'));
    b.classList.add('on');
    $('tab-' + b.dataset.tab).classList.add('on');
    if (b.dataset.tab === 'progress') renderProgress();
  };
});

/* ================= meditation sessions ================= */
/* Each session: English fields + hi: { name, sub, steps } (same breathing configs). */
const SESSIONS = [
  {
    id: 'focus', name: 'Focus Reset', sub: 'Sharpen attention before work', min: 5,
    steps: [
      { say: 'Sit comfortably with your back straight but not stiff. Rest your hands on your legs. Gently close your eyes.', pause: 8 },
      { say: 'Take a deep breath in through your nose, filling your belly.', pause: 2 },
      { say: 'And a long, slow breath out through your mouth, letting your shoulders drop.', pause: 6 },
      { breathe: { in: 4, hold: 2, out: 6, cycles: 4 } },
      { say: 'Now let your breathing return to its natural rhythm. Simply notice each breath as it comes and goes. When your mind wanders, and it will, gently bring your attention back to the breath, without judging yourself.', pause: 45 },
      { say: 'Notice the quiet pause between breaths. Rest in that stillness.', pause: 30 },
      { say: 'Begin to return. Wiggle your fingers and toes. When you are ready, open your eyes, carrying this steadiness into your next task.' },
    ],
    hi: { name: 'फोकस रीसेट', sub: 'काम से पहले ध्यान तेज़ करें', steps: [
      { say: 'आराम से बैठिए, पीठ सीधी रखें पर अकड़ी हुई नहीं। हाथ गोद में रखिए। धीरे से आँखें बंद करिए।', pause: 8 },
      { say: 'नाक से गहरी साँस अंदर लीजिए, पेट भर जाए।', pause: 2 },
      { say: 'और मुँह से लंबी, धीमी साँस बाहर छोड़िए, कंधे ढीले पड़ने दीजिए।', pause: 6 },
      { breathe: { in: 4, hold: 2, out: 6, cycles: 4 } },
      { say: 'अब साँस को अपनी सहज लय में लौटने दीजिए। हर साँस को बस महसूस करिए, जैसे वह आती है और जाती है। जब मन भटके — और भटकेगा — तो बिना खुद को कोसे, ध्यान धीरे से साँस पर वापस ले आइए।', pause: 45 },
      { say: 'साँसों के बीच की शांत खामोशी को महसूस करिए। उसी स्थिरता में विश्राम करिए।', pause: 30 },
      { say: 'धीरे-धीरे वापस लौटिए। उँगलियाँ और पैरों की उँगलियाँ हिलाइए। जब तैयार हों, आँखें खोलिए, और यह स्थिरता अपने अगले काम में साथ ले जाइए।' },
    ] },
  },
  {
    id: 'calm', name: 'Deep Calm', sub: 'Full-body unwind', min: 10,
    steps: [
      { say: 'Lie down or settle back in your chair. Let your whole body be supported. Close your eyes.', pause: 8 },
      { say: 'Take three slow breaths. In through the nose.', pause: 3, say2: 'Out through the mouth, releasing tension.' , pause2: 6 },
      { breathe: { in: 4, hold: 4, out: 6, cycles: 3 } },
      { say: 'Bring your attention to your feet. Notice any tightness there, and let it soften with your next exhale.', pause: 20 },
      { say: 'Move up to your legs, your hips, your belly. With each exhale, let these areas grow heavy and still.', pause: 25 },
      { say: 'Now your chest, your shoulders, your hands. Unclench your jaw. Soften the space between your eyebrows.', pause: 25 },
      { say: 'Feel your whole body resting. Nothing to do, nowhere to be. Just breathe.', pause: 60 },
      { say: 'Take one more deep breath in.', pause: 3 },
      { say: 'And release. Slowly bring movement back to your body. Open your eyes when you are ready.' },
    ],
    hi: { name: 'गहरी शांति', sub: 'पूरे शरीर को आराम दें', steps: [
      { say: 'लेट जाइए या कुर्सी में पीछे टिककर बैठिए। पूरे शरीर को सहारा मिलने दीजिए। आँखें बंद करिए।', pause: 8 },
      { say: 'तीन धीमी साँसें लीजिए। नाक से अंदर।', pause: 3, say2: 'मुँह से बाहर, तनाव छोड़ते हुए।', pause2: 6 },
      { breathe: { in: 4, hold: 4, out: 6, cycles: 3 } },
      { say: 'ध्यान पैरों पर ले जाइए। वहाँ कोई कसाव हो तो अगली साँस छोड़ते हुए उसे नरम पड़ने दीजिए।', pause: 20 },
      { say: 'ऊपर आइए — टाँगें, कूल्हे, पेट। हर साँस छोड़ते हुए इन हिस्सों को भारी और शांत होने दीजिए।', pause: 25 },
      { say: 'अब छाती, कंधे, हाथ। जबड़ा ढीला छोड़िए। भौहों के बीच की जगह को नरम करिए।', pause: 25 },
      { say: 'पूरे शरीर को आराम महसूस करिए। कुछ करना नहीं, कहीं जाना नहीं। बस साँस लीजिए।', pause: 60 },
      { say: 'एक और गहरी साँस अंदर लीजिए।', pause: 3 },
      { say: 'और छोड़िए। धीरे-धीरे शरीर में हलचल वापस लाइए। जब तैयार हों, आँखें खोलिए।' },
    ] },
  },
  {
    id: 'sleep', name: 'Sleep Wind-Down', sub: 'Drift off gently', min: 8,
    steps: [
      { say: 'Lie comfortably in bed, on your back if you can. Close your eyes.', pause: 8 },
      { breathe: { in: 4, hold: 7, out: 8, cycles: 4 } },
      { say: 'With each exhale, feel yourself sinking a little deeper into the mattress.', pause: 20 },
      { say: 'Tense your toes for five seconds, then release. Notice the wave of relaxation.', pause: 15 },
      { say: 'Now tense your whole legs, hold, and release.', pause: 15 },
      { say: 'Scrunch your shoulders up to your ears, hold, and let them drop.', pause: 15 },
      { say: 'Your body is done for today. Let your thoughts drift past like clouds. There is nothing left to solve tonight.', pause: 60 },
      { say: 'Breathe slowly. Sleep is coming. Good night.', pause: 20 },
    ],
    hi: { name: 'नींद की तैयारी', sub: 'धीरे-धीरे नींद की ओर', steps: [
      { say: 'बिस्तर में आराम से लेटिए, हो सके तो पीठ के बल। आँखें बंद करिए।', pause: 8 },
      { breathe: { in: 4, hold: 7, out: 8, cycles: 4 } },
      { say: 'हर साँस छोड़ते हुए महसूस करिए कि आप गद्दे में थोड़ा और धँसते जा रहे हैं।', pause: 20 },
      { say: 'पैरों की उँगलियाँ पाँच सेकंड के लिए सिकोड़िए, फिर छोड़िए। आराम की लहर महसूस करिए।', pause: 15 },
      { say: 'अब पूरी टाँगें कसिए, रोकिए, और छोड़िए।', pause: 15 },
      { say: 'कंधे कानों तक उठाइए, रोकिए, और गिरने दीजिए।', pause: 15 },
      { say: 'आज के लिए शरीर का काम पूरा हुआ। विचारों को बादलों की तरह बहने दीजिए। रात को सुलझाने के लिए कुछ नहीं बचा।', pause: 60 },
      { say: 'धीरे-धीरे साँस लीजिए। नींद आ रही है। शुभ रात्रि।', pause: 20 },
    ] },
  },
  {
    id: 'stress', name: 'Stress Reset', sub: 'Box breathing to downshift', min: 5,
    steps: [
      { say: 'Whatever just happened can wait five minutes. Sit back, unclench your jaw, drop your shoulders.', pause: 6 },
      { say: 'We will breathe in a box: four counts in, four hold, four out, four hold. Follow the circle.', pause: 4 },
      { breathe: { in: 4, hold: 4, out: 4, cycles: 6, holdAfter: 4 } },
      { say: 'Notice your heart rate slowing. That is your nervous system downshifting. You are safe.', pause: 15 },
      { breathe: { in: 4, hold: 4, out: 6, cycles: 3 } },
      { say: 'Carry this slower rhythm with you. Open your eyes when ready.' },
    ],
    hi: { name: 'तनाव से राहत', sub: 'बॉक्स ब्रीदिंग से शांत हों', steps: [
      { say: 'जो कुछ हुआ, वह पाँच मिनट रुक सकता है। पीछे टिककर बैठिए, जबड़ा ढीला छोड़िए, कंधे गिराइए।', pause: 6 },
      { say: 'हम बॉक्स में साँस लेंगे: चार गिनती अंदर, चार रुकें, चार बाहर, चार रुकें। गोले का अनुसरण करिए।', pause: 4 },
      { breathe: { in: 4, hold: 4, out: 4, cycles: 6, holdAfter: 4 } },
      { say: 'दिल की धड़कन धीमी होती महसूस करिए। आपका तंत्रिका तंत्र शांत हो रहा है। आप सुरक्षित हैं।', pause: 15 },
      { breathe: { in: 4, hold: 4, out: 6, cycles: 3 } },
      { say: 'यह धीमी लय अपने साथ ले जाइए। तैयार हों तो आँखें खोलिए।' },
    ] },
  },
  {
    id: 'morning', name: 'Morning Energy', sub: 'Wake up gently, set one intention', min: 5,
    steps: [
      { say: 'Sit up tall and let your eyes stay soft. You do not need to rush this morning.', pause: 6 },
      { say: 'Take a slow breath in through your nose, and let it out with a quiet sigh.', pause: 4 },
      { breathe: { in: 4, hold: 2, out: 6, cycles: 3 } },
      { say: 'Feel the morning in your body — the cool air, the weight of the blanket, the first light. You are here, and the day has not started yet.', pause: 20 },
      { say: 'Choose one thing that matters today. Just one. Say it quietly to yourself.', pause: 15 },
      { say: 'Take one more full breath in, and let it out slowly. Carry that intention with you. Open your eyes when you are ready.' },
    ],
    hi: { name: 'सुबह की ऊर्जा', sub: 'धीरे से जागिए, एक इरादा तय करिए', steps: [
      { say: 'सीधे बैठिए और आँखें नरम रखिए। आज सुबह जल्दी करने की कोई ज़रूरत नहीं।', pause: 6 },
      { say: 'नाक से धीरे साँस अंदर लीजिए, और हल्की आह के साथ बाहर छोड़िए।', pause: 4 },
      { breathe: { in: 4, hold: 2, out: 6, cycles: 3 } },
      { say: 'सुबह को अपने शरीर में महसूस करिए — ठंडी हवा, कंबल का वज़न, पहली रोशनी। आप यहीं हैं, और दिन अभी शुरू नहीं हुआ।', pause: 20 },
      { say: 'आज की एक ज़रूरी चीज़ चुनिए। सिर्फ एक। उसे मन ही मन दोहराइए।', pause: 15 },
      { say: 'एक और पूरी साँस अंदर लीजिए, और धीरे से बाहर छोड़िए। उस इरादे को साथ ले जाइए। तैयार हों तो आँखें खोलिए।' },
    ] },
  },
  {
    id: 'bodyscan', name: 'Body Scan', sub: 'Slow attention from head to toe', min: 10,
    steps: [
      { say: 'Lie down comfortably and close your eyes. Let your body be fully supported by the surface beneath you.', pause: 8 },
      { say: 'Take three slow breaths, letting your belly rise and fall.', pause: 12 },
      { say: 'Bring your attention to the top of your head. Notice any tension in your forehead and scalp, and let it soften.', pause: 20 },
      { say: 'Move down to your face — your eyes, your cheeks, your jaw. Unclench. Let your tongue rest.', pause: 25 },
      { say: 'Down through your neck and shoulders. These carry so much. Let them drop and grow heavy.', pause: 25 },
      { say: 'Your chest and belly. Feel them rise and fall with each breath. Nothing to change — just notice.', pause: 25 },
      { say: 'Now your knees. Notice them without judging — warmth, ache, or nothing at all. Send your breath there.', pause: 25 },
      { say: 'Down to your feet and toes. Feel the whole body at once, from head to toe, resting and whole.', pause: 30 },
      { say: 'Take one slow breath in, and let it out. When you are ready, wiggle your fingers and toes and open your eyes.' },
    ],
    hi: { name: 'बॉडी स्कैन', sub: 'सिर से पैर तक धीरे-धीरे ध्यान', steps: [
      { say: 'आराम से लेटिए और आँखें बंद करिए। शरीर को नीचे की सतह का पूरा सहारा मिलने दीजिए।', pause: 8 },
      { say: 'तीन धीमी साँसें लीजिए, पेट को उठते-गिरते महसूस करिए।', pause: 12 },
      { say: 'ध्यान सिर के ऊपर ले जाइए। माथे और खोपड़ी में कोई कसाव हो तो उसे नरम पड़ने दीजिए।', pause: 20 },
      { say: 'नीचे आइए — आँखें, गाल, जबड़ा। जबड़ा ढीला छोड़िए। जीभ को आराम करने दीजिए।', pause: 25 },
      { say: 'गर्दन और कंधों से नीचे। ये बहुत बोझ उठाते हैं। इन्हें गिरने और भारी होने दीजिए।', pause: 25 },
      { say: 'छाती और पेट। हर साँस के साथ इन्हें उठते-गिरते महसूस करिए। कुछ बदलना नहीं — बस देखिए।', pause: 25 },
      { say: 'अब घुटने। बिना किसी फैसले के उन्हें महसूस करिए — गर्मी, दर्द, या कुछ नहीं। साँस वहीं भेजिए।', pause: 25 },
      { say: 'पैरों और उँगलियों तक। पूरे शरीर को एक साथ महसूस करिए, सिर से पैर तक, आराम में और पूरा।', pause: 30 },
      { say: 'एक धीमी साँस अंदर लीजिए, और बाहर छोड़िए। तैयार हों तो उँगलियाँ और पैरों की उँगलियाँ हिलाइए और आँखें खोलिए।' },
    ] },
  },
  {
    id: 'gratitude', name: 'Gratitude', sub: 'Notice three good things', min: 5,
    steps: [
      { say: 'Sit comfortably and close your eyes. Let your shoulders drop and your breathing slow down.', pause: 8 },
      { say: 'Think of one thing today that went right — however small. Hold it in your mind.', pause: 20 },
      { say: 'Now think of one person who made your day a little easier. Picture their face.', pause: 20 },
      { say: 'And one thing your body did for you today — your legs carried you, your eyes let you see, your hands held something warm.', pause: 20 },
      { say: 'Let the warmth of these three things spread through your chest. Breathe it in.', pause: 15 },
      { say: 'Take one slow breath. Open your eyes, and carry this warmth into the rest of your day.' },
    ],
    hi: { name: 'आभार', sub: 'तीन अच्छी बातों को महसूस करिए', steps: [
      { say: 'आराम से बैठिए और आँखें बंद करिए। कंधे गिराइए और साँस धीमी करिए।', pause: 8 },
      { say: 'आज की एक बात सोचिए जो सही हुई — चाहे कितनी भी छोटी हो। उसे मन में रखिए।', pause: 20 },
      { say: 'अब एक व्यक्ति के बारे में सोचिए जिसने आज आपका दिन थोड़ा आसान बनाया। उनका चेहरा याद करिए।', pause: 20 },
      { say: 'और एक चीज़ जो आपके शरीर ने आज आपके लिए की — टाँगों ने आपको चलाया, आँखों ने देखने दिया, हाथों ने कुछ गर्म पकड़ा।', pause: 20 },
      { say: 'इन तीनों की गर्माहट को छाती में फैलने दीजिए। उसे साँस में भरिए।', pause: 15 },
      { say: 'एक धीमी साँस लीजिए। आँखें खोलिए, और यह गर्माहट बाकी दिन साथ ले जाइए।' },
    ] },
  },
  {
    id: 'anxiety', name: 'Anxiety Relief', sub: 'Slow exhales + grounding', min: 6,
    steps: [
      { say: 'Whatever is worrying you can wait. Sit back, plant both feet on the floor, and feel the ground holding you.', pause: 8 },
      { say: 'Breathe in for four counts.', pause: 2, say2: 'And out for six — long and slow.', pause2: 4 },
      { breathe: { in: 4, out: 6, cycles: 4 } },
      { say: 'Now name five things you can see around you. Silently, one by one.', pause: 25 },
      { say: 'Four things you can touch — the chair, your clothes, the floor beneath your feet.', pause: 20 },
      { say: 'Three things you can hear. Two things you can smell. One slow breath.', pause: 20 },
      { say: 'You are here, in this room, in this moment. The worry is a thought, not a fact. Breathe in slowly.', pause: 10 },
      { breathe: { in: 4, hold: 2, out: 8, cycles: 3 } },
      { say: 'Open your eyes when you are ready. Take the next step, just one, and let the rest wait.' },
    ],
    hi: { name: 'चिंता से राहत', sub: 'धीमी साँसें और ज़मीन से जुड़ाव', steps: [
      { say: 'जो बात परेशान कर रही है, वह रुक सकती है। पीछे टिककर बैठिए, दोनों पैर ज़मीन पर रखिए, और ज़मीन को सहारा देते महसूस करिए।', pause: 8 },
      { say: 'चार गिनती में साँस अंदर लीजिए।', pause: 2, say2: 'और छह गिनती में बाहर — लंबी और धीमी।', pause2: 4 },
      { breathe: { in: 4, out: 6, cycles: 4 } },
      { say: 'अब पाँच चीज़ों के नाम मन में लीजिए जो आप देख सकते हैं। एक-एक करके, चुपचाप।', pause: 25 },
      { say: 'चार चीज़ें जिन्हें छू सकते हैं — कुर्सी, कपड़े, पैरों के नीचे ज़मीन।', pause: 20 },
      { say: 'तीन चीज़ें जो सुन सकते हैं। दो जो सूँघ सकते हैं। एक धीमी साँस।', pause: 20 },
      { say: 'आप यहीं हैं, इस कमरे में, इस पल में। चिंता एक विचार है, सच नहीं। धीरे से साँस लीजिए।', pause: 10 },
      { breathe: { in: 4, hold: 2, out: 8, cycles: 3 } },
      { say: 'तैयार हों तो आँखें खोलिए। अगला कदम उठाइए, सिर्फ एक, और बाकी को रुकने दीजिए।' },
    ] },
  },
];

let medRun = null;
function csleep(ms, run) {
  return new Promise((res) => {
    const step = 250; let e = 0;
    const tick = () => { if (run.cancelled || e >= ms) return res(); e += step; setTimeout(tick, step); };
    tick();
  });
}
function renderSessions() {
  const icons = { focus: '🎯', calm: '🌊', sleep: '🌙', stress: '💨', morning: '🌅', bodyscan: '🧍', gratitude: '🙏', anxiety: '🌿' };
  $('sessList').innerHTML = SESSIONS.map((raw) => { const s = L(raw);
    return `<button class="sess" data-sess="${s.id}"><span class="tile g-${s.id}">${icons[s.id] || '🧘'}</span><span class="sess-tx"><b>${s.name}</b><span>${s.sub}</span></span><span class="chip">${s.min}${t('minUnit')}</span></button>`;
  }).join('');
  $('sessList').querySelectorAll('[data-sess]').forEach((b) => {
    b.onclick = () => startMeditation(SESSIONS.find((s) => s.id === b.dataset.sess));
  });
}
async function startMeditation(raw) {
  stopMeditation();
  const sess = L(raw);
  const run = { cancelled: false, t0: Date.now(), abort: new AbortController() }; medRun = run;
  lastEnd = 0;
  $('sessList').hidden = true; $('voiceCard').hidden = true; $('player').hidden = false;
  $('plTitle').textContent = sess.name;
  $('plStep').textContent = '';
  $('plBar').style.width = '0%';
  $('breathWrap').hidden = true;
  const eff = effectiveEngine();
  ensureAudio(); // user gesture: unlock audio
  if (eff === 'kokoro' && !kokoro) {
    $('plStep').textContent = t('preparingKokoro');
    await loadKokoro(); // one-time download; speak() falls back to device TTS if it fails
    if (run.cancelled) return;
    if (!kokoro) $('plStep').textContent = t('kokoroUnavailable');
  } else if (eff === 'phonon' && !tts) {
    $('plStep').textContent = t('preparingPhonon');
    await loadPhonon(); // one-time download; speak() falls back to device TTS if it fails
    if (run.cancelled) return;
    if (!tts) $('plStep').textContent = t('phononUnavailable');
  }
  runSession(sess, run);
}
function stopMeditation() {
  if (medRun) { medRun.cancelled = true; try { medRun.abort.abort(); } catch (e) {} }
  medRun = null; stopTTS();
  $('sessList').hidden = false; $('player').hidden = true;
  $('breathWrap').hidden = true;
}
$('plStop').onclick = stopMeditation;

async function phase(key, secs, scale, run) {
  $('breathWrap').hidden = false;
  $('breathLabel').textContent = key === 'in' ? t('breatheIn') : key === 'hold' ? t('hold') : t('breatheOut');
  const c = $('breathCircle');
  c.style.transitionDuration = secs + 's';
  c.style.transform = 'scale(' + scale + ')';
  tone(key === 'in' ? 520 : key === 'hold' ? 660 : 392);
  await csleep(secs * 1000, run);
}
async function breathing(cfg, run) {
  $('breathWrap').hidden = false;
  for (let i = 0; i < cfg.cycles && !run.cancelled; i++) {
    $('plStep').textContent = t('breathingRound', i + 1, cfg.cycles);
    await phase('in', cfg.in, 1.35, run); if (run.cancelled) break;
    if (cfg.hold) { await phase('hold', cfg.hold, 1.35, run); if (run.cancelled) break; }
    await phase('out', cfg.out, 1.0, run); if (run.cancelled) break;
    if (cfg.holdAfter) { await phase('hold', cfg.holdAfter, 1.0, run); }
  }
  $('breathWrap').hidden = true;
}
async function runSession(sess, run) {
  const total = sess.steps.length;
  for (let i = 0; i < total && !run.cancelled; i++) {
    const st = sess.steps[i];
    $('plBar').style.width = Math.round((i / total) * 100) + '%';
    if (st.say) { $('plStep').textContent = t('listening') + ' (' + (i + 1) + '/' + total + ')'; await speak(st.say, run); }
    if (run.cancelled) break;
    if (st.say2) { await speak(st.say2, run); }
    if (run.cancelled) break;
    if (st.pause) { $('plStep').textContent = t('quiet') + ' · ' + st.pause + 's (' + (i + 1) + '/' + total + ')'; await csleep(st.pause * 1000, run); }
    if (st.pause2) { $('plStep').textContent = t('quiet') + ' · ' + st.pause2 + 's (' + (i + 1) + '/' + total + ')'; await csleep(st.pause2 * 1000, run); }
    if (st.breathe) await breathing(st.breathe, run);
  }
  if (!run.cancelled) {
    $('plBar').style.width = '100%';
    $('plStep').textContent = t('complete') + sess.min + t('minutes');
    tone(660); setTimeout(() => tone(880), 350);
    const mins = Math.max(1, Math.round((Date.now() - run.t0) / 60000));
    store.addMed(Math.min(mins, sess.min));
    store.addSession();
  }
  setTimeout(() => { if (medRun === run) stopMeditation(); }, 4000);
}
applyLang(); // sets language, engine, voice pick and renders the session list

/* ================= progress tab ================= */
function renderProgress() {
  const d = store.d, days = d.days || {};
  let min = 0, sessions = 0;
  Object.values(days).forEach((x) => { min += x.med || 0; sessions += x.sessions || 0; });
  $('stMin').textContent = min; $('stSess').textContent = sessions; $('stStreak').textContent = store.streak();
  const bars = $('weekBars'); bars.innerHTML = '';
  const names = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  let max = 1;
  const vals = [];
  for (let i = 6; i >= 0; i--) {
    const dt = new Date(); dt.setDate(dt.getDate() - i);
    const k = dt.toISOString().slice(0, 10);
    const v = days[k]?.med || 0;
    vals.push({ v, label: i === 0 ? t('today') : names[dt.getDay()] });
    max = Math.max(max, v);
  }
  vals.forEach(({ v, label }) => {
    const b = document.createElement('div');
    b.className = 'bar'; b.style.height = Math.max(4, Math.round((v / max) * 90)) + 'px';
    b.innerHTML = `<span>${label}</span>`; b.title = v + ' min';
    bars.appendChild(b);
  });
}
