'use client';

//https://stackoverflow.com/questions/77041616/how-to-fix-referenceerror-navigator-is-not-defined-during-build
//WebSpeechAPI only exits on client
import { ArrowUp, BriefcaseBusiness, Building2, CarFront, ReceiptText } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';

import scale_logo from '~/public/scale_logo.svg';

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

  const exampleSearches = [
    {
      icon: ReceiptText,
      title: 'Erbrecht',
      description:
        'Ich habe eine Erbschaft erhalten und bin unsicher, wie ich das Testament richtig auslege und meine Rechte wahrnehme.',
    },
    {
      icon: Building2,
      title: 'Mietrecht',
      description:
        'Mein Vermieter hat mir eine Mieterhöhung geschickt, die ich für unfair halte, und ich möchte wissen, welche Optionen ich habe.',
    },
    {
      icon: CarFront,
      title: 'Verkehrsrecht',
      description:
        'Ich hatte einen Auffahrunfall und möchte wissen, wer haftet und welche Schritte ich rechtlich einleiten kann.',
    },
    {
      icon: BriefcaseBusiness,
      title: 'Arbeitsrecht',
      description:
        'Mein Arbeitgeber hat mir ohne Vorwarnung gekündigt, und ich möchte prüfen, ob die Kündigung rechtens ist.',
    },
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
  }

  // Handle Enter key for submission
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative bg-background rounded-2xl transition-all duration-500 shadow-lg border border-border">
        <div className="flex items-center gap-2 px-4 md:px-5 pt-4 pb-2 border-b border-border/80">
          <Image
            src={scale_logo}
            alt="JuriLib Logo"
            width={20}
            height={20}
            className="text-foreground"
          />
          <span className="text-sm font-medium text-foreground">Dein rechtliches Anliegen</span>
        </div>
        <SpeechToText setText={setProblem} isRecordingDone={isRecordingDone} />
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setError('')}
          placeholder="Erzählen uns von deiner Situation. Was ist passiert? Welche Parteien sind beteiligt? Je mehr Details du angibst, desto besser können wir dir helfen..."
          className="w-full px-4 md:px-5 py-4 bg-transparent text-foreground placeholder-muted-foreground/60 resize-none focus:outline-none text-base leading-relaxed min-h-[280px]"
        />

        {/*Display error message, if error is truthy*/}
        {error && <p className="text-foreground mb-4">{error} </p>}

        <div className="flex items-center justify-between px-4 md:px-5 pb-2 pt-2 border-t border-border/50">
          <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 leading-none">
              <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px] font-mono leading-tight">
                Enter
              </kbd>
              <span className="leading-tight">Absenden</span>
            </span>
            <span className="flex items-center gap-1.5 leading-none">
              <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px] font-mono leading-tight">
                Shift + Enter
              </kbd>
              <span className="leading-tight">Neue Zeile</span>
            </span>
          </div>

          <div className="md:hidden text-xs text-muted-foreground">
            {problem.length > 0 && <span>{problem.length} Zeichen</span>}
          </div>

          <button
            type="submit"
            disabled={problem.length < 10}
            className={`flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              problem.length >= 10
                ? 'bg-primary text-primary-foreground hover:shadow hover:bg-foreground/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            Passende Lösung finden
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="hidden md:block text-center text-xs text-muted-foreground">
        {problem.length < 10 && 'Bitte geben Sie mindestens 10 Zeichen ein.'}
      </p>

      <span className="text-lg text-accent-foreground text-center mt-4 mb-4">
        Oder wähle ein Beispiel:
      </span>
      <div className="flex flex-wrap gap-4 justify-center pt-4 mb-8">
        {exampleSearches.map((example) => {
          const Icon = example.icon;
          return (
            <Button
              key={example.title}
              type="button"
              variant="outline"
              size="sm"
              className="bg-accent-gray-light/60 text-foreground hover:bg-primary hover:text-primary-foreground border-accent-gray/40 hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => {
                setProblem(example.description);
              }}
            >
              <Icon className="w-4 h-4 mr-1 inline-block" />
              {example.title}
            </Button>
          );
        })}
      </div>
    </form>
  );
}
