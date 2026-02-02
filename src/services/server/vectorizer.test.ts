import { createScenarioTemplate, goldenSamples } from './goldenSamples';

describe('Vectorizer Golden Samples', () => {
  for (const sample of goldenSamples) {
    test(`Full Dynamic Search: ${sample.area}`, async () => {
      const isScenarioCorrect = await createScenarioTemplate(
        sample.text,
        sample.area,
        sample.city,
        sample.zip,
        sample.description
      );
      expect(isScenarioCorrect).toBeTruthy();
    }, 15000);
  }
});
