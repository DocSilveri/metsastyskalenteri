export const COL_SPACING = "md-2";
export const CURRENTYEAR = 2025;

// Kanta-Häme kahdesti, koska Riistakeskus näemmä kirjoittaa sen kahdella eri tavalla
export const MAAKUNNAT = [
  "Ahvenanmaa",
  "Etelä-Karjala",
  "Etelä-Pohjanmaa",
  "Etelä-Savo",
  "Kainuu",
  "Kanta-Häme",
  "Kanta-Häme",
  "Keski-Pohjanmaa",
  "Keski-Suomi",
  "Kymenlaakso",
  "Lappi",
  "Lappi",
  "Pirkanmaa",
  "Pohjanmaa",
  "Pohjois-Karjala",
  "Pohjois-Pohjanmaa",
  "Pohjois-Savo",
  "Päijät-Häme",
  "Satakunta",
  "Uusimaa",
  "Varsinais-Suomi",
];

export const MERIALUEET = [
  "Lappi",
  "Pohjois-Pohjanmaa",
  "Keski-Pohjanmaa",
  "Pohjanmaa",
  "Satakunta",
  "Varsinais-Suomi",
  "Ahvenanmaa",
  "Uusimaa",
  "Kymenlaakso",
];

export const METSAHANHI_MUUMAA = [
  "Ahvenanmaa",
  "Etelä-Karjala",
  "Etelä-Pohjanmaa",
  "Kanta-Häme",
  "Keski-Pohjanmaa",
  "Keski-Suomi",
  "Pirkanmaa",
  "Pohjanmaa",
  "Pohjois-Savo",
  "Satakunta",
  "Varsinais-Suomi",
];

export const MAAKUNTA_GENETIIVIT = [
  " Ahvenanmaan",
  " Etelä-Karjalan",
  " Etelä-Pohjanmaan",
  " Etelä-Savon",
  "Kainuun",
  " Kanta-Hämen",
  " Kanta-Hämeen",
  " Keski-Pohjanmaan",
  " Keski-Suomen",
  " Kymenlaakson",
  "Lapin ",
  "Lapin,",
  " Pirkanmaan",
  "Pohjanmaan,",
  " Pohjois-Karjalan",
  " Pohjois-Pohjanmaan",
  " Pohjois-Savon",
  " Päijät-Hämeen",
  " Satakunnan",
  " Uudenmaan",
  " Varsinais-Suomen",
];

const SORSALINNUT = [
  "Alli",
  "Haahka",
  "Haapana",
  "Heinätavi",
  "Isokoskelo",
  "Jouhisorsa",
  "Lapasorsa",
  "Punasotka",
  "Heinäsorsa",
  "Tavi",
  "Telkkä",
  "Tukkakoskelo",
  "Tukkasotka",
];

const HANHET = ["Kanadanhanhi", "Merihanhi", "Metsähanhi"];

const KANALINNUT = [
  "Fasaani",
  "Kiiruna",
  "Metso",
  "Peltopyy",
  "Pyy",
  "Riekko",
  "Teeri",
];

const MUUT_LINNUT = ["Lehtokurppa", "Nokikana", "Sepelkyyhky"];

const HIRVI = ["Hirvi"];

const PEURAT = ["Kuusipeura", "Metsäkauris", "Metsäpeura", "Valkohäntäpeura"];

const HYLKEET = ["Halli", "Itämerennorppa"];

const MAJAVAT = ["Euroopanmajava", "Kanadanmajava"];

const JANISELAIMET = ["Metsäjänis", "Rusakko", "Villikani"];

const PIENPEDOT = [
  "Hilleri",
  "Ilves",
  "Kettu",
  "Kärppä",
  "Minkki",
  "Mäyrä",
  "Näätä",
  "Saukko",
  "Supikoira",
  "Sinikettu",
];

const SUURPEDOT = ["Karhu", "Susi"];

const MUUT_NISAKKAAT = ["Mufloni", "Orava", "Piisami", "Villisika"];

export const ANIMAL_GROUPS = {
  sorsalinnut: SORSALINNUT,
  hanhet: HANHET,
  kanalinnut: KANALINNUT,
  muutLinnut: MUUT_LINNUT,
  hirvi: HIRVI,
  peurat: PEURAT,
  hylkeet: HYLKEET,
  majavat: MAJAVAT,
  jäniseläimet: JANISELAIMET,
  pienpedot: PIENPEDOT,
  suurpedot: SUURPEDOT,
  muutNisäkkäät: MUUT_NISAKKAAT,
};

export const ANIMAL_GROUPINGS = [
  ["sorsalinnut", "hanhet", "kanalinnut", "muut_linnut"],
  ["hirvi", "peurat", "hylkeet", "majavat", "jäniseläimet"],
  ["pienpedot", "suurpedot"],
  ["muut_nisäkkäät"],
];

export const ANIMAL_ICONS = {
  sorsalinnut: "icon-duck",
  hanhet: "icon-goose",
  kanalinnut: "icon-grouse",
  muutLinnut: "",
  hirvi: "icon-moose",
  peurat: "icon-deer",
  hylkeet: "icon-seal",
  majavat: "icon-beaver",
  jäniseläimet: "icon-rabbit",
  pienpedot: "",
  suurpedot: "",
  muutNisäkkäät: "",
};

export const ICON_EXCEPTIONS = {
  sepelkyyhky: "icon-pigeon",
  lehtokurppa: "icon-woodcock",
  nokikana: "icon-coot",
  piisami: "icon-muskrat",
  mäyrä: "icon-badger",
  ilves: "icon-lynx",
  mufloni: "icon-muflon",
  orava: "icon-squirrel",
  villisika: "icon-boar",
  supikoira: "icon-raccoon_dog",
  kärppä: "icon-mustelid",
  näätä: "icon-mustelid",
  saukko: "icon-mustelid",
  minkki: "icon-mustelid",
  kettu: "icon-fox",
  susi: "icon-wolf",
  karhu: "icon-bear",
};
