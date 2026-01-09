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

const priceCategoryMeta: Record<PriceCategoryEnum, { label: string }> = {
  [PriceCategoryEnum.FREE]: { label: '€ - Niedrig' },
  [PriceCategoryEnum.LOW]: { label: '€€ - Mittel' },
  [PriceCategoryEnum.MEDIUM]: { label: '€€€ - Hoch' },
  [PriceCategoryEnum.HIGH]: { label: '€€€€ - Premium' },
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
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [sortedAreas] = useState(() =>
    // Keep specialties deterministic and easy to scan.
    [...Object.values(AreasEnum)].sort((a, b) => a.localeCompare(b, 'de'))
  );

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
      className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 hover:bg-muted transition-colors"
    >
      <span className="inline-flex items-center gap-2 text-xs font-semibold text-foreground">
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
    <section className="w-full rounded-lg border border-border bg-background p-3">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-2">
        <div className="flex items-center gap-3">
          <div className="rounded-full border border-border bg-muted p-1.5">
            <Filter className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Filter</h3>
            <p className="text-xs text-muted-foreground">
              Wähle Organisationstyp, Preisklasse und Fachbereich
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isActiveFilters && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-foreground">
              {activeFilterCount} aktiv
            </span>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!isActiveFilters}
            onClick={onReset}
            className="h-7 px-2 text-xs font-semibold"
          >
            <X className="w-4 h-4" />
            Zurücksetzen
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsPanelOpen((prev) => !prev)}
            className="h-7 w-7 p-0"
            aria-label={isPanelOpen ? 'Filter schließen' : 'Filter öffnen'}
          >
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                isPanelOpen ? 'rotate-180' : ''
              }`}
            />
          </Button>
        </div>
      </div>

      {isPanelOpen && (
        <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-background px-2.5 pb-2.5 pt-2">
            {renderSectionHeader(
              'Organisationstyp',
              'organizationType',
              <Building2 className="w-4 h-4" />
            )}
            {openSections.organizationType && (
              <div className="mt-2 space-y-1.5">
                {Object.values(OrganizationTypeEnum).map((type) => (
                  <div key={type} className="flex items-center gap-2 rounded-md px-2 py-1">
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
                    className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-foreground"
                  >
                    {organizationTypeMeta[type].icon}
                    {organizationTypeMeta[type].label}
                  </Label>
                </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-border bg-background px-2.5 pb-2.5 pt-2">
            {renderSectionHeader('Preisklasse', 'priceCategory', <Scale className="w-4 h-4" />)}
            {openSections.priceCategory && (
              <div className="mt-2 space-y-1.5">
                {Object.values(PriceCategoryEnum).map((price) => (
                  <div key={price} className="flex items-center gap-2 rounded-md px-2 py-1">
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
                    className="cursor-pointer text-xs font-semibold text-foreground"
                  >
                    {priceCategoryMeta[price].label}
                  </Label>
                </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-border bg-background px-2.5 pb-2.5 pt-2">
            {renderSectionHeader('Fachbereich', 'specialties', <Tag className="w-4 h-4" />)}
            {openSections.specialties && (
              <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {sortedAreas.map((area) => (
                  <div key={area} className="flex items-center gap-2 rounded-md px-2 py-1">
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
                    className="cursor-pointer text-xs font-medium text-foreground"
                  >
                    {area}
                  </Label>
                </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
