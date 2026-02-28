'use client';

import { useState, useTransition } from 'react';
import { Pencil } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectLink } from '@/db/schema';
import { editLink } from './actions';

interface EditLinkDialogProps {
  link: SelectLink;
}

export function EditLinkDialog({ link }: EditLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(link.url);
  const [slug, setSlug] = useState(link.shortCode);
  const [urlError, setUrlError] = useState('');
  const [slugError, setSlugError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isPending, startTransition] = useTransition();

  function resetState() {
    setUrl(link.url);
    setSlug(link.shortCode);
    setUrlError('');
    setSlugError('');
    setGeneralError('');
  }

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) resetState();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUrlError('');
    setSlugError('');
    setGeneralError('');

    startTransition(async () => {
      const result = await editLink({ id: link.id, url, slug });

      if (!result.success) {
        const { error } = result;
        if (typeof error === 'string') {
          setGeneralError(error);
        } else {
          setUrlError(error.url?._errors[0] ?? '');
          setSlugError(error.slug?._errors[0] ?? '');
        }
        return;
      }

      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="size-7">
          <Pencil className="size-3.5" />
          <span className="sr-only">Edit link</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
          <DialogDescription>
            Update the destination URL or short code for this link.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-url">URL</Label>
            <Input
              id="edit-url"
              type="url"
              placeholder="https://example.com/very/long/url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={isPending}
            />
            {urlError && <p className="text-sm text-destructive">{urlError}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-slug">Short Code</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground select-none">/</span>
              <Input
                id="edit-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                disabled={isPending}
                className="font-mono"
              />
            </div>
            {slugError && <p className="text-sm text-destructive">{slugError}</p>}
          </div>

          {generalError && <p className="text-sm text-destructive">{generalError}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving…' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
