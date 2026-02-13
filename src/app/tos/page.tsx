import { AlertTriangle, Database, FileText, Gavel, Globe, ShieldCheck, Users } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nutzungsbedingungen - JuriLib',
  description:
    'Nutzungsbedingungen der JuriLib-Plattform. Erfahren Sie mehr ueber die Bedingungen zur Nutzung unserer Dienste.',
};

const sections = [
  {
    id: 'geltungsbereich',
    icon: Globe,
    title: '1. Geltungsbereich',
    content: [
      'Diese Nutzungsbedingungen gelten für die Nutzung der rein fiktiven Plattform JuriLib, abrufbar unter jurilib.de (nachfolgend „Plattform"). Betreiber der Plattform ist die JuriLib GmbH, ein ausschließlich zu Demonstrationszwecken im Rahmen eines universitären Projekts gegründetes fiktives Unternehmen.',
      'Die Plattform stellt keine echten Dienstleistungen bereit und verarbeitet keine echten Nutzerdaten. Mit der Nutzung der Plattform erkennen Sie an, dass es sich um eine Simulation handelt und keine Rechtsberatung erfolgt. Sollten Sie mit diesen Bedingungen nicht einverstanden sein, nutzen Sie die Plattform bitte nicht.',
    ],
  },
  {
    id: 'leistungsbeschreibung',
    icon: FileText,
    title: '2. Leistungsbeschreibung',
    content: [
      'JuriLib ist eine zu Demonstrationszwecken erstellte digitale Plattform im Rahmen eines Uni-Projekts. Die Plattform simuliert die Verbindung von Privatpersonen mit juristischen Beratungsstellen, Organisationen und Anwälten, um eine Ersteinschätzung rechtlicher Fragestellungen zu veranschaulichen.',
      'Es erfolgen keine echten Rechtsberatungen oder Dienstleistungen. Alle dargestellten Inhalte und Vermittlungen sind fiktiv und dienen ausschließlich der Veranschaulichung.',
    ],
  },
  {
    id: 'registrierung',
    icon: Users,
    title: '3. Registrierung und Nutzerkonto',
    content: [
      'Für die Nutzung der Plattform ist eine Registrierung erforderlich. Die Angaben dienen ausschließlich der Simulation und werden nicht zur tatsächlichen Verarbeitung personenbezogener Daten genutzt.',
      'Zugangsdaten sind vertraulich zu behandeln. Aktivitäten auf dem Nutzerkonto erfolgen auf eigene Verantwortung, wobei keine realen Daten verarbeitet werden. Bei Verdacht auf Missbrauch informieren Sie bitte die Projektverantwortlichen.',
    ],
  },
  {
    id: 'pflichten',
    icon: ShieldCheck,
    title: '4. Pflichten der Nutzenden',
    content: [
      'Die Plattform darf ausschließlich zu Demonstrations- und Lernzwecken genutzt werden. Es ist untersagt, die Plattform für rechtswidrige Zwecke zu verwenden oder falsche Angaben zu machen.',
      'Automatisierte Zugriffe, Beeinträchtigung der Plattform oder Verbreitung rechtswidriger Inhalte sind ausdrücklich verboten.',
    ],
  },
  {
    id: 'haftung',
    icon: AlertTriangle,
    title: '5. Haftungsbeschränkung',
    content: [
      'Da es sich um ein rein fiktives Uni-Projekt handelt, übernimmt JuriLib keine Haftung für die Richtigkeit, Vollständigkeit oder Aktualität der Inhalte. Die Nutzung der Plattform erfolgt ausschließlich auf eigenes Risiko.',
      'Es besteht keinerlei Haftung für Schäden, die aus der Nutzung oder Nichtnutzung der Plattform entstehen. Die Plattform ersetzt keine professionelle Rechtsberatung.',
    ],
  },
  {
    id: 'schlussbestimmungen',
    icon: Gavel,
    title: '6. Schlussbestimmungen',
    content: [
      'Es gilt deutsches Recht. Gerichtsstand ist Berlin.',
      'Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen unberührt.',
      'Die Betreiber behalten sich vor, diese Nutzungsbedingungen jederzeit anzupassen. Änderungen werden im Rahmen des Projekts bekanntgegeben.',
    ],
  },
  {
    id: 'datennutzung',
    icon: Database,
    title: '7. Zusätzlicher Hinweis zur Datennutzung',
    content: [
      'Die Plattform erhebt keine echten personenbezogenen Daten. Alle Datenangaben dienen ausschließlich Demonstrationszwecken und werden nicht gespeichert oder weiterverarbeitet.',
    ],
  },
];

export default function Tos() {
  return (
    <div className="min-h-screen bg-card">
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight text-balance mb-4">
            Nutzungsbedingungen
          </h1>
          <p className="text-lg text-muted-foreground text-balance">
            Bitte lesen Sie diese Nutzungsbedingungen sorgfaeltig durch, bevor Sie unsere Plattform
            nutzen.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Zuletzt aktualisiert: 10. Februar 2026
          </p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <nav className="rounded-2xl border border-border/50 bg-background p-6">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Inhaltsverzeichnis
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-primary shrink-0" />
                      {section.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-12">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <article key={section.id} id={section.id} className="scroll-mt-24">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground pt-1">{section.title}</h2>
                </div>
                <div className="pl-14 space-y-4">
                  {section.content.map((paragraph, idx) => (
                    <p key={idx} className="text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Contact Banner */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-primary/10 bg-accent-blue-soft p-8 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Fragen zu unseren Nutzungsbedingungen?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Kontaktieren Sie uns gerne, wenn Sie Fragen oder Anmerkungen zu unseren Bedingungen
              haben.
            </p>
            <a
              href="mailto:jurilib@web.de"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5 text-sm"
            >
              Kontakt aufnehmen
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
