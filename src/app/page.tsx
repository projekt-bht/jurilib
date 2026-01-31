'use client';
import { UserDashboard } from '@/components/dashboard/_components/user/UserDashboard';
import { LandingPage } from '@/components/landingPage/LandingPage';

import { useLoginContext } from './LoginContext';

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { login, setLogin } = useLoginContext();

  // TODO: Fallunterscheidung zwischen Employee und User über die Ressource im Login Context
  if (login) {
    return (
      <div className="min-h-screen bg-card">
        <UserDashboard />
      </div>
    );
  }

  return <LandingPage />;
}
