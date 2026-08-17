import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';

interface ActionConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title?: string;
  description?: string;
  itemName?: string;
  actionName?: string; // e.g. "delete", "clear", "restore"
  requireInput?: boolean;
  onConfirm: () => void;
}

export function ActionConfirmDialog({
  isOpen,
  onOpenChange,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  itemName = "this item",
  actionName = "delete",
  requireInput = true,
  onConfirm,
}: ActionConfirmDialogProps) {
  const [inputVal, setInputVal] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInputVal('');
    }
  }, [isOpen]);

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    if (requireInput && inputVal.toLowerCase() !== actionName.toLowerCase()) {
      return;
    }
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              {description} This will permanently {actionName} <span className="font-semibold text-foreground">"{itemName}"</span>.
            </p>
            {requireInput && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Please type <span className="font-bold text-destructive">{actionName}</span> to confirm.
                </p>
                <Input 
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder={`Type ${actionName} here...`}
                  className="w-full"
                />
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            disabled={requireInput && inputVal.toLowerCase() !== actionName.toLowerCase()}
            className="bg-destructive text-white hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed">
            {actionName.charAt(0).toUpperCase() + actionName.slice(1)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
