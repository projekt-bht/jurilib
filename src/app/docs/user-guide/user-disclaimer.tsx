import { Ban, Loader, SquareCheckBig, TriangleAlert } from 'lucide-react';

export function Disclaimer() {
  return (
    <div className="bg-accent-red-light border border-border rounded-xl p-6">
      <h3 className="text-l font-bold text-foreground mb-4 flex items-center gap-2">
        <TriangleAlert className="w-5 h-5" />
        Disclaimer
      </h3>
      <p className="text-m text-foreground leading-relaxed">
        Im folgenden wird an einer Stelle ein Feature erwähnt, dass im Backend schon implementiert
        größtenteils implementiert, aber noch nicht durch das frontend nutzbar ist.
      </p>
      <br />
      <p className="text-m text-foreground leading-relaxed">
        Um dieses Feature zu kennzeicheichnen und die Teilfeatures zu kennzeichnen, haben wir sie
        mit folgendem Labels versehen:
      </p>
      <div className="flex gap-2 text-sm text-primary items-center">
        <SquareCheckBig className="w-4 h-4 text-primary shrink-0 m-1" />
        Diese Funktion ist im Backend bereits vollständig implementiert
      </div>

      <div className="flex gap-2 text-sm text-primary items-center">
        <Loader className="w-4 h-4 text-primary shrink-0 m-1" />
        Diese Funktion ist im Backend bereits teilweise implementiert
      </div>

      <div className="flex gap-2 text-sm text-primary items-center">
        <Ban className="w-4 h-4 text-primary shrink-0 m-1" />
        Diese Funktion ist noch nicht implementiert, aber in Planung
      </div>
    </div>
  );
}
