/* Italienisch: Lesetexte, geführte Dialoge, Laute, Zahlen, Grammatik, Sprechen, Schreiben, Radio, KI-Szenarien. Nur anhängen. */
(function () {
  const P = window.LINGUA_PACKS.it;
  const R = (id, l, topic, title, text, qs, gl) => ({ id, l, topic, title, text,
    questions: qs.map(([q, a, w, fr, de]) => ({ q, a, o: [a].concat(w), fr, de })), glossary: gl.map(([fr, de, ex]) => ({ fr, de, ex })) });
  P.reading = [
    R('i1r01', 'A1', 'quotidiano', 'Mi presento',
`Ciao! Mi chiamo Giulia e ho trentadue anni. Abito a Bellinzona con mio marito e nostro figlio Leo. Leo ha cinque anni e va all’asilo.
Lavoro in una farmacia in centro. La mattina mi alzo alle sei e mezza e bevo un caffè. Vado al lavoro in bicicletta.
Nel tempo libero cammino in montagna e cucino. La domenica mangiamo spesso dai miei genitori a Giubiasco.`,
      [['Dove lavora Giulia?', 'In una farmacia', ['In un ospedale', 'In una scuola', 'In un ristorante'], 'Lavora in una farmacia in centro.', 'Sie arbeitet in einer Apotheke.'],
       ['Come va al lavoro?', 'In bicicletta', ['In treno', 'A piedi', 'In macchina'], '« Vado al lavoro in bicicletta. »', 'Mit dem Velo.'],
       ['Quanti anni ha Leo?', 'Cinque', ['Sei', 'Trentadue', 'Tre'], '« Leo ha cinque anni ».', 'Fünf.'],
       ['Che cosa fa la famiglia la domenica?', 'Mangia dai genitori di Giulia', ['Va al lago', 'Lavora', 'Va al cinema'], '« La domenica mangiamo spesso dai miei genitori ».', 'Sie essen bei Giulias Eltern.']],
      [['l’asilo', 'der Kindergarten', 'Leo va all’asilo.'], ['alzarsi', 'aufstehen', 'Mi alzo alle sei e mezza.'], ['in bicicletta', 'mit dem Velo', 'Vado al lavoro in bicicletta.'], ['dai miei genitori', 'bei meinen Eltern', 'Mangiamo dai miei genitori.']]),
    R('i1r02', 'A1', 'ristorante', 'Al bar',
`Bar Centrale – Lugano
Caffè: 2.50 CHF · Cappuccino: 3.80 CHF · Cornetto: 2.20 CHF
Panino al prosciutto: 7.50 CHF · Insalata mista: 9 CHF
Spremuta d’arancia: 5 CHF
Aperto tutti i giorni dalle 6.30 alle 19. Il sabato fino a mezzanotte.
Wi-Fi gratuito per i clienti.`,
      [['Quanto costa un cappuccino?', '3.80 CHF', ['2.50 CHF', '2.20 CHF', '5 CHF'], 'Cappuccino: 3.80 CHF.', '3.80 Franken.'],
       ['Fino a che ora è aperto il sabato?', 'Fino a mezzanotte', ['Fino alle 19', 'Fino alle 6.30', 'È chiuso'], '« Il sabato fino a mezzanotte. »', 'Bis Mitternacht.'],
       ['Che cosa è gratuito?', 'Il Wi-Fi', ['Il caffè', 'Il cornetto', 'L’insalata'], '« Wi-Fi gratuito per i clienti. »', 'Das WLAN.'],
       ['Che cosa è una « spremuta d’arancia » ?', 'Un succo d’arancia fresco', ['Un dolce', 'Un panino', 'Un caffè freddo'], 'Spremuta = succo spremuto fresco.', 'Frisch gepresster Orangensaft.']],
      [['il panino', 'das Sandwich', 'Un panino al prosciutto.'], ['la spremuta', 'der frisch gepresste Saft', 'Una spremuta d’arancia.'], ['gratuito', 'gratis', 'Wi-Fi gratuito.'], ['mezzanotte', 'Mitternacht', 'Fino a mezzanotte.']]),
    R('i1r03', 'A1', 'viaggio', 'Una cartolina da Ascona',
`Cara Martina,
sono ad Ascona con Paolo per tre giorni. Il tempo è bellissimo e il lago è blu. Oggi abbiamo fatto una passeggiata sul lungolago e abbiamo mangiato un gelato. Domani andiamo con il battello alle Isole di Brissago: ci sono tante piante e fiori.
L’albergo è piccolo ma molto carino.
Un abbraccio,
Elena`,
      [['Dove è Elena?', 'Ad Ascona', ['A Lugano', 'A Brissago', 'A Bellinzona'], '« sono ad Ascona ».', 'In Ascona.'],
       ['Che cosa hanno fatto oggi?', 'Una passeggiata e un gelato', ['Un giro in battello', 'Una gita in montagna', 'Shopping'], 'Passeggiata sul lungolago e gelato.', 'Spaziergang und Glace.'],
       ['Come vanno alle Isole di Brissago?', 'Con il battello', ['In treno', 'In autobus', 'A piedi'], '« andiamo con il battello ».', 'Mit dem Schiff.'],
       ['Com’è l’albergo?', 'Piccolo ma carino', ['Grande e caro', 'Brutto', 'Rumoroso'], '« piccolo ma molto carino ».', 'Klein, aber hübsch.']],
      [['la cartolina', 'die Postkarte', 'Una cartolina da Ascona.'], ['il battello', 'das Schiff (Kursschiff)', 'Andiamo con il battello.'], ['carino / carina', 'hübsch / nett', 'L’albergo è carino.'], ['un abbraccio', 'eine Umarmung (Briefschluss)', 'Un abbraccio, Elena.']]),
    R('i1r04', 'A1', 'casa', 'Cerco una camera',
`Studentessa di 22 anni cerca una camera in appartamento condiviso a Lugano, vicino all’università. Sono tranquilla, non fumo e mi piace cucinare. Posso pagare al massimo 750 franchi al mese.
Per favore, scrivetemi un messaggio o telefonate la sera dopo le 18.
Chiara`,
      [['Che cosa cerca Chiara?', 'Una camera in un appartamento condiviso', ['Un lavoro', 'Un appartamento grande', 'Una macchina'], 'Cerca una camera in appartamento condiviso.', 'Ein Zimmer in einer WG.'],
       ['Quanto può pagare?', 'Al massimo 750 franchi', ['Almeno 750 franchi', '22 franchi', '1500 franchi'], '« al massimo 750 franchi al mese ».', 'Höchstens 750 Franken.'],
       ['Quando si può telefonare?', 'La sera dopo le 18', ['La mattina', 'Sempre', 'Solo il sabato'], '« telefonate la sera dopo le 18 ».', 'Abends nach 18 Uhr.'],
       ['Che cosa è vero?', 'Chiara non fuma', ['Chiara fuma', 'Chiara ha un cane', 'Chiara lavora la sera'], '« non fumo ».', 'Sie raucht nicht.']],
      [['condiviso', 'geteilt (WG)', 'Un appartamento condiviso.'], ['tranquillo / tranquilla', 'ruhig', 'Sono tranquilla.'], ['al massimo', 'höchstens', 'Posso pagare al massimo 750 franchi.'], ['il messaggio', 'die Nachricht', 'Scrivetemi un messaggio.']]),
    R('i1r05', 'A2', 'ticino', 'Un pranzo in un grotto',
`Domenica scorsa siamo andati in un grotto in Valle Maggia con alcuni amici. Il grotto era nel bosco, vicino a un fiume, e i tavoli erano di granito.
Abbiamo ordinato un piatto di salumi e formaggi della valle, poi polenta con brasato. Il vino era un merlot ticinese, servito nei boccalini, le tipiche tazze di ceramica.
Dopo pranzo abbiamo fatto una passeggiata lungo il fiume. Era una giornata perfetta, anche se al ritorno abbiamo trovato molto traffico sulla strada per Locarno.`,
      [['Dove si trovava il grotto?', 'Nel bosco, vicino a un fiume', ['In centro città', 'Sul lago', 'In montagna senza alberi'], '« Il grotto era nel bosco, vicino a un fiume ».', 'Im Wald, nahe einem Fluss.'],
       ['Che cosa sono i « boccalini » ?', 'Tazze di ceramica per il vino', ['Piatti di formaggio', 'Bicchieri di vetro', 'Bottiglie'], '« le tipiche tazze di ceramica ».', 'Keramiktassen für Wein.'],
       ['Che cosa hanno fatto dopo pranzo?', 'Una passeggiata lungo il fiume', ['Un bagno nel lago', 'Un riposo in macchina', 'Shopping'], '« abbiamo fatto una passeggiata lungo il fiume ».', 'Einen Spaziergang am Fluss.'],
       ['Qual è stato il problema?', 'Il traffico al ritorno', ['Il cibo freddo', 'La pioggia', 'Il prezzo'], '« al ritorno abbiamo trovato molto traffico ».', 'Viel Verkehr auf dem Rückweg.']],
      [['i salumi', 'die Wurstwaren', 'Un piatto di salumi.'], ['il brasato', 'der Schmorbraten', 'Polenta con brasato.'], ['il granito', 'der Granit', 'I tavoli erano di granito.'], ['al ritorno', 'auf dem Rückweg', 'Al ritorno c’era traffico.'], ['anche se', 'auch wenn', 'Era perfetto, anche se c’era traffico.']]),
    R('i1r06', 'A2', 'viaggio', 'In treno attraverso il Gottardo',
`Da quando c’è la galleria di base del Gottardo, il viaggio in treno da Zurigo a Lugano dura meno di due ore. Molti turisti però preferiscono ancora la vecchia linea di montagna: è più lenta, ma il paesaggio è spettacolare.
Il treno passa per piccole stazioni, gallerie elicoidali e ponti sopra le valli. In estate c’è anche un treno panoramico con grandi finestre.
Consiglio: sedetevi a destra in direzione sud per vedere meglio la chiesa di Wassen, che si vede tre volte da angoli diversi!`,
      [['Quanto dura il viaggio con la galleria di base?', 'Meno di due ore', ['Più di tre ore', 'Mezz’ora', 'Un giorno'], '« dura meno di due ore ».', 'Weniger als zwei Stunden.'],
       ['Perché alcuni preferiscono la vecchia linea?', 'Per il paesaggio', ['Perché è più veloce', 'Perché è gratis', 'Perché non ci sono gallerie'], '« è più lenta, ma il paesaggio è spettacolare ».', 'Wegen der Landschaft.'],
       ['Che cosa c’è in estate?', 'Un treno panoramico', ['Un autobus speciale', 'Un battello', 'Una funivia'], '« In estate c’è anche un treno panoramico ».', 'Ein Panoramazug.'],
       ['Che cosa si vede tre volte?', 'La chiesa di Wassen', ['Il lago', 'Lugano', 'Un ponte'], '« la chiesa di Wassen, che si vede tre volte ».', 'Die Kirche von Wassen.']],
      [['la galleria', 'der Tunnel', 'La galleria di base del Gottardo.'], ['il paesaggio', 'die Landschaft', 'Il paesaggio è spettacolare.'], ['il ponte', 'die Brücke', 'Ponti sopra le valli.'], ['sedersi', 'sich setzen', 'Sedetevi a destra.']]),
    R('i1r07', 'A2', 'cultura', 'Il Locarno Film Festival',
`Ogni anno, ad agosto, Locarno ospita uno dei festival del cinema più conosciuti d’Europa. La sera, in Piazza Grande, migliaia di persone guardano i film sotto le stelle, davanti a uno schermo enorme.
I film arrivano da tutto il mondo e molti sono in lingua originale con sottotitoli. Durante il giorno ci sono proiezioni nelle sale e incontri con registi e attori.
Se volete un posto in Piazza Grande, arrivate presto: i posti non sono numerati! E portate una giacca, perché la sera può fare fresco.`,
      [['Quando si svolge il festival?', 'Ad agosto', ['A dicembre', 'A marzo', 'Tutto l’anno'], '« Ogni anno, ad agosto ».', 'Im August.'],
       ['Dove si guardano i film la sera?', 'In Piazza Grande', ['Al lago', 'In stazione', 'In un teatro'], '« in Piazza Grande ».', 'Auf der Piazza Grande.'],
       ['Perché bisogna arrivare presto?', 'I posti non sono numerati', ['Il film inizia alle sei', 'C’è poco spazio sullo schermo', 'Il biglietto costa meno'], '« i posti non sono numerati ».', 'Die Plätze sind nicht nummeriert.'],
       ['Perché portare una giacca?', 'La sera può fare fresco', ['Per entrare nelle sale', 'Piove sempre', 'È obbligatorio'], '« la sera può fare fresco ».', 'Abends kann es kühl werden.']],
      [['ospitare', 'beherbergen / Gastgeber sein', 'Locarno ospita un festival.'], ['lo schermo', 'die Leinwand', 'Uno schermo enorme.'], ['i sottotitoli', 'die Untertitel', 'Film con sottotitoli.'], ['il regista', 'der Regisseur', 'Incontri con registi.'], ['fare fresco', 'kühl sein', 'La sera fa fresco.']]),
    R('i1r08', 'A2', 'lavoro', 'Il primo giorno di lavoro',
`Lunedì Davide ha cominciato un nuovo lavoro in un’azienda di Mendrisio. Era un po’ nervoso, ma i colleghi sono stati molto gentili. La responsabile gli ha mostrato l’ufficio e gli ha spiegato i compiti principali.
A mezzogiorno hanno mangiato tutti insieme alla mensa. Davide ha scoperto che quasi tutti vengono al lavoro in treno o in bicicletta.
La sera era stanco, ma contento. « Mi piace l’ambiente », ha detto a sua moglie.`,
      [['Come si sentiva Davide all’inizio?', 'Un po’ nervoso', ['Molto arrabbiato', 'Triste', 'Annoiato'], '« Era un po’ nervoso ».', 'Etwas nervös.'],
       ['Chi gli ha spiegato i compiti?', 'La responsabile', ['Sua moglie', 'Un cliente', 'Nessuno'], '« La responsabile … gli ha spiegato i compiti ».', 'Die Vorgesetzte.'],
       ['Dove hanno mangiato a mezzogiorno?', 'Alla mensa', ['A casa', 'In un grotto', 'In ufficio'], '« hanno mangiato tutti insieme alla mensa ».', 'In der Kantine.'],
       ['Che cosa pensa Davide del nuovo lavoro?', 'Gli piace l’ambiente', ['Non gli piace', 'È troppo lontano', 'È noioso'], '« Mi piace l’ambiente ».', 'Ihm gefällt die Atmosphäre.']],
      [['l’azienda', 'die Firma', 'Un’azienda di Mendrisio.'], ['il compito', 'die Aufgabe', 'I compiti principali.'], ['la mensa', 'die Kantine', 'Hanno mangiato alla mensa.'], ['l’ambiente', 'die Atmosphäre / Umgebung', 'Mi piace l’ambiente.']]),
    R('i1r09', 'B1', 'ticino', 'Castagne: il pane dei poveri',
`Per secoli, nelle valli del Ticino, le castagne sono state un alimento fondamentale. Venivano chiamate « il pane dei poveri » perché, quando il grano scarseggiava, la farina di castagne permetteva di sopravvivere all’inverno.
Le castagne si facevano seccare nelle « grà », piccoli edifici in pietra dove un fuoco lento le asciugava per settimane. Poi si conservavano per tutto l’anno.
Oggi le castagne sono tornate di moda: in autunno molti paesi organizzano feste dove si possono assaggiare caldarroste, torte e perfino birra alla castagna. Inoltre, diverse associazioni si impegnano a curare le vecchie selve castanili.`,
      [['Perché le castagne erano chiamate « il pane dei poveri » ?', 'Permettevano di sopravvivere quando mancava il grano', ['Erano molto care', 'Si mangiavano solo a Natale', 'Le mangiavano solo i ricchi'], 'Quando il grano scarseggiava, la farina di castagne aiutava.', 'Sie halfen, wenn Getreide fehlte.'],
       ['A che cosa servivano le « grà » ?', 'A seccare le castagne', ['A cuocere il pane', 'A conservare il vino', 'Ad abitare'], 'Edifici dove un fuoco lento asciugava le castagne.', 'Zum Trocknen der Kastanien.'],
       ['Che cosa succede oggi in autunno?', 'Ci sono feste con prodotti di castagne', ['Le castagne sono vietate', 'Nessuno mangia più castagne', 'Si chiudono i boschi'], 'Molti paesi organizzano feste.', 'Feste mit Kastanienprodukten.'],
       ['Che cosa fanno alcune associazioni?', 'Curano le vecchie selve castanili', ['Vendono birra', 'Costruiscono nuove case', 'Chiudono le feste'], '« si impegnano a curare le vecchie selve castanili ».', 'Sie pflegen alte Kastanienhaine.']],
      [['scarseggiare', 'knapp werden', 'Quando il grano scarseggiava…'], ['sopravvivere', 'überleben', 'Sopravvivere all’inverno.'], ['seccare', 'trocknen', 'Le castagne si facevano seccare.'], ['le caldarroste', 'die heissen Marroni', 'Assaggiare caldarroste.'], ['la selva castanile', 'der Kastanienhain', 'Curare le selve castanili.']]),
    R('i1r10', 'B1', 'societe', 'Il telelavoro dopo la pandemia',
`Molte persone in Ticino lavorano almeno un giorno alla settimana da casa. Per chi abita in una valle lontana, il telelavoro significa meno ore in macchina e più tempo per la famiglia.
Non tutti però sono entusiasti. Alcuni dicono di sentirsi soli e di avere difficoltà a separare il lavoro dalla vita privata. Altri lamentano che la connessione internet in montagna non è sempre stabile.
Secondo un sondaggio, la soluzione preferita è un modello misto: due o tre giorni in ufficio e il resto a casa.`,
      [['Che vantaggio ha il telelavoro per chi abita in una valle?', 'Meno ore in macchina', ['Più soldi', 'Meno lavoro', 'Uffici più grandi'], '« meno ore in macchina e più tempo per la famiglia ».', 'Weniger Zeit im Auto.'],
       ['Quale problema è citato?', 'Separare lavoro e vita privata', ['Il costo dei treni', 'Il caldo', 'I colleghi rumorosi'], '« difficoltà a separare il lavoro dalla vita privata ».', 'Arbeit und Privatleben zu trennen.'],
       ['Che cosa non è sempre stabile in montagna?', 'La connessione internet', ['La corrente elettrica', 'Il tempo', 'Il treno'], '« la connessione internet in montagna non è sempre stabile ».', 'Die Internetverbindung.'],
       ['Qual è la soluzione preferita secondo il sondaggio?', 'Un modello misto', ['Solo telelavoro', 'Solo ufficio', 'Lavorare la notte'], '« un modello misto ».', 'Ein gemischtes Modell.']],
      [['il telelavoro', 'das Homeoffice', 'Il telelavoro è comodo.'], ['entusiasta', 'begeistert', 'Non tutti sono entusiasti.'], ['lamentare', 'beklagen', 'Altri lamentano…'], ['il sondaggio', 'die Umfrage', 'Secondo un sondaggio…']])
  ];

  const D = (id, l, ic, t, intro, tel, steps, end) => ({ id, l, ic, t, intro, tel,
    steps: steps.map(([p, a, w, fr, de]) => ({ p, a, o: [a].concat(w), fr, de })), end });
  P.dialogues = [
    D('i1d01', 'A1', '☕', 'Al bar', 'Ordini la colazione in un bar di Lugano.', false, [
      ['Buongiorno! Cosa prende?', 'Buongiorno! Un cappuccino e un cornetto, per favore.', ['Buongiorno! Io è un cappuccino.', 'Ciao, dammi un caffè.'], 'Al bar si usa una forma gentile: « … per favore ».', 'Höflich bestellen mit «per favore».'],
      ['Il cornetto vuoto o alla crema?', 'Alla crema, grazie.', ['Vuoto alla crema.', 'Sì, grazie.'], 'Si risponde scegliendo: « alla crema » o « vuoto ».', 'Eine Wahl treffen: «alla crema» oder «vuoto».'],
      ['Ecco a lei. Altro?', 'No, grazie. Quanto pago?', ['No, grazie. Quanto paghi?', 'Altro sì.'], '« Quanto pago? » / « Quant’è? » per chiedere il prezzo.', 'Nach dem Preis fragen: «Quanto pago?» / «Quant’è?».'],
      ['Sono sei franchi.', 'Posso pagare con la carta?', ['Posso pagare la carta?', 'Pago con il carta.'], 'Pagare CON la carta (femminile: la carta).', '«con la carta».'],
      ['Certo. Grazie e buona giornata!', 'Grazie, altrettanto!', ['Prego, buonanotte!', 'Grazie, a te!'], '« Altrettanto! » = Ebenfalls!', '«Altrettanto!» = Gleichfalls!']
    ], 'Arrivederci!'),
    D('i1d02', 'A1', '🚆', 'In stazione', 'Compri un biglietto per Locarno.', false, [
      ['Buongiorno, mi dica.', 'Buongiorno, un biglietto per Locarno, per favore.', ['Buongiorno, io vado Locarno.', 'Un biglietto di Locarno.'], 'Un biglietto PER + città.', '«un biglietto per + Stadt».'],
      ['Solo andata o andata e ritorno?', 'Andata e ritorno, per favore.', ['Andata ritorno e solo.', 'Ritorno andata.'], 'Andata e ritorno = hin und zurück.', 'Hin und zurück.'],
      ['Ha l’abbonamento metà prezzo?', 'Sì, eccolo.', ['Sì, è metà.', 'No, ho prezzo.'], '« Eccolo » = hier ist es.', '«Eccolo» = hier ist es.'],
      ['Sono quattordici franchi e quaranta. Il prossimo treno parte alle 10.05 dal binario 2.', 'Devo cambiare treno?', ['Devo cambio?', 'Il treno è cambiare?'], '« Devo cambiare treno? » = Muss ich umsteigen?', 'Muss ich umsteigen?'],
      ['No, è diretto.', 'Perfetto, grazie mille!', ['Perfetto, prego!', 'Diretto è perfetto io.'], 'Si ringrazia: « grazie mille ».', '«grazie mille» = vielen Dank.']
    ], 'Prego, buon viaggio!'),
    D('i1d03', 'A1', '🗺️', 'Chiedere la strada', 'Cerchi il castello a Bellinzona.', false, [
      ['Sì? Posso aiutarla?', 'Scusi, dov’è Castelgrande?', ['Scusi, dove Castelgrande è?', 'Ehi, il castello?'], 'Domanda con « dov’è… ? ».', 'Frage mit «dov’è …?».'],
      ['È vicino. È a piedi?', 'Sì, sono a piedi.', ['Sì, ho i piedi.', 'Sì, vado piedi.'], '« Essere a piedi » = zu Fuss sein.', '«a piedi» = zu Fuss.'],
      ['Allora vada dritto fino alla piazza, poi c’è un ascensore nella roccia.', 'Un ascensore? Che bello! È lontano?', ['Un ascensore è lontano bello?', 'Non capisco niente.'], 'Reagire e chiedere la distanza.', 'Reagieren und nach der Distanz fragen.'],
      ['No, cinque minuti al massimo.', 'Grazie mille, molto gentile!', ['Grazie, gentile molto io.', 'Prego!'], 'Formula di ringraziamento gentile.', 'Höflich danken.'],
      ['Si figuri. Buona visita!', 'Grazie, buona giornata!', ['Buona notte!', 'Visita buona a lei pure!'], 'Saluto finale.', 'Verabschiedung.']
    ], 'Arrivederci!'),
    D('i1d04', 'A2', '🍽️', 'Al grotto', 'Pranzi in un grotto con un’amica.', false, [
      ['Buongiorno! Avete prenotato?', 'Sì, a nome Keller, per due persone.', ['Sì, abbiamo prenotato di Keller.', 'No, siamo due.'], '« A nome … » = auf den Namen …', '«a nome …» = auf den Namen …'],
      ['Benissimo, accomodatevi. Cosa vi porto da bere?', 'Un quartino di merlot e una bottiglia d’acqua, per favore.', ['Un merlot quartino e acqua bottiglia.', 'Bere, grazie.'], 'Un quartino = ¼ di litro di vino.', '«quartino» = ¼ Liter Wein.'],
      ['Come primo abbiamo minestrone, come secondo polenta e brasato.', 'Prendiamo tutte e due la polenta con il brasato.', ['Prendiamo tutte due polenta di brasato.', 'Primo e secondo e terzo.'], '« Tutte e due » = beide (femminile).', '«tutte e due» = beide.'],
      ['Va bene. Volete anche un dolce dopo?', 'Forse dopo, vediamo. Grazie.', ['Forse dopo vediamo dolce sì no.', 'No, mai dolci.'], 'Rispondere in modo naturale e gentile.', 'Natürlich und freundlich antworten.'],
      ['Ecco il conto. Tutto bene?', 'Sì, era tutto buonissimo. Possiamo pagare separatamente?', ['Sì, era tutto buonissima.', 'Sì, paghiamo divisi noi due.'], 'Pagare separatamente = getrennt bezahlen.', 'getrennt bezahlen.']
    ], 'Certo! Grazie e tornate presto!'),
    D('i1d05', 'A2', '🏨', 'Prenotare una camera (telefono)', 'Telefoni a un albergo di Locarno.', true, [
      ['Albergo del Lago, buongiorno!', 'Buongiorno, vorrei prenotare una camera.', ['Buongiorno, voglio camera io.', 'Pronto, chi parla?'], '« Vorrei prenotare… » forma gentile.', 'Höflich: «Vorrei prenotare …».'],
      ['Per quando?', 'Per il fine settimana del 12 luglio, due notti.', ['Per 12 luglio fine due notte.', 'Per ieri.'], 'Dare date e numero di notti.', 'Datum und Anzahl Nächte nennen.'],
      ['Per quante persone?', 'Per due persone, una camera doppia con vista lago, se possibile.', ['Per due persona.', 'Siamo doppie.'], 'Persone è plurale; camera doppia = Doppelzimmer.', 'Plural «persone»; «camera doppia».'],
      ['Sì, c’è ancora una camera. Costa 180 franchi a notte, colazione inclusa.', 'Va bene. C’è un parcheggio?', ['Va bene. Ha parcheggio voi?', 'Troppo, ciao.'], 'C’è … ? = Gibt es …?', '«C’è …?» = Gibt es …?'],
      ['Sì, gratuito. A che nome, prego?', 'A nome Keller: K, E, doppia L, E, R.', ['Il mio nome è di Keller.', 'Nome Keller è.'], 'Fare lo spelling aiuta al telefono: « doppia L ».', 'Buchstabieren: «doppia L».']
    ], 'Perfetto, signora Keller. A presto!'),
    D('i1d06', 'A2', '🩺', 'Dal medico', 'Hai il raffreddore da qualche giorno.', false, [
      ['Buongiorno, si accomodi. Cosa le succede?', 'Buongiorno dottore. Ho il raffreddore e mal di gola da tre giorni.', ['Buongiorno, sono raffreddore da tre giorni.', 'Ho male gola tre giorno.'], '« Avere il raffreddore », « mal di gola », « da tre giorni ».', '«Avere il raffreddore»; «da» = seit.'],
      ['Ha anche la febbre?', 'Un po’, ieri sera avevo 38.', ['Sì, io sono 38.', 'Ho avuto febbre ieri 38 io.'], 'Imperfetto per uno stato nel passato: avevo 38.', 'Zustand in der Vergangenheit → Imperfekt.'],
      ['Dorme bene?', 'Non molto, tossisco di notte.', ['Non molto, tosso di notte.', 'Dormo male bene.'], 'Tossire: io tossisco (come capire).', '«tossire»: io tossisco.'],
      ['Niente di grave. Le prescrivo uno sciroppo. Deve riposare.', 'Posso andare al lavoro?', ['Posso andare il lavoro?', 'Devo lavoro?'], 'Andare AL lavoro.', '«andare al lavoro».'],
      ['Meglio restare a casa due giorni.', 'Va bene, grazie mille.', ['Va bene, prego.', 'Bene va grazie.'], 'Ringraziare.', 'Danken.']
    ], 'Si figuri. Buona guarigione!'),
    D('i1d07', 'A2', '🛍️', 'In un negozio', 'Compri una giacca a Lugano.', false, [
      ['Buongiorno, posso aiutarla?', 'Sì, cerco una giacca impermeabile.', ['Sì, cerco giacca di impermeabile io.', 'No, guardo e basta io sì.'], '« Cerco … » = Ich suche …', '«Cerco …» = Ich suche …'],
      ['Che taglia porta?', 'Porto la 42.', ['Porto il 42.', 'Sono 42.'], 'La taglia (femminile) → la 42.', '«la taglia» → la 42.'],
      ['Ecco, questa è molto leggera. Vuole provarla?', 'Sì, dov’è il camerino?', ['Sì, dove camerino?', 'Provo sì camerino.'], 'Il camerino = Umkleidekabine.', 'Umkleidekabine.'],
      ['È lì in fondo. Come le sta?', 'Mi sta bene, ma è un po’ lunga. Ce l’ha più corta?', ['Mi stanno bene, ma è lunga corta.', 'È bella brutta.'], '« Mi sta bene » = sie passt mir.', '«Mi sta bene» = steht mir gut.'],
      ['Sì, ecco. Costa 120 franchi, ma oggi c’è il 20 % di sconto.', 'Perfetto, la prendo!', ['Perfetto, lo prendo!', 'Perfetto, prendi!'], 'La giacca (femminile) → la prendo.', '«la giacca» → la prendo.']
    ], 'Benissimo, passi pure alla cassa!'),
    D('i1d08', 'B1', '🏡', 'Visita di un appartamento', 'Visiti un appartamento a Bellinzona.', false, [
      ['Ecco il soggiorno. È molto luminoso, vero?', 'Sì, è bellissimo. Quanto è l’affitto, spese comprese?', ['Sì, luminoso molto. Quanto costa?', 'È buio, no?'], 'Chiedere l’affitto « spese comprese ».', 'Nach Miete inkl. Nebenkosten fragen.'],
      ['Sono 1650 franchi, di cui 200 di spese.', 'E da quando è libero l’appartamento?', ['E quando libero è?', 'Da quando appartamento libero domani?'], 'Da quando? = ab wann?', '«Da quando?» = ab wann?'],
      ['Dal primo aprile. C’è anche una cantina e un posto auto.', 'Quanto costa il posto auto?', ['Il posto auto costa quanto franchi lui?', 'Non ho auto.'], 'Domanda semplice sul prezzo.', 'Einfache Preisfrage.'],
      ['Cento franchi al mese. Ha animali?', 'No, non ho animali. Sono permessi?', ['No, non ho degli animali.', 'No, ma mangio carne.'], 'Dopo « non ho » si usa il nome senza articolo partitivo.', 'Nach Verneinung kein Teilungsartikel.'],
      ['I gatti sì, i cani no. Se le interessa, compili questo modulo.', 'Perfetto. Posso mandarglielo per e-mail?', ['Perfetto. Posso glielo mandare?', 'Lo compilo mai.'], 'Glielo = gli + lo (a lei/lui + lo).', '«glielo» = es ihm/ihr.']
    ], 'Certo. Buona giornata!')
  ];

  P.sounds = [
    { id: 'doppie', t: 'Consonanti doppie', de: 'Doppelkonsonanten (länger sprechen!)', items: ['pala – palla', 'caro – carro', 'nono – nonno', 'sete – sette', 'Il nonno beve un caffè.', 'Sette gatti nella stalla.'] },
    { id: 'gli-gn', t: 'gli / gn', de: 'gli wie «lj», gn wie «nj»', items: ['figlio', 'famiglia', 'bagno', 'montagna', 'Mia figlia va in montagna.', 'La famiglia di Gianni è a Bologna.'] },
    { id: 'c-g', t: 'c / g dolce e duro', de: 'ci/ce = «tsch», chi/che = «k»; gi/ge = «dsch», ghi/ghe = «g»', items: ['ciao – chiave', 'cena – che', 'gelato – ghiaccio', 'giro – ghiro', 'Cerco le chiavi della macchina.', 'Un gelato con il ghiaccio.'] },
    { id: 'sc', t: 'sc / sch', de: 'sci/sce = «sch», schi/sche = «sk»', items: ['sci – schiena', 'pesce – pesche', 'uscita – scuola', 'Esco dalla scuola alle tre.', 'Il pesce e le pesche.'] },
    { id: 'r', t: 'La r italiana', de: 'gerolltes Zungen-R', items: ['Roma', 'treno', 'arrivare', 'birra', 'Il treno arriva a Roma.', 'Prendo una birra rossa.'] },
    { id: 'ritmo', t: 'Ritmo e melodia', de: 'Satzmelodie (Frage vs. Aussage)', items: ['Vieni stasera?', 'Vieni stasera.', 'Che bella giornata!', 'Ma dai, davvero?', 'Allora, andiamo?'] }
  ];

  /* Zahlen auf Italienisch */
  const U = ['zero', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci', 'undici', 'dodici', 'tredici', 'quattordici', 'quindici', 'sedici', 'diciassette', 'diciotto', 'diciannove'];
  const TENS = { 2: 'venti', 3: 'trenta', 4: 'quaranta', 5: 'cinquanta', 6: 'sessanta', 7: 'settanta', 8: 'ottanta', 9: 'novanta' };
  function b100(n) {
    if (n < 20) return U[n];
    const t = TENS[Math.floor(n / 10)], u = n % 10;
    if (u === 0) return t;
    if (u === 1 || u === 8) return t.slice(0, -1) + U[u];
    return t + U[u];
  }
  function b1000(n) {
    if (n < 100) return b100(n);
    const h = Math.floor(n / 100), r = n % 100;
    let hw = h === 1 ? 'cento' : U[h] + 'cento';
    if (!r) return hw;
    const rest = b100(r);
    if (/^ott/.test(rest)) hw = hw.slice(0, -1);
    return hw + rest;
  }
  function words(n) {
    let s;
    if (n < 1000) s = b1000(n);
    else { const th = Math.floor(n / 1000), r = n % 1000; s = (th === 1 ? 'mille' : b1000(th) + 'mila') + (r ? b1000(r) : ''); }
    if (n > 10 && /tre$/.test(s)) s = s.slice(0, -3) + 'tré';
    return s;
  }
  const MONTHS = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
  P.numbers = { words, months: MONTHS, variants: false,
    fmt: {
      price: (f, c, w) => (f === 1 ? 'un franco' : w(f) + ' franchi') + (c ? ' e ' + w(c) : ''),
      phone: (groups, w) => groups.map((g) => (g[0] === '0' ? 'zero ' + w(Number(g)) : w(Number(g)))).join(', '),
      time: (h, m, w) => (h === 1 ? 'l’una' : 'le ' + w(h)) + (m ? ' e ' + w(m) : ''),
      year: (n, w) => 'nel ' + w(n),
      date: (d, mo, w, months) => (d === 1 ? 'il primo' : d === 8 || d === 11 ? 'l’' + w(d) : 'il ' + w(d)) + ' ' + months[mo]
    } };

  const C = (id, l, t, topics, fr, de) => ({ id, l, t, topics, fr, de });
  P.grammar = [
    C('articoli', 'A1', 'Gli articoli', ['articoli'],
`<table><tr><th></th><th>Maschile</th><th>Femminile</th></tr>
<tr><td>determinativo sing.</td><td><u>il</u> treno · <u>lo</u> zaino / studente · <u>l’</u>albergo</td><td><u>la</u> casa · <u>l’</u>acqua</td></tr>
<tr><td>determinativo plur.</td><td><u>i</u> treni · <u>gli</u> zaini / alberghi</td><td><u>le</u> case · <u>le</u> acque</td></tr>
<tr><td>indeterminativo</td><td><u>un</u> treno / albergo · <u>uno</u> zaino</td><td><u>una</u> casa · <u>un’</u>amica</td></tr></table>
<p><b>lo / uno / gli</b> davanti a: s + consonante (studente), z (zaino), gn, ps, y.<br><b>l’</b> davanti a vocale.</p>`,
`Männlich: il (normal), lo (vor s+Konsonant, z, gn, ps), l’ (vor Vokal); Plural i / gli. Weiblich: la, l’ (vor Vokal); Plural le. Unbestimmt: un, uno, una, un’.`),
    C('presente', 'A1', 'Il presente', ['presente', 'essere', 'avere', 'verbi irregolari'],
`<table><tr><th></th><th>-are (parlare)</th><th>-ere (prendere)</th><th>-ire (dormire)</th><th>-ire (capire)</th></tr>
<tr><td>io</td><td>parl<u>o</u></td><td>prend<u>o</u></td><td>dorm<u>o</u></td><td>cap<u>isco</u></td></tr>
<tr><td>tu</td><td>parl<u>i</u></td><td>prend<u>i</u></td><td>dorm<u>i</u></td><td>cap<u>isci</u></td></tr>
<tr><td>lui/lei</td><td>parl<u>a</u></td><td>prend<u>e</u></td><td>dorm<u>e</u></td><td>cap<u>isce</u></td></tr>
<tr><td>noi</td><td>parl<u>iamo</u></td><td>prend<u>iamo</u></td><td>dorm<u>iamo</u></td><td>cap<u>iamo</u></td></tr>
<tr><td>voi</td><td>parl<u>ate</u></td><td>prend<u>ete</u></td><td>dorm<u>ite</u></td><td>cap<u>ite</u></td></tr>
<tr><td>loro</td><td>parl<u>ano</u></td><td>prend<u>ono</u></td><td>dorm<u>ono</u></td><td>cap<u>iscono</u></td></tr></table>
<p><b>Essere</b> : sono, sei, è, siamo, siete, sono · <b>Avere</b> : ho, hai, ha, abbiamo, avete, hanno (la h non si pronuncia).</p>
<p>Il pronome soggetto (io, tu…) di solito non si dice: <i>Parlo italiano.</i></p>`,
`Präsens: Endungen nach -are/-ere/-ire; manche -ire-Verben mit -isc- (capisco). Subjektpronomen lässt man meist weg. essere = sein, avere = haben.`),
    C('preposizioni', 'A1', 'Le preposizioni', ['preposizioni', 'preposizioni articolate'],
`<p><b>a</b> + città (vado <u>a</u> Lugano) · <b>in</b> + paese/regione (abito <u>in</u> Svizzera, <u>in</u> Ticino) · <b>di</b> = origine (sono <u>di</u> Berna) · <b>da</b> = da un luogo / da una persona (vengo <u>da</u> Zurigo, vado <u>dal</u> medico).</p>
<table><tr><th></th><th>il</th><th>lo</th><th>la</th><th>l’</th><th>i</th><th>gli</th><th>le</th></tr>
<tr><td>di</td><td>del</td><td>dello</td><td>della</td><td>dell’</td><td>dei</td><td>degli</td><td>delle</td></tr>
<tr><td>a</td><td>al</td><td>allo</td><td>alla</td><td>all’</td><td>ai</td><td>agli</td><td>alle</td></tr>
<tr><td>da</td><td>dal</td><td>dallo</td><td>dalla</td><td>dall’</td><td>dai</td><td>dagli</td><td>dalle</td></tr>
<tr><td>in</td><td>nel</td><td>nello</td><td>nella</td><td>nell’</td><td>nei</td><td>negli</td><td>nelle</td></tr>
<tr><td>su</td><td>sul</td><td>sullo</td><td>sulla</td><td>sull’</td><td>sui</td><td>sugli</td><td>sulle</td></tr></table>`,
`a + Stadt, in + Land, di = Herkunft, da = von / bei jemandem. Präposition + Artikel verschmelzen (da + il = dal, in + la = nella …).`),
    C('cè', 'A1', 'C’è / ci sono e la negazione', ['c’è / ci sono', 'negazione'],
`<p><b>C’è</b> + singolare, <b>ci sono</b> + plurale = es gibt. <i>In piazza <u>c’è</u> un bar. Nel lago <u>ci sono</u> molti pesci.</i></p>
<p>Negazione: <b>non</b> davanti al verbo. <i>Non capisco. Non c’è il sole.</i> Doppia negazione normale: <i>Non mangio <u>mai</u> carne. Non vedo <u>niente</u>. Non c’è <u>nessuno</u>.</i></p>`,
`c’è = es gibt (Singular), ci sono = es gibt (Plural). Verneinung mit «non» vor dem Verb; doppelte Verneinung ist normal (non … mai/niente/nessuno).`),
    C('plurale', 'A1', 'Il plurale', ['plurale'],
`<table><tr><th>Singolare</th><th>Plurale</th><th>Esempio</th></tr>
<tr><td>-o (m.)</td><td>-i</td><td>il treno → i treni</td></tr>
<tr><td>-a (f.)</td><td>-e</td><td>la casa → le case</td></tr>
<tr><td>-e (m./f.)</td><td>-i</td><td>la chiave → le chiavi</td></tr>
<tr><td>accento finale / parola straniera</td><td>invariato</td><td>il caffè → i caffè, il bar → i bar</td></tr></table>
<p>Irregolari frequenti: l’uomo → gli uomini, la mano → le mani, l’uovo → le uova.</p>`,
`Plural: -o → -i, -a → -e, -e → -i. Wörter mit Endakzent oder Fremdwörter bleiben gleich.`),
    C('passato', 'A2', 'Il passato prossimo', ['passato prossimo', 'riflessivi'],
`<p>Formazione: <b>avere</b> o <b>essere</b> al presente + participio passato. Participio regolare: -are → <u>-ato</u>, -ere → <u>-uto</u>, -ire → <u>-ito</u>.</p>
<p><b>Con essere</b> : verbi di movimento o cambiamento (andare, venire, arrivare, partire, uscire, tornare, restare, diventare, nascere…) e tutti i verbi riflessivi. Il participio si accorda: <i>Maria è andat<u>a</u>, siamo arrivat<u>i</u>.</i></p>
<p>Participi irregolari: fatto, detto, letto, scritto, preso, messo, visto, aperto, bevuto, stato, venuto, vissuto, chiesto, risposto.</p>`,
`Perfekt mit avere oder essere + Partizip. Mit essere (Bewegung, Zustandswechsel, reflexive Verben) passt sich das Partizip an (andato/andata/andati/andate).`),
    C('imperfetto', 'A2', 'Passato prossimo o imperfetto?', ['imperfetto', 'passato prossimo / imperfetto'],
`<table><tr><th>Imperfetto</th><th>Passato prossimo</th></tr>
<tr><td>Abitudine: <i>Da bambino <u>andavo</u> al lago.</i></td><td>Azione unica: <i>Ieri <u>sono andato</u> al lago.</i></td></tr>
<tr><td>Descrizione: <i><u>Pioveva</u> e <u>faceva</u> freddo.</i></td><td>Evento: <i>È <u>arrivato</u> il treno.</i></td></tr>
<tr><td>Azione in corso: <i>Mentre <u>guardavo</u> la TV…</i></td><td>Azione che interrompe: <i>… <u>è suonato</u> il telefono.</i></td></tr></table>
<p>Imperfetto: -avo, -avi, -ava, -avamo, -avate, -avano (parlare → parlavo). Essere: ero, eri, era, eravamo, eravate, erano.</p>`,
`Imperfekt = Gewohnheit, Beschreibung, laufende Handlung. Passato prossimo = einmalige, abgeschlossene Handlung.`),
    C('pronomi', 'A2', 'I pronomi diretti e indiretti', ['pronomi', 'piacere', 'ci / ne'],
`<table><tr><th></th><th>diretto (Akk.)</th><th>indiretto (Dat.)</th></tr>
<tr><td>lui</td><td>lo</td><td>gli</td></tr><tr><td>lei</td><td>la</td><td>le</td></tr>
<tr><td>loro</td><td>li / le</td><td>gli</td></tr><tr><td>io / tu / noi / voi</td><td colspan="2">mi / ti / ci / vi</td></tr></table>
<p><i>Conosci Marco? Sì, <u>lo</u> conosco. Telefoni a Sara? Sì, <u>le</u> telefono.</i></p>
<p><b>Piacere</b> funziona al contrario del tedesco: <i>Mi <u>piace</u> il gelato. Mi <u>piacciono</u> i gelati.</i> (= der Gegenstand ist Subjekt).</p>
<p><b>ci</b> = luogo (Ci vado domani) · <b>ne</b> = quantità (Ne ho due).</p>`,
`Direkte Pronomen lo/la/li/le, indirekte gli/le. «piacere»: Mi piace + Singular, mi piacciono + Plural. ci = dort(hin), ne = davon.`)
  ];

  const S = (id, l, t, fr, de, secs, expr, check) => ({ id, l, t, fr, de, secs, expr, check });
  P.speaking = [
    S('is01', 'A1', 'Presentarsi', 'Presentati: nome, dove abiti, lavoro, famiglia, hobby.', 'Stell dich vor: Name, Wohnort, Arbeit, Familie, Hobbys.', 45, ['Mi chiamo…', 'Abito a…', 'Lavoro come… / in…', 'Nel tempo libero…'], ['Ho detto il mio nome e dove abito', 'Ho parlato della famiglia', 'Ho detto un hobby']),
    S('is02', 'A1', 'La mia giornata', 'Descrivi una tua giornata normale.', 'Beschreibe einen normalen Tag.', 60, ['La mattina mi alzo alle…', 'Poi…', 'A mezzogiorno…', 'La sera…'], ['Ho usato almeno 3 verbi diversi', 'Ho detto delle ore', 'Ho usato « poi »']),
    S('is03', 'A1', 'Al bar', 'Ordina la colazione al bar e chiedi quanto costa.', 'Bestelle Frühstück in einer Bar und frag nach dem Preis.', 45, ['Vorrei…', 'Per favore', 'Quanto pago?', 'Grazie, arrivederci!'], ['Ho usato « vorrei »', 'Ho chiesto il prezzo', 'Ho salutato']),
    S('is04', 'A2', 'Il mio ultimo weekend', 'Racconta cosa hai fatto lo scorso fine settimana.', 'Erzähle von deinem letzten Wochenende.', 75, ['Sabato sono andato/a…', 'Ho mangiato…', 'Era molto…', 'Poi abbiamo…'], ['Ho usato il passato prossimo', 'Ho usato « essere » con andare/arrivare', 'Ho dato un’opinione (era bello…)']),
    S('is05', 'A2', 'Le vacanze in Ticino', 'Racconta (o immagina) una vacanza in Ticino.', 'Erzähle (oder erfinde) Ferien im Tessin.', 75, ['Siamo stati a…', 'Abbiamo visitato…', 'Mi è piaciuto molto…', 'Il tempo era…'], ['Almeno due luoghi', 'Una cosa che ti è piaciuta (mi è piaciuto/a)', 'Il tempo (era bello, pioveva…)']),
    S('is06', 'A2', 'Telefonare all’albergo', 'Lascia un messaggio alla segreteria di un albergo: vuoi prenotare una camera.', 'Hinterlasse einem Hotel eine Nachricht: du willst ein Zimmer reservieren.', 60, ['Buongiorno, sono…', 'Vorrei prenotare…', 'Per … notti', 'Mi può richiamare al…'], ['Mi sono presentato/a', 'Date e persone', 'Un numero di telefono'])
  ];

  const W = (id, l, type, t, fr, de, words, expr, check, model) => ({ id, l, type, t, fr, de, words, expr, check, model });
  P.writing = [
    W('iw01', 'A1', 'messaggio', 'Un invito', 'Scrivi un messaggio a un’amica per invitarla a cena (giorno, ora, luogo).', 'Lade eine Freundin per Nachricht zum Abendessen ein.', [20, 50], ['Ciao…', 'Vuoi venire a cena…?', 'Alle…', 'A presto!'], ['Giorno e ora', 'Luogo', 'Saluto all’inizio e alla fine'],
      'Ciao Laura!\nVuoi venire a cena da me sabato sera? Alle sette e mezza, in via Nassa 5. Faccio la pizza!\nA presto,\nAnna'),
    W('iw02', 'A1', 'cartolina', 'Una cartolina', 'Scrivi una cartolina dalle vacanze: dove sei, com’è il tempo, cosa fai.', 'Schreibe eine Ferienpostkarte: wo, Wetter, was du machst.', [30, 60], ['Caro / Cara…', 'Sono a…', 'Il tempo è…', 'Ogni giorno…', 'Un abbraccio'], ['Luogo', 'Tempo', 'Due attività'],
      'Cara Martina,\nsono a Lugano con la mia famiglia. Il tempo è bellissimo e fa caldo. Ogni giorno facciamo il bagno nel lago e mangiamo un gelato. Domani andiamo sul Monte San Salvatore.\nUn abbraccio,\nSabine'),
    W('iw03', 'A2', 'e-mail', 'Prenotazione', 'Scrivi un’e-mail a un albergo per prenotare una camera e chiedere informazioni sul parcheggio.', 'E-Mail an ein Hotel: Zimmer reservieren und nach Parkplatz fragen.', [40, 80], ['Gentili signori,', 'vorrei prenotare…', 'Potreste dirmi se…?', 'Cordiali saluti'], ['Saluto formale', 'Date e persone', 'Una domanda gentile (potreste…)'],
      'Gentili signori,\nvorrei prenotare una camera doppia dal 12 al 14 luglio per due persone. Potreste dirmi se l’albergo ha un parcheggio e quanto costa?\nGrazie mille in anticipo.\nCordiali saluti,\nSabine Keller'),
    W('iw04', 'A2', 'racconto', 'Il mio weekend', 'Racconta il tuo ultimo fine settimana.', 'Erzähle von deinem letzten Wochenende.', [50, 90], ['Sabato mattina…', 'Poi…', 'La sera…', 'È stato un weekend…'], ['Passato prossimo', 'Almeno 3 attività', 'Un’opinione finale'],
      'Sabato mattina sono andata al mercato di Bellinzona con mia sorella. Abbiamo comprato frutta, formaggio e fiori. Poi abbiamo mangiato in un piccolo ristorante in piazza. Il pomeriggio ho letto un libro in giardino. La sera siamo andati al cinema con alcuni amici. È stato un weekend tranquillo, ma molto bello.')
  ];

  P.radio = {
    intro: 'Voci vere della Svizzera italiana. Ascolta un breve momento con l’app RSI, un lettore di podcast o il browser, poi compila la tua scheda d’ascolto.',
    introDe: 'Echte Stimmen aus der italienischen Schweiz. Höre kurz in der RSI-App, einer Podcast-App oder im Browser rein und fülle danach deine Hörnotiz aus.',
    sources: [
      { name: 'RSI – Radio in diretta', l: 'A2', kind: 'radio', desc: 'Rete Uno, Rete Due e Rete Tre in diretta. Per cominciare: musica e brevi annunci (Rete Tre).', url: 'https://www.rsi.ch/play/radio' },
      { name: 'Radiogiornale (Rete Uno)', l: 'B1', kind: 'podcast', desc: 'I fatti del giorno, dalla Svizzera e dal mondo. Lingua chiara, frasi brevi.', url: 'https://www.rsi.ch/s/703560' },
      { name: 'Millevoci (Rete Uno)', l: 'B1', kind: 'podcast', desc: 'Intrattenimento e chiacchiere su temi della vita quotidiana.', url: 'https://www.rsi.ch/rete-uno/programmi/intrattenimento/millevoci/' },
      { name: 'SEIDISERA (Rete Uno)', l: 'B2', kind: 'podcast', desc: 'L’attualità di fine pomeriggio con interviste e dibattiti.', url: 'https://www.rsi.ch/s/703905' },
      { name: 'RSI Audio e Podcast', l: 'A2', kind: 'podcast', desc: 'Tutti i programmi e podcast della RSI, per temi (viaggi, territorio, musica…).', url: 'https://www.rsi.ch/audio' }
    ],
    tips: [
      ['Ascolto attivo', 'Ascolta 2–3 minuti, non di più. Meglio un breve pezzo due volte che un’ora in sottofondo.', 'Höre 2–3 Minuten aktiv zu, lieber zweimal kurz als lange nebenbei.'],
      ['Due passaggi', '1° ascolto: capire il tema. 2° ascolto: annotare parole che riconosci.', '1. Durchgang: Thema verstehen. 2. Durchgang: bekannte Wörter notieren.'],
      ['Musica', 'Per cominciare, ascolta canzoni italiane e cerca il testo: è il modo più piacevole per abituare l’orecchio.', 'Zum Einstieg italienische Lieder hören und den Text dazu lesen.']
    ]
  };

  P.aiScenarios = [
    { id: 'bar', ic: '☕', t: 'Al bar', role: 'a friendly barista in a café in Lugano', task: 'The learner orders breakfast and pays. Keep it very simple.', min: 'A1' },
    { id: 'stazione', ic: '🚆', t: 'In stazione', role: 'a ticket agent of the Swiss railways (FFS) in Bellinzona', task: 'The learner buys a ticket to Locarno and asks about the platform and time.', min: 'A1' },
    { id: 'grotto', ic: '🍽️', t: 'Al grotto', role: 'a waiter in a grotto in Valle Maggia', task: 'The learner orders typical Ticino food (polenta, salumi, merlot) and asks for the bill.', min: 'A2' },
    { id: 'albergo', ic: '🏨', t: 'All’albergo', role: 'a receptionist of a hotel in Ascona', task: 'The learner checks in, asks about breakfast time and recommendations.', min: 'A2' },
    { id: 'turismo', ic: '🗺️', t: 'Ufficio turistico', role: 'an employee of the tourist office in Locarno', task: 'The learner asks what to visit in two days (Verzasca, Brissago islands, castles of Bellinzona).', min: 'A2' },
    { id: 'negozio', ic: '🛍️', t: 'In un negozio', role: 'a shop assistant in a clothing shop in Lugano', task: 'The learner looks for a jacket, asks about size and price.', min: 'A2' },
    { id: 'collega', ic: '💼', t: 'Una nuova collega', role: 'a friendly new colleague from Ticino', task: 'Small talk at work: introductions, where you live, weekend plans.', min: 'A2' },
    { id: 'libera', ic: '💬', t: 'Conversazione libera', role: 'a friendly person from Ticino', task: 'Free conversation. Start by asking the learner what they would like to talk about. Keep sentences short and simple.', min: 'A1' }
  ];
})();
