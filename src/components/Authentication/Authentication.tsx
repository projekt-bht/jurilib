'use client';
import { useRouter } from 'next/navigation';
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
// Füge Select-Import hinzu, falls nicht vorhanden
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { deleteLogin, postLogin, register } from '@/services/api';
import type { RegisterResource } from '@/services/Resources';
import { AccountType, Gender, Pronoun } from '~/generated/prisma/enums';

//TODO Validate with customError

export function Authentication() {
  const { login, setLogin } = useLoginContext();
  const [isRegister, setIsRegister] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const [successDialog, setSuccessDialog] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const [selectedGender, setSelectedGender] = useState<string>('');
  const [selectedPronoun, setSelectedPronoun] = useState<string>('');

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
            type: AccountType.USER,
          },
          entity: {
            firstname: data.firstname.toString(),
            lastname: data.lastname.toString(),
            gender: data.gender.toString() as Gender, // Cast zu Gender
            genderText: data.genderText?.toString(),
            pronoun: data.pronoun?.toString() as Pronoun, // Optional, cast zu Pronoun
            pronounText: data.pronounText?.toString(),
            country: data.country?.toString(),
            city: data.city?.toString(),
            zipCode: data.zipCode?.toString(),
            street: data.street?.toString(),
            houseNumber: data.houseNumber?.toString(),
            birthdate: new Date(data.birthdate.toString()),
            phone: data.phone?.toString(),
          },
        };

        const reg = await register(inputData);
        if (!reg) {
          setError('Etwas ist schiefgelaufen, überprüfe deine Eingabe');
        } else {
          setError('');
          setShowDialog(false);
          //setSuccessDialog(true);

          //Login user after successful registration
          const loginFromServer = await postLogin(data.email.toString(), data.password.toString());
          setLogin(loginFromServer);
        }
      } else {
        const loginFromServer = await postLogin(data.email.toString(), data.password.toString());
        if (loginFromServer) {
          setLogin(loginFromServer);
          setShowDialog(false);
          setError('');
        } else {
          setError('Email oder Passwort falsch.');
        }
      }
    } catch (error) {
      setError(String(error));
    }
  }

  return login ? (
    <Button
      onClick={async () => {
        await deleteLogin();
        router.push('/');
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
            id="authButton"
            className="bg-primary text-primary-foreground hover:bg-primary-hover hover:text-primary-hover-foreground p-2 pr-3 pl-3 rounded-full"
            variant="outline"
          >
            Einloggen
          </Button>
        </DialogTrigger>

        <DialogOverlay className=" backdrop-blur-sm" />

        <DialogContent className="max-h-[80vh] overflow-y-auto">
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
                    <Label htmlFor="firstname">Vorname *</Label>
                    <Input id="firstname" name="firstname" required minLength={3} />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="lastname">Nachname *</Label>
                    <Input id="lastname" name="lastname" required minLength={3} />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="birthdate">Geburtstag</Label>
                    <Input id="birthdate" name="birthdate" type="date" />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="gender">Geschlecht *</Label>
                    <Select
                      name="gender"
                      value={selectedGender}
                      onValueChange={setSelectedGender}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wähle Geschlecht" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Gender).map((g) => (
                          <SelectItem key={g} value={g}>
                            {g.replace(/_/g, ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedGender === Gender.Andere && (
                    <div className="grid gap-3">
                      <Label htmlFor="genderText">Geschlecht Freitext</Label>
                      <Input id="genderText" name="genderText" />
                    </div>
                  )}

                  <div className="grid gap-3">
                    <Label htmlFor="pronoun">Pronomen</Label>
                    <Select
                      name="pronoun"
                      value={selectedPronoun}
                      onValueChange={setSelectedPronoun}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wähle Pronomen" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Pronoun).map((p) => (
                          <SelectItem key={p} value={p}>
                            {p.replace(/_/g, ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedPronoun === Pronoun.Andere && (
                    <div className="grid gap-3">
                      <Label htmlFor="pronounText">Pronomen Freitext</Label>
                      <Input id="pronounText" name="pronounText" />
                    </div>
                  )}

                  <div className="grid gap-3">
                    <Label htmlFor="city">Wohnort</Label>
                    <Input id="city" name="city" />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="country">Land</Label>
                    <Input id="country" name="country" />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="city">Ort</Label>
                    <Input id="city" name="city" />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="zipCode">Postleitzahl</Label>
                    <Input id="zipCode" name="zipCode" />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="street">Straße</Label>
                    <Input id="street" name="street" />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="houseNumber">Hausnummer</Label>
                    <Input id="houseNumber" name="houseNumber" />
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
                    <p className="text-red-500">{error}</p>
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
