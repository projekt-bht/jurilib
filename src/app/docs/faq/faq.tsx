import { ChevronRight } from 'lucide-react';

export function FAQ() {
  return (
    <div className="space-y-4">
      {[
        {
          q: 'Ist die Nutzung von JuriLib kostenlos?',
          a: [
            'Da es unser Ziel ist den Zugang zum Recht zu demokratisieren ist Jurilib für Nutzer*innen komplett kostenfrei.',
            'ACHTUNG: Das bezieht sich nur auf die Nutzung von Jurilib. Für die juristische Betreuung kann das anders sein!',
            'Uns ist außerdem bewusst, dass nicht alle Organisationen über die selben finanziellen Mittel verfügen. Daher gibt es hier unterschiedliche Reglungen. Mehr Informationen dazu findest du unter \"Kosten\".',
          ],
        },
        {
          q: 'Bietet JuriLib selbst Rechtsberatung an?',
          a: 'Nein, JuriLib vermittelt an passende Organisationen und Beratungsstellen. Wir selbst bieten keine Rechtsberatung an.',
        },
        {
          q: 'Kann ich Jurilib sowohl als Nutzer*in als auch als Jurist*in nutzen?',
          a: 'Ja! Jurilib kann bis zur Terminbuchung aus Nutzer*innen Perspektive sowieso auch ohne Registrierung genutzt werden. Solltest du einen Account für beide Perspektiven haben wollen müsstest du dich allerdings mit unterschiedlichen E-Mailadressen registrieren.',
        },
        {
          q: 'Welche Rechtsgebiete werden abgedeckt?',
          a: 'JuriLib deckt alle offiziell anerkannten Rechtsgebiete ab. Es hängt jedoch von den teilnehmenden Organisationen ab, welche Rechtsgebiete tatsächlich vertreten sind.',
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
