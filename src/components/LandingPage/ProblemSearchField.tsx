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
          value={problem}
          onChange={(e) => {
            setProblem(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Beginne hier zu schreiben..."
          className=" text-black bg-gray-100 focus:outline-none w-full p-5 border rounded-lg border-gray-100 shadow-sm"
        />
      </div>

      <button
        type="submit"
        className="bg-(--color-bg-button) text-black font-bold p-2 pr-3 pl-3 rounded-full"
      >
        Passende Lösung finden
      </button>
    </form>
  );
}
