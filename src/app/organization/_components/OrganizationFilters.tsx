'use client';

import {
  Building,
  Building2,
  ChevronDown,
  Earth,
  Filter,
  MapPin,
  PersonStanding,
  Scale,
  Tag,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Accessibility as AccessibilityEnum,
  Area as AreasEnum,
  Language as LanguageEnum,
  OrganizationType as OrganizationTypeEnum,
  PriceCategory as PriceCategoryEnum,
} from '~/generated/prisma/enums';
import { getCityByName } from '@/lib/azureMap';

export type FilterOptions = {
  priceCategory: PriceCategoryEnum[];
  organizationType: OrganizationTypeEnum[];
  area: AreasEnum[];
  languages: LanguageEnum[];
  accessibility: AccessibilityEnum[];
  city: string;
};

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

type CityOption = {
  name: string;
  country: string;
  position: { lat: number; lon: number };
  label: string;
};

type CityInputProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onFocus: () => void;
  onBlur: () => void;
  showClear?: boolean;
  placeholder?: string;
};

function CityInput({
  value,
  onChange,
  onClear,
  onFocus,
  onBlur,
  showClear,
  placeholder,
}: CityInputProps) {
  return (
    <InputGroup className="h-10 rounded-full bg-background px-2 shadow-sm">
      <InputGroupAddon align="inline-start">
        <MapPin className="w-4 h-4" />
      </InputGroupAddon>
      <InputGroupInput
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        className="text-sm font-medium"
      />
      {showClear && value && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-sm" onClick={onClear} aria-label="Stadt löschen">
            <X className="h-3.5 w-3.5" />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
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
  onCityChange: (value: string) => void;
  onReset: () => void;
  activeFilterCount: number;
}) {
  // When landing on the page, the filters should start collapsed.
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  // Helper to open/close all sections at once based on layout size.
  const buildSectionState = (isOpen: boolean) =>
    Object.fromEntries(sectionKeys.map((key) => [key, isOpen]));
  // Start compact: only headers visible until user opens a section (under xl).
  const [openSections, setOpenSections] = useState(() => buildSectionState(false));
  const [isWideLayout, setIsWideLayout] = useState(false);
  // City search: input state + dropdown data for Azure Maps results.
  const [cityInput, setCityInput] = useState(filters.city);
  // City search: list of matching cities for the dropdown.
  const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
  // City search: UI state for loading/error messaging.
  const [isCityLoading, setIsCityLoading] = useState(false);
  const [cityError, setCityError] = useState<string | null>(null);
  // City search: remember last selected label to avoid re-searching after selection.
  const [selectedCityLabel, setSelectedCityLabel] = useState<string | null>(null);
  // City search: controls whether the dropdown is visible.
  const [isCityOpen, setIsCityOpen] = useState(false);
  // Pre-sort enum values once (German locale) so filter lists render consistently without
  // re-sorting on every render.
  const [sortedAreas] = useState(() =>
    [...Object.values(AreasEnum)].sort((a, b) => a.localeCompare(b, 'de'))
  );
  const [sortedLanguages] = useState(() =>
    [...Object.values(LanguageEnum)].sort((a, b) => a.localeCompare(b, 'de'))
  );
  const [sortedAccessibility] = useState(() =>
    [...Object.values(AccessibilityEnum)].sort((a, b) => a.localeCompare(b, 'de'))
  );

  const handleCheckboxChange = (
    category: keyof FilterOptions,
    value: FilterValue,
    isChecked: boolean
  ) => onFilterChange(category, value, isChecked);

  // City search: user picks a city from the dropdown list.
  const handleCitySelect = (option: CityOption) => {
    setCityInput(option.label);
    setCityOptions([]);
    setCityError(null);
    setSelectedCityLabel(option.label);
    setIsCityOpen(false);
    onCityChange(option.name);
  };

  // City search: clear input + reset dropdown + filter state.
  const handleCityClear = () => {
    setCityInput('');
    setCityOptions([]);
    setCityError(null);
    setSelectedCityLabel(null);
    setIsCityOpen(false);
    onCityChange('');
  };

  // City search: typing opens dropdown and resets selection if user edits text.
  const handleCityInputChange = (value: string) => {
    setCityInput(value);
    if (selectedCityLabel && value.trim() !== selectedCityLabel) {
      setSelectedCityLabel(null);
      onCityChange('');
    }
    setIsCityOpen(true);
  };

  // City search: open/close dropdown based on focus.
  const handleCityFocus = () => setIsCityOpen(true);
  const handleCityBlur = () => window.setTimeout(() => setIsCityOpen(false), 150);

  const isActiveFilters = activeFilterCount > 0;
  const defaultHoverClassName = 'hover:bg-accent-blue-soft cursor-pointer';

  // Sync layout with breakpoints: xl opens all sections; below xl collapses.
  // If the grid collapses to a single column (< sm), force-close all sections regardless of prior state.
  useEffect(() => {
    const wideQuery = window.matchMedia('(min-width: 1280px)');
    const multiColumnQuery = window.matchMedia('(min-width: 400px)');
    const syncLayout = () => {
      const isWide = wideQuery.matches;
      const isSingleColumn = !multiColumnQuery.matches;
      setIsWideLayout(isWide);
      if (isSingleColumn) {
        setOpenSections(buildSectionState(false));
        return;
      }
      setOpenSections(buildSectionState(isWide));
    };
    syncLayout();
    wideQuery.addEventListener('change', syncLayout);
    multiColumnQuery.addEventListener('change', syncLayout);
    // Cleanup listener to prevent memory leaks when the component unmounts.
    return () => {
      wideQuery.removeEventListener('change', syncLayout);
      multiColumnQuery.removeEventListener('change', syncLayout);
    };
  }, []);

  // City search: debounce Azure Maps lookup.
  useEffect(() => {
    const query = cityInput.trim();
    if (!query) {
      setCityOptions([]);
      setCityError(null);
      onCityChange('');
      return;
    }
    // If user selected a city and hasn't edited the label, don't refetch.
    if (selectedCityLabel && query === selectedCityLabel) {
      setCityOptions([]);
      setCityError(null);
      return;
    }
    let isActive = true;
    const timeout = window.setTimeout(async () => {
      try {
        setIsCityLoading(true);
        setCityError(null);
        // Azure Maps city lookup (DE only) via helper.
        const results = (await getCityByName(query)) as CityOption[] | undefined;
        if (!isActive) return;
        setCityOptions(results ?? []);
      } catch {
        if (!isActive) return;
        setCityError('Stadt konnte nicht gefunden werden.');
        setCityOptions([]);
      } finally {
        if (isActive) setIsCityLoading(false);
      }
    }, 400);
    return () => {
      isActive = false;
      window.clearTimeout(timeout);
    };
  }, [cityInput, onCityChange]);

  // ESLint: Keep local input in sync on reset without triggering extra effects.
  const handleResetClick = () => {
    setCityInput('');
    setCityOptions([]);
    setCityError(null);
    onReset();
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

  return (
    <section className="group relative w-full rounded-3xl border border-border bg-background hover:border-primary shadow-sm transition-all duration-500 overflow-hidden">
      <div className="relative p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-2">
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-border bg-accent-blue-light p-1.5">
              <Filter className="w-4 h-4 text-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Filter</h3>
              <p className="text-xs text-muted-foreground">
                Durchsuchen Sie alle 6 verfügbaren Rechtsorganisationen
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* City filter stays visible on all breakpoints; grows full-width on small screens. */}
            <div className="relative w-full md:w-72">
              <Label htmlFor="city-filter" className="sr-only">
                Stadt
              </Label>
              <CityInput
                value={cityInput}
                onChange={handleCityInputChange}
                onClear={handleCityClear}
                onFocus={handleCityFocus}
                onBlur={handleCityBlur}
                showClear
                placeholder="Stadt"
              />
              {isCityOpen &&
                (isCityLoading || cityError || cityOptions.length > 0 || cityInput.trim()) && (
                <div className="absolute left-0 right-0 mt-2 rounded-2xl border border-border bg-background shadow-md px-2 py-2 z-20">
                  {isCityLoading && (
                    <div className="px-2 py-1 text-xs text-muted-foreground">Suche…</div>
                  )}
                  {!isCityLoading && cityError && (
                    <div className="px-2 py-1 text-xs text-destructive">{cityError}</div>
                  )}
                  {!isCityLoading && !cityError && (
                    <div className="max-h-52 overflow-y-auto">
                      {cityOptions.map((option) => (
                        <Button
                          key={`${option.name}-${option.position.lat}-${option.position.lon}`}
                          type="button"
                          variant="ghost"
                          onClick={() => handleCitySelect(option)}
                          className="w-full justify-start px-2 py-1 text-left text-sm text-foreground hover:bg-accent-blue-soft"
                        >
                          {option.label}
                        </Button>
                      ))}
                    {cityOptions.length === 0 &&
                      (!selectedCityLabel || cityInput.trim() !== selectedCityLabel) && (
                        <div className="px-2 py-1 text-xs text-muted-foreground">
                          Keine Treffer
                        </div>
                      )}
                  </div>
                )}
              </div>
            )}
          </div>
            {isActiveFilters && (
              <span className="rounded-full border border-border bg-accent-blue-light px-2 py-0.5 text-xs font-semibold text-foreground">
                {activeFilterCount} aktiv
              </span>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!isActiveFilters}
              onClick={handleResetClick}
              className="h-9 rounded-full px-3 gap-1.5 border border-border bg-accent-blue-light text-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary hover:bg-accent-blue-soft disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-wide">Zurücksetzen</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => setIsPanelOpen((prev) => !prev)}
              className="h-11 rounded-full px-4 gap-2 border border-border bg-accent-blue-light text-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary hover:bg-accent-blue-soft cursor-pointer"
              aria-label={isPanelOpen ? 'Filter schließen' : 'Filter öffnen'}
              aria-pressed={isPanelOpen}
            >
              <ChevronDown
                size={22}
                strokeWidth={2.5}
                className={`text-foreground transition-transform duration-200 ${
                  isPanelOpen ? 'rotate-180' : ''
                }`}
              />
              <span className="text-xs font-semibold tracking-wide">
                {isPanelOpen ? 'schließen' : 'öffnen'}
              </span>
            </Button>
          </div>
        </div>

        {isPanelOpen && (
          <div className="mt-4 pb-2">
            {/* Responsive grid: stacks to 1/2/3 cols and only 5 cols at xl. */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 items-start">
              {sections.map((section) => (
                <div
                  key={section.key}
                  // Under xl: box height is compact unless opened. At xl: fixed 320px height.
                  className={`max-h-[320px] rounded-2xl border border-border bg-background px-3 pb-3 pt-2.5 flex flex-col shadow-sm hover:shadow-md transition-all duration-300 ${
                    isWideLayout
                      ? 'sm:h-[320px]'
                      : openSections[section.key]
                        ? 'sm:h-[320px]'
                        : 'h-auto'
                  }`}
                >
                  {/* At xl: static header (no accordion). Below xl: header toggles open/closed. */}
                  {isWideLayout ? (
                    <div className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5">
                      <span className="rounded-md bg-accent-blue-light p-1 text-foreground">
                        {section.icon}
                      </span>
                      <span className="text-xs font-semibold text-foreground">{section.title}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setOpenSections((prev) => ({
                          ...prev,
                          [section.key]: !prev[section.key],
                        }))
                      }
                      className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left"
                      aria-expanded={openSections[section.key]}
                    >
                      <span className="flex items-center gap-2">
                        <span className="rounded-md bg-accent-blue-light p-1 text-foreground">
                          {section.icon}
                        </span>
                        <span className="text-xs font-semibold text-foreground">
                          {section.title}
                        </span>
                      </span>
                      <ChevronDown
                        size={18}
                        strokeWidth={2.5}
                        className={`text-foreground transition-transform duration-200 ${
                          openSections[section.key] ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  )}
                  <div
                    // Below xl: hide content when collapsed; when open, height is 320px and scrolls.
                    // At xl: content always visible.
                    className={`mt-2 space-y-3 flex-1 min-h-0 ${
                      openSections[section.key] ? 'block' : 'hidden'
                    } xl:block ${!isWideLayout || section.scroll ? 'overflow-y-auto pr-1' : ''}`}
                  >
                    {(
                      section.groups ?? [{ title: '', key: section.key, items: section.items }]
                    ).map((group) => (
                      <div
                        key={`${section.key}-${group.title || 'default'}`}
                        className="space-y-1.5"
                      >
                        {group.title && (
                          <div className="px-2 text-[11px] font-semibold text-muted-foreground">
                            {group.title}
                          </div>
                        )}
                        {group.items.map((item) => (
                          // Each filter option is wrapped in a full-width label so the entire row
                          // is clickable; the checkbox is controlled via state and toggles the
                          // selected filter value on click.
                          <Label
                            key={`${group.key}-${item.value}`}
                            htmlFor={`${group.key}-${item.value}`}
                            className={`flex w-full min-h-9 items-center gap-2 rounded-md px-2 py-1 transition-colors cursor-pointer ${
                              item.hoverClassName ?? defaultHoverClassName
                            }`}
                          >
                            <Checkbox
                              id={`${group.key}-${item.value}`}
                              className="border-accent-gray bg-background hover:border-foreground data-[state=checked]:bg-accent-blue data-[state=checked]:border-accent-blue"
                              checked={(filters[group.key] as FilterValue[]).includes(item.value)}
                              onCheckedChange={(isChecked) =>
                                handleCheckboxChange(group.key, item.value, Boolean(isChecked))
                              }
                              aria-label={`Filter nach ${item.label}`}
                            />
                            {item.icon}
                            <span
                              className={`text-xs font-medium text-foreground ${
                                item.labelClassName ?? ''
                              }`}
                            >
                              {item.label}
                            </span>
                          </Label>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
