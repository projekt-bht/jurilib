'use client';

import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
};

export default function CitySearch({ value, onCityChange }: CitySearchProps) {
  // Local input and result state for the city search flow.
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [nearby, setNearby] = useState<City[]>([]);
  const [selected, setSelected] = useState<City | null>(null);
  const [checked, setChecked] = useState<City[]>([]);

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
    setNearby((res || []).filter((c: City) => c.label !== city.label));
    setChecked([]);
    onCityChange([city.name]);
  };

  const toggle = (city: City) => {
    // Toggling nearby cities updates the parent filter with base + radius selections.
    setChecked((prev) => {
      const next = prev.find((c) => c.label === city.label)
        ? prev.filter((c) => c.label !== city.label)
        : [...prev, city];
      const base = selected ? [selected.name] : [];
      const nextValues = [...base, ...next.map((item) => item.name)];
      onCityChange(nextValues);
      return next;
    });
  };

  useEffect(() => {
    if (value.length) return;
    // Reset local UI when the parent filter clears the city selection.
    setQuery('');
    setCities([]);
    setNearby([]);
    setSelected(null);
    setChecked([]);
  }, [value.length]);

  return (
    <div className="w-full">
      <div className="mb-2 text-sm font-semibold text-gray-500">Search</div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={query}
          onChange={(event) => {
            const next = event.target.value;
            setQuery(next);
            if (selected) {
              setSelected(null);
              setNearby([]);
              setChecked([]);
              onCityChange([]);
            }
          }}
          placeholder="Stadt suchen"
          className="h-11 rounded-xl border-gray-300 bg-gray-50 pl-10 text-sm text-gray-700 focus-visible:border-gray-300 focus-visible:ring-gray-200"
        />
        {cities.length > 0 && (
          <Command className="h-auto absolute w-full mt-2 border border-gray-200 rounded-xl shadow-lg bg-white">
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

      {nearby.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 items-start">
          {nearby.map((city) => (
            <label
              key={city.label}
              className="flex items-center gap-2 rounded-md px-2 py-1 min-h-9 border border-gray-200 bg-white transition-colors cursor-pointer hover:bg-gray-50"
            >
              <Checkbox
                className="border-gray-300 bg-white data-[state=checked]:bg-gray-700 data-[state=checked]:border-gray-700"
                checked={checked.some((c) => c.label === city.label)}
                onCheckedChange={() => toggle(city)}
              />
              <span className="text-xs font-medium text-gray-700">{city.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
