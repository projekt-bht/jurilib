import { fireEvent, render, screen } from '@testing-library/react';

import { OrganizationForm } from '@/components/Register/OrganizationForm';
import type { OrganizationFormState, SubmissionState } from '@/types/registerTypes';
import { AREA_OPTIONS } from '@/utils/formHelpers';
import { OrganizationType } from '~/generated/prisma/enums';

const baseSubmission: SubmissionState = { type: 'idle' };
const baseState: OrganizationFormState = {
  contactName: '',
  contactEmail: '',
  password: '',
  organizationName: '',
  phone: '',
  website: '',
  address: '',
  description: '',
  organizationType: OrganizationType.LAW_FIRM,
  expertiseArea: [],
};

const renderOrganizationForm = (
  overrideState?: Partial<OrganizationFormState>,
  submission?: SubmissionState,
  isSubmitting = false
) => {
  const onFieldChange = jest.fn();
  const onToggleArea = jest.fn();
  const onCancel = jest.fn();
  const onSubmit = jest.fn((event) => event.preventDefault());

  render(
    <OrganizationForm
      formState={{ ...baseState, ...overrideState }}
      isSubmitting={isSubmitting}
      submissionState={submission ?? baseSubmission}
      onFieldChange={onFieldChange}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onToggleArea={onToggleArea}
    />
  );

  return { onFieldChange, onToggleArea, onCancel };
};

test('OrganizationForm updates organization type via onFieldChange', () => {
  const { onFieldChange } = renderOrganizationForm();

  fireEvent.click(screen.getByRole('button', { name: 'Verband' }));

  expect(onFieldChange).toHaveBeenCalledWith('organizationType', OrganizationType.ASSOCIATION);
});

test('OrganizationForm toggles expertise areas', () => {
  const firstArea = AREA_OPTIONS[0];
  const { onToggleArea } = renderOrganizationForm();

  fireEvent.click(screen.getByText(firstArea));

  expect(onToggleArea).toHaveBeenCalledWith(firstArea);
});

test('OrganizationForm shows submission errors', () => {
  renderOrganizationForm(
    undefined,
    { type: 'error', message: 'Mindestens ein Fachgebiet wählen' },
    true
  );

  expect(screen.getByText('Mindestens ein Fachgebiet wählen')).toBeInTheDocument();
});
