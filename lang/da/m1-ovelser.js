/* Dänisch – Monatspaket 1 (B1–C2): Wortschatz, Lückentexte, Quiz, Einstufungstest bis C2,
   Grammatik, Sprechen, Schreiben, Radio, KI-Szenarien. Schwerpunkt: Sprache ans Kind weitergeben, Tiere, Alltag.
   Nur anhängen. */
(function () {
  const P = window.LINGUA_PACKS.da;
  Object.assign(P.meta, {
    testLevels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], packName: 'Pakke 1 + Månedspakke B1–C2 (december 2026)',
    aiContext: 'They are interested in everyday life in Denmark, animals and especially in passing Danish on to a child (raising a bilingual child in Switzerland). Adapt the language to their level.'
  });

  /* Wortschatz [dänisch, deutsch, Niveau, Thema, Beispiel] – viele Sätze für den Alltag mit Kind */
  P.vocab.push(
    // Sprache mit dem Kind: Alltag (B1)
    ['Nu skal vi børste tænder', 'Jetzt putzen wir Zähne', 'B1', 'barn', 'Kom, nu skal vi børste tænder – først de øverste.'],
    ['Tag skoene på', 'Zieh die Schuhe an', 'B1', 'barn', 'Tag skoene på, vi skal gå nu.'],
    ['Er du sulten?', 'Hast du Hunger?', 'B1', 'barn', 'Er du sulten? Skal vi spise et æble?'],
    ['Skal du tisse?', 'Musst du Pipi?', 'B1', 'barn', 'Skal du tisse, før vi kører?'],
    ['Hvor er du dygtig!', 'Wie toll du das kannst!', 'B1', 'barn', 'Du har selv taget jakken på – hvor er du dygtig!'],
    ['Det gør ikke noget', 'Das macht nichts', 'B1', 'barn', 'Du spildte lidt mælk? Det gør ikke noget.'],
    ['Har du slået dig?', 'Hast du dich verletzt?', 'B1', 'barn', 'Av, har du slået dig? Kom, så puster jeg.'],
    ['Kom og få et kram', 'Komm, lass dich umarmen', 'B1', 'barn', 'Kom og få et kram, skat.'],
    ['Godnat, sov godt', 'Gute Nacht, schlaf gut', 'B1', 'barn', 'Godnat, sov godt, og drøm sødt.'],
    ['Drøm sødt', 'Träum süss', 'B1', 'barn', 'Godnat, skat. Drøm sødt.'],
    ['Pas på!', 'Pass auf!', 'B1', 'barn', 'Pas på, gulvet er glat!'],
    ['Vent lige lidt', 'Warte kurz', 'B1', 'barn', 'Vent lige lidt, jeg kommer nu.'],
    ['Hvad siger man?', 'Was sagt man? (Aufforderung zu Danke/Bitte)', 'B1', 'barn', 'Du fik en is. Hvad siger man? – Tak!'],
    ['Skal vi læse en historie?', 'Sollen wir eine Geschichte lesen?', 'B1', 'barn', 'Skal vi læse en historie, før du sover?'],
    ['bleen', 'die Windel', 'B1', 'barn', 'Skal vi skifte bleen?'],
    ['sutten', 'der Nuggi / Schnuller', 'B1', 'barn', 'Hvor er din sut?'],
    ['en bamse', 'ein Teddybär / Kuscheltier', 'B1', 'barn', 'Bamsen skal også sove.'],
    ['en klapvogn', 'ein Buggy', 'B1', 'barn', 'Vil du gå selv, eller vil du sidde i klapvognen?'],
    ['en legeplads', 'ein Spielplatz', 'B1', 'barn', 'Skal vi gå på legepladsen?'],
    ['en gynge / en rutsjebane', 'eine Schaukel / eine Rutschbahn', 'B1', 'barn', 'Først gyngen, så rutsjebanen.'],
    ['en vuggestue / en børnehave', 'eine Krippe / ein Kindergarten', 'B1', 'barn', 'Han går i børnehave fra klokken otte.'],
    ['en pædagog', 'eine Betreuungsperson (Kita)', 'B1', 'barn', 'Pædagogen sagde, at hun havde sovet godt.'],
    ['putte', 'ins Bett bringen', 'B1', 'barn', 'Jeg putter børnene klokken syv.'],
    ['trøste', 'trösten', 'B1', 'barn', 'Hun trøstede sin lillebror.'],
    ['drille', 'necken', 'B1', 'barn', 'Lad være med at drille din søster!'],
    ['en tumling', 'ein Kleinkind', 'B1', 'barn', 'Når man har en tumling, sker der altid noget.'],
    ['tosproget', 'zweisprachig', 'B1', 'barn', 'Vores datter vokser op tosproget.'],
    ['modersmål', 'Muttersprache', 'B1', 'barn', 'Mit modersmål er dansk.'],
    ['højtlæsning', 'Vorlesen', 'B1', 'barn', 'Højtlæsning er godt for ordforrådet.'],
    ['et rim / en remse', 'ein Reim / ein Sprüchlein', 'B1', 'barn', 'Vi siger en remse, når vi tæller tæer.'],
    // Tiere (B1)
    ['en hvalp / en killing', 'ein Welpe / ein Kätzchen', 'B1', 'dyr', 'Naboens kat har fået killinger.'],
    ['et kæledyr', 'ein Haustier', 'B1', 'dyr', 'Har I nogen kæledyr?'],
    ['en kanin / et marsvin', 'ein Kaninchen / ein Meerschweinchen', 'B1', 'dyr', 'Hun ønsker sig en kanin.'],
    ['en ko / en kalv', 'eine Kuh / ein Kalb', 'B1', 'dyr', 'Koen har fået en kalv.'],
    ['en gris / en hest / et får', 'ein Schwein / ein Pferd / ein Schaf', 'B1', 'dyr', 'På gården er der grise, heste og får.'],
    ['en høne / en hane', 'ein Huhn / ein Hahn', 'B1', 'dyr', 'Hanen galer om morgenen.'],
    ['en and', 'eine Ente', 'B1', 'dyr', 'Vi fodrer ænderne i parken.'],
    ['et egern', 'ein Eichhörnchen', 'B1', 'dyr', 'Egernet samler nødder.'],
    ['et pindsvin', 'ein Igel', 'B1', 'dyr', 'Pindsvinet sover om vinteren.'],
    ['en ræv / et rådyr', 'ein Fuchs / ein Reh', 'B1', 'dyr', 'Vi så et rådyr i skoven.'],
    ['en fugl / en rede', 'ein Vogel / ein Nest', 'B1', 'dyr', 'Fuglen bygger en rede.'],
    ['en sommerfugl / en mariehøne', 'ein Schmetterling / ein Marienkäfer', 'B1', 'dyr', 'Se, en mariehøne på din hånd!'],
    ['en dyrlæge', 'ein Tierarzt', 'B1', 'dyr', 'Katten skal til dyrlægen.'],
    ['fodre', 'füttern', 'B1', 'dyr', 'Må jeg fodre gederne?'],
    ['klappe', 'streicheln', 'B1', 'dyr', 'Du må gerne klappe hunden forsigtigt.'],
    ['gø / mjave', 'bellen / miauen', 'B1', 'dyr', 'Hunden gør, når det ringer på.'],
    ['vov / mjav / muh / øf', 'wau / miau / muh / oink (dänische Tierlaute)', 'B1', 'dyr', 'Hvad siger grisen? Øf, øf!'],
    // Alltag (B1)
    ['en madpakke', 'ein Lunchpaket', 'B1', 'hverdag', 'Har du husket din madpakke?'],
    ['vasketøj', 'Wäsche', 'B1', 'hverdag', 'Der ligger en bunke vasketøj.'],
    ['rydde op', 'aufräumen', 'B1', 'hverdag', 'Skal vi rydde op sammen?'],
    ['handle ind', 'einkaufen', 'B1', 'hverdag', 'Jeg handler ind efter arbejde.'],
    ['nå', 'erreichen / schaffen', 'B1', 'hverdag', 'Vi når ikke bussen!'],
    ['en aftale', 'eine Abmachung / ein Termin', 'B1', 'hverdag', 'Det er en aftale!'],

    // B2
    ['Kan du sige det på dansk?', 'Kannst du es auf Dänisch sagen?', 'B2', 'barn', 'Det var flot sagt – kan du også sige det på dansk?'],
    ['Hvad hedder det nu på dansk?', 'Wie heisst das noch auf Dänisch?', 'B2', 'barn', 'Den der … hvad hedder det nu på dansk? En rutsjebane!'],
    ['Det er ikke til diskussion', 'Darüber wird nicht diskutiert', 'B2', 'barn', 'Du skal have cykelhjelm på. Det er ikke til diskussion.'],
    ['Jeg tæller til tre', 'Ich zähle bis drei', 'B2', 'barn', 'Nu tæller jeg til tre: en, to …'],
    ['Lad være!', 'Lass das!', 'B2', 'barn', 'Lad være med at slå din bror!'],
    ['Hvordan har du det med det?', 'Wie fühlst du dich dabei?', 'B2', 'barn', 'Du skal starte i skole. Hvordan har du det med det?'],
    ['Jeg kan godt se, at du er ked af det', 'Ich sehe, dass du traurig bist', 'B2', 'barn', 'Jeg kan godt se, at du er ked af det. Vil du fortælle?'],
    ['et raserianfald', 'ein Wutanfall', 'B2', 'barn', 'Han fik et raserianfald i supermarkedet.'],
    ['en trodsalder', 'ein Trotzalter', 'B2', 'barn', 'Vores datter er midt i trodsalderen.'],
    ['sætte grænser', 'Grenzen setzen', 'B2', 'barn', 'Det er vigtigt at sætte klare grænser.'],
    ['en sprogstrategi', 'eine Sprachstrategie', 'B2', 'barn', 'Vores sprogstrategi er én forælder, ét sprog.'],
    ['flertalssprog / minoritetssprog', 'Mehrheitssprache / Minderheitensprache', 'B2', 'barn', 'Tysk er flertalssproget, dansk er minoritetssproget.'],
    ['sprogblanding', 'Sprachmischung', 'B2', 'barn', 'Sprogblanding er normalt hos tosprogede børn.'],
    ['omformulere', 'umformulieren', 'B2', 'barn', 'Jeg omformulerer, hvad hun siger, på dansk.'],
    ['konsekvent', 'konsequent', 'B2', 'barn', 'Vi prøver at være konsekvente.'],
    ['en legekammerat', 'ein Spielkamerad', 'B2', 'barn', 'Hun har fået en dansk legekammerat.'],
    ['et barnebarn', 'ein Enkelkind', 'B2', 'barn', 'Mormor savner sit barnebarn.'],
    ['mormor / morfar / farmor / farfar', 'Grosseltern (mütterlicher- / väterlicherseits)', 'B2', 'barn', 'Farfar bor i Odense, mormor i Aarhus.'],
    ['en billedbog', 'ein Bilderbuch', 'B2', 'barn', 'Vi læser en billedbog hver aften.'],
    ['en lydbog', 'ein Hörbuch', 'B2', 'barn', 'I bilen hører vi lydbøger på dansk.'],
    ['fastelavn', 'Fasnacht (mit Verkleiden und «Katze aus der Tonne schlagen»)', 'B2', 'barn', 'Til fastelavn klæder børnene sig ud.'],
    ['en julekalender', 'ein Adventskalender (auch TV-Serie)', 'B2', 'barn', 'Vi ser julekalenderen hver dag i december.'],
    ['tænde lys', 'Kerzen anzünden', 'B2', 'hverdag', 'Om vinteren tænder vi lys til morgenmaden.'],
    ['en hundetræner', 'ein Hundetrainer', 'B2', 'dyr', 'Hundetræneren gav os gode råd.'],
    ['sit / dæk / bliv', 'Sitz / Platz / Bleib (Hundekommandos)', 'B2', 'dyr', 'Sit! Dæk! Bliv! Dygtig hund!'],
    ['halte', 'hinken', 'B2', 'dyr', 'Hunden halter på det ene ben.'],
    ['en pote / en hale', 'eine Pfote / ein Schwanz', 'B2', 'dyr', 'Hunden logrer med halen.'],
    ['logre', 'wedeln (mit dem Schwanz)', 'B2', 'dyr', 'Han logrer, når vi kommer hjem.'],
    ['et internat (dyreinternat)', 'ein Tierheim', 'B2', 'dyr', 'Vi har fået katten fra et internat.'],
    ['et rovdyr / et byttedyr', 'ein Raubtier / ein Beutetier', 'B2', 'dyr', 'Ræven er et rovdyr, haren et byttedyr.'],
    ['en sæl / et marsvin (hval)', 'eine Robbe / ein Schweinswal', 'B2', 'dyr', 'I Lillebælt kan man se marsvin.'],
    ['en stork', 'ein Storch', 'B2', 'dyr', 'Storken er kommet tilbage!'],
    ['trækfugle', 'Zugvögel', 'B2', 'dyr', 'Trækfuglene flyver sydpå om efteråret.'],
    ['yngle', 'brüten', 'B2', 'dyr', 'Storken yngler på taget.'],
    ['en vane', 'eine Gewohnheit', 'B2', 'hverdag', 'Det er blevet en god vane.'],
    ['en børnefamilie', 'eine Familie mit Kindern', 'B2', 'hverdag', 'Livet i en børnefamilie er travlt.'],
    ['have dårlig samvittighed', 'ein schlechtes Gewissen haben', 'B2', 'hverdag', 'Jeg har dårlig samvittighed over, at jeg talte tysk.'],
    ['få hverdagen til at hænge sammen', 'den Alltag unter einen Hut bringen', 'B2', 'hverdag', 'Det er svært at få hverdagen til at hænge sammen.'],
    ['på skift', 'abwechselnd', 'B2', 'hverdag', 'Vi putter børnene på skift.'],
    ['nå at', 'es schaffen zu', 'B2', 'hverdag', 'Jeg nåede ikke at handle ind.'],
    ['give videre', 'weitergeben', 'B2', 'barn', 'Jeg vil gerne give dansk videre til min søn.'],

    // C1
    ['et hjertesprog', 'eine Herzenssprache', 'C1', 'barn', 'Dansk er mit hjertesprog.'],
    ['kodeskift', 'Code-Switching', 'C1', 'barn', 'Kodeskift er en naturlig del af tosproget tale.'],
    ['sprogligt input', 'sprachlicher Input', 'C1', 'barn', 'Barnet har brug for meget sprogligt input.'],
    ['en milepæl', 'ein Meilenstein', 'C1', 'barn', 'De første ord er en vigtig milepæl.'],
    ['halte bagefter', 'hinterherhinken', 'C1', 'barn', 'Hendes dansk halter lidt bagefter.'],
    ['fastholde', 'aufrechterhalten / festhalten an', 'C1', 'barn', 'Det kræver energi at fastholde sproget.'],
    ['overlevere', 'überliefern', 'C1', 'barn', 'Traditioner bliver overleveret fra generation til generation.'],
    ['en identitetsmarkør', 'ein Identitätsmerkmal', 'C1', 'barn', 'Sproget er en vigtig identitetsmarkør.'],
    ['sætte pris på', 'schätzen', 'C1', 'barn', 'Hun sætter pris på de danske traditioner.'],
    ['tage noget op', 'etwas ansprechen', 'C1', 'barn', 'Vi tog det op på forældremødet.'],
    ['give anledning til', 'Anlass geben zu', 'C1', 'barn', 'Det gav anledning til en god snak.'],
    ['være pinlig ved', 'sich schämen für', 'C1', 'barn', 'Han er pinlig ved, at jeg taler dansk.'],
    ['frygte', 'befürchten', 'C1', 'barn', 'Mange forældre frygter, at barnet bliver forvirret.'],
    ['fraråde', 'abraten', 'C1', 'barn', 'Eksperter fraråder at opgive modersmålet.'],
    ['en anelse', 'ein wenig / eine Ahnung', 'C1', 'hverdag', 'Det er en anelse for sødt.'],
    ['udbredt', 'verbreitet', 'C1', 'hverdag', 'Det er en udbredt opfattelse.'],
    ['entydig', 'eindeutig', 'C1', 'hverdag', 'Svaret er ikke entydigt.'],
    ['dyrevelfærd', 'Tierwohl', 'C1', 'dyr', 'Dyrevelfærd er et vigtigt emne i landbruget.'],
    ['en art / en bestand', 'eine Art / ein Bestand', 'C1', 'dyr', 'Bestanden af storke er lille.'],
    ['udryddet', 'ausgerottet', 'C1', 'dyr', 'Ulven var udryddet i Danmark i næsten 200 år.'],
    ['forvaltning', 'Management / Verwaltung', 'C1', 'dyr', 'Forvaltningen af ulven er til debat.'],
    ['sky', 'scheu', 'C1', 'dyr', 'Ræven er sky og ses sjældent.'],
    // C2
    ['indbegrebet af', 'der Inbegriff von', 'C2', 'barn', 'For mig er dansk indbegrebet af tryghed.'],
    ['en hæmsko', 'ein Hemmschuh', 'C2', 'barn', 'Sproget føltes som en hæmsko.'],
    ['påtvunget', 'aufgezwungen', 'C2', 'barn', 'Et påtvunget sprog bliver sjældent elsket.'],
    ['en balancegang', 'ein Balanceakt', 'C2', 'barn', 'Det er en svær balancegang.'],
    ['uden bagtanker', 'ohne Hintergedanken', 'C2', 'barn', 'Vi ser serien uden pædagogiske bagtanker.'],
    ['afspejle', 'widerspiegeln', 'C2', 'hverdag', 'Ordvalget afspejler holdningen.'],
    ['lægge op til', 'nahelegen', 'C2', 'hverdag', 'Formuleringen lægger op til debat.'],
    ['være i vælten', 'gefragt sein / im Trend liegen', 'C2', 'hverdag', 'Danske navne er i vælten igen.'],
    ['slå koldt vand i blodet', 'Ruhe bewahren', 'C2', 'hverdag', 'Slå koldt vand i blodet – det skal nok gå.'],
    ['have en finger med i spillet', 'die Finger im Spiel haben', 'C2', 'hverdag', 'Mormor har nok haft en finger med i spillet.']
  );

  /* Lückentexte */
  const G = (l, t, s, a, o, fr, de) => ({ l, t, s, a, o, fr, de });
  P.gaps.push(
    G('B1', 'adverbier', 'Han læser meget ___.', 'langsomt', ['langsomt', 'langsom', 'langsomme'], 'Adverbium dannes ofte med -t: langsom → langsomt.', 'Adverb meist mit -t.'),
    G('B1', 'adverbier', 'Vask hænderne ___!', 'grundigt', ['grundigt', 'grundig', 'grundige'], 'grundig → grundigt (adverbium).', 'grundig → grundigt.'),
    G('B1', 'flertal', 'Vi har tre ___ i dammen.', 'ænder', ['ænder', 'ander', 'andene'], 'en and → ænder (uregelmæssigt).', 'en and → ænder.'),
    G('B1', 'flertal', 'Bonden har tyve ___.', 'køer', ['køer', 'koer', 'kør'], 'en ko → køer.', 'en ko → køer.'),
    G('B1', 'flertal', 'Børnene har kolde ___.', 'fødder', ['fødder', 'foder', 'fødderne'], 'en fod → fødder.', 'en fod → fødder.'),
    G('B1', 'mange / meget', 'Vil du have ___ mælk?', 'mere', ['mere', 'flere', 'mange'], 'Utælleligt: meget – mere. Tælleligt: mange – flere.', 'Unzählbar: mere; zählbar: flere.'),
    G('B1', 'mange / meget', 'Der var ___ børn på legepladsen end i går.', 'flere', ['flere', 'mere', 'mest'], 'Tælleligt: flere børn.', 'Zählbar: flere.'),
    G('B1', 'imperativ', '___ skoene på!', 'Tag', ['Tag', 'Tage', 'Tager'], 'Bydeform = infinitiv uden -e: tage → tag.', 'Imperativ = Stamm ohne -e.'),
    G('B1', 'imperativ', '___ lige lidt!', 'Vent', ['Vent', 'Vente', 'Venter'], 'vente → vent!', 'vente → vent!'),
    G('B1', 'imperativ', '___ på, gulvet er glat!', 'Pas', ['Pas', 'Passe', 'Passer'], 'passe på → pas på!', 'passe → pas!'),
    G('B1', 'datid', 'Katten ___ hele natten.', 'sov', ['sov', 'sovede', 'sovet'], 'sove → sov → sovet.', 'sove → sov.'),
    G('B1', 'datid', 'Hvalpen ___ min sko i stykker.', 'bed', ['bed', 'bidte', 'bidt'], 'bide → bed → bidt.', 'bide → bed.'),
    G('B1', 'datid', 'Hun ___ sin bamse med i seng.', 'tog', ['tog', 'tagede', 'taget'], 'tage → tog → taget.', 'tage → tog.'),
    G('B1', 'da / når', '___ jeg var barn, havde vi en hund.', 'Da', ['Da', 'Når', 'Hvis'], 'Én gang/periode i fortiden → da.', 'Einmalig/Zeitraum in der Vergangenheit: da.'),
    G('B1', 'da / når', '___ hunden gør, kommer posten.', 'Når', ['Når', 'Da', 'Hvis at'], 'Gentagelse eller nutid → når.', 'Wiederholung/Gegenwart: når.'),
    G('B2', 'sin / hans', 'Mormor læser højt for ___ barnebarn.', 'sit', ['sit', 'sin', 'hendes'], 'Et barnebarn (et-ord) og subjektets eget → sit.', 'Neutrum + eigenes: sit.'),
    G('B2', 'sin / hans', 'Noah og ___ hund går tur.', 'hans', ['hans', 'sin', 'sit'], 'I subjektet: hans (ikke sin).', 'Innerhalb des Subjekts: hans.'),
    G('B2', 'sin / hans', 'Børnene leger med ___ legetøj.', 'deres', ['deres', 'sit', 'sine'], 'Flertal subjekt → deres.', 'Plural-Subjekt: deres.'),
    G('B2', 'ordstilling', 'Hun siger, at hun ___ vil i børnehave.', 'ikke', ['ikke', 'vil ikke', 'nej'], 'I bisætning: ikke før verbet.', 'Im Nebensatz «ikke» vor dem Verb.'),
    G('B2', 'ordstilling', 'Hvis han svarer på tysk, ___ jeg det på dansk.', 'gentager', ['gentager', 'jeg gentager', 'gentage'], 'Bisætning først → verbet først i hovedsætningen.', 'Nach vorangestelltem Nebensatz: Verb.'),
    G('B2', 'ordstilling', 'Jeg ved ikke, hvad hun ___.', 'hedder', ['hedder', 'hedder hun', 'heder'], 'Indirekte spørgsmål: subjekt før verbum (hvad hun hedder).', 'Indirekte Frage: Subjekt vor Verb.'),
    G('B2', 'passiv', 'Bøgerne ___ hver uge på biblioteket.', 'udlånes', ['udlånes', 'udlåner sig', 'er udlånt af'], 's-passiv for gentagne handlinger.', 's-Passiv bei Regelmässigem.'),
    G('B2', 'passiv', 'Ulven ___ i Jylland i 2012.', 'blev set', ['blev set', 'sås blev', 'var se'], 'Blive-passiv for en enkelt hændelse: blev set.', 'blive-Passiv für Einzelereignis.'),
    G('B2', 'refleksive verber', 'Børnene morer ___ over dyrelydene.', 'sig', ['sig', 'dem', 'sine'], 'more sig – 3. person flertal: sig.', 'Reflexiv 3. Person: sig.'),
    G('B2', 'refleksive verber', 'Vi glæder ___ til at se mormor.', 'os', ['os', 'sig', 'vores'], 'vi → os.', 'vi → os.'),
    G('B2', 'præpositioner', 'Han er helt vild ___ pindsvin.', 'med', ['med', 'efter', 'om'], 'være vild med = begeistert sein von.', '«vild med».'),
    G('B2', 'præpositioner', 'Hun er bange ___ hunde.', 'for', ['for', 'af', 'over'], 'bange for = Angst vor.', '«bange for».'),
    G('B2', 'præpositioner', 'Jeg er stolt ___ dig!', 'af', ['af', 'over', 'på'], 'stolt af = stolz auf.', '«stolt af».'),
    G('B2', 'præpositioner', 'Vi taler dansk ___ vores børn.', 'med', ['med', 'til', 'for'], 'tale med nogen.', '«tale med».'),
    G('B2', 'konjunktioner', 'Hun forstår dansk, ___ hun svarer på tysk.', 'selvom', ['selvom', 'fordi', 'så'], 'selvom = obwohl.', 'selvom = obwohl.'),
    G('C1', 'modalpartikler', 'Det er ___ bare en fjer – det gør ikke ondt.', 'jo', ['jo', 'da', 'vel'], '« jo » = fælles viden, beroligende.', '«jo» = wie wir beide wissen.'),
    G('C1', 'modalpartikler', 'Du kommer ___ i morgen, ikke?', 'vel', ['vel', 'jo', 'nu'], '« vel » = forventer bekræftelse.', '«vel» = erwartet Bestätigung (doch wohl).'),
    G('C1', 'modalpartikler', 'Det var ___ flot!', 'da', ['da', 'vel', 'jo'], '« da » forstærker en udråbssætning.', '«da» verstärkt einen Ausruf.'),
    G('C1', 'modalpartikler', 'Kom ___ og spis!', 'nu', ['nu', 'vel', 'jo'], '« nu » i opfordringer = endlich, komm schon.', '«nu» in Aufforderungen.'),
    G('C1', 'konjunktiv / ønske', 'Gid jeg ___ mere tid sammen med børnene!', 'havde', ['havde', 'har', 'have'], 'Gid + datid = ønske, der ikke er opfyldt.', '«gid» + Präteritum = irrealer Wunsch.'),
    G('C1', 'betinget', 'Havde jeg vidst det, ___ jeg have talt dansk fra starten.', 'ville', ['ville', 'vil', 'skulle at'], 'Inversion i stedet for « hvis »: Havde jeg vidst …, ville jeg …', 'Bedingung durch Inversion.'),
    G('C1', 'adjektiver', 'Det ___ barn faldt hurtigt i søvn.', 'trætte', ['trætte', 'træt', 'træts'], 'Bestemt form: det trætte barn.', 'Bestimmte Form: -e.'),
    G('C1', 'participier', 'Hun kom ___ ind ad døren.', 'løbende', ['løbende', 'løbet', 'løbe'], 'Præsens participium: løbende.', 'Partizip Präsens: løbende.'),
    G('C1', 'faste udtryk', 'Det kræver tålmodighed at ___ sproget.', 'fastholde', ['fastholde', 'holde fast', 'fastholder'], 'fastholde = aufrechterhalten.', 'fastholde.'),
    G('C1', 'faste udtryk', 'Hans bemærkning gav ___ til en lang diskussion.', 'anledning', ['anledning', 'lejlighed', 'grund'], 'give anledning til = Anlass geben zu.', '«give anledning til».'),
    G('C2', 'faste udtryk', 'Slå koldt vand i ___ – det skal nok gå.', 'blodet', ['blodet', 'hovedet', 'hjertet'], 'slå koldt vand i blodet = bevare roen.', 'Ruhe bewahren.'),
    G('C2', 'faste udtryk', 'For hende er dansk selve ___ af tryghed.', 'indbegrebet', ['indbegrebet', 'begrebet', 'grebet'], 'indbegrebet af = der Inbegriff von.', '«indbegrebet af».'),
    G('C2', 'faste udtryk', 'Hun gik ___ af nuancerne i sproget.', 'glip', ['glip', 'tabt', 'forbi'], 'gå glip af = verpassen.', '«gå glip af».'),
    G('C2', 'faste udtryk', 'Hans forklaring holder ikke ___.', 'vand', ['vand', 'stand', 'luft'], 'holde vand = stichhaltig sein.', '«holde vand».'),
    G('C2', 'ordstilling', 'Aldrig ___ jeg troet, at han ville tale dansk med sine egne børn.', 'havde', ['havde', 'jeg havde', 'har haft'], 'Nægtende adverbial først → inversion.', 'Negatives Adverbial vorn → Inversion.')
  );

  /* Quiz */
  const Q = (l, q, a, o, fr, de) => ({ l, q, a, o: [a].concat(o), fr, de });
  P.quiz.push(
    Q('B1', 'Hvad siger koen på dansk?', 'Muh', ['Vov', 'Øf', 'Rap'], 'Ko: muh · gris: øf · and: rap rap · hund: vov.', 'Kuh: muh.'),
    Q('B1', 'Hvad siger hanen på dansk?', 'Kykeliky', ['Kikeriki', 'Kuk-kuk', 'Mjav'], 'Dansk: kykeliky; tysk: kikeriki.', 'Dänisch: kykeliky.'),
    Q('B1', 'Hvad siger man til et barn, der skal sove?', 'Godnat, sov godt', ['Velbekomme', 'Held og lykke', 'Tak for sidst'], 'Godnat, sov godt – og drøm sødt.', 'Gute Nacht, schlaf gut.'),
    Q('B1', '« Mormor » er…', 'mors mor', ['fars mor', 'mors søster', 'oldemor'], 'Mormor = mors mor; farmor = fars mor.', 'Grossmutter mütterlicherseits.'),
    Q('B1', 'Falsk ven: « en sut » betyder…', 'ein Nuggi (Schnuller)', ['ein Anzug', 'eine Suppe', 'ein Kater'], 'Barnet vil have sin sut.', '«sut» = Schnuller.'),
    Q('B1', 'Falsk ven: « en bamse » betyder…', 'ein Teddybär', ['eine Bambusstange', 'ein Bambi', 'eine Banane'], 'En bamse er et tøjdyr.', 'Plüschtier.'),
    Q('B1', 'Hvad er en « vuggestue »?', 'Dagpasning for børn under tre år', ['En stue med en vugge', 'En børnehave for skolebørn', 'Et legetøjsbutik'], 'Vuggestue: 0–3 år; børnehave: 3–6 år.', 'Krippe für unter 3-Jährige.'),
    Q('B1', 'Falsk ven: « at drille » betyder…', 'necken', ['drillen (bohren)', 'drillen (Militär)', 'drei'], 'Lad være med at drille!', '«drille» = necken.'),
    Q('B2', 'Hvad betyder « én forælder, ét sprog »?', 'Hver forælder taler konsekvent sit eget sprog med barnet', ['Kun én forælder taler med barnet', 'Familien taler kun ét sprog', 'Barnet vælger sproget'], 'En udbredt strategi i tosprogede familier.', 'Jeder Elternteil spricht seine Sprache.'),
    Q('B2', 'Hvad er « omformulering » i tosproget opdragelse?', 'At gentage barnets udsagn på minoritetssproget', ['At skælde ud', 'At oversætte en bog', 'At tale langsomt'], 'Barnet hører den danske version uden at blive rettet.', 'Kindliche Aussage auf Dänisch aufgreifen.'),
    Q('B2', 'Fastelavn fejres i Danmark med…', 'udklædning og « slå katten af tønden »', ['fyrværkeri', 'påskeæg', 'juletræ'], 'Børn klæder sig ud og slår på en tønde fyldt med slik.', 'Verkleiden und Tonnenschlagen.'),
    Q('B2', 'Hvad er en dansk « julekalender » ud over en kalender?', 'En tv-serie for børn i december', ['En julefrokost', 'En sang', 'Et julemarked'], 'Hvert år sender tv en julekalender med 24 afsnit.', 'Weihnachts-TV-Serie für Kinder.'),
    Q('B2', 'Hundekommandoen « dæk » betyder…', 'Platz! (hinlegen)', ['Sitz!', 'Bleib!', 'Komm!'], 'sit = Sitz, dæk = Platz, bliv = Bleib.', '«dæk» = Platz.'),
    Q('B2', 'Hvornår bruger man « da » og ikke « når »?', 'Om én bestemt gang eller periode i fortiden', ['Om fremtiden', 'Om gentagne handlinger', 'I spørgsmål'], 'Da jeg var barn … / Når jeg kommer hjem …', '«da» für einmalig Vergangenes.'),
    Q('B2', 'Hvilket dyr vendte tilbage til Danmark i 2012?', 'Ulven', ['Bjørnen', 'Elgen', 'Bæveren'], 'Første vilde ulv i Jylland i næsten 200 år.', 'Der Wolf.'),
    Q('B2', 'Falsk ven: « en hale » betyder…', 'ein Schwanz (Tier)', ['eine Halle', 'ein Hals', 'ein Hagel'], 'Hunden logrer med halen.', '«hale» = Schwanz.'),
    Q('C1', 'Hvad udtrykker « jo » i « Det er jo søndag »?', 'At noget er kendt for begge', ['Tvivl', 'Vrede', 'Et spørgsmål'], 'jo = wie du ja weisst.', '«jo» = ja (bekanntlich).'),
    Q('C1', 'Hvad er « kodeskift »?', 'At skifte mellem sprog i samme samtale', ['At skifte adgangskode', 'At ændre stavemåde', 'At oversætte'], 'Et naturligt fænomen hos tosprogede.', 'Code-Switching.'),
    Q('C1', 'Hvad betyder « at halte bagefter »?', 'At være lidt forsinket i udviklingen', ['At gå bagved', 'At komme for sent', 'At være skadet'], 'Det ene sprog kan halte lidt bagefter.', 'Hinterherhinken.'),
    Q('C1', 'Hvad betyder « gid » i « Gid det var sommer »?', 'Ein irrealer Wunsch (wenn doch nur)', ['Eine Frage', 'Eine Drohung', 'Eine Vermutung'], 'Gid + datid = ønske.', 'Wunschpartikel.'),
    Q('C1', 'Hvad betyder « at sætte pris på noget »?', 'etwas schätzen', ['etwas bepreisen', 'etwas verkaufen', 'etwas bezahlen'], 'Jeg sætter pris på din hjælp.', 'schätzen.'),
    Q('C2', 'Hvad betyder « at slå koldt vand i blodet »?', 'Ruhe bewahren', ['kalt duschen', 'sich erkälten', 'wütend werden'], 'Bevare roen i en presset situation.', 'Ruhig bleiben.'),
    Q('C2', 'Hvad betyder « en hæmsko »?', 'etwas, das bremst oder behindert', ['ein Hausschuh', 'ein Hemd', 'ein Kinderschuh'], 'Noget, der hæmmer udviklingen.', 'Hemmschuh.'),
    Q('C2', 'Hvad betyder « framing » / « sproglige rammer »?', 'Wie die Wortwahl die Wahrnehmung prägt', ['Bilderrahmen', 'Grammatikregeln', 'Rahmenvertrag'], 'Ordvalg påvirker, hvordan vi opfatter et emne.', 'Sprachliche Rahmung.')
  );

  /* Einstufungstest: Ergänzung C1/C2 */
  const PL = P.placement;
  PL.vocab.push(
    { l: 'C1', q: '« fastholde »', a: 'aufrechterhalten', o: ['aufrechterhalten', 'festnehmen', 'festlegen', 'loslassen'] },
    { l: 'C1', q: '« udbredt »', a: 'verbreitet', o: ['verbreitet', 'ausgebreitet', 'ausgeschlafen', 'umständlich'] },
    { l: 'C1', q: '« fraråde »', a: 'abraten', o: ['abraten', 'erraten', 'befürworten', 'verraten'] },
    { l: 'C2', q: '« indbegrebet »', a: 'der Inbegriff', o: ['der Inbegriff', 'das Einbegreifen', 'die Inbetriebnahme', 'der Eingriff'] },
    { l: 'C2', q: '« påtvunget »', a: 'aufgezwungen', o: ['aufgezwungen', 'aufgetaut', 'angetrieben', 'aufgeweckt'] },
    { l: 'C2', q: '« en hæmsko »', a: 'ein Hemmschuh', o: ['ein Hemmschuh', 'ein Hausschuh', 'ein Hemd', 'ein Heimweg'] }
  );
  PL.grammar.push(
    { l: 'C1', q: 'Det er ___ bare en fjer!', a: 'jo', o: ['jo', 'vel', 'nu', 'da'] },
    { l: 'C1', q: 'Havde jeg vidst det, ___ jeg være kommet.', a: 'ville', o: ['ville', 'vil', 'havde', 'skal'] },
    { l: 'C1', q: 'Gid jeg ___ ferie!', a: 'havde', o: ['havde', 'har', 'have', 'har haft'] },
    { l: 'C2', q: 'Aldrig ___ jeg set noget lignende.', a: 'har', o: ['har', 'jeg har', 'havde jeg', 'har jeg ikke'] },
    { l: 'C2', q: 'Hun gik ___ af pointen.', a: 'glip', o: ['glip', 'forbi', 'tabt', 'ud'] },
    { l: 'C2', q: 'Det lægger ___ til en grundig debat.', a: 'op', o: ['op', 'ned', 'ud', 'til'] }
  );
  PL.reading.push(
    { l: 'C1', p: 'Selvom forskningen er omfattende, lever myten om, at to sprog forvirrer barnet, videre blandt både forældre og fagfolk.', q: 'Hvad siger sætningen?', a: 'En myte overlever trods forskningen', o: ['En myte overlever trods forskningen', 'Forskningen bekræfter myten', 'Der findes ingen forskning', 'Fagfolk har aldrig hørt om myten'] },
    { l: 'C1', p: 'Det er vanskeligt at adskille dyrets betydning fra andre faktorer, da familier med hund ofte har en mere aktiv livsstil.', q: 'Hvorfor er det vanskeligt?', a: 'Andre faktorer påvirker også resultatet', o: ['Andre faktorer påvirker også resultatet', 'Hunde er for dyre', 'Familier lyver', 'Der er for få hunde'] },
    { l: 'C1', p: 'Når man er træt og irriteret, falder man let tilbage til sit stærkeste sprog – og sender dermed et utilsigtet signal.', q: 'Hvad er det utilsigtede signal?', a: 'At det stærkeste sprog er det « rigtige » i alvorlige situationer', o: ['At det stærkeste sprog er det « rigtige » i alvorlige situationer', 'At man er glad', 'At barnet har gjort noget godt', 'At man er træt af barnet'] },
    { l: 'C2', p: 'Fasen er sjældent et udtryk for afvisning af forælderen som sådan, men snarere for et intenst behov for at passe ind.', q: 'Hvordan tolkes fasen?', a: 'Som et behov for at høre til, ikke som afvisning', o: ['Som et behov for at høre til, ikke som afvisning', 'Som had', 'Som manglende sprogevner', 'Som et tegn på sygdom'] },
    { l: 'C2', p: 'Den, der taler om « forvaltning », lægger op til en mere administrativ og afbalanceret tilgang end den, der taler om « bekæmpelse ».', q: 'Hvad lægger ordet « forvaltning » op til?', a: 'En mere afbalanceret tilgang', o: ['En mere afbalanceret tilgang', 'En aggressiv tilgang', 'Ingen tilgang', 'Et forbud'] },
    { l: 'C2', p: 'Måske er det netop dét, der adskiller et overleveret sprog fra et påtvunget: om barnet oplever, at sproget åbner døre.', q: 'Hvad er det afgørende ifølge sætningen?', a: 'Om barnet oplever sproget som noget, der åbner muligheder', o: ['Om barnet oplever sproget som noget, der åbner muligheder', 'Hvor mange ord barnet kan', 'Hvor gammelt barnet er', 'Om forældrene taler perfekt'] }
  );
  PL.listening.push(
    { l: 'C1', t: 'Det er ikke fordi, jeg ikke kan lide dansk – jeg gider bare ikke være den eneste i klassen, der er anderledes.', q: 'Hvad er barnets egentlige problem?', a: 'At føle sig anderledes', o: ['At føle sig anderledes', 'At dansk er svært', 'At læreren er streng', 'At det ikke kan lide sine forældre'] },
    { l: 'C1', t: 'Vi har besluttet at skrue lidt ned for kravene og i stedet satse på ferier i Danmark og videoopkald med fætrene.', q: 'Hvad har familien besluttet?', a: 'Færre krav, mere oplevelse', o: ['Færre krav, mere oplevelse', 'At flytte til Danmark', 'At stoppe med dansk', 'At sende barnet på kostskole'] },
    { l: 'C1', t: 'Hunden reagerer kun på danske kommandoer, så børnene har simpelthen ikke noget valg.', q: 'Hvorfor bruger børnene dansk med hunden?', a: 'Fordi hunden kun forstår danske kommandoer', o: ['Fordi hunden kun forstår danske kommandoer', 'Fordi de elsker dansk', 'Fordi forældrene tvinger dem', 'Fordi hunden er fra Danmark'] },
    { l: 'C2', t: 'Det ville være naivt at tro, at sproget bliver ved med at leve af sig selv; det kræver en bevidst indsats, men ikke nødvendigvis en anstrengt en.', q: 'Hvad mener personen?', a: 'Det kræver bevidsthed, men behøver ikke at være anstrengende', o: ['Det kræver bevidsthed, men behøver ikke at være anstrengende', 'Sproget lever af sig selv', 'Det er umuligt', 'Det skal være hårdt'] },
    { l: 'C2', t: 'Man kan sige meget om ordvalget i debatten, men neutralt er det i hvert fald ikke.', q: 'Hvordan vurderer personen ordvalget?', a: 'Som ikke-neutralt', o: ['Som ikke-neutralt', 'Som helt objektivt', 'Som ligegyldigt', 'Som for teknisk'] },
    { l: 'C2', t: 'Jeg skammede mig over mit danske, da jeg var tretten. I dag ville jeg ønske, at jeg havde brugt det mere.', q: 'Hvordan har personens holdning ændret sig?', a: 'Fra skam til fortrydelse over ikke at have brugt det', o: ['Fra skam til fortrydelse over ikke at have brugt det', 'Fra stolthed til skam', 'Den er uændret', 'Personen har glemt dansk'] }
  );

  /* Grammatik */
  const C = (id, l, t, topics, fr, de) => ({ id, l, t, topics, fr, de });
  P.grammar.push(
    C('barnesprog', 'B1', 'Sprog til barnet: bydeform, adverbier og « da / når »', ['imperativ', 'adverbier', 'da / når', 'mange / meget'],
`<p><b>Bydeform</b> = infinitiv uden -e: <i>tage → <u>Tag</u> skoene på! vente → <u>Vent</u>! passe på → <u>Pas</u> på!</i> Høfligere: <i>Vil du ikke lige …?</i></p>
<p><b>Adverbier</b> får ofte -t: <i>Gå <u>forsigtigt</u>. Vask hænderne <u>grundigt</u>.</i></p>
<p><b>da / når</b>: <i><u>Da</u> jeg var barn …</i> (én gang i fortiden) · <i><u>Når</u> vi kommer hjem …</i> (fremtid/gentagelse).</p>
<p><b>meget / mere</b> + utælleligt (mælk, vand) · <b>mange / flere</b> + tælleligt (børn, ænder).</p>
<p>💡 Sprogtip: Sig højt, hvad du gør (« Nu hælder jeg mælk i koppen »), og gentag barnets ord på dansk i stedet for at rette.</p>`,
`Imperativ = Stamm ohne -e. Adverb meist mit -t. «da» = als (einmalig Vergangenheit), «når» = wenn/immer wenn. meget/mere bei Unzählbarem, mange/flere bei Zählbarem.`),
    C('passiv2', 'B2', 'Passiv, sin/hans og præpositionsforbindelser', ['passiv', 'sin / hans', 'præpositioner', 'konjunktioner', 'refleksive verber'],
`<p><b>s-passiv</b> for det generelle og gentagne: <i>Bøgerne udlån<u>es</u> hver uge.</i> · <b>blive-passiv</b> for enkelte hændelser: <i>Ulven <u>blev set</u> i 2012.</i></p>
<p><b>sin / sit / sine</b> peger tilbage på subjektet (3. person ental). Ved flertal: <i>deres</i>. I subjektet selv: <i>hans/hendes</i>.</p>
<p>Faste forbindelser: <i>vild <u>med</u>, bange <u>for</u>, stolt <u>af</u>, glad <u>for</u>, interesseret <u>i</u>, tale <u>med</u>, passe <u>på</u>.</i></p>`,
`s-Passiv: allgemein/wiederholt; blive-Passiv: einzelnes Ereignis. sin/sit/sine nur bei Subjekt 3. Person Singular. Feste Präpositionen lernen.`),
    C('partikler', 'C1', 'Modalpartikler og ønsker', ['modalpartikler', 'konjunktiv / ønske', 'betinget', 'participier'],
`<table><tr><th>partikel</th><th>funktion</th><th>eksempel</th></tr>
<tr><td>jo</td><td>fælles viden, berolige</td><td>Det er <u>jo</u> bare en fjer.</td></tr>
<tr><td>da</td><td>forstærke, undre sig</td><td>Det var <u>da</u> flot! / Hvor er den <u>da</u>?</td></tr>
<tr><td>vel</td><td>forvente bekræftelse</td><td>Du kommer <u>vel</u> i morgen?</td></tr>
<tr><td>nu</td><td>opfordring, utålmodighed</td><td>Kom <u>nu</u>!</td></tr>
<tr><td>skam</td><td>forsikre</td><td>Det er <u>skam</u> rigtigt.</td></tr></table>
<p><b>Ønsker</b>: <i><u>Gid</u> jeg havde mere tid!</i> · <b>Betingelse med inversion</b>: <i><u>Havde</u> jeg vidst det, <u>ville</u> jeg …</i></p>
<p>Partiklerne er sjældent i lærebøger, men overalt i talesproget – og en stor del af det, et barn « arver ».</p>`,
`Modalpartikeln (jo, da, vel, nu, skam) färben die Aussage wie «ja, doch, wohl, schon» im Deutschen. «gid» + Präteritum = irrealer Wunsch. Bedingung auch durch Inversion.`),
    C('stil', 'C2', 'Faste vendinger og stilistisk ordstilling', ['faste udtryk', 'ordstilling'],
`<p>Idiomer giver sproget farve: <i>slå koldt vand i blodet, gå glip af, holde vand, have en finger med i spillet, indbegrebet af, give anledning til.</i></p>
<p><b>Inversion for at fremhæve</b>: <i><u>Aldrig</u> har jeg set noget lignende. <u>Kun sjældent</u> taler han tysk derhjemme.</i></p>
<p>💡 Ordvalg er aldrig helt neutralt: « bekæmpelse » vs. « forvaltning », « hjemvendt » vs. « indvandret ». Læg mærke til, hvilke briller ordene giver.</p>`,
`Redewendungen bereichern den Ausdruck. Zur Betonung kann ein (negatives) Adverbial vorangestellt werden → Inversion.`)
  );

  /* Sprechen */
  const S = (id, l, t, fr, de, secs, expr, check) => ({ id, l, t, fr, de, secs, expr, check });
  P.speaking.push(
    S('dms01', 'B1', 'Godnathistorie', 'Læs « Lille Pindsvin finder et hjem » højt, som om du læste for et barn: langsomt, med pauser og forskellige stemmer.', 'Lies die Igel-Geschichte vor, als würdest du einem Kind vorlesen.', 90, ['Der var engang…', 'Og så…', 'Hvad tror du, der sker nu?', 'Godnat, …'], ['Jeg læste langsomt og tydeligt', 'Jeg brugte forskellige stemmer', 'Jeg stillede mindst ét spørgsmål undervejs']),
    S('dms02', 'B1', 'Kommentér din morgen', 'Forestil dig, at du laver morgenmad med dit barn. Sig højt alt, hvad du gør, i et minut.', 'Kommentiere laut eine Frühstückssituation mit Kind.', 60, ['Nu tager jeg…', 'Skal du have…?', 'Se, her er…', 'Hvor er din…?'], ['Mindst 5 forskellige verber', 'Mindst 2 spørgsmål til barnet', 'Bydeform (Tag …, Kom …)']),
    S('dms03', 'B2', 'Dyrene på gården', 'Beskriv for et barn, hvilke dyr der bor på en bondegård, hvad de siger, og hvad de giver os.', 'Erkläre einem Kind die Tiere auf dem Bauernhof.', 75, ['Koen giver os…', 'Hønen lægger…', 'Grisen siger…', 'Ved du hvad?'], ['Mindst 4 dyr', 'Dyrelyde på dansk', 'Enkle forklaringer']),
    S('dms04', 'B2', 'Trøst', 'Dit barn er faldet og græder. Trøst det på dansk, anerkend følelsen, og afled opmærksomheden.', 'Tröste ein weinendes Kind auf Dänisch.', 45, ['Av, har du slået dig?', 'Jeg kan godt se…', 'Kom, så puster vi.', 'Skal vi…?'], ['Jeg anerkendte følelsen', 'Rolig og varm tone', 'Et forslag til at komme videre']),
    S('dms05', 'C1', 'Forklar jeres sprogstrategi', 'En pædagog spørger, hvordan I håndterer to sprog derhjemme. Forklar jeres strategi og begrund den.', 'Erkläre einer Betreuungsperson eure Sprachstrategie.', 90, ['Hos os har vi valgt at…', 'Grunden er…', 'Vi har oplevet, at…', 'Vi vil gerne have, at I…'], ['Klar beskrivelse', 'Mindst én begrundelse', 'Et konkret ønske til samarbejdet']),
    S('dms06', 'C2', 'Holdning: Er det egoistisk at insistere på sit modersmål?', 'Argumentér for og imod: Er det egoistisk at insistere på at tale sit modersmål med sit barn i et andet land?', 'Argumentiere: Ist es egoistisch, auf der Muttersprache zu bestehen?', 120, ['På den ene side…', 'På den anden side…', 'Man kan indvende, at…', 'Alt i alt mener jeg…'], ['Argumenter for og imod', 'Nuanceret konklusion', 'Mindst én modalpartikel (jo, da, vel)'])
  );

  /* Schreiben */
  const W = (id, l, type, t, fr, de, words, expr, check, model) => ({ id, l, type, t, fr, de, words, expr, check, model });
  P.writing.push(
    W('dmw01', 'B1', 'besked', 'Besked til mormor', 'Skriv en besked til mormor i Danmark: fortæl om noget sjovt, barnet har sagt eller gjort på dansk.', 'Nachricht an die Grossmutter über etwas Lustiges, das das Kind auf Dänisch gesagt hat.', [40, 80], ['Kære mor/mormor', 'I går sagde Noah…', 'Han er vild med…', 'Mange knus'], ['Datid', 'En konkret episode', 'Hilsen'],
      'Kære mor\nI går sagde Noah pludselig « Godnat, sov godt, drøm sødt » til sin bamse – på dansk! Han har helt sikkert lært det af dig. Han er vild med pindsvinebogen, så du må gerne læse den igen på søndag.\nMange knus fra os alle'),
    W('dmw02', 'B2', 'rim', 'Dit eget hverdagsrim', 'Skriv et lille rim (4–8 linjer) til en hverdagssituation med barnet, fx påklædning, tandbørstning eller badetid.', 'Schreibe einen kleinen Alltagsreim für dein Kind.', [20, 60], ['…, …, nu skal vi…', 'først…, så…', 'en, to, tre…'], ['Rim eller rytme', 'Hverdagsord', 'Let at gentage'],
      'Tandbørste, tandbørste, op og ned,\nfrem og tilbage, nu er vi ved.\nFørst de store, så de små,\nnu kan vi godt i seng at gå!'),
    W('dmw03', 'B2', 'e-mail', 'Til børnehaven', 'Skriv en e-mail til børnehaven: Fortæl, at jeres barn vokser op tosproget, og bed om hjælp til at støtte begge sprog.', 'E-Mail an den Kindergarten über die Zweisprachigkeit des Kindes.', [80, 150], ['Kære personale', 'Vi vil gerne fortælle, at…', 'Det ville betyde meget for os, hvis…', 'Venlig hilsen'], ['Høflig tone', 'Konkret anmodning', 'Begrundelse'],
      'Kære personale\nVi vil gerne fortælle lidt om Ellas sprog. Hun vokser op med dansk (mor) og schweizertysk (far). Hun forstår begge sprog, men blander dem tit, hvilket er helt normalt for tosprogede børn.\nDet ville betyde meget for os, hvis I vil fortælle os, når hun bruger danske ord hos jer. Vi giver også gerne en dansk billedbog med, som I kan læse sammen.\nTak for jeres store indsats.\nVenlig hilsen\nSofie og Lukas'),
    W('dmw04', 'C1', 'indlæg', 'Debatindlæg', 'Skriv et kort debatindlæg til en forældregruppe: « Tosprogethed er en gave – men ikke en selvfølge ».', 'Kurzer Debattenbeitrag zur Zweisprachigkeit.', [150, 250], ['Mange tror, at…', 'Men erfaringen viser…', 'Derfor er det vigtigt at…', 'Kort sagt…'], ['Klar tese', 'Argumenter med eksempler', 'Konklusion'],
      'Mange tror, at børn helt af sig selv bliver tosprogede, blot fordi forældrene taler to sprog. Men erfaringen viser, at det svageste sprog hurtigt forsvinder, hvis det ikke bliver plejet. Barnet vælger naturligt det sprog, der er mest nyttigt i hverdagen – og i Schweiz er det tysk.\nDerfor er det vigtigt at skabe situationer, hvor dansk giver mening: faste ritualer som højtlæsning, regelmæssig kontakt med familien i Danmark og gerne ferier, hvor barnet oplever sproget i brug.\nKort sagt: Tosprogethed er en gave, men en gave, der skal pakkes ud hver dag.'),
    W('dmw05', 'C2', 'essay', 'Hvad giver vi videre?', 'Skriv et refleksivt essay: Hvad giver man videre med et sprog – ud over ord og grammatik?', 'Reflexiver Essay: Was gibt man mit einer Sprache weiter?', [250, 400], ['Når vi taler om…', 'Det er påfaldende, at…', 'Man kunne indvende…', 'Måske er det i sidste ende…'], ['Personlige eksempler', 'Nuancer og modargumenter', 'Sproglig variation'],
      'Når vi taler om at give et sprog videre, tænker de fleste på gloser og bøjninger. Men det, der virkelig bliver overleveret, er langt sværere at sætte ord på. Det er måden, man trøster på, de små drillerier ved middagsbordet, og de partikler – jo, da, vel – der får en sætning til at lyde som hjemme.\nDet er påfaldende, at børn ofte husker sprogets følelser længe efter, at de har glemt ordene. Man kunne indvende, at det er et romantisk syn, og at et sprog, der ikke bruges, til sidst forsvinder. Det er rigtigt. Men måske er det netop følelsen, der får dem til at vende tilbage til sproget som voksne.\nMåske er det i sidste ende ikke et sprog, vi giver videre, men en måde at være i verden på.')
  );

  /* Radio & Audio: Ergänzungen für Eltern und Kinder */
  P.radio.sources.push(
    { name: 'DR Ramasjang (børneradio)', l: 'B1', kind: 'radio', desc: 'Børnemusik og sange på dansk – godt i baggrunden derhjemme og i bilen.', url: 'https://www.dr.dk/lyd' },
    { name: 'Sleepy Time – Godnathistorier for Børn', l: 'B1', kind: 'podcast', desc: 'Rolige danske godnathistorier for 3–10-årige (Lisa Ludvigsen).', url: 'https://www.audible.co.uk/podcast/Sleepy-Time-Godnathistorier-For-Born/B0DWT1FWRK' }
  );
  P.radio.tips.push(
    ['Lyt sammen', 'Hør en dansk børnesang eller godnathistorie sammen med barnet, og snak bagefter om den: Hvilke dyr var med? Hvad var sjovest?', 'Gemeinsam mit dem Kind hören und danach darüber sprechen.']
  );

  /* KI-Szenarien */
  P.aiScenarios.push(
    { id: 'barn', ic: '🧒', t: 'Snak med et barn (4 år)', role: 'a cheerful 4-year-old bilingual child living in Switzerland who understands Danish but often answers in German or mixes languages', task: 'The learner is the parent and practises speaking Danish with the child (playing, eating, bedtime). The child sometimes answers in German; the learner should respond in Danish and recast. Give short feedback on how child-friendly and natural the learner’s Danish is.', min: 'B1' },
    { id: 'paedagog', ic: '🧸', t: 'Forældresamtale', role: 'a Danish kindergarten teacher (pædagog) at a parent meeting', task: 'Discuss the child’s bilingual development, language strategy at home and cooperation with the kindergarten.', min: 'B2' },
    { id: 'mormor', ic: '👵', t: 'Mormor i telefonen', role: 'a warm Danish grandmother living in Aarhus who wants to support her grandchild’s Danish', task: 'Plan together how the grandmother can help with Danish (video calls, books, holidays). Use natural spoken Danish with modal particles.', min: 'B1' },
    { id: 'dyrlaege', ic: '🐾', t: 'Hos dyrlægen', role: 'a Danish veterinarian', task: 'The learner brings a pet (dog or cat) with a problem. Ask questions, explain treatment and give advice.', min: 'B2' }
  );
})();
