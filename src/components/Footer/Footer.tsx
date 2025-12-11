import { Scale } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Scale className="w-5 h-5" />
              </div>
              <span className="font-semibold text-foreground">JuriLib</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Wir demokratisieren den Zugang zum Recht!
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Plattform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition">
                  Für Nutzer*innen
                </Link>
              </li>
              <li>
                <Link href="/lawyers" className="hover:text-foreground transition">
                  Für Jurist*innen
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-foreground transition">
                  Für Uns
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Rechtliches</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/impressum" className="hover:text-foreground transition">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition">
                  Nutzungsbedingungen
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Kontakt</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="mailto:support@jurilib.de" className="hover:text-foreground transition">
                  support@jurilib.de
                </Link>
              </li>
              <li>
                <Link href="tel:+491234567890" className="hover:text-foreground transition">
                  +49 1234567890
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 JuriLib</p>
        </div>
      </div>
    </footer>
  );
}
