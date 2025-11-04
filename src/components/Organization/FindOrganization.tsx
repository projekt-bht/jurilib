'use client';

import { useState } from "react";

export function FindOrganization() {
  // Find filtered Organizations...

  const [problem, setProblem] = useState('')
  
  return (

    <>
      <div className="mb-6">
        <textarea
          value={problem}
          onChange={(e) => {setProblem(e.target.value)}}
          placeholder="Beginne hier zu schreiben..."
          className=" text-black bg-gray-100 focus:outline-none w-full p-5 border rounded-lg border-gray-100 shadow-sm"
        />
      </div>

      <button onClick={() => { console.log(problem) }} className="bg-blue-200 text-black font-bold p-2 pr-3 pl-3 rounded-full">
        Passende Lösung finden
      </button>

      
    </>

  )
}