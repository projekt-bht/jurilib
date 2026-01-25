import { AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';

type CancelDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showVerifyDialog: (open: boolean) => void;
};
export function CancelDialog({ open, showVerifyDialog, onOpenChange }: CancelDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent-amber-light rounded-full">
              <AlertTriangle className="w-6 h-6 text-accent-amber" />
            </div>
            <DialogTitle className="text-2xl">Vorgang abbrechen?</DialogTitle>
          </div>
          <DialogDescription className="text-base pt-2">
            Möchten Sie wirklich abbrechen?
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            className="flex-1 bg-transparent hover:bg-accent-gray-light"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Fortfahren
          </Button>
          <Button
            variant="destructive"
            className="flex-1 hover:bg-accent-red/70"
            onClick={() => showVerifyDialog(false)}
          >
            Ja, abbrechen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
