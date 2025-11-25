'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ProblemSearchField() {
  // Find filtered Organizations...
  // Form will be submitted on button click or Enter key press
  // New line can be added with Shift + Enter

  const [problem, setProblem] = useState('');
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
          value={problem}
          onChange={(e) => {
            setProblem(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Beginne hier zu schreiben..."
        />
      </div>

      <button
        type="submit"
        className="bg-primary text-primary-foreground hover:bg-primary-hover hover:text-primary-foregroundfont-bold p-2 pr-3 pl-3 rounded-full"
      >
        Passende Lösung finden
      </button>
    </form>
  );
}
