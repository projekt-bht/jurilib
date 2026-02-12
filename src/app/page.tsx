'use client';
import { Sparkles } from 'lucide-react';

import { UserDashboard } from '@/components/Dashboard/_components/user/UserDashboard';
import HowItWorks from '@/components/LandingPage/HowItWorks';
import OurOffer from '@/components/LandingPage/OurOffer';
import { Search } from '@/components/LandingPage/Search';
import TruestedSection from '@/components/LandingPage/TrustedSection';

import { useLoginContext } from './LoginContext';

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { login, setLogin } = useLoginContext();

  // TODO: Fallunterscheidung zwischen Employee und User über die Ressource im Login Context
  if (login) {
    return (
      <div className="min-h-screen bg-card">
        <UserDashboard />
      </div>
    );
  }

  return (
    <>
      <div className="justify-center text-center pt-5">
        <div className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-accent-blue-light/40 border border-accent-blue/30 text-xs md:text-sm font-medium text-accent-blue mb-6">
          <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span>Kostenlose & vertrauliche Suche </span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 tracking-tight leading-[1.1]">
          <span className="block">Rechtliche Hilfe,</span>
          <span className="bg-linear-to-r from-accent-blue via-accent-purple to-accent-blue bg-clip-text text-transparent animate-gradient">
            die genau zu dir passt
          </span>
        </h1>
        <h2 className="text-lg md:text-lg text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed">
          Beschreibe uns dein Problem und wir finden die passende Lösung für dich.
        </h2>
      </div>
      <Search />
      <HowItWorks />
      <TruestedSection />
      <OurOffer />
    </>
  );
}
