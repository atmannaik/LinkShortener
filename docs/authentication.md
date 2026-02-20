# Authentication

## Overview

All authentication in the LinkShortener app is handled exclusively by **Clerk**. No other authentication methods should be used.

## Core Requirements

### Authentication Provider

- **Use Clerk Only**: All auth-related functionality must use Clerk SDK and components
- Never implement custom auth logic or use other auth providers
- Leverage Clerk's built-in features for user management, sessions, and security

### Protected Routes

The `/dashboard` route is protected and requires authentication:

```typescript
// middleware.ts or app/dashboard/layout.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }
  
  return <>{children}</>;
}
```

### Homepage Redirect Logic

If a logged-in user accesses the homepage (`/`), redirect them to `/dashboard`:

```typescript
// app/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const { userId } = await auth();
  
  if (userId) {
    redirect('/dashboard');
  }
  
  // Render homepage for non-authenticated users
  return <HomePageContent />;
}
```

### Sign In/Sign Up Modal

Always launch Clerk's sign-in and sign-up flows as modals:

```typescript
// Use Clerk's modal mode
import { SignInButton, SignUpButton } from '@clerk/nextjs';

// For Sign In
<SignInButton mode="modal">
  <button>Sign In</button>
</SignInButton>

// For Sign Up
<SignUpButton mode="modal">
  <button>Sign Up</button>
</SignUpButton>
```

## Common Patterns

### Getting Current User in Server Components

```typescript
import { auth, currentUser } from '@clerk/nextjs/server';

// Just need userId
const { userId } = await auth();

// Need full user object
const user = await currentUser();
```

### Getting Current User in Client Components

```typescript
'use client';

import { useUser, useAuth } from '@clerk/nextjs';

export function UserProfile() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { userId } = useAuth();
  
  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Please sign in</div>;
  
  return <div>Hello, {user.firstName}</div>;
}
```

### Protecting Server Actions

```typescript
'use server';

import { auth } from '@clerk/nextjs/server';

export async function createLink(data: FormData) {
  const { userId } = await auth();
  
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }
  
  // Proceed with authenticated logic
}
```

### Protecting API Routes

```typescript
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Proceed with authenticated logic
}
```

## Middleware Configuration

Use Clerk middleware to protect multiple routes:

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/user(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

## Environment Variables

Required Clerk environment variables in `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Optional: Customize URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## Best Practices

1. **Always Check Auth**: Verify authentication in all Server Actions and API routes
2. **Use Modals**: Keep users on the current page by using modal mode for auth flows
3. **Redirect Logic**: Implement proper redirects to improve UX (logged in → dashboard, logged out → home)
4. **Server-Side First**: Prefer server-side auth checks for protected routes over client-side
5. **Type Safety**: Use Clerk's TypeScript types for user objects and auth responses
6. **Error Handling**: Always handle cases where `userId` is null/undefined

## Don't

- ❌ Implement custom auth logic or JWT handling
- ❌ Use other auth providers (Auth.js, NextAuth, Passport, etc.)
- ❌ Store passwords or implement password hashing
- ❌ Build custom sign-in/sign-up forms (use Clerk components)
- ❌ Redirect to separate auth pages (use modal mode)
- ❌ Skip auth checks in API routes or Server Actions

## Do

- ✅ Use Clerk SDK for all auth operations
- ✅ Launch sign-in/sign-up as modals
- ✅ Protect `/dashboard` and require authentication
- ✅ Redirect logged-in users from homepage to dashboard
- ✅ Verify `userId` in all protected endpoints
- ✅ Use Clerk's middleware for route protection
