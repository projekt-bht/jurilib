'use client';
import { useEffect, useState } from 'react';

import { getUser } from '@/services/api';
import type { UserResource } from '@/services/Resources';
import type { User } from '~/generated/prisma/client';

import { useLoginContext } from '../LoginContext';

export default function Dashboard() {
  const { login } = useLoginContext();
  const [user, setUser] = useState<UserResource | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (login) {
          const user = await getUser(login.userId!);
          setUser(user);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadUser();
  }, [login]);

  if (login === undefined) return <></>;
  if (!login) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-center">
        <h1 className="text-6xl font-bold">Etwas ist schiefgelaufen</h1>
        <p className="mt-4 text-lg">Bitte melde dich an, um dein Dashboard zu sehen</p>
      </div>
    );
  }
  //Add cases and appointments later (case Endpoint missing)
  return (
    <div className="min-h-screen flex flex-col items-center mt-10">
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>
      {user && (
        <div>
          <div>
            <div>
              <span>Name: {user.name}</span>
            </div>
            <div>
              <span>Telefon: {user.phone}</span>
            </div>
            <div>
              <span>Adresse: {user.address}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
