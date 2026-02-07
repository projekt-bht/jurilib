import { ChevronRight } from 'lucide-react';

export function UserFeaturesWorkflows() {
  return (
    <div className="bg-card border mb-8 border-border rounded-xl p-6">
      <p className="text-m text-foreground/80 leading-relaxed mb-4">
        Wenn du nicht angemeldet bist kannst du:
      </p>
      <div className="space-y-3 mb-8">
        {[
          {
            title: 'Eine Suche starten',
            desc: 'Dir werden passende Organisationen angezeigt, die dir bei deinem Anliegen helfen können.',
          },
          {
            title: 'Organisationen entdecken',
            desc: 'Du kannst auch ohne Suche Organisationen entdecken. Gehe dazu in der oberen Navigation auf "Organisationen".',
          },
          {
            title: 'Organisationen filtern',
            desc: 'Du kannst in der Übersicht aller Organisationen nach verschiedenen Kriterien filtern, um die passenden Angebote zu finden.',
          },
        ].map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-1" />
            <div>
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              <p className="text-sm text-foreground/80">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-m text-foreground/80 leading-relaxed mb-4">
        Wenn du angemeldet bist kannst du zusätzlich:
      </p>
      <div className="space-y-3">
        {[
          {
            title: 'Einen Termin anfragen',
            desc: [
              'Sobald du eine passende Organisation gefunden hast, kannst du direkt einen Termin anfragen. Dazu kannst du auf der Seite der Organisation einen Termin auswählen und anfragen.',
              'Die Organisation erhält deine Anfrage und kann diese bestätigen oder ablehnen. Sobald die Organisation deine Anfrage bestätigt, ist der Termin für dich gebucht und es wird ein Fall angelegt.',
            ],
          },
          {
            title: 'Dashboard nutzen',
            desc: 'Im Dashboard siehst du alle Termine und aktiven und abgeschlossenen Fälle auf einen Blick.',
          },
          {
            title: 'Status verfolgen',
            desc: [
              'Jeder Fall und jeder Termin hat einen Status.',
              'Für Fälle: Offen, In Bearbeitung oder Abgeschlossen.',
              'Für Termine: Angefragt, Bestätigt, Abgesagt oder Abgeschlossen.',
            ],
          },
          {
            title: 'Weitere Termine anfragen',
            desc: [
              'Du kannst jederzeit weitere Termine anfragen, auch bei anderen Organisationen. Du bist nicht auf eine Organisation beschränkt.',
              'Neue Termine kannst du wie gehabt entweder über die Suche oder über die Übersicht aller Organisationen finden und anfragen.',
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
