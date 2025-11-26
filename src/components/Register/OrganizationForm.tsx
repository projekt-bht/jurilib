'use client';

import type { ChangeEvent, FormEvent } from 'react';

import type { OrganizationFormState, SubmissionState } from '@/types/registerTypes';
import { AREA_OPTIONS, ORGANIZATION_TYPES } from '@/utils/formHelpers';
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

const createChangeHandler =
  <K extends keyof OrganizationFormState>(
    field: K,
    onFieldChange: OrganizationFormProps['onFieldChange'],
  ) =>
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onFieldChange(field, event.target.value as OrganizationFormState[K]);

/**
 * Presentational form for organization onboarding including expertise area
 * selectors and meta information.
 */
export function OrganizationForm({
  formState,
  isSubmitting,
  submissionState,
  onFieldChange,
  onSubmit,
  onCancel,
  onToggleArea,
}: OrganizationFormProps) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <section>
        <h3 className="text-sm font-semibold text-gray-900">Grundinformationen</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <input
            type="text"
            required
            placeholder="Ihr vollständiger Name"
            value={formState.contactName}
            onChange={createChangeHandler('contactName', onFieldChange)}
            className="rounded-xl border border-gray-200 bg-gray-100 p-3 text-sm text-gray-900 placeholder-gray-600 focus:border-black focus:outline-none"
          />
          <input
            type="email"
            required
            placeholder="ihre.email@beispiel.de"
            value={formState.contactEmail}
            onChange={createChangeHandler('contactEmail', onFieldChange)}
            className="rounded-xl border border-gray-200 bg-gray-100 p-3 text-sm text-gray-900 placeholder-gray-600 focus:border-black focus:outline-none"
          />
          <input
            type="password"
            required
            minLength={8}
            placeholder="Mindestens 8 Zeichen"
            value={formState.password}
            onChange={createChangeHandler('password', onFieldChange)}
            className="rounded-xl border border-gray-200 bg-gray-100 p-3 text-sm text-gray-900 placeholder-gray-600 focus:border-black focus:outline-none"
          />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Organisationsdetails</h3>
          <div className="flex gap-2 text-xs font-medium text-gray-500">
            {ORGANIZATION_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onFieldChange('organizationType', type)}
                className={`rounded-full px-3 py-1 ${
                  formState.organizationType === type
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {type === OrganizationType.LAW_FIRM ? 'Kanzlei' : 'Verband'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            required
            placeholder="Name der Organisation"
            value={formState.organizationName}
            onChange={createChangeHandler('organizationName', onFieldChange)}
            className="rounded-xl border border-gray-200 bg-gray-100 p-3 text-sm text-gray-900 placeholder-gray-600 focus:border-black focus:outline-none"
          />
          <input
            type="tel"
            placeholder="+49 89 1234567"
            value={formState.phone}
            onChange={createChangeHandler('phone', onFieldChange)}
            className="rounded-xl border border-gray-200 bg-gray-100 p-3 text-sm text-gray-900 placeholder-gray-600 focus:border-black focus:outline-none"
          />
          <input
            type="text"
            inputMode="url"
            placeholder="www.ihre-organisation.de"
            value={formState.website}
            onChange={createChangeHandler('website', onFieldChange)}
            className="rounded-xl border border-gray-200 bg-gray-100 p-3 text-sm text-gray-900 placeholder-gray-600 focus:border-black focus:outline-none"
          />
          <input
            type="text"
            placeholder="Straße Nr., PLZ Stadt"
            value={formState.address}
            onChange={createChangeHandler('address', onFieldChange)}
            className="rounded-xl border border-gray-200 bg-gray-100 p-3 text-sm text-gray-900 placeholder-gray-600 focus:border-black focus:outline-none"
          />
        </div>

        <textarea
          placeholder="Was macht Ihre Organisation besonders?"
          value={formState.description}
          onChange={createChangeHandler('description', onFieldChange)}
          className="w-full rounded-2xl border border-gray-200 bg-gray-100 p-3 text-sm text-gray-900 placeholder-gray-600 focus:border-black focus:outline-none"
          rows={4}
        />
      </section>

      <section>
        <h3 className="text-sm font-semibold text-gray-900">Fachgebiete</h3>
        <p className="mt-1 text-xs text-gray-500">
          Wählen Sie alle relevanten Bereiche aus, in denen Ihre Organisation aktiv ist.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3">
          {AREA_OPTIONS.map((area) => {
            const isSelected = formState.expertiseArea.includes(area);
            return (
              <label
                key={area}
                className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-sm ${
                  isSelected ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleArea(area)}
                  className="h-4 w-4 rounded-full border-gray-300 text-black focus:ring-black"
                />
                {area}
              </label>
            );
          })}
        </div>
      </section>

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
          className="w-1/2 rounded-full bg-gradient-to-r from-gray-900 to-black px-4 py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
