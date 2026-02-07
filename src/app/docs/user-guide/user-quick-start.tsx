import { Calendar1, HandshakeIcon, Search } from 'lucide-react';

export function UserQuickStart() {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <p className="text-sm text-foreground leading-relaxed mb-4">
        Vom Problem zur Lösung in drei Schritten:
      </p>

      <div className="space-y-4">
        <div className="bg-secondary/40 rounded-lg p-4 border border-border">
          <div className="flex gap-2 text-sm text-primary font-bold items-center">
            <Search className="w-4 h-4  shrink-0 m-1" />
            Beschreibe dein Problem
          </div>
          <p className="text-sm text-foreground">
            Beschreibe mit eigenen Worten, wobei du rechtliche Unterstützung brauchst. Gib hierbei
            gerne auch Details an. Außerdem kannst du einen Standort innerhalb Deutschlands mit
            angeben. Wir werden dann versuchen eine passende Organisation möglichst in deiner Nähe
            zu finden.
          </p>
        </div>

        <div className="bg-secondary/40 rounded-lg p-4 border border-border">
          <div className="flex gap-2 text-sm text-primary font-bold items-center">
            <HandshakeIcon className="w-4 h-4 text-primary shrink-0 m-1" />
            Finde dein Match
          </div>
          <p className="text-sm text-foreground">
            Mit unserem Algorithmus entdeckst du schnell die besten Anlaufstellen für dein Anliegen.
            Auch ohne dich zu Registrieren.
          </p>
        </div>

        <div className="bg-secondary/40 rounded-lg p-4 border border-border">
          <div className="flex gap-2 text-sm text-primary font-bold items-center">
            <Calendar1 className="w-4 h-4 text-primary shrink-0 m-1" />
            Buche deinen Termin
          </div>
          <p className="text-sm text-foreground">
            Finde und buche einen Beratungstermin, der perfekt zu dir passt. Dafür musst du dich
            registrieren / einloggen. <b>Fertig!</b>
          </p>
          <p className="text-sm text-foreground">
            Du kannst deine Termine und Fälle jetzt einsehen und verwalten.
          </p>
        </div>
      </div>
    </div>
  );
}
