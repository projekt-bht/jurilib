'use client';
import { Building2, ShieldUser, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { LoginContext } from '@/app/LoginContext';
import { Authentication } from '@/components/Authentication/Authentication';
import { getLogin } from '@/services/api';
import type { LoginResource } from '@/services/Resources';
import scale_logo from '~/public/scale_logo.svg';

export function Navbar() {
  const [login, setLogin] = useState<undefined | false | LoginResource>(undefined);

  useEffect(() => {
    (async () => {
      try {
        const loginFromServer = await getLogin();
        setLogin(loginFromServer);
      } catch {
        setLogin(false);
      }
    })();
  }, []);

  return (
    <LoginContext.Provider value={{ login, setLogin }}>
      <nav className="bg-background text-foreground flex items-center justify-between p-5 mx-auto border border-border fixed w-full z-50">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-foreground p-2 rounded-lg">
            <Image
              src={scale_logo}
              alt="JuriLib Logo"
              width={40}
              height={40}
              className="brightness-0 invert gray"
            />
          </div>
          <span className="text-2xl font-bold">JuriLib</span>
        </Link>

        <div className="flex items-center gap-x-5">
          <Link href="/lawyers" className="flex items-center gap-x-2">
            <ShieldUser className="text-forground" size={24} />
            <p>Du bist Jurist*in?</p>
          </Link>
          <Link href="/team" className="flex items-center gap-x-2">
            <User className="text-forground" size={24} />
            <p>Das Team</p>
          </Link>
          <Link href="/organization" className="flex items-center gap-x-2">
            <Building2 className="text-foreground" size={24} />
            <p>Organisationen</p>
          </Link>
          <Authentication />
        </div>
      </nav>
    </LoginContext.Provider>
  );
}
