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
}));

// top-level await
const { render, screen } = await import('@testing-library/react');
const { Navbar } = await import('./Navbar');

describe('Test NavBar', () => {
  it('renders the component text', async () => {
    render(<Navbar />);

    expect(await screen.findByText(/JuriLib/i)).toBeInTheDocument();
    expect(screen.getByText(/Organisationen/i)).toBeInTheDocument();
    expect(screen.getByText(/Einloggen/i)).toBeInTheDocument();
    expect(screen.getByText(/Das Team/i)).toBeInTheDocument();
    expect(screen.getByText(/Du bist Jurist/i)).toBeInTheDocument();
  });
});
