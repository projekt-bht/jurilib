import { Ban, ChevronRight, Loader, SquareCheckBig } from 'lucide-react';

export function LawyerDocument() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8">
      <div className="flex gap-2 text-l text-foreground font-bold leading-relaxed items-center mb-4">
        <Loader className="w-4 h-4 text-primary shrink-0 m-1" />
        Dokumente verwalten
      </div>
      <p className="text-m text-foreground/80 leading-relaxed mb-2">
        Sobald ein Fall eröffnet wurde, ist es dir möglich, bei Beteiligung an diesem Fall,
        Dokumente zu verwalten.
      </p>
      <div className="space-y-3 ">
        {[
          {
            statusIcon: 'SquareCheckBig',
            title: 'Dokumente hochladen',
            desc: 'In der Übersicht deiner Fälle, kannst du auf der Detailseite neue Dokumente hochladen. Diese sind im Folgenden allgemein für alle beteiligte Personen, sowohl für Klient*in, als auch Jurst*innen, verfügbar.',
          },
          {
            statusIcon: 'SquareCheckBig',
            title: 'Dokumente einsehen',
            desc: 'Nach erfolgreichem Upload eines Dokuments, sind diese im Nachhinein über einen Link auf der Detailseite des jeweiligen Falls verfügbar.',
          },
          {
            statusIcon: 'Ban',
            title: 'Dokumente löschen',
            desc: 'Sollten Dokumente nicht länger benötigt sein, oder sogar fälschlicherweise hochgeladen worden sein, können diese ohne große Umwege direkt aus dem Case entfernt werden.',
          },
        ].map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-1" />
            <div>
              <div className="flex gap-1 leading-relaxed items-center">
                {item.statusIcon === 'SquareCheckBig' && (
                  <SquareCheckBig className="w-4 h-4 text-primary shrink-0 mt-1" />
                )}
                {item.statusIcon === 'Ban' && (
                  <Ban className="w-4 h-4 text-primary shrink-0 mt-1" />
                )}

                <p className="text-sm font-medium text-foreground">{item.title}</p>
              </div>
              {Array.isArray(item.desc) ? (
                item.desc.map((line, index) => (
                  <p key={index} className="text-sm text-foreground/80">
                    {line}
                  </p>
                ))
              ) : (
                <p className="text-sm text-foreground/80">{item.desc}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
