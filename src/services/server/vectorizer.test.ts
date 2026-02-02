import similarity from 'compute-cosine-similarity';

import { Area } from '~/generated/prisma/enums';

import { createEmbedding, vectorizeSearch } from './vectorizer';

async function createScenarioTemplate(userInput: string): Promise<boolean> {
  const userSearch = userInput;
  const searchResult = await vectorizeSearch(userSearch);
  const embeddingResult = await createEmbedding([Area.Verkehrsrecht].toString());
  const similarityResult = similarity(
    JSON.parse(searchResult.area) as number[],
    JSON.parse(embeddingResult) as number[]
  );

  return similarityResult ? similarityResult > 0.99 : false;
}

describe('Vectorizer Golden Samples', () => {
  test('Basic Verkehrsrecht', async () => {
    const isScenarioCorrect = await createScenarioTemplate(
      'Ich hatte einen Auffahrunfall und möchte wissen, wer haftet und welche Schritte ich rechtlich einleiten kann.'
    );
    expect(isScenarioCorrect).toBeTruthy();
  });
});
