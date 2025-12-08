'use client';

//https://stackoverflow.com/questions/77041616/how-to-fix-referenceerror-navigator-is-not-defined-during-build
//WebSpeechAPI only exits on client
import dynamic from 'next/dynamic';
import { useState } from 'react';

import { Button } from '../ui/button';
const SpeechToText = dynamic(() => import('./SpeechToText'), { ssr: false });

// Find filtered Organizations...
// Form will be submitted on button click or Enter key press
// New line can be added with Shift + Enter
// If the input is empty, an error message will be displayed
// When reentering the input field, the error message will be cleared
export function ProblemSearchField({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [problem, setProblem] = useState('');
  const [error, setError] = useState('');
  const [isRecordingDone, setIsRecordingDone] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const exampleSearches = [
    'Ich habe Probleme mit meinem Vermieter wegen Mieterhöhung',
    'Mein Arbeitgeber hat mir gekündigt, ich brauche rechtliche Beratung',
    'Ich benötige Hilfe bei einem Verkehrsunfall',
    'Fragen zum Erbrecht und Testament',
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // handle empty input
    if (!problem.trim()) {
      setError('Bitte beschreibe dein Problem.');
      return;
    }

    setIsRecordingDone(true);
    setError('');
    onSubmit(problem);
    setIsSubmitted(true);
  }

  // Handle Enter key for submission
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-6 relative">
          <textarea
            className=" text-foreground bg-input focus:outline-none w-full p-4 border border-border rounded-lg shadow-sm min-h-15 h-60 resize-none"
            value={problem}
            onChange={(e) => {
              setProblem(e.target.value);
            }}
            onFocus={() => setError('')}
            onKeyDown={handleKeyDown}
            placeholder="Beginne hier zu schreiben..."
          />
          <SpeechToText setText={setProblem} isRecordingDone={isRecordingDone} />
        </div>

        {/*Display error message, if error is truthy*/}
        {error && <p className="text-foreground mb-4">{error} </p>}

        <button
          type="submit"
          className="bg-primary text-primary-foreground font-bold hover:bg-primary-hover hover:text-primary-hover-foreground p-2 pr-5 pl-5 rounded-full"
        >
          Passende Lösung finden
        </button>

        <p className="text-accent-gray text-base mt-2 mb-8">
          Deine Anfrage wird vertraulich behandelt
        </p>

        <div
          className={`mt-6 w-full transition-all duration-500 ease-in-out ${
            isSubmitted
              ? 'opacity-0 scale-95 max-h-0 overflow-hidden'
              : 'opacity-100 scale-100 max-h-96'
          }`}
        >
          <span className="text-base text-accent-gray text-center mt-4 mb-4">
            Oder wähle ein Beispiel:
          </span>
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {exampleSearches.map((example) => (
              <Button
                key={example}
                type="button"
                variant="outline"
                size="sm"
                className="bg-card text-accent-gray hover:bg-primary hover:text-primary-foreground border-accent-gray"
                onClick={() => {
                  setProblem(example);
                }}
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
