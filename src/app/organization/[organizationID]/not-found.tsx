import { ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-br from-accent-blue-light to-accent-purple-light mb-4">
              <Search className="w-12 h-12 text-accent-gray" />
            </div>

            <h1 className="text-5xl font-bold text-foreground">Organisation nicht gefunden</h1>

            <p className="text-xl text-foreground leading-relaxed">
              Die gesuchte Organisation existiert leider nicht oder wurde entfernt. Bitte überprüfen
              Sie die URL oder suchen Sie nach einer anderen Organisation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/">
              <Button size="lg" className="gap-2">
                <ArrowLeft className="w-5 h-5" />
                Zurück zur Startseite
              </Button>
            </Link>

            <Link href="/organization">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                <Search className="w-5 h-5 text-accent-gray" />
                Alle Organisationen durchsuchen
              </Button>
            </Link>
          </div>

          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Benötigen Sie Hilfe? Kontaktieren Sie uns unter{' '}
              <a href="mailto:support@jurilib.de" className="text-accent-blue hover:underline">
                support@jurilib.de
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
