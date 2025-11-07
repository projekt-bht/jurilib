'use client';

import { FormEvent, useState } from "react";

type FormState = {
  name: string;
  email: string;
  password: string;
};

type SubmissionState =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const DEFAULT_FORM_STATE: FormState = {
  name: "",
  email: "",
  password: "",
};

export function RegisterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    type: "idle",
  });

  const closeModal = () => {
    setIsOpen(false);
    setIsSubmitting(false);
    setSubmissionState({ type: "idle" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    setSubmissionState({ type: "idle" });

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error ?? "Registrierung fehlgeschlagen.");
      }

      setSubmissionState({
        type: "success",
        message: "Account erstellt! Du kannst dich jetzt anmelden.",
      });
      setFormState(DEFAULT_FORM_STATE);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unbekannter Fehler";
      setSubmissionState({
        type: "error",
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Neues Konto anlegen
                </h2>
                <p className="text-sm text-gray-500">
                  Gib Name, E-Mail und Passwort ein, um zu starten.
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

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-gray-700">
                Name
                <input
                  type="text"
                  value={formState.name}
                  onChange={(event) =>
                    setFormState((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  autoComplete="name"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2 focus:border-black focus:outline-none"
                />
              </label>

              <label className="block text-sm font-medium text-gray-700">
                E-Mail
                <input
                  type="email"
                  value={formState.email}
                  onChange={(event) =>
                    setFormState((previous) => ({
                      ...previous,
                      email: event.target.value,
                    }))
                  }
                  autoComplete="email"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2 focus:border-black focus:outline-none"
                />
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Passwort
                <input
                  type="password"
                  value={formState.password}
                  onChange={(event) =>
                    setFormState((previous) => ({
                      ...previous,
                      password: event.target.value,
                    }))
                  }
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2 focus:border-black focus:outline-none"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-full bg-black px-4 py-2 font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Wird gespeichert..." : "Konto erstellen"}
              </button>

              {submissionState.type === "success" && (
                <p className="text-center text-sm text-green-600">
                  {submissionState.message}
                </p>
              )}

              {submissionState.type === "error" && (
                <p className="text-center text-sm text-red-600">
                  {submissionState.message}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}

