'use client';

export function ResultLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Loading content */}
      <div className="relative z-10 text-center">
        {/* Animated double spinner */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative w-18 h-18">
            <div className="absolute inset-0 border-4 border-accent-blue rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-accent-blue-soft border-r-accent-blue-soft rounded-full animate-spin" />
            <div
              className="absolute inset-2 border-3 border-transparent border-t-accent-purple border-r-accent-purple rounded-full animate-spin"
              style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
            />
          </div>
        </div>

        {/* Loading text with animated dots */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className="text-4xl font-semibold text-foreground">Analyse läuft</h3>
          <div className="flex gap-1.5 pt-5">
            <span
              className="w-2 h-2 bg-accent-blue rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <span
              className="w-2 h-2 bg-accent-blue rounded-full animate-bounce"
              style={{ animationDelay: '100ms' }}
            />
            <span
              className="w-2 h-2 bg-accent-blue rounded-full animate-bounce"
              style={{ animationDelay: '200ms' }}
            />
          </div>
        </div>

        <p className="text-xl text-muted-foreground">Wir suchen passende Ergebnisse für dich.</p>
      </div>
    </div>
  );
}
