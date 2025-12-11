'use client';
import React, { useState } from 'react';

import { useLoginContext } from '@/app/LoginContext';
//https://ui.shadcn.com/docs/components/dialog
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { deleteLogin, postLogin, register } from '@/services/api';
import type { RegisterResource } from '@/services/Resources';

//TODO Validate with customError

export function Authentication() {
  const { login, setLogin } = useLoginContext();
  const [isRegister, setIsRegister] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const [successDialog, setSuccessDialog] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form);

    try {
      if (isRegister) {
        const inputData: RegisterResource = {
          account: {
            email: data.email.toString(),
            password: data.password.toString(),
            role: 'USER',
          },
          entity: {
            name: data.name.toString(),
            address: data.address.toString(),
            phone: data.phone.toString(),
          },
        };

        const reg = await register(inputData);
        if (!reg) {
          setError('Etwas ist schiefgelaufen, überprüfe deine Eingabe');
        } else {
          setError('');
          setShowDialog(false);
          setSuccessDialog(true);
        }
      } else {
        const loginFromServer = await postLogin(data.email.toString(), data.password.toString());
        setLogin(loginFromServer);
        if (loginFromServer) setShowDialog(false);
        setError('Email oder Passwort falsch.');
      }
    } catch (error) {
      setError(String(error));
    }
  }

  return login ? (
    <Button
      onClick={async () => {
        await deleteLogin();
        setLogin(false);
      }}
      className="bg-primary text-primary-foreground hover:bg-primary-hover hover:text-primary-hover-foreground p-2 pr-3 pl-3 rounded-full"
      variant="outline"
    >
      Abmelden
    </Button>
  ) : (
    <>
      <Dialog
        open={showDialog}
        onOpenChange={(open) => {
          setShowDialog(open);
          if (open) {
            setIsRegister(false);
            setError('');
          }
        }}
      >
        <DialogTrigger asChild>
          <Button
            onClick={async () => {
              await deleteLogin();
              setLogin(false);
            }}
            className="bg-primary text-primary-foreground hover:bg-primary-hover hover:text-primary-hover-foreground p-2 pr-3 pl-3 rounded-full"
            variant="outline"
          >
            Einloggen
          </Button>
        </DialogTrigger>

        <DialogOverlay className=" backdrop-blur-sm" />

        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-center text-lg font-semibold">
                {isRegister ? 'Registrieren' : 'Login'}
              </DialogTitle>
              <DialogDescription className="text-center text-sm mt-3 mb-5">
                {isRegister
                  ? 'Erstelle ein neues Konto mit deinen Daten.'
                  : 'Melde dich mit deinen Daten an.'}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-7">
              {isRegister && (
                <>
                  <div className="grid gap-3">
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" name="name" required minLength={3} />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="address">Adresse</Label>
                    <Input id="address" name="address" />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input id="phone" name="phone" />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="email">Email-Adresse *</Label>
                    <Input id="email" name="email" type="email" required minLength={3} />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="password">Passwort * </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      minLength={Number(process.env.NEXT_PUBLIC_PASSWORD_LENGTH!)}
                    />
                    <p>{error}</p>
                  </div>
                </>
              )}

              {!isRegister && (
                <>
                  <div className="grid gap-3">
                    <Label htmlFor="loginEmail">Email-Adresse</Label>
                    <Input id="loginEmail" name="email" type="email" required minLength={3} />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="loginPassword">Passwort</Label>
                    <Input
                      id="loginPassword"
                      name="password"
                      type="password"
                      required
                      minLength={Number(process.env.NEXT_PUBLIC_PASSWORD_LENGTH!)}
                    />
                    <p className="text-red-500">{error}</p>
                  </div>
                </>
              )}
            </div>

            <DialogFooter className="mt-6">
              <Button type="submit">{isRegister ? 'Registrieren' : 'Anmelden'}</Button>
            </DialogFooter>

            <DialogFooter className="mt-6">
              {!isRegister ? (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => {
                    setIsRegister(true);
                    setError('');
                  }}
                >
                  Noch kein Konto? Jetzt registrieren
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => {
                    setIsRegister(false);
                    setError('');
                  }}
                >
                  Zurück zum Login
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={successDialog} onOpenChange={setSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-semibold">
              Registrierung erfolgreich!
            </DialogTitle>
            <DialogDescription className="text-center text-sm mt-3 mb-5">
              Du kannst dich nun mit deinen Zugangsdaten anmelden.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button onClick={() => setSuccessDialog(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
