/* Konjugation Französisch: Verbdaten + Regeln. Sprachspezifisch (für Italienisch eigene Datei). */
(function () {
  const F = window.LINGUA_PACKS.fr;
  const PRON = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'];
  const TENSES = [
    { id: 'pres', name: 'présent', de: 'Präsens', l: 'A2' },
    { id: 'pc', name: 'passé composé', de: 'Perfekt', l: 'A2' },
    { id: 'imp', name: 'imparfait', de: 'Imperfekt', l: 'B1' },
    { id: 'fut', name: 'futur simple', de: 'Futur', l: 'B1' },
    { id: 'cond', name: 'conditionnel présent', de: 'Konditional', l: 'B1' },
    { id: 'subj', name: 'subjonctif présent', de: 'Subjonctif', l: 'B2' },
    { id: 'pqp', name: 'plus-que-parfait', de: 'Plusquamperfekt', l: 'B2' },
    { id: 'futant', name: 'futur antérieur', de: 'Futur II', l: 'C1' },
    { id: 'condp', name: 'conditionnel passé', de: 'Konditional Perfekt', l: 'C1' }
  ];
  /* Stufen für den adaptiven Modus: neue Zeiten pro Stufe, Verben bis Niveau */
  const STAGES = [
    { l: 'A1', tenses: ['pres'], verbs: ['être', 'avoir', 'aller', 'faire', 'pouvoir', 'vouloir', 'venir', 'prendre', 'parler', 'travailler', 'aimer', 'habiter', 'manger', 'finir', 'dire'] },
    { l: 'A2', tenses: ['pc', 'imp'], verbLevel: 'A2' },
    { l: 'B1', tenses: ['fut', 'cond'], verbLevel: 'B1' },
    { l: 'B2', tenses: ['subj', 'pqp'], verbLevel: 'B2' },
    { l: 'C1', tenses: ['futant', 'condp'], verbLevel: 'B2' }
  ];
  const V = [];
  const add = (v) => { V.push(v); return v; };
  // Regelmässige -er-Verben (mit Rechtschreib-Besonderheiten)
  function er(inf, de, l, o) {
    o = o || {}; const st = inf.slice(0, -2); const boot = o.boot || st;
    let nous = st + 'ons', impSt = st, imp2;
    if (/ger$/.test(inf)) { nous = st + 'eons'; impSt = st + 'e'; imp2 = st; }
    if (/cer$/.test(inf)) { const c = st.slice(0, -1) + 'ç'; nous = c + 'ons'; impSt = c; imp2 = st; }
    return add({ inf, de, l, aux: o.aux || 'avoir', pp: st + 'é',
      pres: [boot + 'e', boot + 'es', boot + 'e', nous, st + 'ez', boot + 'ent'],
      fut: o.fut || inf, futAlt: o.futAlt, imp: impSt, imp2, s1: boot, s2: st });
  }
  function ir(inf, de, l) {
    const st = inf.slice(0, -2);
    return add({ inf, de, l, aux: 'avoir', pp: st + 'i', pres: [st + 'is', st + 'is', st + 'it', st + 'issons', st + 'issez', st + 'issent'],
      fut: inf, imp: st + 'iss', s1: st + 'iss', s2: st + 'iss' });
  }
  // Unregelmässige Verben: pres, pp, aux, fut(-Stamm), imp(-Stamm), s1/s2 (Subjonctif-Stämme) oder subj (vollständig)
  const irr = (inf, de, l, pres, pp, fut, imp, s1, s2, extra) => add(Object.assign({ inf, de, l, aux: 'avoir', pres: pres.split(' '), pp, fut, imp, s1, s2: s2 || s1 }, extra || {}));

  irr('être', 'sein', 'A2', 'suis es est sommes êtes sont', 'été', 'ser', 'ét', null, null, { subj: 'sois sois soit soyons soyez soient'.split(' ') });
  irr('avoir', 'haben', 'A2', 'ai as a avons avez ont', 'eu', 'aur', 'av', null, null, { subj: 'aie aies ait ayons ayez aient'.split(' ') });
  irr('aller', 'gehen', 'A2', 'vais vas va allons allez vont', 'allé', 'ir', 'all', null, null, { aux: 'être', subj: 'aille ailles aille allions alliez aillent'.split(' ') });
  irr('faire', 'machen', 'A2', 'fais fais fait faisons faites font', 'fait', 'fer', 'fais', 'fass');
  irr('pouvoir', 'können', 'A2', 'peux peux peut pouvons pouvez peuvent', 'pu', 'pourr', 'pouv', 'puiss');
  irr('vouloir', 'wollen', 'A2', 'veux veux veut voulons voulez veulent', 'voulu', 'voudr', 'voul', null, null, { subj: 'veuille veuilles veuille voulions vouliez veuillent'.split(' ') });
  irr('savoir', 'wissen', 'A2', 'sais sais sait savons savez savent', 'su', 'saur', 'sav', 'sach');
  irr('devoir', 'müssen', 'A2', 'dois dois doit devons devez doivent', 'dû', 'devr', 'dev', 'doiv', 'dev');
  irr('venir', 'kommen', 'A2', 'viens viens vient venons venez viennent', 'venu', 'viendr', 'ven', 'vienn', 'ven', { aux: 'être' });
  irr('prendre', 'nehmen', 'A2', 'prends prends prend prenons prenez prennent', 'pris', 'prendr', 'pren', 'prenn', 'pren');
  irr('mettre', 'legen / stellen', 'A2', 'mets mets met mettons mettez mettent', 'mis', 'mettr', 'mett', 'mett');
  irr('dire', 'sagen', 'A2', 'dis dis dit disons dites disent', 'dit', 'dir', 'dis', 'dis');
  irr('voir', 'sehen', 'A2', 'vois vois voit voyons voyez voient', 'vu', 'verr', 'voy', 'voi', 'voy');
  irr('partir', 'abreisen / weggehen', 'A2', 'pars pars part partons partez partent', 'parti', 'partir', 'part', 'part', null, { aux: 'être' });
  irr('sortir', 'hinausgehen', 'A2', 'sors sors sort sortons sortez sortent', 'sorti', 'sortir', 'sort', 'sort', null, { aux: 'être' });
  irr('lire', 'lesen', 'A2', 'lis lis lit lisons lisez lisent', 'lu', 'lir', 'lis', 'lis');
  irr('écrire', 'schreiben', 'A2', 'écris écris écrit écrivons écrivez écrivent', 'écrit', 'écrir', 'écriv', 'écriv');
  irr('boire', 'trinken', 'A2', 'bois bois boit buvons buvez boivent', 'bu', 'boir', 'buv', 'boiv', 'buv');
  irr('attendre', 'warten', 'A2', 'attends attends attend attendons attendez attendent', 'attendu', 'attendr', 'attend', 'attend');
  irr('comprendre', 'verstehen', 'A2', 'comprends comprends comprend comprenons comprenez comprennent', 'compris', 'comprendr', 'compren', 'comprenn', 'compren');
  irr('apprendre', 'lernen', 'A2', 'apprends apprends apprend apprenons apprenez apprennent', 'appris', 'apprendr', 'appren', 'apprenn', 'appren');
  er('parler', 'sprechen', 'A2'); er('travailler', 'arbeiten', 'A2'); er('aimer', 'lieben / mögen', 'A2'); er('habiter', 'wohnen', 'A2');
  er('manger', 'essen', 'A2'); er('commencer', 'anfangen', 'A2');
  er('acheter', 'kaufen', 'A2', { boot: 'achèt', fut: 'achèter' });
  er('appeler', 'anrufen / nennen', 'A2', { boot: 'appell', fut: 'appeller' });
  er('arriver', 'ankommen', 'A2', { aux: 'être' }); er('rester', 'bleiben', 'A2', { aux: 'être' }); er('rentrer', 'heimkehren', 'A2', { aux: 'être' });
  ir('finir', 'beenden', 'A2');

  irr('dormir', 'schlafen', 'B1', 'dors dors dort dormons dormez dorment', 'dormi', 'dormir', 'dorm', 'dorm');
  irr('devenir', 'werden', 'B1', 'deviens deviens devient devenons devenez deviennent', 'devenu', 'deviendr', 'deven', 'devienn', 'deven', { aux: 'être' });
  irr('connaître', 'kennen', 'B1', 'connais connais connaît connaissons connaissez connaissent', 'connu', 'connaîtr', 'connaiss', 'connaiss');
  irr('ouvrir', 'öffnen', 'B1', 'ouvre ouvres ouvre ouvrons ouvrez ouvrent', 'ouvert', 'ouvrir', 'ouvr', 'ouvr');
  irr('vendre', 'verkaufen', 'B1', 'vends vends vend vendons vendez vendent', 'vendu', 'vendr', 'vend', 'vend');
  irr('répondre', 'antworten', 'B1', 'réponds réponds répond répondons répondez répondent', 'répondu', 'répondr', 'répond', 'répond');
  irr('envoyer', 'schicken', 'B1', 'envoie envoies envoie envoyons envoyez envoient', 'envoyé', 'enverr', 'envoy', 'envoi', 'envoy');
  er('préférer', 'vorziehen', 'B1', { boot: 'préfèr', futAlt: 'préfèrer' });
  er('oublier', 'vergessen', 'B1'); er('tomber', 'fallen', 'B1', { aux: 'être' });
  ir('choisir', 'wählen', 'B1'); ir('réussir', 'gelingen / bestehen', 'B1');

  irr('vivre', 'leben', 'B2', 'vis vis vit vivons vivez vivent', 'vécu', 'vivr', 'viv', 'viv');
  irr('croire', 'glauben', 'B2', 'crois crois croit croyons croyez croient', 'cru', 'croir', 'croy', 'croi', 'croy');
  irr('recevoir', 'erhalten', 'B2', 'reçois reçois reçoit recevons recevez reçoivent', 'reçu', 'recevr', 'recev', 'reçoiv', 'recev');
  irr('tenir', 'halten', 'B2', 'tiens tiens tient tenons tenez tiennent', 'tenu', 'tiendr', 'ten', 'tienn', 'ten');
  irr('courir', 'rennen', 'B2', 'cours cours court courons courez courent', 'couru', 'courr', 'cour', 'cour');
  irr('conduire', 'fahren / lenken', 'B2', 'conduis conduis conduit conduisons conduisez conduisent', 'conduit', 'conduir', 'conduis', 'conduis');
  ir('réfléchir', 'nachdenken', 'B2');

  const END = { imp: ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'], fut: ['ai', 'as', 'a', 'ons', 'ez', 'ont'], subj: ['e', 'es', 'e', 'ions', 'iez', 'ent'] };
  const AUX = { avoir: 'ai as a avons avez ont'.split(' '), 'être': 'suis es est sommes êtes sont'.split(' ') };
  const COMPOUND = { pc: 'pres', pqp: 'imp', futant: 'fut', condp: 'cond' };
  const vowel = (s) => /^[aeiouyéèêâîôûh]/i.test(s);
  /* liefert für Verb + Zeit 6 Einträge: { pron, form, accept[] } */
  function conjugate(v, t) {
    const out = [];
    for (let i = 0; i < 6; i++) {
      let form, acc = [];
      if (t === 'pres') form = v.pres[i];
      else if (t === 'imp') form = ((v.imp2 && END.imp[i][0] === 'i') ? v.imp2 : v.imp) + END.imp[i];
      else if (t === 'fut') { form = v.fut + END.fut[i]; if (v.futAlt) acc.push(v.futAlt + END.fut[i]); }
      else if (t === 'cond') { form = v.fut + END.imp[i]; if (v.futAlt) acc.push(v.futAlt + END.imp[i]); }
      else if (t === 'subj') form = v.subj ? v.subj[i] : ((i === 3 || i === 4) ? v.s2 : v.s1) + END.subj[i];
      else if (COMPOUND[t]) {
        const auxV = V.find((x) => x.inf === v.aux);
        const aux = COMPOUND[t] === 'pres' ? AUX[v.aux][i] : conjugate(auxV, COMPOUND[t])[i].form; let pp = v.pp;
        if (v.aux === 'être') {
          const pl = (x) => (/s$/.test(x) ? x : x + 's');
          const variants = i === 2 ? [pp, pp + 'e'] : i === 3 || i === 5 ? [pl(pp), pp + 'es'] : i === 4 ? [pp, pp + 'e', pl(pp), pp + 'es'] : [pp, pp + 'e'];
          pp = i <= 2 ? pp + '(e)' : i === 4 ? pp + '(e)(s)' : pp + '(e)s';
          variants.forEach((x) => acc.push(aux + ' ' + x));
        }
        form = aux + ' ' + pp;
      }
      if (v.inf === 'connaître') acc.push(form.replace(/î/g, 'i'));
      let pron = PRON[i];
      if (i === 0 && vowel(form)) pron = 'j’';
      if (t === 'subj') pron = (i === 2 || i === 5) ? 'qu’' + pron : 'que ' + pron;
      out.push({ pron, form, accept: [form].concat(acc) });
    }
    return out;
  }
  F.conj = { tenses: TENSES, verbs: V, conjugate, pronouns: PRON, stages: STAGES };
})();
