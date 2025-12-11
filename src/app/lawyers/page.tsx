'use client';

import { Award, Clock, Shield, Star, TrendingUp, Users, Zap } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export default function LawyersPage() {
  const [formData, setFormData] = useState({
    orgName: '',
    orgType: 'Kanzlei',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    specialties: '',
    description: '',
  });

  const benefits = [
    {
      icon: Users,
      title: 'Mehr Mandanten',
      description: 'Erreichen Sie gezielt Menschen, die genau Ihre Expertise benötigen',
      color: 'from-accent-blue/80 to-accent-blue/60',
    },
    {
      icon: Zap,
      title: 'Effiziente Vermittlung',
      description: 'Qualifizierte Anfragen ohne aufwändige Akquise oder Marketing',
      color: 'from-accent-purple/80 to-accent-purple/40',
    },
    {
      icon: TrendingUp,
      title: 'Wachstum',
      description: 'Bauen Sie Ihre Praxis mit kontinuierlichem Mandantenzufluss aus',
      color: 'from-accent-emerald/80 to-accent-emerald/40',
    },
    {
      icon: Shield,
      title: 'Vertrauen',
      description: 'Profitieren Sie von unserem Qualitätssiegel und Bewertungssystem',
      color: 'from-accent-red/80 to-accent-amber/80',
    },
  ];

  const features = [
    {
      icon: Star,
      text: 'Detailliertes Profil für Ihre Organisation',
      color: 'text-accent-amber/70 fill-accent-amber-light',
    },
    {
      icon: Clock,
      text: 'Integriertes Terminbuchungssystem',
      color: 'text-accent-purple/70',
    },
    {
      icon: Award,
      text: 'Bewertungen und Empfehlungen',
      color: 'text-accent-emerald/70',
    },
    {
      icon: Users,
      text: 'Team-Vorstellung und Expertenprofil',
      color: 'text-accent-blue/70',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registration submitted:', formData);
    alert('Vielen Dank für Ihre Registrierung! Wir melden uns in Kürze bei Ihnen.');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-linear-to-b from-primary/5 to-background">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-foreground mb-6 text-balance">
              Du bist Jurist*in?
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty mb-8">
              Werde Teil von JuriLib und erreiche Menschen, die genau deine rechtliche Expertise
              benötigen.
            </p>
            <Button
              onClick={() =>
                document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="bg-primary text-primary-foreground px-8 py-6 text-lg rounded-full hover:bg-primary-hover transition hover:scale-105"
            >
              Jetzt registrieren
            </Button>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Warum JuriLib nutzen?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-2xl transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`bg-linear-to-br ${benefit.color} p-4 rounded-xl inline-block mb-4`}
                  >
                    <benefit.icon className="w-8 h-8 text-accent-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">{benefit.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Was Sie bei uns erwartet
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 bg-card p-6 rounded-xl shadow hover:shadow-2xl border border-border transition-all duration-300 animate-fade-in"
                  >
                    <div className="p-3 rounded-lg">
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <p className="text-lg font-medium text-foreground">{feature.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Registration Form */}
        <section className="py-16 px-4 scroll-mt-32">
          <div id="registration" className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl p-8 shadow-xl border border-border">
              <h2 className="text-3xl font-bold text-foreground text-center mb-2">
                Jetzt registrieren
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                Füllen Sie das Formular aus und wir melden uns innerhalb von 24 Stunden bei Ihnen.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Name der Organisation *
                    </label>
                    <input
                      type="text"
                      name="orgName"
                      required
                      value={formData.orgName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="z.B. Rechtsberatung München"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Art der Organisation *
                    </label>
                    <select
                      name="orgType"
                      required
                      value={formData.orgType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option>Kanzlei</option>
                      <option>Verein</option>
                      <option>Gemeinnützig</option>
                      <option>Beratungsstelle</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Ansprechpartner *
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      required
                      value={formData.contactPerson}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Ihr Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      E-Mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="kontakt@beispiel.de"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+49 123 456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://www.beispiel.de"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Fachbereiche *
                  </label>
                  <input
                    type="text"
                    name="specialties"
                    required
                    value={formData.specialties}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="z.B. Mietrecht, Arbeitsrecht, Familienrecht"
                  />
                  <p className="text-sm text-muted-foreground mt-1">Kommagetrennt eingeben</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Beschreibung Ihrer Organisation
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Beschreiben Sie kurz Ihre Organisation und Ihre Expertise..."
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input type="checkbox" required className="mt-1" />
                  <p className="text-sm text-muted-foreground">
                    Ich stimme den Nutzungsbedingungen und der Datenschutzerklärung zu und möchte
                    über JuriLib Mandanten vermittelt bekommen.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-6 text-lg rounded-full hover:opacity-90 transition"
                >
                  Registrierung abschicken
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
