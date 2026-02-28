'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { insertLink, isShortCodeTaken, getLinkById, updateLinkById, deleteLinkById, isShortCodeTakenExcluding } from '@/data/links';
import { SelectLink } from '@/db/schema';

const createLinkSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  slug: z
    .string()
    .max(50, 'Slug must be 50 characters or fewer')
    .regex(
      /^[a-zA-Z0-9_-]*$/,
      'Slug may only contain letters, numbers, hyphens, and underscores'
    )
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
});

type CreateLinkInput = {
  url: string;
  slug: string;
};

type CreateLinkResult =
  | { success: true; data: SelectLink }
  | { success: false; error: string | z.ZodFormattedError<{ url: string; slug?: string }> };

function generateShortCode(): string {
  return Math.random().toString(36).substring(2, 8);
}

export async function createLink(input: CreateLinkInput): Promise<CreateLinkResult> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.format() };
  }

  const { url, slug } = parsed.data;

  let shortCode = slug;

  if (!shortCode) {
    // Auto-generate a unique short code
    let attempts = 0;
    do {
      shortCode = generateShortCode();
      attempts++;
      if (attempts > 10) {
        return { success: false, error: 'Failed to generate a unique short code. Please try again.' };
      }
    } while (await isShortCodeTaken(shortCode));
  } else {
    const taken = await isShortCodeTaken(shortCode);
    if (taken) {
      return { success: false, error: 'That slug is already taken. Please choose a different one.' };
    }
  }

  try {
    const link = await insertLink({ userId, url, shortCode });
    revalidatePath('/dashboard');
    return { success: true, data: link };
  } catch (err) {
    console.error('Failed to create link:', err);
    return { success: false, error: 'Failed to create link. Please try again.' };
  }
}

// ─── Edit Link ────────────────────────────────────────────────────────────────

const editLinkSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  slug: z
    .string()
    .min(1, 'Short code is required')
    .max(50, 'Slug must be 50 characters or fewer')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Slug may only contain letters, numbers, hyphens, and underscores'
    ),
});

type EditLinkInput = {
  id: string;
  url: string;
  slug: string;
};

type EditLinkResult =
  | { success: true; data: SelectLink }
  | { success: false; error: string | z.ZodFormattedError<{ url: string; slug: string }> };

export async function editLink(input: EditLinkInput): Promise<EditLinkResult> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: 'Unauthorized' };

  const parsed = editLinkSchema.safeParse({ url: input.url, slug: input.slug });
  if (!parsed.success) {
    return { success: false, error: parsed.error.format() };
  }

  const { url, slug } = parsed.data;

  const existing = await getLinkById(input.id);
  if (!existing || existing.userId !== userId) {
    return { success: false, error: 'Link not found.' };
  }

  if (slug !== existing.shortCode) {
    const taken = await isShortCodeTakenExcluding(slug, input.id);
    if (taken) {
      return { success: false, error: 'That slug is already taken. Please choose a different one.' };
    }
  }

  try {
    const link = await updateLinkById(input.id, { url, shortCode: slug });
    revalidatePath('/dashboard');
    return { success: true, data: link };
  } catch (err) {
    console.error('Failed to update link:', err);
    return { success: false, error: 'Failed to update link. Please try again.' };
  }
}

// ─── Delete Link ──────────────────────────────────────────────────────────────

type DeleteLinkInput = {
  id: string;
};

type DeleteLinkResult = { success: true } | { success: false; error: string };

export async function deleteLink(input: DeleteLinkInput): Promise<DeleteLinkResult> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: 'Unauthorized' };

  const existing = await getLinkById(input.id);
  if (!existing || existing.userId !== userId) {
    return { success: false, error: 'Link not found.' };
  }

  try {
    await deleteLinkById(input.id);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Failed to delete link:', err);
    return { success: false, error: 'Failed to delete link. Please try again.' };
  }
}
