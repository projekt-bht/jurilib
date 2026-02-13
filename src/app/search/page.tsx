'use client';
import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { notFound } from '@/components/Dashboard/helper';
import HowItWorks from '@/components/LandingPage/HowItWorks';
import { Search } from '@/components/LandingPage/Search';
import type { User } from '~/generated/prisma/browser';

import { useLoginContext } from '../LoginContext';

export default function SearchPage() {
  const router = useRouter();
  const { login } = useLoginContext();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!login) {
      router.push('/');
      return;
    }

    async function fetchUser() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_ROOT}user/${(login as { userId: string }).userId}`
        );
        if (res.ok) {
          const userData: User = await res.json();
          setUser(userData);
        } else {
          throw new Error('Fehler beim Abrufen der Benutzerdaten.');
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Unbekannter Fehler beim Laden der Daten'
        );
      }
    }
    fetchUser();
  }, [login, router]);

  if (error) {
    notFound(error);
  }

  if (!login || !user) {
    return null;
  }

  return (
    <div className="justify-center text-center pt-5">
      <div className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-accent-blue-light border border-accent-blue/30 text-xs md:text-sm font-medium text-accent-blue mb-6">
        <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
        <span>Finde deinen Termin</span>
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 tracking-tight leading-[1.1]">
        <span className="block">Hallo {user?.firstname},</span>
        <span className="bg-linear-to-r from-accent-blue via-accent-purple to-accent-blue bg-clip-text text-transparent animate-gradient">
          wie können wir dir helfen?
        </span>
      </h1>
      <h2 className="text-lg md:text-lg text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed">
        Beschreibe uns dein Problem und wir finden die passende Lösung für dich.
      </h2>
      <Search />
      <HowItWorks />
    </div>
  );
}
