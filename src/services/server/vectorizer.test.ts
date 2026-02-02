import similarity from 'compute-cosine-similarity';

import { Area } from '~/generated/prisma/enums';

import { createEmbedding, vectorizeSearch } from './vectorizer';

describe('Vectorizer Golden Samples', () => {
  test('Basic Verkehrsrecht', async () => {
    const userSearch =
      'Ich hatte einen Auffahrunfall und möchte wissen, wer haftet und welche Schritte ich rechtlich einleiten kann.';
    const searchResult = await vectorizeSearch(userSearch);
    const embeddingResult = await createEmbedding([Area.Verkehrsrecht].toString());
    const similarityResult = similarity(
      JSON.parse(searchResult.area) as number[],
      JSON.parse(embeddingResult) as number[]
    );
    expect(similarityResult).toBeGreaterThan(0.99);
  });
});
