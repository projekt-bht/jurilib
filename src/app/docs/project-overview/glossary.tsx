export function Glossary() {
  return (
    <>
      <h4 className="text-l font-bold text-foreground mb-1 flex items-center gap-2">
        Nutzer*innen (User)
      </h4>
      <p>Menschen, die Jurilib aus der Perspektive der Suchenden verwenden. </p>
      <br />
      <h4 className="text-l font-bold text-foreground mb-1 flex items-center gap-2">
        Organisationen (Oranization)
      </h4>
      <p>
        Jegliche Instanz, die qualifizierte Rechtsberatung anbietet. Bei uns wird zwischen Kanzleien
        und anderen Instanzen unterschieden. Zu den anderen Instanzen zählen Gewerkschaften,
        Mieter*innenschutz oder auch Verbraucher*innenschutz.
      </p>
      <br />
      <h4 className="text-l font-bold text-foreground mb-1 flex items-center gap-2">
        Mitarbeitende (Employee)
      </h4>
      <p>
        Jurist*innen, die für eine Organisation arbeiten. Andere Mitarbeitende einer Organisation
        (Assistent*innen, etc.) sind explizit nicht gemeint.
      </p>
      <br />
      <h4 className="text-l font-bold text-foreground mb-1 flex items-center gap-2">Services</h4>
      <p>
        Eine bestimmte Dienstleistung, die von Organisationen angeboten wird (z.B. ein
        Erstgespräch).
      </p>
      <br />
      <h4 className="text-l font-bold text-foreground mb-1 flex items-center gap-2">Fall (Case)</h4>
      <p>
        Eine Instanz, die Informationen zu einem juristischen Fall beinhaltet und über die
        Nutzer*innen, und nach erfolgreicher Terminbuchung auch Employees, den Fall verwalten
        können.
      </p>
      <br />
      <h4 className="text-l font-bold text-foreground mb-1 flex items-center gap-2">
        Fallbeschreibung (Search-String???)
      </h4>
      <p>
        Ein String, welcher von den Nutzer*innen entweder über eine Tastatur oder über
        Speech-to-Text eingegeben wurde und anhand dessen passende Organisationen gefunden werden.
      </p>
      <br />
    </>
  );
}
