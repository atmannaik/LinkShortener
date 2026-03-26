'use client';

import { useState, useTransition } from 'react';
import { Plus } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { createLink } from './actions';

export function CreateLinkDialog() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [urlError, setUrlError] = useState('');
  const [slugError, setSlugError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isPending, startTransition] = useTransition();

  function resetState() {
    setUrl('');
    setSlug('');
    setIsPrivate(true);
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
      const result = await createLink({ url, slug, isPrivate });

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
      resetState();
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 size-4" />
          Create Link
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Short Link</DialogTitle>
          <DialogDescription>
            Paste a long URL and optionally choose a custom short-code.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/very/long/url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={isPending}
            />
            {urlError && (
              <p className="text-sm text-destructive">{urlError}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slug">
              Custom Short-Code{' '}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground select-none">/</span>
              <Input
                id="slug"
                placeholder="auto-generated"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                disabled={isPending}
                className="font-mono"
              />
            </div>
            {slugError && (
              <p className="text-sm text-destructive">{slugError}</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label htmlFor="is-private">{isPrivate ? 'Private link' : 'Public link'}</Label>
              <p className="text-sm text-muted-foreground">
                {isPrivate ? 'Only you can use this link' : 'Anyone with the link can use it'}
              </p>
            </div>
            <Switch
              id="is-private"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
              disabled={isPending}
            />
          </div>

          {generalError && (
            <p className="text-sm text-destructive">{generalError}</p>
          )}

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
              {isPending ? 'Creating…' : 'Create Link'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
