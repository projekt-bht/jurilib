// Prepare mocking for sending emails and vectorizing - must be defined before importing the route handlers
import { jest } from '@jest/globals';

jest.unstable_mockModule('@/app/api/email/mailer', () => ({
  sendEmail: jest.fn(),
}));

jest.unstable_mockModule('src/services/server/vectorizer.ts', () => ({
  createEmbedding: jest.fn(async () => {
    const arr = Array(3072).fill(0.01);
    return `[${arr.join(',')}]`;
  }),
}));

// Non-mock related implementation:

describe('Endpoint /employee/[organizationID] testen', () => {
  // FIXME later
  test('DUMMY TEST', async () => {
    expect(true).toBe(true);
  });
});
