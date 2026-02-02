import { createScenarioTemplate, goldenSamples } from './goldenSamples';

describe('Vectorizer Golden Samples', () => {
  for (const sample of goldenSamples) {
    /*
        Testing individual combinations (area only, area + city, area + zip, etc.) is possible,
        but would take too long(like 10 min?) and consume unnecessary credits
        we focus on the full-info scenario here
    */
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
