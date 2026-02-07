import { TriangleAlert } from 'lucide-react';

export function Disclaimer() {
  return (
    <div className="bg-accent-red-light border border-border rounded-xl p-6">
      <h3 className="text-l font-bold text-foreground mb-4 flex items-center gap-2">
        <TriangleAlert className="w-5 h-5" />
        Disclaimer
      </h3>
      <p className="text-m text-foreground leading-relaxed">
        Im folgenden wird die User Dokumentation aus der Sicht von Jurist*innen beschrieben. JuriLib
        ist für Juris*innen jedoch aktuell noch nicht nutzbar.
      </p>
      <br />
      <p className="text-m text-foreground leading-relaxed">
        Wir haben uns aus zwei Gründen entschlossen trotzdem die Doku zu schreiben.
      </p>
      <p className="text-m text-foreground leading-relaxed">
        <b>1. </b> Die Nutzung von Jurilib durch Jurist*innen stellt einen essenziellen Teil der
        Anwendung dar.
      </p>
      <p className="text-m text-foreground leading-relaxed">
        <b>2. </b> Wir haben Abläufe definiert und große Teile des Backends für Employees schon
        implementiert. Auch wenn die Endpunkte noch nicht öffentlich zur Verfügung steht, ist das
        Grundgerüst dafür schon da.
      </p>
      <p className="text-m text-foreground leading-relaxed">
        Die Endpunkte für die Registierung, Anmeldung und sogar Terminverwaltung wurden schon
        Impementiert, wenn auch mit Lücken.
      </p>
      <br />
      <p className="text-m text-foreground leading-relaxed">
        Daruch, dass die Implementierung noch nicht abgeschlossen ist, stehen die beschriebenen
        Funktionen und Workflows nicht für den Ist-Stand, sondern beschreiben teils schon
        implementierte, aber nicht nutzbare und teils geplante Funktionen.
      </p>
      <br />
      <p className="text-m text-foreground leading-relaxed">
        <b>Was Fehlt noch?</b>
      </p>
      <ul className="list-disc list-inside text-m text-foreground leading-relaxed">
        <li>Es gibt noch kein Frontend für Jurist*innen.</li>
        <li>Es Fehlt die Verifizierung der juristischen Ausbildung während der Registrierung.</li>
        <li>
          Verwaltung von Organisationen: Organisationen sollen insofern keine eigenen Instanzen
          abbilden, dass sie nur über Employees (mit bestimmten Rollen) verwaltet werden sollen.
          Dieses Constraint ist noch nicht eingebaut.
        </li>
      </ul>
    </div>
  );
}
