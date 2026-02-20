# Agent Instructions for LinkShortener

## Purpose

This file serves as the main entry point for AI agents (LLMs) working on the LinkShortener project. All detailed coding standards, patterns, and best practices are documented in the `/docs` directory.

## Quick Reference

### Tech Stack
- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui (New York style)
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Authentication**: Clerk
- **Icons**: Lucide React

### Documentation Index

For detailed guidance on specific topics, refer to the modular documentation in the `/docs` directory. 
ALWAYS refer to the relevant .md file BEFORE generating any code:

- **UI Components**: [ui-components.md](docs/ui-components.md) - shadcn/ui usage guidelines and patterns
- **Authentication**: [authentication.md](docs/authentication.md) - Clerk setup, protected routes, and auth patterns


## Core Principles

When working on this project, always follow these principles:

### 1. Type Safety First
- Use TypeScript strictly, no `any` types
- Infer types from database schema
- Explicit types for function signatures
- Use `unknown` instead of `any` when type is uncertain

### 2. Server-First Architecture
- Prefer Server Components by default
- Use Client Components only when needed (interactivity, hooks, browser APIs)
- Fetch data directly in Server Components
- Use Server Actions for mutations

### 3. Modern React Patterns
- Avoid `useEffect` for data fetching
- Use Suspense for loading states
- Implement proper error boundaries
- Leverage React 19 features

### 4. Database Best Practices
- Use Drizzle ORM for all database operations
- Define proper indexes for performance
- Use transactions for multi-step operations
- Create reusable query functions

### 5. Styling Consistency
- Use Tailwind utility classes
- Follow mobile-first responsive design
- Always include dark mode styles
- Use shadcn/ui components before creating custom ones
- Use the `cn()` utility for class merging

### 6. Code Organization
- Follow Next.js App Router conventions
- Use path aliases (`@/*`) for imports
- Colocate related files
- Maintain consistent file naming

### 7. Accessibility & Performance
- Semantic HTML elements
- Proper ARIA labels
- Keyboard navigation support
- Optimize for Core Web Vitals
- Use streaming with Suspense

### 8. Security
- Validate all user inputs (use Zod)
- Authenticate requests in Server Actions and API routes
- Never expose sensitive data client-side
- Use environment variables for secrets

## Command Reference

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npx drizzle-kit generate # Generate migrations from schema
npx drizzle-kit push     # Push schema to DB (development)
npx drizzle-kit migrate  # Run migrations (production)
npx drizzle-kit studio   # Open Drizzle Studio

# Git workflow
git checkout -b feature/description
git add .
git commit -m "type: description"
git push origin feature/description
```

## Path Aliases

```typescript
@/*              # Root directory
@/components/*   # React components
@/lib/*          # Utility functions
@/hooks/*        # Custom React hooks
@/db/*           # Database layer
@/actions/*      # Server Actions
@/types/*        # TypeScript types
```

## Common Patterns

### Creating a New Feature

1. **Define database schema** (if needed)
   - Add table to `db/schema.ts`
   - Run `npx drizzle-kit push`

2. **Create Server Actions**
   - Add to `actions/[feature].ts`
   - Include validation, auth, and error handling

3. **Build components**
   - Server Components for data display
   - Client Components for interactivity
   - Use shadcn/ui components

4. **Add routes**
   - Create `app/[feature]/page.tsx`
   - Add loading and error states

5. **Style with Tailwind**
   - Mobile-first approach
   - Include dark mode
   - Use consistent spacing

### Making Database Changes

1. Update `db/schema.ts`
2. Run `npx drizzle-kit generate` (for migrations) or `npx drizzle-kit push` (dev)
3. Review generated SQL
4. Update type definitions if needed

### Adding New Components

1. Determine if Server or Client Component
2. Add to appropriate `components/` subdirectory
3. Define TypeScript interfaces
4. Use shadcn/ui components and Tailwind classes
5. Export from index file if needed

## Error Handling Patterns

```typescript
// Server Action
'use server';

export async function createItem(data: FormData) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }
    
    // Implementation
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating item:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// API Route
export async function POST(request: NextRequest) {
  try {
    // Implementation
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## When in Doubt

1. Check the relevant documentation file in `/docs`
2. Review existing code for similar patterns
3. Follow Next.js and React best practices
4. Prioritize type safety and user experience
5. Write clean, maintainable code

## Getting Help

- **UI Components**: See [07-ui-components.md](docs/07-ui-components.md)
- **Authentication & Authorization**: See [06-authentication.md](docs/06-authentication.md)
- **Project Structure**: See [05-project-structure.md](docs/05-project-structure.md)
- **TypeScript Issues**: See [01-typescript.md](docs/01-typescript.md)
- **React/Next.js Questions**: See [02-react-nextjs.md](docs/02-react-nextjs.md)
- **Styling Problems**: See [03-styling.md](docs/03-styling.md)
- **Database Queries**: See [04-database.md](docs/04-database.md)

---

**Remember**: These guidelines ensure code consistency, maintainability, and quality. Always refer to the detailed documentation in `/docs` when implementing features or making changes.
