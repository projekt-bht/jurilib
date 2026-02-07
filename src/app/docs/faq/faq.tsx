import { ChevronRight } from 'lucide-react';

export function FAQ() {
  return (
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
  );
}
