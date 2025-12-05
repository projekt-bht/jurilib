import { Calendar, FileText, MessageSquare, Scale } from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'Kostenlose Erstberatung',
    description: 'Schildern Sie uns Ihr rechtliches Anliegen - unverbindlich und kostenfrei',
    color: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: Scale,
    title: 'Passende Rechtsberatung finden',
    description: 'Wir vermitteln Sie an spezialisierte Anwält*innen und Beratungsstellen',
    color: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    icon: FileText,
    title: 'Transparente Preise',
    description: 'Alle Kosten werden vorab klar kommuniziert - keine versteckten Gebühren',
    color: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    icon: Calendar,
    title: 'Flexible Termine',
    description: 'Buchen Sie Ihre Beratungstermine einfach und flexibel online',
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
