# Next.js API Reference

## Built-in Components

### `<Image>`
```tsx
import Image from 'next/image'

<Image
  src="/hero.png"
  alt="Hero"
  width={800}
  height={400}
  priority          // Preload for LCP images
  placeholder="blur" // Blur-up placeholder
  blurDataURL="..."  // Base64 for placeholder
/>
```

Props: `src`, `alt`, `width`, `height`, `fill`, `sizes`, `quality` (1-100, default 75), `priority`, `placeholder`, `loading` (`lazy` | `eager`).

Use `fill` for responsive images inside a positioned container. Always pair `fill` with `sizes` for correct srcset generation.

### `<Link>`
```tsx
import Link from 'next/link'

<Link href="/dashboard" prefetch={true}>Dashboard</Link>
<Link href={{ pathname: '/blog/[slug]', query: { slug: 'hello' } }}>Post</Link>
```

Props: `href` (string or object), `replace`, `scroll` (default `true`), `prefetch` (default `true` in production).

### `<Script>`
```tsx
import Script from 'next/script'

<Script src="https://analytics.example.com/script.js" strategy="lazyOnload" />
<Script id="inline-script" strategy="afterInteractive">
  {`console.log('loaded')`}
</Script>
```

Strategies: `beforeInteractive`, `afterInteractive` (default), `lazyOnload`, `worker`.

### `<Head>` / Metadata API
Use the Metadata API instead of `<Head>` in App Router:
```tsx
// app/layout.tsx — static
export const metadata = {
  title: 'My App',
  description: 'Description',
  openGraph: { title: 'My App', images: ['/og.png'] },
}

// app/blog/[slug]/page.tsx — dynamic
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug)
  return { title: post.title, description: post.excerpt }
}
```

---

## Key Functions

### `fetch` (Extended)
```tsx
// No cache (default in Next.js 15+)
const res = await fetch('https://api.example.com/data')

// Force cache
const res = await fetch(url, { cache: 'force-cache' })

// Revalidate every hour
const res = await fetch(url, { next: { revalidate: 3600 } })

// Tag for on-demand revalidation
const res = await fetch(url, { next: { tags: ['posts'] } })
```

### `revalidatePath`
```tsx
import { revalidatePath } from 'next/cache'

revalidatePath('/blog')           // Revalidate specific path
revalidatePath('/blog/[slug]', 'page')  // Revalidate dynamic page
revalidatePath('/', 'layout')     // Revalidate everything
```

### `revalidateTag`
```tsx
import { revalidateTag } from 'next/cache'

revalidateTag('posts')  // Invalidate all fetches tagged 'posts'
```

### `redirect`
```tsx
import { redirect } from 'next/navigation'

redirect('/login')        // 307 temporary redirect
redirect('/login', 'replace')  // Replace current history entry
```

### `notFound`
```tsx
import { notFound } from 'next/navigation'

export default async function Page({ params }) {
  const post = await getPost(params.slug)
  if (!post) notFound()   // Renders not-found.tsx
  return <Post post={post} />
}
```

### `cookies` and `headers`
```tsx
import { cookies, headers } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')

  const headerList = await headers()
  const userAgent = headerList.get('user-agent')
}
```

Note: Using `cookies()` or `headers()` opts the route into dynamic rendering.

### `useRouter` (Client Component)
```tsx
'use client'
import { useRouter } from 'next/navigation'

export default function Component() {
  const router = useRouter()
  router.push('/dashboard')
  router.replace('/login')
  router.refresh()    // Refresh current route (re-fetch server components)
  router.back()
  router.forward()
}
```

### `useSearchParams` (Client Component)
```tsx
'use client'
import { useSearchParams } from 'next/navigation'

export default function Search() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
}
```

### `usePathname` (Client Component)
```tsx
'use client'
import { usePathname } from 'next/navigation'

export default function NavLink() {
  const pathname = usePathname()
  return <span>{pathname}</span>
}
```

---

## next.config.ts

```tsx
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Redirects
  async redirects() {
    return [{ source: '/old', destination: '/new', permanent: true }]
  },

  // Rewrites
  async rewrites() {
    return [{ source: '/api/:path*', destination: 'https://backend.example.com/:path*' }]
  },

  // Image optimization
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.example.com' },
    ],
  },

  // Environment variables (public)
  env: { NEXT_PUBLIC_API_URL: process.env.API_URL },

  // External packages for server components
  serverExternalPackages: ['sharp', 'bcrypt'],

  // Experimental features
  experimental: {
    typedRoutes: true,  // Type-safe routing
  },
}

export default nextConfig
```

---

## Dynamic Route Params

### `generateStaticParams`
Pre-render dynamic routes at build time:
```tsx
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function Page({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  return <Article post={post} />
}
```

### `generateMetadata`
Generate dynamic metadata per page:
```tsx
export async function generateMetadata({ params, searchParams }) {
  const product = await getProduct(params.id)
  return {
    title: product.name,
    openGraph: { images: [product.image] },
  }
}
```

## Sources

- [Next.js API Reference](https://nextjs.org/docs/app/api-reference)
- [Next.js Functions](https://nextjs.org/docs/app/api-reference/functions)
- [Next.js Components](https://nextjs.org/docs/app/api-reference/components)
- [next.config.js Reference](https://nextjs.org/docs/app/api-reference/config/next-config-js)
