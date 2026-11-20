/* Grammatik-Kapitel Französisch. topics = Themen der Lückentexte (Feld t), für Übungen und Fehlerheft-Empfehlungen. */
(function () {
  const C = (id, l, t, topics, fr, de) => ({ id, l, t, topics, fr, de });
  window.LINGUA_PACKS.fr.grammar = [
    C('articles', 'A2', 'Les articles', ['articles', 'articles partitifs', 'articles contractés', 'quantité'],
`<p><b>Défini</b> (le, la, l’, les) : une chose connue ou en général. <i>J’aime <u>le</u> fromage.</i><br><b>Indéfini</b> (un, une, des) : une chose parmi d’autres. <i>J’ai acheté <u>un</u> fromage.</i><br><b>Partitif</b> (du, de la, de l’) : une quantité qu’on ne compte pas. <i>Je mange <u>du</u> fromage.</i></p>
<table><tr><th>Cas</th><th>Forme</th><th>Exemple</th></tr>
<tr><td>Après une négation</td><td>de / d’</td><td>Je n’ai pas <u>de</u> voiture.</td></tr>
<tr><td>Après une quantité</td><td>de / d’</td><td>un kilo <u>de</u> pommes, beaucoup <u>d’</u>amis</td></tr>
<tr><td>à + le / à + les</td><td>au / aux</td><td>Je vais <u>au</u> cinéma.</td></tr>
<tr><td>de + le / de + les</td><td>du / des</td><td>Il revient <u>du</u> travail.</td></tr></table>
<p>⚠️ Après <i>aimer, adorer, détester, préférer</i> : article défini (<i>Je déteste <u>le</u> café</i>).</p>`,
`Bestimmter Artikel = bekannte Sache oder allgemein; unbestimmter = eine von vielen; Teilungsartikel (du, de la) = unzählbare Menge. Nach Verneinung und Mengenangaben steht nur «de». à+le = au, de+le = du.`),
    C('prepositions', 'A2', 'Prépositions de lieu et de temps', ['prépositions', 'heure', 'temps', 'depuis / il y a'],
`<table><tr><th>Lieu</th><th>Préposition</th><th>Exemple</th></tr>
<tr><td>Ville</td><td>à</td><td>à Fribourg, à Genève</td></tr>
<tr><td>Pays féminin (-e)</td><td>en</td><td>en Suisse, en France, en Italie</td></tr>
<tr><td>Pays masculin</td><td>au</td><td>au Canada, au Portugal</td></tr>
<tr><td>Pays pluriel</td><td>aux</td><td>aux États-Unis</td></tr>
<tr><td>Chez une personne</td><td>chez</td><td>chez moi, chez le médecin</td></tr></table>
<table><tr><th>Temps</th><th>Sens</th><th>Exemple</th></tr>
<tr><td>depuis</td><td>seit (dure encore)</td><td>J’habite ici <u>depuis</u> deux ans.</td></tr>
<tr><td>il y a</td><td>vor (moment passé)</td><td>Je suis arrivé <u>il y a</u> deux ans.</td></tr>
<tr><td>pendant</td><td>während (durée finie)</td><td>J’ai dormi <u>pendant</u> huit heures.</td></tr>
<tr><td>dans</td><td>in (futur)</td><td>Je pars <u>dans</u> une semaine.</td></tr>
<tr><td>en</td><td>innerhalb von / Jahr, Monat</td><td>en 2026, en mars, <u>en</u> trois jours</td></tr></table>`,
`Städte: à; weibliche Länder: en; männliche: au; Plural: aux. depuis = seit (dauert an), il y a = vor, pendant = während, dans = in (Zukunft), en = innerhalb von / bei Jahr und Monat.`),
    C('pc', 'A2', 'Le passé composé', ['passé composé', 'verbes pronominaux', 'passé récent'],
`<p>Formation : <b>avoir</b> ou <b>être</b> au présent + participe passé. <i>J’<u>ai mangé</u>. Elle <u>est partie</u>.</i></p>
<p><b>Avec être</b> : les verbes de mouvement/changement (aller, venir, partir, arriver, entrer, sortir, monter, descendre, naître, mourir, rester, tomber, retourner, devenir…) et <b>tous les verbes pronominaux</b> (se lever, s’amuser…).</p>
<p>Avec <b>être</b>, le participe s’accorde avec le sujet : <i>Nous sommes allé<u>s</u>. Elle s’est levé<u>e</u>.</i></p>
<p>Participes fréquents : fait, dit, pris, mis, vu, lu, bu, eu, été, pu, voulu, su, dû, venu, écrit, ouvert, reçu.</p>
<p>Passé récent : <b>venir de</b> + infinitif = gerade eben. <i>Je <u>viens de</u> rentrer.</i></p>`,
`Perfekt mit avoir oder être + Partizip. Mit être: Bewegungs-/Zustandswechsel-Verben und alle reflexiven Verben; dann richtet sich das Partizip nach dem Subjekt.`),
    C('pc-imp', 'B1', 'Passé composé ou imparfait ?', ['imparfait', 'passé composé / imparfait'],
`<table><tr><th>Imparfait</th><th>Passé composé</th></tr>
<tr><td>Décor, description, état : <i>Il <u>faisait</u> beau.</i></td><td>Action ponctuelle, terminée : <i>Il <u>a commencé</u> à pleuvoir.</i></td></tr>
<tr><td>Habitude : <i>Je <u>jouais</u> au foot le mardi.</i></td><td>Une fois / nombre précis : <i>J’<u>ai joué</u> trois fois.</i></td></tr>
<tr><td>Action en cours : <i>Je <u>lisais</u>…</i></td><td>Action qui interrompt : <i>… quand le téléphone <u>a sonné</u>.</i></td></tr></table>
<p>Signaux : <i>souvent, toujours, d’habitude, chaque jour</i> → imparfait ; <i>soudain, tout à coup, un jour, hier à 8 h</i> → passé composé.</p>
<p>Formation de l’imparfait : radical de « nous » au présent + -ais, -ais, -ait, -ions, -iez, -aient (<i>nous finiss-ons → je finissais</i>). Exception : être → j’étais.</p>`,
`Imparfait = Hintergrund, Beschreibung, Gewohnheit, laufende Handlung. Passé composé = abgeschlossene, einmalige Handlung, die die Geschichte vorantreibt.`),
    C('pqp', 'B1', 'Le plus-que-parfait', ['plus-que-parfait'],
`<p>Le plus-que-parfait exprime une action <b>antérieure</b> à une autre action passée (Vorvergangenheit).</p>
<p>Formation : avoir / être à l’<b>imparfait</b> + participe passé. <i>J’<u>avais</u> fini. Elle <u>était</u> partie.</i></p>
<p><i>Quand je suis arrivé, le film <u>avait</u> déjà <u>commencé</u>.</i><br><i>Il a rendu le livre que je lui <u>avais prêté</u>.</i></p>`,
`Plusquamperfekt: Handlung, die vor einer anderen vergangenen Handlung liegt. Hilfsverb im Imparfait + Partizip.`),
    C('futur', 'B1', 'Le futur', ['futur simple', 'futur proche', 'futur antérieur', 'quand + futur'],
`<p><b>Futur proche</b> : aller + infinitif (proche, sûr). <i>Je <u>vais partir</u>.</i><br><b>Futur simple</b> : infinitif + -ai, -as, -a, -ons, -ez, -ont. <i>Je partir<u>ai</u>.</i></p>
<p>Radicaux irréguliers : être → ser-, avoir → aur-, aller → ir-, faire → fer-, venir → viendr-, pouvoir → pourr-, vouloir → voudr-, savoir → saur-, voir → verr-, devoir → devr-.</p>
<p>⚠️ Après <b>quand, dès que, lorsque</b> avec un sens futur, on met le futur (pas le présent comme en allemand) : <i>Quand tu <u>seras</u> à Lausanne, appelle-moi.</i></p>
<p><b>Futur antérieur</b> : avoir/être au futur + participe = action future terminée avant une autre. <i>Dès que j’<u>aurai fini</u>, je t’appellerai.</i></p>`,
`Nahe Zukunft: aller + Infinitiv. Futur simple: Infinitiv + Endungen (unregelmässige Stämme lernen). Nach quand/dès que mit Zukunftsbedeutung steht Futur. Futur antérieur = Futur II.`),
    C('conditionnel', 'B1', 'Conditionnel et phrases avec « si »', ['conditionnel', 'hypothèse', 'conditionnel passé', 'politesse', 'condition'],
`<p>Conditionnel présent = radical du futur + terminaisons de l’imparfait : <i>je voudr<u>ais</u>, nous pourr<u>ions</u></i>. Usages : politesse, souhait, conseil, information non confirmée.</p>
<table><tr><th>Type</th><th>Si + …</th><th>Principale</th></tr>
<tr><td>Réel</td><td>présent</td><td>présent / futur / impératif<br><i>Si tu viens, on <u>fera</u> une raclette.</i></td></tr>
<tr><td>Irréel présent</td><td>imparfait</td><td>conditionnel présent<br><i>Si j’<u>avais</u> le temps, je <u>lirais</u>.</i></td></tr>
<tr><td>Irréel passé</td><td>plus-que-parfait</td><td>conditionnel passé<br><i>Si j’<u>avais su</u>, je ne <u>serais</u> pas <u>venu</u>.</i></td></tr></table>
<p>⚠️ Jamais de conditionnel directement après <b>si</b> (« si j’aurais » est faux).</p>`,
`Konditional = Futurstamm + Imparfait-Endungen. Wenn-Sätze: si + Präsens → Futur; si + Imparfait → Konditional; si + Plusquamperfekt → Konditional Perfekt. Nie Konditional nach si.`),
    C('pronoms', 'B1', 'Les pronoms compléments (le, lui, leur…)', ['pronoms', 'double pronom'],
`<table><tr><th></th><th>COD (direkt)</th><th>COI (à + personne)</th></tr>
<tr><td>3e sing.</td><td>le, la, l’</td><td>lui</td></tr>
<tr><td>3e plur.</td><td>les</td><td>leur</td></tr>
<tr><td>autres</td><td colspan="2">me, te, nous, vous (COD et COI)</td></tr></table>
<p><i>Je vois Marie → je <u>la</u> vois. Je parle à Marie → je <u>lui</u> parle.</i><br>Verbes avec « à » : parler, téléphoner, écrire, répondre, donner, demander, conseiller <b>à</b> quelqu’un → lui/leur.</p>
<p>Place : avant le verbe conjugué, ou avant l’infinitif. <i>Je <u>le</u> vois. Je vais <u>le</u> voir.</i></p>
<p>Deux pronoms : <b>me/te/nous/vous</b> → <b>le/la/les</b> → <b>lui/leur</b> → y → en. <i>Je te <u>le</u> donne. Je <u>le lui</u> donne.</i></p>`,
`Direktes Objekt: le/la/les; indirektes (à + Person): lui/leur. Stellung vor dem konjugierten Verb bzw. vor dem Infinitiv. Reihenfolge bei zwei Pronomen: me/te → le/la/les → lui/leur → y → en.`),
    C('y-en', 'B1', 'Les pronoms y et en', ['pronom y', 'pronom en'],
`<p><b>y</b> remplace un lieu (à, dans, en, chez…) ou « à + chose ». <i>Tu vas à Berne ? Oui, j’<u>y</u> vais. Tu penses à ton rendez-vous ? J’<u>y</u> pense.</i></p>
<p><b>en</b> remplace « de + chose », un partitif ou une quantité. <i>Tu veux du pain ? J’<u>en</u> veux. Des enfants ? J’<u>en</u> ai deux. Tu as besoin de la voiture ? Oui, j’<u>en</u> ai besoin.</i></p>
<p>⚠️ Pour les personnes : à + personne → lui/leur ; de + personne → de lui / d’elle. <i>Je pense <u>à elle</u>. Je parle <u>de lui</u>.</i></p>`,
`y = dort/dorthin oder «à + Sache»; en = «de + Sache», Mengen, Teilungsartikel. Bei Personen stattdessen lui/leur bzw. de lui/d’elle.`),
    C('relatifs', 'B1', 'Les pronoms relatifs', ['pronoms relatifs', 'ce qui / ce que'],
`<table><tr><th>Pronom</th><th>Fonction</th><th>Exemple</th></tr>
<tr><td>qui</td><td>sujet</td><td>La femme <u>qui</u> parle…</td></tr>
<tr><td>que / qu’</td><td>COD</td><td>Le film <u>que</u> j’ai vu…</td></tr>
<tr><td>dont</td><td>verbe + de</td><td>Le livre <u>dont</u> je parle… (parler de)</td></tr>
<tr><td>où</td><td>lieu, temps</td><td>La ville <u>où</u> je suis né… le jour <u>où</u>…</td></tr>
<tr><td>préposition + lequel</td><td>chose après préposition</td><td>Le projet sur <u>lequel</u> je travaille…</td></tr>
<tr><td>préposition + qui</td><td>personne</td><td>Les amis avec <u>qui</u> je pars…</td></tr></table>
<p><b>ce qui</b> (sujet) / <b>ce que</b> (COD) / <b>ce dont</b> = « was ». <i>Dis-moi <u>ce que</u> tu veux. <u>Ce qui</u> me plaît, c’est le calme.</i></p>
<p>à + lequel → auquel ; de + lequel → duquel (près duquel, à côté duquel).</p>`,
`qui = Subjekt, que = direktes Objekt, dont = bei Verben mit «de», où = Ort/Zeit, Präposition + lequel (Sachen) bzw. + qui (Personen). ce qui/ce que = «was».`),
    C('comparaison', 'B1', 'Comparatif et superlatif', ['comparaison', 'superlatif', 'adverbes'],
`<p>Adjectif : <b>plus / moins / aussi</b> + adj. + <b>que</b>. Nom : <b>plus de / moins de / autant de</b> + nom + que. Verbe : verbe + <b>plus / moins / autant</b> + que.</p>
<p>Irréguliers : bon → <b>meilleur</b> (le meilleur) ; bien → <b>mieux</b> (le mieux) ; mauvais → plus mauvais / pire.</p>
<p>Superlatif : le/la/les plus + adj. + <b>de</b> : <i>le plus beau lac <u>de</u> Suisse</i>.</p>
<p>Adverbes : adjectif féminin + -ment (lente → lentement) ; -ant → -amment (courant → couramment) ; -ent → -emment (prudent → prudemment).</p>`,
`Vergleich: plus/moins/aussi … que. bon → meilleur, bien → mieux. Superlativ mit «de». Adverbbildung: weibliche Form + -ment.`),
    C('negation', 'A2', 'La négation', ['négation'],
`<p>ne … <b>pas</b> (nicht) · ne … <b>plus</b> (nicht mehr) · ne … <b>jamais</b> (nie) · ne … <b>rien</b> (nichts) · ne … <b>personne</b> (niemand) · ne … <b>aucun(e)</b> (kein einziger) · ne … <b>nulle part</b> (nirgends) · ne … <b>ni</b> … <b>ni</b> (weder … noch) · ne … <b>que</b> (nur).</p>
<p>Au passé composé : <i>Je n’ai <u>pas</u> mangé</i>, mais <i>Je n’ai vu <u>personne</u></i> (personne après le participe).</p>
<p>Après la négation : un/une/des/du → <b>de</b> : <i>Je n’ai pas <u>de</u> temps.</i> À l’oral, le « ne » disparaît souvent : <i>Je sais pas.</i></p>`,
`Verneinungen mit ne … pas/plus/jamais/rien/personne/aucun/nulle part/ni…ni/que. Nach Verneinung wird der Artikel zu «de». Mündlich fällt «ne» oft weg.`),
    C('subjonctif', 'B2', 'Le subjonctif', ['subjonctif', 'subjonctif / indicatif', 'indicatif / subjonctif', 'subjonctif passé', 'ne explétif'],
`<p>Formation : radical de « ils » au présent + -e, -es, -e, -ions, -iez, -ent (<i>ils finiss-ent → que je finisse</i>). Irréguliers : être (sois), avoir (aie), aller (aille), faire (fasse), pouvoir (puisse), savoir (sache), vouloir (veuille).</p>
<p><b>Après</b> : volonté (vouloir que, exiger que), nécessité (il faut que), sentiment (content que, désolé que, avoir peur que), doute (douter que, ne pas penser que), possibilité (il est possible que), et les conjonctions <b>bien que, pour que, avant que, à condition que, sans que, jusqu’à ce que, pourvu que, à moins que</b>.</p>
<p><b>Indicatif</b> après : penser que, croire que, être sûr que, espérer que, il est probable que, <b>après que</b>, parce que, pendant que.</p>
<p>« ne » explétif (sans sens négatif, registre soutenu) : <i>avant qu’il <u>ne</u> parte, j’ai peur qu’il <u>ne</u> soit tard</i>.</p>`,
`Subjonctif nach Wille, Notwendigkeit, Gefühl, Zweifel, Möglichkeit und bestimmten Konjunktionen (bien que, pour que, avant que …). Indikativ nach penser/croire (bejaht), espérer, être sûr, après que.`),
    C('accord', 'B2', 'L’accord du participe passé', ['accord du participe', 'participe passé'],
`<p><b>Avec être</b> : accord avec le sujet. <i>Elles sont parti<u>es</u>.</i></p>
<p><b>Avec avoir</b> : accord avec le COD <b>seulement s’il est placé avant</b> le verbe (pronom le/la/les, que, combien de, quel…). <i>Les clés ? Je les ai posé<u>es</u>. Les photos que j’ai pris<u>es</u>.</i> Mais : <i>J’ai posé les clés.</i> (pas d’accord)</p>
<p><b>Verbes pronominaux</b> : accord si « se » est COD (<i>Elle s’est lavé<u>e</u></i>), pas d’accord si le COD vient après ou si « se » est COI (<i>Elle s’est lavé les mains. Ils se sont écrit.</i>).</p>
<p>Fait + infinitif reste invariable : <i>Elle s’est fait couper les cheveux.</i></p>`,
`Mit être: Angleichung an das Subjekt. Mit avoir: nur, wenn das direkte Objekt VOR dem Verb steht. Reflexive Verben: Angleichung, wenn «se» direktes Objekt ist.`),
    C('indirect', 'B2', 'Le discours indirect', ['discours indirect'],
`<p>Verbe introducteur au <b>présent</b> : pas de changement de temps. <i>Il dit qu’il est malade.</i></p>
<p>Verbe introducteur au <b>passé</b> : concordance des temps.</p>
<table><tr><th>Direct</th><th>Indirect (passé)</th></tr>
<tr><td>présent</td><td>imparfait</td></tr><tr><td>passé composé</td><td>plus-que-parfait</td></tr>
<tr><td>futur</td><td>conditionnel</td></tr><tr><td>demain / hier</td><td>le lendemain / la veille</td></tr></table>
<p>Questions : oui/non → <b>si</b> ; qu’est-ce que → <b>ce que</b> ; qu’est-ce qui → <b>ce qui</b>. <i>Elle m’a demandé <u>ce que</u> je faisais.</i></p>`,
`Indirekte Rede: Einleitung in der Vergangenheit → Zeitverschiebung (Präsens → Imparfait, Futur → Konditional …). Fragen: si, ce que, ce qui.`),
    C('connecteurs', 'B2', 'Exprimer la cause, la conséquence, l’opposition, le but', ['connecteurs', 'concession', 'cause', 'conséquence', 'but', 'opposition', 'avoir beau'],
`<table><tr><th>Idée</th><th>+ nom</th><th>+ verbe</th></tr>
<tr><td>Cause</td><td>à cause de, grâce à, en raison de</td><td>parce que, puisque, car, comme</td></tr>
<tr><td>Conséquence</td><td>—</td><td>donc, alors, c’est pourquoi, si/tellement … que</td></tr>
<tr><td>Opposition / concession</td><td>malgré, en dépit de</td><td>mais, pourtant, cependant, alors que (ind.), bien que (subj.), même si (ind.)</td></tr>
<tr><td>But</td><td>pour, afin de (+ inf.)</td><td>pour que, afin que (+ subj.)</td></tr></table>
<p><i>grâce à</i> = cause positive, <i>à cause de</i> = cause négative. <b>Avoir beau</b> + infinitif = vergeblich : <i>J’ai beau chercher, je ne trouve pas.</i></p>`,
`Ursache: parce que, puisque, grâce à/à cause de. Folge: donc, c’est pourquoi. Gegensatz: malgré + Nomen, bien que + Subjonctif, même si/alors que + Indikativ. Zweck: pour + Infinitiv, pour que + Subjonctif.`),
    C('gerondif', 'B2', 'Gérondif et participe présent', ['gérondif', 'participe présent'],
`<p><b>Gérondif</b> = en + participe présent : deux actions simultanées, manière, condition. <i>Il chante <u>en cuisinant</u>. On apprend <u>en pratiquant</u>.</i> Le sujet est le même que celui du verbe principal.</p>
<p><b>Participe présent</b> (sans « en ») : surtout à l’écrit, remplace « qui » ou une cause. <i>Les personnes <u>ayant</u> un billet peuvent entrer. <u>Étant</u> malade, il est resté chez lui.</i> Invariable.</p>
<p>Formation : radical de « nous » + -ant (<i>nous fais-ons → faisant</i>). Irréguliers : être → étant, avoir → ayant, savoir → sachant.</p>`,
`Gérondif (en + -ant) = gleichzeitige Handlung / Art und Weise, gleiches Subjekt. Participe présent (ohne en) = schriftlich, ersetzt Relativsatz oder Grund.`),
    C('passif', 'B2', 'Le passif et « faire » + infinitif', ['passif', 'faire causatif'],
`<p><b>Passif</b> : être (au temps voulu) + participe passé (accordé) + <b>par</b> (agent). <i>La lettre <u>a été envoyée</u> hier. Ce roman <u>est lu par</u> des millions de personnes.</i> Souvent, on préfère « on » : <i>On a envoyé la lettre.</i></p>
<p><b>Faire + infinitif</b> = machen lassen : <i>Je <u>fais réparer</u> ma voiture.</i> Le participe « fait » reste invariable : <i>Elle s’est <u>fait</u> couper les cheveux.</i></p>`,
`Passiv: être + Partizip (+ par). Alternative: «on». «faire + Infinitiv» = etwas machen lassen; «fait» bleibt unverändert.`),
    C('soutenu', 'C1', 'Registre soutenu : inversion, passé simple', ['inversion', 'passé simple'],
`<p><b>Inversion</b> après certains adverbes en tête de phrase : <i>Peut-être <u>a-t-il</u> raison. Sans doute <u>est-ce</u> vrai. À peine <u>était-il</u> arrivé qu’il est reparti. Aussi <u>avons-nous</u> décidé…</i> (aussi = c’est pourquoi).</p>
<p><b>Passé simple</b> : temps du récit écrit (romans, histoire). On le reconnaît surtout à la 3e personne : <i>il parla, il finit, il fut, il eut, il fit, il vint, ils furent.</i></p>`,
`Gehobener Stil: Inversion nach peut-être, sans doute, à peine, aussi (= deshalb). Passé simple = Erzählzeit der Schriftsprache; meist nur erkennen können.`)
  ];
})();
