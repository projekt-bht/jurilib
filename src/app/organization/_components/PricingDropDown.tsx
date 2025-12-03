'use client';

import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useState } from 'react';

// Function to format pricing information based on price category
export function getPricingInfo(priceCategory: string) {
  switch (priceCategory) {
    case 'FREE':
      return { label: 'Niedrige Preisklasse', range: '50-100€/Std', color: 'text-accent-emerald' };
    case 'LOW':
      return { label: 'Mittlere Preisklasse', range: '100-200€/Std', color: 'text-accent-amber' };
    case 'MEDIUM':
      return { label: 'Hohe Preisklasse', range: '200+€/Std', color: 'text-accent-blue' };
    case 'HIGH':
      return { label: 'Premium Preisklasse', range: '300+€/Std', color: 'text-accent-purple' };
    default:
      return { label: 'Preis auf Anfrage', range: '', color: 'text-foreground' };
  }
}

export function PricingInfo({ priceCategory }: { priceCategory: string }) {
  const [isPricingExpanded, setIsPricingExpanded] = useState(false);
  const pricingInfo = getPricingInfo(priceCategory);

  return (
    <div className="mb-6">
      <div className="bg-card rounded-lg border border-border">
        <button
          onClick={() => setIsPricingExpanded(!isPricingExpanded)}
          className="w-full flex items-center rounded-lg justify-between p-4 hover:bg-accent-gray/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-foreground" />
            <span className="text-sm font-medium text-foreground">Honorar:</span>
            <span className={`text-base font-semibold ${pricingInfo.color}`}>
              {pricingInfo.label}
            </span>
            {pricingInfo.range && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-foreground">{pricingInfo.range}</span>
              </>
            )}
          </div>
          {isPricingExpanded ? (
            <ChevronUp className="w-5 h-5 text-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-foreground" />
          )}
        </button>

        {isPricingExpanded && (
          <div className="px-4 pb-4 pt-2 border-t border-border space-y-3 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-background rounded-lg p-3 border border-border">
                <p className="text-xs font-medium text-accent-gray mb-1">Erstberatung</p>
                <p className="text-lg font-semibold text-foreground">
                  {priceCategory === 'FREE'
                    ? 'Kostenlos'
                    : priceCategory === 'LOW'
                    ? '50€'
                    : '100€'}
                </p>
              </div>
              <div className="bg-background rounded-lg p-3 border border-border">
                <p className="text-xs font-medium text-accent-gray mb-1">
                  Durchschnittliche Bearbeitungszeit
                </p>
                <p className="text-lg font-semibold text-foreground">2-4 Wochen</p>
              </div>
            </div>
            <div className="bg-background rounded-lg p-3 border border-border">
              <p className="text-xs font-medium text-accent-gray mb-2">Zahlungsmöglichkeiten</p>
            </div>
            <p className="text-xs text-accent-gray">
              * Die genauen Kosten werden nach einem Erstgespräch ermittelt und hängen vom Umfang
              Ihres Anliegens ab.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
