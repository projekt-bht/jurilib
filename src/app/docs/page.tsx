'use client';

import {
  ArrowUpRight,
  Award,
  BookOpen,
  ChevronRight,
  Code,
  Database,
  FileText,
  Gavel,
  Gem,
  HelpCircle,
  Link2,
  Lock,
  MapPinned,
  Monitor,
  RefreshCw,
  ScrollText,
  Search,
  Server,
  Settings,
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
import { Licenses } from './project-overview/licenses';
import { LinksAndResources } from './project-overview/links-and-resources';
import { ShortDescription } from './project-overview/short-description';
import { SourcesAndAI } from './project-overview/sources-and-ai';
import { TeamTasks } from './project-overview/team-tasks';
import { Search as SearchTechnical } from './technical-docs/search';
import { Security } from './technical-docs/security';
import { LawyerQuickStart } from './user-guide/lawyer-quick-start';
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
  | 'faq'
  | 'user-faq'
  | 'lawyer-faq'
  | 'glossary'
  // ---
  | 'search'
  | 'organizations'
  | 'case-management'
  | 'account'
  | 'technical'
  | 'architecture'
  | 'api'
  | 'security'
  | 'project-overview'
  | 'short-description'
  | 'team-tasks'
  | 'links-and-resources'
  | 'sources-and-ai'
  | 'licenses';

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
          { id: 'user-features-workflows', label: 'Funktionen & Workflows' },
        ],
      },
      {
        id: 'lawyer-perspective',
        label: 'Jurist*innenhandbuch',
        children: [
          { id: 'lawyer-quick-start', label: 'Erste Schritte für Jurist*innen' },
          { id: 'lawyer-features-workflows', label: 'Funktionen & Workflows' },
        ],
      },
    ],
  },
  {
    id: 'technical',
    label: 'Technische Details',
    icon: <Code className="w-4 h-4 text-accent-blue" />,
    children: [
      { id: 'search', label: 'Suche & Ergebnisse' },
      { id: 'security', label: 'Sicherheit' },
    ],
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
  // ---
  {
    id: 'project-overview',
    label: 'Projektübersicht',
    icon: <Monitor className="w-4 h-4 text-accent-blue" />,
    children: [
      { id: 'short-description', label: 'Kurzbeschreibung' },
      { id: 'team-tasks', label: 'Team & Aufgabenverteilung' },
      { id: 'links-and-resources', label: 'Links & Zugänge' },
      { id: 'sources-and-ai', label: 'Quellen & AI-Disclaimer' },
      { id: 'licenses', label: 'Lizenzangaben' },
      { id: 'glossary', label: 'Glossar' },
      { id: 'organizations', label: 'Organisationen' },
      { id: 'case-management', label: 'Fallverwaltung' },
      { id: 'account', label: 'Konto & Profil' },
      { id: 'architecture', label: 'Architektur' },
      { id: 'api', label: 'API-Referenz' },
    ],
  },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('project-overview');
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
                Erste Schritte für Nutzer*innen
              </h3>
              <UserQuickStart />
            </section>

            {/* User Features & Workflows */}
            <section id="user-features-workflows" className="mb-16 scroll-mt-24">
              <h3 className="text-l font-bold text-foreground mb-4 flex items-center gap-2">
                <Gem className="w-5 h-5 text-primary" />
                Funktionen & Workflows
              </h3>
              <UserFeaturesWorkflows />
            </section>

            {/* Lawyer Perspective */}
            <section id="lawyer-perspective" className="mb-8 scroll-mt-24">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Gavel className="w-5 h-5 text-primary" />
                Jurist*innenhandbuch
              </h2>
            </section>

            {/* Lawyer Quick Start */}
            <section id="lawyer-quick-start" className="mb-16 scroll-mt-24">
              <h3 className="text-l font-bold text-foreground mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Erste Schritte für Jurist*innen
              </h3>
              <LawyerQuickStart />
            </section>

            {/* Lawyer Features & Workflows */}
            <section id="lawyer-features-workflows" className="mb-16 scroll-mt-24">
              <h3 className="text-l font-bold text-foreground mb-4 flex items-center gap-2">
                <Gem className="w-5 h-5 text-primary" />
                Funktionen & Workflows
              </h3>
              <UserFeaturesWorkflows />
            </section>

            {/* Technical Docs */}
            <section id="technical" className="mb-8 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-accent-blue text-primary p-2 rounded-lg">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                  Technische Dokumentation
                </h1>
              </div>
              <p className="text-lg text-foreground/70 leading-relaxed mb-8">
                Technische Details zu JuriLib.
              </p>
            </section>

            {/* Search & Results */}
            <section id="search" className="mb-16 scroll-mt-24">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Suche & Ergebnisse
              </h2>
              <SearchTechnical />
            </section>

            {/* Security */}
            <section id="security" className="mb-16 scroll-mt-24">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Sicherheit
              </h2>
              <Security />
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
              <p className="text-lg text-foreground/70 leading-relaxed mb-8">TODO</p>
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

            {/* ############################################################################ */}

            {/* Organizations */}
            <section id="organizations" className="mb-16 scroll-mt-24">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Organisationen
              </h3>
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  JuriLib arbeitet mit verschiedenen Rechtsberatungsorganisationen zusammen. Im
                  Bereich Organisationen können Sie alle verfügbaren Beratungsstellen durchsuchen
                  und filtern.
                </p>
                <div className="space-y-3">
                  {[
                    {
                      title: 'Organisationsprofil',
                      desc: 'Jede Organisation hat ein Profil mit Beschreibung, Rechtsgebieten und Kontaktdaten.',
                    },
                    {
                      title: 'Filteroptionen',
                      desc: 'Filtern Sie nach Rechtsgebiet, Standort oder Art der Organisation.',
                    },
                    {
                      title: 'Detailansicht',
                      desc: 'Klicken Sie auf eine Organisation, um weitere Informationen und Teammitglieder zu sehen.',
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Case Management */}
            <section id="case-management" className="mb-16 scroll-mt-24">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Fallverwaltung
              </h3>
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Nach der Anmeldung können Sie Ihre Fälle verwalten und den Status Ihrer Anfragen
                  verfolgen.
                </p>
                <div className="space-y-3">
                  {[
                    {
                      title: 'Neuen Fall erstellen',
                      desc: 'Navigieren Sie zu "Neuer Fall" und beschreiben Sie Ihr Anliegen ausführlich.',
                    },
                    {
                      title: 'Dashboard',
                      desc: 'Im Dashboard sehen Sie alle aktiven und abgeschlossenen Fälle auf einen Blick.',
                    },
                    {
                      title: 'Status verfolgen',
                      desc: 'Jeder Fall hat einen Status: Offen, In Bearbeitung oder Abgeschlossen.',
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Account */}
            <section id="account" className="mb-16 scroll-mt-24">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Konto & Profil
              </h3>
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Verwalten Sie Ihr Benutzerkonto und Profileinstellungen.
                </p>
                <div className="space-y-3">
                  {[
                    {
                      title: 'Anmeldung',
                      desc: 'Melden Sie sich über den Einloggen-Button in der Kopfzeile an.',
                    },
                    {
                      title: 'Profil bearbeiten',
                      desc: 'Ändern Sie Ihre persönlichen Daten und Benachrichtigungseinstellungen.',
                    },
                    {
                      title: 'Abmelden',
                      desc: 'Klicken Sie auf Ihr Profilbild und dann auf Abmelden.',
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Architecture */}
            <section id="architecture" className="mb-16 scroll-mt-24">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Architektur
              </h3>
              <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Tech-Stack</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: 'Framework', value: 'Next.js 16 (App Router)' },
                      { label: 'Sprache', value: 'TypeScript' },
                      { label: 'Styling', value: 'Tailwind CSS v4' },
                      { label: 'UI-Bibliothek', value: 'shadcn/ui' },
                      { label: 'Hosting', value: 'Vercel' },
                      { label: 'Schriftart', value: 'Inter, Geist Mono' },
                    ].map((tech) => (
                      <div
                        key={tech.label}
                        className="bg-secondary/40 rounded-lg p-3 border border-border"
                      >
                        <p className="text-xs text-muted-foreground mb-0.5">{tech.label}</p>
                        <p className="text-sm font-medium text-foreground font-mono">
                          {tech.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Projektstruktur</h4>
                  <div className="bg-foreground/5 rounded-lg p-4 font-mono text-sm leading-relaxed">
                    <pre className="text-foreground/80 overflow-x-auto">{`jurilib/
├── app/
│   ├── page.tsx          # Startseite
│   ├── layout.tsx        # Root Layout
│   ├── globals.css       # Globale Styles
│   ├── dashboard/        # Dashboard
│   ├── docs/             # Dokumentation
│   ├── lawyers/          # Juristen-Seite
│   ├── new-case/         # Neuer Fall
│   ├── organizations/    # Organisationen
│   ├── solutions/        # Lösungen
│   └── team/             # Team-Seite
├── components/           # Wiederverwendbare Komponenten
├── contexts/             # React Context Provider
└── public/               # Statische Dateien`}</pre>
                  </div>
                </div>
              </div>
            </section>

            {/* API Reference */}
            <section id="api" className="mb-16 scroll-mt-24">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-primary" />
                API-Referenz
              </h3>
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  JuriLib verwendet serverseitige Datenverarbeitung über Next.js Server Components
                  und Server Actions.
                </p>

                <div className="space-y-4">
                  <div className="bg-secondary/40 rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded font-mono">
                        GET
                      </span>
                      <code className="text-sm font-mono text-foreground">/api/organizations</code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Gibt eine Liste aller verfügbaren Organisationen zurück.
                    </p>
                  </div>

                  <div className="bg-secondary/40 rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded font-mono">
                        POST
                      </span>
                      <code className="text-sm font-mono text-foreground">/api/search</code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Sucht passende Organisationen basierend auf der Problembeschreibung.
                    </p>
                  </div>

                  <div className="bg-secondary/40 rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded font-mono">
                        GET
                      </span>
                      <code className="text-sm font-mono text-foreground">/api/solutions/:id</code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Gibt Details zu einer bestimmten Lösung/Organisation zurück.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Projektübersicht */}
            <section id="project-overview" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-accent-blue text-primary p-2 rounded-lg">
                  <Monitor className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                  Projektübersicht
                </h2>
              </div>
            </section>

            {/* Short Description */}
            <section id="short-description" className="mb-16 scroll-mt-24">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Kurzbeschreibung
              </h3>
              <div>
                <ShortDescription />
              </div>
            </section>

            {/* Team & Tasks */}
            <section id="team-tasks" className="mb-16 scroll-mt-24">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Team & Aufgabenverteilung
              </h3>

              <div>
                <TeamTasks />
              </div>
            </section>

            {/* Links & Resources */}
            <section id="links-and-resources" className="mb-16 scroll-mt-24">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Link2 className="w-5 h-5 text-primary" />
                Links & Zugänge
              </h3>

              <div>
                <LinksAndResources />
              </div>
            </section>

            {/* Sources & AI */}
            <section id="sources-and-ai" className="mb-16 scroll-mt-24">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                Quellen & AI-Disclaimer
              </h3>

              <span>
                <SourcesAndAI />
              </span>
            </section>

            {/* Licenses */}
            <section id="licenses" className="mb-16 scroll-mt-24">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Lizenzen
              </h3>

              <span>
                <Licenses />
              </span>
            </section>

            {/* Glossary */}
            <section id="glossary" className="mb-16 scroll-mt-24">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <ScrollText className="w-5 h-5 text-primary" />
                Glossar
              </h3>

              <span>
                <Glossary />
              </span>
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
                  href="mailto:kontakt@jurilib.de"
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
