import { CheckCircle } from 'lucide-react';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog';

type SuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
};
export function SuccessDialog({ open, onOpenChange, message }: SuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          <div className="p-4 bg-green-100 rounded-full">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <div className="text-center space-y-3">
            <DialogTitle className="text-2xl font-semibold">Erfolgreich verifiziert!</DialogTitle>
            <DialogDescription className="text-base">{message}</DialogDescription>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
