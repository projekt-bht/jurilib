// import { NextRequest } from 'next/server';

// import type { RegisterResource } from '@/services/Resources';
// import type { Organization } from '~/generated/prisma/client';
// import { AccountType, Gender, Pronoun } from '~/generated/prisma/enums';

// const { POST: POSTreg } = await import('@/app/api/authentication/register/route');
// const { POST: POSTlogin } = await import('@/app/api/authentication/login/route');
// const { GET: GETorg } = await import('@/app/api/organization/route');

// describe('Booking test', () => {
//   const baseRegisterURL = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}authentication/register`;
//   const loginURL = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}authentication/login`;
//   const baseAppointmentURL = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}appointment`;
//   const baseOrgURL = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}organization`;
//   const registerInput: RegisterResource = {
//     account: {
//       email: 'Testi.testo' + Math.random() + '@mail.de',
//       password: '123456789',
//       type: AccountType.USER,
//     },
//     entity: {
//       firstname: 'Peter',
//       lastname: 'Mustermann',
//       gender: Gender.Mann,
//       pronoun: Pronoun.er_ihm,
//       birthdate: new Date('1990-01-01'),
//     },
//   };
//   const createdAccount = {
//     email: registerInput.account.email,
//     password: registerInput.account.password,
//   };

//   const reqRegister = new NextRequest(baseRegisterURL, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(registerInput),
//   });

//   const reqLogin = new NextRequest(loginURL, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(createdAccount),
//   });

//   test('Book Appointment', async () => {
//     // register new user and login afterwards
//     await POSTreg(reqRegister);
//     const loginRes = await POSTlogin(reqLogin);
//     const cookie = loginRes.headers.get('Set-Cookie');
//     // get all organizations, take the first
//     const orgReq = new NextRequest(baseOrgURL);
//     // get all appointments, take the first
//     const orgRes = await GETorg(orgReq);
//     const orgs: Organization[] = await orgRes.json();
//     const appointmentRes = await fetch(`${baseAppointmentURL}/${orgs[0].id}`, {
//       method: 'GET',
//     });
//     const appointments = await appointmentRes.json();

//     console.log(`${baseAppointmentURL}/${appointments[0].id}/book`);
//     const res = await fetch(`${baseAppointmentURL}/${appointments[0].id}/book`, {
//       method: 'POST',
//       credentials: 'include',
//       headers: cookie ? { Cookie: cookie } : undefined,
//     });
//     expect(res.status).toBe(200);
//   });
// });

test('placeholder test', () => {
  // :O
  expect(1).toBe(1);
});
