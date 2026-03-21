'use client';

import { useState, useTransition } from 'react';
import { Lock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { togglePrivacy } from './actions';

interface PrivacyToggleButtonProps {
  id: string;
  isPrivate: boolean;
}

export function PrivacyToggleButton({ id, isPrivate }: PrivacyToggleButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await togglePrivacy({ id, isPrivate: !isPrivate });
      setOpen(false);
    });
  }

  const makingPrivate = !isPrivate;

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="size-7"
        aria-label={isPrivate ? 'Make public' : 'Make private'}
        onClick={() => setOpen(true)}
      >
        {isPrivate ? (
          <Globe className="size-3.5" />
        ) : (
          <Lock className="size-3.5" />
        )}
      </Button>

      <Dialog open={open} onOpenChange={(v) => { if (!isPending) setOpen(v); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {makingPrivate ? (
                <Lock className="size-4" />
              ) : (
                <Globe className="size-4" />
              )}
              {makingPrivate ? 'Make link private?' : 'Make link public?'}
            </DialogTitle>
            <DialogDescription>
              {makingPrivate
                ? 'Only you will be able to use this short link for redirects. Anyone else who tries will see a "link not found" page.'
                : 'Anyone with this short link will be able to use it for redirects, even without an account.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={isPending}
            >
              {isPending
                ? 'Saving…'
                : makingPrivate
                  ? 'Make Private'
                  : 'Make Public'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
