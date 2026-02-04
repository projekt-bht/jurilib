'use client';

import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { getCityByName, getCityByRadius } from '@/lib/azureMap';
import { Search } from 'lucide-react';

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

export default function CitySearch({ value, onCityChange, onNearbyChange }: CitySearchProps) {
  // Local input and result state for the city search flow.
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [selected, setSelected] = useState<City | null>(null);

  useEffect(() => {
    if (query.length < 2 || selected) {
      setCities([]);
      return;
    }
    // Debounce remote search requests while typing.
    const t = setTimeout(async () => setCities((await getCityByName(query)) || []), 300);
    return () => clearTimeout(t);
  }, [query, selected]);

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

  useEffect(() => {
    if (value.length) return;
    // Reset local UI when the parent filter clears the city selection.
    setQuery('');
    setCities([]);
    setSelected(null);
    onNearbyChange?.([]);
  }, [value.length]);

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
