'use client';

import {
  AlertTriangle,
  Building2,
  Calendar,
  Camera,
  ChevronRight,
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
import { useEffect, useState } from 'react';

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
import { getAccount, getUser } from '@/services/api';
import type { AccountResource, UserResource } from '@/services/Resources';

import { useLoginContext } from '../LoginContext';
import { Gender, Pronoun } from '~/generated/prisma/enums';

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

  const [formData, setFormData] = useState({
    title: user?.title || '',
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    gender: user?.gender || 'MALE',
    genderText: user?.genderText || '',
    pronoun: user?.pronoun || 'HE_HIM',
    pronounText: user?.pronounText || '',
    birthdate: user?.birthdate || '',
    placeOfBirth: user?.placeOfBirth || '',
    phone: user?.phone || '',
    imageUrl: user?.imageUrl || '',
    country: user?.country || '',
    city: user?.city || '',
    zipCode: user?.zipCode || '',
    street: user?.street || '',
    houseNumber: user?.houseNumber || '',
  } as UserResource);

  async function load() {
    if (!login) return;
    try {
      const foundUser = await getUser(login.userId!);
      const foundAccount = await getAccount(login.id);
      setFormData(foundUser);
      setUser(foundUser);
      setAccount(foundAccount);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const user = async () => {
      return await load();
    };

    user();
  }, [login]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaveSuccess(false);
  };

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

    const pronounLabels: Record<string, string> = {
      HE_HIM: 'er/ihm',
      SHE_HER: 'sie/ihr',
      THEY_THEM: 'they/them',
      OTHER: formData.pronounText || 'Andere',
    };

    setIsSaving(false);
    setSaveSuccess(true);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <section className="py-5 px-4 md:px-8 bg-background scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <span>Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-foreground font-medium">Profil</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Mein Profil</h1>
          </div>
          <div className="flex items-center gap-4">
            {saveSuccess && (
              <span className="text-sm text-emerald-600 font-medium">Gespeichert!</span>
            )}
            <Button
              onClick={handleSave}
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
        <div className="bg-card rounded-xl border border-border/60 px-5 py-4 flex items-center gap-5 mb-3">
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
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            <p className="text-xs text-muted-foreground"></p>
          </div>
        </div>

        {/* Row 2: Personal data | Address */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
          {/* Personal data */}
          <div className="bg-card rounded-xl border border-border/60 p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                <User className="w-3 h-3 text-primary" />
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
                  placeholder="z.B. Dr., Prof."
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="bg-background h-8 text-xs"
                />
              </div>

              <div className="space-y-0.5">
                <Label>Geschlecht *</Label>
                <Select value={formData.gender}>
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

              {formData.gender === Gender.Andere && (
                <div className="space-y-2">
                  <Label>Geschlecht (Text) *</Label>
                  <Input name="genderText" value={formData.genderText} placeholder="Geschlecht" />
                </div>
              )}
              {formData.pronoun === Pronoun.Andere && (
                <div className="space-y-2">
                  <Label>Pronomen (Text)</Label>
                  <Input name="pronounText" value={formData.pronounText} placeholder="Pronomen" />
                </div>
              )}

              <div className="space-y-0.5">
                <Label htmlFor="firstname" className="text-xs text-muted-foreground">
                  Vorname <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstname"
                  value={formData.firstname}
                  onChange={(e) => handleInputChange('firstname', e.target.value)}
                  className="bg-background h-8 text-xs"
                  required
                />
              </div>

              <div className="space-y-0.5">
                <Label htmlFor="lastname" className="text-xs text-muted-foreground">
                  Nachname <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastname"
                  value={formData.lastname}
                  onChange={(e) => handleInputChange('lastname', e.target.value)}
                  className="bg-background h-8 text-xs"
                  required
                />
              </div>

              <div className="space-y-0.5">
                <Label>Pronomen *</Label>
                <Select value={formData.gender}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Pronoun).map((g) => (
                      <SelectItem key={g} value={g} className="hover:bg-accent-gray-light">
                        {g.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-0.5">
                <Label htmlFor="birthdate" className="text-xs text-muted-foreground">
                  Geburtsdatum
                </Label>
                <Input
                  id="birthdate"
                  type="date"
                  value={String(formData.birthdate)}
                  onChange={(e) => handleInputChange('birthdate', e.target.value)}
                  className="bg-background h-8 text-xs"
                />
              </div>
              <div className="space-y-0.5 col-span-2">
                <Label htmlFor="placeOfBirth" className="text-xs text-muted-foreground">
                  Geburtsort
                </Label>
                <Input
                  id="placeOfBirth"
                  placeholder="z.B. Berlin"
                  value={formData.placeOfBirth}
                  onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                  className="bg-background h-8 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-card rounded-xl border border-border/60 p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                <MapPin className="w-3 h-3 text-primary" />
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
                  placeholder="z.B. Deutschland"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="bg-background h-8 text-xs"
                />
              </div>

              <div className="space-y-0.5">
                <Label
                  htmlFor="street"
                  className="text-xs text-muted-foreground flex items-center gap-1"
                >
                  <Home className="w-3 h-3" /> Straße
                </Label>
                <Input
                  id="street"
                  placeholder="Straßenname"
                  value={formData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  className="bg-background h-8 text-xs"
                />
              </div>

              <div className="space-y-0.5">
                <Label
                  htmlFor="houseNumber"
                  className="text-xs text-muted-foreground flex items-center gap-1"
                >
                  <Hash className="w-3 h-3" /> Hausnummer
                </Label>
                <Input
                  id="houseNumber"
                  placeholder="z.B. 42"
                  value={formData.houseNumber}
                  onChange={(e) => handleInputChange('houseNumber', e.target.value)}
                  className="bg-background h-8 text-xs"
                />
              </div>

              <div className="space-y-0.5">
                <Label htmlFor="zipCode" className="text-xs text-muted-foreground">
                  PLZ
                </Label>
                <Input
                  id="zipCode"
                  placeholder="z.B. 10115"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className="bg-background h-8 text-xs"
                />
              </div>

              <div className="space-y-0.5">
                <Label
                  htmlFor="city"
                  className="text-xs text-muted-foreground flex items-center gap-1"
                >
                  <Building2 className="w-3 h-3" /> Stadt
                </Label>
                <Input
                  id="city"
                  placeholder="z.B. Berlin"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="bg-background h-8 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Account & Security | Delete Account */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Account & Security */}
          <div className="bg-card rounded-xl border border-border/60 p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                <Lock className="w-3 h-3 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Konto & Sicherheit</h3>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              <div className="space-y-0.5">
                <Label
                  htmlFor="phone"
                  className="text-xs text-muted-foreground flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" /> Telefon
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+49 170 1234567"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="bg-background h-8 text-xs"
                />
              </div>

              <div className="space-y-0.5">
                <Label
                  htmlFor="email"
                  className="text-xs text-muted-foreground flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" /> E-Mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={account?.email || ''}
                  disabled
                  className="bg-muted h-8 text-xs text-muted-foreground cursor-not-allowed"
                />
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
                    className="bg-background h-8 text-xs pr-7"
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

              <div className="space-y-0.5">
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
                    className="bg-background h-8 text-xs pr-7"
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
          <div className="bg-card rounded-xl border border-destructive/20 p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-6 h-6 rounded-md bg-destructive/10 flex items-center justify-center">
                <Trash2 className="w-3 h-3 text-destructive" />
              </div>
              <h3 className="text-sm font-semibold text-destructive">Konto löschen</h3>
            </div>

            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-4 h-4 text-destructive/70 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
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
