'use client';
import { ArrowLeft, BookOpen, Building2, ShieldUser, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LoginContext, useLoginContext } from '@/app/LoginContext';
import { Authentication } from '@/components/Authentication/Authentication';
import { Logo } from '@/components/Header/Logo';

export function Navbar() {
  const { login, setLogin } = useLoginContext();

  const isDocsPage = usePathname().includes('/docs');

  if (isDocsPage) {
    return (
      <nav className="bg-background text-foreground flex items-center justify-between p-5 mx-auto border border-border fixed w-full z-50">
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
    );
  }

  return (
    <LoginContext.Provider value={{ login, setLogin }}>
      <nav className="bg-background text-foreground flex items-center justify-between p-5 mx-auto border border-border fixed w-full z-50">
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
    </LoginContext.Provider>
  );
}
