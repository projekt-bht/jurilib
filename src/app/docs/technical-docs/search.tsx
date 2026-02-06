import { CheckCircle2 } from 'lucide-react';

export function Search() {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <h4 className="font-semibold text-foreground mb-3">Problembeschreibung eingeben</h4>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Auf der Startseite finden Sie ein Textfeld, in das Sie Ihr rechtliches Anliegen
          beschreiben können. Beschreiben Sie Ihr Problem so detailliert wie möglich, damit wir die
          bestmöglichen Ergebnisse liefern können.
        </p>
        <div className="bg-secondary/40 rounded-lg p-4 border border-border">
          <p className="text-sm font-medium text-foreground mb-2">Tipps für bessere Ergebnisse:</p>
          <ul className="space-y-2">
            {[
              'Beschreiben Sie die Situation konkret und sachlich',
              'Nennen Sie relevante Rechtsgebiete, falls bekannt',
              'Geben Sie an, ob es zeitlich dringlich ist',
              'Erwähnen Sie bereits unternommene Schritte',
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
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
          Nach der Eingabe zeigt JuriLib eine Liste passender Organisationen an. Jede Organisation
          wird mit einer Kurzbeschreibung, Rechtsgebieten und Kontaktmöglichkeiten angezeigt. Die
          Ergebnisse werden nach Relevanz sortiert.
        </p>
      </div>
    </div>
  );
}
