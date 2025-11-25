import Image from 'next/image';
import Link from 'next/link';
import { Building2 } from 'lucide-react';

import { Login } from '@/components/Login/Login';
import scale_logo from '~/public/scale_logo.svg';

export function Navbar() {
  return (
    <nav className="bg-background text-foreground flex items-center justify-between p-5 mx-auto border border-border">
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
        <Link href="/organization" className="flex items-center gap-x-2">
          <Building2 className="text-foreground" size={24} />
          <p>Organisationen</p>
        </Link>
        <Login />
      </div>
    </nav>
  );
}
