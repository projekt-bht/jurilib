'use client';

import React from 'react';
import { Areas, OrganizationType, PriceCategory } from '../../../generated/prisma/enums';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

interface RegisterOrganizationFormProps {
  orgForm: {
    name: string;
    email: string;
    password: string;
    phone: string;
    website: string;
    address: string;
    organizationType: OrganizationType;
    expertiseArea: Areas[];
    description: string;
    shortDescription: string;
    priceCategory: PriceCategory;
  };
  loading: boolean;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      | { target: { name: string; value: string } }
  ) => void;
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
  // Extract all available Prisma expertise areas from enum
  const displayedAreas = Object.values(Areas) as Areas[];

  // Labels for organization types from Prisma enum
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

  // Generate UI options from Prisma enum
  const orgTypeOptions = (Object.values(OrganizationType) as OrganizationType[]).map((value) => ({
    value,
    label: orgTypeLabels[value] ?? value.replace(/_/g, ' '), // Fallback: Enum-Wert lesbar machen
  }));

  return (
    <form onSubmit={(e) => onSubmit(e)} className="mt-4 space-y-6">
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Grundinformationen</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            id="org-name"
            name="name"
            value={orgForm.name}
            onChange={onChange}
            placeholder="Ihr vollständiger Name"
            required
          />
          <Input
            id="org-email"
            name="email"
            type="email"
            value={orgForm.email}
            onChange={onChange}
            placeholder="ihre.email@beispiel.de"
            required
          />
          <Input
            id="org-password"
            name="password"
            type="password"
            value={orgForm.password}
            onChange={onChange}
            placeholder="Mindestens 8 Zeichen"
            minLength={8}
            required
          />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-foreground">Organisationsdetails</h3>
          <div className="flex gap-2">
            {orgTypeOptions.map(({ value, label }) => {
              const isActive = orgForm.organizationType === value;
              return (
                <Button
                  key={value}
                  type="button"
                  variant={isActive ? 'default' : 'outline'}
                  className="rounded-full px-4 py-1"
                  onClick={() => onSelectOrgType(value)}
                >
                  {label}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
          <Input
            id="website"
            name="website"
            value={orgForm.website}
            onChange={onChange}
            placeholder="www.ihre-organisation.de"
          />
          <Input
            id="phone"
            name="phone"
            value={orgForm.phone}
            onChange={onChange}
            placeholder="+49 89 1234567"
          />
          <Input
            id="address"
            name="address"
            value={orgForm.address}
            onChange={onChange}
            placeholder="Straße Nr., PLZ Stadt"
          />
          <div className="space-y-1">
            <Label htmlFor="priceCategory">Preisniveau</Label>
            <Select
              value={orgForm.priceCategory}
              onValueChange={(val) => onChange({ target: { name: 'priceCategory', value: val } })}
            >
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Preis auswählen" />
              </SelectTrigger>
              <SelectContent>
                {priceOptions.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <textarea
              id="description"
              name="description"
              value={orgForm.description}
              onChange={onChange}
              placeholder="Was macht Ihre Organisation besonders?"
              className="border-input w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] min-h-[110px] resize-none"
            />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Fachgebiete</h3>
          <p className="text-xs text-muted-foreground">Wählen Sie alle relevanten Bereiche aus.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-4">
          {displayedAreas.map((area) => (
            <label key={area} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={orgForm.expertiseArea.includes(area)}
                onCheckedChange={() => onToggleArea(area)}
              />
              <span className="text-sm">{area}</span>
            </label>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3 md:flex-row md:justify-end">
        <Button type="submit" className="md:w-40" disabled={loading}>
          {loading ? 'Wird registriert...' : 'Registrieren'}
        </Button>
      </div>
    </form>
  );
}
