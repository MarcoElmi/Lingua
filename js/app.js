/* Lingua – private Sprachlern-App (Vanilla JS, offline-fähig).
   Aufbau: Zustand (localStorage) · Sprachpakete (window.LINGUA_PACKS) · Ansichten (Hash-Routing) · Übungs-Engine */
(function () {
  'use strict';

  /* ---------- Konstanten & Hilfen ---------- */
  const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const SKILLS = ['vocab', 'grammar', 'reading', 'listening'];
  const STORE_KEY = 'lingua.state.v1';
  const APP_VERSION = '1.5.0';
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
    const type = missionSteps()[i][0];
    if (type === 'vocab') startVocab(i);
    else if (type === 'gaps') startMC(U('gaps'), gapItems(cfg.gaps), { missionStep: i });
    else if (type === 'quiz') startMC(U('quiz'), quizItems(cfg.quiz), { missionStep: i });
    else if (type === 'text') startText(null, i);
    else if (type === 'dialog') startGuided(null, { missionStep: i });
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
    ['📻', 'Radio'], ['📐', 'Grammaire'], ['✍️', 'Écriture'], ['📌', 'Phrases à retenir'], ['🗨️', 'Parler librement']
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
        <div class="steps">${missionSteps().map((st, k) => `<span class="${m.done[k] ? 'done' : ''}">${m.done[k] ? '✓' : st[1]} ${st[2]}</span>`).join('')}</div>
        ${doneN < 3 ? `<button class="btn primary block" data-act="mission" data-arg="${nextMissionStep()}">${doneN ? U('continue') : U('start')} : ${missionSteps()[nextMissionStep()][2]}</button>` : '<p><b>Mission accomplie pour aujourd’hui ✓</b></p>'}
      </div>
      <div class="card">
        <div class="row between"><span>${U('today')}</span><span class="small muted">${xpToday}/${g} XP</span></div>
        <div class="bar" style="margin-top:6px"><i style="width:${clamp(Math.round((xpToday / g) * 100), 0, 100)}%"></i></div>
        <div class="row between small muted" style="margin-top:8px"><span>🔥 ${currentStreak()} ${U('streak')}</span><span>Niveau joueur ${pl.lvl} · ${pl.rest}/${pl.need}</span></div>
      </div>
      ${stock().days <= 10 ? stockCard() : ''}
      <div class="section-title">Apprendre</div>
      <div class="grid">
        <button class="tile" data-act="go" data-arg="vocab"><span class="ic">🗂️</span><b>${U('vocab')} ${due ? `<span class="badge-n">${due}</span>` : ''}</b><small>${U('vocabSub')}</small></button>
        <button class="tile" data-act="go" data-arg="lire"><span class="ic">📖</span><b>Compréhension</b><small>Texte du jour</small></button>
        <button class="tile" data-act="go" data-arg="dialogue"><span class="ic">💬</span><b>Dialogues</b><small>Situations guidées</small></button>
        <button class="tile" data-act="go" data-arg="telephone"><span class="ic">📞</span><b>Téléphone</b><small>Écouter sans texte</small></button>
        <button class="tile" data-act="go" data-arg="gaps"><span class="ic">✏️</span><b>${U('gaps')}</b><small>${U('gapsSub')}</small></button>
        <button class="tile" data-act="go" data-arg="quiz"><span class="ic">❓</span><b>${U('quiz')}</b><small>${U('quizSub')}</small></button>
      </div>
      <div class="section-title">S’entraîner</div>
      <div class="grid">
        <button class="tile" data-act="go" data-arg="shadowing"><span class="ic">🎙️</span><b>Shadowing</b><small>Répéter et s’enregistrer</small></button>
        <button class="tile" data-act="go" data-arg="nombres"><span class="ic">🔢</span><b>Nombres</b><small>Prix, heures, téléphone</small></button>
        <button class="tile" data-act="go" data-arg="conjugaison"><span class="ic">🔤</span><b>Conjugaison</b><small>52 verbes, 6 temps</small></button>
        <button class="tile" data-act="go" data-arg="dictee"><span class="ic">🎧</span><b>Dictée</b><small>Écouter et écrire</small></button>
        <button class="tile" data-act="go" data-arg="puzzle"><span class="ic">🧩</span><b>Phrases puzzle</b><small>Remettre en ordre</small></button>
        <button class="tile" data-act="go" data-arg="prononciation"><span class="ic">🗣️</span><b>Prononciation</b><small>Lire à voix haute</small></button>
        <button class="tile" data-act="go" data-arg="fauxamis"><span class="ic">🎭</span><b>Faux amis</b><small>Pièges FR–DE</small></button>
        <button class="tile" data-act="go" data-arg="suisse"><span class="ic">🇨🇭</span><b>Suisse romande</b><small>Helvétismes & culture</small></button>
        <button class="tile" data-act="go" data-arg="erreurs"><span class="ic">📒</span><b>${U('errors')} ${errN ? `<span class="badge-n">${errN}</span>` : ''}</b><small>${U('errorsSub')}</small></button>
      </div>
      <div class="section-title">Outils</div>
      <div class="grid">
        <button class="tile" data-act="go" data-arg="test"><span class="ic">🧭</span><b>${U('test')}</b><small>${U('testSub')}</small></button>
        <button class="tile" data-act="go" data-arg="mots"><span class="ic">📚</span><b>Mes mots</b><small>${wordsLearned()} appris</small></button>
        <button class="tile" data-act="go" data-arg="ia-exercices"><span class="ic">🧪</span><b>Exercices IA <span class="ai">✨</span></b><small>Avec clé Gemini</small></button>
      </div>
      ${stock().days > 10 ? stockCard() : ''}
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
     Monatspaket (ohne KI): Texte du jour, geführte Dialoge, Telefon,
     Diktat, Satzpuzzle, Aussprache, Faux amis, Suisse romande
     ====================================================================== */
  const PACK_NAME = 'Paquet 1 (décembre 2026)';
  function packTexts() { return pack().reading || []; }
  function packDialogs() { return pack().dialogues || []; }
  function doneMap(k) { const p = prof(); p[k] = p[k] || {}; return p[k]; }
  function nextByLevel(list, doneKey, skill, filter) {
    const done = doneMap(doneKey); const L = lvlIdx(prof().levels[skill]);
    const fresh = list.filter((x) => !done[x.id] && (!filter || filter(x)));
    for (const d of [0, -1, 1, -2, 2, -3, 3]) { const c = fresh.filter((x) => lvlIdx(x.l) === L + d); if (c.length) return c[0]; }
    return null;
  }
  const nextText = () => nextByLevel(packTexts(), 'readDone', 'reading');
  const nextDialog = (f) => nextByLevel(packDialogs(), 'dlgDone', 'vocab', f);
  function stock() {
    const tLeft = packTexts().filter((t) => !doneMap('readDone')[t.id]).length;
    const dLeft = packDialogs().filter((d) => !doneMap('dlgDone')[d.id]).length;
    return { tLeft, dLeft, days: tLeft + dLeft };
  }
  function stockCard() {
    const s = stock();
    if (s.days > 10) return `<p class="small muted center">📦 ${PACK_NAME} : encore env. ${s.days} jours de contenu (${s.tLeft} textes, ${s.dLeft} dialogues).</p>`;
    return `<div class="card warn"><b>📦 ${s.days ? 'Le paquet de contenu se termine bientôt' : 'Paquet de contenu terminé'}</b>
      <p class="small">${s.days ? `Encore env. ${s.days} jours (${s.tLeft} textes, ${s.dLeft} dialogues).` : 'Tous les textes et dialogues ont été faits. Les autres exercices continuent de fonctionner.'}</p>
      <p class="small muted">🇩🇪 Zeit für ein neues Inhaltspaket: Schreib Claude im Chat, dass du das nächste Paket brauchst.</p></div>`;
  }

  /* ---------- Mission mit wechselnden Schritten ---------- */
  function dayNum() { return Math.floor(new Date(today() + 'T12:00:00').getTime() / 864e5); }
  function missionSteps() {
    const odd = dayNum() % 2 === 1;
    const s = [['vocab', '🗂️', 'Vocabulaire'], odd ? ['quiz', '❓', 'Quiz'] : ['gaps', '✏️', 'Texte à trous']];
    const t = nextText(), d = nextDialog();
    if (odd ? d : !t && d) s.push(['dialog', '💬', 'Dialogue guidé']);
    else if (t) s.push(['text', '📖', 'Texte du jour']);
    else s.push(odd ? ['gaps', '✏️', 'Texte à trous'] : ['quiz', '❓', 'Quiz']);
    return s;
  }

  /* ---------- Texte du jour ---------- */
  function packReading(t) { return Object.assign({}, t, { level: t.l, pack: true }); }
  function startText(id, missionStep) {
    const t = packTexts().find((x) => x.id === id) || nextText();
    if (!t) { toast('Plus de texte disponible dans ce paquet.'); return; }
    showReading(packReading(t));
    session.missionStep = missionStep;
  }
  function viewReadingPack() {
    const t = nextText(); const done = doneMap('readDone');
    const read = packTexts().filter((x) => done[x.id]);
    return `<div class="card"><h1>📖 Compréhension écrite</h1>
        <p class="small muted">Un texte par jour, adapté à ton niveau (${prof().levels.reading}), avec des questions et le vocabulaire important.</p>
        ${t ? `<div class="passage"><span class="chip">${t.l} · ${esc(t.topic)}</span><h3 style="margin:6px 0 0">${esc(t.title)}</h3></div>
          <button class="btn primary block" data-act="textStart" data-arg="${t.id}">Lire le texte du jour</button>` : '<p>Tous les textes du paquet ont été lus. 🎉</p>'}
      </div>
      ${read.length ? `<div class="card"><details><summary><b>Textes déjà lus (${read.length})</b></summary><ul class="list">${read.map((x) => `<li class="small row between"><span>${x.l} · ${esc(x.title)}</span><button class="btn small ghost" data-act="textStart" data-arg="${x.id}">Relire</button></li>`).join('')}</ul></details></div>` : ''}
      ${stockCard()}`;
  }

  /* ---------- Geführte Dialoge (auch Telefon) ---------- */
  function dlgMode() { return state.settings.dlgMode || 'choice'; }
  function viewDialogPack(phone) {
    const done = doneMap('dlgDone');
    let list = packDialogs().slice();
    if (phone) list.sort((a, b) => (b.tel ? 1 : 0) - (a.tel ? 1 : 0));
    const rec = nextDialog(phone ? (x) => x.tel : null) || nextDialog();
    const L = lvlIdx(prof().levels.vocab);
    return `<div class="card"><h1>${phone ? '📞 Appel téléphonique' : '💬 Dialogues guidés'}</h1>
        <p class="small muted">${phone ? 'Ton interlocuteur parle, mais son texte est caché : écoute bien ! Réponds en choisissant, en écrivant ou en dictant.' : 'Des situations du quotidien, étape par étape, avec correction.'}</p>
        <div class="field"><label class="small">Ma réponse</label>${seg('dlgMode', [['choice', '👆 Choisir'], ['write', '✍️ Écrire']], dlgMode())}</div>
        ${phone && !audioOn() ? '<p class="small"><b>🔇 Le mode sans son est activé.</b> <button class="btn small" data-act="toggleAudio">Activer le son</button></p>' : ''}
        ${phone && audioOn() && !voice ? '<p class="small"><b>Aucune voix française installée</b> – voir Réglages › Voix.</p>' : ''}
      </div>
      <div class="grid">${list.map((d) => `<button class="tile ${rec && rec.id === d.id ? 'rec' : ''}" data-act="${phone ? 'phoneStart' : 'dlgStart'}" data-arg="${d.id}"><span class="ic">${d.ic}${done[d.id] ? ' ✓' : ''}</span><b>${esc(d.t)}</b><small>${d.l}${lvlIdx(d.l) > L ? ' · un peu difficile' : ''}${d.tel ? ' · 📞' : ''}${rec && rec.id === d.id ? ' · conseillé' : ''}</small></button>`).join('')}</div>
      ${phone ? '' : stockCard()}`;
  }
  function startGuided(id, opts) {
    const d = packDialogs().find((x) => x.id === id) || nextDialog();
    if (!d) { toast('Plus de dialogue disponible.'); return; }
    opts = opts || {}; if (!voice) pickVoice();
    if (opts.phone && (!audioOn() || !voice)) { toast(audioOn() ? 'Aucune voix française installée – voir Réglages.' : 'Active d’abord le son 🔊.'); return; }
    session = { kind: 'guided', d, i: 0, xp: 0, good: 0, hist: [], phase: 'ask', phone: !!opts.phone, missionStep: opts.missionStep, mode: dlgMode(), showText: false };
    document.body.classList.add('in-session');
    renderGuided(true);
  }
  function renderGuided(speakNow) {
    const s = session; const d = s.d; const st = d.steps[s.i]; const end = s.i >= d.steps.length;
    const pct = Math.round((s.i / d.steps.length) * 100);
    const partnerBubble = (text, cur) => s.phone && cur && !s.showText
      ? `<div class="msg ai">📞 <i>…</i> <button class="mini" data-act="speak" data-arg="${regSpeak(text)}">🔊 Réécouter</button> <button class="mini" data-act="dlgShowText">👁️ Texte</button></div>`
      : `<div class="msg ai">${esc(text)}${audioOn() ? ` <button class="mini" data-act="speak" data-arg="${regSpeak(text)}">🔊</button>` : ''}</div>`;
    let html = `<div class="ex-head"><button class="x" data-act="quit" aria-label="Quitter">✕</button><div class="bar"><i style="width:${pct}%"></i></div><span class="small muted">${Math.min(s.i + 1, d.steps.length)}/${d.steps.length}</span></div>
      <div class="card"><b>${d.ic} ${esc(d.t)}</b><p class="small muted" style="margin:4px 0 0">${esc(d.intro)}</p></div>
      <div class="chat" style="padding-bottom:20px">`;
    s.hist.forEach((h) => { html += `<div class="msg ai">${esc(h.p)}</div><div class="msg me">${esc(h.a)}</div>`; });
    if (end) {
      html += partnerBubble(d.end, false) + `</div><button class="btn primary block" data-act="dlgFinish">${U('finish')}</button>`;
      $('#app').innerHTML = html; if (speakNow) speak(d.end, false, true); window.scrollTo(0, document.body.scrollHeight); return;
    }
    html += partnerBubble(st.p, true) + '</div>';
    if (s.phase === 'ask') {
      if (s.mode === 'choice') {
        if (!st.sh) st.sh = shuffle(st.o);
        html += `<div class="opts">${st.sh.map((o, k) => `<button class="opt" data-act="dlgPick" data-arg="${k}">${esc(o)}</button>`).join('')}</div>`;
      } else {
        html += `<textarea id="chatInput" class="input" rows="3" placeholder="Ta réponse en français…"></textarea>
          <div class="btnrow" style="margin-top:8px">${SR && audioOn() ? '<button class="btn small" data-act="dictate">🎤</button>' : ''}<button class="btn primary" data-act="dlgWrite">Valider</button></div>`;
      }
    } else {
      const ok = s.last === 'ok';
      html += `<div class="feedback ${s.mode === 'write' ? '' : ok ? 'ok' : 'ko'}" style="${s.mode === 'write' ? 'background:var(--accent-soft)' : ''}">
          ${s.mode === 'write' ? `<div class="small muted">Ta réponse : ${esc(s.mine)}</div><div class="title" style="margin-top:6px">Réponse modèle :</div>` : `<div class="title">${ok ? '✓ ' + U('correct') : '✗ Meilleure réponse :'}</div>`}
          <div><b>${esc(st.a)}</b></div>${audioBtns(st.a)}${explainHtml({ fr: st.fr, de: st.de })}</div>
        ${s.mode === 'write' && !s.rated ? `<p class="small" style="margin:10px 0 4px">Ta réponse était…</p><div class="btnrow"><button class="btn small" data-act="dlgRate" data-arg="2">✓ juste</button><button class="btn small" data-act="dlgRate" data-arg="1">≈ presque</button><button class="btn small" data-act="dlgRate" data-arg="0">✗ différente</button></div>`
          : `<button class="btn primary block" style="margin-top:12px" data-act="dlgNext">${U('continue')}</button>`}`;
    }
    $('#app').innerHTML = html;
    if (speakNow) speak(st.p, false, true);
    window.scrollTo(0, document.body.scrollHeight);
  }
  function dlgPick(k) {
    const s = session; const st = s.d.steps[s.i]; const ok = st.sh[Number(k)] === st.a;
    s.last = ok ? 'ok' : 'ko'; s.phase = 'feedback';
    if (ok) { s.good++; s.xp += 5; } else s.xp += 1;
    renderGuided(false);
  }
  function dlgWrite() {
    const s = session; const v = ($('#chatInput').value || '').trim();
    if (!v) { toast('Écris d’abord ta réponse.'); return; }
    s.mine = v; s.phase = 'feedback'; s.rated = false; renderGuided(false);
  }
  function dlgRate(r) { const s = session; r = Number(r); s.rated = true; if (r === 2) s.good++; s.xp += [1, 3, 5][r]; renderGuided(false); }
  function dlgNext() {
    const s = session; const st = s.d.steps[s.i];
    s.hist.push({ p: st.p, a: st.a }); s.i++; s.phase = 'ask'; s.showText = false; renderGuided(true);
  }
  function dlgFinish() {
    const s = session; doneMap('dlgDone')[s.d.id] = today(); save();
    finishSession(s.good, s.d.steps.length, s.xp + 5, s.missionStep);
  }

  /* ---------- Satz-Sammlung für Diktat, Puzzle, Aussprache ---------- */
  function sentencePool(minW, maxW) {
    const pr = prof(); const out = [];
    const near = (l, skill) => Math.abs(lvlIdx(l) - lvlIdx(pr.levels[skill])) <= 1;
    P().gaps.forEach((g) => { if (near(g.l, 'grammar')) out.push({ id: g.id, l: g.l, s: g.s.replace('___', g.a) }); });
    P().vocab.forEach((w) => { if (w.ex && near(w.l, 'vocab')) out.push({ id: w.id, l: w.l, s: w.ex }); });
    packTexts().forEach((t) => { if (near(t.l, 'reading')) t.text.split(/\n+/).forEach((para, pi) => para.split(/(?<=[.!?])\s+/).forEach((x, i) => out.push({ id: t.id + '.' + pi + '.' + i, l: t.l, s: x.trim() }))); });
    return out.filter((x) => { const n = x.s.split(/\s+/).length; return n >= minW && n <= maxW && !/[«»"…—\/()\d:;]/.test(x.s) && !/→|\[/.test(x.s); });
  }
  function pickSentences(n, minW, maxW) {
    const pool = sentencePool(minW, maxW);
    return pickItems(pool, 'reading', n, 'sent:');
  }
  const normTxt = (s) => s.toLowerCase().replace(/[’`´ʼ]/g, '\'').replace(/['](?=\S)/g, '\' ').replace(/[-–—]/g, ' ').replace(/[.,!?;:«»"()…]/g, ' ').replace(/\s+/g, ' ').trim();
  const stripAcc = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  function lcsPairs(a, b, eq) {
    const n = a.length, m = b.length; const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = eq(a[i], b[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    const pairs = []; let i = 0, j = 0;
    while (i < n && j < m) { if (eq(a[i], b[j])) { pairs.push([i, j]); i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++; }
    return pairs;
  }
  function needAudio(title) {
    if (!voice) pickVoice();
    if (!audioOn()) return `<div class="card"><h2>${title}</h2><p>Ce module a besoin du son.</p><button class="btn primary" data-act="toggleAudio">🔊 Activer le son</button></div>`;
    if (!voice) return `<div class="card"><h2>${title}</h2><p>Aucune voix française n’est installée sur cet appareil.</p><a class="btn" href="#reglages">Réglages › Voix</a></div>`;
    return '';
  }

  /* ---------- Diktat ---------- */
  function startDictee() {
    const block = needAudio('🎧 Dictée'); if (block) { $('#app').innerHTML = block; return; }
    const n = { 5: 4, 10: 6, 15: 8 }[state.settings.minutes];
    const items = pickSentences(n, 4, 13);
    if (!items.length) { toast('Pas de phrases disponibles.'); return; }
    session = { kind: 'dictee', items, i: 0, xp: 0, good: 0, phase: 'ask' };
    document.body.classList.add('in-session'); renderDictee(true);
  }
  function renderDictee(play) {
    const s = session; const it = s.items[s.i]; const pct = Math.round((s.i / s.items.length) * 100);
    let html = `<div class="ex-head"><button class="x" data-act="quit" aria-label="Quitter">✕</button><div class="bar"><i style="width:${pct}%"></i></div><span class="small muted">${s.i + 1}/${s.items.length}</span></div>
      <div class="card"><span class="chip">${it.l} · dictée</span><p class="small muted" style="margin-top:8px">Écoute et écris la phrase (avec les accents).</p>${audioBtns(it.s)}`;
    if (s.phase === 'ask') {
      html += `<textarea id="dictInput" class="input" rows="3" autocapitalize="sentences" spellcheck="false" placeholder="Écris ce que tu entends…"></textarea>
        <button class="btn primary block" style="margin-top:10px" data-act="dictCheck">Vérifier</button></div>`;
    } else {
      const r = s.res;
      html += `<div class="feedback ${r.state === 'ok' ? 'ok' : r.state === 'acc' ? '' : 'ko'}" style="${r.state === 'acc' ? 'background:var(--accent-soft)' : ''}">
          <div class="title">${r.state === 'ok' ? '✓ Parfait !' : r.state === 'acc' ? '≈ Presque – attention aux accents' : '✗ Pas tout à fait'}</div>
          <div class="small muted">Ta version : ${esc(s.mine)}</div>
          <div class="diff" style="margin-top:6px">${r.marks.map(([w, c]) => `<span class="mk-${c}">${esc(w)}</span>`).join(' ')}</div>
          <div class="small" style="margin-top:6px">Phrase : <b>${esc(it.s)}</b></div>
        </div><button class="btn primary block" style="margin-top:12px" data-act="dictNext">${s.i + 1 < s.items.length ? U('continue') : U('finish')}</button></div>`;
    }
    $('#app').innerHTML = html;
    if (play) setTimeout(() => speak(it.s, true, true), 300);
  }
  function dictCheck() {
    const s = session; const it = s.items[s.i]; const mine = ($('#dictInput').value || '').trim();
    if (!mine) { toast('Écris d’abord la phrase.'); return; }
    const T = normTxt(it.s).split(' '); const M = normTxt(mine).split(' ').filter(Boolean);
    const pairs = lcsPairs(T, M, (a, b) => stripAcc(a) === stripAcc(b));
    const marks = T.map((w) => [w, 'miss']); let acc = false;
    pairs.forEach(([i, j]) => { if (T[i] === M[j]) marks[i][1] = 'ok'; else { marks[i][1] = 'acc'; acc = true; } });
    const allMatched = pairs.length === T.length && M.length === T.length;
    const state_ = allMatched ? (acc ? 'acc' : 'ok') : 'ko';
    s.res = { state: state_, marks }; s.mine = mine; s.phase = 'fb';
    if (state_ === 'ok') { s.good++; s.xp += 6; } else if (state_ === 'acc') s.xp += 3; else s.xp += 1;
    prof().seen['sent:' + it.id] = today(); save();
    renderDictee(false);
  }
  function dictNext() { const s = session; s.i++; s.phase = 'ask'; if (s.i < s.items.length) renderDictee(true); else finishSession(s.good, s.items.length, s.xp); }

  /* ---------- Satzpuzzle ---------- */
  function startPuzzle() {
    const n = { 5: 4, 10: 6, 15: 8 }[state.settings.minutes];
    const items = pickSentences(n, 5, 12).map((x) => {
      const m = x.s.match(/^(.*?)\s*([.!?])?$/); const words = m[1].split(/\s+/);
      let sh = shuffle(words.map((w, i) => i)); let tries = 0;
      while (sh.every((v, i) => v === i) && tries++ < 5) sh = shuffle(sh);
      return Object.assign({}, x, { words, end: m[2] || '', sh, picked: [] });
    });
    if (!items.length) { toast('Pas de phrases disponibles.'); return; }
    session = { kind: 'puzzle', items, i: 0, xp: 0, good: 0, phase: 'ask' };
    document.body.classList.add('in-session'); renderPuzzle();
  }
  function renderPuzzle() {
    const s = session; const it = s.items[s.i]; const pct = Math.round((s.i / s.items.length) * 100);
    const used = new Set(it.picked);
    let html = `<div class="ex-head"><button class="x" data-act="quit" aria-label="Quitter">✕</button><div class="bar"><i style="width:${pct}%"></i></div><span class="small muted">${s.i + 1}/${s.items.length}</span></div>
      <div class="card"><span class="chip">${it.l} · phrase puzzle</span><p class="small muted" style="margin-top:8px">Remets les mots dans le bon ordre.</p>
      <div class="pz-answer">${it.picked.map((wi, k) => `<button class="pz on" data-act="pzBack" data-arg="${k}" ${s.phase !== 'ask' ? 'disabled' : ''}>${esc(it.words[wi])}</button>`).join('') || '<span class="muted small">…</span>'}<span class="pz-end">${esc(it.end)}</span></div>
      <div class="pz-bank">${it.sh.map((wi) => used.has(wi) ? '' : `<button class="pz" data-act="pzAdd" data-arg="${wi}">${esc(it.words[wi])}</button>`).join('')}</div>`;
    if (s.phase === 'ask') html += `<button class="btn primary block" style="margin-top:12px" data-act="pzCheck" ${it.picked.length === it.words.length ? '' : 'disabled'}>Vérifier</button></div>`;
    else html += `<div class="feedback ${s.ok ? 'ok' : 'ko'}"><div class="title">${s.ok ? '✓ ' + U('correct') : '✗ ' + U('wrong')}</div>${s.ok ? '' : `<div>${esc(it.s)}</div>`}${audioBtns(it.s)}</div>
      <button class="btn primary block" style="margin-top:12px" data-act="pzNext">${s.i + 1 < s.items.length ? U('continue') : U('finish')}</button></div>`;
    $('#app').innerHTML = html;
  }
  function pzAdd(wi) { const it = session.items[session.i]; it.picked.push(Number(wi)); renderPuzzle(); }
  function pzBack(k) { const it = session.items[session.i]; it.picked.splice(Number(k), 1); renderPuzzle(); }
  function pzCheck() {
    const s = session; const it = s.items[s.i];
    s.ok = it.picked.map((wi) => it.words[wi]).join(' ') === it.words.join(' ');
    if (s.ok) { s.good++; s.xp += 5; } else s.xp += 1;
    prof().seen['sent:' + it.id] = today(); save();
    s.phase = 'fb'; renderPuzzle();
  }
  function pzNext() { const s = session; s.i++; s.phase = 'ask'; if (s.i < s.items.length) renderPuzzle(); else finishSession(s.good, s.items.length, s.xp); }

  /* ---------- Aussprache ---------- */
  function startPron() {
    if (!SR) { $('#app').innerHTML = `<div class="card"><h2>🗣️ Prononciation</h2><p>Ce navigateur ne propose pas la reconnaissance vocale.</p><p class="small muted">🇩🇪 Öffne die App in <b>Chrome</b>, dort funktioniert die Spracherkennung. Samsung Internet unterstützt sie teilweise nicht.</p></div>`; return; }
    const block = needAudio('🗣️ Prononciation'); if (block) { $('#app').innerHTML = block; return; }
    const n = { 5: 4, 10: 6, 15: 8 }[state.settings.minutes];
    const items = pickSentences(n, 3, 10);
    session = { kind: 'pron', items, i: 0, xp: 0, good: 0, best: 0, res: null, listening: false };
    document.body.classList.add('in-session'); renderPron();
  }
  function renderPron() {
    const s = session; const it = s.items[s.i]; const pct = Math.round((s.i / s.items.length) * 100); const r = s.res;
    $('#app').innerHTML = `<div class="ex-head"><button class="x" data-act="quit" aria-label="Quitter">✕</button><div class="bar"><i style="width:${pct}%"></i></div><span class="small muted">${s.i + 1}/${s.items.length}</span></div>
      <div class="card center"><span class="chip">${it.l} · prononciation</span>
        <p class="prompt" style="margin-top:12px">${esc(it.s)}</p>
        ${audioBtns(it.s)}
        <button class="btn primary block mic ${s.listening ? 'rec' : ''}" data-act="pronSpeak" ${s.listening ? 'disabled' : ''}>${s.listening ? '⏺️ J’écoute…' : '🎤 Lire à voix haute'}</button>
        ${r ? `<div class="feedback ${r.score >= 0.9 ? 'ok' : r.score >= 0.7 ? '' : 'ko'}" style="${r.score >= 0.7 && r.score < 0.9 ? 'background:var(--accent-soft)' : ''}">
          <div class="title">${r.score >= 0.9 ? '✓ Excellent !' : r.score >= 0.7 ? '≈ Bien, encore un effort' : '✗ Essaie encore'} (${Math.round(r.score * 100)} %)</div>
          <div class="small muted">Compris : « ${esc(r.heard)} »</div>
          ${r.score < 1 ? `<div class="diff small" style="margin-top:6px">${r.marks.map(([w, c]) => `<span class="mk-${c}">${esc(w)}</span>`).join(' ')}</div>` : ''}</div>` : ''}
        <div class="btnrow" style="margin-top:12px"><button class="btn" data-act="pronNext">${s.i + 1 < s.items.length ? 'Phrase suivante' : U('finish')}</button></div>
      </div>`;
  }
  function pronSpeak() {
    const s = session; const it = s.items[s.i];
    try {
      const rec = new SR(); rec.lang = 'fr-FR'; rec.interimResults = false; rec.maxAlternatives = 3;
      s.listening = true; renderPron();
      rec.onresult = (e) => {
        const T = normTxt(it.s).split(' ');
        let best = null;
        for (let k = 0; k < e.results[0].length; k++) {
          const heard = e.results[0][k].transcript; const H = normTxt(heard).split(' ').filter(Boolean);
          const pairs = lcsPairs(T, H, (a, b) => stripAcc(a) === stripAcc(b));
          const score = pairs.length / Math.max(T.length, H.length);
          if (!best || score > best.score) { const marks = T.map((w) => [w, 'miss']); pairs.forEach(([i]) => (marks[i][1] = 'ok')); best = { score, heard, marks }; }
        }
        s.res = best;
        const pts = best.score >= 0.9 ? 5 : best.score >= 0.7 ? 3 : 1;
        if (pts > (s.bestPts || 0)) { s.xp += pts - (s.bestPts || 0); s.bestPts = pts; }
        s.best = Math.max(s.best, best.score);
      };
      rec.onerror = (e) => toast(e.error === 'not-allowed' ? 'Micro refusé par le navigateur.' : e.error === 'no-speech' ? 'Je n’ai rien entendu.' : 'Reconnaissance impossible (' + e.error + ').');
      rec.onend = () => { s.listening = false; if (session === s) renderPron(); };
      rec.start();
    } catch (e) { s.listening = false; toast('Reconnaissance vocale non disponible ici.'); }
  }
  function pronNext() {
    const s = session; if (s.best >= 0.9) s.good++;
    prof().seen['sent:' + s.items[s.i].id] = today(); save();
    s.i++; s.res = null; s.best = 0; s.bestPts = 0;
    if (s.i < s.items.length) renderPron(); else finishSession(s.good, s.items.length, s.xp);
  }

  /* ---------- Faux amis & Suisse romande ---------- */
  const SUISSE_RX = /Suisse|romand|Romand|Fribourg|Gruyère|Bénichon|Léman|Sarine|Röstigraben|septante|nonante|huitante|natel|bancomat|votation|panosse|cornet|syndic|pendulaire|Confédéré|tournus|piquet|régie|course d’école/;
  function startFauxAmis() {
    const items = pickItems(P().quiz.filter((q) => /Faux ami/.test(q.q)), 'vocab', 8, 'quiz:')
      .map((q) => ({ key: 'quiz:' + q.id, chip: q.l + ' · faux amis', prompt: esc(q.q), options: q.o, answer: q.a, explain: { fr: q.fr, de: q.de } }));
    startMC('Faux amis', items, {});
  }
  function startSuisse() {
    const qs = pickItems(P().quiz.filter((q) => SUISSE_RX.test(q.q)), 'vocab', 5, 'quiz:')
      .map((q) => ({ key: 'quiz:' + q.id, chip: q.l + ' · Suisse romande', prompt: esc(q.q), options: q.o, answer: q.a, explain: { fr: q.fr, de: q.de } }));
    const ws = pickItems(P().vocab.filter((w) => w.th === 'suisse'), 'vocab', 3, 'vocab:').map(vocabMC);
    startMC('Suisse romande', shuffle(qs.concat(ws)), {});
  }

  /* ======================================================================
     v1.5 – Konjugation, Zahlen, Shadowing
     ====================================================================== */
  const ACCENTS = ['é', 'è', 'ê', 'à', 'â', 'ç', 'î', 'ô', 'û', 'ù', 'ë', 'ï', 'œ'];
  function accentBar(target) {
    return `<div class="accents">${ACCENTS.map((c) => `<button class="pz" data-act="accent" data-arg="${target}|${c}">${c}</button>`).join('')}</div>`;
  }
  function insertAccent(arg) {
    const [id, c] = arg.split('|'); const el = document.getElementById(id); if (!el) return;
    const a = el.selectionStart || el.value.length, b = el.selectionEnd || el.value.length;
    el.value = el.value.slice(0, a) + c + el.value.slice(b); el.focus(); el.setSelectionRange(a + 1, a + 1);
  }
  const normAns = (s) => s.toLowerCase().replace(/[’`´ʼ]/g, '\'').replace(/\s+/g, ' ').trim();
  const joinPron = (p, f) => (/’$/.test(p) ? p + f : p + ' ' + f);

  /* ---------- Konjugation ---------- */
  function conj() { return pack().conj; }
  function conjTenses() { const L = Math.max(lvlIdx(prof().levels.grammar), lvlIdx('A2')); return conj().tenses.filter((t) => lvlIdx(t.l) <= L + 1); }
  function conjBox(k) { const p = prof(); p.conj = p.conj || {}; return p.conj[k] || 0; }
  function viewConj() {
    if (!conj()) { $('#app').innerHTML = '<div class="card">Pas encore disponible pour cette langue.</div>'; return; }
    const ts = conjTenses(); ui.cTense = ui.cTense || 'auto';
    const vs = conj().verbs; ui.cVerb = ui.cVerb || 'aller';
    const v = vs.find((x) => x.inf === ui.cVerb) || vs[0];
    $('#app').innerHTML = `<div class="card"><h1>🔤 Conjugaison</h1>
        <p class="small muted">${vs.length} verbes fréquents. Les formes difficiles reviennent plus souvent.</p>
        <div class="field"><label class="small">Temps</label><div class="chips">
          <button class="chipbtn ${ui.cTense === 'auto' ? 'on' : ''}" data-act="cTense" data-arg="auto">🎲 Mélange</button>
          ${ts.map((t) => `<button class="chipbtn ${ui.cTense === t.id ? 'on' : ''}" data-act="cTense" data-arg="${t.id}">${t.name}</button>`).join('')}</div></div>
        <button class="btn primary block" data-act="conjStart">S’entraîner (10 formes)</button></div>
      <div class="card"><h2>📋 Tableaux</h2>
        <select id="cVerb" class="input">${vs.map((x) => `<option value="${esc(x.inf)}" ${x.inf === v.inf ? 'selected' : ''}>${esc(x.inf)} – ${esc(x.de)}</option>`).join('')}</select>
        <div class="ctables">${conj().tenses.map((t) => `<div class="ctab"><b>${t.name}</b>${conj().conjugate(v, t.id).map((x) => `<div>${esc(joinPron(x.pron, x.form))}</div>`).join('')}</div>`).join('')}</div>
        ${v.aux === 'être' ? '<p class="small muted">Passé composé avec « être » : le participe s’accorde avec le sujet.</p>' : ''}</div>`;
    const sel = $('#cVerb'); if (sel) sel.addEventListener('change', () => { ui.cVerb = sel.value; viewConj(); });
  }
  function conjStart() {
    const L = Math.max(lvlIdx(prof().levels.grammar), lvlIdx('A2'));
    const tenses = ui.cTense === 'auto' ? conjTenses() : conj().tenses.filter((t) => t.id === ui.cTense);
    const verbs = conj().verbs.filter((v) => lvlIdx(v.l) <= L + 1);
    const cands = [];
    verbs.forEach((v) => tenses.forEach((t) => cands.push({ v, t, id: v.inf + '|' + t.id, l: v.l })));
    const picked = weightedSample(cands, (c) => (6 - conjBox(c.id)) * (lvlIdx(c.l) <= L ? 2 : 1), 10);
    const items = picked.map((c) => { const i = Math.floor(Math.random() * 6); const f = conj().conjugate(c.v, c.t.id)[i]; return Object.assign({}, c, { i, f }); });
    session = { kind: 'conj', items, k: 0, xp: 0, good: 0, phase: 'ask' };
    document.body.classList.add('in-session'); renderConj();
  }
  function renderConj() {
    const s = session; const it = s.items[s.k]; const pct = Math.round((s.k / s.items.length) * 100);
    let html = `<div class="ex-head"><button class="x" data-act="quit" aria-label="Quitter">✕</button><div class="bar"><i style="width:${pct}%"></i></div><span class="small muted">${s.k + 1}/${s.items.length}</span></div>
      <div class="card"><span class="chip">${it.t.name}</span>
        <div class="prompt" style="margin-top:10px">${esc(it.v.inf)} <span class="small muted">(${esc(it.v.de)})</span></div>
        <div class="conj-row"><span class="pron">${esc(it.f.pron)}</span>
          <input id="conjInput" class="input" autocomplete="off" autocapitalize="off" spellcheck="false" ${s.phase !== 'ask' ? 'disabled' : ''} value="${s.phase !== 'ask' ? esc(s.mine) : ''}" placeholder="…"></div>
        ${s.phase === 'ask' ? accentBar('conjInput') + `<button class="btn primary block" style="margin-top:10px" data-act="conjCheck">Vérifier</button>` : ''}`;
    if (s.phase !== 'ask') {
      const ok = s.res === 'ok';
      html += `<div class="feedback ${ok ? 'ok' : s.res === 'acc' ? '' : 'ko'}" style="${s.res === 'acc' ? 'background:var(--accent-soft)' : ''}">
          <div class="title">${ok ? '✓ ' + U('correct') : s.res === 'acc' ? '≈ Presque : attention aux accents' : '✗ ' + U('wrong')}</div>
          <div><b>${esc(joinPron(it.f.pron, it.f.form))}</b></div>${audioBtns(joinPron(it.f.pron, it.f.form).replace(/\(e\)|\(s\)/g, ''))}
          <details class="small"><summary>Tout le ${esc(it.t.name)}</summary>${conj().conjugate(it.v, it.t.id).map((x) => `<div>${esc(joinPron(x.pron, x.form))}</div>`).join('')}</details></div>
        <button class="btn primary block" style="margin-top:12px" data-act="conjNext">${s.k + 1 < s.items.length ? U('continue') : U('finish')}</button>`;
    }
    $('#app').innerHTML = html + '</div>';
    const inp = $('#conjInput');
    if (inp && s.phase === 'ask') { inp.focus(); inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); conjCheck(); } }); }
  }
  function conjCheck() {
    const s = session; const it = s.items[s.k];
    let mine = normAns($('#conjInput').value || '');
    if (!mine) { toast('Écris d’abord la forme.'); return; }
    mine = mine.replace(/^(que |qu'|qu’)/, '').replace(/^(je |j'|tu |il |elle |on |nous |vous |ils |elles )/, '');
    const acc = it.f.accept.map(normAns);
    s.res = acc.includes(mine) ? 'ok' : acc.some((a) => stripAcc(a) === stripAcc(mine)) ? 'acc' : 'ko';
    s.mine = mine;
    const p = prof(); p.conj = p.conj || {};
    if (s.res === 'ok') { s.good++; s.xp += 4; p.conj[it.id] = Math.min(5, conjBox(it.id) + 1); }
    else { s.xp += 1; p.conj[it.id] = 0; }
    save(); s.phase = 'fb'; renderConj();
  }
  function conjNext() { const s = session; s.k++; s.phase = 'ask'; if (s.k < s.items.length) renderConj(); else finishSession(s.good, s.items.length, s.xp); }

  /* ---------- Zahlen ---------- */
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  function numItem(type, variant) {
    const N = pack().numbers; const w = (n) => N.words(n, variant); const L = lvlIdx(prof().levels.listening);
    const pad2 = (n) => String(n).padStart(2, '0');
    if (type === 'num') { const n = L <= 1 ? (Math.random() < 0.6 ? rnd(60, 99) : rnd(11, 59)) : L === 2 ? (Math.random() < 0.5 ? rnd(60, 99) : rnd(100, 999)) : rnd(100, 99999); return { label: 'Nombre', say: w(n), ans: String(n), check: 'digits' }; }
    if (type === 'year') { const n = rnd(1950, 2035); return { label: 'Année', say: 'en ' + w(n), ans: String(n), check: 'digits' }; }
    if (type === 'price') { const f = rnd(1, L <= 1 ? 99 : 450), c = rnd(0, 19) * 5; return { label: 'Prix (CHF)', say: (f === 1 ? 'un franc' : w(f) + ' francs') + (c ? ' ' + w(c) : ''), ans: f + '.' + pad2(c), check: 'price' }; }
    if (type === 'phone') {
      const d = '07' + rnd(5, 9) + ' ' + rnd(100, 999) + ' ' + pad2(rnd(0, 99)) + ' ' + pad2(rnd(0, 99));
      const grp = d.split(' ').map((g) => (g[0] === '0' ? 'zéro ' + w(Number(g)) : w(Number(g))));
      return { label: 'Numéro de téléphone', say: grp.join(', '), ans: d, check: 'digits' };
    }
    if (type === 'time') { const h = rnd(1, 23), m = Math.random() < 0.3 ? rnd(0, 3) * 15 : rnd(0, 59); return { label: 'Heure', say: (h === 1 ? 'une heure' : w(h) + ' heures') + (m ? ' ' + w(m) : ''), ans: h + ':' + pad2(m), check: 'time' }; }
    if (type === 'date') {
      const mo = rnd(0, 11), d = rnd(1, 28); const fmt = (dd, mm) => pad2(dd) + '.' + pad2(mm + 1) + '.';
      const opts = [fmt(d, mo)]; const alts = [[(d + 9) % 28 + 1, mo], [d, (mo + 1) % 12], [d === 12 ? 2 : d === 13 ? 3 : d === 16 ? 6 : (d + 10) % 28 + 1, (mo + 11) % 12]];
      alts.forEach(([a, b]) => { const x = fmt(a, b); if (!opts.includes(x)) opts.push(x); });
      return { label: 'Date', say: 'le ' + (d === 1 ? 'premier' : w(d)) + ' ' + N.months[mo], ans: opts[0], options: opts, check: 'mc' };
    }
    // Lesen: richtige Schreibweise wählen
    const n = rnd(70, 99); const v = Math.random() < 0.5 ? 'ch' : 'fr'; const other = v === 'ch' ? 'fr' : 'ch';
    const opts = [N.words(n, v), N.words(n, other), N.words(n - 10 < 70 ? n + 10 : n - 10, v)].filter((x, i, a) => a.indexOf(x) === i);
    return { label: 'Lecture', q: `Comment dit-on <b>${n}</b> ${v === 'ch' ? 'en Suisse romande' : 'en France'} ?`, ans: opts[0], options: opts, check: 'mc', read: true, say: opts[0] };
  }
  function viewNumbers() {
    const block = needAudio('🔢 Nombres'); if (block) { $('#app').innerHTML = block; return; }
    ui.nVar = ui.nVar || 'mix';
    $('#app').innerHTML = `<div class="card"><h1>🔢 Nombres</h1>
      <p class="small muted">Téléphones, prix, heures, dates : écoute et écris en chiffres.</p>
      <div class="field"><label class="small">Variante</label>${['mix', 'ch', 'fr'].map((k) => `<button class="chipbtn ${ui.nVar === k ? 'on' : ''}" data-act="nVar" data-arg="${k}">${{ mix: '🎲 Les deux', ch: '🇨🇭 septante, huitante, nonante', fr: '🇫🇷 soixante-dix, quatre-vingts' }[k]}</button>`).join(' ')}</div>
      <button class="btn primary block" data-act="numStart">Commencer (10 exercices)</button></div>`;
  }
  function numStart() {
    const types = ['num', 'num', 'price', 'price', 'phone', 'time', 'time', 'date', 'year', 'read'];
    const items = shuffle(types).map((t) => { const v = ui.nVar === 'mix' ? (Math.random() < 0.5 ? 'ch' : 'fr') : ui.nVar; return Object.assign(numItem(t, v), { variant: v }); });
    session = { kind: 'num', items, k: 0, xp: 0, good: 0, phase: 'ask' };
    document.body.classList.add('in-session'); renderNum(true);
  }
  function renderNum(play) {
    const s = session; const it = s.items[s.k]; const pct = Math.round((s.k / s.items.length) * 100);
    let html = `<div class="ex-head"><button class="x" data-act="quit" aria-label="Quitter">✕</button><div class="bar"><i style="width:${pct}%"></i></div><span class="small muted">${s.k + 1}/${s.items.length}</span></div>
      <div class="card"><span class="chip">${it.label}</span>`;
    if (it.read) html += `<div class="prompt" style="margin-top:10px">${it.q}</div>`;
    else html += `<p class="small muted" style="margin-top:8px">Écoute et écris ${it.check === 'mc' ? '– choisis la bonne réponse' : 'en chiffres'}.</p>${audioBtns(it.say)}`;
    if (it.check === 'mc') {
      if (!it.sh) it.sh = shuffle(it.options);
      html += `<div class="opts">${it.sh.map((o, k) => `<button class="opt ${s.phase !== 'ask' ? (o === it.ans ? 'ok' : k === s.pick ? 'ko' : '') : ''}" data-act="numPick" data-arg="${k}" ${s.phase !== 'ask' ? 'disabled' : ''}>${esc(o)}</button>`).join('')}</div>`;
    } else if (s.phase === 'ask') {
      html += `<input id="numInput" class="input big-input" inputmode="decimal" autocomplete="off" placeholder="${it.check === 'time' ? '14:30' : it.check === 'price' ? '12.50' : '…'}">
        <button class="btn primary block" style="margin-top:10px" data-act="numCheck">Vérifier</button>`;
    }
    if (s.phase !== 'ask') {
      html += `<div class="feedback ${s.ok ? 'ok' : 'ko'}"><div class="title">${s.ok ? '✓ ' + U('correct') : '✗ Réponse : ' + esc(it.ans)}</div>
        ${s.mine ? `<div class="small muted">Ta réponse : ${esc(s.mine)}</div>` : ''}
        <div class="small">${it.read ? '' : 'On a dit : '}<i>${esc(it.say)}</i> ${it.variant === 'ch' ? '🇨🇭' : '🇫🇷'}</div>${it.read ? '' : ''}</div>
        <button class="btn primary block" style="margin-top:12px" data-act="numNext">${s.k + 1 < s.items.length ? U('continue') : U('finish')}</button>`;
    }
    $('#app').innerHTML = html + '</div>';
    const inp = $('#numInput'); if (inp) inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); numCheck(); } });
    if (play && !it.read) setTimeout(() => speak(it.say, false, true), 300);
  }
  function numCompare(it, v) {
    const digits = (x) => x.replace(/\D/g, '');
    if (it.check === 'digits') return digits(v) === digits(it.ans) && digits(v).length > 0;
    if (it.check === 'price') {
      const toC = (x) => { x = x.toLowerCase().replace(/chf|fr\.?|francs?/g, '').trim(); const m = x.match(/^(\d+)(?:\D+(\d{1,2}))?/); if (!m) return -1; let c = m[2] ? Number(m[2].length === 1 ? m[2] + '0' : m[2]) : 0; return Number(m[1]) * 100 + c; };
      return toC(v) === toC(it.ans);
    }
    if (it.check === 'time') {
      const tm = (x) => { const m = x.match(/(\d{1,2})\D*(\d{2})?/); return m ? Number(m[1]) * 60 + Number(m[2] || 0) : -1; };
      return tm(v) === tm(it.ans);
    }
    return false;
  }
  function numCheck() {
    const s = session; const it = s.items[s.k]; const v = ($('#numInput').value || '').trim();
    if (!v) { toast('Écris d’abord ta réponse.'); return; }
    s.mine = v; s.ok = numCompare(it, v); s.phase = 'fb';
    if (s.ok) { s.good++; s.xp += 4; } else s.xp += 1;
    renderNum(false);
  }
  function numPick(k) {
    const s = session; const it = s.items[s.k]; s.pick = Number(k); s.mine = ''; s.ok = it.sh[s.pick] === it.ans; s.phase = 'fb';
    if (s.ok) { s.good++; s.xp += 4; } else s.xp += 1;
    renderNum(false); if (it.read) speak(it.ans, false, true);
  }
  function numNext() { const s = session; s.k++; s.phase = 'ask'; if (s.k < s.items.length) renderNum(true); else finishSession(s.good, s.items.length, s.xp); }

  /* ---------- Shadowing ---------- */
  function speakP(text, factor) {
    return new Promise((resolve) => {
      if (!audioOn() || !voice || !('speechSynthesis' in window)) { resolve(); return; }
      const words = text.split(/\s+/).length; let done = false; const fin = () => { if (!done) { done = true; resolve(); } };
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text); u.lang = voice.lang; u.voice = voice; u.rate = state.settings.rate * (factor || 1);
        u.onend = fin; u.onerror = fin; speechSynthesis.speak(u);
      } catch (e) { fin(); }
      setTimeout(fin, (words * 520) / (factor || 1) + 2500);
    });
  }
  function splitChunks(text) {
    const out = [];
    text.split(/\n+/).forEach((para) => para.split(/(?<=[.!?])\s+/).forEach((sent) => {
      sent = sent.trim(); if (!sent) return;
      if (sent.split(/\s+/).length <= 14) { out.push(sent); return; }
      let cur = '';
      sent.split(/(?<=,)\s+/).forEach((part) => { if ((cur + ' ' + part).trim().split(/\s+/).length > 12 && cur) { out.push(cur.trim()); cur = part; } else cur = (cur + ' ' + part).trim(); });
      if (cur) out.push(cur.trim());
    }));
    return out.map((x) => x.replace(/[«»]/g, '').replace(/\s+/g, ' ').trim()).filter((x) => /[a-zà-ÿ]/i.test(x));
  }
  const canRecord = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  function viewShadow() {
    const block = needAudio('🎙️ Shadowing'); if (block) { $('#app').innerHTML = block; return; }
    ui.shTab = ui.shTab || 'sons';
    const L = lvlIdx(prof().levels.listening);
    const texts = packTexts().filter((t) => Math.abs(lvlIdx(t.l) - L) <= 1);
    let list = '';
    if (ui.shTab === 'sons') list = (pack().sounds || []).map((x) => `<button class="tile" data-act="shStart" data-arg="son:${x.id}"><b>${esc(x.t)}</b><small>${esc(x.de)}</small></button>`).join('');
    if (ui.shTab === 'textes') list = texts.map((t) => `<button class="tile" data-act="shStart" data-arg="txt:${t.id}"><b>${esc(t.title)}</b><small>${t.l} · ${esc(t.topic)}</small></button>`).join('');
    if (ui.shTab === 'dialogues') list = packDialogs().map((d) => `<button class="tile" data-act="shStart" data-arg="dlg:${d.id}"><span class="ic">${d.ic}</span><b>${esc(d.t)}</b><small>${d.l}</small></button>`).join('');
    $('#app').innerHTML = `<div class="card"><h1>🎙️ Shadowing</h1>
        <p class="small muted">Écoute un passage, répète-le (en écho ou en même temps), enregistre-toi et compare ta voix au modèle.</p>
        ${canRecord() ? '' : '<p class="small"><b>L’enregistrement n’est pas disponible ici</b> – tu peux quand même écouter et répéter.</p>'}
        <div class="chips">${[['sons', '🔤 Sons difficiles'], ['textes', '📖 Textes'], ['dialogues', '💬 Dialogues']].map(([k, l]) => `<button class="chipbtn ${ui.shTab === k ? 'on' : ''}" data-act="shTab" data-arg="${k}">${l}</button>`).join('')}</div></div>
      <div class="grid">${list}</div>
      <details class="small muted"><summary>So funktioniert Shadowing</summary><p>1. Abschnitt anhören. 2. «Écho»: nach dem Vorbild nachsprechen – oder «Simultané»: gleichzeitig mitsprechen. 3. Mit «Comparer» Vorbild und eigene Aufnahme direkt hintereinander hören. Erst langsam (🐢), dann normal. Später den Text ausblenden (👁️).</p></details>`;
  }
  function shStart(arg) {
    const [kind, id] = arg.split(':'); let chunks = [], title = '';
    if (kind === 'son') { const x = (pack().sounds || []).find((y) => y.id === id); chunks = x.items.slice(); title = x.t; }
    if (kind === 'txt') { const t = packTexts().find((y) => y.id === id); chunks = splitChunks(t.text).slice(0, 10); title = t.title; }
    if (kind === 'dlg') { const d = packDialogs().find((y) => y.id === id); d.steps.forEach((st) => { chunks.push(st.p); chunks.push(st.a); }); title = d.t; }
    session = { kind: 'shadow', title, chunks, k: 0, xp: 0, good: 0, speed: 0.85, show: true, rec: null, recUrl: null, busy: '' };
    document.body.classList.add('in-session'); renderShadow();
  }
  function renderShadow() {
    const s = session; const c = s.chunks[s.k]; const pct = Math.round((s.k / s.chunks.length) * 100); const can = canRecord();
    $('#app').innerHTML = `<div class="ex-head"><button class="x" data-act="quit" aria-label="Quitter">✕</button><div class="bar"><i style="width:${pct}%"></i></div><span class="small muted">${s.k + 1}/${s.chunks.length}</span></div>
      <div class="card"><span class="chip">🎙️ ${esc(s.title)}</span>
        <div class="shadow-text ${s.show ? '' : 'hidden'}">${s.show ? esc(c) : '• • •'}</div>
        <div class="row between small"><div class="chips">${[[0.7, '🐢 0.7'], [0.85, '0.85'], [1, '1.0']].map(([v, l]) => `<button class="chipbtn ${s.speed === v ? 'on' : ''}" data-act="shSpeed" data-arg="${v}">${l}</button>`).join('')}</div>
          <button class="chipbtn" data-act="shToggle">${s.show ? '🙈 Cacher' : '👁️ Montrer'}</button></div>
        <div class="shadow-btns">
          <button class="btn" data-act="shListen" ${s.busy ? 'disabled' : ''}>▶ Écouter</button>
          ${can ? `<button class="btn primary" data-act="shEcho" ${s.busy ? 'disabled' : ''}>🔁 Écho</button><button class="btn primary" data-act="shSimul" ${s.busy ? 'disabled' : ''}>🎙️ Simultané</button>` : '<button class="btn primary" data-act="shListen">🔁 Encore</button>'}
        </div>
        ${s.busy ? `<div class="recbar">${s.busy === 'rec' ? '⏺️ Enregistrement… parle maintenant' : '🔊 Écoute…'} ${s.busy === 'rec' ? '<button class="btn small" data-act="shStop">⏹ Stop</button>' : ''}</div>` : ''}
        ${s.recUrl && !s.busy ? `<div class="shadow-btns"><button class="btn" data-act="shMine">▶ Ma voix</button><button class="btn" data-act="shCompare">⇄ Comparer</button></div>` : ''}
        <p class="small muted" style="margin:12px 0 6px">Comment c’était ?</p>
        <div class="btnrow">${[['0', '🔁 Encore', ''], ['1', '👌 Ça va', ''], ['2', '👍 Bien', ' primary']].map(([v, l, c]) => `<button class="btn small${c}" data-act="shRate" data-arg="${v}" ${s.busy ? 'disabled' : ''}>${l}</button>`).join('')}</div>
      </div>`;
  }
  async function getMic() {
    const s = session; if (s.stream) return s.stream;
    s.stream = await navigator.mediaDevices.getUserMedia({ audio: true }); return s.stream;
  }
  async function recordFor(maxMs, during) {
    const s = session; let stream;
    try { stream = await getMic(); } catch (e) { toast('Micro refusé ou indisponible.'); s.busy = ''; renderShadow(); return; }
    const chunks = []; const mr = new MediaRecorder(stream); s.rec = mr;
    mr.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    const stopped = new Promise((r) => { mr.onstop = r; });
    mr.start(); s.busy = 'rec'; renderShadow();
    const timer = setTimeout(() => { if (mr.state !== 'inactive') mr.stop(); }, maxMs);
    if (during) { await during(); setTimeout(() => { if (mr.state !== 'inactive') mr.stop(); }, 700); }
    await stopped; clearTimeout(timer);
    if (session !== s) return;
    if (s.recUrl) URL.revokeObjectURL(s.recUrl);
    s.recUrl = URL.createObjectURL(new Blob(chunks, { type: mr.mimeType || 'audio/webm' }));
    s.busy = ''; s.rec = null; renderShadow();
  }
  function shDur(text, speed) { return Math.round((text.split(/\s+/).length * 450) / speed * 1.4 + 1500); }
  async function shListen() { const s = session; s.busy = 'play'; renderShadow(); await speakP(s.chunks[s.k], s.speed); if (session === s) { s.busy = ''; renderShadow(); } }
  async function shEcho() {
    const s = session; const c = s.chunks[s.k];
    s.busy = 'play'; renderShadow(); await speakP(c, s.speed); if (session !== s) return;
    await recordFor(shDur(c, s.speed));
  }
  async function shSimul() { const s = session; const c = s.chunks[s.k]; await recordFor(shDur(c, s.speed) + 4000, () => speakP(c, s.speed)); }
  function shStop() { const s = session; if (s.rec && s.rec.state !== 'inactive') s.rec.stop(); }
  function playUrl(url) { return new Promise((r) => { const a = new Audio(url); a.onended = r; a.onerror = r; a.play().catch(r); }); }
  async function shMine() { const s = session; if (s.recUrl) await playUrl(s.recUrl); }
  async function shCompare() { const s = session; s.busy = 'play'; renderShadow(); await speakP(s.chunks[s.k], s.speed); if (session !== s) return; await playUrl(s.recUrl); s.busy = ''; renderShadow(); }
  function shRate(r) {
    const s = session; r = Number(r);
    if (r === 0) { toast('On recommence 🔁'); return; }
    s.xp += r === 2 ? 4 : 2; if (r === 2) s.good++;
    if (s.recUrl) { URL.revokeObjectURL(s.recUrl); s.recUrl = null; }
    s.k++;
    if (s.k < s.chunks.length) renderShadow();
    else { endMedia(); finishSession(s.good, s.chunks.length, s.xp + 5); }
  }
  function endMedia() {
    const s = session; if (!s) return;
    try { if (s.rec && s.rec.state !== 'inactive') s.rec.stop(); } catch (e) { /* */ }
    if (s.stream) s.stream.getTracks().forEach((t) => t.stop());
    if (s.recUrl) URL.revokeObjectURL(s.recUrl);
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
    const packHtml = viewReadingPack();
    if (!aiReady()) { $('#app').innerHTML = packHtml + '<p class="small muted center">✨ Avec une clé Gemini (Réglages), tu peux aussi générer des textes supplémentaires.</p>'; return; }
    const c = aiCache();
    const chips = (list, cur, act) => `<div class="chips">${list.map(([k, l]) => `<button class="chipbtn ${cur === k ? 'on' : ''}" data-act="${act}" data-arg="${k}">${l}</button>`).join('')}</div>`;
    $('#app').innerHTML = packHtml + `<div class="card"><h2>✨ Texte supplémentaire (IA)</h2>
        <p class="small muted">Un texte original généré par Gemini à ton niveau (${prof().levels.reading}).</p>
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
    const r = session.r; const ms = session.missionStep;
    if (r.pack) { doneMap('readDone')[r.id] = today(); save(); }
    const items = r.questions.map((q, i) => ({ key: 'ai:read' + i, chip: `${r.level} · compréhension`, prompt: esc(q.q), textRef: r.text, options: q.o, answer: q.a, explain: { fr: q.fr, de: q.de } }));
    startMC('Compréhension', items, { missionStep: ms });
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
    const packHtml = viewDialogPack(false);
    if (!aiReady()) { $('#app').innerHTML = packHtml + '<p class="small muted center">✨ Avec une clé Gemini (Réglages), tu peux aussi discuter librement avec l’IA.</p>'; return; }
    const L = lvlIdx(chatLevel());
    $('#app').innerHTML = packHtml + `<div class="card"><h2>✨ Dialogue libre (IA)</h2>
      <p class="small muted">Jeu de rôle avec Gemini, correction de chaque message. Niveau : ${chatLevel()}. Tu peux écrire${SR ? ' ou dicter 🎤' : ''}.</p></div>
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
    if (session && h !== 'run') { endMedia(); session = null; test = null; document.body.classList.remove('in-session'); }
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
      case 'telephone': $('#app').innerHTML = viewDialogPack(true); break;
      case 'dictee': startDictee(); break;
      case 'puzzle': startPuzzle(); break;
      case 'prononciation': startPron(); break;
      case 'fauxamis': startFauxAmis(); break;
      case 'suisse': startSuisse(); break;
      case 'conjugaison': viewConj(); break;
      case 'nombres': viewNumbers(); break;
      case 'shadowing': viewShadow(); break;
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
    quit: () => { endMedia(); session = null; test = null; document.body.classList.remove('in-session'); goHome(); },
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
      save(); applyTheme(); if (k === 'lang') pickVoice(); if (location.hash === '#reglages') viewSettings(); else route(); renderTop();
    },
    testVoice: () => speak('Bonjour ! On apprend le français ensemble ?'),
    exportCopy: () => { const t = JSON.stringify(state); if (navigator.clipboard) navigator.clipboard.writeText(t).then(() => toast('Copié ✓ – colle-le dans une note ou un e-mail.'), () => { $('#importBox').value = t; toast('Copie impossible : texte affiché ci-dessous.'); }); else { $('#importBox').value = t; } },
    exportFile: () => { try { const b = new Blob([JSON.stringify(state, null, 1)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'lingua-sauvegarde-' + today() + '.json'; document.body.appendChild(a); a.click(); a.remove(); } catch (e) { toast('Téléchargement impossible ici – utilise « Copier ».'); } },
    importText: () => importData($('#importBox').value),
    reset: () => { $('#resetBox').innerHTML = `<p class="small">Supprimer toute la progression ?</p><div class="btnrow"><button class="btn small" data-act="resetNo">Annuler</button><button class="btn small primary" data-act="resetYes">Oui, tout supprimer</button></div>`; },
    resetNo: () => { $('#resetBox').innerHTML = ''; },
    resetYes: () => { state = defaultState(); save(); applyTheme(); toast('Réinitialisé.'); location.hash = '#home'; route(); },
    rTopic: (k) => { ui.rTopic = k; viewReading(); }, rType: (k) => { ui.rType = k; viewReading(); }, gFocus: (k) => { ui.gFocus = k; viewAiGaps(); },
    textStart: (id) => startText(id), dlgStart: (id) => startGuided(id), phoneStart: (id) => startGuided(id, { phone: true }),
    dlgPick, dlgWrite, dlgRate, dlgNext, dlgFinish, dlgShowText: () => { session.showText = true; renderGuided(false); },
    accent: insertAccent, cTense: (k) => { ui.cTense = k; viewConj(); }, conjStart, conjCheck, conjNext,
    nVar: (k) => { ui.nVar = k; viewNumbers(); }, numStart, numCheck, numPick, numNext,
    shTab: (k) => { ui.shTab = k; viewShadow(); }, shStart, shListen, shEcho, shSimul, shStop, shMine, shCompare, shRate,
    shSpeed: (v) => { session.speed = Number(v); renderShadow(); }, shToggle: () => { session.show = !session.show; renderShadow(); },
    dictCheck, dictNext, pzAdd, pzBack, pzCheck, pzNext, pronSpeak, pronNext,
    readGen, readCached, readQuestions, gapGen, gapCached, chatStart, chatSend, chatEnd, dictate, aiSaveKey, aiPrepare,
    chatHint: () => { session.showHint = true; renderChat(); },
    chatRetry: () => { const s = session; s.error = ''; const last = s.msgs[s.msgs.length - 1]; chatTurn(last && last.role === 'me' ? last.text : '[START]'); },
    addWord: (id, el) => { const w = pendingWords[id]; if (w && addCustomWord(w.fr, w.de, w.ex)) { el.disabled = true; el.textContent = '✓ Ajouté'; } },
    aiDelKey: () => { try { localStorage.removeItem(AI_KEY); } catch (e) { /* */ } toast('Clé supprimée.'); viewSettings(); },
    applyUpdate: () => { updateRequested = true; if (waitingSW) waitingSW.postMessage('SKIP_WAITING'); else location.reload(); }
  };
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]'); if (!el) return;
    const fn = actions[el.dataset.act]; if (fn) { e.preventDefault(); fn(el.dataset.arg, el); }
  });

  let toastT = null;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2600); }
  function applyTheme() { document.documentElement.dataset.theme = state.settings.theme; }

  /* ---------- Offline (Service Worker) ---------- */
  let waitingSW = null; let updateRequested = false;
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
      navigator.serviceWorker.addEventListener('controllerchange', () => { if (updateRequested && !reloaded) { reloaded = true; location.reload(); } }); // nur nach Klick auf «Recharger»
    } catch (e) { /* z. B. in einer Sandbox nicht erlaubt */ }
  }

  /* ---------- Start ---------- */
  applyTheme();
  window.addEventListener('hashchange', route);
  route();
  registerSW();
  window.__lingua = { get state() { return state; }, get session() { return session; }, P, estimate, aiConf }; // für Tests/Debugging
})();
