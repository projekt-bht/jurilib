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

// wichtige Regel für ESM: alle Imports NACH den Mocks als Konstanten!
const { render, screen } = await import('@testing-library/react');
const { ProblemSearchField } = await import('../ProblemSearchField');

describe('Test ProblemSearchField', () => {
  it('renders the component text', async () => {
    render(
      <ProblemSearchField
        onSubmit={function (text: string): void {
          // Mock function
        }}
      />
    );
    expect(screen.getByText(/Dein rechtliches Anliegen/i)).toBeInTheDocument();
  });
});
