'use client';

import type { FormEvent } from 'react';
import { useCallback, useState } from 'react';

import type { SubmissionState, UserFormState } from '@/types/registerTypes';
import { getUserFormInitialState } from '@/utils/formHelpers';

type UseUserRegistrationReturn = {
  formState: UserFormState;
  isSubmitting: boolean;
  submissionState: SubmissionState;
  handleFieldChange: (field: keyof UserFormState, value: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  resetForm: () => void;
  resetFeedback: () => void;
};

/**
 * Encapsulates all state-management and submit logic for the user registration
 * flow so the form component stays purely presentational.
 */
export function useUserRegistration(): UseUserRegistrationReturn {
  const [formState, setFormState] = useState<UserFormState>(getUserFormInitialState());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>({ type: 'idle' });

  const resetForm = useCallback(() => {
    setFormState(getUserFormInitialState());
    setIsSubmitting(false);
    setSubmissionState({ type: 'idle' });
  }, []);

  const resetFeedback = useCallback(() => {
    setIsSubmitting(false);
    setSubmissionState({ type: 'idle' });
  }, []);

  const handleFieldChange = useCallback(
    (field: keyof UserFormState, value: string) => {
      setFormState((previous) => ({
        ...previous,
        [field]: value,
      }));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsSubmitting(true);
      setSubmissionState({ type: 'idle' });

      try {
        // Keep API contract identical by POSTing to the existing /api/users endpoint.
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formState),
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error ?? 'Registrierung fehlgeschlagen.');
        }

        setSubmissionState({
          type: 'success',
          message: 'Dein Benutzerkonto wurde erfolgreich erstellt! Willkommen bei JuriLib.',
        });
        setFormState(getUserFormInitialState());
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
        setSubmissionState({
          type: 'error',
          message,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formState],
  );

  return {
    formState,
    isSubmitting,
    submissionState,
    handleFieldChange,
    handleSubmit,
    resetForm,
    resetFeedback,
  };
}
