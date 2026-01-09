'use client';

import { Building2, ChevronDown, Filter, Scale, Tag, Users, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { Areas, OrganizationType, PriceCategory } from '~/generated/prisma/enums';
import {
  Areas as AreasEnum,
  OrganizationType as OrganizationTypeEnum,
  PriceCategory as PriceCategoryEnum,
} from '~/generated/prisma/enums';

export type FilterOptions = {
  priceCategory: PriceCategory[];
  organizationType: OrganizationType[];
  specialties: Areas[];
};

type FilterValue = PriceCategory | OrganizationType | Areas;

const priceCategoryMeta: Record<PriceCategoryEnum, { label: string; className: string }> = {
  [PriceCategoryEnum.FREE]: { label: '€ - Niedrig', className: 'text-emerald-600' },
  [PriceCategoryEnum.LOW]: { label: '€€ - Mittel', className: 'text-amber-600' },
  [PriceCategoryEnum.MEDIUM]: { label: '€€€ - Hoch', className: 'text-red-600' },
  [PriceCategoryEnum.HIGH]: { label: '€€€€ - Premium', className: 'text-rose-600' },
};

const organizationTypeMeta: Record<OrganizationTypeEnum, { label: string; icon: React.ReactNode }> =
  {
    [OrganizationTypeEnum.LAW_FIRM]: {
      label: 'Kanzlei',
      icon: <Building2 className="w-3.5 h-3.5" />,
    },
    [OrganizationTypeEnum.ASSOCIATION]: {
      label: 'Verein',
      icon: <Users className="w-3.5 h-3.5" />,
    },
  };

const collapsibleDefaults: Record<keyof FilterOptions, boolean> = {
  priceCategory: true,
  organizationType: true,
  specialties: true,
};

export function OrganizationFilters({
  filters,
  onFilterChange,
  onReset,
  activeFilterCount,
}: {
  filters: FilterOptions;
  onFilterChange: (category: keyof FilterOptions, value: FilterValue, checked: boolean) => void;
  onReset: () => void;
  activeFilterCount: number;
}) {
  const [openSections, setOpenSections] =
    useState<Record<keyof FilterOptions, boolean>>(collapsibleDefaults);

  const toggleSection = (section: keyof FilterOptions) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const renderSectionHeader = (
    title: string,
    section: keyof FilterOptions,
    icon: React.ReactNode
  ) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="flex w-full items-center justify-between rounded-lg px-2 py-2 hover:bg-muted/50 transition-colors"
    >
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className="text-muted-foreground">{icon}</span>
        {title}
      </span>
      <ChevronDown
        className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
          openSections[section] ? 'rotate-180' : ''
        }`}
      />
    </button>
  );

  const handleCheckboxChange = (
    category: keyof FilterOptions,
    value: FilterValue,
    checked: boolean
  ) => {
    onFilterChange(category, value, checked);
  };

  const isActiveFilters = activeFilterCount > 0;

  return (
    <section className="w-full rounded-2xl border border-border bg-background p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3">
        <div className="flex items-center gap-3">
          <div className="rounded-full border border-border/60 bg-muted p-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Filter</h3>
            <p className="text-xs text-muted-foreground">
              Wähle Organisationstyp, Preisklasse und Fachbereich
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isActiveFilters && (
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
              {activeFilterCount} aktiv
            </span>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!isActiveFilters}
            onClick={onReset}
            className="h-8 px-2 text-xs font-semibold"
          >
            <X className="w-4 h-4" />
            Zurücksetzen
          </Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border/80 bg-background px-3 pb-3 pt-2">
          {renderSectionHeader('Organisationstyp', 'organizationType', <Building2 className="w-4 h-4" />)}
          {openSections.organizationType && (
            <div className="mt-2 space-y-2">
              {Object.values(OrganizationTypeEnum).map((type) => (
                <div key={type} className="flex items-center gap-3 rounded-md px-2 py-1.5">
                  <Checkbox
                    id={`org-type-${type}`}
                    checked={filters.organizationType.includes(type)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange('organizationType', type, Boolean(checked))
                    }
                    aria-label={`Filter nach ${organizationTypeMeta[type].label}`}
                  />
                  <Label
                    htmlFor={`org-type-${type}`}
                    className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground"
                  >
                    {organizationTypeMeta[type].icon}
                    {organizationTypeMeta[type].label}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border/80 bg-background px-3 pb-3 pt-2">
          {renderSectionHeader('Preisklasse', 'priceCategory', <Scale className="w-4 h-4" />)}
          {openSections.priceCategory && (
            <div className="mt-2 space-y-2">
              {Object.values(PriceCategoryEnum).map((price) => (
                <div key={price} className="flex items-center gap-3 rounded-md px-2 py-1.5">
                  <Checkbox
                    id={`price-${price}`}
                    checked={filters.priceCategory.includes(price)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange('priceCategory', price, Boolean(checked))
                    }
                    aria-label={`Filter nach ${priceCategoryMeta[price].label}`}
                  />
                  <Label
                    htmlFor={`price-${price}`}
                    className={`cursor-pointer text-sm font-semibold ${priceCategoryMeta[price].className}`}
                  >
                    {priceCategoryMeta[price].label}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border/80 bg-background px-3 pb-3 pt-2">
          {renderSectionHeader('Fachbereich', 'specialties', <Tag className="w-4 h-4" />)}
          {openSections.specialties && (
            <div className="mt-2 space-y-2 max-h-56 overflow-y-auto pr-1">
              {Object.values(AreasEnum).map((area) => (
                <div key={area} className="flex items-center gap-3 rounded-md px-2 py-1.5">
                  <Checkbox
                    id={`specialty-${area}`}
                    checked={filters.specialties.includes(area)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange('specialties', area, Boolean(checked))
                    }
                    aria-label={`Filter nach ${area}`}
                  />
                  <Label
                    htmlFor={`specialty-${area}`}
                    className="cursor-pointer text-sm font-medium text-foreground"
                  >
                    {area}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
