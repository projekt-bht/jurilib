import { Download, Globe, Monitor } from 'lucide-react';

export function TechnicalRequirements() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {[
        {
          icon: <Monitor className="w-5 h-5" />,
          title: 'Endgerät',
          desc: 'Internet-fähiges Endgerät (idealer Weise ein Laptop / Computer).',
        },
        {
          icon: <Globe className="w-5 h-5" />,
          title: 'Browser',
          desc: 'Du brauchst einen Browser. Wir empfehlen für die beste Erfahrung eine aktuelle Browser-Version zu nutzen.',
        },
        {
          icon: <Download className="w-5 h-5" />,
          title: 'Keine Installation',
          desc: 'Du musst nichts installieren, um Jurilib nutzen zu können.',
        },
      ].map((card) => (
        <div
          key={card.title}
          className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
        >
          <div className="text-primary mb-3">{card.icon}</div>
          <h3 className="font-semibold text-foreground text-sm mb-1">{card.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
        </div>
      ))}
    </div>
  );
}
