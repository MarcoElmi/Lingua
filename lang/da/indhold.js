/* Dänisch: Lesetexte, geführte Dialoge, Laute, Zahlen, Grammatik, Sprechen, Schreiben, Radio, KI-Szenarien. Nur anhängen. */
(function () {
  const P = window.LINGUA_PACKS.da;
  const R = (id, l, topic, title, text, qs, gl) => ({ id, l, topic, title, text,
    questions: qs.map(([q, a, w, fr, de]) => ({ q, a, o: [a].concat(w), fr, de })), glossary: gl.map(([fr, de, ex]) => ({ fr, de, ex })) });
  P.reading = [
    R('d1r01', 'A1', 'hverdag', 'Det er mig',
`Hej! Jeg hedder Line, og jeg er 32 år. Jeg bor i Aarhus med min mand og vores søn, Oskar. Oskar er fem år og går i børnehave.
Jeg arbejder på et apotek i centrum. Om morgenen står jeg op klokken halv syv og drikker en kop kaffe. Jeg cykler på arbejde.
I min fritid går jeg ture ved stranden og laver mad. Om søndagen spiser vi tit hos mine forældre.`,
      [['Hvor arbejder Line?', 'På et apotek', ['På et hospital', 'På en skole', 'På en restaurant'], 'Hun arbejder på et apotek i centrum.', 'Sie arbeitet in einer Apotheke.'],
       ['Hvordan kommer hun på arbejde?', 'Hun cykler', ['Med tog', 'Til fods', 'I bil'], '« Jeg cykler på arbejde. »', 'Mit dem Velo.'],
       ['Hvor gammel er Oskar?', 'Fem år', ['Seks år', '32 år', 'Tre år'], '« Oskar er fem år ».', 'Fünf.'],
       ['Hvad gør familien om søndagen?', 'Spiser hos Lines forældre', ['Går til stranden', 'Arbejder', 'Går i biografen'], '« Om søndagen spiser vi tit hos mine forældre. »', 'Sie essen bei Lines Eltern.']],
      [['en børnehave', 'ein Kindergarten', 'Oskar går i børnehave.'], ['stå op', 'aufstehen', 'Jeg står op klokken halv syv.'], ['halv syv', 'halb sieben (6:30!)', 'Klokken er halv syv.'], ['tit', 'oft', 'Vi spiser tit hos mine forældre.']]),
    R('d1r02', 'A1', 'restaurant', 'På caféen',
`Café Havnen – Nyhavn
Kaffe: 38 kr. · Cappuccino: 45 kr. · Wienerbrød: 32 kr.
Smørrebrød med æg og rejer: 89 kr. · Dagens suppe: 75 kr.
Frisk appelsinjuice: 42 kr.
Åbent alle dage 8–18. Lørdag til midnat.
Gratis wi-fi til gæster.`,
      [['Hvad koster en cappuccino?', '45 kr.', ['38 kr.', '32 kr.', '42 kr.'], 'Cappuccino: 45 kr.', '45 Kronen.'],
       ['Hvor længe er der åbent om lørdagen?', 'Til midnat', ['Til klokken 18', 'Til klokken 8', 'Det er lukket'], '« Lørdag til midnat. »', 'Bis Mitternacht.'],
       ['Hvad er gratis?', 'Wi-fi', ['Kaffe', 'Wienerbrød', 'Suppe'], '« Gratis wi-fi til gæster. »', 'Das WLAN.'],
       ['Hvad er der på smørrebrødet?', 'Æg og rejer', ['Ost og skinke', 'Laks', 'Frikadeller'], '« Smørrebrød med æg og rejer ».', 'Ei und Crevetten.']],
      [['dagens suppe', 'Tagessuppe', 'Dagens suppe er tomatsuppe.'], ['rejer', 'Crevetten', 'Smørrebrød med rejer.'], ['frisk', 'frisch', 'Frisk juice.'], ['midnat', 'Mitternacht', 'Åbent til midnat.']]),
    R('d1r03', 'A1', 'rejse', 'Et postkort fra Skagen',
`Kære Maja,
jeg er i Skagen med Thomas i tre dage. Vejret er dejligt, og lyset er helt specielt. I dag har vi gået en lang tur på stranden og spist is. I morgen tager vi til Grenen, hvor to have mødes.
Vores hotel er lille, men meget hyggeligt.
Mange hilsner,
Emma`,
      [['Hvor er Emma?', 'I Skagen', ['I København', 'I Aarhus', 'På Bornholm'], '« jeg er i Skagen ».', 'In Skagen.'],
       ['Hvad har de lavet i dag?', 'Gået en tur og spist is', ['Sejlet', 'Cyklet til Aarhus', 'Været på museum'], 'Tur på stranden og is.', 'Strandspaziergang und Glace.'],
       ['Hvad sker der ved Grenen?', 'To have mødes', ['Der er et marked', 'Der er en koncert', 'Der er en bro'], '« hvor to have mødes ».', 'Zwei Meere treffen sich.'],
       ['Hvordan er hotellet?', 'Lille, men hyggeligt', ['Stort og dyrt', 'Grimt', 'Larmende'], '« lille, men meget hyggeligt ».', 'Klein, aber gemütlich.']],
      [['et postkort', 'eine Postkarte', 'Et postkort fra Skagen.'], ['dejlig', 'herrlich / schön', 'Vejret er dejligt.'], ['lyset', 'das Licht', 'Lyset er specielt.'], ['mange hilsner', 'viele Grüsse', 'Mange hilsner, Emma']]),
    R('d1r04', 'A1', 'hjem', 'Værelse søges',
`Studerende, 22 år, søger værelse i et kollektiv i København, tæt på universitetet. Jeg er rolig, ryger ikke og kan godt lide at lave mad. Jeg kan højst betale 4.500 kr. om måneden.
Skriv en besked eller ring efter klokken 18.
Sofie`,
      [['Hvad søger Sofie?', 'Et værelse i et kollektiv', ['Et arbejde', 'En stor lejlighed', 'En bil'], 'Hun søger et værelse i et kollektiv.', 'Ein Zimmer in einer WG.'],
       ['Hvor meget kan hun betale?', 'Højst 4.500 kr.', ['Mindst 4.500 kr.', '22 kr.', '9.000 kr.'], '« højst 4.500 kr. om måneden ».', 'Höchstens 4500 Kronen.'],
       ['Hvornår kan man ringe?', 'Efter klokken 18', ['Om morgenen', 'Altid', 'Kun om lørdagen'], '« ring efter klokken 18 ».', 'Nach 18 Uhr.'],
       ['Hvad er rigtigt?', 'Sofie ryger ikke', ['Sofie ryger', 'Sofie har en hund', 'Sofie arbejder om aftenen'], '« ryger ikke ».', 'Sie raucht nicht.']],
      [['et kollektiv', 'eine WG', 'Hun bor i et kollektiv.'], ['rolig', 'ruhig', 'Jeg er rolig.'], ['højst', 'höchstens', 'Højst 4.500 kr.'], ['en besked', 'eine Nachricht', 'Skriv en besked.']]),
    R('d1r05', 'A2', 'danmark', 'Smørrebrød til frokost',
`Sidste søndag spiste vi frokost på en gammel restaurant i København sammen med nogle venner. Restauranten lå i en kælder, og der var levende lys på bordene.
Vi bestilte smørrebrød: først sild, så æg og rejer og til sidst leverpostej med bacon. Til maden drak vi øl og en lille snaps.
Efter frokosten gik vi en tur langs kanalerne. Det var en perfekt dag, selvom det begyndte at regne på vej hjem.`,
      [['Hvor lå restauranten?', 'I en kælder', ['På en båd', 'I en park', 'På et tag'], '« Restauranten lå i en kælder ».', 'In einem Keller.'],
       ['Hvad spiste de først?', 'Sild', ['Leverpostej', 'Æg og rejer', 'Kage'], '« først sild ».', 'Zuerst Hering.'],
       ['Hvad lavede de efter frokosten?', 'Gik en tur langs kanalerne', ['Tog hjem i bil', 'Sov', 'Shoppede'], '« gik vi en tur langs kanalerne ».', 'Spaziergang den Kanälen entlang.'],
       ['Hvad var problemet?', 'Det begyndte at regne', ['Maden var kold', 'Det var for dyrt', 'De kom for sent'], '« det begyndte at regne på vej hjem ».', 'Es begann zu regnen.']],
      [['sild', 'Hering', 'Først spiser man sild.'], ['leverpostej', 'Leberpastete', 'Leverpostej med bacon.'], ['levende lys', 'Kerzenlicht', 'Der var levende lys.'], ['selvom', 'obwohl', 'Det var perfekt, selvom det regnede.']]),
    R('d1r06', 'A2', 'rejse', 'På cykel gennem København',
`København er en af verdens mest cykelvenlige byer. Over halvdelen af dem, der arbejder eller studerer i byen, cykler hver dag. Der er brede cykelstier næsten overalt, og nogle broer er kun for cykler og fodgængere.
Som turist kan man nemt leje en cykel. Men husk reglerne: Man skal række hånden op, når man stopper, og man må ikke cykle på fortovet.
Et godt tip: Cykelslangen er en smuk orange bro over havnen – den er perfekt til en tur i solnedgangen.`,
      [['Hvor mange cykler hver dag?', 'Over halvdelen', ['Næsten ingen', 'Kun turister', 'Ti procent'], '« Over halvdelen … cykler hver dag ».', 'Mehr als die Hälfte.'],
       ['Hvad skal man gøre, når man stopper?', 'Række hånden op', ['Ringe med klokken', 'Stå af cyklen', 'Råbe'], '« Man skal række hånden op ».', 'Die Hand heben.'],
       ['Hvor må man ikke cykle?', 'På fortovet', ['På cykelstien', 'På broerne', 'I parken'], '« man må ikke cykle på fortovet ».', 'Auf dem Trottoir.'],
       ['Hvad er Cykelslangen?', 'En orange bro for cykler', ['En cykelbutik', 'En park', 'Et museum'], '« en smuk orange bro over havnen ».', 'Eine orange Velobrücke.']],
      [['cykelvenlig', 'velofreundlich', 'En cykelvenlig by.'], ['leje', 'mieten', 'Man kan leje en cykel.'], ['fortovet', 'das Trottoir', 'Man må ikke cykle på fortovet.'], ['solnedgangen', 'der Sonnenuntergang', 'En tur i solnedgangen.']]),
    R('d1r07', 'A2', 'kultur', 'Jul i Danmark',
`I december er Danmark fuld af lys. Mange tænder et kalenderlys hver dag fra den 1. til den 24. december, og byerne har julemarkeder med gløgg og æbleskiver.
Den store aften er juleaften, den 24. december. Familien spiser andesteg eller flæskesteg, og til dessert er der risalamande med kirsebærsauce. Den, der finder den hele mandel, får en lille gave.
Bagefter danser man rundt om juletræet og synger julesange, før man åbner gaverne.`,
      [['Hvornår fejrer danskerne den store juleaften?', 'Den 24. december', ['Den 25. december', 'Den 6. december', 'Den 31. december'], '« juleaften, den 24. december ».', 'Am 24. Dezember.'],
       ['Hvad er æbleskiver?', 'Noget man spiser til jul', ['En slags lys', 'En sang', 'Et træ'], 'Julemarkeder med gløgg og æbleskiver.', 'Ein Weihnachtsgebäck.'],
       ['Hvad får den, der finder mandlen?', 'En lille gave', ['Penge', 'Mere dessert', 'Ingenting'], '« får en lille gave ».', 'Ein kleines Geschenk.'],
       ['Hvad gør man før gaverne?', 'Danser om juletræet', ['Går en tur', 'Ser tv', 'Går i seng'], '« danser man rundt om juletræet … før man åbner gaverne ».', 'Man tanzt um den Baum.']],
      [['et kalenderlys', 'eine Adventskalenderkerze', 'Vi tænder kalenderlyset.'], ['gløgg', 'Glühwein', 'En kop gløgg.'], ['risalamande', 'Milchreis-Dessert mit Mandeln', 'Til dessert er der risalamande.'], ['juletræet', 'der Weihnachtsbaum', 'Vi danser om juletræet.']]),
    R('d1r08', 'A2', 'arbejde', 'Første arbejdsdag',
`Mandag begyndte Jonas i et nyt job i et firma i Odense. Han var lidt nervøs, men kollegerne var meget venlige. Hans chef viste ham kontoret og forklarede hans vigtigste opgaver.
Til frokost spiste alle sammen i kantinen. Jonas fik at vide, at næsten alle kommer på arbejde på cykel – selv når det regner.
Om aftenen var han træt, men glad. « Jeg kan godt lide stemningen », sagde han til sin kæreste.`,
      [['Hvordan havde Jonas det i starten?', 'Lidt nervøs', ['Meget vred', 'Ked af det', 'Kedede sig'], '« Han var lidt nervøs ».', 'Etwas nervös.'],
       ['Hvem forklarede ham opgaverne?', 'Hans chef', ['Hans kæreste', 'En kunde', 'Ingen'], '« Hans chef … forklarede hans vigtigste opgaver ».', 'Sein Chef.'],
       ['Hvor spiste de frokost?', 'I kantinen', ['Hjemme', 'På en café', 'På kontoret'], '« spiste alle sammen i kantinen ».', 'In der Kantine.'],
       ['Hvad synes Jonas om det nye job?', 'Han kan lide stemningen', ['Han kan ikke lide det', 'Det er for langt væk', 'Det er kedeligt'], '« Jeg kan godt lide stemningen ».', 'Ihm gefällt die Stimmung.']],
      [['et firma', 'eine Firma', 'Et firma i Odense.'], ['en opgave', 'eine Aufgabe', 'De vigtigste opgaver.'], ['kantinen', 'die Kantine', 'De spiste i kantinen.'], ['stemningen', 'die Stimmung', 'Jeg kan lide stemningen.']]),
    R('d1r09', 'B1', 'danmark', 'Højskolen – skole for livet',
`Folkehøjskolen er en særlig dansk opfindelse. Idéen kommer fra præsten og forfatteren N.F.S. Grundtvig i 1800-tallet: Skolen skulle ikke give eksamen, men gøre mennesker klogere på livet og på fællesskabet.
I dag findes der omkring 70 højskoler i Danmark. Man bor på skolen i nogle uger eller måneder, spiser sammen og følger fag som musik, filosofi, friluftsliv eller kunst. Der er ingen karakterer.
Mange unge tager på højskole efter gymnasiet, men også voksne og pensionister tager på korte kurser om sommeren. En vigtig tradition er fællessang hver morgen.`,
      [['Hvad var Grundtvigs idé?', 'At skolen skulle gøre folk klogere på livet uden eksamen', ['At alle skulle tage eksamen', 'At skolen kun var for præster', 'At man skulle lære tysk'], 'Ingen eksamen, men klogere på livet og fællesskabet.', 'Bildung fürs Leben ohne Prüfungen.'],
       ['Hvad er rigtigt om højskolerne i dag?', 'Man bor på skolen', ['Der er karakterer', 'De er kun for unge', 'Der er kun tre'], '« Man bor på skolen ».', 'Man wohnt an der Schule.'],
       ['Hvem tager på korte sommerkurser?', 'Også voksne og pensionister', ['Kun lærere', 'Kun børn', 'Ingen'], '« også voksne og pensionister ».', 'Auch Erwachsene und Pensionierte.'],
       ['Hvilken tradition nævnes?', 'Fællessang hver morgen', ['Fodbold om aftenen', 'Eksamen hver fredag', 'Julefrokost hver måned'], '« fællessang hver morgen ».', 'Gemeinsames Singen am Morgen.']],
      [['en opfindelse', 'eine Erfindung', 'En dansk opfindelse.'], ['klogere', 'klüger', 'Klogere på livet.'], ['karakterer', 'Noten', 'Der er ingen karakterer.'], ['fællessang', 'gemeinsames Singen', 'Fællessang hver morgen.'], ['friluftsliv', 'Leben in der Natur / Outdoor', 'Faget hedder friluftsliv.']]),
    R('d1r10', 'B1', 'samfund', 'Hjemmearbejde',
`Mange danskere arbejder nu en eller to dage om ugen hjemmefra. For dem, der bor langt fra byen, betyder det færre timer i bil eller tog og mere tid til familien.
Men ikke alle er begejstrede. Nogle siger, at de føler sig ensomme, og at det er svært at adskille arbejde og privatliv. Andre savner den uformelle snak ved kaffemaskinen.
Ifølge en undersøgelse foretrækker de fleste en blandet model: to eller tre dage på kontoret og resten hjemme.`,
      [['Hvilken fordel har hjemmearbejde for dem, der bor langt væk?', 'Færre timer i transport', ['Højere løn', 'Mindre arbejde', 'Større kontorer'], '« færre timer i bil eller tog ».', 'Weniger Pendelzeit.'],
       ['Hvilket problem nævnes?', 'At adskille arbejde og privatliv', ['Prisen på tog', 'Varmen', 'Larmende kolleger'], '« svært at adskille arbejde og privatliv ».', 'Arbeit und Privatleben trennen.'],
       ['Hvad savner nogle?', 'Snakken ved kaffemaskinen', ['Bilen', 'Chefen', 'Toget'], '« den uformelle snak ved kaffemaskinen ».', 'Den Schwatz bei der Kaffeemaschine.'],
       ['Hvad foretrækker de fleste?', 'En blandet model', ['Kun hjemmearbejde', 'Kun kontoret', 'At arbejde om natten'], '« en blandet model ».', 'Ein gemischtes Modell.']],
      [['hjemmefra', 'von zu Hause aus', 'Jeg arbejder hjemmefra.'], ['begejstret', 'begeistert', 'Ikke alle er begejstrede.'], ['ensom', 'einsam', 'De føler sig ensomme.'], ['en undersøgelse', 'eine Umfrage / Studie', 'Ifølge en undersøgelse…']])
  ];

  const D = (id, l, ic, t, intro, tel, steps, end) => ({ id, l, ic, t, intro, tel,
    steps: steps.map(([p, a, w, fr, de]) => ({ p, a, o: [a].concat(w), fr, de })), end });
  P.dialogues = [
    D('d1d01', 'A1', '☕', 'På caféen', 'Du bestiller morgenmad på en café i København.', false, [
      ['Hej! Hvad skulle det være?', 'Hej! En kaffe og et wienerbrød, tak.', ['Hej! Jeg er en kaffe.', 'Giv mig kaffe.'], 'Man bestiller høfligt: « …, tak ».', 'Höflich bestellen mit «…, tak».'],
      ['Skal det være med mælk?', 'Nej tak, bare sort.', ['Nej, mælk tak sort.', 'Ja nej.'], '« Bare sort » = nur schwarz.', '«bare sort» = einfach schwarz.'],
      ['Værsgo. Andet?', 'Nej tak. Hvad bliver det?', ['Nej tak. Hvad koster du?', 'Andet ja.'], '« Hvad bliver det? » = Was macht das?', '«Hvad bliver det?» = Was macht das?'],
      ['Det bliver 70 kroner.', 'Kan jeg betale med kort?', ['Kan jeg betale kort med?', 'Jeg betaler med en kortet.'], 'Betale MED kort.', '«betale med kort».'],
      ['Selvfølgelig. Tak, og hav en god dag!', 'Tak, i lige måde!', ['Tak, godnat!', 'Velbekomme!'], '« I lige måde! » = Gleichfalls!', '«I lige måde!» = Gleichfalls!']
    ], 'Hej hej!'),
    D('d1d02', 'A1', '🚆', 'På stationen', 'Du køber en billet til Roskilde.', false, [
      ['Hej, hvad kan jeg hjælpe med?', 'Hej, en billet til Roskilde, tak.', ['Hej, jeg går Roskilde.', 'En billet af Roskilde.'], 'En billet TIL + by.', '«en billet til + Ort».'],
      ['Enkelt eller tur-retur?', 'Tur-retur, tak.', ['Retur tur enkelt.', 'Enkelt retur.'], 'Tur-retur = hin und zurück.', 'Hin und zurück.'],
      ['Det bliver 168 kroner. Toget kører kl. 10.05 fra spor 3.', 'Skal jeg skifte?', ['Skal jeg skifte mig?', 'Er toget skifte?'], '« Skal jeg skifte? » = Muss ich umsteigen?', 'Muss ich umsteigen?'],
      ['Nej, det er direkte.', 'Hvor lang tid tager det?', ['Hvor langt tid er det tog?', 'Hvor tid?'], 'Spørg om rejsetiden.', 'Nach der Fahrzeit fragen.'],
      ['Cirka 25 minutter.', 'Perfekt, tusind tak!', ['Perfekt, selv tak!', 'Tak for mad!'], '« Tusind tak » = vielen Dank.', '«Tusind tak» = vielen Dank.']
    ], 'Selv tak. God tur!'),
    D('d1d03', 'A1', '🗺️', 'Spørg om vej', 'Du leder efter Den Lille Havfrue.', false, [
      ['Ja? Kan jeg hjælpe dig?', 'Undskyld, hvor ligger Den Lille Havfrue?', ['Undskyld, hvor Den Lille Havfrue er?', 'Hej, havfrue?'], 'Spørgsmål: « Hvor ligger …? »', '«Hvor ligger …?» = Wo liegt …?'],
      ['Går du eller cykler du?', 'Jeg går.', ['Jeg cykel.', 'Jeg er gå.'], 'Nutid: gå → går.', 'gå → går.'],
      ['Så gå lige ud langs vandet, forbi Kastellet. Det tager cirka et kvarter.', 'Et kvarter? Det er ikke så langt.', ['Et kvarter langt er ikke?', 'Jeg forstår ikke noget.'], 'Et kvarter = 15 minutter.', '«et kvarter» = 15 Minuten.'],
      ['Nej, og det er en smuk tur.', 'Tusind tak for hjælpen!', ['Tak for mad!', 'Selv tak!'], 'Tak for hjælpen = danke für die Hilfe.', 'Danke für die Hilfe.'],
      ['Det var så lidt. God fornøjelse!', 'Tak, hav en god dag!', ['Godnat!', 'Velbekomme!'], 'Afsked.', 'Verabschiedung.']
    ], 'Hej hej!'),
    D('d1d04', 'A2', '🍽️', 'På restaurant', 'Du spiser frokost med en veninde.', false, [
      ['Goddag! Har I bestilt bord?', 'Ja, i navnet Keller, til to personer.', ['Ja, vi har bestilt af Keller.', 'Nej, vi er to.'], '« i navnet … » = auf den Namen …', '«i navnet …» = auf den Namen …'],
      ['Værsgo at sidde ned. Hvad vil I have at drikke?', 'To glas vand og en øl, tak.', ['To vand glas og øl en.', 'Drikke, tak.'], 'Bestilling med antal.', 'Mit Anzahl bestellen.'],
      ['Vi har dagens ret: frikadeller med kartoffelsalat.', 'Det lyder godt. Vi tager begge to dagens ret.', ['Det lyder god. Vi tager begge.', 'Frikadeller er dagens.'], '« Det lyder godt » (godt med -t efter « det »).', '«Det lyder godt» = Das klingt gut.'],
      ['Skal I have dessert bagefter?', 'Måske senere, vi ser.', ['Måske senere vi ser dessert ja nej.', 'Nej, aldrig dessert.'], 'Naturligt svar.', 'Natürlich antworten.'],
      ['Her er regningen. Smagte det?', 'Ja, det var rigtig lækkert. Kan vi betale hver for sig?', ['Ja, det var lækker.', 'Ja, vi betaler deler.'], 'Betale hver for sig = getrennt bezahlen.', 'getrennt bezahlen.']
    ], 'Selvfølgelig! Tak for besøget!'),
    D('d1d05', 'A2', '🏨', 'Bestil et værelse (telefon)', 'Du ringer til et hotel i Skagen.', true, [
      ['Hotel Strandly, goddag!', 'Goddag, jeg vil gerne bestille et værelse.', ['Goddag, jeg vil værelse.', 'Hallo, hvem taler?'], '« Jeg vil gerne … » = höflich.', 'Höflich: «Jeg vil gerne …».'],
      ['Hvornår?', 'Weekenden den 12. juli, to nætter.', ['12 juli weekend to nat.', 'I går.'], 'Datoer og antal nætter.', 'Datum und Anzahl Nächte.'],
      ['Til hvor mange personer?', 'Til to personer, et dobbeltværelse med havudsigt, hvis det er muligt.', ['Til to person.', 'Vi er dobbelte.'], 'Personer i flertal; dobbeltværelse = Doppelzimmer.', 'Plural «personer»; «dobbeltværelse».'],
      ['Ja, der er et ledigt værelse. Det koster 1.200 kroner pr. nat med morgenmad.', 'Det er fint. Er der parkering?', ['Fint. Har I parkering jer?', 'For dyrt, hej.'], '« Er der …? » = Gibt es …?', '«Er der …?» = Gibt es …?'],
      ['Ja, gratis. Hvad er navnet?', 'Keller: K, E, dobbelt L, E, R.', ['Mit navn er af Keller.', 'Navn Keller er.'], 'Stav navnet: « dobbelt L ».', 'Buchstabieren: «dobbelt L».']
    ], 'Tak, fru Keller. Vi ses!'),
    D('d1d06', 'A2', '🩺', 'Hos lægen', 'Du har været forkølet i nogle dage.', false, [
      ['Goddag, sæt dig ned. Hvad kan jeg gøre for dig?', 'Goddag. Jeg er forkølet og har haft ondt i halsen i tre dage.', ['Goddag, jeg har forkølet tre dage.', 'Ondt hals tre dag.'], '« have ondt i halsen », « i tre dage ».', '«ondt i halsen» = Halsweh; «i tre dage» = seit drei Tagen.'],
      ['Har du også feber?', 'Lidt. I går aftes havde jeg 38.', ['Ja, jeg er 38.', 'Feber havde jeg i går 38 jeg.'], 'Datid: have → havde.', 'Präteritum: havde.'],
      ['Sover du godt?', 'Ikke så godt, jeg hoster om natten.', ['Ikke så godt, jeg host om natten.', 'Jeg sover dårligt godt.'], 'hoste → hoster.', 'hoste → hoster.'],
      ['Det er ikke alvorligt. Du skal hvile dig og drikke meget.', 'Må jeg gå på arbejde?', ['Må jeg gå arbejde?', 'Skal jeg arbejde mig?'], 'Gå PÅ arbejde.', '«gå på arbejde».'],
      ['Bliv hellere hjemme et par dage.', 'Okay, tusind tak.', ['Okay, selv tak.', 'Tak for mad.'], 'Tak.', 'Danken.']
    ], 'Det var så lidt. God bedring!'),
    D('d1d07', 'A2', '🛍️', 'I en butik', 'Du køber en regnjakke i Aarhus.', false, [
      ['Hej, kan jeg hjælpe?', 'Ja, jeg leder efter en regnjakke.', ['Ja, jeg leder en regnjakke.', 'Nej, jeg kigger bare jeg ja.'], '« lede efter » = suchen.', '«lede efter» = suchen nach.'],
      ['Hvilken størrelse bruger du?', 'Jeg bruger medium.', ['Jeg er medium størrelse brug.', 'Medium er jeg.'], '« bruge » en størrelse = eine Grösse tragen.', '«bruge» = tragen (Grösse).'],
      ['Her er en, der er meget let. Vil du prøve den?', 'Ja tak. Hvor er prøverummet?', ['Ja, hvor prøverum?', 'Prøve ja rum.'], 'Prøverum = Umkleidekabine.', 'Umkleidekabine.'],
      ['Det er derhenne. Hvordan passer den?', 'Den passer fint, men den er lidt lang. Har I den i en kortere model?', ['Den passer fin, men lang kort.', 'Den er pæn grim.'], '« Den passer fint » = sie passt gut.', '«Den passer fint» = passt gut.'],
      ['Ja, her. Den koster 800 kroner, men i dag er der 20 % rabat.', 'Perfekt, den tager jeg!', ['Perfekt, det tager jeg!', 'Perfekt, tag!'], 'Jakken (en) → den tager jeg.', 'Utrum → «den».']
    ], 'Super, du kan betale ved kassen!'),
    D('d1d08', 'B1', '🏡', 'Fremvisning af en lejlighed', 'Du ser en lejlighed i Odense.', false, [
      ['Her er stuen. Den er meget lys, ikke?', 'Jo, den er skøn. Hvad er huslejen inklusive forbrug?', ['Ja, lys meget. Hvad koster?', 'Den er mørk, ikke?'], 'Svar på et negativt spørgsmål: « jo ».', 'Antwort auf «…, ikke?»: «jo».'],
      ['Den er 9.200 kroner, heraf 900 til forbrug.', 'Og hvornår er lejligheden ledig?', ['Og hvornår ledig er den?', 'Fra hvornår lejlighed ledig i morgen?'], 'Ledig = frei / verfügbar.', '«ledig» = frei.'],
      ['Fra den 1. april. Der er også et kælderrum og en p-plads.', 'Hvad koster p-pladsen?', ['P-pladsen koster hvor mange kroner den?', 'Jeg har ingen bil.'], 'Enkelt spørgsmål.', 'Einfache Frage.'],
      ['500 kroner om måneden. Har du dyr?', 'Nej, jeg har ingen dyr. Er det tilladt?', ['Nej, jeg har ikke nogen dyrene.', 'Nej, men jeg spiser kød.'], '« ingen » = kein(e).', '«ingen» = keine.'],
      ['Katte ja, hunde nej. Hvis du er interesseret, kan du udfylde denne formular.', 'Fint. Kan jeg sende den til dig på mail?', ['Fint. Kan jeg sende dig den på mail den?', 'Jeg udfylder den aldrig.'], 'Indirekte objekt før direkte: sende den til dig.', 'Höflich nachfragen.']
    ], 'Selvfølgelig. Hav en god dag!')
  ];

  P.sounds = [
    { id: 'bloedd', t: 'Det bløde d', de: 'weiches d (wie englisches «th» in «the»)', items: ['mad', 'gade', 'med', 'bad', 'Maden er god.', 'Vi bor på en stille gade.'] },
    { id: 'stoed', t: 'Stød', de: 'Stoss-Laut (kurzer «Knacks» in der Stimme)', items: ['hun – hund', 'man – mand', 'ven – vend', 'Hun har en hund.', 'Manden ringer.'] },
    { id: 'vokaler', t: 'Æ, ø og å', de: 'die drei besonderen Vokale', items: ['æble', 'øl', 'år', 'smørrebrød', 'Rødgrød med fløde.', 'Jeg spiser et æble om året.'] },
    { id: 'stumme', t: 'Stumme bogstaver', de: 'stumme Buchstaben (hv-, hj-, -d, -g)', items: ['hvad', 'hvor', 'hjem', 'kold', 'pige', 'Hvad laver du hjemme?'] },
    { id: 'r', t: 'Det danske r', de: 'Zäpfchen-R, oft fast wie ein Vokal', items: ['rød', 'ring', 'tre', 'mor', 'Rasmus har en rød cykel.', 'Hun bor i Randers.'] },
    { id: 'melodi', t: 'Rytme og melodi', de: 'Satzmelodie (Frage vs. Aussage)', items: ['Kommer du i aften?', 'Du kommer i aften.', 'Hvor er det hyggeligt!', 'Nej, er det rigtigt?', 'Skal vi gå?'] }
  ];

  /* Zahlen auf Dänisch (inkl. Zwanzigersystem: halvtreds, tres, halvfjerds, firs, halvfems) */
  const U = ['nul', 'en', 'to', 'tre', 'fire', 'fem', 'seks', 'syv', 'otte', 'ni', 'ti', 'elleve', 'tolv', 'tretten', 'fjorten', 'femten', 'seksten', 'sytten', 'atten', 'nitten'];
  const TENS = { 2: 'tyve', 3: 'tredive', 4: 'fyrre', 5: 'halvtreds', 6: 'tres', 7: 'halvfjerds', 8: 'firs', 9: 'halvfems' };
  function b100(n) {
    if (n < 20) return U[n];
    const t = TENS[Math.floor(n / 10)], u = n % 10;
    return u ? U[u] + 'og' + t : t;
  }
  function words(n) {
    if (n < 100) return b100(n);
    if (n < 1000) {
      const h = Math.floor(n / 100), r = n % 100;
      const hw = h === 1 ? 'hundrede' : U[h] + ' hundrede';
      return r ? hw + ' og ' + b100(r) : hw;
    }
    const th = Math.floor(n / 1000), r = n % 1000;
    const tw = th === 1 ? 'tusind' : words(th) + ' tusind';
    if (!r) return tw;
    return r < 100 ? tw + ' og ' + b100(r) : tw + ' ' + words(r);
  }
  const ORD = ['', 'første', 'anden', 'tredje', 'fjerde', 'femte', 'sjette', 'syvende', 'ottende', 'niende', 'tiende', 'ellevte', 'tolvte', 'trettende', 'fjortende', 'femtende', 'sekstende', 'syttende', 'attende', 'nittende', 'tyvende'];
  const ordinal = (d) => (d <= 20 ? ORD[d] : d === 30 ? 'tredivte' : d < 30 ? U[d - 20] + 'ogtyvende' : 'enogtredivte');
  const MONTHS = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];
  P.numbers = { words, months: MONTHS, variants: false,
    fmt: {
      price: (f, c, w) => (f === 1 ? 'en krone' : w(f) + ' kroner') + (c ? ' og ' + w(c) + ' øre' : ''),
      phoneMake: (rnd, pad2) => [rnd(20, 99), pad2(rnd(0, 99)), pad2(rnd(0, 99)), pad2(rnd(0, 99))].join(' '),
      phone: (groups, w) => groups.map((g) => (g[0] === '0' ? 'nul ' + w(Number(g[1])) : w(Number(g)))).join(', '),
      time: (h, m, w) => 'klokken ' + (h === 1 ? 'et' : w(h)) + (m ? ' ' + (m < 10 ? 'nul ' + w(m) : w(m)) : ''),
      year: (n, w) => 'i ' + (n >= 1900 && n < 2000 ? 'nitten hundrede' + (n % 100 ? ' og ' + w(n % 100) : '') : w(n)),
      date: (d, mo, w, months) => 'den ' + ordinal(d) + ' ' + months[mo]
    } };

  const C = (id, l, t, topics, fr, de) => ({ id, l, t, topics, fr, de });
  P.grammar = [
    C('verber', 'A1', 'Verber i nutid', ['nutid', 'være / have', 'modalverber'],
`<p>Nutid = infinitiv + <u>-r</u>. Formen er <b>den samme for alle personer</b>:</p>
<table><tr><th></th><th>tale</th><th>bo</th><th>være</th><th>have</th></tr>
<tr><td>jeg / du / han / hun / vi / I / de</td><td>tale<u>r</u></td><td>bo<u>r</u></td><td>er</td><td>har</td></tr></table>
<p><b>Modalverber</b>: kan, vil, skal, må, bør + infinitiv <u>uden « at »</u>: <i>Jeg vil gerne <u>have</u> en kaffe. Kan du <u>hjælpe</u> mig?</i></p>`,
`Präsens = Infinitiv + -r, für alle Personen gleich (jeg taler, vi taler). være → er, have → har. Nach Modalverben (kan, vil, skal, må) steht der Infinitiv ohne «at».`),
    C('navneord', 'A1', 'Navneord: en / et og bestemt form', ['en / et', 'bestemt form', 'flertal'],
`<table><tr><th></th><th>en-ord (fælleskøn)</th><th>et-ord (intetkøn)</th></tr>
<tr><td>ubestemt</td><td><u>en</u> bil</td><td><u>et</u> hus</td></tr>
<tr><td>bestemt</td><td>bil<u>en</u></td><td>hus<u>et</u></td></tr>
<tr><td>flertal</td><td>bil<u>er</u> / bil<u>erne</u></td><td>hus<u>e</u> / hus<u>ene</u></td></tr></table>
<p>Ca. 75 % af ordene er en-ord. Lær altid ordet med artikel!</p>
<p>Uregelmæssigt flertal: et barn → børn, en mand → mænd, en bog → bøger, et år → år.</p>`,
`Zwei Geschlechter: en (Utrum) und et (Neutrum). Der bestimmte Artikel wird angehängt: bilen = das Auto, huset = das Haus. Plural meist -er oder -e.`),
    C('ordstilling', 'A1', 'Ordstilling', ['ordstilling', 'nægtelse', 'spørgsmål'],
`<p><b>Verbet står på plads 2</b> i hovedsætningen – som på tysk: <i>Jeg <u>spiser</u> nu. Nu <u>spiser</u> jeg.</i></p>
<p><b>ikke</b> står efter verbet i hovedsætning (<i>Jeg spiser <u>ikke</u> kød</i>), men <u>før</u> verbet i bisætning (<i>…, at jeg <u>ikke</u> spiser kød</i>).</p>
<p>Spørgsmål: verbet først (<i><u>Kommer</u> du?</i>) eller spørgeord + verbum (<i>Hvor <u>bor</u> du?</i>). Spørgeord: hvad, hvem, hvor, hvornår, hvorfor, hvordan, hvor meget.</p>`,
`Das Verb steht an zweiter Stelle (wie im Deutschen). «ikke» steht im Hauptsatz nach dem Verb, im Nebensatz davor. Frage: Verb zuerst oder Fragewort + Verb.`),
    C('praepositioner', 'A1', 'Præpositioner og « der er »', ['præpositioner', 'der er'],
`<p><b>i</b> + land, by, rum: <i>i Danmark, i København, i køkkenet</i> · <b>på</b> + mange faste steder: <i>på arbejde, på stationen, på apoteket, på Fyn</i> · <b>til</b> = retning: <i>Jeg skal til Aarhus.</i> · <b>fra</b> = fra: <i>Jeg kommer fra Schweiz.</i></p>
<p>Tid: <i>på mandag</i> (kommende), <i>om mandagen</i> (hver mandag), <i>i weekenden</i>, <i>i fem år</i>.</p>
<p><b>Der er</b> = es gibt: <i>Der er en bager på hjørnet.</i></p>`,
`i = in (Länder, Städte, Räume), på = auf/an (viele feste Orte: på arbejde), til = nach/zu (Richtung), fra = von. «der er» = es gibt.`),
    C('pronominer', 'A2', 'Pronominer og « sin »', ['pronominer', 'sin / hans', 'refleksive verber'],
`<table><tr><th>person</th><th>subjekt</th><th>objekt</th><th>ejestedord</th></tr>
<tr><td>1. sg.</td><td>jeg</td><td>mig</td><td>min / mit / mine</td></tr><tr><td>2. sg.</td><td>du</td><td>dig</td><td>din / dit / dine</td></tr>
<tr><td>3. sg.</td><td>han / hun</td><td>ham / hende</td><td>hans / hendes · <b>sin / sit / sine</b></td></tr>
<tr><td>1. pl.</td><td>vi</td><td>os</td><td>vores</td></tr><tr><td>2. pl.</td><td>I</td><td>jer</td><td>jeres</td></tr><tr><td>3. pl.</td><td>de</td><td>dem</td><td>deres</td></tr></table>
<p><b>sin</b> = subjektets eget: <i>Peter ringer til <u>sin</u> mor</i> (Peters egen mor). <i>Peter ringer til <u>hans</u> mor</i> = en anden mands mor!</p>
<p>Refleksive verber: <i>Jeg glæder <u>mig</u>, du glæder <u>dig</u>, han glæder <u>sig</u>, vi glæder <u>os</u>.</i></p>`,
`Possessiv: min/mit/mine je nach Geschlecht und Zahl. «sin» bezieht sich auf das Subjekt des Satzes (sein eigenes), «hans» auf eine andere Person.`),
    C('datid', 'A2', 'Datid og førnutid', ['datid', 'førnutid', 'datid / førnutid'],
`<table><tr><th>gruppe</th><th>infinitiv</th><th>datid</th><th>førnutid</th></tr>
<tr><td>1 (-ede)</td><td>arbejde</td><td>arbejd<u>ede</u></td><td>har arbejd<u>et</u></td></tr>
<tr><td>2 (-te)</td><td>spise</td><td>spis<u>te</u></td><td>har spis<u>t</u></td></tr>
<tr><td>uregelmæssig</td><td>gå · se · være</td><td>gik · så · var</td><td>er gået · har set · har været</td></tr></table>
<p><b>Datid</b> = afsluttet tid i fortiden (<i>I går <u>spiste</u> vi fisk</i>). <b>Førnutid</b> = resultat nu eller uden tidspunkt (<i>Jeg <u>har spist</u></i>).</p>
<p>Med « er »: verber som viser bevægelse med mål eller forandring: <i>Toget <u>er kørt</u>. Hun <u>er blevet</u> mor.</i></p>`,
`Präteritum mit -ede oder -te (viele unregelmässige Verben). Perfekt meist mit har, bei Bewegung mit Ziel/Veränderung mit er. Präteritum wird im Dänischen viel häufiger verwendet als im Schweizerdeutschen!`),
    C('adjektiver', 'A2', 'Tillægsord', ['adjektiver', 'komparativ'],
`<table><tr><th></th><th>en-ord</th><th>et-ord</th><th>flertal / bestemt</th></tr>
<tr><td>stor</td><td>en stor bil</td><td>et stor<u>t</u> hus</td><td>stor<u>e</u> biler · den stor<u>e</u> bil</td></tr></table>
<p>Bestemt form med tillægsord: <b>den / det / de</b> + adjektiv-e + navneord <u>uden</u> endelse: <i><u>det</u> stor<u>e</u> hus</i> (ikke « huset »).</p>
<p>Gradbøjning: <i>billig – billigere – billigst</i>; uregelmæssig: <i>god – bedre – bedst, stor – større – størst, lille – mindre – mindst</i>. Sammenligning: <i>større <u>end</u></i>, <i>lige så stor <u>som</u></i>.</p>`,
`Adjektiv: +t bei Neutrum (et stort hus), +e im Plural und in der bestimmten Form (det store hus – dann ohne Endung am Nomen!).`),
    C('fremtid', 'B1', 'Fremtid, betingelse og passiv', ['fremtid', 'konditional', 'passiv', 'relativ'],
`<p>Fremtid: ofte <b>nutid</b> + tidsudtryk (<i>Jeg kommer i morgen</i>), <b>skal</b> for planer (<i>Vi skal til Bornholm</i>) eller <b>vil</b> for forudsigelser (<i>Det vil regne</i>).</p>
<p>Betingelse: <i>Hvis jeg <u>havde</u> tid, <u>ville</u> jeg rejse mere.</i></p>
<p>s-passiv: <i>Butikken <u>åbnes</u> klokken ti.</i> · Relativ: <b>der</b> (subjekt) / <b>som</b>: <i>Manden, <u>der</u> bor her …</i></p>`,
`Zukunft meist mit Präsens oder «skal» (Pläne). Bedingung: hvis + Präteritum → ville + Infinitiv. Passiv mit -s: åbnes = wird geöffnet.`)
  ];

  const S = (id, l, t, fr, de, secs, expr, check) => ({ id, l, t, fr, de, secs, expr, check });
  P.speaking = [
    S('ds01', 'A1', 'Præsenter dig selv', 'Præsenter dig: navn, hvor du bor, arbejde, familie, hobbyer.', 'Stell dich vor: Name, Wohnort, Arbeit, Familie, Hobbys.', 45, ['Jeg hedder…', 'Jeg bor i…', 'Jeg arbejder som… / på…', 'I min fritid…'], ['Jeg har sagt mit navn og hvor jeg bor', 'Jeg har talt om familien', 'Jeg har nævnt en hobby']),
    S('ds02', 'A1', 'Min dag', 'Beskriv en helt normal dag.', 'Beschreibe einen normalen Tag.', 60, ['Om morgenen står jeg op klokken…', 'Så…', 'Til frokost…', 'Om aftenen…'], ['Mindst 3 forskellige verber', 'Klokkeslæt', 'Verbet på plads 2 (« Så spiser jeg »)']),
    S('ds03', 'A1', 'På caféen', 'Bestil morgenmad på en café og spørg om prisen.', 'Bestelle Frühstück in einem Café und frag nach dem Preis.', 45, ['Jeg vil gerne have…', '…, tak', 'Hvad bliver det?', 'Tak, hav en god dag!'], ['« Jeg vil gerne have »', 'Jeg har spurgt om prisen', 'Jeg har sagt farvel']),
    S('ds04', 'A2', 'Min sidste weekend', 'Fortæl, hvad du lavede sidste weekend.', 'Erzähle von deinem letzten Wochenende.', 75, ['Lørdag tog jeg…', 'Vi spiste…', 'Det var meget…', 'Bagefter…'], ['Datid (spiste, gik, var …)', 'Verbet på plads 2 efter tidsudtryk', 'En mening (det var hyggeligt …)']),
    S('ds05', 'A2', 'Ferie i Danmark', 'Fortæl om (eller forestil dig) en ferie i Danmark.', 'Erzähle (oder erfinde) Ferien in Dänemark.', 75, ['Vi var i…', 'Vi besøgte…', 'Jeg kunne godt lide…', 'Vejret var…'], ['Mindst to steder', 'Noget du kunne lide', 'Vejret']),
    S('ds06', 'A2', 'Ring til hotellet', 'Læg en besked på et hotels telefonsvarer: du vil bestille et værelse.', 'Hinterlasse einem Hotel eine Nachricht: Zimmer reservieren.', 60, ['Goddag, det er…', 'Jeg vil gerne bestille…', 'Fra den … til den …', 'Ring venligst tilbage på…'], ['Jeg har præsenteret mig', 'Datoer og personer', 'Et telefonnummer'])
  ];

  const W = (id, l, type, t, fr, de, words, expr, check, model) => ({ id, l, type, t, fr, de, words, expr, check, model });
  P.writing = [
    W('dw01', 'A1', 'besked', 'En invitation', 'Skriv en besked til en ven og inviter til middag (dag, tid, sted).', 'Lade jemanden per Nachricht zum Abendessen ein.', [20, 50], ['Hej…', 'Har du lyst til at komme til middag…?', 'Klokken…', 'Vi ses!'], ['Dag og tid', 'Sted', 'Hilsen i starten og slutningen'],
      'Hej Anne!\nHar du lyst til at komme til middag hos mig på lørdag? Klokken halv syv, Søndergade 5. Jeg laver lasagne!\nVi ses,\nMarie'),
    W('dw02', 'A1', 'postkort', 'Et postkort', 'Skriv et postkort fra ferien: hvor du er, vejret, hvad du laver.', 'Ferienpostkarte: wo, Wetter, Aktivitäten.', [30, 60], ['Kære…', 'Jeg er i…', 'Vejret er…', 'Hver dag…', 'Mange hilsner'], ['Sted', 'Vejr', 'To aktiviteter'],
      'Kære Lena,\njeg er i København med min familie. Vejret er dejligt, men det blæser lidt. Hver dag cykler vi rundt i byen og spiser is i Nyhavn. I morgen skal vi i Tivoli.\nMange hilsner,\nSabine'),
    W('dw03', 'A2', 'e-mail', 'Booking', 'Skriv en e-mail til et hotel: bestil et værelse og spørg om parkering.', 'E-Mail an ein Hotel: Zimmer reservieren, nach Parkplatz fragen.', [40, 80], ['Kære…', 'Jeg vil gerne bestille…', 'Kan I fortælle mig, om…?', 'Venlig hilsen'], ['Hilsen', 'Datoer og personer', 'Et høfligt spørgsmål'],
      'Kære Hotel Strandly\nJeg vil gerne bestille et dobbeltværelse fra den 12. til den 14. juli til to personer. Kan I fortælle mig, om hotellet har parkering, og hvad det koster?\nPå forhånd tak.\nVenlig hilsen\nSabine Keller'),
    W('dw04', 'A2', 'fortælling', 'Min weekend', 'Fortæl om din sidste weekend.', 'Erzähle von deinem letzten Wochenende.', [50, 90], ['Lørdag morgen…', 'Bagefter…', 'Om aftenen…', 'Det var en … weekend'], ['Datid', 'Mindst 3 aktiviteter', 'En mening til sidst'],
      'Lørdag morgen tog jeg på marked med min søster. Vi købte frugt, ost og blomster. Bagefter spiste vi frokost på en lille café ved havnen. Om eftermiddagen læste jeg en bog i haven. Om aftenen gik vi i biografen med nogle venner. Det var en rolig, men rigtig hyggelig weekend.')
  ];

  P.radio = {
    intro: 'Ægte dansk fra radioen. Lyt lidt i DR LYD-appen, en podcast-app eller browseren, og udfyld bagefter din lyttenotat.',
    introDe: 'Echtes Dänisch aus dem Radio. Höre kurz in der DR-LYD-App, einer Podcast-App oder im Browser rein und fülle danach deine Hörnotiz aus.',
    sources: [
      { name: 'Dansk i ørerne (podcast)', l: 'A2', kind: 'podcast', desc: 'Korte afsnit på langsomt og tydeligt dansk om Danmark og danskerne – med tekst på hjemmesiden.', url: 'https://danskioererne.dk' },
      { name: 'DR LYD – P4', l: 'A2', kind: 'radio', desc: 'Musik, lokale nyheder og hverdagssnak fra hele landet.', url: 'https://www.dr.dk/lyd/p4' },
      { name: 'DR LYD – P1', l: 'B1', kind: 'radio', desc: 'Taleradio: nyheder, samfund og debat.', url: 'https://www.dr.dk/lyd/p1' },
      { name: 'Genstart (DR)', l: 'B2', kind: 'podcast', desc: 'DR’s nyhedspodcast om tidens store historier.', url: 'https://www.dr.dk/lyd/special-radio/genstart-2642056922000' },
      { name: 'DR LYD (alle programmer)', l: 'A2', kind: 'podcast', desc: 'Alle DR’s kanaler og podcasts samlet.', url: 'https://www.dr.dk/lyd' }
    ],
    tips: [
      ['Aktiv lytning', 'Lyt 2–3 minutter, ikke mere. Hellere et kort stykke to gange end en time i baggrunden.', 'Höre 2–3 Minuten aktiv zu, lieber zweimal kurz als lange nebenbei.'],
      ['To gange', '1. gang: forstå emnet. 2. gang: skriv ord ned, som du genkender.', '1. Durchgang: Thema verstehen. 2. Durchgang: bekannte Wörter notieren.'],
      ['Med tekst', 'Dansk i ørerne har teksten til hvert afsnit: lyt først, læs bagefter, og lyt så igen.', 'Bei «Dansk i ørerne» gibt es den Text: erst hören, dann lesen, dann nochmals hören.']
    ]
  };

  P.aiScenarios = [
    { id: 'cafe', ic: '☕', t: 'På caféen', role: 'a friendly barista in a café in Copenhagen', task: 'The learner orders breakfast and pays. Keep it very simple.', min: 'A1' },
    { id: 'station', ic: '🚆', t: 'På stationen', role: 'a ticket agent of the Danish railways (DSB) in Copenhagen', task: 'The learner buys a ticket to Roskilde and asks about the platform and time.', min: 'A1' },
    { id: 'restaurant', ic: '🍽️', t: 'På restaurant', role: 'a waiter in a traditional smørrebrød restaurant in Copenhagen', task: 'The learner orders typical Danish food (smørrebrød, frikadeller) and asks for the bill.', min: 'A2' },
    { id: 'hotel', ic: '🏨', t: 'På hotellet', role: 'a receptionist of a seaside hotel in Skagen', task: 'The learner checks in, asks about breakfast time and recommendations.', min: 'A2' },
    { id: 'turist', ic: '🗺️', t: 'Turistkontoret', role: 'an employee of the tourist office in Aarhus', task: 'The learner asks what to visit in two days (ARoS, Den Gamle By, the beach).', min: 'A2' },
    { id: 'butik', ic: '🛍️', t: 'I en butik', role: 'a shop assistant in a clothing shop in Aarhus', task: 'The learner looks for a rain jacket, asks about size and price.', min: 'A2' },
    { id: 'kollega', ic: '💼', t: 'En ny kollega', role: 'a friendly new colleague in a Danish company', task: 'Small talk at work: introductions, where you live, weekend plans.', min: 'A2' },
    { id: 'fri', ic: '💬', t: 'Fri samtale', role: 'a friendly person from Denmark', task: 'Free conversation. Start by asking the learner what they would like to talk about. Keep sentences short and simple.', min: 'A1' }
  ];
})();
