'use client';

import {
  Building,
  Building2,
  ChevronDown,
  Earth,
  PersonStanding,
  Scale,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Accessibility as AccessibilityEnum,
  Area as AreasEnum,
  Language as LanguageEnum,
  OrganizationType as OrganizationTypeEnum,
  PriceCategory as PriceCategoryEnum,
} from '~/generated/prisma/enums';

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

type NearbyCity = {
  name: string;
  label: string;
};

const sectionKeys: Array<keyof FilterOptions> = [
  'organizationType',
  'priceCategory',
  'area',
  'languages',
  'accessibility',
  // City counts as an active filter for "Keine ausgewählt" logic, but has no chip.
  'city',
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
  // Nearby cities are only available after a base city search; keep empty by default.
  const [nearbyCities, setNearbyCities] = useState<NearbyCity[]>([]);
  // Forces CitySearch to remount when the city filter is cleared externally.
  const [citySearchKey, setCitySearchKey] = useState(0);
  const [isRadiusOpen, setIsRadiusOpen] = useState(false);

  const toggleSection = (key: keyof FilterOptions) => {
    setOpenSections((prev) => {
      const nextState = Object.keys(prev).reduce(
        (acc, itemKey) => {
          const typedKey = itemKey as keyof FilterOptions;
          acc[typedKey] = typedKey === key ? !prev[typedKey] : false;
          return acc;
        },
        {} as Record<keyof FilterOptions, boolean>
      );
      return nextState;
    });
  };

  const closeAllSections = () => {
    setOpenSections({
      organizationType: false,
      priceCategory: false,
      area: false,
      languages: false,
      accessibility: false,
      city: false,
    });
    setIsRadiusOpen(false);
  };
  // Toggle city selection is for the nearby city filter
  const toggleCity = (cityName: string) => {
    const next = filters.city.includes(cityName)
      ? filters.city.filter((item) => item !== cityName)
      : [...filters.city, cityName];
    onCityChange(next);
    if (next.length === 0 && filters.city.length > 0) {
      setCitySearchKey((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('[data-organization-filters-popover]')) return;
      closeAllSections();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, []);
  // Radius slider value (used for nearby city search).
  const [radiusKm, setRadiusKm] = useState(0);
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
    setCitySearchKey((prev) => prev + 1);
    setNearbyCities([]);
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
      icon: <Scale className="w-4 h-4" />,
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
    organizationType: {
      container: 'bg-accent-purple-light border-accent-purple',
      text: 'text-accent-purple',
    },
    priceCategory: {
      container: 'bg-accent-emerald-light border-accent-emerald',
      text: 'text-accent-emerald',
    },
    area: {
      container: 'bg-accent-amber-light border-accent-amber',
      text: 'text-accent-amber',
    },
    languages: {
      container: 'bg-accent-blue-light border-accent-blue',
      text: 'text-accent-blue',
    },
    accessibility: {
      container: 'bg-accent-gray-soft border-accent-gray-light',
      text: 'text-foreground',
    },
    city: {
      container: 'bg-accent-gray-light border-accent-gray',
      text: 'text-accent-gray',
    },
  };

  const iconToneByKey: Record<keyof FilterOptions, string> = {
    organizationType: chipToneByKey.organizationType.text,
    priceCategory: chipToneByKey.priceCategory.text,
    area: chipToneByKey.area.text,
    languages: chipToneByKey.languages.text,
    accessibility: chipToneByKey.accessibility.text,
    city: chipToneByKey.city.text,
  };

  // Build a flat list of active chips with labels and colors (exclude city chips).
  const activeChips = (() => {
    const chips: Array<{
      key: keyof FilterOptions;
      value: string;
      label: string;
      container: string;
      text: string;
    }> = [];

    sectionKeys.forEach((key) => {
      // City is handled separately: it affects the "active" state but doesn't render a chip.
      if (key === 'city') return;
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

    return chips;
  })();

  // City still marks filters as active even without chips.
  const hasActiveCity = filters.city.length > 0;
  const hasActiveNonCityFilters = activeChips.length > 0;

  return (
    <section
      data-organization-filters
      className="relative w-full rounded-2xl border border-border bg-background shadow-sm"
    >
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end">
          <CitySearch
            key={`city-search-${citySearchKey}`}
            value={filters.city}
            onCityChange={onCityChange}
            onNearbyChange={(cities) =>
              setNearbyCities(cities.map((city) => ({ name: city.name, label: city.label })))
            }
            radiusKm={radiusKm}
            onRadiusChange={setRadiusKm}
            radiusOpen={isRadiusOpen}
            onRadiusOpenChange={setIsRadiusOpen}
            nearbyCities={nearbyCities}
            selectedCities={filters.city}
            onToggleCity={toggleCity}
          />
        </div>

        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 md:flex md:flex-wrap">
          {sections.map((section) => {
            const selectedCount = (filters[section.key] as FilterValue[]).length;
            return (
              <div key={section.key} className="relative">
                <button
                  type="button"
                  onClick={() => toggleSection(section.key)}
                  className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-accent-gray"
                  aria-expanded={openSections[section.key]}
                >
                  <span className="flex items-center gap-2">
                    <span className={iconToneByKey[section.key]}>{section.icon}</span>
                    <span>{section.title}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span
                      className={`min-w-[2rem] rounded-full bg-accent-gray-soft px-2 py-0.5 text-center text-xs font-semibold text-accent-gray ${
                        selectedCount > 0 ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {selectedCount}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${openSections[section.key] ? 'rotate-180' : ''}`}
                    />
                  </span>
                </button>

                {openSections[section.key] && (
                  <div
                    className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-full min-w-[220px] rounded-xl border border-border bg-background p-3 shadow-lg"
                    data-organization-filters-popover
                  >
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
                            <div className="px-1 text-[11px] font-semibold text-muted-foreground">
                              {group.title}
                            </div>
                          )}
                          {group.items.map((item) => (
                            <Label
                              key={`${group.key}-${item.value}`}
                              htmlFor={`${group.key}-${item.value}`}
                              className={`flex w-full min-h-9 items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-foreground transition-colors cursor-pointer ${
                                item.hoverClassName ?? defaultHoverClassName
                              }`}
                            >
                              <Checkbox
                                id={`${group.key}-${item.value}`}
                                className="border-accent-gray bg-accent-white data-[state=checked]:bg-primary data-[state=checked]:border-primary"
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

        <div className="border-t border-border pt-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-muted-foreground">Aktive Filter:</span>
            {isActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetClick}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent-gray-soft"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Zurücksetzen
              </Button>
            )}
            {/* "Keine ausgewählt" only when no filters are active, including city. */}
            {!hasActiveNonCityFilters && !hasActiveCity && (
              <span className="text-sm text-muted-foreground">Keine ausgewählt</span>
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
                      const nextCities = filters.city.filter((item) => item !== chip.value);
                      onCityChange(nextCities);
                      if (nextCities.length === 0) {
                        setCitySearchKey((prev) => prev + 1);
                      }
                      return;
                    }
                    handleCheckboxChange(chip.key, chip.value as FilterValue, false);
                  }}
                  className="h-5 w-5 rounded-full hover:bg-accent-gray-soft"
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
