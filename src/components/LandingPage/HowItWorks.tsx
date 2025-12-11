import { CheckCircle2, ClipboardClock, MessageSquare, Search } from 'lucide-react';

const steps = [
  {
    icon: MessageSquare,
    title: 'Beschreibe dein Problem',
    description: 'Beschreibe mit eigenen Worten, wobei du rechtliche Unterstützung brauchst.',
    iconBgColor: 'bg-accent-blue-soft shadow-sm',
    iconColor: 'text-accent-blue',
  },
  {
    icon: Search,
    title: 'Finde dein Match',
    description:
      'Mit unserem Algorithmus entdeckst du schnell die besten Angebote für dein Anliegen.',
    iconBgColor: 'bg-accent-emerald-light shadow-sm',
    iconColor: 'text-accent-emerald',
  },
  {
    icon: ClipboardClock,
    title: 'Buche deinen Termin',
    description: 'Finde und buche einen Beratungstermin, der perfekt zu dir passt.',
    iconBgColor: 'bg-accent-purple-light shadow-sm',
    iconColor: 'text-accent-purple',
  },
  {
    icon: CheckCircle2,
    title: 'Match!',
    description: 'Dein rechtliches Anliegen ist jetzt in sicheren Händen.',
    iconBgColor: 'bg-accent-amber-light shadow-sm',
    iconColor: 'text-accent-amber',
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
              <div
                key={index}
                className="bg-background flex flex-col items-center text-center shadow-lg rounded-lg p-6 border border-border hover:shadow-xl transition-all duration-300"
              >
                <div className={`${step.iconBgColor} rounded-full p-4 mb-4`}>
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
