'use client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import type { Organization } from '~/generated/prisma/browser';

import { ResultLoading } from '../Loading/ResultLoading';
import { ProblemSearchField } from './ProblemSearchField';
import { ResultCarousel } from './ResultCarusel';
import { Button } from '../ui/button';

export function Search() {
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
          const element = resultsRef.current;
          const rect = element.getBoundingClientRect();
          const offset = 120; // Abstand vom oberen Rand in Pixeln
          window.scrollTo({
            top: window.scrollY + rect.top - offset,
            behavior: 'smooth',
          });
        }
      }, 100);
    }
  }, [showResults, results]);

  return (
    <div className="bg-card flex items-start justify-start pb-16">
      <div className="text-center w-full">
        <div id="search-field" className="min-w-sm mx-auto max-w-4xl p-6">
          <ProblemSearchField onSubmit={(text) => search(text)} />
        </div>

        {loading && (
          <ResultLoading
            title="Analyse läuft"
            description="Wir suchen passende Ergebnisse für dich."
          />
        )}

        {!loading && showResults && (
          <>
            {results.length > 0 ? (
              <section className="py-16 px-4 bg-card">
                <div className="max-w-5xl mx-auto">
                  <div className="text-center mb-12 scroll-mt-32">
                    <h2
                      ref={resultsRef}
                      className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance"
                    >
                      Passende Organisationen
                    </h2>
                    <p className="text-lg text-muted-foreground text-balance">
                      Wir haben folgende Organisationen für Ihr Anliegen gefunden
                    </p>
                  </div>
                  <ResultCarousel organizations={results} />
                </div>
              </section>
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
            )}
            {/*Info Message */}
            <div className="bg-background rounded-3xl border border-primary/20 px-12 py-8 md:px-16 md:py-12 text-center max-w-5xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Nichts Passendes dabei?
              </h3>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                Kein Problem! Beschreibe uns dein Problem einfach noch genauer oder durchsuche
                eigenständig die Vielzahl unserer vertretenen Organisationen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/organization"
                  className="inline-flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-md"
                >
                  Alle Organisationen durchsuchen
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 px-4 py-3 bg-background text-foreground rounded-full font-semibold hover:bg-background border-2 border-border transition-all duration-300 hover:scale-105 shadow-md hover:shadow-md cursor-pointer"
                >
                  Suche bearbeiten
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
