import { Info } from 'lucide-react';
import Link from 'next/link';

export function Costs() {
  return (
    <>
      <p>
        Uns ist es sehr wichtig besonders Menschen mit wenig Geld den Zugang zum Recht zu
        ermöglichen. Um das zu fördern ist Jurilib für Unternehmen, die einen{' '}
        <b>Fokus auf Kostenfreie / Kostengünstige Rechtsberatung</b> legen kostenfrei. Gleiches gilt
        für Organisationen mit einem anderen <b>gemeinnützigen Ansatz</b> und solche, die sich
        speziell für <b>marginalisierte Menschen</b> einsetzen.
      </p>
      <br />
      <p>
        Wir bei Jurilib wollen <b>queer-feministische, antirassistische, antiableistische</b> und
        weitere Konzepte fördern, die sich für eine{' '}
        <b>nachhaltige, inklusive und tolerante Gesellschaft</b> einsetzen.
      </p>
      <br />
      <p>
        Für Organisationen mit bis zu <b>drei Jurist*innen </b>(die bei Jurilib registriert sind)
        erheben wir ebenfalls keine Servicegebühren.
      </p>
      <br />
      <p>
        Wir erheben Servicegebühren für alle Organisationen, die nicht in diese Kategorien fallen.
      </p>
      <p>Diese werden im Registrierungsprozess verhandelt.</p>
      <br />
      <div className="bg-accent-blue-light border border-border rounded-xl p-6">
        <h3 className="text-l font-bold text-foreground mb-4 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Du bist die nicht sicher, ob deine Organisation Anspruch auf die kostenfreie Nutzung hat?
        </h3>
        <p className="text-m text-foreground leading-relaxed">
          Kontaktiere uns gerne unter{' '}
          <Link href="mailto:jurilib@web.de">
            <u>jurilib@web.de</u>
          </Link>
          .
        </p>
      </div>
    </>
  );
}
