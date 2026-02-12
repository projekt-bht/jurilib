import { ArrowUpRight, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import scale_logo from '~/public/scale_logo.svg';

export function Footer() {
  return (
    <footer className="bg-foreground border-t border-border">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              {/*Logo source: https://de.vecteezy.com/gratis-vektor/verwaltungssymbol */}
              <Image
                src={scale_logo}
                alt="JuriLib Logo"
                width={25}
                height={25}
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <span className="font-semibold text-background">JuriLib</span>
            </div>
            <p className="text-background text-sm">
              Wir demokratisieren <br />
              den Zugang zum Recht!
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-background mb-4">Plattform</h4>
            <ul className="space-y-2 text-sm text-background">
              <li>
                <Link
                  href="/docs"
                  className="hover:text-background transition flex items-center gap-2 group"
                >
                  Dokumentation
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link
                  href="/lawyers"
                  className="hover:text-background transition flex items-center gap-2 group"
                >
                  Für Jurist*innen
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="hover:text-background transition flex items-center gap-2 group"
                >
                  Für Uns
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-background mb-4">Rechtliches</h4>
            <ul className="space-y-2 text-sm text-background">
              <li>
                <Link
                  href="/impressum"
                  className="hover:text-background transition flex items-center gap-2 group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Impressum
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link
                  href="/tos"
                  className="hover:text-background transition flex items-center gap-2 group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Nutzungsbedingungen
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-background transition flex items-center gap-2 group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Kontakt
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-background mb-4">Kontakt</h4>
            <ul className="space-y-2 text-sm text-background">
              <li>
                <Link
                  href="mailto:jurilib@web.de"
                  className="hover:text-background transition flex items-center gap-2 group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Mail size={16} aria-label="Mail icon" />
                  jurilib@web.de
                </Link>
              </li>
              <li>
                <Link
                  href="tel:+491234567890"
                  className="hover:text-background transition flex items-center gap-2 group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone size={16} aria-label="Phone icon" />
                  +49 1234567890
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background pt-8 text-center text-background text-sm">
          <p>&copy; 2025 JuriLib</p>
        </div>
      </div>
    </footer>
  );
}
