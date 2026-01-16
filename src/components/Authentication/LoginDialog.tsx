'use client';

import React, { useState } from 'react';

import { useLoginContext } from '@/app/LoginContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { postLogin } from '@/services/api';
import { isValidEmail } from '@/services/validator/validationHelper';

type ValidationMessages<Type> = {
  [Property in keyof Type]?: string;
};

type LoginDialogProps = {
  onSuccess: () => void;
  loginData: typeof initialLoginData;
  setLoginData: (data: typeof initialLoginData) => void;
};

export const initialLoginData = {
  email: '',
  password: '',
};

export function LoginDialog({ onSuccess, loginData, setLoginData }: LoginDialogProps) {
  const { setLogin } = useLoginContext();
  const [error, setError] = useState('');

  function updateLogin(e: React.ChangeEvent<HTMLInputElement>) {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  }

  //Pilgrim Style :P
  const [validationErrors, setValidationErrors] = React.useState<
    ValidationMessages<{ email: ''; password: '' }>
  >({});

  function validate(e: React.FocusEvent<HTMLInputElement>) {
    switch (e.target.name) {
      case 'email':
        setValidationErrors({
          ...validationErrors,
          email:
            loginData.email.length < 3 ||
            loginData.email.length > 100 ||
            !isValidEmail(loginData.email)
              ? 'Bitte gib eine gültige E-Mail-Adresse ein.'
              : undefined,
        });
        break;
      case 'password':
        setValidationErrors({
          ...validationErrors,
          password: loginData.password.length < 1 ? 'Bitte gib ein Passwort ein.' : undefined,
        });
        break;
    }
  }
  function isLoginDialogValid() {
    return (
      loginData.email.length > 0 && loginData.password.length > 0 && isValidEmail(loginData.email)
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const loginFromServer = await postLogin(loginData.email, loginData.password);
      if (!loginFromServer) {
        setError('Anmeldung fehlgeschlagen. Bitte überprüfe deine Zugangsdaten.');
        return;
      }
      setLogin(loginFromServer);
      onSuccess();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>E-Mail</Label>
        <Input
          name="email"
          type="email"
          value={loginData.email}
          onChange={updateLogin}
          onBlur={validate}
          placeholder="deine@email.com"
          className={
            validationErrors.email ? 'border-red-500 border-[0.5px] focus:ring-red-200' : ''
          }
        />
        {validationErrors.email && (
          <p className="text-sm text-red-500 mt-1">{validationErrors.email}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>Passwort</Label>
        <Input
          name="password"
          type="password"
          placeholder="********"
          value={loginData.password}
          onChange={updateLogin}
          onBlur={validate}
          className={
            validationErrors.password ? 'border-red-500 border-[0.5px] focus:ring-red-200' : ''
          }
        />
        {validationErrors.email && (
          <p className="text-sm text-red-500 mt-1">{validationErrors.password}</p>
        )}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" className="w-full" disabled={!isLoginDialogValid()}>
        Anmelden
      </Button>
    </form>
  );
}
