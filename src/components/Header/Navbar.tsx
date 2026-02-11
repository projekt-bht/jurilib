'use client';
import { ArrowLeft, BookOpen, Building2, FlaskConical, ShieldUser, User, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { LoginContext, useLoginContext } from '@/app/LoginContext';
import { Authentication } from '@/components/Authentication/Authentication';
import { Logo } from '@/components/Header/Logo';

export function Navbar() {
  const { login, setLogin } = useLoginContext();

  // Beta banner is dismissed only on the client and returns after refresh.
  const isDocsPage = usePathname().includes('/docs');
  const [showBanner, setShowBanner] = useState(true);

  const Banner = (
    <div className="bg-accent-blue text-accent-blue-light px-5 py-2 text-xs sm:text-sm flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-center sm:text-left w-full justify-center sm:justify-start">
        <FlaskConical className="h-4 w-4 flex-shrink-0" />
        <span className="font-semibold tracking-wide">Beta-Version</span>
        <span className="hidden sm:inline">
          – Dies ist ein Hochschulprojekt der BHT Berlin. Alle Inhalte und Organisationen sind fiktiv.
        </span>
        <span className="sm:hidden">– Hochschulprojekt der BHT Berlin. Inhalte fiktiv.</span>
      </div>
      <button
        type="button"
        onClick={() => setShowBanner(false)}
        className="text-accent-blue-light/80 hover:text-accent-blue-light transition-colors"
        aria-label="Beta-Banner schließen"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );

  if (isDocsPage) {
    return (
      <div className="fixed w-full z-50">
        {showBanner && Banner}
        <nav className="bg-background text-foreground flex items-center justify-between p-5 mx-auto border border-border">
          {/* <nav className="bg-background text-foreground flex items-center gap-4 p-5 mx-auto border border-border fixed w-full z-50"> */}
          <div className="gap-4 flex items-center">
            <Logo />
            <span className="hidden sm:inline-flex items-center gap-1.5 text-sm text-muted-foreground border-l border-border pl-4">
              <BookOpen className="w-4 h-4" />
              Dokumentation
            </span>
          </div>
          <Link
            href="/"
            className="hidden md:inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zur Startseite
          </Link>
        </nav>
      </div>
    );
  }

  return (
    <LoginContext.Provider value={{ login, setLogin }}>
      <div className="fixed w-full z-50">
        {showBanner && Banner}
        <nav className="bg-background text-foreground flex items-center justify-between p-5 mx-auto border border-border">
          {/*Logo source: https://de.vecteezy.com/gratis-vektor/verwaltungssymbol */}
          <Logo />

          <div className="flex items-center gap-x-5">
            {!login && (
              <>
                <Link href="/lawyers" className="flex items-center gap-x-2">
                  <ShieldUser className="text-forground" size={24} />
                  <p>Du bist Jurist*in?</p>
                </Link>
                <Link href="/team" className="flex items-center gap-x-2">
                  <User className="text-forground" size={24} />
                  <p>Das Team</p>
                </Link>
                <Link href="/organization" className="flex items-center gap-x-2">
                  <Building2 className="text-foreground" size={24} />
                  <p>Organisationen</p>
                </Link>
              </>
            )}
            <Authentication />
          </div>
        </nav>
      </div>
    </LoginContext.Provider>
  );
}
