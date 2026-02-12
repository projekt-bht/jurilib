export default function Impressum() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-3xl mx-auto px-6 py-12 text-left">
        <h1 className="text-5xl font-bold text-foreground mb-8 text-balance">Impressum</h1>
        <div className="space-y-10 text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">Angaben gemäß § 5 TMG</h2>
            <p>Berliner Hochschule für Technik (BHT)</p>
            <p>Luxemburger Str. 10</p>
            <p>13353 Berlin</p>
            <p>Deutschland</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">Projektkontext</h2>
            <p>
              Diese Webanwendung wurde im Rahmen des Studiengangs
              <strong className="font-semibold text-foreground"> Medieninformatik</strong> an der
              Berliner Hochschule für Technik (BHT) entwickelt, im Modul
              <strong className="font-semibold text-foreground"> Projekt</strong>.
            </p>
            <p>
              Sie dient ausschließlich Lehr- und Demonstrationszwecken. Es handelt sich nicht um ein
              kommerzielles Angebot, sondern um einen akademischen Prototyp im Entwicklungs- bzw.
              Beta-Stadium.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">Haftung und Inhalte</h2>
            <p>
              Die Inhalte dieser Website wurden im Rahmen eines Studienprojekts erarbeitet und
              dienen der technischen sowie konzeptionellen Demonstration.
            </p>
            <p>
              Trotz sorgfältiger Ausarbeitung im Projektkontext kann keine Gewähr für die
              Richtigkeit, Vollständigkeit oder Aktualität der bereitgestellten Informationen
              übernommen werden.
            </p>
            <p>
              Alle dargestellten Organisationen, Personen, Rechtsberatungsangebote, Bewertungen und
              sonstigen Inhalte sind vollständig fiktiv.
            </p>
            <p>Es bestehen keinerlei reale Bezüge zu existierenden Personen oder Institutionen.</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">Keine Rechtsberatung</h2>
            <p>Diese Plattform bietet keine tatsächliche Rechtsberatung an.</p>
            <p>
              Sämtliche Inhalte, Hinweise, Empfehlungen und Vermittlungsangebote sind Bestandteil
              eines universitären Demonstrationsprojekts. Sie ersetzen keine professionelle
              rechtliche Beratung.
            </p>
            <p>
              Für konkrete rechtliche Fragestellungen wenden Sie sich bitte an eine entsprechend
              qualifizierte Rechtsberatung.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">Urheberrecht</h2>
            <p>
              Die im Rahmen dieses Projekts erstellten Inhalte, Texte, Konzepte, Designs sowie der
              zugrunde liegende Quellcode unterliegen dem deutschen Urheberrecht.
            </p>
            <p>
              Die Urheber- und Nutzungsrechte an diesem Projekt liegen ausschließlich bei den
              beteiligten Projektmitgliedern.
            </p>
            <p>
              Eine Vervielfältigung, Bearbeitung, Verbreitung oder sonstige Verwertung außerhalb der
              Grenzen des Urheberrechts ist ohne vorherige schriftliche Zustimmung des Projektteams
              nicht gestattet.
            </p>
          </section>
          <div className="border-t border-border pt-6 text-sm text-foreground">
            Zuletzt aktualisiert: Februar 2026
          </div>
        </div>
      </div>
    </div>
  );
}
