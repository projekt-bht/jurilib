'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

import { useLoginContext } from '@/app/LoginContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { postLogin, register } from '@/services/api';
import type { RegisterResource } from '@/services/Resources';
import {
  isOnlyLetter,
  isStrongPassword,
  isValidEmail,
  isValidGermanPhone,
} from '@/services/validator/validationHelper';
import { AccountType, Gender, Pronoun } from '~/generated/prisma/enums';

type ValidationMessages<Type> = {
  [Property in keyof Type]?: string;
};

type RegisterDialogProps = {
  onSuccess: () => void;
  step: number;
  setStep: (step: number) => void;
  registerData: typeof initialRegisterData;
  setRegisterData: (data: typeof initialRegisterData) => void;
  setShowVerification: (data: boolean) => void;
};

export const initialRegisterData = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  passwordRepeat: '',
  birthdate: '',
  gender: '',
  genderText: '',
  pronoun: '',
  pronounText: '',
  city: '',
  country: '',
  zipCode: '',
  street: '',
  houseNumber: '',
  phone: '',
};

export function RegisterDialog({
  onSuccess,
  step,
  setStep,
  registerData,
  setRegisterData,
  setShowVerification,
}: RegisterDialogProps) {
  const { setLogin } = useLoginContext();
  const [error, setError] = useState('');

  function update(e: React.ChangeEvent<HTMLInputElement>) {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  }

  //Pilgrim Style :P
  const [validationErrors, setValidationErrors] = React.useState<
    ValidationMessages<typeof initialRegisterData>
  >({});

  function validate(e: React.FocusEvent<HTMLInputElement>) {
    switch (e.target.name) {
      case 'firstname':
        let errorMsgFirst: string | undefined = '';

        if (registerData.firstname.length < 1) {
          errorMsgFirst = 'Dein Vorname muss aus mindestens 1 Buchstaben bestehen.';
        } else if (!isOnlyLetter(registerData.firstname)) {
          errorMsgFirst = 'Dein Vorname darf nur aus Buchstaben bestehen.';
        } else {
          errorMsgFirst = undefined;
        }

        setValidationErrors({
          ...validationErrors,
          firstname: errorMsgFirst,
        });
        break;
      case 'lastname':
        let errorMsgLast: string | undefined = '';

        if (registerData.lastname.length < 1) {
          errorMsgLast = 'Dein Nachname muss aus mindestens 1 Buchstaben bestehen.';
        } else if (!isOnlyLetter(registerData.lastname)) {
          errorMsgLast = 'Dein Nachname darf nur aus Buchstaben bestehen.';
        } else {
          errorMsgLast = undefined;
        }
        setValidationErrors({
          ...validationErrors,
          lastname: errorMsgLast,
        });
        break;
      case 'genderText':
        let errorMsgGender: string | undefined = '';

        if (registerData.genderText.length < 1) {
          errorMsgGender = 'Deine Geschlechtsangabe muss aus mindestens 1 Buchstaben bestehen.';
        } else if (!isOnlyLetter(registerData.genderText)) {
          errorMsgGender = 'Deine Geschlechtsangabe darf nur aus Buchstaben bestehen.';
        } else {
          errorMsgGender = undefined;
        }
        setValidationErrors({
          ...validationErrors,
          genderText: errorMsgGender,
        });
        break;
      case 'pronounText':
        let errorMsgPronoun: string | undefined = '';

        if (registerData.pronounText.length < 1) {
          errorMsgPronoun = 'Deine Pronomen müssen aus mindestens 1 Buchstaben bestehen.';
        } else if (!isOnlyLetter(registerData.pronounText)) {
          errorMsgPronoun = 'Deine Pronomen dürfen nur aus Buchstaben bestehen.';
        } else {
          errorMsgPronoun = undefined;
        }
        setValidationErrors({
          ...validationErrors,
          pronounText: errorMsgPronoun,
        });
        break;
      case 'birthdate':
        const today = new Date();
        const minDate = new Date('1900-01-01');
        setValidationErrors({
          ...validationErrors,
          birthdate:
            new Date(registerData.birthdate) > today
              ? 'Dein Geburtsdatum darf nicht in der Zukunft liegen.'
              : new Date(registerData.birthdate) < minDate
                ? 'Bitte gib ein realistisches Geburtsdatum ein.'
                : undefined,
        });
        break;
      case 'email':
        setValidationErrors({
          ...validationErrors,
          email:
            registerData.email.length < 3 ||
            registerData.email.length > 100 ||
            !isValidEmail(registerData.email)
              ? 'Bitte gib eine gültige E-Mail-Adresse ein.'
              : undefined,
        });
        break;
      case 'password':
        setValidationErrors({
          ...validationErrors,
          password: !isStrongPassword(registerData.password)
            ? 'Dein Passwort muss mindestens 8 Zeichen lang sein, eine Ziffer, einen Groß- sowie Kleinbuchstaben und ein Sonderzeichen enthalten.'
            : undefined,
        });
        break;
      case 'passwordRepeat':
        setValidationErrors({
          ...validationErrors,
          passwordRepeat:
            registerData.passwordRepeat !== registerData.password
              ? 'Die eingegebenen Passwörter stimmen nicht überein.'
              : undefined,
        });
        break;
      case 'phone':
        setValidationErrors({
          ...validationErrors,
          phone:
            registerData.phone.length > 0 && !isValidGermanPhone(registerData.phone)
              ? 'Bitte gib eine gültige deutsche Mobilfunknummer ein (+49 oder 0157...)'
              : undefined,
        });
        break;
    }
  }

  function isStep1Valid() {
    if (registerData.firstname.length < 1 || !isOnlyLetter(registerData.firstname)) return false;
    if (registerData.lastname.length < 1 || !isOnlyLetter(registerData.lastname)) return false;
    if (!registerData.birthdate) return false;

    const birth = new Date(registerData.birthdate);
    const today = new Date();
    const minDate = new Date('1900-01-01');

    if (birth > today || birth < minDate) return false;
    if (!registerData.gender) return false;
    if (
      registerData.gender === Gender.Andere &&
      (!isOnlyLetter(registerData.genderText) || registerData.genderText.length < 1)
    )
      return false;
    if (
      registerData.pronoun === Pronoun.Andere &&
      (!isOnlyLetter(registerData.pronounText) || registerData.pronounText.length < 1)
    )
      return false;
    return true;
  }

  function isStep2Valid() {
    if (!isValidEmail(registerData.email)) return false;
    if (!registerData.password) return false;
    if (registerData.password !== registerData.passwordRepeat) return false;
    if (registerData.phone && !isValidGermanPhone(registerData.phone)) return false;
    return true;
  }

  function isCurrentStepValid() {
    switch (step) {
      case 1:
        return isStep1Valid();
      case 2:
        return isStep2Valid();
      default:
        return false;
    }
  }

  async function handleRegister() {
    try {
      const inputData: RegisterResource = {
        account: {
          email: registerData.email,
          password: registerData.password,
          type: AccountType.USER,
        },
        entity: {
          firstname: registerData.firstname,
          lastname: registerData.lastname,
          gender: registerData.gender as Gender,
          genderText: registerData.genderText,
          pronoun: registerData.pronoun ? (registerData.pronoun as Pronoun) : undefined,
          pronounText: registerData.pronounText,
          country: registerData.country,
          city: registerData.city,
          zipCode: registerData.zipCode,
          street: registerData.street,
          houseNumber: registerData.houseNumber,
          birthdate: new Date(registerData.birthdate),
          phone: registerData.phone,
        },
      };

      const reg = await register(inputData);

      //Check more specific for custom errors
      if (!reg) {
        setError('Ein Konto mit der angegebenen E-Mail-Adresse existiert bereits.');
        return;
      }

      setRegisterData(initialRegisterData);
      setShowVerification(true);
      onSuccess();

      //Auto Login after verifying OTP
      /*
      const loginFromServer = await postLogin(registerData.email, registerData.password);
      setLogin(loginFromServer);
      */
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <div className="space-y-4">
      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Geschlecht *</Label>
              <Select
                value={registerData.gender}
                onValueChange={(v) =>
                  setRegisterData({
                    ...registerData,
                    gender: v,
                    genderText: v === Gender.Andere ? registerData.genderText : '',
                  })
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Gender).map((g) => (
                    <SelectItem key={g} value={g} className="hover:bg-accent-gray-light">
                      {g.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Pronomen</Label>
              <Select
                value={registerData.pronoun}
                onValueChange={(v) =>
                  setRegisterData({
                    ...registerData,
                    pronoun: v,
                    pronounText: v === Pronoun.Andere ? registerData.pronounText : '',
                  })
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Pronoun).map((p) => (
                    <SelectItem key={p} value={p} className="hover:bg-accent-gray-light">
                      {p.replace(/_/g, '/')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {registerData.gender === Gender.Andere && (
            <div className="space-y-2">
              <Label>Geschlecht (Text) *</Label>
              <Input
                name="genderText"
                value={registerData.genderText}
                onChange={update}
                placeholder="Geschlecht"
                onBlur={validate}
                className={
                  validationErrors.genderText
                    ? 'border-accent-red border-[0.5px] focus:ring-accent-red/200'
                    : ''
                }
              />
              {validationErrors.genderText && (
                <p className="text-sm text-accent-red mt-1">{validationErrors.genderText}</p>
              )}
            </div>
          )}
          {registerData.pronoun === Pronoun.Andere && (
            <div className="space-y-2">
              <Label>Pronomen (Text)</Label>
              <Input
                name="pronounText"
                value={registerData.pronounText}
                onChange={update}
                placeholder="Pronomen"
                onBlur={validate}
                className={
                  validationErrors.pronounText
                    ? 'border-accent-red border-[0.5px] focus:ring-accent-red/200'
                    : ''
                }
              />
              {validationErrors.pronounText && (
                <p className="text-sm text-accent-red mt-1">{validationErrors.pronounText}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Vorname *</Label>
              <Input
                name="firstname"
                placeholder="Vorname"
                value={registerData.firstname}
                onChange={update}
                onBlur={validate}
                className={
                  validationErrors.firstname
                    ? 'border-accent-red border-[0.5px] focus:ring-accent-red/200'
                    : ''
                }
              />
              {validationErrors.firstname && (
                <p className="text-sm text-accent-red mt-1">{validationErrors.firstname}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Nachname *</Label>
              <Input
                name="lastname"
                placeholder="Nachname"
                value={registerData.lastname}
                onChange={update}
                onBlur={validate}
                className={
                  validationErrors.lastname
                    ? 'border-accent-red border-[0.5px] focus:ring-accent-red/200'
                    : ''
                }
              />
              {validationErrors.lastname && (
                <p className="text-sm text-accent-red mt-1">{validationErrors.lastname}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Geburtsdatum *</Label>
            <Input
              type="date"
              name="birthdate"
              value={registerData.birthdate}
              onChange={update}
              onBlur={validate}
              className={
                validationErrors.birthdate
                  ? 'border-accent-red border-[0.5px] focus:ring-accent-red/200'
                  : ''
              }
            />
          </div>
          {validationErrors.birthdate && (
            <p className="text-sm text-accent-red mt-1">{validationErrors.birthdate}</p>
          )}
        </div>
      )}
      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Telefon</Label>
            <Input
              name="phone"
              placeholder="+49123456789"
              value={registerData.phone}
              onChange={update}
              onBlur={validate}
              className={
                validationErrors.phone
                  ? 'border-accent-red border-[0.5px] focus:ring-accent-red/200'
                  : ''
              }
            />
          </div>
          {validationErrors.phone && (
            <p className="text-sm text-accent-red mt-1">{validationErrors.phone}</p>
          )}
          <div className="space-y-2">
            <Label>E-Mail *</Label>
            <Input
              name="email"
              placeholder="deine@email.com"
              type="email"
              value={registerData.email}
              onChange={update}
              onBlur={validate}
              className={
                validationErrors.email
                  ? 'border-accent-red border-[0.5px] focus:ring-accent-red/200'
                  : ''
              }
            />
          </div>
          {validationErrors.email && (
            <p className="text-sm text-accent-red mt-1">{validationErrors.email}</p>
          )}
          <div className="space-y-2">
            <Label>Passwort *</Label>
            <Input
              name="password"
              type="password"
              placeholder="********"
              value={registerData.password}
              onChange={update}
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
          <div className="space-y-2">
            <Label>Passwort wiederholen *</Label>
            <Input
              name="passwordRepeat"
              type="password"
              placeholder="********"
              value={registerData.passwordRepeat}
              onChange={update}
              onBlur={validate}
              className={
                validationErrors.passwordRepeat
                  ? 'border-accent-red border-[0.5px] focus:ring-accent-red/200'
                  : ''
              }
            />
          </div>
          {validationErrors.passwordRepeat && (
            <p className="text-sm text-accent-red mt-1">{validationErrors.passwordRepeat}</p>
          )}
          {error && <p className="text-accent-red text-sm">{error}</p>}
        </div>
      )}

      {/* Navigation to progress */}
      <div className="flex gap-2">
        {step > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(step - 1)}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Zurück
          </Button>
        )}
        <Button
          type="button"
          disabled={!isCurrentStepValid()}
          onClick={() => {
            if (step < 2) {
              setStep(step + 1);
            } else {
              handleRegister();
            }
          }}
          className="flex-1"
        >
          {step < 2 ? 'Weiter' : 'Registrieren'}
          {step < 2 && <ChevronRight className="w-4 h-4 ml-1" />}
        </Button>
      </div>
    </div>
  );
}
