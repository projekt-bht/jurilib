'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useLoginContext } from '@/app/LoginContext';
//https://ui.shadcn.com/docs/components/dialog
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { deleteLogin } from '@/services/api';

import { LoginDialog } from './LoginDialog';
import { initialRegisterData, RegisterDialog } from './RegisterDialog';
import { VerifyDialog } from './VerifyDialog';

export function Authentication() {
  const { login, setLogin } = useLoginContext();
  const [showDialog, setShowDialog] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [registerStep, setRegisterStep] = useState(1);
  const [registerData, setRegisterData] = useState(initialRegisterData);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showVerification, setShowVerification] = useState(false);

  const router = useRouter();

  if (login) {
    return (
      <Button
        onClick={async () => {
          await deleteLogin();
          setLogin(false);
          router.push('/');
        }}
      >
        Abmelden
      </Button>
    );
  }

  return (
    <>
      <Dialog
        open={showDialog}
        onOpenChange={(open) => {
          setShowDialog(open);
          if (open) {
            setIsRegister(false);
          }
        }}
      >
        <DialogTrigger asChild>
          <Button>Einloggen</Button>
        </DialogTrigger>

        <DialogOverlay className="backdrop-blur-sm" />
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {isRegister ? 'Registrierung' : 'Einloggen'}
            </DialogTitle>
            <DialogDescription>
              {isRegister
                ? `Schritt ${registerStep} von 3 – Erstelle dein Konto`
                : 'Melde dich mit deinen Zugangsdaten an'}
            </DialogDescription>
          </DialogHeader>

          {isRegister ? (
            <RegisterDialog
              step={registerStep}
              setStep={setRegisterStep}
              registerData={registerData}
              setRegisterData={setRegisterData}
              setShowVerification={setShowVerification}
              onSuccess={() => {
                setShowDialog(false);
                setRegisterData(initialRegisterData);
                setRegisterStep(1);
              }}
            />
          ) : (
            <LoginDialog
              onSuccess={() => setShowDialog(false)}
              loginData={loginData}
              setLoginData={setLoginData}
            />
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="link"
              className="w-full"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? 'Zurück zum Login' : 'Noch kein Konto? Registrieren'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showVerification && (
        <VerifyDialog open={showVerification} onOpenChange={setShowVerification} />
      )}
    </>
  );
}
