import { Calendar, FileText, MessageSquare, Scale } from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'Vielfältige Auswahl an Expert*innen',
    description:
      'Bei uns findest du spezialisierte Kanzleien, Beratungsstellen, Gewerkschaften oder NGOs – je nachdem, wer für dein Anliegen am besten geeignet ist',
    color: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: Scale,
    title: 'Demokratisierung des Rechts',
    description:
      'Der Zugang zum Recht ist ein menschenrechtliches Gebot und Grundlage für ein selbstbestimmtes Leben. Unsere Kernphilosophie ist es daher, rechtliche Hilfe für alle gleichermaßen zugänglich zu machen.',
    color: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    icon: FileText,
    title: 'Transparente Preise',
    description:
      'Entstehende Kosten werden Dir vorab klar kommuniziert - keine versteckten Gebühren',
    color: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    icon: Calendar,
    title: 'Wenige Klicks bis zum Termin',
    description:
      'Jurilib ist eine digitale Plattform, die dich in wenigen Minuten mit der zu Dir passenden Rechtsberatung verbindet',
    color: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
];

export default function FeaturesGrid() {
  return (
    <section className="py-16 px-4 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Unser Angebot an Dich
          </h2>
          <p className="text-muted-foreground text-lg">
            Rechtliche Unterstützung, die genau zu Dir passt
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-background border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`${feature.color} rounded-lg p-3 w-fit mb-4`}>
                  <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
