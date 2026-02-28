import { db } from '@/db';
import { links, InsertLink, SelectLink } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getLinksByUserId(userId: string): Promise<SelectLink[]> {
  return db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.createdAt));
}

export async function insertLink(
  data: Omit<InsertLink, 'id' | 'createdAt' | 'updatedAt'>
): Promise<SelectLink> {
  const [link] = await db
    .insert(links)
    .values({
      id: crypto.randomUUID(),
      ...data,
    })
    .returning();
  return link;
}

export async function isShortCodeTaken(shortCode: string): Promise<boolean> {
  const [existing] = await db
    .select({ id: links.id })
    .from(links)
    .where(eq(links.shortCode, shortCode))
    .limit(1);
  return !!existing;
}
