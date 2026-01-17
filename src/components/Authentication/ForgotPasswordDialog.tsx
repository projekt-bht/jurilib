import { useState } from 'react';
import React from 'react';

import { isValidEmail } from '@/services/validator/validationHelper';

import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type ForgotPasswordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showLogin: (open: boolean) => void;
  showVerification: (open: boolean) => void;
};

export default function ForgotPasswordDialog({
  open,
  onOpenChange,
  showLogin,
  showVerification,
}: ForgotPasswordDialogProps) {
  const [resetEmail, setResetEmail] = useState('');

  const [validationErrors, setValidationErrors] = useState<string | undefined>('');

  function validate(e: React.FocusEvent<HTMLInputElement>) {
    switch (e.target.name) {
      case 'email':
        const error =
          resetEmail.length < 3 || resetEmail.length > 100 || !isValidEmail(resetEmail)
            ? 'Bitte gib eine gültige E-Mail-Adresse ein.'
            : undefined;
        setValidationErrors(error);
        break;
    }
  }
  function isForgotPasswordDialogValid() {
    return resetEmail.length > 0 && isValidEmail(resetEmail);
  }

  function handlePasswordResetEmailSubmit(e: React.FormEvent) {
    e.preventDefault();

    //TODO LOGIC
    //check if email exists in DB

    //Close this dialog
    onOpenChange(false);

    //Trigger OTP Verification
    showVerification(true);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Passwort zurücksetzen</DialogTitle>
          <DialogDescription>
            Geben Sie Ihre E-Mail-Adresse ein, um einen Code zu erhalten
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handlePasswordResetEmailSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">E-Mail</Label>
            <Input
              name="email"
              type="email"
              placeholder="ihre.email@beispiel.de"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              onBlur={validate}
              className={validationErrors ? 'border-red-500 border-[0.5px] focus:ring-red-200' : ''}
            />
            {validationErrors && <p className="text-sm text-red-500 mt-1">{validationErrors}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={!isForgotPasswordDialogValid()}>
            Code senden
          </Button>
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                showLogin(true);
              }}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Zurück zum Login
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
