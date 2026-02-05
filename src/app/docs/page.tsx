'use client';

import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Code,
  Database,
  FileText,
  Globe,
  HelpCircle,
  Lock,
  Menu,
  MessageSquare,
  Monitor,
  RefreshCw,
  Scale,
  Search,
  Settings,
  Shield,
  Smartphone,
  Sparkles,
  Users,
  X,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useState } from 'react';

type SectionId =
  | 'getting-started'
  | 'user-guide'
  | 'search'
  | 'organizations'
  | 'case-management'
  | 'account'
  | 'technical'
  | 'architecture'
  | 'api'
  | 'security'
  | 'faq';

interface NavItem {
  id: SectionId;
  label: string;
  icon: React.ReactNode;
  children?: { id: string; label: string }[];
}

const navItems: NavItem[] = [
  {
    id: 'getting-started',
    label: 'Erste Schritte',
    icon: <Zap className="w-4 h-4 text-accent-blue" />,
  },
  {
    id: 'user-guide',
    label: 'Benutzerhandbuch',
    icon: <BookOpen className="w-4 h-4 text-accent-blue" />,
    children: [
      { id: 'search', label: 'Suche & Ergebnisse' },
      { id: 'organizations', label: 'Organisationen' },
      { id: 'case-management', label: 'Fallverwaltung' },
      { id: 'account', label: 'Konto & Profil' },
    ],
  },
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
    id: 'faq',
    label: 'FAQ',
    icon: <HelpCircle className="w-4 h-4 text-accent-blue" />,
  },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const scrollToSection = (id: SectionId) => {
    setActiveSection(id);
    setMobileNavOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="bg-primary text-primary-foreground p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110">
                  <Scale className="w-5 h-5" />
                </div>
                <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-3 h-3 text-accent" />
                </div>
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight">JuriLib</span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-sm text-muted-foreground border-l border-border pl-4">
              <BookOpen className="w-4 h-4" />
              Dokumentation
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden md:inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Zur Startseite
            </Link>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar Navigation - Desktop */}
        <aside className="hidden md:block w-64 shrink-0 border-r border-border sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
          <nav className="p-4 flex flex-col gap-1">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                      <button
                        key={child.id}
                        onClick={() => scrollToSection(child.id as SectionId)}
                        className={`text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
                          activeSection === child.id
                            ? 'text-primary font-medium'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Mobile Navigation Overlay */}
        {mobileNavOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm pt-[73px]">
            <nav className="p-4 flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-73px)]">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition"
                />
              </div>
              {navItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === item.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                  {item.children && (
                    <div className="ml-6 mt-1 flex flex-col gap-0.5 border-l border-border pl-3 mb-2">
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => scrollToSection(child.id as SectionId)}
                          className="text-left px-2 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-border">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Zur Startseite
                </Link>
              </div>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-4 md:px-8 lg:px-12 py-8 md:py-12">
          <div className="max-w-3xl">
            {/* Getting Started */}
            <section id="getting-started" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                  <Zap className="w-5 h-5" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                  Erste Schritte
                </h1>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                JuriLib verbindet Menschen mit rechtlichen Anliegen mit passenden Organisationen und
                Beratungsstellen. Diese Dokumentation hilft Ihnen, die Plattform optimal zu nutzen.
              </p>

              {/* Quick Start Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  {
                    icon: <Search className="w-5 h-5" />,
                    title: 'Problem beschreiben',
                    desc: 'Beschreiben Sie Ihr Anliegen in eigenen Worten.',
                  },
                  {
                    icon: <Users className="w-5 h-5" />,
                    title: 'Ergebnisse erhalten',
                    desc: 'Passende Organisationen werden angezeigt.',
                  },
                  {
                    icon: <MessageSquare className="w-5 h-5" />,
                    title: 'Kontakt aufnehmen',
                    desc: 'Nehmen Sie direkt Kontakt auf.',
                  },
                ].map((card) => (
                  <div
                    key={card.title}
                    className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
                  >
                    <div className="text-primary mb-3">{card.icon}</div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{card.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
                  </div>
                ))}
              </div>

              {/* Supported Platforms */}
              <div className="bg-secondary/30 border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-3">Systemvoraussetzungen</h3>
                <div className="flex flex-wrap gap-4">
                  {[
                    { icon: <Monitor className="w-4 h-4" />, label: 'Desktop Browser' },
                    { icon: <Smartphone className="w-4 h-4" />, label: 'Mobile Browser' },
                    { icon: <Globe className="w-4 h-4" />, label: 'Chrome, Firefox, Safari, Edge' },
                  ].map((platform) => (
                    <span
                      key={platform.label}
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      {platform.icon}
                      {platform.label}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* User Guide */}
            <section id="user-guide" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                  Benutzerhandbuch
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Detaillierte Anleitungen zu allen Funktionen der JuriLib-Plattform.
              </p>
            </section>

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
