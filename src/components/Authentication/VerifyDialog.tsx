'use client';

import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useState } from 'react';

import { useLoginContext } from '@/app/LoginContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { postLogin, postVerify } from '@/services/api';

import { CancelDialog } from './CancelDialog';

type VerifyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setSuccessOpen: (open: boolean) => void;
  email: string;
  password: string;
};

//https://shadcnstudio.com/docs/components/input-otp
export function VerifyDialog({
  open,
  onOpenChange,
  setSuccessOpen,
  email,
  password,
}: VerifyDialogProps) {
  const { login, setLogin } = useLoginContext();

  const [code, setCode] = useState('');
  const [cancelOpen, setCancelOpen] = useState(false);

  const [error, setError] = useState('');

  async function handleVerify() {
    try {
      const verify = await postVerify(email, 'EMAIL_VERIFICATION', code);

      if (verify) {
        setError('');
        setSuccessOpen(true);
        onOpenChange(false);
        const loginFromServer = await postLogin(email, password);
        if (typeof loginFromServer !== 'string') setLogin(loginFromServer);
      } else {
        setError('Dein Code ist nicht richtig, bitte überprüfe deine Eingabe.');
      }
    } catch (error) {
      setError(String(error));
    }
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">Verifizierung</DialogTitle>
            <DialogDescription className="text-center">
              Bitte bestätige dein Konto mit dem Code, den wir dir per E-Mail gesendet haben.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center mt-4 gap-2">
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={code}
              onChange={(value) => {
                setCode(value);
                setError('');
              }}
            >
              <InputOTPGroup className="*:data-[slot=input-otp-slot]:bg-muted gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:border-transparent *:data-[slot=input-otp-slot]:shadow-sm">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <p className="text-sm text-center text-accent-red mt-1">{error}</p>

          <Button type="submit" className="w-full h-12 text-xl" onClick={handleVerify}>
            Bestätigen
          </Button>

          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              Du hast keinen Code erhalten?{' '}
              <a href="#" className="text-primary hover:underline">
                Code erneut senden
              </a>
            </p>
          </div>
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
