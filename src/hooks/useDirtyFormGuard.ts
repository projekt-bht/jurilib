'use client';

import { useCallback, useMemo } from 'react';

import type { OrganizationFormState, UserFormState } from '@/types/registerTypes';
import {
  getOrganizationFormInitialState,
  getUserFormInitialState,
  hasFormChanged,
} from '@/utils/formHelpers';

type DirtyFormGuardOptions = {
  userFormState: UserFormState;
  organizationFormState: OrganizationFormState;
  onReset: () => void;
  onClose: () => void;
};

type DirtyFormGuardReturn = {
  isDirty: boolean;
  requestClose: () => void;
};

/**
 * Ensures users do not lose unsaved work. If either form diverges from its
 * initial state a confirmation dialog is shown before closing.
 */
export function useDirtyFormGuard({
  userFormState,
  organizationFormState,
  onReset,
  onClose,
}: DirtyFormGuardOptions): DirtyFormGuardReturn {
  const isDirty = useMemo(
    () =>
      hasFormChanged(getUserFormInitialState(), userFormState) ||
      hasFormChanged(getOrganizationFormInitialState(), organizationFormState),
    [organizationFormState, userFormState],
  );

  const requestClose = useCallback(() => {
    if (isDirty) {
      const confirmed = window.confirm(
        'Ihre Eingaben gehen verloren. Möchten Sie den Dialog wirklich schließen?',
      );
      if (!confirmed) {
        return;
      }
    }

    onReset();
    onClose();
  }, [isDirty, onClose, onReset]);

  return { isDirty, requestClose };
}
