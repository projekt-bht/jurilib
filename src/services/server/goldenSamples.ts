import similarity from 'compute-cosine-similarity';

import { Area } from '~/generated/prisma/enums';

import { createEmbedding, extractBuzzwords, vectorizeSearch } from './vectorizer';

const defaultOffset = 0.99;
//Buzzword extraction is not covering 100% more likely > 60%
const descriptionOffset = 0.6;

function isValid(embeddingA: string, embeddingB: string, similarityOffset: number = defaultOffset) {
  const similarityResult = similarity(
    JSON.parse(embeddingA) as number[],
    JSON.parse(embeddingB) as number[]
  );

  return similarityResult ? similarityResult > similarityOffset : false;
}

export async function createScenarioTemplate(
  userInput: string,
  expectedArea: Area,
  expectedCity?: string,
  expectedZip?: string,
  expectedDescription?: string
): Promise<boolean> {
  const searchResult = await vectorizeSearch(userInput);
  const areaEmbedding = await createEmbedding([expectedArea].toString());
  if (!isValid(searchResult.area, areaEmbedding)) return false;

  if (expectedCity && searchResult.city) {
    const cityEmbedding = await createEmbedding(expectedCity);
    if (!isValid(searchResult.city, cityEmbedding)) return false;
  }
  if (expectedZip && searchResult.zipCode) {
    if (expectedZip !== searchResult.zipCode) return false;
  }
  if (expectedDescription && searchResult.description) {
    const buzzwords = await extractBuzzwords(expectedDescription);
    const descriptionEmbedding = await createEmbedding(buzzwords);
    if (!isValid(searchResult.description, descriptionEmbedding, descriptionOffset)) return false;
  }

  return true;
}

export const goldenSamples: Array<{
  text: string;
  area: Area;
  city: string;
  zip: string;
  description: string;
}> = [
  {
    text: 'Mein Arbeitgeber in 10115 Berlin hat mir ohne Vorwarnung gekündigt. Ist das rechtens?',
    area: Area.Arbeitsrecht,
    city: 'Berlin',
    zip: '10115',
    description: 'Kündigung, Arbeitgeber, Arbeitsrecht',
  },
  {
    text: 'Ich habe Probleme mit EU-Subventionen für meinen landwirtschaftlichen Betrieb in 50667 Köln.',
    area: Area.Agrarrecht,
    city: 'Köln',
    zip: '50667',
    description: 'EU-Subventionen, Landwirtschaft, Betrieb',
  },
  {
    text: 'Ich habe in Wertpapiere investiert und vermute eine Falschberatung durch meine Bank in 60311 Frankfurt.',
    area: Area.Bank_und_Kapitalmarktrecht,
    city: 'Frankfurt',
    zip: '60311',
    description: 'Wertpapiere, Falschberatung, Bank',
  },
  {
    text: 'Bei meinem Hausbau in 80331 München gibt es schwere Mängel. Wer haftet dafür?',
    area: Area.Bau_und_Architektenrecht,
    city: 'München',
    zip: '80331',
    description: 'Hausbau, Mängel, Haftung',
  },
  {
    text: 'Nach dem Tod eines Angehörigen in 04109 Leipzig gibt es Streit um das Erbe.',
    area: Area.Erbrecht,
    city: 'Leipzig',
    zip: '04109',
    description: 'Erbe, Testament, Streit',
  },
  {
    text: 'Ich möchte mich scheiden lassen und habe Fragen zum Sorgerecht in 20095 Hamburg.',
    area: Area.Familienrecht,
    city: 'Hamburg',
    zip: '20095',
    description: 'Scheidung, Sorgerecht, Familienrecht',
  },
  {
    text: 'Mein Produktdesign wurde kopiert in 01067 Dresden. Welche rechtlichen Schritte kann ich einleiten?',
    area: Area.Gewerblichen_Rechtsschutz,
    city: 'Dresden',
    zip: '01067',
    description: 'Produktdesign, Kopie, Schutzrechte',
  },
  {
    text: 'Ich möchte eine GmbH gründen und brauche rechtliche Beratung in 80333 München.',
    area: Area.Handels_und_Gesellschaftsrecht,
    city: 'München',
    zip: '80333',
    description: 'GmbH, Gründung, Gesellschaftsrecht',
  },
  {
    text: 'Ein Softwarevertrag wurde verletzt und es kam zu einem Datenverlust in 90402 Nürnberg.',
    area: Area.Informationstechnologierecht,
    city: 'Nürnberg',
    zip: '90402',
    description: 'Softwarevertrag, Datenverlust, IT-Recht',
  },
  {
    text: 'Mein Unternehmen steht kurz vor der Zahlungsunfähigkeit in 20095 Hamburg. Welche Optionen habe ich?',
    area: Area.Insolvenz_und_Sanierungsrecht,
    city: 'Hamburg',
    zip: '20095',
    description: 'Insolvenz, Sanierung, Unternehmen',
  },
  {
    text: 'Ich habe einen internationalen Handelsvertrag abgeschlossen in 60313 Frankfurt und es gibt Streitigkeiten.',
    area: Area.Internationales_Wirtschaftsrecht,
    city: 'Frankfurt',
    zip: '60313',
    description: 'Handelsvertrag, International, Streit',
  },
  {
    text: 'Nach einer ärztlichen Behandlung in 50667 Köln habe ich gesundheitliche Schäden erlitten.',
    area: Area.Medizinrecht,
    city: 'Köln',
    zip: '50667',
    description: 'Ärztliche Behandlung, Gesundheitsschaden, Medizinrecht',
  },
  {
    text: 'Mein Vermieter in 04109 Leipzig erhöht die Miete stark. Ist das zulässig?',
    area: Area.Miet_und_Wohnungseigentumsrecht,
    city: 'Leipzig',
    zip: '04109',
    description: 'Mieterhöhung, Vermieter, Mietrecht',
  },
  {
    text: 'Mein Asylantrag in 20095 Hamburg wurde abgelehnt. Welche rechtlichen Möglichkeiten habe ich?',
    area: Area.Migrationsrecht,
    city: 'Hamburg',
    zip: '20095',
    description: 'Asylantrag, Ablehnung, rechtliche Möglichkeiten',
  },
  {
    text: 'Mir wurden Sozialleistungen in 10117 Berlin gekürzt und ich weiß nicht warum.',
    area: Area.Sozialrecht,
    city: 'Berlin',
    zip: '10117',
    description: 'Sozialleistungen, Kürzung, Sozialrecht',
  },
  {
    text: 'Ich habe einen Streit mit meinem Verein über meinen Spielervertrag in 50667 Köln.',
    area: Area.Sportrecht,
    city: 'Köln',
    zip: '50667',
    description: 'Verein, Spielervertrag, Streit',
  },
  {
    text: 'Das Finanzamt in 60311 Frankfurt fordert hohe Steuernachzahlungen von mir.',
    area: Area.Steuerrecht,
    city: 'Frankfurt',
    zip: '60311',
    description: 'Finanzamt, Steuernachzahlung, Steuerrecht',
  },
  {
    text: 'Mir wird eine Straftat vorgeworfen in 80331 München, die ich nicht begangen habe.',
    area: Area.Strafrecht,
    city: 'München',
    zip: '80331',
    description: 'Straftat, Vorwurf, Strafrecht',
  },
  {
    text: 'Bei einem internationalen Warentransport in 20095 Hamburg kam es zu Schäden.',
    area: Area.Transport_und_Speditionsrecht,
    city: 'Hamburg',
    zip: '20095',
    description: 'Warentransport, Schäden, Speditionsrecht',
  },
  {
    text: 'Mein urheberrechtlich geschütztes Video wurde in 80331 München ohne Erlaubnis veröffentlicht.',
    area: Area.Urheber_und_Medienrecht,
    city: 'München',
    zip: '80331',
    description: 'Urheberrechtlich geschützt, veröffentlicht, ohne Erlaubnis',
  },
  {
    text: 'Ich wurde bei einer öffentlichen Ausschreibung in 50667 Köln ausgeschlossen.',
    area: Area.Vergaberecht,
    city: 'Köln',
    zip: '50667',
    description: 'Ausschreibung, Vergaberecht, Ausschluss',
  },
  {
    text: 'Ich hatte einen Auffahrunfall in 10115 Berlin und möchte wissen, wer haftet.',
    area: Area.Verkehrsrecht,
    city: 'Berlin',
    zip: '10115',
    description: 'Auffahrunfall, Haftung, Verkehr',
  },
  {
    text: 'Meine Versicherung in 20095 Hamburg weigert sich, den Schaden zu bezahlen.',
    area: Area.Versicherungsrecht,
    city: 'Hamburg',
    zip: '20095',
    description: 'Versicherung, Schaden, Ablehnung',
  },
  {
    text: 'Eine Behörde in 04109 Leipzig hat meinen Antrag abgelehnt und ich halte das für rechtswidrig.',
    area: Area.Verwaltungsrecht,
    city: 'Leipzig',
    zip: '04109',
    description: 'Behörde, Antrag, Rechtswidrigkeit',
  },
];
