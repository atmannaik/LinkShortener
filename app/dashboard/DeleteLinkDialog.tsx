'use client';

import { useState, useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SelectLink } from '@/db/schema';
import { deleteLink } from './actions';

interface DeleteLinkDialogProps {
  link: SelectLink;
}

export function DeleteLinkDialog({ link }: DeleteLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    setError('');
    startTransition(async () => {
      const result = await deleteLink({ id: link.id });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
        >
          <Trash2 className="size-3.5" />
          <span className="sr-only">Delete link</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Link</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-mono font-medium text-foreground">/{link.shortCode}</span>?{' '}
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {error && <p className="text-sm text-destructive">{error}</p>}

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
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
