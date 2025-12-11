'use client';

import { Building2, ChevronDown, Filter, SlidersHorizontal, Users, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

const priceCategoryLabels: Record<PriceCategoryEnum, string> = {
  [PriceCategoryEnum.FREE]: 'Kostenfrei',
  [PriceCategoryEnum.LOW]: 'Niedrig (50-100€)',
  [PriceCategoryEnum.MEDIUM]: 'Mittel (100-200€)',
  [PriceCategoryEnum.HIGH]: 'Hoch (200€+)',
};

const organizationTypeMeta: Record<
  OrganizationTypeEnum,
  { label: string; icon: React.ReactNode }
> = {
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
  const [openSections, setOpenSections] = useState<Record<keyof FilterOptions, boolean>>(
    collapsibleDefaults,
  );

  const toggleSection = (section: keyof FilterOptions) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const renderSectionHeader = (title: string, section: keyof FilterOptions) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="flex w-full items-center justify-between rounded-xl px-3 py-2 hover:bg-accent-gray/10 transition-colors"
    >
      <span className="text-sm font-semibold text-foreground">{title}</span>
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
    checked: boolean,
  ) => {
    onFilterChange(category, value, checked);
  };

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <aside className="lg:w-[320px] w-full self-start lg:sticky lg:top-24 space-y-4">
      <div className="rounded-2xl border border-border bg-background shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2">
              <Filter className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">Filter</span>
              <span className="text-xs text-muted-foreground">
                Wähle aus Preis, Typ und Fachgebiet
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground bg-primary/10 text-primary px-2 py-1 rounded-full">
              {activeFilterCount} aktiv
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!hasActiveFilters}
              onClick={onReset}
              className="h-8 px-2 text-xs font-semibold"
            >
              <X className="w-4 h-4" />
              Zurücksetzen
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="rounded-xl border border-border/80">
            {renderSectionHeader('Preisniveau', 'priceCategory')}
            {openSections.priceCategory && (
              <div className="px-3 pb-3 space-y-2">
                {Object.values(PriceCategoryEnum).map((price) => (
                  <label
                    key={price}
                    className="flex items-center justify-between rounded-lg border border-border/70 bg-background px-3 py-2 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={filters.priceCategory.includes(price)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange('priceCategory', price, Boolean(checked))
                        }
                        aria-label={`Filter nach ${priceCategoryLabels[price]}`}
                      />
                      <span className="text-sm text-foreground font-medium">
                        {priceCategoryLabels[price]}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border/80">
            {renderSectionHeader('Organisationstyp', 'organizationType')}
            {openSections.organizationType && (
              <div className="px-3 pb-3 space-y-2">
                {Object.values(OrganizationTypeEnum).map((type) => (
                  <label
                    key={type}
                    className="flex items-center justify-between rounded-lg border border-border/70 bg-background px-3 py-2 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={filters.organizationType.includes(type)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange('organizationType', type, Boolean(checked))
                        }
                        aria-label={`Filter nach ${organizationTypeMeta[type].label}`}
                      />
                      <span className="inline-flex items-center gap-2 text-sm text-foreground font-medium">
                        {organizationTypeMeta[type].icon}
                        {organizationTypeMeta[type].label}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border/80">
            {renderSectionHeader('Fachgebiete', 'specialties')}
            {openSections.specialties && (
              <div className="px-3 pb-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground pb-1">
                  <SlidersHorizontal className="w-3 h-3" />
                  Mehrfachauswahl möglich
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                  {Object.values(AreasEnum).map((area) => (
                    <label
                      key={area}
                      className="flex items-center gap-3 rounded-lg border border-border/70 bg-background px-3 py-2 hover:border-primary/40 transition-colors"
                    >
                      <Checkbox
                        checked={filters.specialties.includes(area)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange('specialties', area, Boolean(checked))
                        }
                        aria-label={`Filter nach ${area}`}
                      />
                      <span className="text-sm text-foreground font-medium">{area}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
