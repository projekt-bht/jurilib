'use client';

import {
  AlertTriangle,
  Building2,
  Camera,
  Eye,
  EyeOff,
  Globe,
  Hash,
  Home,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import React from 'react';

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
import { getAccount, getUser, patchAccount, patchUser } from '@/services/api';
import type { AccountResource, UserResource } from '@/services/Resources';
import {
  isOnlyLetter,
  isOnlyNumber,
  isStrongPassword,
  isValidEmail,
  isValidGermanPhone,
} from '@/services/validator/validationHelper';
import { Gender, Pronoun } from '~/generated/prisma/enums';

import { useLoginContext } from '../LoginContext';

type ValidationMessages<Type> = {
  [Property in keyof Type]?: string;
};

export default function ProfileView() {
  const { login } = useLoginContext();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [user, setUser] = useState<UserResource>();
  const [account, setAccount] = useState<AccountResource>();

  if (!login) notFound();

  const [userForm, setUserForm] = useState({
    title: user?.title || '',
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    gender: user?.gender || Gender.Keine_Angabe,
    genderText: user?.genderText || '',
    pronoun: user?.pronoun || Pronoun.Keine_Angabe,
    pronounText: user?.pronounText || '',
    birthdate: user?.birthdate || '',
    placeOfBirth: user?.placeOfBirth || '',
    phone: user?.phone || '',
    country: user?.country || '',
    city: user?.city || '',
    zipCode: user?.zipCode || '',
    street: user?.street || '',
    houseNumber: user?.houseNumber || '',
  });

  const [accountForm, setAccountForm] = useState({
    password: '',
    passwordRepeat: '',
  });

  const [initialuserForm, setInitialuserForm] = useState<typeof userForm | null>(null);
  const [initialAccountForm, setInitialAccountForm] = useState<typeof accountForm | null>(null);

  async function load() {
    if (!login) return;
    try {
      const foundUser = await getUser(login.userId!);
      const foundAccount = await getAccount(login.id);
      const loadeduserForm = {
        title: foundUser?.title || '',
        firstname: foundUser?.firstname || '',
        lastname: foundUser?.lastname || '',
        gender: foundUser?.gender || Gender.Keine_Angabe,
        genderText: foundUser?.genderText || '',
        pronoun: foundUser?.pronoun || Pronoun.Keine_Angabe,
        pronounText: foundUser?.pronounText || '',
        birthdate: foundUser?.birthdate || '',
        placeOfBirth: foundUser?.placeOfBirth || '',
        phone: foundUser?.phone || '',
        country: foundUser?.country || '',
        city: foundUser?.city || '',
        zipCode: foundUser?.zipCode || '',
        street: foundUser?.street || '',
        houseNumber: foundUser?.houseNumber || '',
      };

      const loadedAccountForm = {
        password: '',
        passwordRepeat: '',
      };

      setUserForm(loadeduserForm);
      setInitialuserForm(loadeduserForm);
      setInitialAccountForm(loadedAccountForm);

      setUser(foundUser);
      setAccount(foundAccount);
    } catch (error) {
      console.log(error);
    }
  }

  async function updateUser() {
    if (!login) return;
    setIsSaving(true);
    try {
      await patchUser(login.userId!, userForm);
      await patchAccount(login.id, { password: accountForm.password });
      setInitialuserForm(userForm);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    const user = async () => {
      return await load();
    };

    user();
  }, [login]);

  function update(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  }

  function updateAccount(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setAccountForm({ ...accountForm, [e.target.name]: e.target.value });
  }
  function discardChanges() {
    if (initialuserForm && initialAccountForm) {
      setUserForm(initialuserForm);
      setAccountForm(initialAccountForm);
      setValidationErrors({});
    }
  }

  //Pilgrim Style :P
  const [validationErrors, setValidationErrors] = React.useState<
    ValidationMessages<typeof userForm & typeof accountForm>
  >({});

  function validate(e: React.FocusEvent<HTMLInputElement>) {
    switch (e.target.name) {
      case 'firstname':
        let errorMsgFirst: string | undefined = '';

        if (userForm.firstname.length < 1) {
          errorMsgFirst = 'Dein Vorname muss aus mindestens 1 Buchstaben bestehen.';
        } else if (!isOnlyLetter(userForm.firstname)) {
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

        if (userForm.lastname.length < 1) {
          errorMsgLast = 'Dein Nachname muss aus mindestens 1 Buchstaben bestehen.';
        } else if (!isOnlyLetter(userForm.lastname)) {
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

        if (userForm.genderText.length < 1) {
          errorMsgGender = 'Deine Geschlechtsangabe muss aus mindestens 1 Buchstaben bestehen.';
        } else if (!isOnlyLetter(userForm.genderText)) {
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

        if (userForm.pronounText.length < 1) {
          errorMsgPronoun = 'Deine Pronomen müssen aus mindestens 1 Buchstaben bestehen.';
        } else if (!isOnlyLetter(userForm.pronounText)) {
          errorMsgPronoun = 'Deine Pronomen dürfen nur aus Buchstaben bestehen.';
        } else {
          errorMsgPronoun = undefined;
        }
        setValidationErrors({
          ...validationErrors,
          pronounText: errorMsgPronoun,
        });
        break;
      case 'title':
        let errorMsgTitle: string | undefined = '';

        if (userForm.title.length !== 0 && userForm.title.length < 2) {
          errorMsgTitle = 'Dein Titel muss aus mindestens 2 Zeichen bestehen.';
        } else {
          errorMsgTitle = undefined;
        }

        setValidationErrors({
          ...validationErrors,
          title: errorMsgTitle,
        });
        break;
      case 'placeOfBirth':
        let errorMsgbirthPlace: string | undefined = '';

        if (userForm.placeOfBirth.length !== 0 && userForm.placeOfBirth.length < 1) {
          errorMsgbirthPlace = 'Dein Geburtsort muss aus mindestens 2 Buchstaben bestehen.';
        } else if (userForm.placeOfBirth.length !== 0 && !isOnlyLetter(userForm.placeOfBirth)) {
          errorMsgbirthPlace = 'Dein Geburtsort darf nur aus Buchstaben bestehen.';
        } else {
          errorMsgbirthPlace = undefined;
        }

        setValidationErrors({
          ...validationErrors,
          placeOfBirth: errorMsgbirthPlace,
        });
        break;
      case 'country':
        let errorMsgcountry: string | undefined = '';

        if (userForm.country.length !== 0 && userForm.country.length < 2) {
          errorMsgcountry = 'Das angegebene Land muss aus mindestens 2 Buchstaben bestehen.';
        } else if (userForm.country.length !== 0 && !isOnlyLetter(userForm.country)) {
          errorMsgcountry = 'Das angegeben Land darf nur aus Buchstaben bestehen.';
        } else {
          errorMsgcountry = undefined;
        }

        setValidationErrors({
          ...validationErrors,
          country: errorMsgcountry,
        });
        break;
      case 'street':
        let errorMsgstreet: string | undefined = '';

        if (userForm.street.length !== 0 && userForm.street.length < 2) {
          errorMsgstreet = 'Die Straße muss aus mindestens 2 Buchstaben bestehen.';
        } else if (userForm.street.length !== 0 && !isOnlyLetter(userForm.street)) {
          errorMsgstreet = 'Die Straße darf nur aus Buchstaben bestehen.';
        } else {
          errorMsgstreet = undefined;
        }

        setValidationErrors({
          ...validationErrors,
          street: errorMsgstreet,
        });
        break;
      case 'houseNumber':
        let errorMsgHouseNumber: string | undefined = '';

        if (userForm.houseNumber.length !== 0 && userForm.houseNumber.length < 1) {
          errorMsgHouseNumber = 'Die Hausnummer muss aus mindestens 1 Zeichen bestehen.';
        } else {
          errorMsgHouseNumber = undefined;
        }

        setValidationErrors({
          ...validationErrors,
          houseNumber: errorMsgHouseNumber,
        });
        break;
      case 'zipCode':
        let errorMsgZipCode: string | undefined = '';

        if (userForm.zipCode.length !== 0 && userForm.zipCode.length < 2) {
          errorMsgZipCode = 'Die Postleitzahl muss aus mindestens 2 Nummern bestehen.';
        } else if (userForm.zipCode.length !== 0 && !isOnlyNumber(userForm.zipCode)) {
          errorMsgZipCode = 'Die Postleitzahl darf nur aus Nummern bestehen.';
        } else {
          errorMsgZipCode = undefined;
        }

        setValidationErrors({
          ...validationErrors,
          zipCode: errorMsgZipCode,
        });
        break;
      case 'city':
        let errorMsgCity: string | undefined = '';

        if (userForm.city.length !== 0 && userForm.city.length < 2) {
          errorMsgCity = 'Die Stadt muss aus mindestens 2 Buchstaben bestehen.';
        } else if (userForm.city.length !== 0 && !isOnlyLetter(userForm.city)) {
          errorMsgCity = 'Die Stadt darf nur aus Buchstaben bestehen.';
        } else {
          errorMsgCity = undefined;
        }

        setValidationErrors({
          ...validationErrors,
          city: errorMsgCity,
        });
        break;
      case 'phone':
        setValidationErrors({
          ...validationErrors,
          phone:
            userForm.phone.length > 0 && !isValidGermanPhone(userForm.phone)
              ? 'Bitte gib eine gültige deutsche Mobilfunknummer ein (+49 oder 0157...)'
              : undefined,
        });
        break;
      case 'password':
        setValidationErrors({
          ...validationErrors,
          password: !isStrongPassword(accountForm.password)
            ? 'Dein Passwort muss mindestens 8 Zeichen lang sein, eine Ziffer, einen Groß- sowie Kleinbuchstaben und ein Sonderzeichen enthalten.'
            : undefined,
        });
        break;
      case 'passwordRepeat':
        setValidationErrors({
          ...validationErrors,
          passwordRepeat:
            accountForm.passwordRepeat !== accountForm.password
              ? 'Die eingegebenen Passwörter stimmen nicht überein.'
              : undefined,
        });
        break;
    }
  }

  function isFormValid() {
    if (userForm.firstname.length < 1 || !isOnlyLetter(userForm.firstname)) {
      return false;
    }

    if (userForm.lastname.length < 1 || !isOnlyLetter(userForm.lastname)) {
      return false;
    }

    if (
      userForm.gender === Gender.Andere &&
      (userForm.genderText.length < 1 || !isOnlyLetter(userForm.genderText))
    ) {
      return false;
    }
    if (
      userForm.pronoun === Pronoun.Andere &&
      (userForm.pronounText.length < 1 || !isOnlyLetter(userForm.pronounText))
    ) {
      return false;
    }

    if (userForm.title.length !== 0 && userForm.title.length < 2) {
      return false;
    }

    if (
      userForm.placeOfBirth.length !== 0 &&
      (userForm.placeOfBirth.length < 1 || !isOnlyLetter(userForm.placeOfBirth))
    ) {
      return false;
    }

    if (
      userForm.country.length !== 0 &&
      (userForm.country.length < 2 || !isOnlyLetter(userForm.country))
    ) {
      return false;
    }

    if (
      userForm.street.length !== 0 &&
      (userForm.street.length < 2 || !isOnlyLetter(userForm.street))
    ) {
      return false;
    }

    if (userForm.houseNumber.length !== 0 && userForm.houseNumber.length < 1) {
      return false;
    }

    if (
      userForm.zipCode.length !== 0 &&
      (userForm.zipCode.length < 2 || !isOnlyNumber(userForm.zipCode))
    ) {
      return false;
    }

    if (userForm.city.length !== 0 && (userForm.city.length < 2 || !isOnlyLetter(userForm.city))) {
      return false;
    }

    if (userForm.phone.length > 0 && !isValidGermanPhone(userForm.phone)) {
      return false;
    }

    if (accountForm.password.length > 0 && !isStrongPassword(accountForm.password)) {
      return false;
    }
    if (accountForm.password.length > 0 && accountForm.passwordRepeat !== accountForm.password) {
      return false;
    }

    return true;
  }

  if (!account || !user || !initialuserForm) return <></>;

  const hasChanges =
    (initialuserForm && JSON.stringify(userForm) !== JSON.stringify(initialuserForm)) ||
    (initialAccountForm && JSON.stringify(accountForm) !== JSON.stringify(initialAccountForm));

  return (
    <section className="bg-card">
      <div className="bg-card flex-1 w-full p-20 md:p-20 overflow-y-auto md:overflow-y-hidden">
        <div className="space-y-4">
          <div className="relative w-full h-0">
            <div
              className={`
        absolute right-0 top-0 flex items-center gap-3
        transition-opacity duration-200
        ${hasChanges ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
            >
              <Button
                size="sm"
                onClick={discardChanges}
                disabled={!hasChanges}
                className=" bg-accent-red hover:bg-accent-red/90 cursor-pointer shadow-sm gap-2 h-10 px-5 "
              >
                <X className="w-4 h-4" />
                Verwerfen
              </Button>

              <Button
                onClick={updateUser}
                disabled={isSaving || !isFormValid()}
                className=" bg-accent-blue hover:bg-accent-blue/90 cursor-pointer shadow-sm gap-2 h-10 px-5 "
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Speichern…
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Speichern
                  </>
                )}
              </Button>

              {saveSuccess && (
                <span className="text-sm text-emerald-600 font-medium">Gespeichert!</span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Header */}
          <div className=" flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-2">
              Mein Profil
            </h1>
          </div>
        </div>

        {/* Row 1: Profile banner (full width) */}
        <div className="mt-10 bg-linear-to-r from-accent-red-light/30 via-accent-blue-soft to-background rounded-2xl border border-border/60 px-5 py-4 flex items-center gap-5 mb-3">
          <div className="relative group shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center overflow-hidden ring-2 ring-background shadow-md">
              <User className="w-7 h-7 text-primary" />
            </div>
            <button
              className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              type="button"
            >
              <Camera className="w-3 h-3" />
            </button>
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-foreground leading-tight truncate">
              {initialuserForm.title && `${initialuserForm.title} `}
              {initialuserForm.firstname} {initialuserForm.lastname}
            </h2>
          </div>
        </div>

        {/* Row 2: Personal data | Address */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
          {/* Personal data */}
          <div className="bg-(--color-background)  rounded-2xl border border-border/60 p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-6 h-6 rounded-2xl bg-accent-blue/10 flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 text-accent-blue" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Persönliche Daten</h3>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              <div className="space-y-0.5">
                <Label htmlFor="title" className="text-xs text-muted-foreground">
                  Titel
                </Label>
                <Input
                  id="title"
                  name="title"
                  onChange={update}
                  placeholder="z.B. Dr., Prof."
                  value={userForm.title}
                  onBlur={validate}
                />
                {validationErrors.title && (
                  <p className="text-sm text-accent-red mt-1">{validationErrors.title}</p>
                )}
              </div>
              <div className="flex justify-between w-full max-w-2xl mx-auto">
                <div className="space-y-0.5 w-1/2 pr-2">
                  <Label className="text-xs text-muted-foreground">Geschlecht *</Label>
                  <Select
                    value={userForm.gender}
                    onValueChange={(v) =>
                      setUserForm({
                        ...userForm,
                        gender: v as Gender,
                        genderText: v === Gender.Andere ? userForm.genderText : '',
                      })
                    }
                  >
                    <SelectTrigger className="bg-background h-8 w-full">
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
                <div className="space-y-0.5 w-1/2 pr-2">
                  <Label className="text-xs text-muted-foreground">Pronomen</Label>
                  <Select
                    value={userForm.pronoun}
                    onValueChange={(v) =>
                      setUserForm({
                        ...userForm,
                        pronoun: v as Pronoun,
                        pronounText: v === Pronoun.Andere ? userForm.pronounText : '',
                      })
                    }
                  >
                    <SelectTrigger className="bg-background h-8 w-full">
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

              {userForm.gender === Gender.Andere && (
                <div className="space-y-0.5 mt-5">
                  <Label className="text-xs text-muted-foreground">Geschlecht (Text)</Label>
                  <Input
                    name="genderText"
                    value={userForm.genderText}
                    onChange={update}
                    placeholder="Geschlecht"
                    onBlur={validate}
                  />
                  {validationErrors.genderText && (
                    <p className="text-sm text-accent-red mt-1">{validationErrors.genderText}</p>
                  )}
                </div>
              )}
              {userForm.pronoun === Pronoun.Andere && (
                <div className="space-y-0.5 mt-5">
                  <Label className="text-xs text-muted-foreground">Pronomen (Text)</Label>
                  <Input
                    name="pronounText"
                    value={userForm.pronounText}
                    onChange={update}
                    placeholder="Pronomen"
                    onBlur={validate}
                  />
                  {validationErrors.pronounText && (
                    <p className="text-sm text-accent-red mt-1">{validationErrors.pronounText}</p>
                  )}
                </div>
              )}

              <div className="space-y-0.5 mt-5">
                <Label htmlFor="firstname" className="text-xs text-muted-foreground">
                  Vorname
                </Label>
                <Input
                  id="firstname"
                  name="firstname"
                  value={userForm.firstname}
                  onChange={update}
                  onBlur={validate}
                  required
                />
                {validationErrors.firstname && (
                  <p className="text-sm text-accent-red mt-1">{validationErrors.firstname}</p>
                )}
              </div>

              <div className="space-y-0.5 mt-5">
                <Label htmlFor="lastname" className="text-xs text-muted-foreground">
                  Nachname
                </Label>
                <Input
                  id="lastname"
                  name="lastname"
                  onChange={update}
                  value={userForm.lastname}
                  onBlur={validate}
                  required
                />

                {validationErrors.lastname && (
                  <p className="text-sm text-accent-red mt-1">{validationErrors.lastname}</p>
                )}
              </div>

              <div className="space-y-0.5 mt-5">
                <Label htmlFor="placeOfBirth" className="text-xs text-muted-foreground">
                  Geburtsort
                </Label>
                <Input
                  id="placeOfBirth"
                  name="placeOfBirth"
                  onChange={update}
                  placeholder="z.B. Berlin"
                  value={userForm.placeOfBirth}
                  onBlur={validate}
                />
                {validationErrors.placeOfBirth && (
                  <p className="text-sm text-accent-red mt-1">{validationErrors.placeOfBirth}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-(--color-background) rounded-2xl border border-border/60 p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-6 h-6 rounded-2xl bg-accent-blue/10 flex items-center justify-center shadow-sm">
                <MapPin className="w-4 h-4 text-accent-blue" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Adresse</h3>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              <div className="space-y-0.5 col-span-2">
                <Label
                  htmlFor="country"
                  className="text-xs text-muted-foreground flex items-center gap-1"
                >
                  <Globe className="w-3 h-3" /> Land
                </Label>
                <Input
                  id="country"
                  name="country"
                  placeholder="z.B. Deutschland"
                  value={userForm.country}
                  onChange={update}
                  onBlur={validate}
                />
                {validationErrors.country && (
                  <p className="text-sm text-accent-red mt-1">{validationErrors.country}</p>
                )}
              </div>

              <div className="space-y-0.5 mt-5">
                <Label
                  htmlFor="street"
                  className="text-xs text-muted-foreground flex items-center gap-1"
                >
                  <Home className="w-3 h-3" /> Straße
                </Label>
                <Input
                  id="street"
                  name="street"
                  placeholder="Straßenname"
                  value={userForm.street}
                  onChange={update}
                  onBlur={validate}
                />
                {validationErrors.street && (
                  <p className="text-sm text-accent-red mt-1">{validationErrors.street}</p>
                )}
              </div>

              <div className="space-y-0.5 mt-5">
                <Label
                  htmlFor="houseNumber"
                  className="text-xs text-muted-foreground flex items-center gap-1"
                >
                  <Hash className="w-3 h-3" /> Hausnummer
                </Label>
                <Input
                  id="houseNumber"
                  name="houseNumber"
                  placeholder="z.B. 42"
                  value={userForm.houseNumber}
                  onChange={update}
                  onBlur={validate}
                />
                {validationErrors.houseNumber && (
                  <p className="text-sm text-accent-red mt-1">{validationErrors.houseNumber}</p>
                )}
              </div>

              <div className="space-y-0.5 mt-5">
                <Label htmlFor="zipCode" className="text-xs text-muted-foreground">
                  PLZ
                </Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  placeholder="z.B. 10115"
                  value={userForm.zipCode}
                  onChange={update}
                  onBlur={validate}
                />
                {validationErrors.zipCode && (
                  <p className="text-sm text-accent-red mt-1">{validationErrors.zipCode}</p>
                )}
              </div>

              <div className="space-y-0.5 mt-5">
                <Label
                  htmlFor="city"
                  className="text-xs text-muted-foreground flex items-center gap-1"
                >
                  <Building2 className="w-3 h-3" /> Stadt
                </Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="z.B. Berlin"
                  value={userForm.city}
                  onChange={update}
                  onBlur={validate}
                />
                {validationErrors.city && (
                  <p className="text-sm text-accent-red mt-1">{validationErrors.city}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Account & Security | Delete Account */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Account & Security */}
          <div className="bg-(--color-background) rounded-2xl border border-border/60 p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-6 h-6 rounded-2xl bg-accent-blue/10 flex items-center justify-center shadow-sm">
                <Lock className="w-4 h-4 text-accent-blue" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Konto & Sicherheit</h3>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              <div className="space-y-0.5">
                <Label htmlFor="email" className="text-xs text-muted-foreground">
                  <Mail className="w-3 h-3" /> E-Mail
                </Label>
                <Input id="email" type="email" value={account?.email} disabled />
              </div>

              <div className="space-y-0.5">
                <Label htmlFor="newPassword" className="text-xs text-muted-foreground">
                  Neues Passwort
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Mind. 8 Zeichen"
                    value={accountForm.password}
                    onChange={updateAccount}
                    onBlur={validate}
                  />
                  {validationErrors.password && (
                    <p className="text-sm text-accent-red mt-1">{validationErrors.password}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-0.5 mt-5">
                <Label
                  htmlFor="phone"
                  className="text-xs text-muted-foreground flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" /> Telefon
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+49 170 1234567"
                  value={userForm.phone}
                  onChange={update}
                  onBlur={validate}
                />
                {validationErrors.phone && (
                  <p className="text-sm text-accent-red mt-1">{validationErrors.phone}</p>
                )}
              </div>

              <div className="space-y-0.5 mt-5">
                <Label htmlFor="confirmPassword" className="text-xs text-muted-foreground">
                  Passwort wiederholen
                </Label>
                <div className="relative">
                  <Input
                    id="passwordRepeat"
                    name="passwordRepeat"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Passwort bestätigen"
                    value={accountForm.passwordRepeat}
                    onChange={updateAccount}
                    onBlur={validate}
                  />
                  {validationErrors.passwordRepeat && (
                    <p className="text-sm text-accent-red mt-1">
                      {validationErrors.passwordRepeat}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Delete Account */}
          <div className="bg-(--color-background)  rounded-2xl border border-destructive/20 p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-6 h-6 rounded-2xl bg-destructive/10 flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-destructive" />
              </div>
              <h3 className="text-sm font-semibold text-destructive">Konto löschen</h3>
            </div>

            <div className="flex items-start gap-3 mb-4 mt-3">
              <AlertTriangle className="w-4 h-4 text-destructive/70 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed ">
                Wenn du dein Konto löschst, werden alle deine Daten, Fälle und Dokumente
                unwiderruflich entfernt. Dieser Vorgang kann nicht rückgängig gemacht werden. Bitte
                stelle sicher, dass du alle wichtigen Daten vorher gesichert hast.
              </p>
            </div>

            <div className="mt-auto">
              <Button
                variant="destructive"
                size="sm"
                className="gap-1.5 text-xs h-8"
                onClick={() => {
                  if (
                    window.confirm(
                      'Bist du sicher, dass du dein Konto unwiderruflich löschen möchtest?'
                    )
                  ) {
                    // handle deletion
                  }
                }}
              >
                <Trash2 className="w-3 h-3" />
                Konto endgültig löschen
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
