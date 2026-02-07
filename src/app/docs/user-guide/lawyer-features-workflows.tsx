import { ChevronRight } from 'lucide-react';

export function LawyerFeaturesWorkflows() {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <p className="text-l text-foreground font-bold leading-relaxed mb-4">Registrierung</p>
      <p className="text-m text-foreground/80 leading-relaxed">
        Beim Registrieren kannst du Informationen zu dir bereit stellen. Nutze diese Möglichkeit
        gerne. Diese Informationen helfen später Nutzer*innen dich zu finden. Falls du
        beispielsweise nicht nur auf deutsch Beratung anbietest, ist es super das anzugeben, da
        Nutzer*innen danach filtern können.
      </p>
      <br />
      <p className="text-m text-foreground/80 leading-relaxed">
        Um sicherzustellen, dass unsere Nutzer*innen nur von qualifizierten Menschen beraten werden
        müssen wir deine Qualifikationen im Registrierungsprozess testen. Keine Sorge, dabei handelt
        es sich nicht um ein Bewerbungsgespräch, sondern wir prüfen nur deine juristische
        Ausbildung. Stelle daher sicher, dass du entsprechende Nachweise beim Registrieren
        griffbereit hast.
      </p>
      <br />
      <p className="text-m text-foreground/80 leading-relaxed mb-8">
        Wir prüfen die Nachweise asynchron und melden uns bei dir, sobald wir Neuigkeiten haben.
      </p>
      <p className="text-ml text-foreground/90 font-medium leading-relaxed mb-2">
        Verwaltung von Organisationen
      </p>
      <p className="text-m text-foreground/80 leading-relaxed mb-2">
        Alle Jurist*innen müssen einer Organisation zugeordnet sein. Die Organisation wird von einer
        oder mehreren Juris*innen verwaltet.
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
  );
}
