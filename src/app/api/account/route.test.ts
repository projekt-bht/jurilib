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

// Alle Imports per await:
const { NextRequest } = await import('next/server');

// // Dynamisch die API-Funktionen importieren
// const { GET } = await import('@/app/api/account/route');

// describe('Account Routen testen', () => {
//   const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/account/register`;

//   // tests wurden entfernt, weil die POST route jetzt in /authentication/register ist
//   // TODO: rausfinden, ob hier als vorbereitung für die tests mit der neuen route noch was gemacht werden muss

//   // welche accounts werden hier gefunden? wo ist die DB mit testdaten?
//   // TODO: gibt es eine Mock-DB oder so was in der Art?

//   test('GET Accounts', async () => {
//     const req = new NextRequest(baseUrl);
//     const res = await GET(req);
//     const json = await res.json();
//     expect(json.length).not.toBe(0);
//     expect(res.status).toBe(200);
//   });
// });
test('placeholder test', () => {
  expect(1).toBe(1);
});
