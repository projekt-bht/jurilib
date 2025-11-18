import { FindOrganization } from '../Organization/FindOrganization';

export function LandingPage() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="text-center max-w-2xl w-full">
        <h1 className="text-black text-xl font-bold mb-2">Beschreibe dein Problem</h1>
        <p className="text-black mb-6">Teile uns dein rechtliches Anliegen mit</p>

        <FindOrganization />

        <p className="text-gray-400 text-sm mt-10">Deine Anfrage wird vertraulich behandelt</p>
      </div>
    </div>
  );
}
