import { createContext, useContext } from 'react';

import type { LoginResource } from '@/services/Resources';

interface LoginContextType {
  login: LoginResource | false | undefined;
  setLogin: (loginInfo: LoginResource | false) => void;
}

// export only for provider
export const LoginContext = createContext<LoginContextType>({} as LoginContextType);
// export for consumers
export const useLoginContext = () => useContext(LoginContext);
