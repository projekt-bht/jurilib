import type { LoginResource, RegisterResource } from '@/services/Resources';

export async function register(inputData: RegisterResource): Promise<RegisterResource | false> {
  const url = `/api/authentication/register`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inputData),
  });
  if (!response.ok) return false;
  return (await response.json()) as RegisterResource;
}

export async function getLogin(): Promise<LoginResource> {
  const url = `/api/authentication/login/`;
  const response = await fetch(url, {
    credentials: 'include' as RequestCredentials,
  });
  return (await response.json()) as LoginResource;
}

export async function postLogin(email: string, password: string): Promise<LoginResource | false> {
  const url = `/api/authentication/login/`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ email: email, password: password }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include' as RequestCredentials,
  });

  if (!response.ok) return false;

  return (await response.json()) as LoginResource;
}

export async function deleteLogin() {
  const url = `/api/authentication/login/`;
  await fetch(url, {
    method: 'DELETE',
    credentials: 'include' as RequestCredentials,
  });
  return;
}
