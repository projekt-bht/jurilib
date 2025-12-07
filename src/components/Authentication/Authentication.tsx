'use client';
import React, { useState } from 'react';

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

//TODO Validate with customError

export function Authentication() {
  const [isRegister, setIsRegister] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form);

    const registerStruct = {
      account: { email: data.email, password: data.password, role: 'USER' },
      entity: { name: data.name, address: data.address, phone: data.phone },
    };
    console.log(registerStruct);

    if (isRegister) {
      await fetch('/api/authentication/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerStruct),
      });
    }

    setShowDialog(false);
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button
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
                  <Input id="password" name="password" type="password" required minLength={6} />
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
                    minLength={6}
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit">{isRegister ? 'Registrieren' : 'Anmelden'}</Button>
          </DialogFooter>

          <DialogFooter className="mt-6">
            {!isRegister ? (
              <Button type="button" variant="link" onClick={() => setIsRegister(true)}>
                Noch kein Konto? Jetzt registrieren
              </Button>
            ) : (
              <Button type="button" variant="link" onClick={() => setIsRegister(false)}>
                Zurück zum Login
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
