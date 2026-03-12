# Next.js Patterns & Best Practices

## Server vs. Client Component Decision

| Need | Use |
|------|-----|
| Fetch data, access backend resources | Server Component |
| Access secrets (API keys, tokens) | Server Component |
| Keep large dependencies server-side | Server Component |
| Interactive UI (onClick, onChange) | Client Component |
| State (useState, useReducer) | Client Component |
| Browser APIs (localStorage, geolocation) | Client Component |
| Effects (useEffect) | Client Component |

### Composition Pattern
Push `'use client'` boundary down. Wrap only the interactive part:

```tsx
// app/dashboard/page.tsx (Server Component)
import { InteractiveChart } from '@/components/InteractiveChart'

export default async function DashboardPage() {
  const data = await fetchAnalytics()  // Runs on server
  return (
    <div>
      <h1>Dashboard</h1>
      <InteractiveChart data={data} />  {/* Client boundary here */}
    </div>
  )
}
```

### Passing Server Components as Children
```tsx
'use client'
export function ClientWrapper({ children }) {
  const [open, setOpen] = useState(false)
  return <div>{open && children}</div>  // children stay as Server Components
}
```

---

## Data Fetching Patterns

### Pattern 1: Parallel Data Fetching
Avoid waterfalls by fetching in parallel:
```tsx
export default async function Page() {
  const [posts, categories] = await Promise.all([
    getPosts(),
    getCategories(),
  ])
  return <Feed posts={posts} categories={categories} />
}
```

### Pattern 2: Streaming with Suspense
Stream slower data while showing fast content immediately:
```tsx
import { Suspense } from 'react'

export default function Page() {
  return (
    <div>
      <Header />
      <Suspense fallback={<PostsSkeleton />}>
        <SlowPosts />    {/* Streams in when ready */}
      </Suspense>
      <Suspense fallback={<CommentsSkeleton />}>
        <SlowComments />  {/* Streams independently */}
      </Suspense>
    </div>
  )
}
```

### Pattern 3: Preloading Data
Start fetching before a component renders:
```tsx
// lib/data.ts
import { cache } from 'react'

export const getUser = cache(async (id: string) => {
  const res = await fetch(`/api/users/${id}`)
  return res.json()
})

export const preloadUser = (id: string) => { void getUser(id) }

// app/user/[id]/page.tsx
import { getUser, preloadUser } from '@/lib/data'

export default async function Page({ params }) {
  preloadUser(params.id)  // Start fetch early
  // ... other work ...
  const user = await getUser(params.id)  // Hits cache, no duplicate request
}
```

---

## Form Handling with Server Actions

### Basic Form
```tsx
// app/actions.ts
'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createItem(formData: FormData) {
  const name = formData.get('name') as string
  await db.items.create({ data: { name } })
  revalidatePath('/items')
  redirect('/items')
}

// app/items/new/page.tsx
import { createItem } from '@/app/actions'

export default function NewItemPage() {
  return (
    <form action={createItem}>
      <input name="name" required />
      <button type="submit">Create</button>
    </form>
  )
}
```

### Form with Validation & Pending State
```tsx
'use client'
import { useActionState } from 'react'
import { createItem } from '@/app/actions'

export default function Form() {
  const [state, action, isPending] = useActionState(createItem, null)
  return (
    <form action={action}>
      <input name="name" required />
      {state?.error && <p className="text-red-500">{state.error}</p>}
      <button disabled={isPending}>
        {isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  )
}
```

---

## Authentication Pattern

### Middleware-Based Auth
```tsx
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard', '/settings', '/profile']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const isProtected = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

---

## Common Anti-Patterns to Avoid

1. **Adding `'use client'` at layout level** — Converts entire subtree to client, losing Server Component benefits.
2. **Fetching in Client Components when Server Components suffice** — Creates unnecessary waterfalls and exposes API calls to the client.
3. **Using `useEffect` for data fetching** — Prefer Server Components or Route Handlers. `useEffect` fetching causes loading waterfalls.
4. **Over-caching** — In Next.js 15+, fetch is not cached by default. Be intentional about caching — only cache what needs it.
5. **Ignoring Suspense boundaries** — Without `<Suspense>`, a slow data fetch blocks the entire page.
6. **Using Route Handlers for internal data fetching** — Call the database/API directly in Server Components instead of routing through your own API.
7. **Large `'use client'` modules** — Split interactive parts into small Client Components. Import heavy libraries only in Server Components.

---

## Error Handling Strategy

```
app/
├── error.tsx          # Catches errors in all nested routes
├── global-error.tsx   # Catches errors in root layout (must include <html> and <body>)
├── dashboard/
│   ├── error.tsx      # Dashboard-specific error boundary
│   └── page.tsx
```

Error components must be Client Components:
```tsx
'use client'

export default function Error({ error, reset }: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

## Sources

- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js Data Fetching Patterns](https://nextjs.org/docs/app/getting-started/fetching-data)
- [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [Vercel React Best Practices](https://vercel.com/blog/introducing-react-best-practices)
