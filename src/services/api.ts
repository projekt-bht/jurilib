import type {
  AccountResource,
  LoginResource,
  RegisterResource,
  UserResource,
} from '@/services/Resources';
import { TokenType } from '~/generated/prisma/enums';

export async function register(inputData: RegisterResource): Promise<RegisterResource | false> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}authentication/register`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inputData),
  });
  if (!response.ok) return false;
  return (await response.json()) as RegisterResource;
}

export async function getLogin(): Promise<LoginResource> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}authentication/login`;
  const response = await fetch(url, {
    credentials: 'include' as RequestCredentials,
  });
  return (await response.json()) as LoginResource;
}

export async function postLogin(email: string, password: string): Promise<LoginResource | string> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}authentication/login`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ email: email, password: password }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include' as RequestCredentials,
  });

  const data = await response.json();

  if (!response.ok) {
    return data.message;
  }

  return data as LoginResource;
}

export async function deleteLogin() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}authentication/login`;
  await fetch(url, {
    method: 'DELETE',
    credentials: 'include' as RequestCredentials,
  });
  return;
}

export async function getUser(userID: string): Promise<UserResource> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}user/${userID}`;
  const response = await fetch(url, {
    credentials: 'include' as RequestCredentials,
  });
  return (await response.json()) as UserResource;
}

export async function getAccount(accountID: string): Promise<AccountResource> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}account/${accountID}`;
  const response = await fetch(url, {
    credentials: 'include' as RequestCredentials,
  });
  return (await response.json()) as AccountResource;
}

export async function postVerify(email: string, type: TokenType, code: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}authentication/codeVerification`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ email: email, type: type, code: code }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include' as RequestCredentials,
  });

  if (!response.ok) return false;

  return true;
}

export async function postResendCode(email: string, type: TokenType) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}authentication/resendCode`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ email: email, type: type }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include' as RequestCredentials,
  });

  if (!response.ok) return false;

  return true;
}

export async function patchAccountPasswordWithEmail(email: string, password: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}account`;
  const response = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify({ email: email, password }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include' as RequestCredentials,
  });

  if (!response.ok) return false;

  return true;
}

export async function patchUser(userID: string, userRessource: object) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}user/${userID}`;
  const response = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(userRessource),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include' as RequestCredentials,
  });

  if (!response.ok) return false;

  return true;
}

export async function patchAccount(accountID: string, accountRessource: object) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}account/${accountID}`;
  const response = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(accountRessource),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include' as RequestCredentials,
  });

  if (!response.ok) return false;

  return true;
}

export async function deleteAccount(accountID: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}account/${accountID}`;
  await fetch(url, {
    method: 'DELETE',
    credentials: 'include' as RequestCredentials,
  });
  return;
}
