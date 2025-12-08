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
        <h2 className="text-accent-gray text-2xl mb-3 py-6 pt-4 pb-2">
          Teile uns dein rechtliches Anliegen mit
        </h2>
        <div className="min-w-sm mx-auto max-w-lg">
          <ProblemSearchField onSubmit={(text) => search(text)} />
        </div>

        {loading && (
          <div className="mt-8 mb-8 flex justify-center">
            <div className="p-4 bg-secondary border border-border rounded-lg text-center text-foreground animate-fade-in inline-block">
              Vielen Dank! Wir verarbeiten deine Anfrage.
            </div>
          </div>
        )}

        {!loading &&
          showResults &&
          (results.length > 0 ? (
            <div className="flex flex-col pt-8 pb-8 justify-start items-center bg-card">
              <h2 ref={resultsRef} className="text-4xl text-foreground font-bold">
                Passende Organisationen
              </h2>
              <h3 className="text-xl text-accent-gray pt-2">
                Folgende Organisationen passen zu deinem Anliegen:
              </h3>
              <div className="h-8" />
              {results.map((organization) => (
                <OrganizationCard key={'OrganizationCard_' + organization.id} {...organization} />
              ))}
            </div>
          ) : (
            <div>
              <h2 ref={resultsRef} className="text-3xl text-foreground font-bold mt-10">
                Keine passenden Organisationen gefunden
              </h2>
              <div className="mt-4 mb-8 p-4 rounded-lg text-center inline-block max-w-md mx-auto text-xl text-accent-gray">
                Leider konnten wir keine passende Organisationen zu deinem Anliegen finden. Bitte
                überarbeite deine Beschreibung und versuche es erneut.
              </div>
            </div>
          ))}

        <HowItWorks />
        <OurOffer />
      </div>
    </div>
  );
}
