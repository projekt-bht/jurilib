'use client';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
import type { LoginResource } from '@/services/Resources';
import type { User } from '~/generated/prisma/browser';
import { TokenType } from '~/generated/prisma/enums';

import { fetchBackendData } from '../Dashboard/helper';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import { LoginDialog } from './LoginDialog';
import NewPasswordDialog from './NewPasswordDialog';
import { initialRegisterData, RegisterDialog } from './RegisterDialog';
import { SuccessDialog } from './SuccessDialog';
import { VerifyDialog } from './VerifyDialog';

export const authTimeoutDuration: number = 1000;

export function Authentication() {
  const { login, setLogin } = useLoginContext();
  const userId = (login as LoginResource).userId;
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
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
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        if (!login || !userId) {
          setIsLoadingUser(false);
          return;
        }
        // Fetch user data
        const userRes = await fetchBackendData('/user', userId, 'Benutzerinformationen');
        setUser(await userRes.json());
      } catch (error) {
        console.error('Fehler beim Abrufen der Benutzerdaten:', error);
      } finally {
        setIsLoadingUser(false);
      }
    }

    fetchData();
  }, [login, userId]);

  if (login && user && !isLoadingUser) {
    return (
      <>
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-4 rounded-xl transition cursor-pointer pr-6"
          >
            <div className="text-right">
              <p className="text-lg">{user.firstname}</p>
              <p className="text-xs text-muted-foreground">
                `({user.pronoun?.replace(/_/g, '/') ?? ''})`
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-accent-blue to-accent-blue/60 flex items-center justify-center overflow-hidden">
              {user.imageUrl ? (
                <Image
                  src={user.imageUrl || '/placeholder.svg'}
                  alt="Profilbild"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-5 h-5 text-background" />
              )}
            </div>
          </button>

          {profileMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-background rounded-xl border border-border shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2">
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent-gray-soft text-foreground text-sm transition"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <UserIcon className="w-4 h-4 text-foreground" />
                    <span>Mein Dashboard</span>
                  </Link>
                </div>
                <div className="p-2">
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent-gray-soft text-foreground text-sm transition"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 text-foreground" />
                    <span>Profileinstellungen</span>
                  </Link>
                </div>
                <div className="p-2 border-t border-border">
                  <button
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent-red-light/20 text-destructive text-sm transition w-full"
                    onClick={async () => {
                      setSuccessOpen(true);
                      await new Promise((resolve) => setTimeout(resolve, authTimeoutDuration));

                      await deleteLogin();
                      setLogin(false);
                      setSuccessOpen(false);
                      setProfileMenuOpen(false);
                      router.push('/');
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Abmelden</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

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
