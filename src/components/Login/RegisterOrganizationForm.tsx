'use client';

import React from 'react';
import { Areas, OrganizationType, PriceCategory } from '../../../generated/prisma/enums';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface RegisterOrganizationFormProps {
  orgForm: {
    name: string;
    email: string;
    password: string;
    phone: string;
    website: string;
    address: string;
    organizationType: OrganizationType; // Prisma Enum → zwingt gültigen Organisations-Typ
    expertiseArea: Areas[]; // Prisma Enum-Liste → ausgewählte Fachgebiete
    description: string;
    shortDescription: string;
    priceCategory: PriceCategory;
  };
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onToggleArea: (area: Areas) => void;
  onSelectOrgType: (value: OrganizationType) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function RegisterOrganizationForm({
  orgForm,
  loading,
  onChange,
  onToggleArea,
  onSelectOrgType,
  onSubmit,
}: RegisterOrganizationFormProps) {
  // Alle verfügbaren Prisma-Fachgebiete ("Areas") aus dem Enum extrahieren.
  const displayedAreas = Object.values(Areas) as Areas[];

  // Labels für die Organisationstypen, die aus Prisma Enum "OrganizationType" kommen.
  const orgTypeLabels: Partial<Record<OrganizationType, string>> = {
    [OrganizationType.LAW_FIRM]: 'Kanzlei',
    [OrganizationType.ASSOCIATION]: 'Verband',
  };

  const priceLabels: Partial<Record<PriceCategory, string>> = {
    [PriceCategory.FREE]: 'Kostenlos',
    [PriceCategory.LOW]: 'Niedrig',
    [PriceCategory.MEDIUM]: 'Mittel',
    [PriceCategory.HIGH]: 'Hoch',
  };

  const priceOptions = (Object.values(PriceCategory) as PriceCategory[]).map((value) => ({
    value,
    label: priceLabels[value] ?? value,
  }));

  // Prisma Enum → UI-Optionen generieren.
  const orgTypeOptions = (Object.values(OrganizationType) as OrganizationType[]).map((value) => ({
    value,
    label: orgTypeLabels[value] ?? value.replace(/_/g, ' '), // Fallback: Enum-Wert lesbar machen
  }));

  return (
    <form onSubmit={(e) => onSubmit(e)}>
      <div className="space-y-6 mt-6">
        <h3 className="text-lg font-medium">Grundinformationen</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Organisationsname */}
          <div className="space-y-2">
            <Label htmlFor="org-name">Name</Label>
            <Input
              id="org-name"
              name="name"
              value={orgForm.name}
              onChange={onChange}
              placeholder="Ihr vollständiger Name"
              required
            />
          </div>

          {/* E-Mail Adresse */}
          <div className="space-y-2">
            <Label htmlFor="org-email">E-Mail</Label>
            <Input
              id="org-email"
              name="email"
              type="email"
              value={orgForm.email}
              onChange={onChange}
              placeholder="ihre.email@beispiel.de"
              required
            />
          </div>

          {/* Passwort */}
          <div className="space-y-2">
            <Label htmlFor="org-password">Passwort</Label>
            <Input
              id="org-password"
              name="password"
              type="password"
              value={orgForm.password}
              onChange={onChange}
              placeholder="Mindestens 8 Zeichen"
              minLength={8} // einfache Validierung
              required
            />
          </div>
        </div>

        {/* --- Organisationsdetails --- */}
        <h3 className="text-lg font-medium">Organisationsdetails</h3>

        {/* Organisationstyp Auswahl (über Prisma Enum generiert) */}
        <div className="space-y-2 md:col-span-2">
          <Label>Organisationstyp</Label>

          <div className="flex gap-2">
            {/* Buttons dynamisch aus Prisma Enum erstellt */}
            {orgTypeOptions.map(({ value, label }) => (
              <Button
                key={value}
                type="button"
                // Aktiver Typ farblich hervorgehoben
                variant={orgForm.organizationType === value ? 'default' : 'outline'}
                onClick={() => onSelectOrgType(value)} // setzt Prisma Enum Wert
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Kontakt & Adressinformationen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Telefonnummer */}
          <div className="space-y-2">
            <Label htmlFor="phone">Telefonnummer</Label>
            <Input
              id="phone"
              name="phone"
              value={orgForm.phone}
              onChange={onChange}
              placeholder="+49 89 12345678"
            />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              value={orgForm.website}
              onChange={onChange}
              placeholder="www.ihre-organisation.de"
            />
          </div>

          {/* Adresse */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              name="address"
              value={orgForm.address}
              onChange={onChange}
              placeholder="Straße Nr., PLZ Stadt"
            />
          </div>
        </div>

        {/* Profilinformationen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="shortDescription">Kurzbeschreibung</Label>
            <Input
              id="shortDescription"
              name="shortDescription"
              value={orgForm.shortDescription}
              onChange={onChange}
              placeholder="Kurzprofil der Organisation"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priceCategory">Preisniveau</Label>
            <select
              id="priceCategory"
              name="priceCategory"
              value={orgForm.priceCategory}
              onChange={onChange}
              className="border-input w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            >
              {priceOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Beschreibung</Label>
            <textarea
              id="description"
              name="description"
              value={orgForm.description}
              onChange={onChange}
              placeholder="Ausführliche Beschreibung Ihrer Organisation"
              className="border-input w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] min-h-[120px]"
            />
          </div>
        </div>

        {/* --- Fachgebiete (Prisma Enum Liste) --- */}
        <h3 className="text-sm font-medium">Fachgebiete</h3>

        {/* Scrollbare Checkbox-Liste aus Prisma Enum "Areas" */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-4">
          {displayedAreas.map((area) => (
            <label key={area} className="flex items-center gap-2 cursor-pointer">
              {/* Checkbox getoggelt basierend auf Prisma Enum-Werten */}
              <Checkbox
                checked={orgForm.expertiseArea.includes(area)}
                onCheckedChange={() => onToggleArea(area)}
              />

              {/* Enum-Wert als Text angezeigt */}
              <span className="text-sm">{area}</span>
            </label>
          ))}
        </div>

        {/* Absenden-Button */}
        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? 'Wird registriert...' : 'Registrieren'}
        </Button>
      </div>
    </form>
  );
}
