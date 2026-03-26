import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getLinksByUserId } from '@/data/links';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Lock, Globe } from 'lucide-react';
import { CreateLinkDialog } from './CreateLinkDialog';
import { EditLinkDialog } from './EditLinkDialog';
import { DeleteLinkDialog } from './DeleteLinkDialog';
import { ShareLinkButton } from './ShareLinkButton';
import { PrivacyToggleButton } from './PrivacyToggleButton';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  const links = await getLinksByUserId(userId);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Links</h1>
        <CreateLinkDialog />
      </div>

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
                  <div className="flex flex-col gap-3">
                    {link.isPrivate ? (
                      <Badge variant="outline" className="w-fit gap-1">
                        <Lock className="size-3" />
                        Private
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="w-fit gap-1 border-green-300 text-green-600 dark:border-green-700 dark:text-green-400">
                        <Globe className="size-3" />
                        Public
                      </Badge>
                    )}
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 max-w-[40%] overflow-x-auto sm:max-w-[50%]">
                        <Badge variant="secondary" className="whitespace-nowrap font-mono text-sm">
                          /{link.shortCode}
                        </Badge>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <ShareLinkButton shortCode={link.shortCode} id={link.id} isPrivate={link.isPrivate} />
                        <PrivacyToggleButton id={link.id} isPrivate={link.isPrivate} />
                        <EditLinkDialog link={link} />
                        <DeleteLinkDialog link={link} />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between gap-4">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-w-0 items-center gap-1.5 truncate text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                      <ExternalLink className="size-3.5 shrink-0" />
                      {link.url}
                    </a>
                    <span className="shrink-0 text-sm text-muted-foreground">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
