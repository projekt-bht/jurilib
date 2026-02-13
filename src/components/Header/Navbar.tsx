'use client';
import { ArrowLeft, BookOpen, Building2, FlaskConical, ShieldUser, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { LoginContext, useLoginContext } from '@/app/LoginContext';
import { Authentication } from '@/components/Authentication/Authentication';
import { Logo } from '@/components/Header/Logo';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

export function Navbar() {
  const { login, setLogin } = useLoginContext();

  const isDocsPage = usePathname().includes('/docs');
  // Info modal appears on the user's first visit on any page (persisted via localStorage).
  const [showInfoModal, setShowInfoModal] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    // Show the info modal only on the user's first visit.
    return !window.localStorage.getItem('jurilib_info_modal_seen');
  });

  const InfoModal = (
    <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
      <DialogContent className="border-border bg-background text-foreground sm:max-w-xl">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 shrink-0 rounded-full bg-accent-blue-light flex items-center justify-center shadow-sm border border-accent-blue-light">
            <FlaskConical className="h-5 w-5 text-accent-blue" />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-xl font-medium text-foreground">
              Hochschulprojekt der Berliner Hochschule für Technik (BHT)
            </DialogTitle>
            <DialogDescription className="text-sm text-foreground">
              Diese Anwendung ist ein Hochschulprojekt im Studiengang Medieninformatik an der BHT.
              Alle Inhalte, Organisationen und Profile sind fiktiv und dienen ausschließlich der
              Demonstration.
            </DialogDescription>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setShowInfoModal(false);
              if (typeof window !== 'undefined') {
                window.localStorage.setItem('jurilib_info_modal_seen', '1');
              }
            }}
            className="cursor-pointer inline-flex h-10 items-center justify-center rounded-md border border-accent-blue-light bg-accent-blue-light px-4 text-sm font-medium text-accent-blue transition-colors hover:bg-accent-blue-soft"
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
        {InfoModal}
        <nav className="bg-background text-foreground flex items-center justify-between p-5 mx-auto border border-border fixed top-0 left-0 w-dvw z-50">
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
        {InfoModal}
        <nav className="bg-background text-foreground flex items-center justify-between p-5 mx-auto border border-border fixed top-0 left-0 w-dvw z-50 pr-6">
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
