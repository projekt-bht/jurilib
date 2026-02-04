'use client';

import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getCityByName, getCityByRadius } from '@/lib/azureMap';

interface City {
  name: string;
  country: string;
  position: { lat: number; lon: number };
  label: string;
}

type CitySearchProps = {
  value: string[];
  onCityChange: (value: string[]) => void;
  onNearbyChange?: (value: City[]) => void;
  radiusKm: number;
  onRadiusChange: (value: number) => void;
  radiusOpen: boolean;
  onRadiusOpenChange: (value: boolean) => void;
};

export default function CitySearch({
  value: _value,
  onCityChange,
  onNearbyChange,
  radiusKm,
  onRadiusChange,
  radiusOpen,
  onRadiusOpenChange,
}: CitySearchProps) {
  // Local input and result state for the city search flow.
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [selected, setSelected] = useState<City | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const radiusOptionsKm = [0, 5, 10, 15, 20, 25, 30, 40, 50];

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const runRadiusSearch = async (city: City, radiusInKm: number) => {
    const radiusMeters = Math.max(radiusInKm, 0) * 1000;
    const res = await getCityByRadius(city.position.lat, city.position.lon, radiusMeters);
    const filtered = (res || []).filter((c: City) => c.label !== city.label);
    onNearbyChange?.(filtered);
    const nextCityNames = [city.name, ...filtered.map((item) => item.name)].filter((name) =>
      name.trim()
    );
    onCityChange(Array.from(new Set(nextCityNames)));
  };

  const select = async (city: City) => {
    // Selecting a base city triggers the radius search and initializes the filter values.
    setSelected(city);
    setCities([]);
    setQuery(city.label);
    await runRadiusSearch(city, radiusKm);
  };

  useEffect(() => {
    if (!selected) return;
    void runRadiusSearch(selected, radiusKm);
  }, [radiusKm, selected]);

  const scheduleSearch = (nextQuery: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (nextQuery.trim().length < 2) {
      setCities([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      const results = (await getCityByName(nextQuery)) ?? [];
      setCities(results);
    }, 300);
  };

  return (
    <div className="w-full">
      <div className="relative">
        <div className="flex h-11 items-center gap-2 rounded-xl border border-accent-gray bg-background px-2 text-sm text-foreground focus-within:border-accent-black">
          <Search className="h-4 w-4 text-accent-gray" />
          <Input
            value={query}
            onChange={(event) => {
              const next = event.target.value;
              setQuery(next);
              if (selected) {
                setSelected(null);
                onCityChange([]);
                onNearbyChange?.([]);
              }
              scheduleSearch(next);
            }}
            placeholder="Stadt suchen"
            className="h-9 flex-1 border-0 bg-transparent px-0 text-sm text-foreground shadow-none focus-visible:border-0 focus-visible:ring-0"
          />
          <div className="h-6 w-px bg-accent-gray-light" />
          <Select
            value={radiusKm.toString()}
            onValueChange={(value) => onRadiusChange(Number.parseInt(value, 10))}
            open={radiusOpen}
            onOpenChange={onRadiusOpenChange}
          >
            <SelectTrigger className="h-9 border-0 bg-transparent px-2 text-sm shadow-none focus-visible:ring-0">
              <SelectValue placeholder="Radius" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              side="bottom"
              align="end"
              className="rounded-xl border border-border bg-background p-1 shadow-lg"
              data-organization-filters-popover
            >
              {radiusOptionsKm.map((option) => (
                <SelectItem
                  key={option}
                  value={option.toString()}
                  className="flex w-full min-h-9 items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-foreground transition-colors cursor-pointer hover:bg-accent-blue-soft focus:bg-accent-blue-soft"
                >
                  {option} km
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {cities.length > 0 && (
          <Command className="h-auto absolute left-0 right-0 z-20 border border-accent-gray rounded-xl shadow-lg bg-background">
            <CommandList>
              <CommandEmpty>Keine Treffer gefunden</CommandEmpty>
              <CommandGroup>
                {cities.map((city) => (
                  <CommandItem
                    key={city.position.lat + city.position.lon}
                    onSelect={() => select(city)}
                  >
                    {city.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </div>
    </div>
  );
}
