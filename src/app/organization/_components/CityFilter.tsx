'use client';

import { MapPin, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { getCityByName, getCityByRadius } from '@/lib/azureMap';

type CityOption = {
  name: string;
  country: string;
  position: { lat: number; lon: number };
  label: string;
};

type CityInputProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onFocus: () => void;
  onBlur: () => void;
  showClear?: boolean;
  placeholder?: string;
};

function CityInput({
  id,
  value,
  onChange,
  onClear,
  onFocus,
  onBlur,
  showClear,
  placeholder,
  showIcon = true,
}: CityInputProps & { showIcon?: boolean }) {
  return (
    <InputGroup className="h-9 rounded-2xl bg-background px-1 shadow-sm">
      {showIcon && (
        <InputGroupAddon align="inline-start" className="pl-2 text-foreground/70">
          <MapPin className="w-3.5 h-3.5" />
        </InputGroupAddon>
      )}
      <InputGroupInput
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        title={value}
        className="text-[13px] font-semibold tracking-tight pr-1"
      />
      {showClear && value && (
        <InputGroupAddon align="inline-end" className="pr-2">
          <InputGroupButton size="icon-xs" onClick={onClear} aria-label="Stadt löschen">
            <X className="h-3.5 w-3.5" />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}

export function CityFilter({
  value,
  onCityChange,
}: {
  value: string[];
  onCityChange: (value: string[]) => void;
}) {
  const [cityInput, setCityInput] = useState(value[0] ?? '');
  const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
  const [isCityLoading, setIsCityLoading] = useState(false);
  const [cityError, setCityError] = useState<string | null>(null);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [baseCity, setBaseCity] = useState<CityOption | null>(null);
  const [radiusOptions, setRadiusOptions] = useState<CityOption[]>([]);
  const [isRadiusLoading, setIsRadiusLoading] = useState(false);
  const [radiusError, setRadiusError] = useState<string | null>(null);

  const hasCityError = Boolean(cityError);
  const hasCityQuery = cityInput.trim().length > 0;
  const isAllSelected =
    radiusOptions.length > 0 && radiusOptions.every((option) => value.includes(option.name));

  const handleCitySelect = (option: CityOption) => {
    setCityInput(option.label);
    setCityOptions([]);
    setCityError(null);
    setIsCityOpen(false);
    setBaseCity(option);
    onCityChange([option.name]);
  };

  const handleCityClear = () => {
    setCityInput('');
    setCityOptions([]);
    setCityError(null);
    setIsCityOpen(false);
    setBaseCity(null);
    setRadiusOptions([]);
    setRadiusError(null);
    setIsRadiusLoading(false);
    onCityChange([]);
  };

  const handleCityInputChange = (input: string) => {
    setCityInput(input);
    if (!input.trim()) {
      setBaseCity(null);
      setRadiusOptions([]);
      setRadiusError(null);
      setIsRadiusLoading(false);
      onCityChange([]);
    }
    setIsCityOpen(true);
  };

  const handleCityFocus = () => setIsCityOpen(true);
  const handleCityBlur = () => window.setTimeout(() => setIsCityOpen(false), 150);

  const handleRadiusToggle = (name: string, isChecked: boolean) => {
    const next = isChecked ? [...value, name] : value.filter((item) => item !== name);
    onCityChange(next);
  };

  const handleSelectAll = (isChecked: boolean) => {
    onCityChange(isChecked ? radiusOptions.map((option) => option.name) : []);
  };

  useEffect(() => {
    const query = cityInput.trim();
    if (!query) {
      setCityOptions([]);
      setCityError(null);
      return;
    }
    let isActive = true;
    const timeout = window.setTimeout(async () => {
      try {
        setIsCityLoading(true);
        setCityError(null);
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
  }, [cityInput]);

  useEffect(() => {
    if (!baseCity) {
      setRadiusOptions([]);
      setRadiusError(null);
      setIsRadiusLoading(false);
      return;
    }
    let isActive = true;
    const fetchRadius = async () => {
      try {
        setIsRadiusLoading(true);
        setRadiusError(null);
        const results = (await getCityByRadius(
          baseCity.position.lat,
          baseCity.position.lon,
          baseCity.name
        )) as CityOption[] | undefined;
        if (!isActive) return;
        const merged = results ?? [];
        const hasBase = merged.some(
          (option) =>
            option.name === baseCity.name &&
            option.position.lat === baseCity.position.lat &&
            option.position.lon === baseCity.position.lon
        );
        setRadiusOptions(hasBase ? merged : [baseCity, ...merged]);
      } catch {
        if (!isActive) return;
        setRadiusError('Umkreissuche fehlgeschlagen.');
        setRadiusOptions([]);
      } finally {
        if (isActive) setIsRadiusLoading(false);
      }
    };
    fetchRadius();
    return () => {
      isActive = false;
    };
  }, [baseCity]);

  useEffect(() => {
    if (value.length) return;
    setCityInput('');
    setCityOptions([]);
    setCityError(null);
    setIsCityOpen(false);
    setBaseCity(null);
    setRadiusOptions([]);
    setRadiusError(null);
    setIsRadiusLoading(false);
  }, [value]);

  return (
    <div className="relative w-full rounded-2xl border border-border bg-background px-3 py-2 shadow-sm">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="w-full sm:w-2/5">
            <Label htmlFor="city-filter" className="sr-only">
              Stadt
            </Label>
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-accent-blue-light p-1 text-foreground">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <CityInput
                  id="city-filter"
                  showIcon={false}
                  value={cityInput}
                  onChange={handleCityInputChange}
                  onClear={handleCityClear}
                  onFocus={handleCityFocus}
                  onBlur={handleCityBlur}
                  showClear
                  placeholder="Stadt suchen"
                />
              </div>
            </div>
            {isCityOpen &&
              (isCityLoading || hasCityError || cityOptions.length > 0 || hasCityQuery) && (
                <div className="mt-2 rounded-2xl border border-border bg-background shadow-md px-2 py-2">
                  {isCityLoading && (
                    <div className="px-2 py-1 text-xs text-muted-foreground">Suche…</div>
                  )}
                  {!isCityLoading && hasCityError && (
                    <div className="px-2 py-1 text-xs text-destructive">{cityError}</div>
                  )}
                  {!isCityLoading && !hasCityError && (
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
                      {hasCityQuery && cityOptions.length === 0 && (
                        <div className="px-2 py-1 text-xs text-muted-foreground">Keine Treffer</div>
                      )}
                    </div>
                  )}
                </div>
              )}
          </div>
          <div className="w-full sm:w-3/5">
            {baseCity && (
              <div>
                <Label htmlFor="radius-city-filter" className="sr-only">
                  Umkreis
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-muted-foreground whitespace-nowrap">
                    Umkreis
                  </span>
                  <Label
                    htmlFor="radius-select-all"
                    className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground"
                  >
                    <Checkbox
                      id="radius-select-all"
                      className="border-accent-gray bg-background hover:border-foreground data-[state=checked]:bg-accent-blue data-[state=checked]:border-accent-blue"
                      checked={isAllSelected}
                      onCheckedChange={(isChecked) => handleSelectAll(Boolean(isChecked))}
                      aria-label="Alle Umkreisstädte auswählen"
                    />
                    Alle
                  </Label>
                </div>
                {isRadiusLoading && (
                  <div className="mt-2 text-xs text-muted-foreground">Suche Umkreis…</div>
                )}
                {!isRadiusLoading && radiusOptions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {radiusOptions.map((option) => (
                      <Label
                        key={`${option.name}-${option.position.lat}`}
                        htmlFor={`radius-city-${option.name}-${option.position.lat}`}
                        className="flex items-center gap-2 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-foreground"
                      >
                        <Checkbox
                          id={`radius-city-${option.name}-${option.position.lat}`}
                          className="border-accent-gray bg-background hover:border-foreground data-[state=checked]:bg-accent-blue data-[state=checked]:border-accent-blue"
                          checked={value.includes(option.name)}
                          onCheckedChange={(isChecked) =>
                            handleRadiusToggle(option.name, Boolean(isChecked))
                          }
                          aria-label={`Umkreisstadt ${option.label}`}
                        />
                        <span className="whitespace-normal break-words">{option.label}</span>
                      </Label>
                    ))}
                  </div>
                )}
                {!isRadiusLoading && radiusOptions.length === 0 && (
                  <div className="mt-2 text-xs text-muted-foreground">Keine Umkreisstädte.</div>
                )}
                {radiusError && <div className="mt-1 text-xs text-destructive">{radiusError}</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
