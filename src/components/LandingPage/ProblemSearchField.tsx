'use client';

import { Mic } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';

// Find filtered Organizations...
// Form will be submitted on button click or Enter key press
// New line can be added with Shift + Enter
// If the input is empty, an error message will be displayed
// When reentering the input field, the error message will be cleared
export function ProblemSearchField() {
  const [problem, setProblem] = useState('');
  const [_error, setError] = useState('');
  const router = useRouter();

  const {
    error,
    interimResult,
    isRecording,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    speechRecognitionProperties: {
      lang: 'de-DE',
      interimResults: true // Allows for displaying real-time speech results
    },
    continuous: true,
    useLegacyResults: false
  });

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

  /*
  const formattedTranscript = results.map(result => result.transcript).join('');

  useEffect(() => {
    if(results.length > 0)
      setProblem(formattedTranscript)
  }, [results.length]);

  useEffect(() => {
    if(!isRecording) {
      setResults([])
    }
  }, [isRecording])

  */

  useEffect(() => {
    if (interimResult) {
      setProblem(interimResult);
    }
  }, [interimResult]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    // handle empty input
    if (!problem.trim()) {
      setError('Bitte beschreibe dein Problem.');
      return;
    }

    stopSpeechToText()

    try {
      router.push(`/search/${problem}`);
    } catch (err) {
      throw new Error('Could not load search results: ' + (err as Error).message);
    }
  }

  // Handle Enter key for submission
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <textarea
          className=" text-foreground bg-input focus:outline-none w-full p-4 border border-border rounded-lg shadow-sm min-h-15 h-60 resize-none"
          value={problem || interimResult}
          onChange={(e) => {
            setProblem(e.target.value);
          }}
          onFocus={() => setError('')}
          onKeyDown={handleKeyDown}
          placeholder="Beginne hier zu schreiben..."
        />
      </div>

      {/*Display error message, if error is truthy*/}
      {_error && <p className="text-foreground mb-4">{_error} </p>}

      <Mic 
        onClick={isRecording ? stopSpeechToText : startSpeechToText}
        className={isRecording ? 'bg-red-400 rounded-full size-10 p-2' : 'bg-gray-200 rounded-full size-10 p-2'}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </Mic>

      <button
        type="submit"
        className="bg-primary text-primary-foreground hover:bg-primary-hover hover:text-primary-foregroundfont-bold p-2 pr-3 pl-3 rounded-full"
      >
        Passende Lösung finden
      </button>
    </form>
  );
}
