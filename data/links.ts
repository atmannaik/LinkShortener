import { db } from '@/db';
import { links, SelectLink } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getLinksByUserId(userId: string): Promise<SelectLink[]> {
  return db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.createdAt));
}
