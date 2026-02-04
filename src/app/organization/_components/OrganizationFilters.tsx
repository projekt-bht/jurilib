'use client';

import { Building, Building2, ChevronDown, Earth, PersonStanding, Tag, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Accessibility as AccessibilityEnum,
  Area as AreasEnum,
  Language as LanguageEnum,
  OrganizationType as OrganizationTypeEnum,
  PriceCategory as PriceCategoryEnum,
} from '~/generated/prisma/enums';
import scale_logo from '~/public/scale_logo.svg';
import CitySearch from './CitySearch';

export type FilterOptions = {
  priceCategory: PriceCategoryEnum[];
  organizationType: OrganizationTypeEnum[];
  area: AreasEnum[];
  languages: LanguageEnum[];
  accessibility: AccessibilityEnum[];
  city: string[];
};

// Union of all filter value enums used in checkbox lists.
export type FilterValue =
  | PriceCategoryEnum
  | OrganizationTypeEnum
  | AreasEnum
  | LanguageEnum
  | AccessibilityEnum;

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

const sectionKeys: Array<keyof FilterOptions> = [
  'organizationType',
  'priceCategory',
  'area',
  'languages',
  'accessibility',
];
const priceCategoryMeta: Record<
  PriceCategoryEnum,
  { label: string; hoverClassName: string; textClassName: string }
> = {
  [PriceCategoryEnum.FREE]: {
    label: 'Kostenlos',
    hoverClassName: 'hover:bg-accent-blue-soft',
    textClassName: 'text-accent-emerald',
  },
  [PriceCategoryEnum.LOW]: {
    label: 'Niedrig (50-100€)',
    hoverClassName: 'hover:bg-accent-blue-soft',
    textClassName: 'text-accent-amber',
  },
  [PriceCategoryEnum.MEDIUM]: {
    label: 'Mittel (101-200€)',
    hoverClassName: 'hover:bg-accent-blue-soft',
    textClassName: 'text-accent-amber',
  },
  [PriceCategoryEnum.HIGH]: {
    label: 'Hoch (über 200€)',
    hoverClassName: 'hover:bg-accent-blue-soft',
    textClassName: 'text-accent-red',
  },
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
  onCityChange,
  onReset,
  activeFilterCount,
}: {
  filters: FilterOptions;
  onFilterChange: (category: keyof FilterOptions, value: FilterValue, isChecked: boolean) => void;
  onCityChange: (value: string[]) => void;
  onReset: () => void;
  activeFilterCount: number;
}) {
  // Track which dropdown is currently open.
  const [openSections, setOpenSections] = useState<Record<keyof FilterOptions, boolean>>({
    organizationType: false,
    priceCategory: false,
    area: false,
    languages: false,
    accessibility: false,
    city: false,
  });
  // UI-only radius slider value (visuals only).
  const [radiusKm, setRadiusKm] = useState(50);
  // Pre-sort enum values once (German locale) so filter lists render consistently.
  const [sortedAreas] = useState(() =>
    [...Object.values(AreasEnum)].sort((a, b) => a.localeCompare(b, 'de'))
  );
  const [sortedLanguages] = useState(() =>
    [...Object.values(LanguageEnum)].sort((a, b) => a.localeCompare(b, 'de'))
  );
  const [sortedAccessibility] = useState(() =>
    [...Object.values(AccessibilityEnum)].sort((a, b) => a.localeCompare(b, 'de'))
  );

  // Delegate checkbox changes to parent filter state.
  const handleCheckboxChange = (
    category: keyof FilterOptions,
    value: FilterValue,
    isChecked: boolean
  ) => onFilterChange(category, value, isChecked);

  // Used for reset button + active badge.
  const isActiveFilters = activeFilterCount > 0;
  const defaultHoverClassName = 'hover:bg-accent-blue-soft cursor-pointer';

  // Reset all filters back to default state.
  const handleResetClick = () => {
    onReset();
  };

  // Filter sections rendered as dropdowns.
  const sections: Array<{
    key: keyof FilterOptions;
    title: string;
    icon: React.ReactNode;
    items?: SectionItem[];
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
      title: 'Preisklasse',
      icon: <Image src={scale_logo} alt="Waage" width={16} height={16} className="h-4 w-4" />,
      items: Object.values(PriceCategoryEnum).map((price) => ({
        value: price,
        label: priceCategoryMeta[price].label,
        hoverClassName: priceCategoryMeta[price].hoverClassName,
        labelClassName: 'cursor-pointer text-xs font-semibold text-foreground',
      })),
    },
    {
      key: 'area',
      title: 'Fachbereich',
      icon: <Tag className="w-4 h-4" />,
      scroll: true,
      items: sortedAreas.map((area) => ({
        value: area,
        label: area.toString().replace(/_/g, ' '),
      })),
    },
    {
      key: 'languages',
      title: 'Sprache',
      icon: <Earth className="w-4 h-4" />,
      scroll: true,
      items: sortedLanguages.map((language) => ({
        value: language,
        label: language
          .toString()
          .toLocaleLowerCase('de')
          .replace(/^./, (char) => char.toLocaleUpperCase('de')),
      })),
    },
    {
      key: 'accessibility',
      title: 'Barrierefreiheit',
      icon: <PersonStanding className="w-4 h-4" />,
      scroll: true,
      items: sortedAccessibility.map((item) => ({
        value: item,
        label: item.toString().replace(/_/g, ' '),
      })),
    },
  ];

  // Lookup map for value -> label to render active filter chips.
  const sectionItemMap = (() => {
    const map = new Map<keyof FilterOptions, Map<string, SectionItem>>();
    sections.forEach((section) => {
      const items = section.groups
        ? section.groups.flatMap((group) => group.items)
        : (section.items ?? []);
      const itemMap = new Map<string, SectionItem>();
      items.forEach((item) => itemMap.set(item.value.toString(), item));
      map.set(section.key, itemMap);
    });
    return map;
  })();

  // Color palette for chips by filter category.
  const chipToneByKey: Record<keyof FilterOptions, { container: string; text: string }> = {
    organizationType: { container: 'bg-purple-50 border-purple-200', text: 'text-purple-700' },
    priceCategory: { container: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
    area: { container: 'bg-orange-50 border-orange-200', text: 'text-orange-700' },
    languages: { container: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
    accessibility: { container: 'bg-gray-50 border-gray-200', text: 'text-gray-700' },
    city: { container: 'bg-gray-50 border-gray-200', text: 'text-gray-700' },
  };

  // Build a flat list of active chips with labels and colors.
  const activeChips = (() => {
    const chips: Array<{
      key: keyof FilterOptions;
      value: string;
      label: string;
      container: string;
      text: string;
    }> = [];

    sectionKeys.forEach((key) => {
      const values = filters[key] as FilterValue[];
      const itemMap = sectionItemMap.get(key);
      values.forEach((value) => {
        const item = itemMap?.get(value.toString());
        chips.push({
          key,
          value: value.toString(),
          label: item?.label ?? value.toString(),
          container: chipToneByKey[key].container,
          text: chipToneByKey[key].text,
        });
      });
    });

    filters.city.forEach((city) => {
      if (!city.trim()) return;
      chips.push({
        key: 'city',
        value: city,
        label: city,
        container: chipToneByKey.city.container,
        text: chipToneByKey.city.text,
      });
    });

    return chips;
  })();

  return (
    <section className="relative w-full rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end">
          <CitySearch value={filters.city} onCityChange={onCityChange} />
          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-500">Radius: {radiusKm} km</div>
            <Slider
              value={[radiusKm]}
              min={0}
              max={50}
              step={1}
              onValueChange={(value) => setRadiusKm(value[0] ?? 50)}
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>0 km</span>
              <span>50 km</span>
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={!isActiveFilters}
            onClick={handleResetClick}
            className="h-10 rounded-xl px-4 text-sm font-semibold"
          >
            Zurücksetzen
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap">
          {sections.map((section) => {
            const selectedCount = (filters[section.key] as FilterValue[]).length;
            return (
              <div key={section.key} className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setOpenSections((prev) => ({
                      ...prev,
                      [section.key]: !prev[section.key],
                    }))
                  }
                  className="flex w-full items-center justify-between gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-400"
                  aria-expanded={openSections[section.key]}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-gray-600">{section.icon}</span>
                    <span>{section.title}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    {selectedCount > 0 && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                        {selectedCount}
                      </span>
                    )}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${openSections[section.key] ? 'rotate-180' : ''}`}
                    />
                  </span>
                </button>

                {openSections[section.key] && (
                  <div className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-full min-w-[220px] rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
                    <div className="max-h-64 space-y-2 overflow-y-auto">
                      {(
                        section.groups ?? [
                          { title: '', key: section.key, items: section.items ?? [] },
                        ]
                      ).map((group) => (
                        <div
                          key={`${section.key}-${group.title || 'default'}`}
                          className="space-y-1.5"
                        >
                          {group.title && (
                            <div className="px-1 text-[11px] font-semibold text-gray-400">
                              {group.title}
                            </div>
                          )}
                          {group.items.map((item) => (
                            <Label
                              key={`${group.key}-${item.value}`}
                              htmlFor={`${group.key}-${item.value}`}
                              className={`flex w-full min-h-9 items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-gray-700 transition-colors cursor-pointer ${
                                item.hoverClassName ?? defaultHoverClassName
                              }`}
                            >
                              <Checkbox
                                id={`${group.key}-${item.value}`}
                                className="border-gray-300 bg-white data-[state=checked]:bg-gray-700 data-[state=checked]:border-gray-700"
                                checked={(filters[group.key] as FilterValue[]).includes(item.value)}
                                onCheckedChange={(isChecked) =>
                                  handleCheckboxChange(group.key, item.value, Boolean(isChecked))
                                }
                                aria-label={`Filter nach ${item.label}`}
                              />
                              {item.icon}
                              <span className={item.labelClassName ?? ''}>{item.label}</span>
                            </Label>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-gray-500">Aktive Filter:</span>
            {activeChips.length === 0 && (
              <span className="text-sm text-gray-400">Keine ausgewählt</span>
            )}
            {activeChips.map((chip) => (
              <span
                key={`${chip.key}-${chip.value}`}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${chip.container} ${chip.text}`}
              >
                {chip.label}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => {
                    if (chip.key === 'city') {
                      onCityChange(filters.city.filter((item) => item !== chip.value));
                      return;
                    }
                    handleCheckboxChange(chip.key, chip.value as FilterValue, false);
                  }}
                  className="h-5 w-5 rounded-full hover:bg-white/70"
                  aria-label={`${chip.label} entfernen`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
