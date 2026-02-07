'use client';

import {
  ArrowUpRight,
  BookOpen,
  Gavel,
  Gem,
  HandCoins,
  HelpCircle,
  MapPinned,
  ScrollText,
  Search,
  Server,
  SquareArrowOutUpRight,
  Unplug,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useEffect, useMemo, useState } from 'react';

import { FAQ } from './faq/faq';
import { LawyerFAQ } from './faq/lawyer-faq';
import { UserFAQ } from './faq/user-faq';
import { TargetAudience } from './introduction/target-audience';
import { TechnicalRequirements } from './introduction/technical-requirements';
import { Glossary } from './project-overview/glossary';
import { Search as SearchTechnical } from './search/search';
import { LawyerAppointment } from './user-guide/lawyer-appointment';
import { Costs } from './user-guide/lawyer-costs';
import { Disclaimer as LawyerDisclaimer } from './user-guide/lawyer-disclaimer';
import { LawyerDocument } from './user-guide/lawyer-document';
import { LawyerQuickStart } from './user-guide/lawyer-quick-start';
import { LawyerRegister } from './user-guide/lawyer-register';
import { Disclaimer as UserDisclaimer } from './user-guide/user-disclaimer';
import { UserFeaturesWorkflows } from './user-guide/user-features-workflows';
import { UserQuickStart } from './user-guide/user-quick-start';

type SectionId =
  | 'introduction'
  | 'target-audience'
  | 'technical-requirements'
  | 'jurilib-guide'
  | 'user-perspective'
  | 'user-quick-start'
  | 'user-features-workflows'
  | 'lawyer-perspective'
  | 'lawyer-quick-start'
  | 'lawyer-features-workflows'
  | 'lawyer-features-register'
  | 'lawyer-features-appointments'
  | 'lawyer-features-documents'
  | 'costs'
  | 'search'
  | 'faq'
  | 'user-faq'
  | 'lawyer-faq'
  | 'glossary'
  | 'api';

interface NavItem {
  id: SectionId;
  label: string;
  icon: React.ReactNode;
  children?: { id: string; label: string; children?: { id: string; label: string }[] }[];
}

const navItems: NavItem[] = [
  {
    id: 'introduction',
    label: 'Einleitung',
    icon: <MapPinned className="w-4 h-4 text-accent-blue" />,
    children: [
      { id: 'target-audience', label: 'Für wen ist JuriLib?' },
      { id: 'technical-requirements', label: 'Technische Voraussetzungen' },
    ],
  },
  {
    id: 'jurilib-guide',
    label: 'Wie nutze ich JuriLib?',
    icon: <BookOpen className="w-4 h-4 text-accent-blue" />,
    children: [
      {
        id: 'user-perspective',
        label: 'Nutzer*innenhandbuch',
        children: [
          { id: 'user-quick-start', label: 'Erste Schritte' },
          { id: 'user-features-workflows', label: 'Funktionen' },
        ],
      },
      {
        id: 'lawyer-perspective',
        label: 'Jurist*innenhandbuch',
        children: [
          { id: 'lawyer-quick-start', label: 'Erste Schritte' },
          { id: 'lawyer-features-register', label: 'Registrierung' },
          { id: 'lawyer-features-appointments', label: 'Termine' },
          { id: 'lawyer-features-documents', label: 'Dokumente' },

          { id: 'costs', label: 'Kosten' },
        ],
      },
    ],
  },
  {
    id: 'search',
    label: 'Suche & Ergebnisse',
    icon: <Search className="w-4 h-4 text-accent-blue" />,
  },
  {
    id: 'faq',
    label: 'FAQ',
    icon: <HelpCircle className="w-4 h-4 text-accent-blue" />,
    children: [
      { id: 'user-faq', label: 'Nutzer*innen FAQ' },
      { id: 'lawyer-faq', label: 'Jurist*innen FAQ' },
    ],
  },
  { id: 'glossary', label: 'Glossar', icon: <ScrollText className="w-4 h-4 text-accent-blue" /> },
  { id: 'api', label: 'API-Referenz', icon: <Unplug className="w-4 h-4 text-accent-blue" /> },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('introduction');
  const isApiPage = usePathname().includes('/docs/api');

  const allSectionIds = useMemo<SectionId[]>(() => {
    const ids: string[] = [];
    navItems.forEach((item) => {
      ids.push(item.id);
      item.children?.forEach((child) => {
        ids.push(child.id);
        child.children?.forEach((grandchild) => ids.push(grandchild.id));
      });
    });
    return ids as SectionId[];
  }, []);

  useEffect(() => {
    if (isApiPage) return;

    const sections = allSectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id as SectionId);
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -70% 0px',
        threshold: 0.1,
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [allSectionIds, isApiPage]);

  const scrollToSection = (id: SectionId) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar Navigation - Desktop */}
        <aside className="hidden md:block w-64 shrink-0 border-r border-border sticky top-23 h-[calc(100vh-5.75rem)] overflow-y-auto">
          <nav className="p-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
                {item.children && (
                  <div className="ml-6 mt-1 flex flex-col gap-0.5 border-l border-border pl-3">
                    {item.children.map((child) => (
                      <div key={child.id} className="flex flex-col gap-0.5">
                        <button
                          onClick={() => scrollToSection(child.id as SectionId)}
                          className={`text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
                            activeSection === child.id
                              ? 'text-primary font-medium'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {child.label}
                        </button>

                        {child.children && (
                          <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-border/60 pl-3">
                            {child.children.map((grandchild) => (
                              <button
                                key={grandchild.id}
                                onClick={() => scrollToSection(grandchild.id as SectionId)}
                                className={`text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
                                  activeSection === grandchild.id
                                    ? 'text-primary font-medium'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                              >
                                {grandchild.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-4 md:px-8 lg:px-12 py-8 md:py-12">
          <div className="max-w-6xl">
            {/* Getting Started */}
            <section id="introduction" className="mb-12 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-accent-blue text-primary p-2 rounded-lg">
                  <MapPinned className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                  Einleitung
                </h1>
              </div>
              <p className="text-lg text-foreground/70 leading-relaxed mb-8">
                JuriLib verbindet Menschen mit rechtlichen Anliegen mit passenden Organisationen und
                Beratungsstellen. Diese Dokumentation hilft Ihnen, die Plattform optimal zu nutzen.
              </p>
            </section>

            {/* Target Audience */}
            <section id="target-audience" className="mb-16 scroll-mt-24">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Für wen ist JuriLib?
              </h2>
              <TargetAudience />
            </section>

            {/* Technical Requirements */}
            <section id="technical-requirements" className="mb-16 scroll-mt-24">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                Technische Voraussetzungen
              </h2>
              <TechnicalRequirements />
            </section>

            {/* Jurilib Guide */}
            <section id="jurilib-guide" className="mb-12 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-accent-blue text-primary p-2 rounded-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                  Wie nutze ich JuriLib?
                </h1>
              </div>
              <p className="text-lg text-foreground/70 leading-relaxed mb-8">
                Detaillierte Anleitungen zu allen Funktionen der JuriLib-Plattform.
              </p>
            </section>

            {/* User Perspective */}
            <section id="user-perspective" className="mb-8 scroll-mt-24">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Nutzer*innenhandbuch
              </h2>
            </section>

            {/* User Quick Start */}
            <section id="user-quick-start" className="mb-16 scroll-mt-24">
              <h3 className="text-l font-bold text-foreground mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Erste Schritte
              </h3>
              <UserQuickStart />
            </section>

            {/* User Features & Workflows */}
            <section id="user-features-workflows" className="mb-16 scroll-mt-24">
              <h3 className="text-l font-bold text-foreground mb-4 flex items-center gap-2">
                <Gem className="w-5 h-5 text-primary" />
                Funktionen
              </h3>
              <UserDisclaimer />
              <UserFeaturesWorkflows />
            </section>

            {/* Lawyer Perspective */}
            <section id="lawyer-perspective" className="mb-8 scroll-mt-24">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Gavel className="w-5 h-5 text-primary" />
                Jurist*innenhandbuch
              </h2>
              <LawyerDisclaimer />
            </section>

            {/* Lawyer Quick Start */}
            <section id="lawyer-quick-start" className="mb-16 scroll-mt-24">
              <h3 className="text-l font-bold text-foreground mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Erste Schritte
              </h3>
              <LawyerQuickStart />
            </section>

            {/* Lawyer Features & Workflows */}
            <section id="lawyer-features-workflows" className="mb-5 scroll-mt-24">
              <h3 className="text-l font-bold text-foreground mb-4 flex items-center gap-2">
                <Gem className="w-5 h-5 text-primary" />
                Funktionen
              </h3>
            </section>

            {/* Lawyer Register */}
            <section id="lawyer-features-register" className="mb-8 scroll-mt-24">
              <LawyerRegister />
            </section>

            {/* Lawyer Appointment */}
            <section id="lawyer-features-appointments" className="mb-8 scroll-mt-24">
              <LawyerAppointment />
            </section>

            {/* Lawyer Document */}
            <section id="lawyer-features-documents" className="mb-16 scroll-mt-24">
              <LawyerDocument />
            </section>

            {/* Costs */}
            <section id="costs" className="mb-16 scroll-mt-24">
              <h3 className="text-l font-bold text-foreground mb-4 flex items-center gap-2">
                <HandCoins className="w-5 h-5 text-primary" />
                Kosten
              </h3>
              <Costs />
            </section>

            {/* Search & Results */}
            <section id="search" className="mb-8 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-accent-blue text-primary p-2 rounded-lg">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                  Suche & Ergebnisse
                </h1>
              </div>
              <p className="text-lg text-foreground/70 leading-relaxed mb-8">
                Tipps zur effektiven Nutzung der Suchfunktion und Interpretation der Ergebnisse.
              </p>
              <SearchTechnical />
            </section>

            {/* FAQ */}
            <section id="faq" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-accent-blue text-primary p-2 rounded-lg">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                  Häufige Fragen
                </h1>
              </div>
              <p className="text-lg text-foreground/70 leading-relaxed mb-8">
                Hier findest du Antworten auf häufig gestellte Fragen rund um JuriLib.
              </p>
              <FAQ />
            </section>

            {/* User FAQ */}
            <section id="user-faq" className="mb-8 scroll-mt-24">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Häufige Fragen von Nutzer*innen
              </h2>
              <UserFAQ />
            </section>

            {/* Lawyer FAQ */}
            <section id="lawyer-faq" className="mb-8 scroll-mt-24">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Gavel className="w-5 h-5 text-primary" />
                Häufige Fragen von Jurist*innen
              </h2>
              <LawyerFAQ />
            </section>

            {/* Glossary */}
            <section id="glossary" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-accent-blue text-primary p-2 rounded-lg">
                  <ScrollText className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                  Glossar
                </h1>
              </div>
              <p className="text-lg text-foreground/70 leading-relaxed mb-8">
                Hier findest du Definitionen und Erklärungen zu den wichtigsten Begriffen rund um
                JuriLib.
              </p>
              <Glossary />
            </section>

            {/* API */}
            <section id="api" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-accent-blue text-primary p-2 rounded-lg">
                  <Unplug className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                  API
                </h1>
              </div>

              <div className="text-xl font-bold text-foreground/70 mb-4 flex items-center gap-2">
                Hier kommst du zu unserer API-Dokumentation.
                <Link href="/docs/api">
                  <SquareArrowOutUpRight className="w-5 h-5 text-primary" />
                </Link>
              </div>
            </section>

            {/* Footer CTA */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 md:p-8 text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">Noch Fragen?</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Kontaktieren Sie uns oder starten Sie direkt mit der Suche.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5"
                >
                  Jetzt starten
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <a
                  href="mailto:jurilib@web.de"
                  className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors"
                >
                  Kontakt aufnehmen
                </a>
              </div>
            </div>

            {/* Page Bottom Spacing */}
            <div className="h-12" />
          </div>
        </main>
      </div>
    </div>
  );
}
