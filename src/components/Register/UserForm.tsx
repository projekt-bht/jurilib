'use client';

import type { ChangeEvent, FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SubmissionState, UserFormState } from '@/types/registerTypes';

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
  const handleChange =
    (field: keyof UserFormState) => (event: ChangeEvent<HTMLInputElement>) =>
      onFieldChange(field, event.target.value);

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <Label htmlFor="user-name">Name</Label>
        <Input
          id="user-name"
          value={formState.name}
          onChange={handleChange('name')}
          autoComplete="name"
          required
          placeholder="Ihr vollständiger Name"
        />
      </div>

      <div>
        <Label htmlFor="user-email">E-Mail</Label>
        <Input
          id="user-email"
          value={formState.email}
          type="email"
          onChange={handleChange('email')}
          autoComplete="email"
          required
          placeholder="ihre.email@beispiel.de"
        />
      </div>

      <div>
        <Label htmlFor="user-password">Passwort</Label>
        <Input
          id="user-password"
          value={formState.password}
          type="password"
          onChange={handleChange('password')}
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Mindestens 8 Zeichen"
        />
      </div>

      <div className="flex justify-between gap-3 pt-4">
        <Button type="button" variant="outline" className="w-1/2" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button type="submit" className="w-1/2" disabled={isSubmitting}>
          {isSubmitting ? 'Wird gespeichert...' : 'Registrieren'}
        </Button>
      </div>

      {submissionState.type === 'error' && (
        <p className="text-center text-sm text-red-600">{submissionState.message}</p>
      )}
    </form>
  );
}
