'use client';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { getLogin } from '@/services/api';
import type { LoginResource } from '@/services/Resources';

import { LoginContext } from './LoginContext';

type AppProps = {
  children: ReactNode;
};

/**
 * The Idea of this component is to make the LoginProviderContext accessable for all the Children
 */

export default function App({ children }: AppProps) {
  const [login, setLogin] = useState<undefined | false | LoginResource>(undefined);

  useEffect(() => {
    (async () => {
      const loginFromServer = await getLogin();
      setLogin(loginFromServer);
    })();
  }, []);

  if (login === undefined) return <></>;

  return <LoginContext.Provider value={{ login, setLogin }}>{children}</LoginContext.Provider>;
}
