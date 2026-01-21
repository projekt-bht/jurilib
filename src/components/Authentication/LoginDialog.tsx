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
  password: string;
  setPassword: (password: string) => void;
  showVerifyDialog: (open: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
  setSuccessOpen: (open: boolean) => void;
};

export function LoginDialog({
  onSuccess,
  password,
  setPassword,
  showVerifyDialog,
  email,
  setEmail,
  setSuccessOpen,
}: LoginDialogProps) {
  const { setLogin } = useLoginContext();
  const [error, setError] = useState('');

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
            email.length < 3 || email.length > 100 || !isValidEmail(email)
              ? 'Bitte gib eine gültige E-Mail-Adresse ein.'
              : undefined,
        });
        break;
      case 'password':
        setValidationErrors({
          ...validationErrors,
          password: password.length < 1 ? 'Bitte gib ein Passwort ein.' : undefined,
        });
        break;
    }
  }
  function isLoginDialogValid() {
    return email.length > 0 && password.length > 0 && isValidEmail(email);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const loginFromServer = await postLogin(email, password);
      if (typeof loginFromServer === 'string') {
        if (loginFromServer.includes('not verified')) {
          showVerifyDialog(true);
          return;
        }
        setError('Anmeldung fehlgeschlagen. Bitte überprüfe deine Zugangsdaten.');
        return;
      } else {
        onSuccess();
        setSuccessOpen(true);
        await new Promise((resolve) => setTimeout(resolve, 2500));
        setLogin(loginFromServer);
        setSuccessOpen(false);
      }
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
          value={email}
          onChange={(value) => {
            setEmail(value.target.value);
          }}
          onBlur={validate}
          placeholder="deine@email.com"
          className={
            validationErrors.email
              ? 'border-accent-red border-[0.5px] focus:ring-accent-red/200'
              : ''
          }
        />
        {validationErrors.email && (
          <p className="text-sm text-accent-red mt-1">{validationErrors.email}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>Passwort</Label>
        <Input
          name="password"
          type="password"
          placeholder="********"
          value={password}
          onChange={(value) => {
            setPassword(value.target.value);
          }}
          onBlur={validate}
          className={
            validationErrors.password
              ? 'border-accent-red border-[0.5px] focus:ring-accent-red/200'
              : ''
          }
        />
        {validationErrors.password && (
          <p className="text-sm text-accent-red mt-1">{validationErrors.password}</p>
        )}
      </div>
      {error && <p className="text-accent-red text-sm">{error}</p>}
      <Button type="submit" className="w-full" disabled={!isLoginDialogValid()}>
        Anmelden
      </Button>
    </form>
  );
}
