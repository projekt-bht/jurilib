import { CheckCircle2, FileText, Scale, Users } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: 'Beschreibe Dein Problem',
    description: 'Erzähle uns mit eigenen Worten von Deinem rechtlichen Anliegen',
    iconBgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Scale,
    title: 'Finde Dein Match',
    description: 'Unser Algorithmus findet die besten Anwält*innen für Dein Anliegen',
    iconBgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    icon: Users,
    title: 'Buche Deinen Termin',
    description: 'Vereinbare einen Beratungstermin, der zu Dir passt',
    iconBgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: CheckCircle2,
    title: 'Match!',
    description: 'Dein rechtliches Problem ist nun in guten Händen',
    iconBgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Wie funktioniert JuriLib?
          </h2>
          <p className="text-muted-foreground text-lg">
            Einfache Schritte zu Deiner passenden Rechtsberatung
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center">
                <div className={`${step.iconBgColor} rounded-full p-4 mb-4 border border-border`}>
                  <Icon className={`w-8 h-8 ${step.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
