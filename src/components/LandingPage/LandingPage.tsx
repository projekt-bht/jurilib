import { ProblemSearchField } from './ProblemSearchField';

export function LandingPage() {
  return (
    <div className="bg-card min-h-screen flex items-center justify-center">
      <div className="text-center max-w-2xl w-full">
        <h1 className="text-foreground text-5xl font-bold mb-2">Beschreibe dein Problem</h1>
        <p className="text-foreground mb-3 py-6 pt-4">Teile uns dein rechtliches Anliegen mit</p>
        <ProblemSearchField />
        <p className="text-muted-foreground text-sm mt-10">
          Deine Anfrage wird vertraulich behandelt
        </p>
      </div>
    </div>
  );
}
