'use client';
import { useEffect, useRef, useState } from 'react';

import OrganizationCard from '@/app/organization/_components/OrganizationCard';
import type { Organization } from '~/generated/prisma/browser';

import HowItWorks from './HowItWorks';
import OurOffer from './OurOffer';
import { ProblemSearchField } from './ProblemSearchField';

export function LandingPage() {
  const [results, setResults] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLHeadingElement>(null);

  async function search(problemText: string) {
    setLoading(true);
    setResults([]);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ROOT}search`, {
        method: 'POST',
        body: JSON.stringify({ searchID: problemText }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data: Organization[] = await res.json();
      setResults(data);
    } catch (err) {
      console.error('Fehler beim Laden:', err);
    } finally {
      setLoading(false);
      setShowResults(true);
    }
  }

  useEffect(() => {
    if (showResults && resultsRef.current) {
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [showResults]);

  return (
    <div className="bg-card min-h-screen flex items-start justify-start">
      <div className="text-center w-full mt-10">
        <h1 className="text-foreground text-5xl font-bold mb-2">Beschreibe dein Problem</h1>
        <p className="text-foreground text-xl mb-3 py-6 pt-4 pb-2">
          Teile uns dein rechtliches Anliegen mit
        </p>
        <div className="min-w-sm mx-auto max-w-lg">
          <ProblemSearchField onSubmit={(text) => search(text)} />
        </div>
        {loading && <p className="mt-10">Lade Ergebnisse...</p>}
        {results && showResults && (
          <div className="flex flex-col justify-start items-center bg-card">
            {results.length > 0 && (
              <>
                <h2 ref={resultsRef} className="text-4xl text-foreground font-semibold">
                  Passende Organisationen
                </h2>
                <h3 className="text-xl text-foreground pt-2">
                  Hier sind die Organisationen, die zu Deiner Suche passen:
                </h3>
                <div className="h-8" />
                {results.map((organization) => (
                  <OrganizationCard key={'OrganizationCard_' + organization.id} {...organization} />
                ))}
                <div className="mb-8 text-muted-foreground pt-6">
                  <span>Deine Anfrage wird vertraulich behandelt.</span>
                </div>
              </>
            )}
          </div>
        )}
        <HowItWorks />
        <OurOffer />
      </div>
    </div>
  );
}
