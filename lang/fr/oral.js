/* Französisch: Zahlen in Worten (CH/FR) und Lautgruppen fürs Shadowing. Sprachspezifisch. */
(function () {
  const F = window.LINGUA_PACKS.fr;
  const U = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize'];
  const T = { 2: 'vingt', 3: 'trente', 4: 'quarante', 5: 'cinquante', 6: 'soixante' };
  /* variant: 'ch' = septante/huitante/nonante, 'fr' = soixante-dix/quatre-vingts/quatre-vingt-dix */
  function below100(n, v) {
    if (n <= 16) return U[n];
    if (n < 20) return 'dix-' + U[n - 10];
    const t = Math.floor(n / 10), u = n % 10;
    if (v === 'ch' && t >= 7) {
      const base = { 7: 'septante', 8: 'huitante', 9: 'nonante' }[t];
      return u === 0 ? base : u === 1 ? base + ' et un' : base + '-' + U[u];
    }
    if (t <= 6) return u === 0 ? T[t] : u === 1 ? T[t] + ' et un' : T[t] + '-' + U[u];
    if (t === 7) return n === 71 ? 'soixante et onze' : 'soixante-' + below100(n - 60, v);
    if (t === 8) return n === 80 ? 'quatre-vingts' : 'quatre-vingt-' + U[u];
    return 'quatre-vingt-' + below100(n - 80, v); // 90–99
  }
  function below1000(n, v) {
    if (n < 100) return below100(n, v);
    const h = Math.floor(n / 100), r = n % 100;
    const hw = h === 1 ? 'cent' : U[h] + ' cent' + (r === 0 ? 's' : '');
    return r === 0 ? hw : hw + ' ' + below100(r, v);
  }
  function words(n, v) {
    v = v || 'fr';
    if (n < 1000) return below1000(n, v);
    const th = Math.floor(n / 1000), r = n % 1000;
    const tw = th === 1 ? 'mille' : below1000(th, v).replace(/cents$/, 'cent').replace(/vingts$/, 'vingt') + ' mille';
    return r === 0 ? tw : tw + ' ' + below1000(r, v);
  }
  const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  F.numbers = { words, months: MONTHS, variants: true };

  /* Lautgruppen: Wörter und kurze Sätze zum Nachsprechen */
  F.sounds = [
    { id: 'u-ou', t: 'u / ou', de: 'ü-Laut (u) vs. u-Laut (ou)', items: ['tu – tout', 'vu – vous', 'rue – roue', 'dessus – dessous', 'pur – pour', 'Tu as vu la roue de la voiture ?', 'Où est la rue du Bourg ?', 'Je voudrais une douzaine de pommes.'] },
    { id: 'nasales', t: 'Voyelles nasales', de: 'Nasale: an/en – on – in/un', items: ['vent – vont – vin', 'lent – long – lin', 'blanc – blond – brin', 'Un bon vin blanc.', 'Mon oncle vient demain matin.', 'On commence en novembre.', 'Il y a du vent dans les champs.'] },
    { id: 'e', t: 'é / è / e muet', de: 'geschlossenes é, offenes è, stummes e', items: ['été – était', 'les – lait', 'parler – parlait', 'le – les', 'Je me demande ce que tu fais.', 'Elle préfère la mer en été.', 'Il fait très frais ce matin.'] },
    { id: 'liaison', t: 'Liaisons', de: 'Bindungen zwischen Wörtern', items: ['les amis', 'vous avez', 'ils ont – ils sont', 'deux heures', 'un petit enfant', 'C’est un grand hôtel.', 'Nous avons attendu trois ans.', 'Elles arrivent à six heures.'] },
    { id: 'r', t: 'Le r français', de: 'Zäpfchen-R', items: ['rouge', 'Paris', 'trois', 'autre', 'Le rat rentre à la maison.', 'Il prend le train de trois heures.', 'Je préfère rester ici.'] },
    { id: 'rythme', t: 'Rythme et mélodie', de: 'Satzrhythmus und Melodie', items: ['Tu viens ce soir ?', 'Tu viens ce soir.', 'Qu’est-ce que tu en penses ?', 'Ah bon ? Je ne savais pas !', 'Bon, alors, on y va ?', 'Franchement, je ne sais pas quoi dire.'] }
  ];
})();
