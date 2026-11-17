/* Lingua – private Sprachlern-App (Vanilla JS, offline-fähig).
   Aufbau: Zustand (localStorage) · Sprachpakete (window.LINGUA_PACKS) · Ansichten (Hash-Routing) · Übungs-Engine */
(function () {
  'use strict';

  /* ---------- Konstanten & Hilfen ---------- */
  const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const SKILLS = ['vocab', 'grammar', 'reading', 'listening'];
  const STORE_KEY = 'lingua.state.v1';
  const APP_VERSION = '1.3.0';
  const MINUTES = { 5: { cards: 6, gaps: 4, quiz: 4, goal: 40, newMax: 5 }, 10: { cards: 10, gaps: 6, quiz: 6, goal: 70, newMax: 8 }, 15: { cards: 15, gaps: 8, quiz: 8, goal: 100, newMax: 12 } };

  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const lvlIdx = (l) => LEVELS.indexOf(l);
  const pad = (n) => String(n).padStart(2, '0');
  const dateStr = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const today = () => dateStr(new Date());
  const addDays = (ds, n) => { const d = new Date(ds + 'T12:00:00'); d.setDate(d.getDate() + n); return dateStr(d); };
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function weightedSample(items, weightFn, n) {
    const pool = items.map((it) => ({ it, w: Math.max(0, weightFn(it)) })).filter((x) => x.w > 0);
    const out = [];
    while (out.length < n && pool.length) {
      const total = pool.reduce((s, x) => s + x.w, 0);
      let r = Math.random() * total, i = 0;
      for (; i < pool.length - 1; i++) { r -= pool[i].w; if (r <= 0) break; }
      out.push(pool[i].it); pool.splice(i, 1);
    }
    return out;
  }

  /* ---------- Zustand ---------- */
  let memoryOnly = false;
  function defaultState() {
    return {
      v: 1, lang: 'fr',
      settings: { minutes: 10, explain: 'fr', rate: 0.95, theme: 'auto', audio: 'on', voiceName: '' },
      xp: 0, xpByDay: {}, streak: { count: 0, last: null, best: 0 }, badges: {},
      profiles: {}
    };
  }
  function defaultProfile() {
    return {
      levels: { vocab: 'B1', grammar: 'B1', reading: 'B1', listening: 'B1' }, tested: false,
      tests: [], srs: {}, seen: {}, errors: {}, newByDay: {},
      mission: { date: null, done: [false, false, false], rewarded: false },
      stats: { answered: 0, correct: 0 }
    };
  }
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) { const s = JSON.parse(raw); return Object.assign(defaultState(), s, { settings: Object.assign(defaultState().settings, s.settings || {}) }); }
    } catch (e) { memoryOnly = true; }
    return defaultState();
  }
  let state = load();
  function save() {
    if (memoryOnly) return;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { memoryOnly = true; }
  }
  function prof() {
    if (!state.profiles[state.lang]) state.profiles[state.lang] = defaultProfile();
    return state.profiles[state.lang];
  }

  /* ---------- Sprachpaket ---------- */
  const packs = window.LINGUA_PACKS || {};
  function pack() { return packs[state.lang] || packs.fr; }
  function U(k) { return (pack().ui && pack().ui[k]) || k; }
  const prepared = {};
  function P() {
    const code = pack().meta.code;
    if (prepared[code]) return prepared[code];
    const p = pack();
    const custom = (state.profiles[state.lang] && state.profiles[state.lang].customVocab) || [];
    const vocab = p.vocab.concat(custom).map((r) => ({ id: 'v:' + r[0], fr: r[0], de: r[1], l: r[2], th: r[3], ex: r[4] }));
    const gaps = p.gaps.map((g, i) => Object.assign({ id: 'g' + i }, g));
    const quiz = p.quiz.map((q, i) => Object.assign({ id: 'q' + i }, q));
    prepared[code] = { meta: p.meta, vocab, gaps, quiz, placement: p.placement, byId: {} };
    [...vocab, ...gaps, ...quiz].forEach((x) => (prepared[code].byId[x.id] = x));
    return prepared[code];
  }

  /* ---------- Sprachausgabe ---------- */
  let voice = null;
  const audioOn = () => state.settings.audio !== 'off';
  function langVoices() {
    if (!('speechSynthesis' in window)) return [];
    const code = P().meta.code;
    return (speechSynthesis.getVoices() || []).filter((v) => v.lang && v.lang.toLowerCase().startsWith(code));
  }
  function pickVoice() {
    const vs = langVoices(); voice = null;
    if (state.settings.voiceName) voice = vs.find((v) => v.name === state.settings.voiceName) || null;
    if (!voice) for (const p of P().meta.tts) { voice = vs.find((v) => v.lang.replace('_', '-').toLowerCase() === p.toLowerCase()); if (voice) break; }
    if (!voice) voice = vs[0] || null; // nie eine Stimme einer anderen Sprache verwenden
    if (location.hash === '#reglages' && !session && document.getElementById('voiceBox')) viewSettings();
  }
  if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function speak(text, slow, quiet) {
    if (!audioOn()) return;
    if (!('speechSynthesis' in window)) { if (!quiet) toast('Synthèse vocale non disponible dans ce navigateur.'); return; }
    if (!voice) { pickVoice(); if (!voice) { if (!quiet) toast('Aucune voix française installée – voir Réglages › Voix.'); return; } }
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = voice.lang; u.voice = voice;
      u.rate = state.settings.rate * (slow ? 0.72 : 1);
      speechSynthesis.speak(u);
    } catch (e) { toast('Lecture audio impossible.'); }
  }
  const speakText = {}; let speakSeq = 0;
  function audioBtns(text) {
    if (!audioOn()) return '';
    const id = 's' + (++speakSeq); speakText[id] = text;
    return `<div class="audio"><button class="btn small" data-act="speak" data-arg="${id}">🔊 ${U('listen')}</button><button class="btn small ghost" data-act="speakSlow" data-arg="${id}">🐢 ${U('slow')}</button></div>`;
  }
  function toggleAudio() {
    state.settings.audio = audioOn() ? 'off' : 'on'; save(); renderTop();
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    toast(audioOn() ? '🔊 Son activé' : '🔇 Mode sans son : exercices écrits uniquement');
    if (test && SKILLS[test.s] === 'listening') { testNext(); return; }
    if (session && session.kind === 'mc' && !session.answered) renderMC();
    else if (session && session.kind === 'cards') renderCard();
    else if (!session) route();
  }

  /* ---------- Gamification ---------- */
  const BADGES = [
    ['test', '🧭', 'Premier test'], ['mission', '🎯', 'Première mission'], ['streak3', '🔥', '3 jours'], ['streak7', '🌟', '7 jours'],
    ['streak30', '🏆', '30 jours'], ['words25', '🌱', '25 mots'], ['words100', '🌳', '100 mots'], ['perfect', '💯', 'Sans faute'],
    ['revanche', '🔁', 'Erreur corrigée'], ['xp500', '⭐', '500 XP'], ['xp2000', '🌠', '2000 XP'], ['missions10', '🗓️', '10 missions']
  ];
  function award(id) {
    if (state.badges[id]) return;
    state.badges[id] = today();
    const b = BADGES.find((x) => x[0] === id);
    if (b) setTimeout(() => toast(`${b[1]} Badge débloqué : ${b[2]}`), 400);
  }
  function goal() { return MINUTES[state.settings.minutes].goal; }
  function addXP(n) {
    if (n <= 0) return;
    const d = today();
    state.xp += n;
    state.xpByDay[d] = (state.xpByDay[d] || 0) + n;
    if (state.xpByDay[d] >= goal() && state.streak.last !== d) {
      state.streak.count = state.streak.last === addDays(d, -1) ? state.streak.count + 1 : 1;
      state.streak.last = d;
      state.streak.best = Math.max(state.streak.best || 0, state.streak.count);
      toast(`🔥 Objectif du jour atteint ! Série : ${state.streak.count}`);
      if (state.streak.count >= 3) award('streak3');
      if (state.streak.count >= 7) award('streak7');
      if (state.streak.count >= 30) award('streak30');
    }
    if (state.xp >= 500) award('xp500');
    if (state.xp >= 2000) award('xp2000');
    save(); renderTop();
  }
  function currentStreak() {
    const s = state.streak; if (!s.last) return 0;
    return s.last === today() || s.last === addDays(today(), -1) ? s.count : 0;
  }
  function playerLevel() {
    let lvl = 1, need = 100, rest = state.xp;
    while (rest >= need) { rest -= need; lvl++; need = 100 + (lvl - 1) * 50; }
    return { lvl, rest, need };
  }
  function renderTop() {
    $('#streakPill').textContent = '🔥 ' + currentStreak();
    $('#xpPill').textContent = '⭐ ' + state.xp;
    $('#audioPill').textContent = audioOn() ? '🔊' : '🔇';
    $('#brandName').textContent = 'Lingua · ' + P().meta.name;
  }

  /* ---------- Fehlerheft ---------- */
  function noteError(key) { if (/^ai:|:ai/.test(key)) return; const e = prof().errors; e[key] = e[key] || { n: 0, ok: 0 }; e[key].n++; e[key].ok = 0; e[key].last = today(); }
  function noteFixed(key) {
    const e = prof().errors[key]; if (!e) return;
    e.ok++; if (e.ok >= 2) { delete prof().errors[key]; award('revanche'); }
  }

  /* ---------- Vokabeln (Spaced Repetition) ---------- */
  function srsCard(id) { return prof().srs[id]; }
  function schedule(id, r) {
    const s = prof().srs; const c = s[id] || (s[id] = { iv: 0, ef: 2.5, reps: 0, lapses: 0, due: today() });
    if (r === 0) { c.lapses++; c.reps = 0; c.iv = 0; c.ef = Math.max(1.3, c.ef - 0.2); }
    else {
      if (c.reps === 0) c.iv = r === 3 ? 3 : 1;
      else if (c.reps === 1) c.iv = r === 1 ? 2 : r === 3 ? 6 : 4;
      else c.iv = Math.max(c.iv + 1, Math.round(c.iv * (r === 1 ? 1.2 : r === 3 ? c.ef * 1.3 : c.ef)));
      c.ef = clamp(c.ef + (r === 1 ? -0.15 : r === 3 ? 0.15 : 0), 1.3, 3);
      c.reps++;
    }
    c.due = addDays(today(), c.iv); c.last = today();
  }
  function dueCards() { const t = today(); return P().vocab.filter((w) => { const c = srsCard(w.id); return c && c.due <= t; }); }
  function wordsLearned() { return Object.values(prof().srs).filter((c) => c.reps >= 1 || c.iv >= 1).length; }
  function wordsMastered() { return Object.values(prof().srs).filter((c) => c.iv >= 21).length; }
  function newWords(n) {
    const L = lvlIdx(prof().levels.vocab);
    const fresh = P().vocab.filter((w) => !srsCard(w.id));
    return weightedSample(fresh, (w) => { const d = lvlIdx(w.l) - L; return d === 0 ? 6 : d === -1 ? 5 : d === -2 ? 2 : d === 1 ? 1.5 : 0.2; }, n);
  }

  /* ---------- Auswahl nach Niveau ---------- */
  function pickItems(items, skill, n, prefix) {
    const L = lvlIdx(prof().levels[skill]); const seen = prof().seen; const errs = prof().errors; const t = today();
    return weightedSample(items, (it) => {
      const d = lvlIdx(it.l) - L;
      let w = d === 0 ? 6 : d === -1 ? 3 : d === 1 ? 2 : d < -1 ? 0.5 : 0.25;
      const last = seen[prefix + it.id];
      if (last === t) w *= 0.15; else if (last === addDays(t, -1)) w *= 0.4;
      if (errs[prefix + it.id]) w *= 2;
      return w;
    }, n);
  }

  /* ---------- Generische Multiple-Choice-Übung ---------- */
  // item: { key, chip, prompt(html), passage?, audio?, options[], answer, explain:{fr,de}, after? }
  let session = null;
  function startMC(title, items, opts) {
    if (!items.length) { toast('Pas assez d’exercices disponibles.'); location.hash = '#home'; return; }
    session = { kind: 'mc', title, items, i: 0, correct: 0, xp: 0, answered: false, opts: opts || {} };
    document.body.classList.add('in-session');
    renderMC();
  }
  function explainHtml(ex) {
    if (!ex) return '';
    const showDe = state.settings.explain === 'de';
    return `<div class="expl ${showDe ? 'show-de' : ''}"><div>${esc(ex.fr || '')}</div>${ex.de ? `<div class="de">🇩🇪 ${esc(ex.de)}</div><button class="btn small ghost" data-act="toggleDe" style="margin-top:6px">${U('showDe')}</button>` : ''}</div>`;
  }
  function renderMC() {
    const s = session, it = s.items[s.i];
    if (!it.shuffled) { it.shuffled = shuffle(it.options); }
    const pct = Math.round((s.i / s.items.length) * 100);
    $('#app').innerHTML = `
      <div class="ex-head"><button class="x" data-act="quit" aria-label="Quitter">✕</button><div class="bar"><i style="width:${pct}%"></i></div><span class="small muted">${s.i + 1}/${s.items.length}</span></div>
      <div class="card">
        ${it.chip ? `<span class="chip">${esc(it.chip)}</span>` : ''}
        ${it.passage ? `<div class="passage">${esc(it.passage)}</div>` : ''}
        ${it.textRef ? `<details class="small" style="margin:8px 0"><summary>Revoir le texte</summary><div class="passage">${esc(it.textRef).replace(/\n+/g, '<br><br>')}</div></details>` : ''}
        ${it.audio ? audioBtns(it.audio) : ''}
        <div class="prompt">${it.prompt}</div>
        <div class="opts">${it.shuffled.map((o, k) => `<button class="opt" data-act="pick" data-arg="${k}">${esc(o)}</button>`).join('')}</div>
        <div id="fb"></div>
      </div>`;
    if (it.audio && it.autoplay) setTimeout(() => speak(it.audio), 250);
  }
  function pickMC(k) {
    const s = session; if (!s || s.answered) return;
    const it = s.items[s.i]; const choice = it.shuffled[k]; const ok = choice === it.answer;
    s.answered = true;
    document.querySelectorAll('.opt').forEach((b, idx) => {
      b.disabled = true;
      if (s.opts.silent) { if (idx === Number(k)) b.classList.add('sel'); return; } // Einstufungstest: kein Feedback
      if (it.shuffled[idx] === it.answer) b.classList.add('ok');
      else if (idx === Number(k)) b.classList.add('ko');
    });
    if (s.opts.silent) { s.opts.onAnswer(it, ok); return; }
    const p = prof(); p.stats.answered++; if (!/^ai:|:ai/.test(it.key)) p.seen[it.key] = today();
    if (ok) { s.correct++; p.stats.correct++; s.xp += 5; if (s.opts.errorMode) noteFixed(it.key); }
    else { s.xp += 1; noteError(it.key); }
    save();
    $('#fb').innerHTML = `<div class="feedback ${ok ? 'ok' : 'ko'}">
        <div class="title">${ok ? '✓ ' + U('correct') : '✗ ' + U('wrong')}</div>
        ${ok ? '' : `<div>${U('answerIs')} <b>${esc(it.answer)}</b></div>`}
        ${it.after ? `<div style="margin-top:6px">${it.after}</div>` : ''}
        ${it.afterAudio ? audioBtns(it.afterAudio) : ''}
        ${explainHtml(it.explain)}
      </div>
      <button class="btn primary block" style="margin-top:12px" data-act="nextMC">${s.i + 1 < s.items.length ? U('continue') : U('finish')}</button>`;
    $('#fb').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function nextMC() {
    const s = session; s.answered = false; s.i++;
    if (s.i < s.items.length) { renderMC(); window.scrollTo(0, 0); return; }
    finishSession(s.correct, s.items.length, s.xp, s.opts.missionStep);
  }
  function finishSession(correct, total, xp, missionStep) {
    const perfect = total >= 6 && correct === total;
    if (perfect) award('perfect');
    addXP(xp);
    let missionMsg = '';
    if (missionStep !== undefined) missionMsg = completeMissionStep(missionStep);
    session = null;
    document.body.classList.remove('in-session');
    const nextStep = missionStep !== undefined ? nextMissionStep() : -1;
    $('#app').innerHTML = `<div class="card center">
        <div class="big">${correct}/${total}</div>
        <p class="muted">${perfect ? 'Sans faute, bravo !' : correct / total >= 0.7 ? 'Très bien !' : 'Continue comme ça, ça rentre !'}</p>
        <p><span class="chip">+${xp} XP</span></p>
        ${missionMsg}
        <div class="btnrow" style="margin-top:12px">
          ${nextStep >= 0 ? `<button class="btn primary" data-act="mission" data-arg="${nextStep}">Étape suivante →</button>` : ''}
          <button class="btn ${nextStep >= 0 ? '' : 'primary'}" data-act="goHome">${U('home')}</button>
        </div></div>`;
    window.scrollTo(0, 0);
  }

  /* ---------- Module: Lückentext & Quiz ---------- */
  function gapItems(n, list) {
    const src = list || pickItems(P().gaps, 'grammar', n, 'gap:');
    return src.map((g) => ({
      key: 'gap:' + g.id, chip: g.l + ' · ' + g.t,
      prompt: esc(g.s).replace('___', '<span class="gap">…</span>'),
      options: g.o, answer: g.a, explain: { fr: g.fr, de: g.de },
      after: '<i>' + esc(g.s.replace('___', g.a)) + '</i>', afterAudio: g.s.replace('___', g.a)
    }));
  }
  function vocabMC(w) {
    const pool = P().vocab.filter((x) => x.id !== w.id);
    const sameLvl = shuffle(pool.filter((x) => x.l === w.l));
    const dir = Math.random() < 0.5 ? 'fr' : 'de';
    const other = dir === 'fr' ? 'de' : 'fr';
    const distract = []; for (const x of [...sameLvl, ...shuffle(pool)]) { if (distract.length >= 3) break; if (!distract.includes(x[other]) && x[other] !== w[other]) distract.push(x[other]); }
    return {
      key: 'vocab:' + w.id, chip: w.l + ' · vocabulaire',
      prompt: dir === 'fr' ? `Que signifie « ${esc(w.fr)} » ?` : `Comment dit-on « ${esc(w.de)} » ?`,
      audio: dir === 'fr' ? w.fr.replace(/\s*\((m|f)\)/, '') : null,
      options: [w[other], ...distract], answer: w[other],
      after: '<i>' + esc(w.ex) + '</i>', afterAudio: w.ex, explain: null
    };
  }
  function quizItems(n) {
    const k = Math.ceil(n / 2);
    const qs = pickItems(P().quiz, 'vocab', k, 'quiz:').map((q) => ({ key: 'quiz:' + q.id, chip: q.l + ' · quiz', prompt: esc(q.q), options: q.o, answer: q.a, explain: { fr: q.fr, de: q.de } }));
    const ws = pickItems(P().vocab, 'vocab', n - qs.length, 'vocab:').map(vocabMC);
    return shuffle([...qs, ...ws]);
  }

  /* ---------- Modul: Vokabeltrainer ---------- */
  function startVocab(missionStep) {
    const cfg = MINUTES[state.settings.minutes];
    const p = prof(); const d = today();
    const due = shuffle(dueCards()).slice(0, cfg.cards);
    const newLeft = Math.max(0, cfg.newMax - (p.newByDay[d] || 0));
    const fresh = newWords(Math.min(newLeft, Math.max(0, cfg.cards - due.length) || (missionStep !== undefined ? 0 : 3)));
    let queue = [...due.map((w) => ({ w, isNew: false })), ...fresh.map((w) => ({ w, isNew: true }))];
    if (!queue.length) {
      // nichts fällig, Tageslimit erreicht: freiwillige Wiederholung
      queue = pickItems(P().vocab.filter((w) => srsCard(w.id)), 'vocab', Math.min(6, cfg.cards), 'vocab:').map((w) => ({ w, isNew: false, extra: true }));
    }
    if (!queue.length) { toast('Rien à réviser pour le moment 👍'); if (missionStep !== undefined) { completeMissionStep(missionStep); } goHome(); return; }
    session = { kind: 'cards', queue, i: 0, total: queue.length, xp: 0, good: 0, shown: false, missionStep, again: new Set() };
    document.body.classList.add('in-session');
    renderCard();
  }
  function renderCard() {
    const s = session; const q = s.queue[s.i]; const w = q.w;
    if (q.dir === undefined) { const c = srsCard(w.id); q.dir = !q.isNew && c && c.reps >= 2 && Math.random() < 0.5 ? 'de' : 'fr'; }
    const pct = Math.round((s.i / s.queue.length) * 100);
    const front = q.dir === 'fr' ? w.fr : w.de;
    const spoken = w.fr.replace(/\s*\((m|f)\)/, '');
    $('#app').innerHTML = `
      <div class="ex-head"><button class="x" data-act="quit" aria-label="Quitter">✕</button><div class="bar"><i style="width:${pct}%"></i></div><span class="small muted">${s.i + 1}/${s.queue.length}</span></div>
      <div class="card flash">
        <span class="chip">${q.isNew ? 'Nouveau · ' : ''}${w.l} · ${esc(w.th)}</span>
        <div class="word">${esc(front)}</div>
        ${q.dir === 'fr' ? audioBtns(spoken) : ''}
        ${s.shown ? `<div class="tr"><b>${esc(q.dir === 'fr' ? w.de : w.fr)}</b></div>${q.dir === 'de' ? audioBtns(spoken) : ''}<div class="ex">« ${esc(w.ex)} »</div>${audioBtns(w.ex)}` : `<p class="muted small">${q.dir === 'fr' ? 'Que signifie ce mot ?' : 'Comment le dit-on en français ?'}</p>`}
      </div>
      ${s.shown ? `<div class="rate">
          <button class="btn" data-act="rate" data-arg="0">À revoir<small>&lt; 1 j</small></button>
          <button class="btn" data-act="rate" data-arg="1">Difficile<small>bientôt</small></button>
          <button class="btn primary" data-act="rate" data-arg="2">Bien<small>plus tard</small></button>
          <button class="btn" data-act="rate" data-arg="3">Facile<small>beaucoup plus tard</small></button>
        </div>` : `<button class="btn primary block" data-act="reveal">Afficher la réponse</button>`}`;
  }
  function rateCard(r) {
    const s = session; const q = s.queue[s.i]; const w = q.w; r = Number(r);
    const p = prof();
    if (q.isNew && !q.counted) { q.counted = true; const d = today(); p.newByDay[d] = (p.newByDay[d] || 0) + 1; }
    if (!q.extra && !s.again.has(w.id)) schedule(w.id, r);
    p.seen['vocab:' + w.id] = today();
    if (r === 0) {
      noteError('vocab:' + w.id);
      if (!s.again.has(w.id)) { s.again.add(w.id); s.queue.push({ w, isNew: false, dir: q.dir, extra: true }); }
      s.xp += 1;
    } else { s.good++; s.xp += r >= 2 ? 4 : 3; if (p.errors['vocab:' + w.id] && r >= 2) noteFixed('vocab:' + w.id); }
    save();
    s.i++; s.shown = false;
    if (s.i < s.queue.length) { renderCard(); return; }
    const learned = wordsLearned();
    if (learned >= 25) award('words25');
    if (learned >= 100) award('words100');
    finishSession(s.good, s.queue.length, s.xp, s.missionStep);
  }

  /* ---------- Mission du jour ---------- */
  function mission() {
    const p = prof(); const d = today();
    if (p.mission.date !== d) p.mission = { date: d, done: [false, false, false], rewarded: false };
    return p.mission;
  }
  const MISSION_STEPS = [['vocab', '🗂️', 'Vocabulaire'], ['gaps', '✏️', 'Texte à trous'], ['quiz', '❓', 'Quiz']];
  function nextMissionStep() { const m = mission(); return m.done.findIndex((x) => !x); }
  function completeMissionStep(i) {
    const m = mission(); m.done[i] = true;
    if (m.done.every(Boolean) && !m.rewarded) {
      m.rewarded = true; award('mission');
      const p = prof(); p.missionsDone = (p.missionsDone || 0) + 1; if (p.missionsDone >= 10) award('missions10');
      addXP(20); save();
      return '<p><b>🎯 Mission du jour accomplie ! +20 XP</b></p>';
    }
    save(); return '';
  }
  function runMission(i) {
    i = Number(i); const cfg = MINUTES[state.settings.minutes];
    if (i === 0) startVocab(0);
    else if (i === 1) startMC(U('gaps'), gapItems(cfg.gaps), { missionStep: 1 });
    else startMC(U('quiz'), quizItems(cfg.quiz), { missionStep: 2 });
  }

  /* ---------- Einstufungstest (adaptiv, je Fertigkeit) ---------- */
  const TEST_PER_SKILL = 6;
  let test = null;
  function viewTestIntro() {
    const p = prof(); const last = p.tests[p.tests.length - 1];
    $('#app').innerHTML = `<div class="card">
      <h1>🧭 ${U('test')}</h1>
      <p>Le test évalue séparément quatre compétences, avec ${TEST_PER_SKILL} questions chacune (env. 8–10 minutes). Les questions s’adaptent à tes réponses.</p>
      <ul class="list small">${SKILLS.map((s) => `<li>${U('skill_' + s)}</li>`).join('')}</ul>
      <p class="small muted">Pour la compréhension orale, monte le son 🔊. Tu peux refaire le test à tout moment ; le contenu de l’app s’adapte à ton nouveau niveau.</p>
      ${last ? `<p class="small">Dernier test : ${esc(last.date)} – niveau global <b>${last.global}</b></p>` : ''}
      <button class="btn primary block" data-act="testStart">${U('start')}</button>
      <details class="small muted" style="margin-top:12px"><summary>Auf Deutsch</summary>Der Test prüft Wortschatz, Grammatik, Lese- und Hörverstehen getrennt (je ${TEST_PER_SKILL} Fragen, ca. 8–10 Minuten). Die Fragen passen sich deinen Antworten an. Du kannst ihn jederzeit wiederholen.</details>
    </div>`;
  }
  function testStart() {
    test = { s: 0, level: 'B1', asked: new Set(), rec: [], results: {} };
    document.body.classList.add('in-session');
    testNext();
  }
  function testNext() {
    const skill = SKILLS[test.s];
    const pool = P().placement[skill].map((x, i) => Object.assign({ _k: skill + i }, x)).filter((x) => !test.asked.has(x._k));
    const last = new Set(prof().lastTestItems || []); // Fragen des letzten Tests möglichst vermeiden
    let item = null;
    const order = [0, -1, 1, -2, 2, -3, 3].map((d) => LEVELS[lvlIdx(test.level) + d]).filter(Boolean);
    for (const L of order) {
      const atL = pool.filter((x) => x.l === L);
      const fresh = shuffle(atL.filter((x) => !last.has(x._k)));
      const c = fresh.length ? fresh : shuffle(atL);
      if (c.length) { item = c[0]; break; }
    }
    if (!item) { testSkillDone(); return; }
    if (skill === 'listening' && (!audioOn() || !voice)) { testListeningBlocked(); return; }
    test.asked.add(item._k); test.cur = item;
    const n = test.rec.length + 1;
    const mc = {
      key: 'test:' + item._k, chip: `${U('skill_' + skill)} · ${n}/${TEST_PER_SKILL}`,
      prompt: skill === 'vocab' ? `Que signifie ${esc(item.q)} ?` : skill === 'grammar' ? esc(item.q).replace('___', '<span class="gap">…</span>') : esc(item.q),
      passage: item.p || null, audio: item.t || null, autoplay: !!item.t, options: item.o, answer: item.a
    };
    session = { kind: 'mc', items: [mc], i: 0, answered: false, opts: { silent: true, onAnswer: testAnswer } };
    renderMC();
    if (skill === 'listening') $('#fb').insertAdjacentHTML('beforebegin', '<button class="btn small ghost block" style="margin-top:12px" data-act="testSkip">🔇 Je ne peux pas écouter maintenant – passer cette partie</button>');
    const head = $('.ex-head'); if (head) head.querySelector('.small').textContent = `Partie ${test.s + 1}/4`;
    const bar = $('.ex-head .bar i'); if (bar) bar.style.width = Math.round(((test.s * TEST_PER_SKILL + test.rec.length) / (SKILLS.length * TEST_PER_SKILL)) * 100) + '%';
  }
  function testListeningBlocked() {
    const noVoice = audioOn() && !voice;
    session = null;
    $('#app').innerHTML = `<div class="ex-head"><button class="x" data-act="quit" aria-label="Quitter">✕</button><div class="bar"><i style="width:75%"></i></div><span class="small muted">Partie 4/4</span></div>
      <div class="card"><h2>🎧 ${U('skill_listening')}</h2>
        <p>${noVoice ? 'Aucune voix française n’est installée sur cet appareil : cette partie ne peut pas être évaluée correctement.' : 'Tu es en mode sans son.'}</p>
        <p class="small muted">Si tu passes cette partie, ton niveau actuel en compréhension orale (${prof().levels.listening}) est conservé. Tu pourras refaire le test plus tard.</p>
        <div class="btnrow">${!audioOn() ? '<button class="btn" data-act="toggleAudio">🔊 Activer le son</button>' : ''}<button class="btn primary" data-act="testSkip">Passer cette partie</button></div>
      </div>`;
  }
  function testSkip() {
    test.skipped = (test.skipped || []).concat(SKILLS[test.s]);
    testSkillDone(prof().levels[SKILLS[test.s]]);
  }
  function testAnswer(item, ok) {
    test.rec.push({ l: item.l, ok });
    const li = lvlIdx(test.level);
    test.level = LEVELS[clamp(li + (ok ? 1 : -1), lvlIdx('A2'), lvlIdx('C1'))];
    setTimeout(() => { if (test.rec.length >= TEST_PER_SKILL) testSkillDone(); else testNext(); }, 350);
  }
  function estimate(rec) {
    let est = null;
    for (const L of ['A2', 'B1', 'B2', 'C1']) {
      const r = rec.filter((x) => x.l === L); if (!r.length) continue;
      const rate = r.filter((x) => x.ok).length / r.length;
      if (rate >= 0.5) est = L; else break;
    }
    if (!est) est = rec.some((x) => x.ok) ? 'A2' : 'A1';
    return est;
  }
  function testSkillDone(keep) {
    test.results[SKILLS[test.s]] = keep || estimate(test.rec);
    test.s++; test.rec = []; test.level = 'B1';
    if (test.s < SKILLS.length) { testNext(); return; }
    // Ergebnis
    const res = test.results; const idx = SKILLS.map((s) => lvlIdx(res[s]));
    const global = LEVELS[Math.round(idx.reduce((a, b) => a + b, 0) / idx.length)];
    const p = prof(); p.levels = Object.assign({}, res); p.tested = true; p.lastTestItems = Array.from(test.asked);
    const skipped = test.skipped || [];
    p.tests.push({ date: today(), levels: Object.assign({}, res), global, skipped });
    award('test'); addXP(30); save();
    session = null; test = null; document.body.classList.remove('in-session');
    $('#app').innerHTML = `<div class="card">
        <h1>Résultat</h1>
        <p class="center"><span class="big">${global}</span><br><span class="muted">niveau global</span></p>
        ${SKILLS.map((s) => skillRow(s, res[s])).join('')}
        ${skipped.length ? `<p class="small">🔇 Non évalué : ${skipped.map((s) => U('skill_' + s)).join(', ')} (niveau précédent conservé).</p>` : ''}
        <p class="small muted">Les exercices s’adaptent maintenant à ces niveaux. Ce test est une estimation rapide, pas un certificat officiel.</p>
        <a class="btn primary block" href="#home">${U('continue')}</a>
      </div>`;
    window.scrollTo(0, 0);
  }
  function skillRow(s, L) {
    const i = lvlIdx(L);
    return `<div class="skill"><div class="row"><span>${U('skill_' + s)}</span><span class="lvl">${L}</span></div>
      <div class="scale">${LEVELS.map((x, k) => `<i class="${k <= i ? 'on' : ''}" title="${x}"></i>`).join('')}</div></div>`;
  }

  /* ---------- Ansichten ---------- */
  const ROADMAP = [
    ['📞', 'Appel téléphonique'], ['📻', 'Radio'], ['🗣️', 'Prononciation'], ['🎧', 'Dictée'],
    ['📐', 'Grammaire'], ['🔤', 'Conjugaison'], ['🎭', 'Faux amis'], ['🇨🇭', 'Suisse romande'], ['🏙️', 'Situations'], ['✍️', 'Écriture'], ['🧩', 'Phrases puzzle']
  ];
  function viewHome() {
    const p = prof(); const m = mission(); const doneN = m.done.filter(Boolean).length;
    const xpToday = state.xpByDay[today()] || 0; const g = goal();
    const due = dueCards().length; const errN = Object.keys(p.errors).length;
    const pl = playerLevel();
    $('#app').innerHTML = `
      ${!p.tested ? `<div class="card"><h2>Bienvenue 👋</h2><p>Commence par le test de niveau : l’app adaptera ensuite tous les exercices à tes compétences.</p><a class="btn primary block" href="#test">${U('test')}</a></div>` : ''}
      <div class="card accent">
        <div class="row between"><h2 style="margin:0">🎯 ${U('mission')}</h2><span>${doneN}/3</span></div>
        <p class="muted small">${U('missionSub')} (${state.settings.minutes} min)</p>
        <div class="bar" style="margin:8px 0 12px"><i style="width:${Math.round((doneN / 3) * 100)}%"></i></div>
        ${doneN < 3 ? `<button class="btn primary block" data-act="mission" data-arg="${nextMissionStep()}">${doneN ? U('continue') : U('start')} : ${MISSION_STEPS[nextMissionStep()][2]}</button>` : '<p><b>Mission accomplie pour aujourd’hui ✓</b></p>'}
      </div>
      <div class="card">
        <div class="row between"><span>${U('today')}</span><span class="small muted">${xpToday}/${g} XP</span></div>
        <div class="bar" style="margin-top:6px"><i style="width:${clamp(Math.round((xpToday / g) * 100), 0, 100)}%"></i></div>
        <div class="row between small muted" style="margin-top:8px"><span>🔥 ${currentStreak()} ${U('streak')}</span><span>Niveau joueur ${pl.lvl} · ${pl.rest}/${pl.need}</span></div>
      </div>
      <div class="grid">
        <button class="tile" data-act="go" data-arg="vocab"><span class="ic">🗂️</span><b>${U('vocab')} ${due ? `<span class="badge-n">${due}</span>` : ''}</b><small>${U('vocabSub')}</small></button>
        <button class="tile" data-act="go" data-arg="gaps"><span class="ic">✏️</span><b>${U('gaps')}</b><small>${U('gapsSub')}</small></button>
        <button class="tile" data-act="go" data-arg="quiz"><span class="ic">❓</span><b>${U('quiz')}</b><small>${U('quizSub')}</small></button>
        <button class="tile" data-act="go" data-arg="erreurs"><span class="ic">📒</span><b>${U('errors')} ${errN ? `<span class="badge-n">${errN}</span>` : ''}</b><small>${U('errorsSub')}</small></button>
        <button class="tile" data-act="go" data-arg="test"><span class="ic">🧭</span><b>${U('test')}</b><small>${U('testSub')}</small></button>
        <button class="tile" data-act="go" data-arg="lire"><span class="ic">📖</span><b>Compréhension <span class="ai">✨</span></b><small>Textes à ton niveau</small></button>
        <button class="tile" data-act="go" data-arg="dialogue"><span class="ic">💬</span><b>Dialogue <span class="ai">✨</span></b><small>Jeux de rôle corrigés</small></button>
        <button class="tile" data-act="go" data-arg="ia-exercices"><span class="ic">🧪</span><b>Exercices IA <span class="ai">✨</span></b><small>Textes à trous illimités</small></button>
        <button class="tile" data-act="go" data-arg="mots"><span class="ic">📚</span><b>Mes mots</b><small>${wordsLearned()} appris</small></button>
      </div>
      <div class="section-title">${U('soon')}</div>
      <div class="grid">${ROADMAP.map((r) => `<div class="tile soon"><span class="ic">${r[0]}</span><b>${r[1]}</b><small>${U('soon')}</small></div>`).join('')}</div>`;
  }
  function viewErrors() {
    const p = prof(); const keys = Object.keys(p.errors);
    const byId = P().byId;
    const items = keys.map((k) => { const [type, ...rest] = k.split(':'); const id = rest.join(':'); return { k, type, x: byId[id] }; }).filter((e) => e.x);
    $('#app').innerHTML = `<div class="card"><h1>📒 ${U('errors')}</h1>
      <p class="small muted">Chaque erreur revient ici. Deux bonnes réponses de suite et elle disparaît.</p>
      ${items.length ? `<button class="btn primary block" data-act="errStart">Réviser (${Math.min(10, items.length)})</button>` : '<p>Aucune erreur pour le moment. 🎉</p>'}
      </div>
      ${items.length ? `<div class="card"><ul class="list">${items.slice(0, 60).map((e) => `<li class="small"><span class="chip">${e.type}</span> ${esc(e.type === 'vocab' ? e.x.fr + ' – ' + e.x.de : e.type === 'gap' ? e.x.s.replace('___', '[' + e.x.a + ']') : e.x.q)} <span class="muted">×${p.errors[e.k].n}</span></li>`).join('')}</ul></div>` : ''}`;
  }
  function errStart() {
    const p = prof(); const byId = P().byId;
    const keys = shuffle(Object.keys(p.errors)).slice(0, 10);
    const items = keys.map((k) => {
      const [type, ...rest] = k.split(':'); const x = byId[rest.join(':')]; if (!x) return null;
      if (type === 'vocab') return vocabMC(x);
      if (type === 'gap') return gapItems(0, [x])[0];
      return { key: k, chip: x.l + ' · quiz', prompt: esc(x.q), options: x.o, answer: x.a, explain: { fr: x.fr, de: x.de } };
    }).filter(Boolean);
    startMC(U('errors'), items, { errorMode: true });
  }
  function viewWords() {
    const p = prof();
    const list = P().vocab.filter((w) => srsCard(w.id)).sort((a, b) => srsCard(a.id).due.localeCompare(srsCard(b.id).due));
    $('#app').innerHTML = `<div class="card"><h1>📚 Mes mots</h1>
      <div class="kpis"><div><b>${wordsLearned()}</b><small class="muted">appris</small></div><div><b>${wordsMastered()}</b><small class="muted">maîtrisés</small></div><div><b>${dueCards().length}</b><small class="muted">à réviser</small></div></div></div>
      <div class="card">${list.length ? `<ul class="list">${list.map((w) => { const c = srsCard(w.id); return `<li class="small"><b>${esc(w.fr)}</b> – ${esc(w.de)}<br><span class="muted">${w.l} · prochaine révision : ${c.due}</span></li>`; }).join('')}</ul>` : '<p class="muted">Aucun mot pour l’instant. Lance le vocabulaire !</p>'}
      <p class="small muted">Vocabulaire disponible : ${P().vocab.length} mots (${p.levels.vocab} et alentours).</p></div>`;
  }
  function viewProgress() {
    const p = prof(); const pl = playerLevel();
    const days = []; for (let i = 6; i >= 0; i--) days.push(addDays(today(), -i));
    const max = Math.max(goal(), ...days.map((d) => state.xpByDay[d] || 0));
    const wd = ['di', 'lu', 'ma', 'me', 'je', 've', 'sa'];
    const acc = p.stats.answered ? Math.round((p.stats.correct / p.stats.answered) * 100) : 0;
    $('#app').innerHTML = `
      <div class="card"><h1>Progrès</h1>
        <div class="kpis"><div><b>${currentStreak()}</b><small class="muted">série (record ${state.streak.best || 0})</small></div><div><b>${state.xp}</b><small class="muted">XP · niv. ${pl.lvl}</small></div><div><b>${acc}%</b><small class="muted">réussite</small></div></div>
        <div class="week">${days.map((d) => { const v = state.xpByDay[d] || 0; return `<div><small>${v || ''}</small><i style="height:${Math.round((v / max) * 70)}px;${v >= goal() ? '' : 'opacity:.45'}"></i><small>${wd[new Date(d + 'T12:00').getDay()]}</small></div>`; }).join('')}</div>
      </div>
      <div class="card"><div class="row between"><h2 style="margin:0">Mes niveaux</h2><a href="#test" class="small">Refaire le test</a></div>
        ${SKILLS.map((s) => skillRow(s, p.levels[s])).join('')}
        ${!p.tested ? '<p class="small muted">Niveaux par défaut (B1) – fais le test pour les ajuster.</p>' : ''}
      </div>
      <div class="card"><h2>Badges</h2><div class="badges">${BADGES.map((b) => `<div class="bdg ${state.badges[b[0]] ? 'on' : ''}"><span>${b[1]}</span>${b[2]}</div>`).join('')}</div></div>
      <div class="card"><h2>Mots</h2><div class="kpis"><div><b>${wordsLearned()}</b><small class="muted">appris</small></div><div><b>${wordsMastered()}</b><small class="muted">maîtrisés</small></div><div><b>${Object.keys(p.errors).length}</b><small class="muted">erreurs ouvertes</small></div></div></div>
      ${p.tests.length ? `<div class="card"><h2>Historique des tests</h2><ul class="list">${p.tests.slice().reverse().map((t) => `<li class="small"><b>${t.global}</b> · ${t.date}<br><span class="muted">${SKILLS.map((s) => U('skill_' + s) + ' ' + t.levels[s]).join(' · ')}</span></li>`).join('')}</ul></div>` : ''}`;
  }
  function seg(name, values, cur) {
    return `<div class="seg">${values.map(([v, label]) => `<button class="${String(cur) === String(v) ? 'on' : ''}" data-act="set" data-arg="${name}=${v}">${label}</button>`).join('')}</div>`;
  }
  function viewSettings() {
    const s = state.settings;
    const hasTTS = 'speechSynthesis' in window;
    $('#app').innerHTML = `
      <div class="card"><h1>Réglages</h1>
        <div class="field"><label>Temps par jour</label>${seg('minutes', [[5, '5 min'], [10, '10 min'], [15, '15 min']], s.minutes)}</div>
        <div class="field"><label>Explications</label>${seg('explain', [['fr', 'Français'], ['de', 'FR + Deutsch']], s.explain)}</div>
        <div class="field"><label>Vitesse de la voix</label>${seg('rate', [[0.8, 'Lente'], [0.95, 'Normale'], [1.1, 'Rapide']], s.rate)}</div>
        <div class="field"><label>Son</label>${seg('audio', [['on', '🔊 Avec son'], ['off', '🔇 Sans son (texte)']], s.audio)}<p class="small muted">Sans son, tous les exercices restent faisables par écrit. Raccourci : 🔊 en haut à droite.</p></div>
        <div class="field"><label>Thème</label>${seg('theme', [['auto', 'Auto'], ['light', 'Clair'], ['dark', 'Sombre']], s.theme)}</div>
        <div class="field"><label>Langue</label>${seg('lang', Object.keys(packs).map((k) => [k, packs[k].meta.flag + ' ' + packs[k].meta.name]), state.lang)}<p class="small muted">🇮🇹 Italiano : bientôt.</p></div>
      </div>
      <div class="card" id="voiceBox"><h2>Voix</h2>
        ${!hasTTS ? '<p class="small">Synthèse vocale non disponible dans ce navigateur.</p>' : langVoices().length ? `
          <div class="field"><label class="small">Voix française</label><select id="voiceSel" class="btn block" style="font-weight:400">${langVoices().map((v) => `<option value="${esc(v.name)}" ${voice && v.name === voice.name ? 'selected' : ''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('')}</select></div>
          <button class="btn small" data-act="testVoice">🔊 Tester la voix</button>`
        : `<p class="small"><b>Aucune voix française installée.</b> L’app ne lit donc rien à voix haute (pour éviter un accent étranger). Les exercices restent faisables par écrit.</p>`}
        <details class="small muted" style="margin-top:10px"><summary>Französische Stimme installieren</summary>
          <p><b>Android (Samsung):</b> Einstellungen → Allgemeine Verwaltung → Sprache → Text-zu-Sprache → bevorzugte Engine (Google oder Samsung) → Zahnrad → Sprachdaten installieren → Französisch.</p>
          <p><b>Windows 11:</b> Einstellungen → Zeit und Sprache → Sprache und Region → Sprache hinzufügen → Français (Suisse oder France), dabei «Text-zu-Sprache» anhaken. Danach den Browser neu starten.</p>
          <p><b>macOS:</b> Systemeinstellungen → Bedienungshilfen → Gesprochene Inhalte → Systemstimme → Stimmen verwalten → Französisch.</p>
          <p>Firefox nutzt die Stimmen des Betriebssystems; Chrome bringt teils eigene Online-Stimmen mit.</p></details>
      </div>
      ${aiSettingsCard()}
      <div class="card"><h2>Sauvegarde</h2>
        <p class="small muted">Ta progression est enregistrée uniquement sur cet appareil${memoryOnly ? ' – <b>attention : le stockage est indisponible ici, la progression sera perdue en fermant la page</b>' : ''}. Exporte-la de temps en temps.</p>
        <div class="btnrow"><button class="btn small" data-act="exportCopy">Copier la sauvegarde</button><button class="btn small" data-act="exportFile">Télécharger</button></div>
        <div class="field"><label class="small">Importer (coller ici ou choisir un fichier)</label><textarea id="importBox" placeholder="{ … }"></textarea>
        <div class="btnrow" style="margin-top:6px"><button class="btn small" data-act="importText">Importer le texte</button><label class="btn small">Fichier…<input type="file" id="importFile" accept=".json,application/json" hidden></label></div></div>
      </div>
      <div class="card"><h2>Zone sensible</h2><button class="btn small" data-act="reset">Tout réinitialiser…</button><div id="resetBox"></div></div>
      <p class="small muted center">Lingua v${APP_VERSION}</p>`;
    const vs = $('#voiceSel'); if (vs) vs.addEventListener('change', () => { state.settings.voiceName = vs.value; save(); pickVoice(); speak('Bonjour !'); });
    const am = $('#aiModel'); if (am) am.addEventListener('change', () => aiSetModel(am.value));
    const f = $('#importFile'); if (f) f.addEventListener('change', (e) => { const file = e.target.files[0]; if (!file) return; file.text().then(importData); });
  }
  function importData(txt) {
    try {
      const s = JSON.parse(txt); if (!s || !s.profiles || !s.settings) throw new Error('format');
      state = Object.assign(defaultState(), s); save(); applyTheme(); renderTop(); toast('Sauvegarde importée ✓'); route();
    } catch (e) { toast('Import impossible : fichier non valide.'); }
  }

  /* ======================================================================
     KI-Module (Google Gemini) – Textverständnis, KI-Lückentexte, Dialogpartner
     Der API-Schlüssel liegt nur auf diesem Gerät (localStorage), nie im Backup.
     ====================================================================== */
  const AI_KEY = 'lingua.gemini';
  const AI_BASE = 'https://generativelanguage.googleapis.com/v1beta/';
  function aiConf() { try { return JSON.parse(localStorage.getItem(AI_KEY) || '{}'); } catch (e) { return {}; } }
  function aiSaveConf(c) { try { localStorage.setItem(AI_KEY, JSON.stringify(c)); } catch (e) { toast('Impossible d’enregistrer la clé ici.'); } }
  const aiReady = () => !!aiConf().key;
  function aiErr(status, msg) { const e = new Error(msg || ''); e.status = status; return e; }
  async function aiFetch(path, opts) {
    const c = aiConf(); if (!c.key) throw aiErr(0, 'nokey');
    let res;
    try { res = await fetch(AI_BASE + path, Object.assign({ headers: { 'Content-Type': 'application/json', 'x-goog-api-key': c.key } }, opts)); }
    catch (e) { throw aiErr(-1, navigator.onLine === false ? 'offline' : 'blocked'); }
    if (!res.ok) { let m = ''; try { m = ((await res.json()).error || {}).message || ''; } catch (e) { /* */ } throw aiErr(res.status, m); }
    return res.json();
  }
  function aiErrorText(e) {
    if (e.message === 'nokey') return 'Aucune clé Gemini enregistrée (Réglages › Intelligence artificielle).';
    if (e.message === 'offline') return 'Pas de connexion Internet. Les contenus préparés à l’avance restent disponibles.';
    if (e.message === 'blocked') return 'Connexion à Gemini impossible. Dans l’aperçu Claude, c’est bloqué : utilise la version installée depuis GitHub.';
    if (e.status === 429) return 'Limite gratuite atteinte pour le moment. Réessaie plus tard ou choisis un autre modèle dans les Réglages.';
    if (e.status === 404) return 'Modèle introuvable : recharge la liste des modèles dans les Réglages.';
    if (e.status === 400 || e.status === 401 || e.status === 403) return 'Requête refusée : vérifie la clé et le modèle dans les Réglages.' + (e.message ? ' (' + e.message.slice(0, 140) + ')' : '');
    if (e.status >= 500) return 'Gemini est momentanément surchargé. Réessaie dans un instant.';
    return 'Erreur IA : ' + (e.message || e.status);
  }
  function modelScore(id) {
    const v = parseFloat((id.match(/gemini-(\d+(?:\.\d+)?)/) || [0, '0'])[1]) || 0;
    let s = v * 10;
    if (/preview|exp/.test(id)) s -= 3;
    if (/lite/.test(id)) s -= 1.5;
    if (/latest/.test(id)) s -= 0.5;
    if (/-\d{2}-\d{4}|-\d{3}$/.test(id)) s -= 0.2;
    return s;
  }
  async function aiListModels() {
    const out = []; let token = '';
    for (let i = 0; i < 5; i++) {
      const r = await aiFetch('models?pageSize=100' + (token ? '&pageToken=' + encodeURIComponent(token) : ''), { method: 'GET' });
      (r.models || []).forEach((m) => out.push(m)); token = r.nextPageToken; if (!token) break;
    }
    const bad = /(tts|image|live|audio|embed|native|vision|learnlm|gemma|aqa|robotics|computer|thinking)/i;
    return out.filter((m) => (m.supportedGenerationMethods || []).includes('generateContent') && /flash/i.test(m.name) && !bad.test(m.name))
      .map((m) => ({ id: m.name.replace(/^models\//, ''), label: m.displayName || m.name }))
      .sort((a, b) => modelScore(b.id) - modelScore(a.id));
  }
  function parseJSON(txt) {
    let t = txt.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    try { return JSON.parse(t); } catch (e) { /* */ }
    const a = t.indexOf('{'), b = t.lastIndexOf('}');
    if (a >= 0 && b > a) return JSON.parse(t.slice(a, b + 1));
    throw aiErr(500, 'Réponse illisible');
  }
  async function aiGenerate({ system, contents, schema, temperature }) {
    const c = aiConf();
    const models = [...new Set([c.model || 'gemini-2.5-flash', ...(c.fallbacks || [])])].slice(0, 3);
    let lastErr;
    for (const m of models) {
      try {
        const body = { contents, generationConfig: { temperature: temperature === undefined ? 0.8 : temperature } };
        if (system) body.systemInstruction = { parts: [{ text: system }] };
        if (schema) { body.generationConfig.responseMimeType = 'application/json'; body.generationConfig.responseSchema = schema; }
        const r = await aiFetch('models/' + encodeURIComponent(m) + ':generateContent', { method: 'POST', body: JSON.stringify(body) });
        const parts = (((r.candidates || [])[0] || {}).content || {}).parts || [];
        const txt = parts.filter((p) => !p.thought).map((p) => p.text || '').join('');
        if (!txt) throw aiErr(500, 'Réponse vide');
        return schema ? parseJSON(txt) : txt;
      } catch (e) { lastErr = e; if (![429, 404, 500, 503].includes(e.status)) throw e; }
    }
    throw lastErr;
  }
  const S = (type, extra) => Object.assign({ type }, extra || {});
  const STR = S('STRING');
  const LEARNER = 'The learner is a German-speaking adult living in Switzerland, near the French-speaking region (Romandie). ';
  function aiBusy(msg) {
    document.body.classList.add('in-session');
    $('#app').innerHTML = `<div class="card center"><div class="spinner"></div><p>${esc(msg)}</p><p class="small muted">Gemini rédige… (5–20 s)</p></div>`;
  }
  function aiFail(e, back) {
    document.body.classList.remove('in-session'); session = null;
    $('#app').innerHTML = `<div class="card"><h2>Oups</h2><p>${esc(aiErrorText(e))}</p><div class="btnrow"><button class="btn" data-act="goHome">${U('home')}</button>${back ? `<button class="btn primary" data-act="go" data-arg="${back}">Réessayer</button>` : ''}</div></div>`;
  }
  function aiSetupCard() {
    return `<div class="card"><h2>✨ Fonction IA</h2>
      <p>Ce module utilise Google Gemini. Il faut une clé API gratuite, à enregistrer une seule fois dans les Réglages.</p>
      <details class="small muted"><summary>Auf Deutsch</summary>Dieses Modul nutzt Google Gemini. Du brauchst einen kostenlosen API-Schlüssel, den du einmal unter «Réglages» einträgst.</details>
      <a class="btn primary block" href="#reglages" style="margin-top:10px">Réglages › Intelligence artificielle</a></div>`;
  }

  /* ---------- Offline-Vorrat ---------- */
  function aiCache() { const p = prof(); p.aiCache = p.aiCache || { reading: [], gaps: [] }; return p.aiCache; }
  let refilling = false;
  async function aiRefill(kind, target) {
    if (refilling || !aiReady() || navigator.onLine === false) return;
    refilling = true;
    try {
      const c = aiCache();
      while (c[kind].length < (target || 2)) {
        const obj = kind === 'reading' ? await genReading(pickTopic(), 'auto') : await genGaps('mix');
        c[kind].push(obj); save();
      }
    } catch (e) { /* still im Hintergrund */ }
    refilling = false;
  }
  async function aiPrepare() {
    if (!aiReady()) { toast('Enregistre d’abord une clé.'); return; }
    toast('Préparation en cours…');
    await aiRefill('reading', 3); await aiRefill('gaps', 2);
    const c = aiCache(); toast(`Prêt hors ligne : ${c.reading.length} textes, ${c.gaps.length} séries d’exercices.`);
    if (location.hash === '#reglages') viewSettings();
  }

  /* ---------- Eigene Wörter (aus Texten und Dialogen) ---------- */
  function addCustomWord(fr, de, ex) {
    fr = String(fr || '').trim(); de = String(de || '').trim(); if (!fr || !de) return false;
    if (P().byId['v:' + fr]) { toast('Déjà dans ton vocabulaire.'); return false; }
    const p = prof(); p.customVocab = p.customVocab || [];
    p.customVocab.push([fr, de, p.levels.vocab, 'perso', String(ex || '')]);
    delete prepared[P().meta.code]; save();
    toast('➕ Ajouté à tes mots : ' + fr); return true;
  }
  const pendingWords = {}; let pwSeq = 0;
  function wordBtn(w) {
    const id = 'w' + (++pwSeq); pendingWords[id] = w;
    const known = !!P().byId['v:' + w.fr];
    return `<li class="small"><b>${esc(w.fr)}</b> – ${esc(w.de)}${w.ex ? `<br><i class="muted">${esc(w.ex)}</i>` : ''}
      <br><button class="btn small ghost" data-act="addWord" data-arg="${id}" ${known ? 'disabled' : ''}>${known ? '✓ Déjà appris' : '➕ Ajouter à mes mots'}</button></li>`;
  }

  /* ---------- Textverständnis ---------- */
  const R_TOPICS = [['quotidien', '🏠 Quotidien'], ['voyage', '🧳 Voyage'], ['gastronomie', '🍽️ Gastronomie'], ['culture', '🎭 Culture'], ['suisse', '🇨🇭 Suisse romande'], ['nature', '🌿 Nature'], ['travail', '💼 Travail'], ['societe', '📰 Société'], ['surprise', '🎲 Surprise']];
  const R_TYPES = [['auto', 'Au choix'], ['article', 'Article'], ['email', 'E-mail'], ['dialogue', 'Dialogue'], ['annonce', 'Annonce'], ['recit', 'Récit']];
  const R_WORDS = { A1: 80, A2: 120, B1: 180, B2: 260, C1: 330, C2: 380 };
  const ui = { rTopic: 'surprise', rType: 'auto', gFocus: 'mix' };
  function pickTopic() { return R_TOPICS[Math.floor(Math.random() * (R_TOPICS.length - 1))][0]; }
  const READ_SCHEMA = S('OBJECT', {
    properties: {
      title: STR, text: STR,
      questions: S('ARRAY', { items: S('OBJECT', { properties: { q: STR, options: S('ARRAY', { items: STR }), answer: STR, fr: STR, de: STR }, required: ['q', 'options', 'answer', 'fr', 'de'] }) }),
      glossary: S('ARRAY', { items: S('OBJECT', { properties: { fr: STR, de: STR, ex: STR }, required: ['fr', 'de', 'ex'] }) })
    }, required: ['title', 'text', 'questions', 'glossary']
  });
  async function genReading(topic, type) {
    const level = prof().levels.reading;
    if (topic === 'surprise') topic = pickTopic();
    const topicName = (R_TOPICS.find((t) => t[0] === topic) || ['', topic])[1].replace(/^\S+\s/, '');
    const typeName = type === 'auto' ? 'a text type of your choice (article, e-mail, dialogue, ad, short story)' : (R_TYPES.find((t) => t[0] === type) || ['', type])[1];
    const nq = lvlIdx(level) >= 3 ? 5 : 4;
    const prompt = `${LEARNER}Write an original, natural French text: ${typeName}, topic "${topicName}", CEFR level ${level}, about ${R_WORDS[level] || 180} words. Use vocabulary and grammar typical of ${level}; a few slightly harder words are fine (put them in the glossary). Standard French; the setting may be in Suisse romande when natural. Invent people and facts (no real public figures, no current news).
Then write ${nq} multiple-choice comprehension questions in French, each with exactly 4 options and exactly one correct option; "answer" must be exactly identical to one of the options. Test real understanding (main idea, details${lvlIdx(level) >= 3 ? ', inference, tone' : ''}), not just copying words. "fr": short explanation in French, "de": the same in German.
Glossary: 6–8 useful words or expressions from the text (in dictionary form, with article for nouns), German translation, and the sentence from the text as "ex".`;
    const r = await aiGenerate({ contents: [{ role: 'user', parts: [{ text: prompt }] }], schema: READ_SCHEMA, temperature: 0.9 });
    const qs = (r.questions || []).map((q) => {
      const opts = (q.options || []).map(String).filter(Boolean);
      let ans = String(q.answer || '');
      if (!opts.includes(ans)) { const m = opts.find((o) => o.trim().toLowerCase() === ans.trim().toLowerCase()); if (m) ans = m; }
      return opts.length >= 3 && opts.includes(ans) && new Set(opts).size === opts.length ? { q: q.q, o: opts, a: ans, fr: q.fr, de: q.de } : null;
    }).filter(Boolean);
    if (!r.text || qs.length < 2) throw aiErr(500, 'Contenu incomplet');
    return { title: r.title || 'Texte', text: r.text, questions: qs, glossary: (r.glossary || []).filter((g) => g.fr && g.de).slice(0, 10), level, topic, date: today() };
  }
  function viewReading() {
    if (!aiReady()) { $('#app').innerHTML = aiSetupCard(); return; }
    const c = aiCache();
    const chips = (list, cur, act) => `<div class="chips">${list.map(([k, l]) => `<button class="chipbtn ${cur === k ? 'on' : ''}" data-act="${act}" data-arg="${k}">${l}</button>`).join('')}</div>`;
    $('#app').innerHTML = `<div class="card"><h1>📖 Compréhension écrite</h1>
        <p class="small muted">Un texte original à ton niveau (${prof().levels.reading}), puis des questions. Les mots utiles peuvent rejoindre ton vocabulaire.</p>
        <div class="field"><label>Thème</label>${chips(R_TOPICS, ui.rTopic, 'rTopic')}</div>
        <div class="field"><label>Type de texte</label>${chips(R_TYPES, ui.rType, 'rType')}</div>
        <button class="btn primary block" data-act="readGen">✨ Générer un texte</button>
        ${c.reading.length ? `<button class="btn block" style="margin-top:8px" data-act="readCached">📦 Texte préparé (${c.reading.length} disponible${c.reading.length > 1 ? 's' : ''}, aussi hors ligne)</button>` : ''}
        <p class="small muted" style="margin-top:10px">Texte généré par IA : il peut contenir de petites erreurs.</p></div>`;
  }
  async function readGen() {
    aiBusy('Je prépare un texte pour toi…');
    try { const r = await genReading(ui.rTopic, ui.rType); showReading(r); }
    catch (e) { aiFail(e, 'lire'); }
  }
  function readCached() { const c = aiCache(); const r = c.reading.shift(); save(); if (r) showReading(r); setTimeout(() => aiRefill('reading'), 1500); }
  function showReading(r) {
    session = { kind: 'reading', r };
    document.body.classList.add('in-session');
    const paras = String(r.text).split(/\n+/).map((p) => `<p>${esc(p)}</p>`).join('');
    $('#app').innerHTML = `
      <div class="ex-head"><button class="x" data-act="quit" aria-label="Quitter">✕</button><div class="bar"><i style="width:5%"></i></div><span class="small muted">Lecture</span></div>
      <div class="card"><span class="chip">${r.level} · ${esc(r.topic || '')}</span><h2 style="margin-top:8px">${esc(r.title)}</h2>
        ${audioBtns(r.text)}<div class="reading">${paras}</div></div>
      ${r.glossary.length ? `<div class="card"><details><summary><b>Vocabulaire du texte (${r.glossary.length})</b></summary><ul class="list">${r.glossary.map(wordBtn).join('')}</ul></details></div>` : ''}
      <button class="btn primary block" data-act="readQuestions">Questions →</button>`;
    window.scrollTo(0, 0);
  }
  function readQuestions() {
    const r = session.r;
    const items = r.questions.map((q, i) => ({ key: 'ai:read' + i, chip: `${r.level} · compréhension`, prompt: esc(q.q), textRef: r.text, options: q.o, answer: q.a, explain: { fr: q.fr, de: q.de } }));
    startMC('Compréhension', items, {});
    session.xp += 10; // Bonus fürs Lesen
  }

  /* ---------- KI-Lückentexte ---------- */
  const G_FOCUS = [['mix', '🎲 Varié'], ['weak', '🎯 Mes points faibles'], ['passé composé / imparfait', 'Passé composé / imparfait'], ['subjonctif', 'Subjonctif'], ['pronoms (le, lui, y, en)', 'Pronoms'], ['pronoms relatifs', 'Relatifs'], ['conditionnel et hypothèse', 'Conditionnel / si'], ['prépositions', 'Prépositions'], ['accord du participe passé', 'Accord du participe']];
  const GAP_SCHEMA = S('OBJECT', { properties: { items: S('ARRAY', { items: S('OBJECT', { properties: { s: STR, a: STR, o: S('ARRAY', { items: STR }), t: STR, fr: STR, de: STR }, required: ['s', 'a', 'o', 't', 'fr', 'de'] }) }) }, required: ['items'] });
  function weakTopics() {
    const byId = P().byId; const cnt = {};
    Object.keys(prof().errors).forEach((k) => { if (k.startsWith('gap:')) { const g = byId[k.slice(4)]; if (g && g.t) cnt[g.t] = (cnt[g.t] || 0) + prof().errors[k].n; } });
    return Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 4).map((x) => x[0]);
  }
  async function genGaps(focus) {
    const level = prof().levels.grammar; const n = MINUTES[state.settings.minutes].gaps + 2;
    let f = '';
    if (focus === 'weak') { const w = weakTopics(); f = w.length ? `Focus on these topics the learner often gets wrong: ${w.join(', ')}.` : 'Vary the grammar topics.'; }
    else if (focus && focus !== 'mix') f = `All items practise: ${focus}.`;
    else f = 'Vary the grammar topics.';
    const prompt = `${LEARNER}Create ${n} French fill-in-the-blank grammar exercises at CEFR level ${level}. ${f}
Rules: each sentence "s" contains exactly one blank written as ___ (three underscores). "o" has exactly 3 options, including the answer "a" written identically. Exactly one option is correct in standard written French; the two others must be clearly wrong (never an alternative that would also be acceptable). Everyday contexts (travel, restaurant, culture, work, life in Suisse romande). "t": grammar topic in French (2–4 words). "fr": explanation in French (max 25 words). "de": the same in German.`;
    const r = await aiGenerate({ contents: [{ role: 'user', parts: [{ text: prompt }] }], schema: GAP_SCHEMA, temperature: 0.7 });
    const items = (r.items || []).map((g) => {
      const o = (g.o || []).map(String); const a = String(g.a || '');
      return g.s && (g.s.match(/___/g) || []).length === 1 && o.length === 3 && o.includes(a) && new Set(o).size === 3
        ? { id: 'ai' + Math.random().toString(36).slice(2, 9), l: level, t: g.t || 'grammaire', s: g.s, a, o, fr: g.fr || '', de: g.de || '' } : null;
    }).filter(Boolean);
    if (items.length < 3) throw aiErr(500, 'Contenu incomplet');
    return { items, level, date: today() };
  }
  function viewAiGaps() {
    if (!aiReady()) { $('#app').innerHTML = aiSetupCard(); return; }
    const c = aiCache(); const w = weakTopics();
    $('#app').innerHTML = `<div class="card"><h1>✨ Exercices IA</h1>
      <p class="small muted">Nouveaux textes à trous à ton niveau de grammaire (${prof().levels.grammar}), créés à la demande.</p>
      <div class="field"><label>Sujet</label><div class="chips">${G_FOCUS.map(([k, l]) => `<button class="chipbtn ${ui.gFocus === k ? 'on' : ''}" data-act="gFocus" data-arg="${esc(k)}">${l}</button>`).join('')}</div>
      ${ui.gFocus === 'weak' ? `<p class="small muted">${w.length ? 'Tes points faibles : ' + esc(w.join(', ')) : 'Pas encore assez d’erreurs enregistrées – exercices variés.'}</p>` : ''}</div>
      <button class="btn primary block" data-act="gapGen">✨ Générer</button>
      ${c.gaps.length ? `<button class="btn block" style="margin-top:8px" data-act="gapCached">📦 Série préparée (${c.gaps.length}, aussi hors ligne)</button>` : ''}
      <p class="small muted" style="margin-top:10px">Exercices générés par IA : en cas de doute, signale-le-moi.</p></div>`;
  }
  async function gapGen() {
    aiBusy('Je prépare tes exercices…');
    try { const r = await genGaps(ui.gFocus); startMC('Exercices IA', gapItems(0, r.items), {}); }
    catch (e) { aiFail(e, 'ia-exercices'); }
  }
  function gapCached() { const c = aiCache(); const r = c.gaps.shift(); save(); if (r) startMC('Exercices IA', gapItems(0, r.items), {}); setTimeout(() => aiRefill('gaps'), 1500); }

  /* ---------- Dialogpartner ---------- */
  const SCENARIOS = [
    { id: 'restaurant', ic: '🍽️', t: 'Au restaurant', role: 'a friendly waiter in a brasserie in Fribourg', task: 'The learner orders a meal and a drink, asks about a dish, and finally asks for the bill.', min: 'A2' },
    { id: 'boulangerie', ic: '🥐', t: 'À la boulangerie', role: 'a baker in a small village bakery', task: 'The learner buys bread and pastries and asks about prices.', min: 'A1' },
    { id: 'gare', ic: '🚆', t: 'Au guichet de la gare', role: 'a ticket agent of the Swiss railways (CFF) in Fribourg', task: 'The learner buys a ticket to Geneva, asks about times, platform, connection and the demi-tarif discount.', min: 'A2' },
    { id: 'tourisme', ic: '🗺️', t: 'Office du tourisme', role: 'an employee of the tourist office in Gruyères', task: 'The learner asks what to do in the region for two days (cheese dairy, castle, hiking, restaurants).', min: 'A2' },
    { id: 'medecin', ic: '🩺', t: 'Chez le médecin', role: 'a general practitioner', task: 'The learner describes symptoms of a cold or flu (invented). Ask simple questions and give advice. This is a language exercise only.', min: 'B1' },
    { id: 'appartement', ic: '🏡', t: 'Visite d’appartement', role: 'an agent of the property management company (régie)', task: 'The learner visits a 3.5-room flat and asks about rent, charges, availability, laundry room and parking.', min: 'B1' },
    { id: 'regie', ic: '📞', t: 'Appel à la régie : chauffage en panne', role: 'a receptionist of the property management company on the phone', task: 'The learner calls because the heating is broken and wants a quick repair. Ask for details and propose an appointment.', min: 'B1' },
    { id: 'voisin', ic: '🥂', t: 'Apéro avec un voisin', role: 'a talkative neighbour at a neighbourhood apéro', task: 'Small talk: hobbies, weekend, the region, holidays.', min: 'A2' },
    { id: 'entretien', ic: '💼', t: 'Entretien d’embauche', role: 'a recruiter of a medium-sized company in Lausanne', task: 'Job interview: experience, motivation, strengths, working hours, questions of the candidate.', min: 'B2' },
    { id: 'debat', ic: '⚖️', t: 'Discussion : la semaine de 4 jours', role: 'a colleague who is sceptical about the four-day week', task: 'Friendly debate: the learner argues for the four-day week; you politely defend the opposite view with arguments and ask for justification.', min: 'B2' },
    { id: 'libre', ic: '💬', t: 'Conversation libre', role: 'a friendly person from Suisse romande', task: 'Free conversation. Start by asking the learner what they would like to talk about.', min: 'A1' }
  ];
  const TURN_SCHEMA = S('OBJECT', { properties: { reply: STR, correction: STR, fr: STR, de: STR, hint: STR }, required: ['reply', 'correction', 'fr', 'de', 'hint'] });
  const SUM_SCHEMA = S('OBJECT', {
    properties: {
      bilan_fr: STR, bilan_de: STR,
      points: S('ARRAY', { items: S('OBJECT', { properties: { erreur: STR, correction: STR, fr: STR, de: STR }, required: ['erreur', 'correction', 'fr', 'de'] }) }),
      mots: S('ARRAY', { items: S('OBJECT', { properties: { fr: STR, de: STR, ex: STR }, required: ['fr', 'de', 'ex'] }) })
    }, required: ['bilan_fr', 'bilan_de', 'points', 'mots']
  });
  function chatLevel() { return prof().levels.vocab; }
  function chatSystem(sc) {
    const L = chatLevel();
    return `You are a conversation partner in a French role-play. ${LEARNER}Learner level: CEFR ${L}.
Scenario: ${sc.t}. Your role: ${sc.role}. ${sc.task}
- "reply": stay in character, only French, 1–3 short sentences, natural spoken style adapted to ${L} (A1–A2 very simple, B1 everyday, B2 natural, C1 rich and idiomatic). Usually end with a question or prompt so the conversation continues. Setting: Suisse romande (CHF, Swiss habits) unless stated otherwise. Never ask for real personal data; the learner may invent.
- After each learner message, check it. If it contains mistakes (grammar, vocabulary, spelling, unidiomatic wording, wrong register), put a corrected natural version of the learner's whole message in "correction" and explain the main point briefly in "fr" (French) and "de" (German). If the message is correct and natural, "correction", "fr" and "de" are empty strings. Ignore missing accents only if the meaning is clear, but mention them in "fr"/"de" when they change the word.
- "hint": one possible next sentence the learner could say (French, level ${L}).
- If the message is "[START]", open the conversation in your role; then correction/fr/de are empty.`;
  }
  function viewDialog() {
    if (!aiReady()) { $('#app').innerHTML = aiSetupCard(); return; }
    const L = lvlIdx(chatLevel());
    $('#app').innerHTML = `<div class="card"><h1>💬 Dialogue</h1>
      <p class="small muted">Jeu de rôle avec correction de chaque message. Niveau : ${chatLevel()}. Tu peux écrire${SR ? ' ou dicter 🎤' : ''}.</p></div>
      <div class="grid">${SCENARIOS.map((s) => `<button class="tile" data-act="chatStart" data-arg="${s.id}"><span class="ic">${s.ic}</span><b>${esc(s.t)}</b><small>${lvlIdx(s.min) > L ? 'un peu difficile' : 'niveau ' + s.min + '+'}</small></button>`).join('')}</div>
      <p class="small muted">N’indique pas de vraies données personnelles : invente si nécessaire.</p>`;
  }
  async function chatStart(id) {
    const sc = SCENARIOS.find((s) => s.id === id); if (!sc) return;
    session = { kind: 'chat', sc, msgs: [], busy: true, xp: 0, n: 0 };
    document.body.classList.add('in-session');
    renderChat();
    await chatTurn('[START]');
  }
  function chatContents() {
    const s = session; const out = [];
    s.msgs.forEach((m) => out.push({ role: m.role === 'me' ? 'user' : 'model', parts: [{ text: m.role === 'me' ? m.text : JSON.stringify({ reply: m.text, correction: '', fr: '', de: '', hint: '' }) }] }));
    while (out.length > 30) out.splice(0, 2); // Abwechslung Partner/Lernende bleibt erhalten
    return [{ role: 'user', parts: [{ text: '[START]' }] }].concat(out);
  }
  async function chatTurn(text) {
    const s = session; s.busy = true; renderChat();
    const contents = text === '[START]' ? [{ role: 'user', parts: [{ text: '[START]' }] }] : chatContents();
    try {
      const r = await aiGenerate({ system: chatSystem(s.sc), contents, schema: TURN_SCHEMA, temperature: 0.8 });
      if (session !== s) return;
      const last = s.msgs[s.msgs.length - 1];
      if (last && last.role === 'me' && r.correction && r.correction.trim() && r.correction.trim() !== last.text.trim()) last.corr = { text: r.correction, fr: r.fr, de: r.de };
      else if (last && last.role === 'me') s.xp += 2; // fehlerfrei
      s.msgs.push({ role: 'ai', text: r.reply || '…' }); s.hint = r.hint || '';
      s.busy = false; renderChat(); speak(r.reply, false, true);
    } catch (e) {
      if (session !== s) return;
      s.busy = false; s.error = aiErrorText(e); renderChat();
    }
  }
  function chatSend() {
    const s = session; const box = $('#chatInput'); const text = (box.value || '').trim();
    if (!text || s.busy) return;
    s.msgs.push({ role: 'me', text }); s.n++; s.xp += 3; s.hint = ''; s.error = '';
    box.value = '';
    chatTurn(text);
  }
  function renderChat() {
    const s = session; const sc = s.sc;
    const keep = $('#chatInput') ? $('#chatInput').value : '';
    $('#app').innerHTML = `
      <div class="ex-head"><button class="x" data-act="quit" aria-label="Quitter">✕</button><b style="flex:1">${sc.ic} ${esc(sc.t)}</b>${s.n >= 2 ? '<button class="btn small" data-act="chatEnd">Terminer</button>' : ''}</div>
      <div class="chat" id="chat">
        ${s.msgs.map((m) => m.role === 'ai'
          ? `<div class="msg ai">${esc(m.text)}${audioOn() ? ` <button class="mini" data-act="speak" data-arg="${regSpeak(m.text)}" aria-label="Écouter">🔊</button>` : ''}</div>`
          : `<div class="msg me">${esc(m.text)}</div>${m.corr ? `<div class="corr expl ${state.settings.explain === 'de' ? 'show-de' : ''}"><b>✏️ Mieux :</b> ${esc(m.corr.text)}${m.corr.fr ? `<div class="small">${esc(m.corr.fr)}</div>` : ''}${m.corr.de ? `<div class="de small">🇩🇪 ${esc(m.corr.de)}</div><button class="mini" data-act="toggleDe">DE</button>` : ''}</div>` : ''}`).join('')}
        ${s.busy ? '<div class="msg ai typing"><span></span><span></span><span></span></div>' : ''}
        ${s.error ? `<div class="feedback ko small">${esc(s.error)} <button class="btn small" data-act="chatRetry">Réessayer</button></div>` : ''}
      </div>
      ${s.showHint && s.hint ? `<div class="hint small">💡 ${esc(s.hint)}</div>` : ''}
      <div class="chatbar">
        <textarea id="chatInput" rows="2" placeholder="Écris ta réponse en français…" ${s.busy ? 'disabled' : ''}></textarea>
        <div class="chatbtns">
          ${SR && audioOn() ? '<button class="btn small" data-act="dictate" aria-label="Dicter">🎤</button>' : ''}
          <button class="btn small ghost" data-act="chatHint" ${s.hint ? '' : 'disabled'}>💡</button>
          <button class="btn small primary" data-act="chatSend" ${s.busy ? 'disabled' : ''}>Envoyer</button>
        </div>
      </div>`;
    const box = $('#chatInput'); box.value = keep;
    const chat = $('#chat'); if (chat) chat.lastElementChild && chat.lastElementChild.scrollIntoView({ block: 'end' });
    window.scrollTo(0, document.body.scrollHeight);
  }
  function regSpeak(text) { const id = 's' + (++speakSeq); speakText[id] = text; return id; }
  async function chatEnd() {
    const s = session; if (s.busy) return;
    aiBusy('Je prépare ton bilan…');
    const transcript = s.msgs.map((m) => (m.role === 'me' ? 'LEARNER: ' : 'PARTNER: ') + m.text).join('\n');
    const prompt = `${LEARNER}Here is a French role-play (${s.sc.t}) between the learner (CEFR ${chatLevel()}) and a partner:
${transcript}
Give feedback on the LEARNER's French only: "bilan_fr" = 2–3 encouraging, concrete sentences in French (what went well, what to work on); "bilan_de" = the same in German. "points": up to 4 most useful mistakes (the learner's wording, a correct version, short explanation in French and German); empty if none. "mots": 3–6 useful words or expressions for this situation that the learner did not use yet (dictionary form, German translation, an example sentence).`;
    try {
      const r = await aiGenerate({ contents: [{ role: 'user', parts: [{ text: prompt }] }], schema: SUM_SCHEMA, temperature: 0.5 });
      const xp = s.xp + 15; addXP(xp);
      session = null; document.body.classList.remove('in-session');
      $('#app').innerHTML = `<div class="card"><h1>Bilan</h1><p><span class="chip">+${xp} XP</span> <span class="small muted">${s.n} messages</span></p>
          <div class="expl ${state.settings.explain === 'de' ? 'show-de' : ''}"><p>${esc(r.bilan_fr)}</p><div class="de">🇩🇪 ${esc(r.bilan_de)}</div><button class="btn small ghost" data-act="toggleDe">DE</button></div></div>
        ${(r.points || []).length ? `<div class="card"><h2>À retenir</h2><ul class="list">${r.points.map((p) => `<li class="small expl ${state.settings.explain === 'de' ? 'show-de' : ''}"><s class="muted">${esc(p.erreur)}</s><br><b>${esc(p.correction)}</b><br>${esc(p.fr)}<div class="de">🇩🇪 ${esc(p.de)}</div></li>`).join('')}</ul></div>` : ''}
        ${(r.mots || []).length ? `<div class="card"><h2>Mots utiles</h2><ul class="list">${r.mots.map(wordBtn).join('')}</ul></div>` : ''}
        <div class="btnrow"><button class="btn" data-act="go" data-arg="dialogue">Autre dialogue</button><button class="btn primary" data-act="goHome">${U('home')}</button></div>`;
      window.scrollTo(0, 0);
    } catch (e) {
      addXP(s.xp); aiFail(e, 'dialogue');
    }
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  function dictate(_, btn) {
    if (!SR) return;
    try {
      const rec = new SR(); rec.lang = 'fr-FR'; rec.interimResults = false; rec.maxAlternatives = 1;
      btn.textContent = '⏺️'; btn.disabled = true;
      rec.onresult = (e) => { const t = e.results[0][0].transcript; const box = $('#chatInput'); box.value = (box.value ? box.value + ' ' : '') + t; };
      rec.onerror = (e) => toast(e.error === 'not-allowed' ? 'Micro refusé par le navigateur.' : 'Dictée impossible (' + e.error + ').');
      rec.onend = () => { btn.textContent = '🎤'; btn.disabled = false; };
      rec.start();
    } catch (e) { toast('Dictée non disponible ici.'); }
  }

  /* ---------- Einstellungen: KI ---------- */
  function aiSettingsCard() {
    const c = aiConf(); const cache = aiCache();
    const models = c.models || [];
    return `<div class="card" id="aiBox"><h2>✨ Intelligence artificielle (Gemini)</h2>
      <p class="small muted">Nécessaire pour : compréhension écrite, exercices IA, dialogue. La clé reste uniquement sur cet appareil (pas dans la sauvegarde).</p>
      <div class="field"><label class="small">Clé API Gemini</label>
        <input id="aiKey" type="password" autocomplete="off" class="input" placeholder="AIza…" value="${c.key ? '••••••••••••' : ''}">
        <div class="btnrow" style="margin-top:6px"><button class="btn small primary" data-act="aiSaveKey">Enregistrer et tester</button>${c.key ? '<button class="btn small" data-act="aiDelKey">Supprimer la clé</button>' : ''}</div></div>
      ${models.length ? `<div class="field"><label class="small">Modèle</label><select id="aiModel" class="input">${models.map((m) => `<option value="${esc(m.id)}" ${m.id === c.model ? 'selected' : ''}>${esc(m.label)} (${esc(m.id)})</option>`).join('')}</select>
        <p class="small muted">Si la limite gratuite est atteinte, l’app essaie automatiquement un autre modèle.</p></div>` : ''}
      ${c.key ? `<button class="btn small" data-act="aiPrepare">📦 Préparer pour hors ligne</button> <span class="small muted">${cache.reading.length} textes · ${cache.gaps.length} séries</span>` : ''}
      <details class="small muted" style="margin-top:10px"><summary>Schlüssel holen (Anleitung)</summary>
        <p>1. <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">aistudio.google.com/apikey</a> öffnen (aistudio.google.com/apikey) und mit deinem Google-Konto anmelden.<br>2. «API-Schlüssel erstellen» wählen, den Schlüssel kopieren.<br>3. Hier einfügen und «Enregistrer et tester» tippen.</p>
        <p>Gib in Dialogen keine echten persönlichen Daten ein.</p></details></div>`;
  }
  async function aiSaveKey() {
    const v = ($('#aiKey').value || '').trim();
    const c = aiConf();
    if (v && !/^•+$/.test(v)) c.key = v;
    if (!c.key) { toast('Colle d’abord ta clé.'); return; }
    aiSaveConf(c); toast('Test de la clé…');
    try {
      const models = await aiListModels();
      if (!models.length) throw aiErr(404, 'Aucun modèle compatible');
      c.models = models.slice(0, 12);
      if (!c.model || !models.find((m) => m.id === c.model)) c.model = models[0].id;
      c.fallbacks = models.filter((m) => m.id !== c.model).slice(0, 2).map((m) => m.id);
      aiSaveConf(c); toast('✓ Clé valide – modèle : ' + c.model);
    } catch (e) { toast(aiErrorText(e)); }
    viewSettings();
  }
  function aiSetModel(id) {
    const c = aiConf(); c.model = id;
    c.fallbacks = (c.models || []).filter((m) => m.id !== id).slice(0, 2).map((m) => m.id);
    aiSaveConf(c); toast('Modèle : ' + id);
  }

  /* ---------- Routing ---------- */
  function goHome() {
    if (location.hash === '#home' || !location.hash) route(); else location.hash = '#home';
  }
  function route() {
    const h = (location.hash || '#home').slice(1);
    if (session && h !== 'run') { session = null; test = null; document.body.classList.remove('in-session'); }
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    document.querySelectorAll('[data-nav]').forEach((a) => a.classList.toggle('on', a.dataset.nav === h || (h === 'home' && a.dataset.nav === 'home')));
    const cfg = MINUTES[state.settings.minutes];
    switch (h) {
      case 'progres': viewProgress(); break;
      case 'reglages': viewSettings(); break;
      case 'test': viewTestIntro(); break;
      case 'erreurs': viewErrors(); break;
      case 'mots': viewWords(); break;
      case 'lire': viewReading(); break;
      case 'ia-exercices': viewAiGaps(); break;
      case 'dialogue': viewDialog(); break;
      case 'vocab': startVocab(); break;
      case 'gaps': startMC(U('gaps'), gapItems(cfg.gaps + 2)); break;
      case 'quiz': startMC(U('quiz'), quizItems(cfg.quiz + 2)); break;
      default: viewHome();
    }
    renderTop();
    window.scrollTo(0, 0);
  }

  /* ---------- Aktionen ---------- */
  const actions = {
    go: (a) => { if (location.hash === '#' + a) route(); else location.hash = '#' + a; },
    pick: pickMC, nextMC,
    quit: () => { session = null; test = null; document.body.classList.remove('in-session'); goHome(); },
    goHome: () => goHome(),
    reveal: () => { session.shown = true; renderCard(); const w = session.queue[session.i].w; if (session.queue[session.i].dir === 'de') speak(w.fr.replace(/\s*\((m|f)\)/, '')); },
    rate: rateCard,
    speak: (id) => speak(speakText[id]), speakSlow: (id) => speak(speakText[id], true),
    toggleDe: (_, el) => el.closest('.expl').classList.toggle('show-de'),
    mission: (i) => runMission(i),
    testStart, errStart, testSkip, toggleAudio,
    set: (arg) => {
      const [k, v] = arg.split('=');
      if (k === 'lang') { if (packs[v]) state.lang = v; }
      else state.settings[k] = k === 'minutes' ? Number(v) : k === 'rate' ? Number(v) : v;
      save(); applyTheme(); if (k === 'lang') pickVoice(); viewSettings(); renderTop();
    },
    testVoice: () => speak('Bonjour ! On apprend le français ensemble ?'),
    exportCopy: () => { const t = JSON.stringify(state); if (navigator.clipboard) navigator.clipboard.writeText(t).then(() => toast('Copié ✓ – colle-le dans une note ou un e-mail.'), () => { $('#importBox').value = t; toast('Copie impossible : texte affiché ci-dessous.'); }); else { $('#importBox').value = t; } },
    exportFile: () => { try { const b = new Blob([JSON.stringify(state, null, 1)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'lingua-sauvegarde-' + today() + '.json'; document.body.appendChild(a); a.click(); a.remove(); } catch (e) { toast('Téléchargement impossible ici – utilise « Copier ».'); } },
    importText: () => importData($('#importBox').value),
    reset: () => { $('#resetBox').innerHTML = `<p class="small">Supprimer toute la progression ?</p><div class="btnrow"><button class="btn small" data-act="resetNo">Annuler</button><button class="btn small primary" data-act="resetYes">Oui, tout supprimer</button></div>`; },
    resetNo: () => { $('#resetBox').innerHTML = ''; },
    resetYes: () => { state = defaultState(); save(); applyTheme(); toast('Réinitialisé.'); location.hash = '#home'; route(); },
    rTopic: (k) => { ui.rTopic = k; viewReading(); }, rType: (k) => { ui.rType = k; viewReading(); }, gFocus: (k) => { ui.gFocus = k; viewAiGaps(); },
    readGen, readCached, readQuestions, gapGen, gapCached, chatStart, chatSend, chatEnd, dictate, aiSaveKey, aiPrepare,
    chatHint: () => { session.showHint = true; renderChat(); },
    chatRetry: () => { const s = session; s.error = ''; const last = s.msgs[s.msgs.length - 1]; chatTurn(last && last.role === 'me' ? last.text : '[START]'); },
    addWord: (id, el) => { const w = pendingWords[id]; if (w && addCustomWord(w.fr, w.de, w.ex)) { el.disabled = true; el.textContent = '✓ Ajouté'; } },
    aiDelKey: () => { try { localStorage.removeItem(AI_KEY); } catch (e) { /* */ } toast('Clé supprimée.'); viewSettings(); },
    applyUpdate: () => { if (waitingSW) waitingSW.postMessage('SKIP_WAITING'); else location.reload(); }
  };
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]'); if (!el) return;
    const fn = actions[el.dataset.act]; if (fn) { e.preventDefault(); fn(el.dataset.arg, el); }
  });

  let toastT = null;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2600); }
  function applyTheme() { document.documentElement.dataset.theme = state.settings.theme; }

  /* ---------- Offline (Service Worker) ---------- */
  let waitingSW = null;
  function registerSW() {
    if (!('serviceWorker' in navigator) || !/^https:|^http:\/\/localhost/.test(location.href)) return;
    try {
      navigator.serviceWorker.register('sw.js').then((reg) => {
        const show = (w) => { waitingSW = w; $('#updateBar').hidden = false; };
        if (reg.waiting && navigator.serviceWorker.controller) show(reg.waiting);
        reg.addEventListener('updatefound', () => {
          const nw = reg.installing; if (!nw) return;
          nw.addEventListener('statechange', () => { if (nw.state === 'installed' && navigator.serviceWorker.controller) show(nw); });
        });
      }).catch(() => {});
      let reloaded = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => { if (!reloaded) { reloaded = true; location.reload(); } });
    } catch (e) { /* z. B. in einer Sandbox nicht erlaubt */ }
  }

  /* ---------- Start ---------- */
  applyTheme();
  window.addEventListener('hashchange', route);
  route();
  registerSW();
  window.__lingua = { get state() { return state; }, P, estimate, aiConf }; // für Tests/Debugging
})();
