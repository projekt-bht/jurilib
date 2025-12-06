'use client';

import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Organization profile error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-card flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-accent-white rounded-2xl shadow-lg p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Etwas ist schiefgelaufen</h1>
          <p className="text-foreground">
            Beim Laden des Organisationsprofils ist ein Fehler aufgetreten.
          </p>
        </div>

        {error.message && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
            <p className="text-sm text-destructive font-mono">{error.message}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={reset}
            className="flex-1 bg-accent-blue hover:bg-accent-blue/90 text-accent-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Erneut versuchen
          </Button>
          <Button asChild variant="outline" className="flex-1 bg-transparent">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Zur Startseite
            </Link>
          </Button>
        </div>

        <p className="text-sm text-foreground pt-4">
          Wenn das Problem weiterhin besteht, kontaktieren Sie uns unter{' '}
          <a href="mailto:support@jurilib.de" className="text-accent-blue hover:underline">
            support@jurilib.de
          </a>
        </p>
      </div>
    </div>
  );
}
