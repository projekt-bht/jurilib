import { createScenarioTemplate, onlyAreaSamples } from './goldenSamples';

describe('Vectorizer Golden Samples', () => {
  describe('Vectorizer Golden Samples', () => {
    for (const sample of onlyAreaSamples) {
      test(`Scenario onlyArea: ${sample.area}`, async () => {
        const isScenarioCorrect = await createScenarioTemplate(sample.text, sample.area);
        expect(isScenarioCorrect).toBeTruthy();
      });
    }
  });
});
