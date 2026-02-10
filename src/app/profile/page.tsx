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
import { getAccount, getUser, patchUser } from '@/services/api';
import type { AccountResource, UserResource } from '@/services/Resources';
import {
  isOnlyLetter,
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
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [user, setUser] = useState<UserResource>();
  const [account, setAccount] = useState<AccountResource>();

  if (!login) notFound();

  const [formData, setFormData] = useState({
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

  async function load() {
    if (!login) return;
    try {
      const foundUser = await getUser(login.userId!);
      const foundAccount = await getAccount(login.id);
      setFormData({
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
      });
      setUser(foundUser);
      setAccount(foundAccount);
    } catch (error) {
      console.log(error);
    }
  }

  async function updateUser() {
    try {
      if (!login) return;
      await patchUser(login.userId!, formData);
    } catch (error) {}
  }

  useEffect(() => {
    const user = async () => {
      return await load();
    };

    user();
  }, [login]);

  const handleSave = async () => {
    if (newPassword || confirmPassword) {
      if (newPassword.length < 8) {
        setPasswordError('Passwort muss mindestens 8 Zeichen lang sein.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError('Passwörter stimmen nicht überein.');
        return;
      }
      setPasswordError('');
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsSaving(false);
    setSaveSuccess(true);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  function update(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  if (!account || !user) return <></>;

  return (
    <section className="bg-card">
      <div className="bg-card flex-1 w-full p-20 md:p-20 overflow-y-auto md:overflow-y-hidden">
        <div className="space-y-4">
          {/* Header */}
          <div className=" flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-2">
              Mein Profil
            </h1>
          </div>
          <div className="flex items-center justify-end w-full mb-5">
            {saveSuccess && (
              <span className="text-sm text-emerald-600 font-medium">Gespeichert!</span>
            )}
            <Button
              onClick={updateUser}
              disabled={isSaving || !formData.firstname || !formData.lastname}
              className="gap-2 h-10 text-sm px-5"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Speichern...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Speichern
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Row 1: Profile banner (full width) */}
        <div className="bg-linear-to-r from-accent-red-light/30 via-accent-blue-soft to-background rounded-2xl border border-border/60 px-5 py-4 flex items-center gap-5 mb-3">
          <div className="relative group shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center overflow-hidden ring-2 ring-background shadow-md">
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl || '/placeholder.svg'}
                  alt={`${formData.firstname} ${formData.lastname}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-7 h-7 text-primary" />
              )}
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
              {formData.title && `${formData.title} `}
              {formData.firstname} {formData.lastname}
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
                <Input id="title" placeholder="z.B. Dr., Prof." value={formData.title} />
              </div>
              <div className="flex justify-between w-full max-w-2xl mx-auto">
                <div className="space-y-0.5 w-1/2 pr-2">
                  <Label className="text-xs text-muted-foreground">Geschlecht *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(v) =>
                      setFormData({
                        ...formData,
                        gender: v as Gender,
                        genderText: v === Gender.Andere ? formData.genderText : '',
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
                    value={formData.pronoun}
                    onValueChange={(v) =>
                      setFormData({
                        ...formData,
                        pronoun: v as Pronoun,
                        pronounText: v === Pronoun.Andere ? formData.pronounText : '',
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

              {formData.gender === Gender.Andere && (
                <div className="space-y-0.5 mt-5">
                  <Label className="text-xs text-muted-foreground">Geschlecht (Text)</Label>
                  <Input
                    name="genderText"
                    value={formData.genderText}
                    onChange={update}
                    placeholder="Geschlecht"
                  />
                </div>
              )}
              {formData.pronoun === Pronoun.Andere && (
                <div className="space-y-0.5 mt-5">
                  <Label className="text-xs text-muted-foreground">Pronomen (Text)</Label>
                  <Input
                    name="pronounText"
                    value={formData.pronounText}
                    onChange={update}
                    placeholder="Pronomen"
                  />
                </div>
              )}

              <div className="space-y-0.5 mt-5">
                <Label htmlFor="firstname" className="text-xs text-muted-foreground">
                  Vorname
                </Label>
                <Input
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={update}
                  required
                />
              </div>

              <div className="space-y-0.5 mt-5">
                <Label htmlFor="lastname" className="text-xs text-muted-foreground">
                  Nachname
                </Label>
                <Input
                  id="lastname"
                  name="lastname"
                  onChange={update}
                  value={formData.lastname}
                  required
                />
              </div>

              <div className="space-y-0.5 mt-5">
                <Label htmlFor="placeOfBirth" className="text-xs text-muted-foreground">
                  Geburtsort
                </Label>
                <Input
                  id="placeOfBirth"
                  placeholder="z.B. Berlin"
                  value={formData.placeOfBirth}
                  className="bg-background h-8 text-xs"
                />
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
                <Input id="country" placeholder="z.B. Deutschland" value={formData.country} />
              </div>

              <div className="space-y-0.5 mt-5">
                <Label
                  htmlFor="street"
                  className="text-xs text-muted-foreground flex items-center gap-1"
                >
                  <Home className="w-3 h-3" /> Straße
                </Label>
                <Input id="street" placeholder="Straßenname" value={formData.street} />
              </div>

              <div className="space-y-0.5 mt-5">
                <Label
                  htmlFor="houseNumber"
                  className="text-xs text-muted-foreground flex items-center gap-1"
                >
                  <Hash className="w-3 h-3" /> Hausnummer
                </Label>
                <Input id="houseNumber" placeholder="z.B. 42" value={formData.houseNumber} />
              </div>

              <div className="space-y-0.5 mt-5">
                <Label htmlFor="zipCode" className="text-xs text-muted-foreground">
                  PLZ
                </Label>
                <Input id="zipCode" placeholder="z.B. 10115" value={formData.zipCode} />
              </div>

              <div className="space-y-0.5 mt-5">
                <Label
                  htmlFor="city"
                  className="text-xs text-muted-foreground flex items-center gap-1"
                >
                  <Building2 className="w-3 h-3" /> Stadt
                </Label>
                <Input id="city" placeholder="z.B. Berlin" value={formData.city} />
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
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Mind. 8 Zeichen"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError('');
                    }}
                  />
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
                <Input id="phone" type="tel" placeholder="+49 170 1234567" value={formData.phone} />
              </div>

              <div className="space-y-0.5 mt-5">
                <Label htmlFor="confirmPassword" className="text-xs text-muted-foreground">
                  Passwort wiederholen
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Passwort bestätigen"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError('');
                    }}
                  />
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

              {passwordError && (
                <p className="text-xs text-destructive col-span-2">{passwordError}</p>
              )}
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
