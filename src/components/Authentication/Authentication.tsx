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

import ForgotPasswordDialog from './ForgotPasswordDialog';
import { LoginDialog } from './LoginDialog';
import NewPasswordDialog from './NewPasswordDialog';
import { initialRegisterData, RegisterDialog } from './RegisterDialog';
import { SuccessDialog } from './SuccessDialog';
import { VerifyDialog } from './VerifyDialog';

export function Authentication() {
  const { login, setLogin } = useLoginContext();
  const [showDialog, setShowDialog] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [registerStep, setRegisterStep] = useState(1);
  const [registerData, setRegisterData] = useState(initialRegisterData);
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const [showForgetPasswordDialog, setShowForgetPasswordDialog] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {isRegister ? 'Registrierung' : 'Einloggen'}
            </DialogTitle>
            <DialogDescription>
              {isRegister
                ? `Schritt ${registerStep} von 2 – Erstelle dein Konto`
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
            <>
              <LoginDialog
                onSuccess={() => setShowDialog(false)}
                password={password}
                setPassword={setPassword}
                showVerifyDialog={setShowVerification}
                email={email}
                setEmail={setEmail}
              />
              <Button
                type="button"
                variant="link"
                className="w-full"
                onClick={() => {
                  setShowDialog(false);
                  setShowForgetPasswordDialog(true);
                }}
              >
                Passwort vergessen?
              </Button>
            </>
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
        <VerifyDialog
          open={showVerification}
          onOpenChange={setShowVerification}
          setSuccessOpen={setSuccessOpen}
          email={email}
          password={password}
        />
      )}

      {showForgetPasswordDialog && (
        <ForgotPasswordDialog
          open={showForgetPasswordDialog}
          onOpenChange={setShowForgetPasswordDialog}
          showLogin={setShowDialog}
          showVerification={setShowVerification}
          email={email}
          setEmail={setEmail}
        />
      )}

      {successOpen && (
        <SuccessDialog
          open={successOpen}
          onOpenChange={setSuccessOpen}
          message="Dein Konto ist nun verifiziert."
        />
      )}
    </>
  );
}
