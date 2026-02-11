import { ChevronRight, SquareCheckBig } from 'lucide-react';

export function LawyerAppointment() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8">
      <div className="flex gap-2 text-l text-foreground font-bold leading-relaxed items-center mb-4">
        <SquareCheckBig className="w-4 h-4 text-primary shrink-0 m-1" />
        Termine
      </div>

      <div className="space-y-3 ">
        {[
          {
            title: 'Termine einstellen',
            desc: 'Als Jurist*in kannst du belieb viele Termine auf unserer Plattform anlegen. Diese werden in der Übersicht deiner zugehörigen Organisation sichtbar und können von nutzenden Personen gebucht werden.',
          },
          {
            title: 'Termine einsehen',
            desc: 'Egal, ob Termine nur angelegt, schon bestätigt, oder weiter angepasst wurden. Jeder Termin ist einsehbar.',
          },
          {
            title: 'Termine bestätigen/ablehnen',
            desc: [
              'Sobald ein*e Nutzer*in einen Termin angefragt haben, werden dir diese Termine separat in deinem Dashboard dargestellt und über einen Klick näher inspiziert oder bestätigt werden.',
              'Solltest du während dieses Prozesses, oder auch im Nachhinein, bemerken, dass der Termin abgelehnt werden muss, kannst du dies selbstverständlich mit wenig Aufwand und einem ähnlichen Prozess durchführen.',
              ' Solltest du den Termin lediglich ablehnen, wird dieser nun wieder frei zur Buchung für alle nutzenden Personen stehen.',
            ],
          },
          {
            title: 'Termine manuell anpassen',
            desc: 'Müssen an dem Zeitpunkt, der Zeitdauer, einem Meetinglink oder weiteren Eigenschaften Änderungen vorgenommen werden, ist JuriLib für dich da! Jeder deiner Termine ist flexibel, auch nach Erstellung, einstellbar.',
          },
          {
            title: 'Termine löschen',
            desc: 'Sollten Termine final abgesagt werden, können diese ohne viel Aufwand und mit automatischer Mail an eventuell betroffene Nutzer*innen, gelöscht werden.',
          },
        ].map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-1" />
            <div>
              <p className="text-sm font-medium text-foreground">{item.title}</p>

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
