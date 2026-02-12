'use client';

//https://stackoverflow.com/questions/77041616/how-to-fix-referenceerror-navigator-is-not-defined-during-build
//WebSpeechAPI only exits on client
import {
  ArrowUp,
  BriefcaseBusiness,
  Building2,
  CarFront,
  Clock,
  ReceiptText,
  X,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import scale_logo from '~/public/scale_logo.svg';

import { Button } from '../ui/button';
const SpeechToText = dynamic(() => import('./SpeechToText'), { ssr: false });

// Find filtered Organizations...
// Form will be submitted on button click or Enter key press
// New line can be added with Shift + Enter
// If the input is empty, an error message will be displayed
// When reentering the input field, the error message will be cleared
export function ProblemSearchField({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [problem, setProblem] = useState(getCachedProblem());
  const [cachedInquiries, setCachedInquiries] = useState(getCachedInquiries());

  const [error, setError] = useState('');
  const [isRecordingDone, setIsRecordingDone] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Cache problemText whenever it changes
  useEffect(() => {
    sessionStorage.setItem('problemText', problem);
  }, [problem]);

  function getCachedProblem(): string {
    return sessionStorage.getItem('problemText') ?? '';
  }

  function setCachedProblem(query: string) {
    setProblem(query);
    sessionStorage.setItem('problemText', query);
  }

  function getCachedInquiries(): string[] {
    const stored = sessionStorage.getItem('cachedInquiries');
    return stored ? JSON.parse(stored) : [];
  }
  function removeCachedInquiry(query: string) {
    const filteredProblems = cachedInquiries.filter((problem) => problem !== query);
    setCachedInquiries(filteredProblems);
    sessionStorage.setItem('cachedInquiries', JSON.stringify(filteredProblems));
  }

  function addCachedInquiry(query: string) {
    setCachedInquiries((prev) => {
      const filteredProblems = prev.filter((problem) => problem !== query);
      const updatedInquiries = [query, ...filteredProblems].slice(0, 5);
      sessionStorage.setItem('cachedInquiries', JSON.stringify(updatedInquiries));
      return updatedInquiries;
    });
  }

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
    setIsSubmitted(true);
    addCachedInquiry(problem);
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
          placeholder="Erzähle uns von deiner Situation. Was ist passiert? Welche Parteien sind beteiligt? Je mehr Details du angibst, desto besser können wir dir helfen..."
          className="w-full px-4 md:px-5 py-4 bg-transparent text-foreground placeholder-muted-foreground/60 resize-none focus:outline-none text-base leading-relaxed min-h-70"
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

      <p className="hidden md:block text-center text-sm text-muted-foreground pb-5d">
        {problem.length < 10 && 'Bitte geben Sie mindestens 10 Zeichen ein.'}
      </p>
      {cachedInquiries.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground text-center mb-3 flex items-center justify-center gap-2">
            <Clock className="text-base text-center" />
            Letzte Suchanfragen:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {cachedInquiries.map((query, index) => (
              <Button
                key={`history-${index}`}
                type="button"
                variant="outline"
                size="sm"
                className="bg-card text-accent-gray hover:bg-primary hover:text-primary-foreground border-accent-gray hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => setCachedProblem(query)}
              >
                <span className="truncate max-w-50">{query}</span>
                <span
                  role="button"
                  tabIndex={0}
                  className="ml-2 opacity-50 hover:opacity-100 hover:text-destructive transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCachedInquiry(query);
                  }}
                >
                  <X className="w-3 h-3" />
                </span>
              </Button>
            ))}
          </div>
        </div>
      )}

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
              className="bg-primary text-background hover:bg-accent-gray hover:text-primary-foreground border-accent-gray hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
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
