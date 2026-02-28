import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getLinksByUserId } from '@/data/links';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  const links = await getLinksByUserId(userId);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Your Links</h1>

      {links.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No links yet. Create your first short link to get started.
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {links.map((link) => (
            <li key={link.id}>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle className="text-base font-medium">
                      <Badge variant="secondary" className="font-mono text-sm">
                        /{link.shortCode}
                      </Badge>
                    </CardTitle>
                    <span className="text-xs text-muted-foreground">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 truncate text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    <ExternalLink className="size-3.5 shrink-0" />
                    {link.url}
                  </a>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
