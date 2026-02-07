import { ChevronRight } from 'lucide-react';

export function LawyerFAQ() {
  return (
    <div className="space-y-4">
      {[
        {
          q: 'Ich arbeite bei mehreren Organisationen. Kann ich Jurilib für alle nutzen?',
          a: [
            'Ja, sofern die Organisationen bei Jurilib sind, geht das Problemlos. Sollte eine Organisation noch nicht bei Jurilib sein, kannst du das jeder Zeit nachholen. Weitere Informationen dazu findest du unter \"Registrierung\".',
            'Aus technischen Gründen ist es derzeit jedoch nicht möglich einen Account mit mehreren Organisationen zu verknüpfen. Du müsstest dich daher für alle Organisationen neu registrieren (mit unterschiedlichen E-Mailadressen).',
            'Der Registrierungsprozess geht nach dem ersten Mal jedoch deutlich schneller, da die Prüfung deiner Qualifikationen schon stattgefunden hat.',
          ],
        },
        {
          q: 'Wie viele Jurist*innen können in einer Organisation registriert sein?',
          a: [
            'Es gibt keine Begrenzung für die Anzahl der Jurist*innen, die in einer Organisation registriert sein können. Jede Organisation kann so viele Jurist*innen registrieren, wie sie benötigt.',
            'Bei bis zu drei Jurist*innen pro Oranisation ist die Nutzung von JuriLib komplett kostenfrei.',
          ],
        },
        {
          q: 'Was passiert, wenn eine Person einen Termin bei mir bucht, aber der Fall nicht zu mir passt?',
          a: [
            'Nutzer*innen können Termine erstmal nur anfragen und nicht direkt buchen. Das gibt dir die Möglichkeit die Anfrage zu prüfen und gegebenenfalls Rückfragen zu stellen.',
            'Danach kannst du entscheiden, ob du die Anfrage bestätigst oder ablehnst.',
          ],
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
