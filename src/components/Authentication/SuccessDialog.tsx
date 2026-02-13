import { CheckCircle, Loader2, LogOutIcon } from 'lucide-react';
import { useEffect } from 'react';

import { useLoginContext } from '@/app/LoginContext';

import { Dialog, DialogContent } from '../ui/dialog';
import { authTimeoutDuration } from './Authentication';

type SuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setPassword?: (password: string) => void;
};

export function SuccessDialog({ open, onOpenChange, setPassword }: SuccessDialogProps) {
  const { login, setLogin } = useLoginContext();

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onOpenChange(false);
      if (setPassword) setPassword('');
    }, authTimeoutDuration);

    return () => clearTimeout(timer);
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-md"
        showCloseButton={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          <div
            className={login ? ' bg-orange-100 p-4 rounded-full' : 'bg-green-100 p-4 rounded-full'}
          >
            {login ? (
              <LogOutIcon className="w-16 h-16 text-orange-400" />
            ) : (
              <CheckCircle className="w-16 h-16 text-green-600" />
            )}
          </div>
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">
              {login ? 'Du wirst automatisch abgemeldet!' : 'Du wirst automatisch angemeldet!'}
            </h3>
            <p className="text-sm text-muted-foreground">Bitte warte einen Augenblick.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
