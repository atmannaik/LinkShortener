---
description: Read this before creating or modifying any server actions in the project.
---

# Server Actions

## Rules

- **All data mutations** must be performed via server actions — never mutate data directly from client components or API routes.
- Server actions **must be called from client components** only.
- Server action files **must be named `actions.ts`** and **colocated** in the same directory as the client component that uses them.
- Server actions **must never throw errors**. All errors must be caught and returned as an object with a `success: false` property.

## File Structure

```
app/
  dashboard/
    actions.ts       # Server actions for dashboard
    page.tsx
  links/
    actions.ts       # Server actions for links feature
    NewLinkForm.tsx  # Client component that calls actions
```

## TypeScript Types

- All data passed to server actions must have **explicit TypeScript types** — do **not** use the `FormData` type.
- Define an input type or interface for each action's parameters.

```typescript
// ✅ Correct
type CreateLinkInput = {
  url: string;
  slug: string;
};

export async function createLink(input: CreateLinkInput) { ... }

// ❌ Wrong
export async function createLink(data: FormData) { ... }
```

## Validation

- All inputs **must be validated with Zod** before any business logic or database operations.

```typescript
const createLinkSchema = z.object({
  url: z.string().url(),
  slug: z.string().min(1).max(50),
});

export async function createLink(input: CreateLinkInput) {
  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten() };
  }
  ...
}
```

## Authentication

- Every server action **must check for a logged-in user first**, before any database operations.
- Return early with an error if the user is not authenticated.

```typescript
import { auth } from '@clerk/nextjs/server';

export async function createLink(input: CreateLinkInput) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: 'Unauthorized' };

  // proceed with validated data and DB operations
}
```

## Database Operations

- Server actions must **not** contain raw Drizzle queries directly.
- All database access must go through **helper functions** located in the `/data` directory.

```typescript
// ✅ Correct — use helper from /data
import { insertLink } from '@/data/links';

export async function createLink(input: CreateLinkInput) {
  ...
  const link = await insertLink({ userId, ...parsed.data });
  return { success: true, data: link };
}

// ❌ Wrong — raw drizzle query in action
import { db } from '@/db';
import { links } from '@/db/schema';

export async function createLink(input: CreateLinkInput) {
  await db.insert(links).values({ ... }); // Do not do this
}
```

## Return Shape

- **Never throw errors** — always catch them and return a typed result object.
- Return a consistent shape from all server actions:

```typescript
// Success
return { success: true, data: result };

// Failure
return { success: false, error: 'Error message' };
```

```typescript
// ✅ Correct
export async function createLink(input: CreateLinkInput) {
  try {
    ...
    return { success: true, data: link };
  } catch (error) {
    return { success: false, error: 'Failed to create link' };
  }
}

// ❌ Wrong
export async function createLink(input: CreateLinkInput) {
  // Throwing will cause unhandled errors on the client
  throw new Error('Something went wrong');
}
```
