# LinkShortener

A full-stack URL shortener built with Next.js. Paste any long URL and get a short, shareable link in seconds.

**Live Demo:** [https://link-shortener-atmannaik.vercel.app](https://link-shortener-atmannaik.vercel.app)

---

## Features

- **Shorten URLs** — Paste any long URL and generate a short link instantly
- **Custom slugs** — Optionally choose your own short code (e.g. `/l/my-link`) instead of a random one
- **Edit links** — Update the destination URL or slug of any existing link
- **Delete links** — Remove links you no longer need, with a confirmation step
- **Share links** — One-click sharing to WhatsApp, X (Twitter), Telegram, LinkedIn, Facebook, and email — plus a copy-to-clipboard button
- **Instant redirects** — Visiting a short link redirects immediately to the original URL
- **Authentication** — Sign in / sign up via Clerk; your links are private to your account
- **Dashboard** — View and manage all your links in one place

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict) |
| UI | React 19 + Tailwind CSS v4 + shadcn/ui |
| Icons | Lucide React |
| Database | Neon PostgreSQL (serverless) |
| ORM | Drizzle ORM |
| Authentication | Clerk |
| Validation | Zod |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database
- A [Clerk](https://clerk.com) application

### Installation

1. Clone the repository:

```bash
git clone https://github.com/atmannaik/LinkShortener.git
cd LinkShortener
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables by creating a `.env.local` file:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Neon Database
DATABASE_URL=your_neon_database_connection_string
```

4. Push the database schema:

```bash
npx drizzle-kit push
```

5. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
app/
  page.tsx              # Landing / marketing page
  dashboard/
    page.tsx            # User dashboard — lists and manages links
    actions.ts          # Server Actions (create, edit, delete)
  l/[shortcode]/
    route.ts            # Redirect handler
  link-not-found/
    page.tsx            # 404 page for unknown short codes
components/
  NavBar.tsx            # Navigation bar
  ui/                   # shadcn/ui component primitives
data/
  links.ts              # All database query functions
db/
  schema.ts             # Drizzle schema definition
  index.ts              # Database connection
proxy.ts                # Clerk middleware (route protection)
```

---

## Database Schema

A single `links` table stores all shortened URLs:

| Column | Type | Description |
|---|---|---|
| `id` | `text` | Primary key (UUID) |
| `user_id` | `text` | Clerk user ID (owner) |
| `short_code` | `text` | The slug used in the short URL |
| `url` | `text` | The original long URL |
| `created_at` | `timestamp` | When the link was created |
| `updated_at` | `timestamp` | When the link was last edited |

---

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

npx drizzle-kit push     # Push schema changes to the database (development)
npx drizzle-kit generate # Generate SQL migration files
npx drizzle-kit studio   # Open Drizzle Studio (database GUI)
```
