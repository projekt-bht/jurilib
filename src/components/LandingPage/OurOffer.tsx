import { Calendar, FileText, MessageSquare, Users } from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'Vielfältige Auswahl an Expert*innen',
    description:
      'Bei uns findest du gezielt Kanzleien, Beratungsstellen, Gewerkschaften oder NGOs – je nachdem, wer für dein Anliegen am besten geeignet ist oder wonach du suchst.',
    color: 'bg-accent-blue-soft shadow-sm',
    iconColor: 'text-accent-blue',
  },
  {
    icon: Users,
    title: 'Demokratisierung des Rechts',
    description:
      'Der Zugang zum Recht ist ein fundamentales Menschenrecht und die Grundlage für ein selbstbestimmtes Leben. Deshalb ist es unsere Philosophie, rechtliche Hilfe für alle gleichermaßen zugänglich zu machen.',
    color: 'bg-accent-emerald-light shadow-sm',
    iconColor: 'text-accent-emerald',
  },
  {
    icon: FileText,
    title: 'Transparente Preise',
    description:
      'Entstehende Kosten werden dir transparent mitgeteilt – es gibt keine versteckten Gebühren.',
    color: 'bg-accent-purple-light shadow-sm',
    iconColor: 'text-accent-purple',
  },
  {
    icon: Calendar,
    title: 'Wenige Klicks bis zum Termin',
    description:
      'Mit JuriLib findest du in wenigen Minuten die Rechtsberatung, die genau zu dir passt – schnell, einfach und digital.',
    color: 'bg-accent-amber-light shadow-sm',
    iconColor: 'text-accent-amber',
  },
];

export default function FeaturesGrid() {
  return (
    <section className="py-16 px-4 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Unser Versprechen an Dich
          </h2>
          <p className="text-muted-foreground text-lg">
            Rechtliche Unterstützung, die genau zu Dir passt!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-background flex flex-col items-center text-center shadow-lg rounded-lg p-6 border border-border hover:shadow-xl transition-all duration-300"
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
