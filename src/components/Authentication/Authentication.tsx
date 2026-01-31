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
import { TokenType } from '~/generated/prisma/enums';

import ForgotPasswordDialog from './ForgotPasswordDialog';
import { LoginDialog } from './LoginDialog';
import NewPasswordDialog from './NewPasswordDialog';
import { initialRegisterData, RegisterDialog } from './RegisterDialog';
import { SuccessDialog } from './SuccessDialog';
import { VerifyDialog } from './VerifyDialog';

export const authTimeoutDuration: number = 1000;

export function Authentication() {
  const { login, setLogin } = useLoginContext();
  const [showDialog, setShowDialog] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [registerStep, setRegisterStep] = useState(1);
  const [registerData, setRegisterData] = useState(initialRegisterData);

  const [showForgetPasswordDialog, setShowForgetPasswordDialog] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [showNewPasswordDialog, setShowNewPasswordDialog] = useState(false);

  const [tokenType, setTokenType] = useState<TokenType>(TokenType.EMAIL_VERIFICATION);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  if (login) {
    return (
      <>
        <Button
          onClick={async () => {
            setSuccessOpen(true);
            await new Promise((resolve) => setTimeout(resolve, authTimeoutDuration));

            await deleteLogin();
            setLogin(false);
            setSuccessOpen(false);
            router.push('/');
          }}
        >
          Abmelden
        </Button>

        {successOpen && (
          <SuccessDialog
            open={successOpen}
            onOpenChange={setSuccessOpen}
            setPassword={setPassword}
          />
        )}
      </>
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
              setEmail={setEmail}
              setPassword={setPassword}
              setTokenType={setTokenType}
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
                setSuccessOpen={setSuccessOpen}
                setTokenType={setTokenType}
              />
              <Button
                type="button"
                variant="link"
                className="w-full"
                onClick={() => {
                  setShowDialog(false);
                  setShowForgetPasswordDialog(true);
                  setTokenType(TokenType.PASSWORD_RESET);
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
          setShowNewPasswordDialog={setShowNewPasswordDialog}
          setSuccessOpen={setSuccessOpen}
          email={email}
          password={password}
          type={tokenType}
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

      {showNewPasswordDialog && (
        <NewPasswordDialog
          open={showNewPasswordDialog}
          onOpenChange={setShowNewPasswordDialog}
          email={email}
          setSuccessOpen={setSuccessOpen}
        />
      )}

      {successOpen && (
        <SuccessDialog open={successOpen} onOpenChange={setSuccessOpen} setPassword={setPassword} />
      )}
    </>
  );
}
