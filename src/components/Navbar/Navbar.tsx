import Link from 'next/link';

import { Login } from '@/components/Login/Login';

export function Navbar() {
  return (
    <nav className="bg-background text-foreground flex items-center justify-between p-5 mx-auto border border-border">
      <div className="flex items-center space-x-2">
        <Link className="text-2xl font-bold" href="/">
          JuriLib
        </Link>
      </div>

      <div className="flex items-center gap-x-5">
        <Link href="/organization">Organisationen</Link>
        <Login />
      </div>
    </nav>
  );
}
