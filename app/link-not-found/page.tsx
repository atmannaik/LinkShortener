import Link from 'next/link';
import { LinkIcon, SearchX, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LinkNotFoundPageProps {
  searchParams: Promise<{ code?: string }>;
}

export default async function LinkNotFoundPage({ searchParams }: LinkNotFoundPageProps) {
  const { code } = await searchParams;

  return (
    <main className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        {/* Icon */}
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-muted">
          <SearchX className="h-10 w-10 text-muted-foreground" />
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-5xl font-bold tracking-tight text-foreground">404</span>
          </div>
          <h1 className="text-xl font-semibold text-foreground">Link not found</h1>
          <p className="text-sm text-muted-foreground">
            The short link you&apos;re looking for doesn&apos;t exist or may have been removed.
          </p>
        </div>

        {/* Shortcode badge */}
        {code && (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2.5">
            <LinkIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="font-mono text-sm text-muted-foreground">
              /l/
              <span className="font-semibold text-foreground">{code}</span>
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <Button asChild variant="outline" className="flex-1 gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button asChild className="flex-1 gap-2">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              My Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
