'use client';

import { Mic, MicOff } from 'lucide-react';
import { useEffect } from 'react';
import type { ResultType } from 'react-hook-speech-to-text';
import useSpeechToText from 'react-hook-speech-to-text';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Button } from '../ui/button';

type SpeechToTextProps = {
  setText: (text: string) => void;
  isRecordingDone: boolean;
};

export default function SpeechToText({ setText, isRecordingDone }: SpeechToTextProps) {
  //https://github.com/Riley-Brown/react-speech-to-text
  const {
    error,
    interimResult,
    results,
    isRecording,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    speechRecognitionProperties: {
      lang: 'de-DE',
      interimResults: true, // Allows for displaying real-time speech results
    },
    continuous: true,
    useLegacyResults: false,
  });

  //Formatted Transcript... ['hey', 'wie' ..] -> 'hey wie'
  const formattedTranscript =
    (results as ResultType[]).map((result) => result.transcript.trim()).join(' ') +
    (interimResult || '');

  //Stop Recording if user confirms Search
  useEffect(() => {
    if (isRecordingDone && isRecording) stopSpeechToText();
  }, [isRecordingDone]);

  //Clear Results if Recording stops
  useEffect(() => {
    if (!isRecording) setResults([]);
  }, [isRecording]);

  //Set Result Text
  useEffect(() => {
    if (results.length > 0) setText(formattedTranscript);
  }, [interimResult]);

  return !error ? (
    <Mic
      onClick={isRecording ? stopSpeechToText : startSpeechToText}
      className={`rounded-full size-10 p-2 absolute bottom-6 right-6 
                  ${isRecording ? 'bg-accent-red' : 'bg-accent-gray-light'}`}
    >
      {isRecording ? 'Stop Recording' : 'Start Recording'}
    </Mic>
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <MicOff className="rounded-full size-10 p-2 absolute bottom-6 right-6 bg-accent-gray-soft border border-accent-gray-light text-accent-red" />
      </TooltipTrigger>
      <TooltipContent>
        <p>Nicht verfügbar in diesem Browser</p>
      </TooltipContent>
    </Tooltip>
  );
}
