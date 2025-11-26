import { fireEvent, render, screen } from '@testing-library/react';

import { UserForm } from '@/components/Register/UserForm';
import type { SubmissionState, UserFormState } from '@/types/registerTypes';

const baseSubmission: SubmissionState = { type: 'idle' };
const baseState: UserFormState = {
  name: '',
  email: '',
  password: '',
};

const renderUserForm = (overrideState?: Partial<UserFormState>, submission?: SubmissionState) => {
  const onFieldChange = jest.fn();
  const onCancel = jest.fn();
  const onSubmit = jest.fn((event) => event.preventDefault());

  render(
    <UserForm
      formState={{ ...baseState, ...overrideState }}
      isSubmitting={false}
      submissionState={submission ?? baseSubmission}
      onFieldChange={onFieldChange}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );

  return { onFieldChange, onCancel };
};

test('UserForm propagates field changes', () => {
  const { onFieldChange } = renderUserForm();

  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Alice' } });
  fireEvent.change(screen.getByLabelText('E-Mail'), { target: { value: 'alice@test.de' } });
  fireEvent.change(screen.getByLabelText('Passwort'), { target: { value: 'supersecret' } });

  expect(onFieldChange).toHaveBeenNthCalledWith(1, 'name', 'Alice');
  expect(onFieldChange).toHaveBeenNthCalledWith(2, 'email', 'alice@test.de');
  expect(onFieldChange).toHaveBeenNthCalledWith(3, 'password', 'supersecret');
});

test('triggers cancel callback through the outline button', () => {
  const { onCancel } = renderUserForm();

  fireEvent.click(screen.getByRole('button', { name: 'Abbrechen' }));

  expect(onCancel).toHaveBeenCalledTimes(1);
});

test('displays error message when submission state is error', () => {
  renderUserForm(undefined, {
    type: 'error',
    message: 'Validierung fehlgeschlagen',
  });

  expect(screen.getByText('Validierung fehlgeschlagen')).toBeInTheDocument();
});
