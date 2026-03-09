'use client';

import { useEffect, useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Mail,
  MessageCircle,
  Twitter,
  Send,
  Linkedin,
  Facebook,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ShareLinkButtonProps {
  shortCode: string;
}

const PLATFORMS = [
  {
    name: 'WhatsApp',
    Icon: MessageCircle,
    bg: '#25D366',
    getHref: (url: string) => `https://wa.me/?text=${encodeURIComponent(url)}`,
  },
  {
    name: 'Twitter',
    Icon: Twitter,
    bg: '#000000',
    getHref: (url: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
  },
  {
    name: 'Telegram',
    Icon: Send,
    bg: '#2CA5E0',
    getHref: (url: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}`,
  },
  {
    name: 'LinkedIn',
    Icon: Linkedin,
    bg: '#0A66C2',
    getHref: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: 'Facebook',
    Icon: Facebook,
    bg: '#1877F2',
    getHref: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: 'Email',
    Icon: Mail,
    bg: '#EA4335',
    getHref: (url: string) =>
      `mailto:?subject=Check%20out%20this%20link&body=${encodeURIComponent(url)}`,
  },
] as const;

export function ShareLinkButton({ shortCode }: ShareLinkButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shortUrl, setShortUrl] = useState(`/l/${shortCode}`);

  useEffect(() => {
    setShortUrl(`${window.location.origin}/l/${shortCode}`);
  }, [shortCode]);

  async function handleCopy() {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handlePlatformClick(getHref: (url: string) => string) {
    window.open(getHref(shortUrl), '_blank', 'noopener,noreferrer');
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="size-7" aria-label="Share link">
          <Share2 className="size-3.5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
        </DialogHeader>

        {/* Short URL + Copy icon */}
        <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2">
          <span className="flex-1 truncate font-mono text-sm">{shortUrl}</span>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 shrink-0"
            onClick={handleCopy}
            aria-label="Copy link"
          >
            {copied ? (
              <Check className="size-3.5 text-green-500" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </Button>
        </div>

        {/* Platform share buttons */}
        <div className="flex justify-between gap-1 pt-1">
          {PLATFORMS.map(({ name, Icon, bg, getHref }) => (
            <button
              key={name}
              onClick={() => handlePlatformClick(getHref)}
              aria-label={`Share on ${name}`}
              className="group flex flex-col items-center gap-1.5"
            >
              <div
                className="flex size-11 items-center justify-center rounded-full text-white transition-opacity group-hover:opacity-80"
                style={{ backgroundColor: bg }}
              >
                <Icon className="size-5" />
              </div>
              <span className="text-xs text-muted-foreground">{name}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
