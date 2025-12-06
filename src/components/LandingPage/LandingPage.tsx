import HowItWorks from './HowItWorks';
import OurOffer from './OurOffer';
import { ProblemSearchField } from './ProblemSearchField';

export function LandingPage() {
  return (
    <div className="bg-card min-h-screen flex items-center justify-center">
      <div className="text-center w-full mt-10">
        <h1 className="text-foreground text-5xl font-bold mb-2">Beschreibe dein Problem</h1>
        <p className="text-foreground mb-3 py-6 pt-4">Teile uns dein rechtliches Anliegen mit</p>
        <div className="min-w-sm mx-auto max-w-lg">
          <ProblemSearchField />
        </div>
        <HowItWorks />
        <OurOffer />
      </div>
    </div>
  );
}
