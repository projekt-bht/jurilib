const { POST: accountPOST } = await import('@/app/api/authentication/register/route');
// Alle Imports per await:
const { NextRequest } = await import('next/server');

// Dynamisch die API-Funktionen importieren
const { POST, DELETE } = await import('@/app/api/authentication/login/route');

describe('Login test', () => {
  const baseUrlRegister = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/authentication/register`;
  const loginURL = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/authentication/login`;
  let createdAccount = {};

  test('Create Account and User', async () => {
    // Create both account and user through registration route
    const registerInput = {
      email: 'PETER_USER_REGISTERE' + Math.random() + '@mail.de',
      password: '123456789',
      type: 'USER',
    };

    const account = await createAccount(accountInput);

    const req = new NextRequest(baseUrlRegister, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerInput),
    });

    const res = await accountPOST(req);
    expect(res.status).toBe(201);

    createdAccount = { email: registerInput.email, password: registerInput.password };
  });

  test('Login with User', async () => {
    const req = new NextRequest(loginURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createdAccount),
    });

    const res = await POST(req);
    expect(res.cookies.get('access_token')?.value).not.toBeUndefined();
    expect(res!.status).toBe(200);
  });

  test('Delete Cookie', async () => {
    const req = new NextRequest(loginURL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createdAccount),
    });

    const res = await DELETE(req);
    expect(res.cookies.get('access_token')?.value).toBe('');
    expect(res!.status).toBe(200);
  });
});
export {};
