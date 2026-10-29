/*
 * FIGC 2026 — La corsa alla presidenza · dati
 * Aggiornati al 29 ottobre 2026, 18:30 (ora di Roma).
 * Per aggiornare la pagina basta modificare questo file:
 *   - side: "galliani" | "malago" | "undecided"
 *   - ogni voce porta con sé fonte, data e una nota breve.
 */
window.FIGC_DATA = {
  updated: "2026-10-29T17:30:00Z",
  headline:
    "AIC e AIAC ufficializzano le firme per Galliani; Malagò ha 11 club di Serie A. Ora tocca a LND, Lega Pro e Serie B.",

  election: {
    assembly: "2026-12-14",
    deadline: "2026-11-04T22:59:00Z", // 23:59 ora di Roma
    totalVotes: 516,
  },

  candidates: {
    galliani: {
      name: "Adriano Galliani",
      initials: "AG",
      photo: "img/candidati/galliani.jpg",
      role: "Ex amministratore delegato di Milan e Monza",
      route:
        "Accreditato da calciatori (AIC) e allenatori (AIAC): firme raccolte, annuncio congiunto del 29 ottobre.",
      tessera: "Tesserato come dirigente accompagnatore dell'Enotria 1908",
      backers: "Fronte guidato in Serie A da Marotta (Inter) e Percassi (Atalanta)",
    },
    malago: {
      name: "Giovanni Malagò",
      initials: "GM",
      photo: "img/candidati/malago.jpg",
      role: "Commissario federale, ex presidente del CONI",
      route:
        "Accreditato dalla Lega Serie A: 11 club su 20, il minimo richiesto (Como ultima firma).",
      tessera: "Tesserato come dirigente accompagnatore del Circolo Aniene",
      backers: "Fronte guidato da De Laurentiis (Napoli) e dalla Roma",
    },
  },

  /* Pesi: Statuto FIGC art. 20. Delegati e voti per delegato: Regolamento elettorale e dei voti
     dell'Assemblea elettiva, art. 2 (274 delegati, 516 voti). */
  components: [
    {
      id: "lnd", short: "LND", name: "Lega Nazionale Dilettanti", leader: "Giancarlo Abete",
      weight: 34, delegates: 99, perDelegate: 1.772,
      side: "galliani", status: "presunta",
      note: "Presunta: il Giornale dà i dilettanti pronti a convergere su Galliani e Il Fatto scrive che Abete non ama Malagò. Ufficialmente la LND non ha un candidato proprio e attende la riunione delle Leghe di venerdì 30.",
      outlet: "il Giornale", date: "2026-10-27",
      url: "https://www.ilgiornale.it/news/calcio/figc-galliani-spacca-la-a-i-dilettanti-ago-della-bilancia/",
    },
    {
      id: "aic", short: "AIC", name: "Calciatori (Assocalciatori)", leader: "Umberto Calcagno",
      weight: 20, delegates: 52, perDelegate: 1.984,
      side: "galliani", status: "ufficiale",
      note: "Nota congiunta con l'AIAC: completata la raccolta delle firme per candidare Galliani.",
      outlet: "Ilovepalermocalcio (nota AIC-AIAC)", date: "2026-10-29",
      url: "https://www.ilovepalermocalcio.com/figc-ufficiale-aic-e-aiac-sostengono-galliani-raccolte-le-firme-per-la-candidatura-alla-presidenza/",
    },
    {
      id: "aiac", short: "AIAC", name: "Allenatori (Assoallenatori)", leader: "Renzo Ulivieri",
      weight: 10, delegates: 26, perDelegate: 1.984,
      side: "galliani", status: "ufficiale",
      note: "Firma la nota congiunta con l'AIC a sostegno di Galliani.",
      outlet: "Ilovepalermocalcio (nota AIC-AIAC)", date: "2026-10-29",
      url: "https://www.ilovepalermocalcio.com/figc-ufficiale-aic-e-aiac-sostengono-galliani-raccolte-le-firme-per-la-candidatura-alla-presidenza/",
    },
    {
      id: "legapro", short: "Lega Pro", name: "Lega Pro (Serie C)", leader: "Matteo Marani",
      weight: 12, delegates: 57, perDelegate: 1.086,
      side: "undecided", status: "nessuna",
      note: "Nessuna posizione. Per Adnkronos è tra le componenti potenzialmente ostili a Malagò, ma non c'è un'indicazione. Decide al tavolo delle Leghe di venerdì 30.",
      outlet: "Adnkronos", date: "2026-10-27",
      url: "https://www.adnkronos.com/sport/federcalcio-partita-aperta-tra-malago-e-galliani-per-il-candidato-della-serie-a-si-decide-in-queste-ore_4MoSIGWztWdamtRpEZll5M",
    },
    {
      id: "serieb", short: "Serie B", name: "Lega Nazionale Professionisti B", leader: "Paolo Bedin",
      weight: 6, delegates: 20, perDelegate: 1.548,
      side: "undecided", status: "nessuna",
      note: "Nessuna posizione. Partecipa al tavolo delle Leghe di venerdì 30.",
      outlet: "il Giornale", date: "2026-10-29",
      url: "https://www.ilgiornale.it/news/calcio/aic-e-aiac-scelgono-galliani/",
    },
  ],

  seriea: { weight: 18, delegates: 20, perDelegate: 4.644, leader: "Ezio Simonelli" },

  /* Club di Serie A: un delegato ciascuno (il presidente o un membro del CdA).
     kit = simbolo stilizzato originale (scudo con i colori sociali), non lo stemma ufficiale.
     Tipi: stripes (n strisce), halves, diag, band, sash, chevron, tricolor. */
  clubs: [
    { id: "inter", name: "Inter", city: "Milano", abbr: "INT", c1: "#0a5fa8", c2: "#111111", kit: { type: "stripes", n: 5, colors: ["#0a5fa8", "#111111"] }, side: "galliani", status: "presunta", outlet: "la Repubblica", date: "2026-10-27", note: "Marotta tra i promotori della candidatura Galliani.", url: "https://www.calciomercato.com/liste/presidenza-figc-serie-a-spaccata-chi-sta-con-galliani-chi-con-malago-e-i-club-indecisi-gli-schieramenti/blt00a6e47a168003a4" },
    { id: "milan", name: "Milan", city: "Milano", abbr: "MIL", c1: "#d7101e", c2: "#111111", kit: { type: "stripes", n: 5, colors: ["#d7101e", "#111111"] }, side: "galliani", status: "presunta", outlet: "la Repubblica", date: "2026-10-27", note: "Nel blocco lombardo con Inter e Atalanta.", url: "https://www.calciomercato.com/liste/presidenza-figc-serie-a-spaccata-chi-sta-con-galliani-chi-con-malago-e-i-club-indecisi-gli-schieramenti/blt00a6e47a168003a4" },
    { id: "atalanta", name: "Atalanta", city: "Bergamo", abbr: "ATA", c1: "#1e71b8", c2: "#111111", kit: { type: "stripes", n: 3, colors: ["#1e71b8", "#111111"] }, side: "galliani", status: "presunta", outlet: "la Repubblica", date: "2026-10-27", note: "Luca Percassi guida il fronte Galliani.", url: "https://www.calciomercato.com/liste/presidenza-figc-serie-a-spaccata-chi-sta-con-galliani-chi-con-malago-e-i-club-indecisi-gli-schieramenti/blt00a6e47a168003a4" },
    { id: "parma", name: "Parma", city: "Parma", abbr: "PAR", c1: "#f5c800", c2: "#1b3a8c", kit: { type: "band", colors: ["#f5c800", "#1b3a8c"] }, side: "galliani", status: "presunta", outlet: "la Repubblica", date: "2026-10-27", note: "Attribuito al fronte Galliani.", url: "https://www.calciomercato.com/liste/presidenza-figc-serie-a-spaccata-chi-sta-con-galliani-chi-con-malago-e-i-club-indecisi-gli-schieramenti/blt00a6e47a168003a4" },
    { id: "sassuolo", name: "Sassuolo", city: "Sassuolo", abbr: "SAS", c1: "#00a651", c2: "#111111", kit: { type: "stripes", n: 5, colors: ["#00a651", "#111111"] }, side: "galliani", status: "presunta", outlet: "la Repubblica", date: "2026-10-27", note: "Attribuito al fronte Galliani.", url: "https://www.calciomercato.com/liste/presidenza-figc-serie-a-spaccata-chi-sta-con-galliani-chi-con-malago-e-i-club-indecisi-gli-schieramenti/blt00a6e47a168003a4" },
    { id: "cagliari", name: "Cagliari", city: "Cagliari", abbr: "CAG", c1: "#a6192e", c2: "#002b5c", kit: { type: "diag", colors: ["#a6192e", "#002b5c"] }, side: "galliani", status: "presunta", outlet: "la Repubblica", date: "2026-10-27", note: "Attribuito al fronte Galliani.", url: "https://www.calciomercato.com/liste/presidenza-figc-serie-a-spaccata-chi-sta-con-galliani-chi-con-malago-e-i-club-indecisi-gli-schieramenti/blt00a6e47a168003a4" },
    { id: "lazio", name: "Lazio", city: "Roma", abbr: "LAZ", c1: "#87d3f4", c2: "#ffffff", kit: { type: "sash", colors: ["#87d3f4", "#ffffff"] }, side: "galliani", status: "presunta", outlet: "il Giornale", date: "2026-10-28", note: "Inserita nel fronte Galliani (anche per Fanpage); adesione non formalizzata.", url: "https://www.ilgiornale.it/news/calcio/la-a-resta-ancora-spaccata/" },

    { id: "roma", name: "Roma", city: "Roma", abbr: "ROM", c1: "#8e1f2f", c2: "#f0bc42", kit: { type: "band", colors: ["#8e1f2f", "#f0bc42"] }, side: "malago", status: "presunta", outlet: "Gazzetta dello Sport", date: "2026-10-29", note: "Tra gli 11 firmatari per Malagò.", url: "https://www.fcinter1908.it/ultimora/figc-11-club-serie-a-malago-galliani-voti-elezioni/" },
    { id: "napoli", name: "Napoli", city: "Napoli", abbr: "NAP", c1: "#12a0d7", c2: "#0b2a4a", kit: { type: "band", colors: ["#12a0d7", "#0b2a4a"] }, side: "malago", status: "presunta", outlet: "Gazzetta dello Sport", date: "2026-10-29", note: "De Laurentiis il più deciso a difendere Malagò.", url: "https://www.fcinter1908.it/ultimora/figc-11-club-serie-a-malago-galliani-voti-elezioni/" },
    { id: "bologna", name: "Bologna", city: "Bologna", abbr: "BOL", c1: "#1a2f48", c2: "#a21c26", kit: { type: "stripes", n: 5, colors: ["#a21c26", "#1a2f48"] }, side: "malago", status: "presunta", outlet: "Gazzetta dello Sport", date: "2026-10-29", note: "Tra gli 11 firmatari per Malagò.", url: "https://www.fcinter1908.it/ultimora/figc-11-club-serie-a-malago-galliani-voti-elezioni/" },
    { id: "torino", name: "Torino", city: "Torino", abbr: "TOR", c1: "#7a1c1c", c2: "#ffffff", kit: { type: "band", colors: ["#7a1c1c", "#ffffff"] }, side: "malago", status: "presunta", outlet: "Gazzetta dello Sport", date: "2026-10-29", note: "Tra gli 11 firmatari per Malagò.", url: "https://www.fcinter1908.it/ultimora/figc-11-club-serie-a-malago-galliani-voti-elezioni/" },
    { id: "lecce", name: "Lecce", city: "Lecce", abbr: "LEC", c1: "#f2c500", c2: "#d7171f", kit: { type: "stripes", n: 5, colors: ["#f2c500", "#d7171f"] }, side: "malago", status: "presunta", outlet: "Gazzetta dello Sport", date: "2026-10-29", note: "Tra gli 11 firmatari per Malagò.", url: "https://www.fcinter1908.it/ultimora/figc-11-club-serie-a-malago-galliani-voti-elezioni/" },
    { id: "monza", name: "Monza", city: "Monza", abbr: "MON", c1: "#d50032", c2: "#ffffff", kit: { type: "diag", colors: ["#d50032", "#ffffff"] }, side: "malago", status: "presunta", outlet: "Gazzetta dello Sport", date: "2026-10-29", note: "Tra gli 11 firmatari per Malagò.", url: "https://www.fcinter1908.it/ultimora/figc-11-club-serie-a-malago-galliani-voti-elezioni/" },
    { id: "frosinone", name: "Frosinone", city: "Frosinone", abbr: "FRO", c1: "#f5d400", c2: "#0055a4", kit: { type: "halves", colors: ["#f5d400", "#0055a4"] }, side: "malago", status: "presunta", outlet: "Italpress", date: "2026-10-28", note: "Era tra i non attribuiti; ora tra gli 11 firmatari.", url: "https://www.italpress.com/figc-malago-sara-candidato-lega-di-serie-a-arrivo-undicesima-firma/" },
    { id: "genoa", name: "Genoa", city: "Genova", abbr: "GEN", c1: "#a50021", c2: "#0d1e45", kit: { type: "halves", colors: ["#a50021", "#0d1e45"] }, side: "malago", status: "presunta", outlet: "Italpress", date: "2026-10-28", note: "Passato dal fronte Galliani a quello di Malagò.", url: "https://www.italpress.com/figc-malago-sara-candidato-lega-di-serie-a-arrivo-undicesima-firma/" },
    { id: "udinese", name: "Udinese", city: "Udine", abbr: "UDI", c1: "#111111", c2: "#ffffff", kit: { type: "stripes", n: 3, colors: ["#ffffff", "#111111"] }, side: "malago", status: "presunta", outlet: "Italpress", date: "2026-10-28", note: "Era tra i non attribuiti; ora tra gli 11 firmatari.", url: "https://www.italpress.com/figc-malago-sara-candidato-lega-di-serie-a-arrivo-undicesima-firma/" },
    { id: "fiorentina", name: "Fiorentina", city: "Firenze", abbr: "FIO", c1: "#5b2a86", c2: "#ffffff", kit: { type: "sash", colors: ["#5b2a86", "#ffffff"] }, side: "malago", status: "presunta", outlet: "Italpress", date: "2026-10-28", note: "Era tra i non attribuiti; ora tra gli 11 firmatari.", url: "https://www.italpress.com/figc-malago-sara-candidato-lega-di-serie-a-arrivo-undicesima-firma/" },
    { id: "como", name: "Como", city: "Como", abbr: "COM", c1: "#1b3a6b", c2: "#ffffff", kit: { type: "chevron", colors: ["#1b3a6b", "#ffffff"] }, side: "malago", status: "presunta", outlet: "Italpress", date: "2026-10-28", note: "Undicesima firma, decisiva: era dato con Galliani.", url: "https://www.italpress.com/figc-malago-sara-candidato-lega-di-serie-a-arrivo-undicesima-firma/" },

    { id: "juventus", name: "Juventus", city: "Torino", abbr: "JUV", c1: "#111111", c2: "#ffffff", kit: { type: "stripes", n: 5, colors: ["#111111", "#ffffff"] }, side: "undecided", status: "nessuna", outlet: "il Giornale", date: "2026-10-28", note: "Ancora incerta dopo un colloquio tra Malagò ed Elkann.", url: "https://www.ilgiornale.it/news/calcio/la-a-resta-ancora-spaccata/" },
    { id: "venezia", name: "Venezia", city: "Venezia", abbr: "VEN", c1: "#f26522", c2: "#00563f", kit: { type: "tricolor", colors: ["#111111", "#f26522", "#00563f"] }, side: "undecided", status: "nessuna", outlet: "la Repubblica", date: "2026-10-27", note: "Nessuna attribuzione da testate nazionali.", url: "https://www.calciomercato.com/liste/presidenza-figc-serie-a-spaccata-chi-sta-con-galliani-chi-con-malago-e-i-club-indecisi-gli-schieramenti/blt00a6e47a168003a4" },
  ],

  /* Posizione dei badge sulla mappa (x,y nel sistema 560×640). Il pallino resta sulla città reale. */
  labelPos: {
    como: [118, 46], monza: [168, 44], atalanta: [214, 66], inter: [92, 82], milan: [104, 112],
    juventus: [40, 116], torino: [44, 156], genoa: [112, 204], parma: [184, 112], sassuolo: [196, 194],
    bologna: [254, 146], fiorentina: [236, 236], venezia: [304, 126], udinese: [336, 54],
    lazio: [236, 300], roma: [266, 334], frosinone: [326, 282], napoli: [356, 398], lecce: [508, 344], cagliari: [146, 440],
  },

  news: [
    { date: "2026-10-29", outlet: "AIC-AIAC (nota congiunta)", title: "Calciatori e allenatori: raccolte le firme per candidare Galliani", url: "https://www.ilovepalermocalcio.com/figc-ufficiale-aic-e-aiac-sostengono-galliani-raccolte-le-firme-per-la-candidatura-alla-presidenza/" },
    { date: "2026-10-29", outlet: "Il Fatto Quotidiano", title: "Marotta perde in Serie A, il piano B passa dai calciatori", url: "https://www.ilfattoquotidiano.it/2026/10/29/presidenza-figc-malago-galliani-candidature-marotta-piano-alleanze/8554016/" },
    { date: "2026-10-29", outlet: "Gazzetta dello Sport", title: "Ecco gli 11 club di Serie A che firmano per Malagò", url: "https://www.fcinter1908.it/ultimora/figc-11-club-serie-a-malago-galliani-voti-elezioni/" },
    { date: "2026-10-29", outlet: "il Giornale", title: "Iter completato per entrambi, le Leghe si pronunciano venerdì", url: "https://www.ilgiornale.it/news/calcio/aic-e-aiac-scelgono-galliani/" },
    { date: "2026-10-28", outlet: "Italpress", title: "Malagò raggiunge 11 club, il Como è l'ultimo ad aderire", url: "https://www.italpress.com/figc-malago-sara-candidato-lega-di-serie-a-arrivo-undicesima-firma/" },
    { date: "2026-10-28", outlet: "ANSA", title: "Call tra le quattro Leghe senza esito: si aggiorna a venerdì 30", url: "https://www.ansa.it/sito/notizie/sport/calcio/2026/10/28/malago-e-galliani-pronti-alla-sfida-per-la-presidenza-della-figc_dde0e88f-19fe-467a-8b08-478ce6781a14.html" },
    { date: "2026-10-28", outlet: "ANSA", title: "Calciatori e allenatori pronti a candidare Galliani", url: "https://www.ansa.it/sito/notizie/sport/calcio/2026/10/28/federcalcio-aic-e-aiac-pronti-ad-annunciare-la-candidatura-di-galliani_64e6d8bd-2572-4b0b-92ec-180922aa9c95.html" },
    { date: "2026-10-28", outlet: "il Giornale", title: "Anche la Lazio con Galliani, Juventus ancora incerta", url: "https://www.ilgiornale.it/news/calcio/la-a-resta-ancora-spaccata/" },
    { date: "2026-10-27", outlet: "Quotidiano Sportivo", title: "Abete scrive alle componenti: la LND non avrà un proprio candidato", url: "https://sport.quotidiano.net/calcio/figc-fronte-del-nord-contro-2e5b99bb" },
    { date: "2026-10-27", outlet: "ANSA", title: "Riunione dei club interlocutoria: la Serie A non trova compattezza", url: "https://www.ansa.it/sito/notizie/sport/calcio/2026/10/27/figc-riunione-tra-i-club-di-a-interlocutoria-non-ce-compattezza_0862061f-3b6c-4eb1-86b9-846b4bbaa2bd.html" },
    { date: "2026-10-27", outlet: "la Repubblica", title: "Serie A spaccata: 8 club con Galliani, 6 con Malagò, 6 non attribuiti", url: "https://www.calciomercato.com/liste/presidenza-figc-serie-a-spaccata-chi-sta-con-galliani-chi-con-malago-e-i-club-indecisi-gli-schieramenti/blt00a6e47a168003a4" },
    { date: "2026-10-26", outlet: "ANSA", title: "Galliani si tessera con l'Enotria 1908 e sfida Malagò", url: "https://www.ansa.it/sito/notizie/sport/calcio/2026/10/26/figc-galliani-si-tessera-con-enotria-e-sfida-malago-atteso-un-vertice-dei_d8dbd301-69f2-4570-836f-463a80451fe9.html" },
  ],

  sources: [
    { label: "Statuto FIGC (C.U. 123/A del 20/11/2024), artt. 20-24", url: "https://www.figc.it/media/254871/all-al-cu-n-123a-del-20-novembre-2024-statuto-figc.pdf" },
    { label: "Regolamento elettorale e dei voti dell'Assemblea elettiva FIGC, artt. 1-10" },
    { label: "FIGC, risultato dell'elezione del 22/6/2026", url: "https://www.figc.it/en/figc/news/giovanni-malago-elected-figc-president-with-6858-of-the-vote-jfg09381" },
  ],
};
