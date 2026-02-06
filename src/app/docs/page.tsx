'use client';

import {
  ArrowUpRight,
  Award,
  BookOpen,
  CheckCircle2,
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
  Shield,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useEffect, useMemo, useState } from 'react';

import { TargetAudience } from './introduction/target-audience';
import { TechnicalRequirements } from './introduction/technical-requirements';
import { Glossary } from './project-overview/glossary';
import { Licenses } from './project-overview/licenses';
import { LinksAndResources } from './project-overview/links-and-resources';
import { ShortDescription } from './project-overview/short-description';
import { SourcesAndAI } from './project-overview/sources-and-ai';
import { TeamTasks } from './project-overview/team-tasks';
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
      { id: 'search', label: 'Suche & Ergebnisse' },
      { id: 'organizations', label: 'Organisationen' },
      { id: 'case-management', label: 'Fallverwaltung' },
      { id: 'account', label: 'Konto & Profil' },
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
    id: 'technical',
    label: 'Technische Docs',
    icon: <Code className="w-4 h-4 text-accent-blue" />,
    children: [
      { id: 'architecture', label: 'Architektur' },
      { id: 'api', label: 'API-Referenz' },
      { id: 'security', label: 'Sicherheit' },
    ],
  },
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
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Suchen..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition"
              />
            </div>

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
          <div className="max-w-3xl">
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
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
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
              <p className="text-muted-foreground leading-relaxed mb-8">
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

            {/* ############################################################################ */}

            {/* Search & Results */}
            <section id="search" className="mb-16 scroll-mt-24">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Suche & Ergebnisse
              </h3>
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h4 className="font-semibold text-foreground mb-3">
                    Problembeschreibung eingeben
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Auf der Startseite finden Sie ein Textfeld, in das Sie Ihr rechtliches Anliegen
                    beschreiben können. Beschreiben Sie Ihr Problem so detailliert wie möglich,
                    damit wir die bestmöglichen Ergebnisse liefern können.
                  </p>
                  <div className="bg-secondary/40 rounded-lg p-4 border border-border">
                    <p className="text-sm font-medium text-foreground mb-2">
                      Tipps für bessere Ergebnisse:
                    </p>
                    <ul className="space-y-2">
                      {[
                        'Beschreiben Sie die Situation konkret und sachlich',
                        'Nennen Sie relevante Rechtsgebiete, falls bekannt',
                        'Geben Sie an, ob es zeitlich dringlich ist',
                        'Erwähnen Sie bereits unternommene Schritte',
                      ].map((tip) => (
                        <li
                          key={tip}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h4 className="font-semibold text-foreground mb-3">Ergebnisse verstehen</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Nach der Eingabe zeigt JuriLib eine Liste passender Organisationen an. Jede
                    Organisation wird mit einer Kurzbeschreibung, Rechtsgebieten und
                    Kontaktmöglichkeiten angezeigt. Die Ergebnisse werden nach Relevanz sortiert.
                  </p>
                </div>
              </div>
            </section>

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

            {/* Technical Docs */}
            <section id="technical" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                  <Code className="w-5 h-5" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                  Technische Dokumentation
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Technische Details zur JuriLib-Plattform für Entwickler und technische Teams.
              </p>
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

            {/* Security */}
            <section id="security" className="mb-16 scroll-mt-24">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Sicherheit
              </h3>
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Datenschutz und Sicherheit sind bei JuriLib von höchster Priorität.
                </p>
                <div className="space-y-3">
                  {[
                    {
                      title: 'Datenverschlüsselung',
                      desc: 'Alle Daten werden über HTTPS/TLS übertragen und verschlüsselt gespeichert.',
                    },
                    {
                      title: 'DSGVO-konform',
                      desc: 'Die Plattform erfüllt alle Anforderungen der Datenschutz-Grundverordnung.',
                    },
                    {
                      title: 'Vertraulichkeit',
                      desc: 'Ihre Falldaten werden vertraulich behandelt und nicht an Dritte weitergegeben.',
                    },
                    {
                      title: 'Regelmäßige Audits',
                      desc: 'Sicherheitsüberprüfungen und Penetrationstests werden regelmäßig durchgeführt.',
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <Shield className="w-4 h-4 text-primary shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                  Häufige Fragen
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    q: 'Ist die Nutzung von JuriLib kostenlos?',
                    a: 'Ja, die Suche und Vermittlung an Organisationen ist für Privatpersonen vollständig kostenlos.',
                  },
                  {
                    q: 'Bietet JuriLib selbst Rechtsberatung an?',
                    a: 'Nein, JuriLib vermittelt an passende Organisationen und Beratungsstellen. Wir selbst bieten keine Rechtsberatung an.',
                  },
                  {
                    q: 'Wie werden meine Daten geschützt?',
                    a: 'Alle Daten werden verschlüsselt übertragen und gespeichert. Wir sind vollständig DSGVO-konform. Weitere Details finden Sie im Abschnitt Sicherheit.',
                  },
                  {
                    q: 'Muss ich ein Konto erstellen?',
                    a: 'Für die Suche ist kein Konto nötig. Für die Fallverwaltung und das Dashboard wird jedoch ein Konto benötigt.',
                  },
                  {
                    q: 'Welche Rechtsgebiete werden abgedeckt?',
                    a: 'JuriLib deckt ein breites Spektrum ab, darunter Mietrecht, Arbeitsrecht, Familienrecht, Sozialrecht, Verbraucherrecht und weitere.',
                  },
                  {
                    q: 'Kann ich als Organisation bei JuriLib mitmachen?',
                    a: "Ja, Rechtsberatungsorganisationen können sich über den Bereich 'Für Juristen' für eine Partnerschaft bewerben.",
                  },
                ].map((faq) => (
                  <details key={faq.q} className="bg-card border border-border rounded-xl group">
                    <summary className="flex items-center justify-between p-5 cursor-pointer list-none text-sm font-medium text-foreground hover:text-primary transition-colors">
                      {faq.q}
                      <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-90 shrink-0 ml-4" />
                    </summary>
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </div>
                  </details>
                ))}
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
