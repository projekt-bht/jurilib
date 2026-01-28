'use client';

import {
  Building,
  Building2,
  ChevronDown,
  Filter,
  Scale,
  Tag,
  X,
  PersonStanding,
  Earth,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type {
  Accessibility,
  Area,
  Language,
  OrganizationType,
  PriceCategory,
  PricingModel,
} from '~/generated/prisma/enums';
import {
  Accessibility as AccessibilityEnum,
  Area as AreasEnum,
  Language as LanguageEnum,
  OrganizationType as OrganizationTypeEnum,
  PriceCategory as PriceCategoryEnum,
  PricingModel as PricingModelEnum,
} from '~/generated/prisma/enums';

export type FilterOptions = {
  priceCategory: PriceCategory[];
  organizationType: OrganizationType[];
  area: Area[];
  languages: Language[];
  accessibility: Accessibility[];
  pricingModel: PricingModel[];
};

type FilterValue =
  | PriceCategory
  | OrganizationType
  | Area
  | Language
  | Accessibility
  | PricingModel;

const priceCategoryMeta: Record<PriceCategoryEnum, { label: string; hoverClassName: string }> = {
  [PriceCategoryEnum.FREE]: {
    label: 'Kostenlos',
    hoverClassName: 'hover:bg-accent-emerald-soft',
  },
  [PriceCategoryEnum.LOW]: { label: '€ - Niedrig', hoverClassName: 'hover:bg-accent-amber-soft' },
  [PriceCategoryEnum.MEDIUM]: {
    label: '€€ - Mittel',
    hoverClassName: 'hover:bg-accent-amber-light',
  },
  [PriceCategoryEnum.HIGH]: { label: '€€€ - Hoch', hoverClassName: 'hover:bg-accent-red/10' },
};

const organizationTypeMeta: Record<OrganizationTypeEnum, { label: string; icon: React.ReactNode }> =
  {
    [OrganizationTypeEnum.LAW_FIRM]: {
      label: 'Kanzlei',
      icon: <Building className="w-3.5 h-3.5" />,
    },
    [OrganizationTypeEnum.ASSOCIATION]: {
      label: 'Verein',
      icon: <Building2 className="w-3.5 h-3.5" />,
    },
  };

export function OrganizationFilters({
  filters,
  onFilterChange,
  onReset,
  activeFilterCount,
}: {
  filters: FilterOptions;
  onFilterChange: (category: keyof FilterOptions, value: FilterValue, isChecked: boolean) => void;
  onReset: () => void;
  activeFilterCount: number;
}) {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  // RM: Pre-sort enum values once (German locale) so filter lists render consistently without
  // RM: re-sorting on every render.
  const [sortedAreas] = useState(() =>
    [...Object.values(AreasEnum)].sort((a, b) => a.localeCompare(b, 'de'))
  );
  const [sortedLanguages] = useState(() =>
    [...Object.values(LanguageEnum)].sort((a, b) => a.localeCompare(b, 'de'))
  );
  const [sortedAccessibility] = useState(() =>
    [...Object.values(AccessibilityEnum)].sort((a, b) => a.localeCompare(b, 'de'))
  );
  const [sortedPricingModel] = useState(() =>
    [...Object.values(PricingModelEnum)].sort((a, b) => a.localeCompare(b, 'de'))
  );

  const handleCheckboxChange = (
    category: keyof FilterOptions,
    value: FilterValue,
    isChecked: boolean
  ) => onFilterChange(category, value, isChecked);

  const isActiveFilters = activeFilterCount > 0;
  const defaultHoverClassName = 'hover:bg-accent-gray-soft';

  type SectionItem = {
    value: FilterValue;
    label: string;
    icon?: React.ReactNode;
    hoverClassName?: string;
    labelClassName?: string;
  };
  type SectionGroup = {
    title: string;
    key: keyof FilterOptions;
    items: SectionItem[];
  };

  const sections: Array<{
    key: keyof FilterOptions;
    title: string;
    icon: React.ReactNode;
    items: SectionItem[];
    scroll?: boolean;
    groups?: SectionGroup[];
  }> = [
    {
      key: 'organizationType',
      title: 'Organisationstyp',
      icon: <Building2 className="w-4 h-4" />,
      items: Object.values(OrganizationTypeEnum).map((type) => ({
        value: type,
        label: organizationTypeMeta[type].label,
        icon: organizationTypeMeta[type].icon,
      })),
    },
    {
      key: 'priceCategory',
      title: 'Preis',
      icon: <Scale className="w-4 h-4" />,
      items: [],
      groups: [
        {
          title: 'Preisklasse',
          key: 'priceCategory',
          items: Object.values(PriceCategoryEnum).map((price) => ({
            value: price,
            label: priceCategoryMeta[price].label,
            hoverClassName: priceCategoryMeta[price].hoverClassName,
            labelClassName: 'cursor-pointer text-xs font-semibold text-foreground',
          })),
        },
        {
          title: 'Preismodell',
          key: 'pricingModel',
          items: sortedPricingModel.map((item) => ({ value: item, label: item })),
        },
      ],
    },
    {
      key: 'area',
      title: 'Fachbereich',
      icon: <Tag className="w-4 h-4" />,
      scroll: true,
      items: sortedAreas.map((area) => ({ value: area, label: area })),
    },
    {
      key: 'languages',
      title: 'Sprache',
      icon: <Earth className="w-4 h-4" />,
      scroll: true,
      items: sortedLanguages.map((language) => ({ value: language, label: language })),
    },
    {
      key: 'accessibility',
      title: 'Barrierefreiheit',
      icon: <PersonStanding className="w-4 h-4" />,
      scroll: true,
      items: sortedAccessibility.map((item) => ({ value: item, label: item })),
    },
  ];

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
        <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3 xl:grid-cols-5 items-stretch">
          {sections.map((section) => (
            <div
              key={section.key}
              className="rounded-lg border border-border bg-background px-2.5 pb-2.5 pt-2 flex flex-col h-[360px]"
            >
              <div className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5">
                <span className="text-muted-foreground">{section.icon}</span>
                <span className="text-xs font-semibold text-foreground">{section.title}</span>
              </div>
              <div
                className={`mt-2 space-y-3 flex-1 min-h-0 ${
                  section.scroll ? 'overflow-y-auto pr-1' : ''
                }`}
              >
                {(section.groups ?? [{ title: '', key: section.key, items: section.items }]).map(
                  (group) => (
                    <div key={`${section.key}-${group.title || 'default'}`} className="space-y-1.5">
                      {group.title && (
                        <div className="px-2 text-[11px] font-semibold text-muted-foreground">
                          {group.title}
                        </div>
                      )}
                      {group.items.map((item) => (
                        <div
                          key={`${group.key}-${item.value}`}
                          className={`flex w-full min-h-9 items-center gap-2 rounded-md px-2 py-1 transition-colors ${
                            item.hoverClassName ?? defaultHoverClassName
                          }`}
                        >
                          <Checkbox
                            id={`${group.key}-${item.value}`}
                            checked={(filters[group.key] as FilterValue[]).includes(item.value)}
                            onCheckedChange={(isChecked) =>
                              handleCheckboxChange(group.key, item.value, Boolean(isChecked))
                            }
                            aria-label={`Filter nach ${item.label}`}
                          />
                          <Label
                            htmlFor={`${group.key}-${item.value}`}
                            className={
                              item.labelClassName ??
                              'inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-foreground'
                            }
                          >
                            {item.icon}
                            {item.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
