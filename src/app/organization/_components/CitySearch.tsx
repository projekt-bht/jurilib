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
};

export default function CitySearch({ value: _value, onCityChange, onNearbyChange }: CitySearchProps) {
  // Local input and result state for the city search flow.
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [selected, setSelected] = useState<City | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const select = async (city: City) => {
    // Selecting a base city triggers the radius search and initializes the filter values.
    setSelected(city);
    setCities([]);
    setQuery(city.label);
    const res = await getCityByRadius(city.position.lat, city.position.lon);
    const filtered = (res || []).filter((c: City) => c.label !== city.label);
    onNearbyChange?.(filtered);
    onCityChange([city.name]);
  };

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
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-gray" />
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
          className="h-11 rounded-xl border-accent-gray bg-background pl-10 text-sm text-foreground focus-visible:border-accent-black focus-visible:ring-accent-gray-light"
        />
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
