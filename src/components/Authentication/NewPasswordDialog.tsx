import type { FormEvent } from 'react';
import { useState } from 'react';
import React from 'react';

import { useLoginContext } from '@/app/LoginContext';
import { patchAccountPasswordWithEmail, postLogin } from '@/services/api';
import { isStrongPassword } from '@/services/validator/validationHelper';

import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { CancelDialog } from './CancelDialog';

type NewPasswordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  setSuccessOpen: (open: boolean) => void;
};

type ValidationMessages<Type> = {
  [Property in keyof Type]?: string;
};

export default function NewPasswordDialog({
  open,
  onOpenChange,
  email,
  setSuccessOpen,
}: NewPasswordDialogProps) {
  const { login, setLogin } = useLoginContext();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cancelOpen, setCancelOpen] = useState(false);

  const [validationErrors, setValidationErrors] = React.useState<
    ValidationMessages<{ password: ''; passwordRepeat: '' }>
  >({});

  function validate(e: React.FocusEvent<HTMLInputElement>) {
    switch (e.target.name) {
      case 'password':
        setValidationErrors({
          ...validationErrors,
          password: !isStrongPassword(newPassword)
            ? 'Dein Passwort muss mindestens 8 Zeichen lang sein, eine Ziffer, einen Groß- sowie Kleinbuchstaben und ein Sonderzeichen enthalten.'
            : undefined,
        });
        break;
      case 'passwordRepeat':
        setValidationErrors({
          ...validationErrors,
          passwordRepeat:
            confirmPassword !== newPassword
              ? 'Die eingegebenen Passwörter stimmen nicht überein.'
              : undefined,
        });
        break;
    }
  }

  function isNewRegisterDialogValid() {
    if (!newPassword || !confirmPassword) return false;
    if (!isStrongPassword(newPassword) || !isStrongPassword(confirmPassword)) return false;
    if (newPassword !== confirmPassword) return false;
    return true;
  }

  async function handleNewPasswordSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    try {
      const updatePassword = await patchAccountPasswordWithEmail(email, newPassword);

      if (updatePassword) {
        onOpenChange(false);
        setSuccessOpen(true);
        await new Promise((resolve) => setTimeout(resolve, 2500));
        const loginFromServer = await postLogin(email, newPassword);
        if (typeof loginFromServer !== 'string') setLogin(loginFromServer);
      }
    } catch (error) {}
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (!open) {
            setCancelOpen(true);
          }
        }}
      >
        <DialogContent
          className="max-w-md"
          showCloseButton={false}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl">Neues Passwort setzen</DialogTitle>
            <DialogDescription>Gib dein neues Passwort ein.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNewPasswordSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Neues Passwort</Label>
              <Input
                name="password"
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onBlur={validate}
                className={
                  validationErrors.password
                    ? 'border-accent-red border-[0.5px] focus:ring-accent-red/200'
                    : ''
                }
              />
              {validationErrors && (
                <p className="text-sm text-accent-red mt-1">{validationErrors.password}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Passwort wiederholen</Label>
              <Input
                name="passwordRepeat"
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={validate}
                className={
                  validationErrors.passwordRepeat
                    ? 'border-accent-red border-[0.5px] focus:ring-accent-red/200'
                    : ''
                }
              />
              {validationErrors && (
                <p className="text-sm text-accent-red mt-1">{validationErrors.passwordRepeat}</p>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setCancelOpen(true)}
              >
                Abbrechen
              </Button>
              <Button type="submit" className="flex-1" disabled={!isNewRegisterDialogValid()}>
                Passwort ändern
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {cancelOpen && (
        <CancelDialog
          open={cancelOpen}
          onOpenChange={setCancelOpen}
          showVerifyDialog={onOpenChange}
        />
      )}
    </>
  );
}
