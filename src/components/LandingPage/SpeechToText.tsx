'use client';

import { Mic } from 'lucide-react';
import { useEffect } from 'react';
import useSpeechToText, { ResultType } from 'react-hook-speech-to-text';

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

  return (
    <>
      {!error ? (
        <Mic
          onClick={isRecording ? stopSpeechToText : startSpeechToText}
          className={`rounded-full size-10 p-2 absolute bottom-6 right-6 
                      ${isRecording ? 'bg-red-400' : 'bg-gray-200'}`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Mic>
      ) : (
        <p>Web Speech API is not available in this browser</p>
      )}
    </>
  );
}
