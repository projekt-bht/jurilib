// Navbar.test.tsx
import { jest } from '@jest/globals';

// Mocks müssen HOCHGEHOISTED + awaited werden (ESM-Regel)
jest.unstable_mockModule('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.unstable_mockModule('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

jest.unstable_mockModule('@/services/api', () => ({
  getLogin: async () => null,
  deleteLogin: async () => {},
  postLogin: async () => {},
  register: async () => {},
  postResendCode: async () => {},
  patchAccountPasswordWithEmail: async () => {},
  postVerify: async () => {},
}));

jest.unstable_mockModule('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => '/test-path',
}));

// top-level await
const { render, screen } = await import('@testing-library/react');
const { Navbar } = await import('./Navbar');
const { LoginContext } = await import('@/app/LoginContext');

describe('Test NavBar', () => {
  beforeEach(() => {
    // Avoid opening the first-visit info modal in tests to keep the DOM stable.
    window.localStorage.setItem('jurilib_info_modal_seen', '1');
  });

  it('renders the component text', async () => {
    render(
      <LoginContext.Provider value={{ login: false, setLogin: jest.fn() }}>
        <Navbar />
      </LoginContext.Provider>
    );

    expect(await screen.findByText(/JuriLib/i)).toBeInTheDocument();
    expect(screen.getByText(/Organisationen/i)).toBeInTheDocument();
    expect(screen.getByText(/Einloggen/i)).toBeInTheDocument();
    expect(screen.getByText(/Das Team/i)).toBeInTheDocument();
    expect(screen.getByText(/Du bist Jurist/i)).toBeInTheDocument();
  });
});
