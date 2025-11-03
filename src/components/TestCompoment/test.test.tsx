import { render, screen } from '@testing-library/react';

import Test from '@/components/TestCompoment/test';

describe('Test component', () => {
  it('renders the component text', () => {
    render(<Test />);
    expect(
      screen.getByText(/Hallo aus dem Components-Ordner!/i)
    ).toBeInTheDocument();
  });
});

