'use client';

import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useState } from 'react';

// Function to format pricing information based on price category
export function getPricingInfo(priceCategory: string) {
  switch (priceCategory) {
    case 'FREE':
      return { label: 'Niedrige Preisklasse', range: '50-100€/Std', color: 'text-emerald-600' };
    case 'LOW':
      return { label: 'Mittlere Preisklasse', range: '100-200€/Std', color: 'text-amber-600' };
    case 'MEDIUM':
      return { label: 'Hohe Preisklasse', range: '200+€/Std', color: 'text-red-600' };
    case 'HIGH':
      return { label: 'Premium Preisklasse', range: '300+€/Std', color: 'text-purple-600' };
    default:
      return { label: 'Preis auf Anfrage', range: '', color: 'text-gray-600' };
  }
}

export function PricingInfo({ priceCategory }: { priceCategory: string }) {
  const [isPricingExpanded, setIsPricingExpanded] = useState(false);
  const pricingInfo = getPricingInfo(priceCategory);

  return (
    <div className="mb-6">
      <div className="bg-gray-50 rounded-lg border border-gray-200">
        <button
          onClick={() => setIsPricingExpanded(!isPricingExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Honorar:</span>
            <span className={`text-base font-semibold ${pricingInfo.color}`}>
              {pricingInfo.label}
            </span>
            {pricingInfo.range && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600">{pricingInfo.range}</span>
              </>
            )}
          </div>
          {isPricingExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {isPricingExpanded && (
          <div className="px-4 pb-4 pt-2 border-t border-gray-200 space-y-3 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-xs font-medium text-gray-500 mb-1">Erstberatung</p>
                <p className="text-lg font-semibold text-foreground">
                  {priceCategory === 'FREE'
                    ? 'Kostenlos'
                    : priceCategory === 'LOW'
                    ? '50€'
                    : '100€'}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Durchschnittliche Bearbeitungszeit
                </p>
                <p className="text-lg font-semibold text-foreground">2-4 Wochen</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-xs font-medium text-gray-500 mb-2">Zahlungsmöglichkeiten</p>
            </div>
            <p className="text-xs text-gray-600">
              * Die genauen Kosten werden nach einem Erstgespräch ermittelt und hängen vom Umfang
              Ihres Anliegens ab.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
