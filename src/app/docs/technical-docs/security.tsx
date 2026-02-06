import { Shield } from 'lucide-react';

export function Security() {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        Datenschutz und Sicherheit sind bei JuriLib von höchster Priorität.
      </p>
      <div className="space-y-3">
        {[
          {
            title: 'Datenverschlüsselung',
            desc: 'Alle Daten werden über HTTPS/TLS übertragen und verschlüsselt gespeichert.',
          },
          {
            title: 'DSGVO-konform',
            desc: 'Die Plattform erfüllt alle Anforderungen der Datenschutz-Grundverordnung.',
          },
          {
            title: 'Vertraulichkeit',
            desc: 'Ihre Falldaten werden vertraulich behandelt und nicht an Dritte weitergegeben.',
          },
          {
            title: 'Regelmäßige Audits',
            desc: 'Sicherheitsüberprüfungen und Penetrationstests werden regelmäßig durchgeführt.',
          },
        ].map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <Shield className="w-4 h-4 text-primary shrink-0 mt-1" />
            <div>
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
