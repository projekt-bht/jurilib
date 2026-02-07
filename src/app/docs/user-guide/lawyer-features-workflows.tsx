import { Ban, ChevronRight, Loader, SquareCheckBig } from 'lucide-react';

export function LawyerFeaturesWorkflows() {
  return (
    <>
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex gap-2 text-l text-foreground font-bold leading-relaxed items-center mb-4">
          <Loader className="w-4 h-4 text-primary shrink-0 m-1" />
          Registrierung
        </div>

        <p className="text-m text-foreground/80 leading-relaxed">
          Beim Registrieren kannst du Informationen zu dir bereit stellen. Nutze diese Möglichkeit
          gerne. Diese Informationen helfen später Nutzer*innen dich zu finden. Falls du
          beispielsweise nicht nur auf deutsch Beratung anbietest, ist es super das anzugeben, da
          Nutzer*innen danach filtern können.
        </p>
        <br />
        <p className="text-m text-foreground/80 leading-relaxed">
          Um sicherzustellen, dass unsere Nutzer*innen nur von qualifizierten Menschen beraten
          werden müssen wir deine Qualifikationen im Registrierungsprozess testen. Keine Sorge,
          dabei handelt es sich nicht um ein Bewerbungsgespräch, sondern wir prüfen nur deine
          juristische Ausbildung. Stelle daher sicher, dass du entsprechende Nachweise beim
          Registrieren griffbereit hast.
        </p>
        <br />
        <p className="text-m text-foreground/80 leading-relaxed mb-8">
          Wir prüfen die Nachweise asynchron und melden uns bei dir, sobald wir Neuigkeiten haben.
        </p>

        <div className="flex gap-2 text-ml text-foreground/90 font-medium leading-relaxed items-center mb-2">
          <Ban className="w-4 h-4 text-primary shrink-0 m-1" />
          Verwaltung von Organisationen
        </div>

        <p className="text-m text-foreground/80 leading-relaxed mb-2">
          Alle Jurist*innen müssen einer Organisation zugeordnet sein. Die Organisation wird von
          einer oder mehreren Jurist*innen verwaltet.
        </p>
        <div className="space-y-3 ">
          {[
            {
              title: 'Ist deine Organisation schon bei Jurilib?',
              desc: 'Super! Dann musst du nach unserer Freigabe noch von einer Person mit Verwaltungsberechtigungen für deine Organisation freigegeben werden.',
            },
            {
              title: 'Ist deine Organisation noch nicht bei Jurilib?',
              desc: [
                'Da Organisationen nur mit Jurist*innen rechtliche Beratung anbieten kann wird eine Organisation erstellt, wenn die erste Person die sich für diese Organisation registriert. Damit gewährleistet ist, dass die Organisation verwaltet werden kann erhält diese Person automatisch Verwaltungsberechtigungen für die Organisation auf Jurilib. Um an dieser Stelle Missbrauch zu vorzubeugen führen wir auch hier eine Prüfung durch. Stelle daher sicher, dass du neben den nachweisen über deine Qualifizierung auch Nachweise deiner Verwaltungsberechtigung der Organisation zur Hand hast.',
                'Wir Prüfen die Verwaltungsberechtigung gemeinsam mit den weiteren Nachweisen und melden uns dann bei dir.',
              ],
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

      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex gap-2 text-l text-foreground font-bold leading-relaxed items-center mb-4">
          <Loader className="w-4 h-4 text-primary shrink-0 m-1" />
          Termine
        </div>

        <div className="space-y-3 ">
          {[
            {
              statusIcon: 'SquareCheckBig',
              title: 'Termine einstellen',
              desc: 'Als Jurist*in kannst du belieb viele Termine auf unserer Plattform anlegen. Diese werden in der Übersicht deiner zugehörigen Organisation sichtbar und können von nutzenden Personen gebucht werden.',
            },
            {
              statusIcon: 'SquareCheckBig',
              title: 'Termine einsehen',
              desc: 'Egal, ob Termine nur angelegt, schon bestätigt, oder weiter angepasst wurden. Jeder Termin ist einsehbar.',
            },
            {
              statusIcon: 'SquareCheckBig',
              title: 'Termine bestätigen/ablehnen',
              desc: [
                'Sobald ein*e Nutzer*in einen Termin angefragt haben, werden dir diese Termine separat in deinem Dashboard dargestellt und über einen Klick näher inspiziert oder bestätigt werden.',
                'Solltest du während dieses Prozesses, oder auch im Nachhinein, bemerken, dass der Termin abgelehnt werden muss, kannst du dies selbstverständlich mit wenig Aufwand und einem ähnlichen Prozess durchführen.',
                ' Solltest du den Termin lediglich ablehnen, wird dieser nun wieder frei zur Buchung für alle nutzenden Personen stehen.',
              ],
            },
            {
              statusIcon: 'SquareCheckBig',
              title: 'Termine manuell anpassen',
              desc: 'Müssen an dem Zeitpunkt, der Zeitdauer, einem Meetinglink oder weiteren Eigenschaften Änderungen vorgenommen werden, ist JuriLib für dich da! Jeder deiner Termine ist flexibel, auch nach Erstellung, einstellbar.',
            },
            {
              statusIcon: 'Ban',
              title: 'Termine löschen',
              desc: 'Sollten Termine final abgesagt werden, können diese ohne viel Aufwand und mit automatischer Mail an eventuell betroffene Nutzer*innen, gelöscht werden.',
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
    </>
  );
}
