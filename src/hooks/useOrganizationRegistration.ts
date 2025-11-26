'use client';

import type { FormEvent } from 'react';
import { useCallback, useState } from 'react';

import type { OrganizationFormState, SubmissionState } from '@/types/registerTypes';
import { getOrganizationFormInitialState } from '@/utils/formHelpers';
import { Areas } from '~/generated/prisma/enums';

type UseOrganizationRegistrationReturn = {
  formState: OrganizationFormState;
  isSubmitting: boolean;
  submissionState: SubmissionState;
  handleFieldChange: <K extends keyof OrganizationFormState>(
    field: K,
    value: OrganizationFormState[K],
  ) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  toggleArea: (area: Areas) => void;
  resetForm: () => void;
  resetFeedback: () => void;
};

/**
 * Manages the complex organization registration form including expertise
 * selections, validation and submit flow.
 */
export function useOrganizationRegistration(): UseOrganizationRegistrationReturn {
  const [formState, setFormState] = useState<OrganizationFormState>(
    getOrganizationFormInitialState(),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>({ type: 'idle' });

  const resetForm = useCallback(() => {
    setFormState(getOrganizationFormInitialState());
    setIsSubmitting(false);
    setSubmissionState({ type: 'idle' });
  }, []);

  const resetFeedback = useCallback(() => {
    setIsSubmitting(false);
    setSubmissionState({ type: 'idle' });
  }, []);

  const handleFieldChange = useCallback(
    <K extends keyof OrganizationFormState>(field: K, value: OrganizationFormState[K]) => {
      setFormState((previous) => ({
        ...previous,
        [field]: value,
      }));
    },
    [],
  );

  const toggleArea = useCallback((area: Areas) => {
    setFormState((previous) => {
      const hasArea = previous.expertiseArea.includes(area);
      // Toggle expertise areas so repeated clicks simply remove the tag again.
      return {
        ...previous,
        expertiseArea: hasArea
          ? previous.expertiseArea.filter((entry) => entry !== area)
          : [...previous.expertiseArea, area],
      };
    });
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsSubmitting(true);
      setSubmissionState({ type: 'idle' });

      if (!formState.expertiseArea.length) {
        // Backend expects at least one expertise area; short-circuit before making the request.
        setSubmissionState({
          type: 'error',
          message: 'Bitte wählen Sie mindestens ein Fachgebiet aus.',
        });
        setIsSubmitting(false);
        return;
      }

      try {
        const response = await fetch('/api/register/organization', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formState),
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error ?? 'Organisation konnte nicht erstellt werden.');
        }

        setSubmissionState({
          type: 'success',
          message: 'Organisation und Admin-Zugang wurden erfolgreich angelegt!',
        });
        setFormState(getOrganizationFormInitialState());
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
    toggleArea,
    resetForm,
    resetFeedback,
  };
}
