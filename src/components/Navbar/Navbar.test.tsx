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

jest.unstable_mockModule('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// top-level await
const { render, screen } = await import('@testing-library/react');
const { Navbar } = await import('./Navbar');

describe('Test NavBar', () => {
  it('renders the component text', () => {
    render(<Navbar />);
    expect(screen.getByText(/JuriLib/i)).toBeInTheDocument();
    expect(screen.getByText(/Organisationen/i)).toBeInTheDocument();
    expect(screen.getByText(/Registrieren/i)).toBeInTheDocument();
  });
});
