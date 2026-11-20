/* Konjugation Italienisch: gleiche Schnittstelle wie Französisch ({ tenses, verbs, conjugate, pronouns, stages }). */
(function () {
  const P = window.LINGUA_PACKS.it;
  const PRON = ['io', 'tu', 'lui/lei', 'noi', 'voi', 'loro'];
  const TENSES = [
    { id: 'pres', name: 'presente', de: 'Präsens', l: 'A1' },
    { id: 'pp', name: 'passato prossimo', de: 'Perfekt', l: 'A2' },
    { id: 'imp', name: 'imperfetto', de: 'Imperfekt', l: 'A2' },
    { id: 'fut', name: 'futuro semplice', de: 'Futur', l: 'B1' },
    { id: 'cond', name: 'condizionale presente', de: 'Konditional', l: 'B1' },
    { id: 'cong', name: 'congiuntivo presente', de: 'Konjunktiv Präsens', l: 'B2' },
    { id: 'trap', name: 'trapassato prossimo', de: 'Plusquamperfekt', l: 'B2' },
    { id: 'congimp', name: 'congiuntivo imperfetto', de: 'Konjunktiv Imperfekt', l: 'C1' },
    { id: 'condp', name: 'condizionale passato', de: 'Konditional Perfekt', l: 'C1' }
  ];
  const STAGES = [
    { l: 'A1', tenses: ['pres'], verbs: ['essere', 'avere', 'andare', 'fare', 'stare', 'potere', 'volere', 'venire', 'parlare', 'abitare', 'lavorare', 'mangiare', 'prendere', 'dormire', 'capire'] },
    { l: 'A2', tenses: ['pp', 'imp'], verbLevel: 'A2' },
    { l: 'B1', tenses: ['fut', 'cond'], verbLevel: 'B1' },
    { l: 'B2', tenses: ['cong', 'trap'], verbLevel: 'B1' },
    { l: 'C1', tenses: ['congimp', 'condp'], verbLevel: 'B1' }
  ];
  const END = {
    imp: ['vo', 'vi', 'va', 'vamo', 'vate', 'vano'],
    fut: ['ò', 'ai', 'à', 'emo', 'ete', 'anno'],
    cond: ['ei', 'esti', 'ebbe', 'emmo', 'este', 'ebbero'],
    ci: ['ssi', 'ssi', 'sse', 'ssimo', 'ste', 'ssero']
  };
  const V = [];
  const add = (v) => { V.push(v); return v; };
  const fix = (s) => s.replace(/ii/g, 'i');

  function are(inf, de, l, o) {
    o = o || {}; const st = inf.slice(0, -3);
    const hard = /[cg]$/.test(st) ? st + 'h' : st;           // cercare → cerch-i
    const soft = /[cg]i$/.test(st) ? st.slice(0, -1) : st;    // mangiare → mang-erò
    return add({ inf, de, l, aux: o.aux || 'avere', pp: o.pp || st + 'ato',
      pres: o.pres || [st + 'o', fix(hard + 'i'), st + 'a', fix(hard + 'iamo'), st + 'ate', st + 'ano'],
      imp: st + 'a', fut: (/[cg]$/.test(st) ? hard : soft) + 'er',
      cong: o.cong || [fix(hard + 'i'), fix(hard + 'i'), fix(hard + 'i'), fix(hard + 'iamo'), fix(hard + 'iate'), fix(hard + 'ino')],
      ci: st + 'a' });
  }
  function ere(inf, de, l, o) {
    o = o || {}; const st = inf.slice(0, -3);
    return add({ inf, de, l, aux: o.aux || 'avere', pp: o.pp || st + 'uto',
      pres: o.pres || [st + 'o', st + 'i', st + 'e', st + 'iamo', st + 'ete', st + 'ono'],
      imp: o.imp || st + 'e', fut: o.fut || st + 'er',
      cong: o.cong || [st + 'a', st + 'a', st + 'a', st + 'iamo', st + 'iate', st + 'ano'],
      ci: o.ci || st + 'e', impFull: o.impFull, ciFull: o.ciFull });
  }
  function ire(inf, de, l, o) {
    o = o || {}; const st = inf.slice(0, -3); const isc = o.isc;
    const s1 = isc ? st + 'isc' : st;
    return add({ inf, de, l, aux: o.aux || 'avere', pp: o.pp || st + 'ito',
      pres: o.pres || (isc ? [st + 'isco', st + 'isci', st + 'isce', st + 'iamo', st + 'ite', st + 'iscono'] : [st + 'o', st + 'i', st + 'e', st + 'iamo', st + 'ite', st + 'ono']),
      imp: o.imp || st + 'i', fut: o.fut || st + 'ir',
      cong: o.cong || [s1 + 'a', s1 + 'a', s1 + 'a', st + 'iamo', st + 'iate', s1 + 'ano'],
      ci: o.ci || st + 'i' });
  }
  const c3 = (a, n, v, l) => [a, a, a, n, v, l];

  // Unregelmässige Verben
  ere('essere', 'sein', 'A1', { aux: 'essere', pp: 'stato', pres: ['sono', 'sei', 'è', 'siamo', 'siete', 'sono'], fut: 'sar',
    impFull: ['ero', 'eri', 'era', 'eravamo', 'eravate', 'erano'], cong: c3('sia', 'siamo', 'siate', 'siano'), ciFull: ['fossi', 'fossi', 'fosse', 'fossimo', 'foste', 'fossero'] });
  ere('avere', 'haben', 'A1', { pres: ['ho', 'hai', 'ha', 'abbiamo', 'avete', 'hanno'], fut: 'avr', cong: c3('abbia', 'abbiamo', 'abbiate', 'abbiano') });
  are('andare', 'gehen', 'A1', { aux: 'essere', pres: ['vado', 'vai', 'va', 'andiamo', 'andate', 'vanno'], cong: c3('vada', 'andiamo', 'andiate', 'vadano') }).fut = 'andr';
  Object.assign(are('fare', 'machen', 'A1', { pp: 'fatto', pres: ['faccio', 'fai', 'fa', 'facciamo', 'fate', 'fanno'], cong: c3('faccia', 'facciamo', 'facciate', 'facciano') }), { imp: 'face', fut: 'far', ci: 'face' });
  Object.assign(are('stare', 'bleiben / sich befinden', 'A1', { aux: 'essere', pres: ['sto', 'stai', 'sta', 'stiamo', 'state', 'stanno'], cong: c3('stia', 'stiamo', 'stiate', 'stiano') }), { fut: 'star', ciFull: ['stessi', 'stessi', 'stesse', 'stessimo', 'steste', 'stessero'] });
  Object.assign(are('dare', 'geben', 'A2', { pres: ['do', 'dai', 'dà', 'diamo', 'date', 'danno'], cong: c3('dia', 'diamo', 'diate', 'diano') }), { fut: 'dar', ciFull: ['dessi', 'dessi', 'desse', 'dessimo', 'deste', 'dessero'] });
  Object.assign(ire('dire', 'sagen', 'A2', { pp: 'detto', pres: ['dico', 'dici', 'dice', 'diciamo', 'dite', 'dicono'], cong: c3('dica', 'diciamo', 'diciate', 'dicano') }), { imp: 'dice', fut: 'dir', ci: 'dice' });
  ire('venire', 'kommen', 'A1', { aux: 'essere', pp: 'venuto', pres: ['vengo', 'vieni', 'viene', 'veniamo', 'venite', 'vengono'], fut: 'verr', cong: c3('venga', 'veniamo', 'veniate', 'vengano') });
  ere('potere', 'können', 'A1', { pres: ['posso', 'puoi', 'può', 'possiamo', 'potete', 'possono'], fut: 'potr', cong: c3('possa', 'possiamo', 'possiate', 'possano') });
  ere('volere', 'wollen', 'A1', { pres: ['voglio', 'vuoi', 'vuole', 'vogliamo', 'volete', 'vogliono'], fut: 'vorr', cong: c3('voglia', 'vogliamo', 'vogliate', 'vogliano') });
  ere('dovere', 'müssen', 'A2', { pres: ['devo', 'devi', 'deve', 'dobbiamo', 'dovete', 'devono'], fut: 'dovr', cong: c3('debba', 'dobbiamo', 'dobbiate', 'debbano') });
  ere('sapere', 'wissen / können', 'A2', { pres: ['so', 'sai', 'sa', 'sappiamo', 'sapete', 'sanno'], fut: 'sapr', cong: c3('sappia', 'sappiamo', 'sappiate', 'sappiano') });
  ire('uscire', 'hinausgehen', 'A2', { aux: 'essere', pres: ['esco', 'esci', 'esce', 'usciamo', 'uscite', 'escono'], cong: c3('esca', 'usciamo', 'usciate', 'escano') });
  ere('bere', 'trinken', 'A1', { pp: 'bevuto', pres: ['bevo', 'bevi', 'beve', 'beviamo', 'bevete', 'bevono'], imp: 'beve', fut: 'berr', cong: c3('beva', 'beviamo', 'beviate', 'bevano'), ci: 'beve' });
  ere('rimanere', 'bleiben', 'B1', { aux: 'essere', pp: 'rimasto', pres: ['rimango', 'rimani', 'rimane', 'rimaniamo', 'rimanete', 'rimangono'], fut: 'rimarr', cong: c3('rimanga', 'rimaniamo', 'rimaniate', 'rimangano') });
  ere('vedere', 'sehen', 'A2', { pp: 'visto', fut: 'vedr' });
  ere('vivere', 'leben', 'B1', { pp: 'vissuto', fut: 'vivr' });

  // Regelmässige -are
  are('parlare', 'sprechen', 'A1'); are('abitare', 'wohnen', 'A1'); are('lavorare', 'arbeiten', 'A1'); are('mangiare', 'essen', 'A1');
  are('comprare', 'kaufen', 'A2'); are('cercare', 'suchen', 'A2'); are('pagare', 'bezahlen', 'A2'); are('arrivare', 'ankommen', 'A2', { aux: 'essere' });
  are('tornare', 'zurückkehren', 'A2', { aux: 'essere' }); are('studiare', 'lernen / studieren', 'A2'); are('cominciare', 'anfangen', 'A2');
  are('ascoltare', 'zuhören', 'A2'); are('aspettare', 'warten', 'A2'); are('prenotare', 'reservieren', 'A2'); are('viaggiare', 'reisen', 'B1');
  are('entrare', 'eintreten', 'B1', { aux: 'essere' }); are('restare', 'bleiben', 'B1', { aux: 'essere' }); are('giocare', 'spielen', 'B1');
  // -ere
  ere('prendere', 'nehmen', 'A1', { pp: 'preso' }); ere('leggere', 'lesen', 'A2', { pp: 'letto' }); ere('scrivere', 'schreiben', 'A2', { pp: 'scritto' });
  ere('mettere', 'legen / stellen', 'B1', { pp: 'messo' }); ere('chiedere', 'fragen', 'B1', { pp: 'chiesto' }); ere('rispondere', 'antworten', 'B1', { pp: 'risposto' });
  ere('conoscere', 'kennen', 'B1', { pp: 'conosciuto' }); ere('chiudere', 'schliessen', 'B1', { pp: 'chiuso' }); ere('perdere', 'verlieren', 'B1', { pp: 'perso' });
  // -ire
  ire('dormire', 'schlafen', 'A1'); ire('partire', 'abreisen', 'A2', { aux: 'essere' }); ire('sentire', 'hören / fühlen', 'A2'); ire('aprire', 'öffnen', 'B1', { pp: 'aperto' });
  ire('offrire', 'anbieten', 'B1', { pp: 'offerto' }); ire('capire', 'verstehen', 'A1', { isc: true }); ire('finire', 'beenden', 'A2', { isc: true });
  ire('preferire', 'vorziehen', 'A2', { isc: true }); ire('pulire', 'putzen', 'B1', { isc: true });

  const AUX = { pres: { avere: ['ho', 'hai', 'ha', 'abbiamo', 'avete', 'hanno'], essere: ['sono', 'sei', 'è', 'siamo', 'siete', 'sono'] } };
  const COMPOUND = { pp: 'pres', trap: 'imp', condp: 'cond' };
  function simple(v, t, i) {
    if (t === 'pres') return v.pres[i];
    if (t === 'imp') return v.impFull ? v.impFull[i] : v.imp + END.imp[i];
    if (t === 'fut') return v.fut + END.fut[i];
    if (t === 'cond') return v.fut + END.cond[i];
    if (t === 'cong') return v.cong[i];
    if (t === 'congimp') return v.ciFull ? v.ciFull[i] : v.ci + END.ci[i];
    return '';
  }
  function conjugate(v, t) {
    const out = [];
    for (let i = 0; i < 6; i++) {
      let form, acc = [];
      if (COMPOUND[t]) {
        const auxV = V.find((x) => x.inf === v.aux);
        const aux = simple(auxV, COMPOUND[t], i); const st = v.pp.slice(0, -1);
        if (v.aux === 'essere') {
          const pl = i >= 3;
          const a = pl ? st + 'i' : st + 'o', b = pl ? st + 'e' : st + 'a';
          form = aux + ' ' + a + '(' + (pl ? 'e' : 'a') + ')';
          acc.push(aux + ' ' + a, aux + ' ' + b, aux + ' ' + a + '/' + (pl ? 'e' : 'a'));
        } else form = aux + ' ' + v.pp;
      } else form = simple(v, t, i);
      let pron = PRON[i];
      if (t === 'cong' || t === 'congimp') pron = 'che ' + pron;
      out.push({ pron, form, accept: [form].concat(acc) });
    }
    return out;
  }
  P.conj = { tenses: TENSES, verbs: V, conjugate, pronouns: PRON, stages: STAGES };
})();
