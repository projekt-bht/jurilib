'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ProblemSearchField() {
  // Find filtered Organizations...

  const [problem, setProblem] = useState('');
  const router = useRouter();

  async function load() {
    try {
      router.push(`/search/${problem}`);
    } catch (err) {
      throw new Error('Could not load search results: ' + (err as Error).message);
    }
  }

  return (
    <>
      <div className="mb-6">
        <textarea
          className=" text-foreground bg-input focus:outline-none w-full p-4 border border-border rounded-lg shadow-sm min-h-15 h-60 resize-none"
          value={problem}
          onChange={(e) => {
            setProblem(e.target.value);
          }}
          placeholder="Beginne hier zu schreiben..."
        />
      </div>

      <button
        onClick={() => {
          load();
        }}
        className="bg-primary text-primary-foreground font-bold p-2 pr-3 pl-3 rounded-full"
      >
        Passende Lösung finden
      </button>
    </>
  );
}
