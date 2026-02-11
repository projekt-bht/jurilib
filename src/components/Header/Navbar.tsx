'use client';
import { ArrowLeft, BookOpen, Building2, FlaskConical, ShieldUser, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LoginContext, useLoginContext } from '@/app/LoginContext';
import { Authentication } from '@/components/Authentication/Authentication';
import { Logo } from '@/components/Header/Logo';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

export function Navbar() {
  const { login, setLogin } = useLoginContext();

  // Beta banner is dismissed only on the client and returns after refresh.
  const isDocsPage = usePathname().includes('/docs');
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    // Hide modal for this session if the user dismissed it.
    const stored = window.sessionStorage.getItem('jurilib_beta_modal_hidden');
    if (stored === '1') {
      setShowBanner(false);
    }
  }, []);

  const BannerModal = (
    <Dialog open={showBanner} onOpenChange={setShowBanner}>
      <DialogContent className="border-border bg-background text-foreground sm:max-w-xl">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 shrink-0 rounded-full bg-accent-blue-light flex items-center justify-center shadow-sm border border-accent-blue-light">
            <FlaskConical className="h-5 w-5 text-accent-blue" />
          </div>
          <div className="space-y-3">
            <DialogTitle className="text-xl font-medium text-foreground">
              Hochschulprojekt der BHT Berlin
            </DialogTitle>
            <DialogDescription className="text-sm text-foreground">
              Diese Anwendung ist ein universitäres Projekt im Studiengang Medieninformatik an der
              BHT, im Modul Projekt. Alle Inhalte, Organisationen und Profile sind fiktiv und dienen
              ausschließlich der Demonstration.
            </DialogDescription>
          </div>
        </div>
        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setShowBanner(false);
                // Persist dismissal for the current session only.
                if (typeof window !== 'undefined') {
                  window.sessionStorage.setItem('jurilib_beta_modal_hidden', '1');
                }
              }}
              className="inline-flex h-10 items-center justify-center rounded-md border border-accent-blue-light bg-accent-blue-light px-4 text-sm font-medium text-accent-blue transition-colors hover:bg-accent-blue-soft"
            >
              Verstanden
            </button>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (isDocsPage) {
    return (
      <>
        {BannerModal}
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
      </>
    );
  }

  return (
    <LoginContext.Provider value={{ login, setLogin }}>
      <>
        {BannerModal}
        <nav className="bg-background text-foreground flex items-center justify-between p-5 mx-auto border border-border fixed w-full z-50">
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
      </>
    </LoginContext.Provider>
  );
}
