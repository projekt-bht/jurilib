import { useState } from "react"
import { LoadingIndicator } from "../LoadingIndicator/LoadingIndicator"
import { Navbar } from "../Navbar/Navbar"

export function LandingPage() {
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    //Replace with fetch later
    await new Promise((resolve) => setTimeout(resolve, 2500))
    setLoading(false)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingIndicator />
      </>
    )
  }

  return (
    <>
    <Navbar />
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="text-center max-w-2xl w-full">
        
        <h1 className="text-black text-xl font-bold mb-2">
          Beschreibe dein Problem
        </h1>
        <p className="text-black mb-6">
          Teile uns dein rechtliches Anliegen mit
        </p>

        <div className="mb-6">
          <textarea
            placeholder="Beginne hier zu schreiben..."
            className="text-black
                       bg-gray-100 
                        focus:outline-none 
                        w-full 
                        p-5 
                        border
                        rounded-lg 
                      border-gray-100
                        shadow-sm"
          />
        </div>

        <button onClick={load} className="bg-black text-white text-lg p-4 rounded-full ">
          Passende Lösung finden
        </button>

        <p className="text-gray-400 text-sm mt-10">
          Deine Anfrage wird vertraulich behandelt
        </p>
      </div>
    </div>
    </>
  )
}
