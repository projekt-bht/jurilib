import { CheckCircle2 } from 'lucide-react';

export function Search() {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <h4 className="font-semibold text-foreground mb-3">Problembeschreibung eingeben</h4>
        <p className="text-sm text-foreground/80 leading-relaxed mb-4">
          Auf der Startseite findest du ein Textfeld, in das du dein rechtliches Anliegen eingeben
          kannst. Beschreibe dein Problem so detailliert wie möglich, damit wir die bestmöglichen
          Ergebnisse liefern können.
        </p>
        <div className="bg-secondary/40 rounded-lg p-4 border border-border">
          <p className="text-sm font-medium text-foreground mb-2">Tipps für bessere Ergebnisse:</p>
          <ul className="space-y-2">
            {[
              'Beschreibe die Situation konkret und sachlich.',
              'Nutze zur Inspiration die Beispiele auf der Startseite (unter dem Eingabefeld).',
              'Nenne gegebenfalls einen Ort, um die Suche geografisch einzugrenzen.',
              'Beschreibe die Situation auch gerne auf Deutsch oder Englisch über die Spracheingabe (unten rechts im Eingabefeld).',
              'Du kannst dein Anliegen auch in anderen Sprachen eingeben, z.B. Englisch oder Arabisch.',
              'Passe deine Beschreibung an, wenn du zu wenige oder unpassende Ergebnisse erhältst. Manchmal können kleine Änderungen in der Formulierung zu besseren Ergebnissen führen.',
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm text-foreground/80">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h4 className="font-semibold text-foreground mb-3">Ergebnisse verstehen</h4>
        <div className="text-sm text-foreground/80 leading-relaxed">
          <p>
            Nach der Eingabe analysiert JuriLib sie und liefert auf der Basis eine Liste passender
            Organisationen zurück. Jede Organisation wird mit einer Kurzbeschreibung,
            Rechtsgebieten, Art der Organisation und Statndort angezeigt. Außerdem kannst du direkt
            auf den ersten Blick sehen, ob es grade freie Termine bei der Organisation gibt. Die
            Ergebnisse werden nach Relevanz sortiert.
          </p>
          <br />
          <p>
            Um weitere Informationen über die Orgenisation wie deren Jurist*innen,
            Kontaktmöglichkeiten oder freie Termine zu erhalten, klicke auf die jeweilige
            Organisation.
          </p>
          <br />
          <p>
            Wenn du mit der Organisation doch nicht zufrieden bist, kannst du zurück zur
            Ergebnisliste gehen, gegebenfalls deine Suche anpassen und sie neu starten.
          </p>
          <br />
          <p>
            Wenn du lieber direkt alle Organisationen durchsuchen möchtest, kannst du auch ohne
            Suche auf die Seite <b>Organisationen</b> gehen. Dort findest du eine Übersicht aller
            Organisationen, die bei JuriLib gelistet sind. Du kannst dort auch nach verschiedenen
            Kriterien filtern, um die passenden Angebote zu finden.
          </p>
        </div>
      </div>
    </div>
  );
}
