# Next.js Working Examples

## Example 1: Full CRUD App Structure

```
app/
├── layout.tsx
├── page.tsx                    # Home
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── posts/
│   ├── page.tsx                # List all posts
│   ├── new/page.tsx            # Create post form
│   ├── [id]/
│   │   ├── page.tsx            # View single post
│   │   └── edit/page.tsx       # Edit post form
│   └── loading.tsx             # Skeleton for posts
├── api/
│   └── posts/
│       ├── route.ts            # GET all, POST new
│       └── [id]/route.ts       # GET one, PUT, DELETE
└── actions.ts                  # Server Actions
```

### Root Layout
```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'My App', template: '%s | My App' },
  description: 'A Next.js application',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <a href="/">Home</a>
          <a href="/posts">Posts</a>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
```

### Posts List Page (Server Component)
```tsx
// app/posts/page.tsx
import Link from 'next/link'

async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { tags: ['posts'], revalidate: 60 },
  })
  return res.json()
}

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <div>
      <h1>Posts</h1>
      <Link href="/posts/new">Create Post</Link>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### Server Actions
```tsx
// app/actions.ts
'use server'

import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  const res = await fetch('https://api.example.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  })

  if (!res.ok) {
    return { error: 'Failed to create post' }
  }

  revalidateTag('posts')
  redirect('/posts')
}

export async function deletePost(id: string) {
  await fetch(`https://api.example.com/posts/${id}`, { method: 'DELETE' })
  revalidateTag('posts')
  redirect('/posts')
}
```

### Create Post Form (Client Component for interactivity)
```tsx
// app/posts/new/page.tsx
'use client'

import { useActionState } from 'react'
import { createPost } from '@/app/actions'

export default function NewPostPage() {
  const [state, action, isPending] = useActionState(createPost, null)

  return (
    <form action={action}>
      <h1>Create Post</h1>
      <label>
        Title
        <input name="title" required />
      </label>
      <label>
        Content
        <textarea name="content" required rows={6} />
      </label>
      {state?.error && <p style={{ color: 'red' }}>{state.error}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  )
}
```

### Route Handler (API)
```tsx
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const posts = await db.post.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(posts)
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  if (!body.title || !body.content) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const post = await db.post.create({ data: body })
  return NextResponse.json(post, { status: 201 })
}
```

---

## Example 2: Dynamic OG Image

```tsx
// app/posts/[id]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)

  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: 48,
        padding: 40,
      }}>
        <h1>{post.title}</h1>
      </div>
    ),
    size
  )
}
```

---

## Example 3: Parallel Data Fetching with Suspense

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react'

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Suspense fallback={<CardSkeleton />}>
          <RevenueCard />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <UsersCard />
        </Suspense>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <RecentOrders />
      </Suspense>
    </div>
  )
}

async function RevenueCard() {
  const revenue = await getRevenue()  // Each streams independently
  return <div><h2>Revenue</h2><p>${revenue.total}</p></div>
}

async function UsersCard() {
  const users = await getUserCount()
  return <div><h2>Users</h2><p>{users.count}</p></div>
}

async function RecentOrders() {
  const orders = await getRecentOrders()
  return (
    <table>
      <thead><tr><th>Order</th><th>Status</th></tr></thead>
      <tbody>
        {orders.map(o => <tr key={o.id}><td>{o.id}</td><td>{o.status}</td></tr>)}
      </tbody>
    </table>
  )
}
```

## Sources

- [Next.js App Router Examples](https://nextjs.org/docs/app)
- [Next.js Server Actions](https://nextjs.org/docs/app/getting-started/updating-data)
- [Next.js Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)
