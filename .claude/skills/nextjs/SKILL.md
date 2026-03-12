---
name: nextjs
description: This skill should be used when the user asks to "create a Next.js app", "set up Next.js routing", "add a Next.js page or layout", "configure Next.js caching", or needs guidance on App Router, Server Components, data fetching, Server Actions, or Next.js project structure. Provides knowledge about Next.js 15/16 with the App Router.
version: 0.1.0
---

# Next.js App Router Skill

## Quick Reference

### Create a New Project
```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir
cd my-app && npm run dev
```

### Key CLI Commands
| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (Turbopack by default in 15+) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx @next/codemod@canary upgrade latest` | Upgrade Next.js version |

### File Conventions (App Router)
| File | Purpose |
|------|---------|
| `page.tsx` | Route UI (makes folder publicly accessible) |
| `layout.tsx` | Shared UI wrapping pages (persists across navigation) |
| `template.tsx` | Like layout but re-mounts on navigation |
| `loading.tsx` | Loading UI (Suspense boundary) |
| `error.tsx` | Error boundary UI |
| `not-found.tsx` | 404 UI |
| `route.ts` | API endpoint (Route Handler) |
| `default.tsx` | Fallback for parallel routes |
| `middleware.ts` | Request middleware (root of project) |

### Folder Conventions
| Pattern | Purpose |
|---------|---------|
| `app/dashboard/page.tsx` | Route at `/dashboard` |
| `app/(marketing)/pricing/page.tsx` | Route group — URL is `/pricing` |
| `app/blog/[slug]/page.tsx` | Dynamic segment |
| `app/shop/[...slug]/page.tsx` | Catch-all segment |
| `app/shop/[[...slug]]/page.tsx` | Optional catch-all |
| `app/@modal/page.tsx` | Parallel route (named slot) |
| `app/(.)photo/page.tsx` | Intercepting route |

---

## Core Concepts

### Server Components (Default)
All components in the App Router are Server Components by default. They run on the server, have zero client JS bundle impact, and can directly access databases, file systems, and secrets.

Mark a component as a Client Component only when interactivity or browser APIs are needed:
```tsx
'use client'
export default function Counter() { /* useState, onClick, etc. */ }
```

**Composition rule:** Keep the `'use client'` boundary as low in the tree as possible. Pass Server Components as `children` to Client Components to avoid converting entire subtrees to client code.

### Layouts and Pages
- `layout.tsx` wraps child routes. It does **not** re-render on navigation — state is preserved.
- `page.tsx` is the unique UI for a route. It receives `params` and `searchParams` as props.
- Nest layouts to create hierarchical UI (e.g., `app/dashboard/layout.tsx` wraps all dashboard pages).

### Data Fetching
Fetch data directly in Server Components using `async/await`:
```tsx
export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  const posts = await data.json()
  return <PostList posts={posts} />
}
```

React automatically deduplicates `fetch` calls with the same URL and options during a single render pass — safe to call the same fetch in multiple components.

### Server Actions
Define server-side mutations with the `'use server'` directive:
```tsx
'use server'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  await db.post.create({ data: { title: formData.get('title') } })
  revalidatePath('/posts')
}
```

Invoke from forms or event handlers. Treat Server Actions as public API endpoints — always authorize the user.

### Caching & Revalidation
- **Default:** `fetch` requests are **not cached** (as of Next.js 15+).
- **Cache a request:** `fetch(url, { cache: 'force-cache' })`
- **Time-based revalidation (ISR):** `fetch(url, { next: { revalidate: 3600 } })`
- **On-demand revalidation:** Call `revalidatePath('/path')` or `revalidateTag('tag')` in a Server Action.
- **`use cache` directive:** Cache any server-side computation (database queries, file reads), not just fetch.
- **React `cache()` function:** Memoize non-fetch functions within a single render pass.

### Route Handlers (API Routes)
Define REST endpoints in `app/api/*/route.ts`:
```tsx
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const data = await db.items.findMany()
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const item = await db.items.create({ data: body })
  return NextResponse.json(item, { status: 201 })
}
```

Supported methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`.

### Middleware
Create `middleware.ts` at the project root to run logic before requests:
```tsx
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (!request.cookies.get('token')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = { matcher: ['/dashboard/:path*'] }
```

---

## Project Structure (Recommended)

```
my-app/
├── src/
│   ├── app/                  # App Router routes
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   ├── globals.css
│   │   ├── (auth)/           # Auth route group
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   └── api/
│   │       └── users/route.ts
│   ├── components/           # Shared components
│   │   ├── ui/               # Presentational
│   │   └── forms/            # Form components
│   ├── lib/                  # Utilities, db clients, helpers
│   └── types/                # TypeScript types
├── public/                   # Static assets
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Production Checklist

- Use `<Image>` for automatic optimization, lazy loading, and WebP/AVIF.
- Use `<Link>` for client-side navigation with prefetching.
- Use `<Script>` with `strategy="lazyOnload"` for third-party scripts.
- Configure metadata via the `Metadata` API for SEO (titles, descriptions, OG images).
- Generate `sitemap.xml` and `robots.txt` using `app/sitemap.ts` and `app/robots.ts`.
- Use `<Suspense>` boundaries around slow data fetches for streaming.
- Wrap dynamic API usage (`cookies()`, `searchParams`) in `<Suspense>` to avoid blocking the entire route.

## Additional Resources

- `references/api-reference.md` — Detailed API reference for components, functions, and config
- `references/patterns.md` — Common patterns, anti-patterns, and architecture decisions
- `examples/example.md` — Full working examples for common scenarios

## Sources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Next.js API Reference](https://nextjs.org/docs/app/api-reference)
- [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Caching and Revalidating](https://nextjs.org/docs/app/getting-started/caching-and-revalidating)
- [Next.js 15 Blog Post](https://nextjs.org/blog/next-15)
- [Next.js Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)
- [Building APIs with Next.js](https://nextjs.org/blog/building-apis-with-nextjs)
- [Vercel: React Best Practices](https://vercel.com/blog/introducing-react-best-practices)
