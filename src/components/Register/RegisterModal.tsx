'use client';

import { useEffect, useState } from 'react';

import { OrganizationForm } from '@/components/Register/OrganizationForm';
import { UserForm } from '@/components/Register/UserForm';
import { useDirtyFormGuard } from '@/hooks/useDirtyFormGuard';
import { useOrganizationRegistration } from '@/hooks/useOrganizationRegistration';
import { useUserRegistration } from '@/hooks/useUserRegistration';
import type { TabType } from '@/types/registerTypes';

export function RegisterModal() {
  // Controls visibility of the dialog and indicates which tab is active.
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('user');
  // Shared success overlay message reused by both forms.
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    formState: userFormState,
    isSubmitting: isUserSubmitting,
    submissionState: userSubmissionState,
    handleFieldChange: handleUserFieldChange,
    handleSubmit: handleUserSubmit,
    resetForm: resetUserForm,
    resetFeedback: resetUserFeedback,
  } = useUserRegistration();

  const {
    formState: organizationFormState,
    isSubmitting: isOrganizationSubmitting,
    submissionState: organizationSubmissionState,
    handleFieldChange: handleOrganizationFieldChange,
    handleSubmit: handleOrganizationSubmit,
    toggleArea,
    resetForm: resetOrganizationForm,
    resetFeedback: resetOrganizationFeedback,
  } = useOrganizationRegistration();

  const { requestClose } = useDirtyFormGuard({
    userFormState,
    organizationFormState,
    onReset: () => {
      resetUserForm();
      resetOrganizationForm();
      resetUserFeedback();
      resetOrganizationFeedback();
      setSuccessMessage(null);
    },
    onClose: () => setIsOpen(false),
  });

  // When the user form succeeds we close the modal, reset the other form and show the overlay.
  useEffect(() => {
    if (userSubmissionState.type === 'success') {
      setSuccessMessage(userSubmissionState.message);
      setIsOpen(false);
      resetOrganizationForm();
      resetUserFeedback();
      resetOrganizationFeedback();
    }
  }, [resetOrganizationForm, resetOrganizationFeedback, resetUserFeedback, userSubmissionState]);

  // Same logic for the organization form: close, reset and surface the success notification.
  useEffect(() => {
    if (organizationSubmissionState.type === 'success') {
      setSuccessMessage(organizationSubmissionState.message);
      setIsOpen(false);
      resetUserForm();
      resetUserFeedback();
      resetOrganizationFeedback();
    }
  }, [
    organizationSubmissionState,
    resetOrganizationFeedback,
    resetUserFeedback,
    resetUserForm,
  ]);

  const openModal = () => {
    // Reset old notifications before showing the dialog again.
    setSuccessMessage(null);
    setIsOpen(true);
    resetUserFeedback();
    resetOrganizationFeedback();
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    resetUserFeedback();
    resetOrganizationFeedback();
  };

  const renderActiveForm =
    activeTab === 'user' ? (
      <UserForm
        formState={userFormState}
        isSubmitting={isUserSubmitting}
        submissionState={userSubmissionState}
        onFieldChange={handleUserFieldChange}
        onSubmit={handleUserSubmit}
        onCancel={requestClose}
      />
    ) : (
      <OrganizationForm
        formState={organizationFormState}
        isSubmitting={isOrganizationSubmitting}
        submissionState={organizationSubmissionState}
        onFieldChange={handleOrganizationFieldChange}
        onSubmit={handleOrganizationSubmit}
        onCancel={requestClose}
        onToggleArea={toggleArea}
      />
    );

  return (
    <>
      <button
        onClick={openModal}
        className="rounded-full bg-transparent px-4 py-2 text-sm font-semibold text-white ring-1 ring-white transition hover:bg-white hover:text-black"
      >
        Registrieren
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={requestClose}
        >
          <div
            className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Registrierung</h2>
                <p className="text-sm text-gray-500">
                  Durchsuchen und filtern Sie alle verfügbaren Organisationen
                </p>
              </div>
              <button
                className="text-gray-500 transition hover:text-gray-900"
                onClick={requestClose}
                aria-label="Modal schließen"
              >
                ×
              </button>
            </div>

            <div className="mb-5 flex items-center gap-6 text-sm font-medium text-gray-600">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="register-type"
                  checked={activeTab === 'user'}
                  onChange={() => handleTabChange('user')}
                  className="accent-black"
                />
                Benutzer
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="register-type"
                  checked={activeTab === 'organization'}
                  onChange={() => handleTabChange('organization')}
                  className="accent-black"
                />
                Organisation
              </label>
            </div>

            <hr className="mb-6 border-gray-100" />
            {renderActiveForm}
          </div>
        </div>
      )}

      {successMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
            <h3 className="text-2xl font-semibold text-gray-900">Erfolgreich!</h3>
            <p className="mt-3 text-sm text-gray-600">{successMessage}</p>
            <button
              onClick={() => setSuccessMessage(null)}
              className="mt-6 w-full rounded-full bg-black px-4 py-2 font-semibold text-white transition hover:bg-gray-900"
            >
              Alles klar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
