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
    const t = setTimeout(async () => setCities((await getCityByName(query)) || []), 300);
    return () => clearTimeout(t);
  }, [query, selected]);

  const select = async (city: City) => {
    setSelected(city);
    setCities([]);
    setQuery(city.label);
    const res = await getCityByRadius(city.position.lat, city.position.lon, city.name);
    setNearby((res || []).filter((c: City) => c.label !== city.label));
    setChecked([]);
    onCityChange([city.name]);
  };

  const toggle = (city: City) => {
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
    setQuery('');
    setCities([]);
    setNearby([]);
    setSelected(null);
    setChecked([]);
  }, [value.length]);

  return (
    <div className="relative w-full rounded-2xl border border-border bg-background px-3 py-3 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="relative">
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
            placeholder="Stadt suchen..."
          />
          {cities.length > 0 && (
            <Command className="absolute w-full mt-1 border rounded-lg shadow-lg z-10">
              <CommandList>
                <CommandEmpty>Keine Treffer gefunden</CommandEmpty>
                <CommandGroup>
                  {cities.map((city) => (
                    <CommandItem key={city.label} onSelect={() => select(city)}>
                      {city.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          )}
        </div>

        <div className="flex flex-wrap gap-2 items-start">
          {nearby.map((city) => (
            <label
              key={city.label}
              className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer"
            >
              <Checkbox
                checked={checked.some((c) => c.label === city.label)}
                onCheckedChange={() => toggle(city)}
              />
              <span className="text-sm">{city.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
