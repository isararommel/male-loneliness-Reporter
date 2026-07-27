import type { Bundesland } from "../types";

export type UploadConfidence = "bestaetigt" | "wahrscheinlich" | "unklar" | "ungeeignet" | "ausgeschlossen";

export interface OnlineWacheInfo {
  name: string;
  url: string;
  uploadConfidence: UploadConfidence;
  hinweis?: string;
}

export interface BundeslandReportingInfo {
  bundesland: Bundesland;
  onlineWache?: OnlineWacheInfo;
  dienststellensucheUrl?: string;
  telefonHinweis?: string;
  empfehlung: "online" | "persoenlich";
}

/**
 * Recherchiert Juli 2026. Amtliche Online-Wachen-Formulare ändern gelegentlich
 * ihre Kategorien; im Zweifel gilt immer die bundesweite Übersicht
 * https://www.polizei.de/Polizei/DE/Einrichtungen/Onlinewache/onlinewache.html
 * sowie die persönliche/postalische Einreichung bei der zuständigen Dienststelle.
 */
export const BUNDESLAND_REPORTING: Record<Bundesland, BundeslandReportingInfo> = {
  "Baden-Württemberg": {
    bundesland: "Baden-Württemberg",
    onlineWache: {
      name: "Onlinewache Baden-Württemberg – Andere Strafanzeige",
      url: "https://portal.onlinewache.polizei.de/de/bw/andere/",
      uploadConfidence: "bestaetigt",
    },
    dienststellensucheUrl: "https://www.polizei-bw.de/dienststellenfinder/",
    empfehlung: "online",
  },
  Bayern: {
    bundesland: "Bayern",
    onlineWache: {
      name: "Anzeigeerstattung Online Bayern",
      url: "https://anzeige.polizei.bayern.de/",
      uploadConfidence: "ungeeignet",
      hinweis:
        "Das bayerische Online-Formular deckt nach unserer Recherche vor allem Online-Auktionsbetrug, Fahrraddiebstahl und Kfz-Sachbeschädigung ab – für eine Anzeige nach § 184 StGB ist es vermutlich nicht die richtige Kategorie.",
    },
    dienststellensucheUrl: "https://www.polizei.bayern.de/suche/dst/index.html",
    empfehlung: "persoenlich",
  },
  Berlin: {
    bundesland: "Berlin",
    onlineWache: {
      name: "Internetwache Berlin",
      url: "https://www.internetwache-polizei-berlin.de/",
      uploadConfidence: "ausgeschlossen",
      hinweis:
        "Die Polizei Berlin schließt Sexualstraftaten ausdrücklich von der Online-Anzeige aus. Bitte telefonisch oder persönlich bei einem Abschnitt anzeigen.",
    },
    telefonHinweis: "(030) 4664-4664",
    dienststellensucheUrl: "https://www.berlin.de/polizei/service/so-erreichen-sie-uns/abschnittssuche/",
    empfehlung: "persoenlich",
  },
  Brandenburg: {
    bundesland: "Brandenburg",
    onlineWache: {
      name: "Onlinewache Brandenburg",
      url: "https://portal.onlinewache.polizei.de/de/bb/",
      uploadConfidence: "bestaetigt",
    },
    dienststellensucheUrl: "https://polizei.brandenburg.de/liste/dienststellen-der-polizei-brandenburg/60738",
    empfehlung: "online",
  },
  Bremen: {
    bundesland: "Bremen",
    onlineWache: {
      name: "Onlinewache Bremen",
      url: "https://www.polizei.bremen.de/onlinewache-53847",
      uploadConfidence: "wahrscheinlich",
      hinweis:
        "Bremen listet auf seiner Übersicht vor allem Diebstahl, Sachbeschädigung und Hass im Netz; eine allgemeine Kategorie für sonstige Strafanzeigen war dort nicht einzeln aufgeführt, dürfte über die zugrunde liegende Plattform aber vorhanden sein.",
    },
    empfehlung: "online",
  },
  Hamburg: {
    bundesland: "Hamburg",
    onlineWache: {
      name: "Onlinewache Hamburg – Andere Strafanzeige",
      url: "https://portal.onlinewache.polizei.de/de/hh/andere/",
      uploadConfidence: "bestaetigt",
    },
    dienststellensucheUrl: "https://www.hamburg.de/service/info/11262156/n0/",
    empfehlung: "online",
  },
  Hessen: {
    bundesland: "Hessen",
    onlineWache: {
      name: "Onlinewache Hessen",
      url: "https://www.polizei.hessen.de/service/onlinewache",
      uploadConfidence: "wahrscheinlich",
      hinweis: "Die Kategorie „Andere Strafanzeige“ ist vorhanden; für Gewalt-/Drohungsdelikte ist sie nicht gedacht.",
    },
    empfehlung: "online",
  },
  "Mecklenburg-Vorpommern": {
    bundesland: "Mecklenburg-Vorpommern",
    onlineWache: {
      name: "Onlinewache Mecklenburg-Vorpommern",
      url: "https://www.polizei.mvnet.de/onlinewache/",
      uploadConfidence: "wahrscheinlich",
    },
    empfehlung: "online",
  },
  Niedersachsen: {
    bundesland: "Niedersachsen",
    onlineWache: {
      name: "Onlinewache Niedersachsen",
      url: "https://www.polizei-nds.de/startseite/wir_uber_uns/onlinewache/onlinewache-der-polizei-niedersachsen-112182.html",
      uploadConfidence: "unklar",
      hinweis:
        "Niedersachsen listet eigene Formulare vor allem für Diebstahl, Betrug, Sachbeschädigung und Hass im Netz; eine allgemeine Kategorie war in unserer Recherche nicht eindeutig zu finden.",
    },
    dienststellensucheUrl: "https://www.polizei-nds.de/dienststellen/",
    empfehlung: "online",
  },
  "Nordrhein-Westfalen": {
    bundesland: "Nordrhein-Westfalen",
    onlineWache: {
      name: "Internetwache NRW",
      url: "https://internetwache.polizei.nrw/",
      uploadConfidence: "bestaetigt",
      hinweis:
        "NRW hat zusätzlich eine eigene Informationsseite zur Anzeige von Sexualdelikten, was auf eine gesonderte Bearbeitung hindeuten kann. Die allgemeine Online-Anzeige mit Anhang ist grundsätzlich möglich; im Zweifel vor Ort nachfragen.",
    },
    dienststellensucheUrl: "https://internetwache.polizei.nrw/wachenfinder",
    empfehlung: "online",
  },
  "Rheinland-Pfalz": {
    bundesland: "Rheinland-Pfalz",
    onlineWache: {
      name: "Onlinewache Rheinland-Pfalz – Andere Strafanzeige",
      url: "https://portal.onlinewache.polizei.de/de/rp/andere/",
      uploadConfidence: "wahrscheinlich",
    },
    dienststellensucheUrl: "https://www.polizei.rlp.de/dienststellensuche",
    empfehlung: "online",
  },
  Saarland: {
    bundesland: "Saarland",
    onlineWache: {
      name: "Onlinewache Saarland",
      url: "https://www.saarland.de/polizei/DE/home/online-wache-saar",
      uploadConfidence: "wahrscheinlich",
    },
    dienststellensucheUrl: "https://www.saarland.de/polizei/DE/institution/organisation/polizeivorort",
    empfehlung: "online",
  },
  Sachsen: {
    bundesland: "Sachsen",
    onlineWache: {
      name: "Onlinewache Sachsen – Andere Strafanzeige",
      url: "https://portal.onlinewache.polizei.de/de/sn/andere/",
      uploadConfidence: "bestaetigt",
    },
    dienststellensucheUrl: "https://www.polizei.sachsen.de/de/reviere.asp",
    empfehlung: "online",
  },
  "Sachsen-Anhalt": {
    bundesland: "Sachsen-Anhalt",
    onlineWache: {
      name: "E-Revier Sachsen-Anhalt",
      url: "https://polizei.sachsen-anhalt.de/das-sind-wir/polizei-interaktiv/e-revier",
      uploadConfidence: "bestaetigt",
    },
    empfehlung: "online",
  },
  "Schleswig-Holstein": {
    bundesland: "Schleswig-Holstein",
    onlineWache: {
      name: "eRevier Schleswig-Holstein",
      url: "https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/POLIZEI/Onlinewache",
      uploadConfidence: "wahrscheinlich",
    },
    dienststellensucheUrl:
      "https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/POLIZEI/eRevier/Dienststellensuche",
    empfehlung: "online",
  },
  Thüringen: {
    bundesland: "Thüringen",
    onlineWache: {
      name: "Onlinewache Thüringen – Andere Strafanzeige",
      url: "https://portal.onlinewache.polizei.de/de/th/andere/",
      uploadConfidence: "wahrscheinlich",
    },
    dienststellensucheUrl: "https://polizei.thueringen.de/landespolizeidirektion/behoerden",
    empfehlung: "online",
  },
};

export const BUNDESWEITE_ONLINEWACHEN_UEBERSICHT =
  "https://www.polizei.de/Polizei/DE/Einrichtungen/Onlinewache/onlinewache.html";
