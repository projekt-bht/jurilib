'use client';

import { FormEvent, useState } from "react";

import { Areas, OrganizationType } from "~/generated/prisma/enums";

type TabType = "user" | "organization";

type FormState = {
  name: string;
  email: string;
  password: string;
};

type OrganizationFormState = {
  contactName: string;
  contactEmail: string;
  password: string;
  organizationName: string;
  phone: string;
  website: string;
  address: string;
  description: string;
  organizationType: OrganizationType;
  expertiseArea: Areas[];
};

type SubmissionState =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const USER_FORM_STATE: FormState = {
  name: "",
  email: "",
  password: "",
};

const ORGANIZATION_FORM_STATE: OrganizationFormState = {
  contactName: "",
  contactEmail: "",
  password: "",
  organizationName: "",
  phone: "",
  website: "",
  address: "",
  description: "",
  organizationType: OrganizationType.LAW_FIRM,
  expertiseArea: [],
};

const AREA_OPTIONS = Object.values(Areas);
const ORGANIZATION_TYPES = Object.values(OrganizationType);

export function RegisterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("user");
  const [userFormState, setUserFormState] =
    useState<FormState>(USER_FORM_STATE);
  const [organizationFormState, setOrganizationFormState] =
    useState<OrganizationFormState>(ORGANIZATION_FORM_STATE);
  const [isUserSubmitting, setIsUserSubmitting] = useState(false);
  const [isOrganizationSubmitting, setIsOrganizationSubmitting] =
    useState(false);
  const [userSubmissionState, setUserSubmissionState] =
    useState<SubmissionState>({ type: "idle" });
  const [organizationSubmissionState, setOrganizationSubmissionState] =
    useState<SubmissionState>({ type: "idle" });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const activeSubmissionState =
    activeTab === "user" ? userSubmissionState : organizationSubmissionState;

  const resetFormState = () => {
    setIsUserSubmitting(false);
    setIsOrganizationSubmitting(false);
    setUserSubmissionState({ type: "idle" });
    setOrganizationSubmissionState({ type: "idle" });
  };

  const closeModal = () => {
    setIsOpen(false);
    resetFormState();
    setSuccessMessage(null);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setUserSubmissionState({ type: "idle" });
    setOrganizationSubmissionState({ type: "idle" });
  };

  const handleUserSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUserSubmitting(true);
    setUserSubmissionState({ type: "idle" });

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userFormState),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error ?? "Registrierung fehlgeschlagen.");
      }

      resetFormState();
      setIsOpen(false);
      setSuccessMessage(
        "Dein Benutzerkonto wurde erfolgreich erstellt! Willkommen bei JuriLib.",
      );
      setUserFormState(USER_FORM_STATE);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unbekannter Fehler";
      setUserSubmissionState({
        type: "error",
        message,
      });
    } finally {
      setIsUserSubmitting(false);
    }
  };

  const handleOrganizationSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsOrganizationSubmitting(true);
    setOrganizationSubmissionState({ type: "idle" });

    if (!organizationFormState.expertiseArea.length) {
      setOrganizationSubmissionState({
        type: "error",
        message: "Bitte wählen Sie mindestens ein Fachgebiet aus.",
      });
      setIsOrganizationSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/register/organization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contactName: organizationFormState.contactName,
          contactEmail: organizationFormState.contactEmail,
          password: organizationFormState.password,
          organizationName: organizationFormState.organizationName,
          phone: organizationFormState.phone,
          website: organizationFormState.website,
          address: organizationFormState.address,
          description: organizationFormState.description,
          organizationType: organizationFormState.organizationType,
          expertiseArea: organizationFormState.expertiseArea,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          payload?.error ?? "Organisation konnte nicht erstellt werden.",
        );
      }

      resetFormState();
      setIsOpen(false);
      setSuccessMessage(
        "Organisation und Admin-Zugang wurden erfolgreich angelegt!",
      );
      setOrganizationFormState(ORGANIZATION_FORM_STATE);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unbekannter Fehler";
      setOrganizationSubmissionState({
        type: "error",
        message,
      });
    } finally {
      setIsOrganizationSubmitting(false);
    }
  };

  const renderUserForm = () => (
    <form className="space-y-4" onSubmit={handleUserSubmit}>
      <label className="block text-sm font-medium text-gray-700">
        Name
        <input
          type="text"
          value={userFormState.name}
          onChange={(event) =>
            setUserFormState((previous) => ({
              ...previous,
              name: event.target.value,
            }))
          }
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
          value={userFormState.email}
          onChange={(event) =>
            setUserFormState((previous) => ({
              ...previous,
              email: event.target.value,
            }))
          }
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
          value={userFormState.password}
          onChange={(event) =>
            setUserFormState((previous) => ({
              ...previous,
              password: event.target.value,
            }))
          }
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Mindestens 8 Zeichen"
          className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-100 p-3 text-gray-900 placeholder-gray-600 focus:border-black focus:outline-none"
        />
      </label>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          className="w-1/2 rounded-full border border-gray-300 px-4 py-2 font-semibold text-gray-600 transition hover:bg-gray-100"
          onClick={closeModal}
        >
          Abbrechen
        </button>
        <button
          type="submit"
          className="w-1/2 rounded-full bg-black px-4 py-2 font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-400"
          disabled={isUserSubmitting}
        >
          {isUserSubmitting ? "Wird gespeichert..." : "Registrieren"}
        </button>
      </div>
    </form>
  );

  const renderOrganizationForm = () => {
    const setField =
      <K extends keyof OrganizationFormState>(field: K) =>
      (value: string | OrganizationType) => {
        setOrganizationFormState((previous) => ({
          ...previous,
          [field]: value,
        }));
      };

    const toggleArea = (area: Areas) => {
      setOrganizationFormState((previous) => {
        const hasArea = previous.expertiseArea.includes(area);
        return {
          ...previous,
          expertiseArea: hasArea
            ? previous.expertiseArea.filter((entry) => entry !== area)
            : [...previous.expertiseArea, area],
        };
      });
    };

    return (
      <form className="space-y-4" onSubmit={handleOrganizationSubmit}>
        <section>
          <h3 className="text-sm font-semibold text-gray-900">
            Grundinformationen
          </h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <input
              type="text"
              required
              placeholder="Ihr vollständiger Name"
              value={organizationFormState.contactName}
              onChange={(event) => setField("contactName")(event.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-100 p-3 text-sm text-gray-900 placeholder-gray-600 focus:border-black focus:outline-none"
            />
            <input
              type="email"
              required
              placeholder="ihre.email@beispiel.de"
              value={organizationFormState.contactEmail}
              onChange={(event) => setField("contactEmail")(event.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-100 p-3 text-sm text-gray-900 placeholder-gray-600 focus:border-black focus:outline-none"
            />
            <input
              type="password"
              required
              minLength={8}
              placeholder="Mindestens 8 Zeichen"
              value={organizationFormState.password}
              onChange={(event) => setField("password")(event.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-100 p-3 text-sm text-gray-900 placeholder-gray-600 focus:border-black focus:outline-none"
            />
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Organisationsdetails
            </h3>
            <div className="flex gap-2 text-xs font-medium text-gray-500">
              {ORGANIZATION_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setField("organizationType")(type)}
                  className={`rounded-full px-3 py-1 ${organizationFormState.organizationType === type ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}
                >
                  {type === OrganizationType.LAW_FIRM
                    ? "Kanzlei"
                    : "Verband"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              required
              placeholder="Name der Organisation"
              value={organizationFormState.organizationName}
              onChange={(event) =>
                setField("organizationName")(event.target.value)
              }
              className="rounded-xl border border-gray-200 bg-gray-100 p-3 text-sm text-gray-900 placeholder-gray-600 focus:border-black focus:outline-none"
            />
            <input
              type="tel"
              placeholder="+49 89 1234567"
              value={organizationFormState.phone}
              onChange={(event) => setField("phone")(event.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-100 p-3 text-sm text-gray-900 placeholder-gray-600 focus:border-black focus:outline-none"
            />
            <input
              type="text"
              inputMode="url"
              placeholder="www.ihre-organisation.de"
              value={organizationFormState.website}
              onChange={(event) => setField("website")(event.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-100 p-3 text-sm text-gray-900 placeholder-gray-600 focus:border-black focus:outline-none"
            />
            <input
              type="text"
              placeholder="Straße Nr., PLZ Stadt"
              value={organizationFormState.address}
              onChange={(event) => setField("address")(event.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-100 p-3 text-sm text-gray-900 placeholder-gray-600 focus:border-black focus:outline-none"
            />
          </div>

          <textarea
            placeholder="Kurze Beschreibung Ihrer Organisation"
            value={organizationFormState.description}
            onChange={(event) => setField("description")(event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-100 p-3 text-sm text-gray-900 placeholder-gray-600 focus:border-black focus:outline-none"
            rows={3}
          />
        </section>

        <section>
          <h3 className="text-sm font-semibold text-gray-900">
            Fachgebiete (wählen Sie alle zutreffenden)
          </h3>
          <div className="mt-3 grid max-h-48 gap-2 overflow-y-auto rounded-xl border border-gray-100 p-3 sm:grid-cols-2">
            {AREA_OPTIONS.map((area) => {
              const isSelected = organizationFormState.expertiseArea.includes(
                area,
              );
              return (
                <label
                  key={area}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-sm ${isSelected ? "bg-black text-white" : "bg-gray-100 text-gray-700"}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleArea(area)}
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
            onClick={closeModal}
          >
            Abbrechen
          </button>
          <button
            type="submit"
            className="w-1/2 rounded-full bg-gradient-to-r from-gray-900 to-black px-4 py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isOrganizationSubmitting}
          >
            {isOrganizationSubmitting ? "Wird gespeichert..." : "Registrieren"}
          </button>
        </div>
      </form>
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-full bg-transparent px-4 py-2 text-sm font-semibold text-white ring-1 ring-white transition hover:bg-white hover:text-black"
      >
        Registrieren
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Registrierung
                </h2>
                <p className="text-sm text-gray-500">
                  Durchsuchen und filtern Sie alle verfügbaren Organisationen
                </p>
              </div>
              <button
                className="text-gray-500 transition hover:text-gray-900"
                onClick={closeModal}
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
                  checked={activeTab === "user"}
                  onChange={() => handleTabChange("user")}
                  className="accent-black"
                />
                Benutzer
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="register-type"
                  checked={activeTab === "organization"}
                  onChange={() => handleTabChange("organization")}
                  className="accent-black"
                />
                Organisation
              </label>
            </div>

            <hr className="mb-6 border-gray-100" />

            {activeTab === "user" ? renderUserForm() : renderOrganizationForm()}

            {activeSubmissionState.type === "error" && (
              <p className="mt-4 text-center text-sm text-red-600">
                {activeSubmissionState.message}
              </p>
            )}
          </div>
        </div>
      )}
      {successMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
            <h3 className="text-2xl font-semibold text-gray-900">
              Erfolgreich!
            </h3>
            <p className="mt-3 text-sm text-gray-600">{successMessage}</p>
            <button
              onClick={closeModal}
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
