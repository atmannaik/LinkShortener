import { db } from '@/db';
import { links, InsertLink, SelectLink } from '@/db/schema';
import { and, eq, ne, desc } from 'drizzle-orm';

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

export async function getLinkById(id: string): Promise<SelectLink | undefined> {
  const [link] = await db.select().from(links).where(eq(links.id, id)).limit(1);
  return link;
}

export async function updateLinkById(
  id: string,
  data: { url: string; shortCode: string }
): Promise<SelectLink> {
  const [link] = await db
    .update(links)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(links.id, id))
    .returning();
  return link;
}

export async function deleteLinkById(id: string): Promise<void> {
  await db.delete(links).where(eq(links.id, id));
}

export async function getLinkByShortCode(shortCode: string): Promise<SelectLink | undefined> {
  const [link] = await db
    .select()
    .from(links)
    .where(eq(links.shortCode, shortCode))
    .limit(1);
  return link;
}

export async function isShortCodeTakenExcluding(
  shortCode: string,
  excludeId: string
): Promise<boolean> {
  const [existing] = await db
    .select({ id: links.id })
    .from(links)
    .where(and(eq(links.shortCode, shortCode), ne(links.id, excludeId)))
    .limit(1);
  return !!existing;
}
