/* Verbformen Dänisch: gleiche Schnittstelle wie Französisch/Italienisch.
   Dänische Verben haben für alle Personen dieselbe Form – geübt werden die Zeitformen
   (vor allem die unregelmässigen Präteritum- und Partizipformen). */
(function () {
  const P = window.LINGUA_PACKS.da;
  const PRON = ['jeg', 'du', 'han/hun', 'vi', 'I', 'de'];
  const TENSES = [
    { id: 'nutid', name: 'nutid', de: 'Präsens', l: 'A1' },
    { id: 'datid', name: 'datid', de: 'Präteritum', l: 'A2' },
    { id: 'fornutid', name: 'førnutid', de: 'Perfekt', l: 'A2' },
    { id: 'fordatid', name: 'førdatid', de: 'Plusquamperfekt', l: 'B1' },
    { id: 'fremtid', name: 'fremtid (vil)', de: 'Futur', l: 'B1' },
    { id: 'kond', name: 'betinget (ville)', de: 'Konditional', l: 'B2' },
    { id: 'kondperf', name: 'betinget førtid (ville have)', de: 'Konditional Perfekt', l: 'C1' }
  ];
  const STAGES = [
    { l: 'A1', tenses: ['nutid'], verbs: ['være', 'have', 'gå', 'komme', 'se', 'gøre', 'sige', 'tage', 'spise', 'drikke', 'tale', 'bo', 'arbejde', 'kunne', 'ville'] },
    { l: 'A2', tenses: ['datid', 'fornutid'], verbLevel: 'A2' },
    { l: 'B1', tenses: ['fordatid', 'fremtid'], verbLevel: 'B1' },
    { l: 'B2', tenses: ['kond', 'datid'], verbLevel: 'B1' },
    { l: 'C1', tenses: ['kondperf', 'fordatid'], verbLevel: 'B1' }
  ];
  const V = [];
  // irr(inf, de, niveau, nutid, datid, partizip, hilfsverb, alternatives Hilfsverb)
  const irr = (inf, de, l, pres, past, pp, aux, aux2) => V.push({ inf, de, l, pres, past, pp, aux: aux || 'har', aux2 });
  const stem = (inf) => inf.replace(/e$/, '');
  const g1 = (inf, de, l, aux, aux2) => irr(inf, de, l, inf + 'r', stem(inf) + 'ede', stem(inf) + 'et', aux, aux2); // arbejde → arbejdede
  const g2 = (inf, de, l, aux, aux2) => irr(inf, de, l, inf + 'r', stem(inf) + 'te', stem(inf) + 't', aux, aux2);    // spise → spiste

  irr('være', 'sein', 'A1', 'er', 'var', 'været');
  irr('have', 'haben', 'A1', 'har', 'havde', 'haft');
  irr('gå', 'gehen', 'A1', 'går', 'gik', 'gået', 'er', 'har');
  irr('komme', 'kommen', 'A1', 'kommer', 'kom', 'kommet', 'er', 'har');
  irr('se', 'sehen', 'A1', 'ser', 'så', 'set');
  irr('gøre', 'tun / machen', 'A1', 'gør', 'gjorde', 'gjort');
  irr('sige', 'sagen', 'A1', 'siger', 'sagde', 'sagt');
  irr('tage', 'nehmen', 'A1', 'tager', 'tog', 'taget');
  irr('drikke', 'trinken', 'A1', 'drikker', 'drak', 'drukket');
  irr('kunne', 'können', 'A1', 'kan', 'kunne', 'kunnet');
  irr('ville', 'wollen', 'A1', 'vil', 'ville', 'villet');
  irr('give', 'geben', 'A2', 'giver', 'gav', 'givet');
  irr('få', 'bekommen', 'A2', 'får', 'fik', 'fået');
  irr('vide', 'wissen', 'A2', 'ved', 'vidste', 'vidst');
  irr('skulle', 'sollen / müssen', 'A2', 'skal', 'skulle', 'skullet');
  irr('måtte', 'dürfen / müssen', 'A2', 'må', 'måtte', 'måttet');
  irr('sove', 'schlafen', 'A2', 'sover', 'sov', 'sovet');
  irr('finde', 'finden', 'A2', 'finder', 'fandt', 'fundet');
  irr('ligge', 'liegen', 'A2', 'ligger', 'lå', 'ligget');
  irr('sidde', 'sitzen', 'A2', 'sidder', 'sad', 'siddet');
  irr('stå', 'stehen', 'A2', 'står', 'stod', 'stået');
  irr('skrive', 'schreiben', 'A2', 'skriver', 'skrev', 'skrevet');
  irr('blive', 'werden / bleiben', 'A2', 'bliver', 'blev', 'blevet', 'er');
  irr('hedde', 'heissen', 'A2', 'hedder', 'hed', 'heddet');
  irr('sætte', 'setzen / stellen', 'B1', 'sætter', 'satte', 'sat');
  irr('lægge', 'legen', 'B1', 'lægger', 'lagde', 'lagt');
  irr('spørge', 'fragen', 'B1', 'spørger', 'spurgte', 'spurgt');
  irr('synes', 'finden (meinen)', 'B1', 'synes', 'syntes', 'syntes');
  irr('flyve', 'fliegen', 'B1', 'flyver', 'fløj', 'fløjet', 'er', 'har');
  irr('løbe', 'laufen / rennen', 'B1', 'løber', 'løb', 'løbet', 'har', 'er');
  irr('le', 'lachen', 'B1', 'ler', 'lo', 'leet');
  irr('bære', 'tragen', 'B1', 'bærer', 'bar', 'båret');
  // Gruppe 1 (-ede)
  g1('tale', 'sprechen', 'A1'); g1('bo', 'wohnen', 'A1'); g1('arbejde', 'arbeiten', 'A1');
  g1('lave', 'machen', 'A2'); g1('vente', 'warten', 'A2'); g1('elske', 'lieben', 'A2'); g1('åbne', 'öffnen', 'A2');
  g1('ringe', 'anrufen', 'A2'); g1('danse', 'tanzen', 'A2'); g1('snakke', 'plaudern', 'B1'); g1('bade', 'baden', 'B1'); g1('hente', 'holen', 'B1');
  // Gruppe 2 (-te)
  g2('spise', 'essen', 'A1'); g2('læse', 'lesen', 'A2'); g2('købe', 'kaufen', 'A2'); g2('høre', 'hören', 'A2'); g2('lære', 'lernen', 'A2');
  g2('køre', 'fahren', 'A2', 'har', 'er'); g2('rejse', 'reisen', 'A2', 'er', 'har'); g2('betale', 'bezahlen', 'B1'); g2('tænke', 'denken', 'B1');
  g2('bruge', 'brauchen / benutzen', 'B1'); g2('vise', 'zeigen', 'B1');
  V.find((v) => v.inf === 'tale').past = 'talte'; V.find((v) => v.inf === 'tale').pp = 'talt';   // tale: talte, talt

  const AUXF = { har: { pres: 'har', past: 'havde', inf: 'have' }, er: { pres: 'er', past: 'var', inf: 'være' } };
  function forms(v, t, aux) {
    const A = AUXF[aux];
    switch (t) {
      case 'nutid': return v.pres;
      case 'datid': return v.past;
      case 'fornutid': return A.pres + ' ' + v.pp;
      case 'fordatid': return A.past + ' ' + v.pp;
      case 'fremtid': return 'vil ' + v.inf;
      case 'kond': return 'ville ' + v.inf;
      case 'kondperf': return 'ville ' + A.inf + ' ' + v.pp;
    }
    return '';
  }
  function conjugate(v, t) {
    const f = forms(v, t, v.aux);
    const acc = [f];
    if (v.aux2) acc.push(forms(v, t, v.aux2));
    if (t === 'fremtid') acc.push('skal ' + v.inf);
    return PRON.map((pron) => ({ pron, form: f, accept: acc }));
  }
  P.conj = { tenses: TENSES, verbs: V, conjugate, pronouns: PRON, stages: STAGES };
})();
