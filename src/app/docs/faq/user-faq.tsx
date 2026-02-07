import { ChevronRight } from 'lucide-react';

export function UserFAQ() {
  return (
    <div className="space-y-4">
      {[
        {
          q: 'Ist Jurilib für mich als Nutzer*in Kostenpflichtig?',
          a: [
            'Nein! Da es unser Ziel ist den Zugang zum Recht zu demokratisieren ist Jurilib für Nutzer*innen komplett kostenfrei.',
            'ACHTUNG: Das bezieht sich nur auf die Nutzung von Jurilib. Für die juristische Betreuung kann das anders sein!',
          ],
        },
        {
          q: 'Muss ich ein Konto erstellen?',
          a: [
            'Für die Suche ist kein Konto nötig. Für die Fallverwaltung und das Dashboard wird jedoch ein Konto benötigt.',
            'Sobald du eine Registrierung erforderlich ist, wirst du darauf hingewiesen und kannst dich mit deiner E-Mail-Adresse registrieren.',
          ],
        },
        {
          q: 'Fallen Gebühren an, wenn ich einen Termin absage?',
          a: 'Pauschal können wir diese Frage nicht beantworten, da jede Organisation ihre eigenen Regelungen hat.',
        },
        {
          q: 'Wieso wird ein Termin erstmal nur angefragt und nicht direkt gebucht?',
          a: 'Weil wir den Jurist*innen die Möglichkeit geben wollen, die Anfragen zu prüfen und gegebenenfalls Rückfragen zu stellen, bevor sie einen Termin bestätigen. So können sie sicherstellen, dass sie die nötigen Informationen haben, um einzuschätzen, ob sie die richtigen sind um den Fall zu betreuen und eine fundierte Beratung zu gewährleisten.',
        },
      ].map((faq) => (
        <details key={faq.q} className="bg-card border border-border rounded-xl group">
          <summary className="flex items-center justify-between p-5 cursor-pointer list-none text-sm font-medium text-foreground hover:text-primary transition-colors">
            {faq.q}
            <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-90 shrink-0 ml-4" />
          </summary>
          <div className="px-5 pb-5 pt-0">
            {Array.isArray(faq.a) ? (
              faq.a.map((text, idx) => (
                <p key={idx} className="text-sm text-foreground/80 leading-relaxed mb-3">
                  {text}
                </p>
              ))
            ) : (
              <p className="text-sm text-foreground/80 leading-relaxed">{faq.a}</p>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
