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
import { MapPin } from 'lucide-react';

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
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-accent-blue-light p-1 text-foreground">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="flex-1">
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
              />
            </div>
          </div>
          {cities.length > 0 && (
            <Command className="h-auto absolute w-full mt-1 border rounded-lg shadow-lg bg-white">
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

        <div className="flex flex-wrap gap-2 items-start">
          {nearby.map((city) => (
            <label
              key={city.label}
              className="flex items-center gap-2 rounded-md px-2 py-1 min-h-9 transition-colors cursor-pointer hover:bg-accent-blue-soft"
            >
              <Checkbox
                className="border-accent-gray bg-background hover:border-foreground data-[state=checked]:bg-accent-blue data-[state=checked]:border-accent-blue"
                checked={checked.some((c) => c.label === city.label)}
                onCheckedChange={() => toggle(city)}
              />
              <span className="text-xs font-medium text-foreground">{city.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
