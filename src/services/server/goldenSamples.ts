import similarity from 'compute-cosine-similarity';

import { Area } from '~/generated/prisma/enums';

const defaultOffset = 0.99;
//Buzzword extraction is not covering 100% more likely > 70%
const descriptionOffset = 0.7;

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
  const userSearch = userInput;
  const searchResult = await vectorizeSearch(userSearch);
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

export const onlyAreaSamples: Array<{ text: string; area: Area }> = [
  {
    text: 'Mein Arbeitgeber hat mir ohne Vorwarnung gekündigt. Ist das rechtens?',
    area: Area.Arbeitsrecht,
  },
  {
    text: 'Ich habe Probleme mit EU-Subventionen für meinen landwirtschaftlichen Betrieb.',
    area: Area.Agrarrecht,
  },
  {
    text: 'Ich habe in Wertpapiere investiert und vermute eine Falschberatung durch meine Bank.',
    area: Area.Bank_und_Kapitalmarktrecht,
  },
  {
    text: 'Bei meinem Hausbau gibt es schwere Mängel. Wer haftet dafür?',
    area: Area.Bau_und_Architektenrecht,
  },
  {
    text: 'Nach dem Tod eines Angehörigen gibt es Streit um das Erbe.',
    area: Area.Erbrecht,
  },
  {
    text: 'Ich möchte mich scheiden lassen und habe Fragen zum Sorgerecht.',
    area: Area.Familienrecht,
  },
  {
    text: 'Mein Produktdesign wurde kopiert. Welche rechtlichen Schritte kann ich einleiten?',
    area: Area.Gewerblichen_Rechtsschutz,
  },
  {
    text: 'Ich möchte eine GmbH gründen und brauche rechtliche Beratung.',
    area: Area.Handels_und_Gesellschaftsrecht,
  },
  {
    text: 'Ein Softwarevertrag wurde verletzt und es kam zu einem Datenverlust.',
    area: Area.Informationstechnologierecht,
  },
  {
    text: 'Mein Unternehmen steht kurz vor der Zahlungsunfähigkeit. Welche Optionen habe ich?',
    area: Area.Insolvenz_und_Sanierungsrecht,
  },
  {
    text: 'Ich habe einen internationalen Handelsvertrag abgeschlossen und es gibt Streitigkeiten.',
    area: Area.Internationales_Wirtschaftsrecht,
  },
  {
    text: 'Nach einer ärztlichen Behandlung habe ich gesundheitliche Schäden erlitten.',
    area: Area.Medizinrecht,
  },
  {
    text: 'Mein Vermieter erhöht die Miete stark. Ist das zulässig?',
    area: Area.Miet_und_Wohnungseigentumsrecht,
  },
  {
    text: 'Mein Asylantrag wurde abgelehnt. Welche rechtlichen Möglichkeiten habe ich?',
    area: Area.Migrationsrecht,
  },
  {
    text: 'Mir wurden Sozialleistungen gekürzt und ich weiß nicht warum.',
    area: Area.Sozialrecht,
  },
  {
    text: 'Ich habe einen Streit mit meinem Verein über meinen Spielervertrag.',
    area: Area.Sportrecht,
  },
  {
    text: 'Das Finanzamt fordert hohe Steuernachzahlungen von mir.',
    area: Area.Steuerrecht,
  },
  {
    text: 'Mir wird eine Straftat vorgeworfen, die ich nicht begangen habe.',
    area: Area.Strafrecht,
  },
  {
    text: 'Bei einem internationalen Warentransport kam es zu Schäden.',
    area: Area.Transport_und_Speditionsrecht,
  },
  {
    text: 'Mein urheberrechtlich geschütztes Video wurde ohne Erlaubnis veröffentlicht.',
    area: Area.Urheber_und_Medienrecht,
  },
  {
    text: 'Ich wurde bei einer öffentlichen Ausschreibung ausgeschlossen.',
    area: Area.Vergaberecht,
  },
  {
    text: 'Ich hatte einen Auffahrunfall und möchte wissen, wer haftet.',
    area: Area.Verkehrsrecht,
  },
  {
    text: 'Meine Versicherung weigert sich, den Schaden zu bezahlen.',
    area: Area.Versicherungsrecht,
  },
  {
    text: 'Eine Behörde hat meinen Antrag abgelehnt und ich halte das für rechtswidrig.',
    area: Area.Verwaltungsrecht,
  },
];
