import { Calendar1, SquareCheckBig, UserRoundPlus } from 'lucide-react';

export function LawyerQuickStart() {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <p className="text-sm text-foreground leading-relaxed mb-4">
        Ermögliche deinen Klient*innen den Zugang zu rechtlicher Unterstützung in drei Schritten:
      </p>

      <div className="space-y-4">
        <div className="bg-secondary/40 rounded-lg p-4 border border-border">
          <UserRoundPlus className="w-4 h-4 text-primary shrink-0 m-1" />
          <p className="text-sm text-foreground">
            <b>Registriere dich</b>
          </p>
          <p className="text-sm text-foreground">
            Registriere dich bei Jurilib. Da wir deine juristische Ausbildung prüfen müssen, kann es
            einige Tage dauern, bis dein Account freigeschaltet wird. Weitere Informationen findest
            du hier. TODO: add Link
          </p>
        </div>

        <div className="bg-secondary/40 rounded-lg p-4 border border-border">
          <Calendar1 className="w-4 h-4 text-primary shrink-0 m-1" />
          <p className="text-sm text-foreground">
            <b>Schalte deine Termine frei</b>
          </p>
          <p className="text-sm text-foreground">
            Damit Nutzer*innen direkt über Jurilib Termine bei dir buchen können musst du Angeben,
            wann du Zeit für Termine hast.
          </p>
        </div>

        <div className="bg-secondary/40 rounded-lg p-4 border border-border">
          <SquareCheckBig className="w-4 h-4 text-primary shrink-0 m-1" />
          <p className="text-sm text-foreground">
            <b>Fertig</b>
          </p>
          <p className="text-sm text-foreground">
            Jetzt bist du startklar. Du kannst Termine und Fälle jetzt bequem über JuriLib
            verwalten.
          </p>
        </div>
      </div>
    </div>
  );
}
