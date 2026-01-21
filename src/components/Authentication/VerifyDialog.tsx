'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

import { CancelDialog } from './CancelDialog';

type VerifyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

//https://shadcnstudio.com/docs/components/input-otp
export function VerifyDialog({ open, onOpenChange }: VerifyDialogProps) {
  const [cancelOpen, setCancelOpen] = useState(false);
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
            <InputOTP maxLength={6}>
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

          <Button type="submit" className="w-full mt-5">
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
