'use client';

import type { ChangeEvent, FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { OrganizationFormState, SubmissionState } from '@/types/registerTypes';
import { AREA_OPTIONS } from '@/utils/formHelpers';
import { Areas, OrganizationType } from '~/generated/prisma/enums';

type OrganizationFormProps = {
  formState: OrganizationFormState;
  isSubmitting: boolean;
  submissionState: SubmissionState;
  onFieldChange: <K extends keyof OrganizationFormState>(
    field: K,
    value: OrganizationFormState[K],
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onCancel: () => void;
  onToggleArea: (area: Areas) => void;
};

export function OrganizationForm({
  formState,
  isSubmitting,
  submissionState,
  onFieldChange,
  onSubmit,
  onCancel,
  onToggleArea,
}: OrganizationFormProps) {
  const update =
    <K extends keyof OrganizationFormState>(key: K) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onFieldChange(key, event.target.value as OrganizationFormState[K]);

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-900">Grundinformationen</h3>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            placeholder="Ihr vollständiger Name"
            value={formState.contactName}
            onChange={update('contactName')}
            required
          />
          <Input
            type="email"
            placeholder="ihre.email@beispiel.de"
            value={formState.contactEmail}
            onChange={update('contactEmail')}
            required
          />
          <Input
            type="password"
            placeholder="Mindestens 8 Zeichen"
            minLength={8}
            value={formState.password}
            onChange={update('password')}
            required
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Organisationsdetails</h3>

          <div className="flex gap-2 text-xs">
            <Button
              type="button"
              variant={formState.organizationType === OrganizationType.LAW_FIRM ? 'default' : 'secondary'}
              className="rounded-full px-3"
              onClick={() => onFieldChange('organizationType', OrganizationType.LAW_FIRM)}
            >
              Kanzlei
            </Button>

            <Button
              type="button"
              variant={
                formState.organizationType === OrganizationType.ASSOCIATION ? 'default' : 'secondary'
              }
              className="rounded-full px-3"
              onClick={() => onFieldChange('organizationType', OrganizationType.ASSOCIATION)}
            >
              Verband
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            placeholder="Name der Organisation"
            value={formState.organizationName}
            onChange={update('organizationName')}
            required
          />
          <Input
            placeholder="+49 89 1234567"
            value={formState.phone}
            onChange={update('phone')}
          />
          <Input
            placeholder="www.ihre-organisation.de"
            value={formState.website}
            onChange={update('website')}
          />
          <Input
            placeholder="Straße Nr., PLZ Stadt"
            value={formState.address}
            onChange={update('address')}
          />
        </div>

        <Textarea
          placeholder="Was macht Ihre Organisation besonders?"
          rows={3}
          value={formState.description}
          onChange={update('description')}
        />
      </div>

      <div>
        <h3 className="mb-1 text-sm font-semibold text-gray-900">Fachgebiete</h3>
        <p className="mb-3 text-xs text-gray-500">Wählen Sie alle relevanten Bereiche aus.</p>

        <div className="grid max-h-60 gap-2 overflow-y-auto rounded-xl border p-2 sm:grid-cols-2">
          {AREA_OPTIONS.map((area) => {
            const isSelected = formState.expertiseArea.includes(area);
            return (
              <label
                key={area}
                className={`flex items-center space-x-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  isSelected
                    ? 'border-black bg-gray-100 font-semibold'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <Checkbox checked={isSelected} onCheckedChange={() => onToggleArea(area)} />
                <span>{area}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
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
