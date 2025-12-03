'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RegisterModal from './RegisterModal';

export default function AuthButtons() {
  const router = useRouter();

  const [showRegisterModal, setShowRegisterModal] = useState(false);

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
