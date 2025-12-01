'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RegisterModal from './RegisterModal';

// Komponente, die die Anzeige des Registrierungsmodals steuert
export default function AuthButtons() {
  const router = useRouter();
  // Router könnte später genutzt werden, um nach erfolgreicher Registrierung zu navigieren

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  // State, der speichert, ob das Registrierungsmodal gerade sichtbar ist

  // Anzeigen der Login- und Registrieren-Buttons, wenn der Benutzer nicht eingeloggt ist
  return (
    <>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowRegisterModal(true)}
          className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-full transition-colors"
        >
          Registrieren
        </button>
      </div>

      <RegisterModal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
    </>
  );
}
