'use client';
import { UserDashboard } from '@/components/dashboard/_components/user/UserDashboard';
import { LandingPage } from '@/components/landingPage/LandingPage';

import { useLoginContext } from './LoginContext';

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { login, setLogin } = useLoginContext();

  if (login) {
    return (
      <div className="min-h-screen bg-background">
        <UserDashboard />
      </div>
    );
  }

  return <LandingPage />;
}
