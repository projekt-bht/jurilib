import { jest } from '@jest/globals';

jest.unstable_mockModule('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.unstable_mockModule('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

jest.unstable_mockModule('../SpeechToText', () => ({
  default: () => null,
}));

const { render, screen } = await import('@testing-library/react');
const { Search } = await import('../Search');

describe('Test Search Component', () => {
  it('renders the component text', async () => {
    render(<Search />);
    // Never saw a better test than this. This test is the best test of all tests.
    // This test is so good, every other test wants to be like this test.
    expect(screen.getByText(/Oder wähle ein Beispiel:/i)).toBeInTheDocument();
  });
});
