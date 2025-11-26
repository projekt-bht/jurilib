'use client';

import type { ChangeEvent, FormEvent } from 'react';

import type { SubmissionState, UserFormState } from '@/types/registerTypes';
import { Field } from '../ui/field';

type UserFormProps = {
  formState: UserFormState;
  isSubmitting: boolean;
  submissionState: SubmissionState;
  onFieldChange: (field: keyof UserFormState, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onCancel: () => void;
};

/**
 * Purely visual representation of the user registration form. All state and
 * submit logic is handled through the injected hooks.
 */
export function UserForm({
  formState,
  isSubmitting,
  submissionState,
  onFieldChange,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const handleChange = (field: keyof UserFormState) => (event: ChangeEvent<HTMLInputElement>) =>
    onFieldChange(field, event.target.value);

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <label className="block text-sm font-medium text-gray-700">
        Name
        <input
          type="text"
          value={formState.name}
          onChange={handleChange('name')}
          autoComplete="name"
          required
          placeholder="Ihr vollständiger Name"
          className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-100 p-3 text-gray-900 placeholder-gray-600 focus:border-black focus:outline-none"
        />
      </label>

      <label className="block text-sm font-medium text-gray-700">
        E-Mail
        <input
          type="email"
          value={formState.email}
          onChange={handleChange('email')}
          autoComplete="email"
          required
          placeholder="ihre.email@beispiel.de"
          className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-100 p-3 text-gray-900 placeholder-gray-600 focus:border-black focus:outline-none"
        />
      </label>

      <label className="block text-sm font-medium text-gray-700">
        Passwort
        <input
          type="password"
          value={formState.password}
          onChange={handleChange('password')}
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Mindestens 8 Zeichen"
          className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-100 p-3 text-gray-900 placeholder-gray-600 focus:border-black focus:outline-none"
        />
      </label>
      <Field> </Field>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          className="w-1/2 rounded-full border border-gray-300 px-4 py-2 font-semibold text-gray-600 transition hover:bg-gray-100"
          onClick={onCancel}
        >
          Abbrechen
        </button>
        <button
          type="submit"
          className="w-1/2 rounded-full bg-black px-4 py-2 font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Wird gespeichert...' : 'Registrieren'}
        </button>
      </div>

      {submissionState.type === 'error' && (
        <p className="text-center text-sm text-red-600">{submissionState.message}</p>
      )}
    </form>
  );
}
