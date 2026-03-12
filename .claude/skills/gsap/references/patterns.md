# GSAP Patterns & Best Practices

## Common Animation Patterns

### Fade-In on Scroll (Batch)
```js
gsap.registerPlugin(ScrollTrigger)

gsap.set(".card", { opacity: 0, y: 40 })

ScrollTrigger.batch(".card", {
  onEnter: (batch) => gsap.to(batch, {
    opacity: 1, y: 0, stagger: 0.1, ease: "power2.out"
  }),
  start: "top 85%",
})
```

### Text Reveal with SplitText
```js
gsap.registerPlugin(SplitText)

new SplitText(".hero-heading", {
  type: "chars, words",
  autoSplit: true,
  mask: "words",
  onSplit: (self) => {
    gsap.from(self.chars, {
      yPercent: 100,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.02,
    })
  },
})
```

### Staggered List Entrance
```js
gsap.from(".list-item", {
  opacity: 0,
  x: -30,
  duration: 0.5,
  stagger: {
    each: 0.08,
    from: "start",    // "start" | "end" | "center" | "edges" | "random"
  },
  ease: "power2.out",
})
```

### Page Transition (Enter/Exit)
```js
function pageEnter() {
  const tl = gsap.timeline()
  tl.from(".page-content", { opacity: 0, y: 30, duration: 0.6 })
    .from(".sidebar", { opacity: 0, x: -50, duration: 0.4 }, "-=0.3")
  return tl
}

function pageExit() {
  return gsap.to(".page-wrapper", { opacity: 0, duration: 0.3 })
}
```

### Parallax on Scroll
```js
gsap.to(".bg-image", {
  yPercent: -20,
  ease: "none",
  scrollTrigger: {
    trigger: ".parallax-section",
    start: "top bottom",
    end: "bottom top",
    scrub: true,
  },
})
```

### Pinned Section with Sequential Animations
```js
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".pinned-section",
    start: "top top",
    end: "+=2000",          // Pin for 2000px of scroll
    pin: true,
    scrub: 1,
  },
})

tl.to(".step-1", { opacity: 1, y: 0 })
  .to(".step-1", { opacity: 0 })
  .to(".step-2", { opacity: 1, y: 0 })
  .to(".step-2", { opacity: 0 })
  .to(".step-3", { opacity: 1, y: 0 })
```

### Horizontal Scroll Gallery
```js
const panels = gsap.utils.toArray(".panel")

gsap.to(panels, {
  xPercent: -100 * (panels.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: ".gallery-container",
    pin: true,
    scrub: 1,
    snap: 1 / (panels.length - 1),
    end: () => "+=" + document.querySelector(".gallery-container").scrollWidth,
  },
})
```

---

## React Patterns

### Component with useGSAP + ScrollTrigger
```tsx
"use client"
import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import ScrollTrigger from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function RevealSection() {
  const sectionRef = useRef(null)

  useGSAP(() => {
    gsap.from(".reveal-item", {
      opacity: 0,
      y: 60,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
      },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef}>
      <h2 className="reveal-item">Title</h2>
      <p className="reveal-item">Content</p>
      <button className="reveal-item">CTA</button>
    </section>
  )
}
```

### State-Driven Animation
```tsx
"use client"
import { useState, useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

export function TogglePanel() {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef(null)

  useGSAP(() => {
    gsap.to(panelRef.current, {
      height: isOpen ? "auto" : 0,
      opacity: isOpen ? 1 : 0,
      duration: 0.4,
      ease: "power2.inOut",
    })
  }, { dependencies: [isOpen] })

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      <div ref={panelRef} style={{ overflow: "hidden" }}>
        <p>Panel content</p>
      </div>
    </>
  )
}
```

### Flip Animation in React
```tsx
"use client"
import { useState, useRef } from "react"
import gsap from "gsap"
import Flip from "gsap/Flip"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(Flip)

export function FlipGrid() {
  const [layout, setLayout] = useState("grid")
  const containerRef = useRef(null)

  const toggle = () => {
    const state = Flip.getState(".flip-item")
    setLayout(prev => prev === "grid" ? "list" : "grid")

    // Must run after React render
    requestAnimationFrame(() => {
      Flip.from(state, { duration: 0.5, ease: "power2.inOut", stagger: 0.03 })
    })
  }

  return (
    <div ref={containerRef}>
      <button onClick={toggle}>Toggle Layout</button>
      <div className={layout}>
        {items.map(item => (
          <div key={item.id} className="flip-item">{item.name}</div>
        ))}
      </div>
    </div>
  )
}
```

---

## Responsive Animations with matchMedia

```js
ScrollTrigger.matchMedia({
  // Desktop
  "(min-width: 768px)": () => {
    gsap.to(".hero", {
      xPercent: -50,
      scrollTrigger: { trigger: ".hero", scrub: true },
    })
  },

  // Mobile
  "(max-width: 767px)": () => {
    gsap.to(".hero", {
      yPercent: -20,
      scrollTrigger: { trigger: ".hero", scrub: true },
    })
  },

  // All sizes
  all: () => {
    gsap.from(".fade-in", { opacity: 0, y: 30, stagger: 0.1 })
  },
})
```

---

## Common Pitfalls

1. **Forgetting `gsap.registerPlugin()`** — Plugins won't work and tree-shaking may remove them.
2. **Not cleaning up in React** — Use `useGSAP` instead of `useEffect` for automatic revert.
3. **Animating layout properties** — `width`, `height`, `top`, `left` trigger layout recalculation. Use `x`, `y`, `scale`, `opacity` instead.
4. **Conflicting tweens** — Multiple tweens on the same property fight. Use `overwrite: "auto"` or kill previous tweens.
5. **ScrollTrigger + dynamic content** — Call `ScrollTrigger.refresh()` after DOM changes.
6. **`immediateRender` with `.from()`** — `.from()` renders immediately by default. Set `immediateRender: false` in timelines to prevent flashing.
7. **Not using `autoAlpha`** — Use `autoAlpha: 0` instead of `opacity: 0` to also set `visibility: hidden`, preventing invisible elements from being interactive.
8. **Large stagger counts without batching** — Creating hundreds of individual tweens is expensive. Use `ScrollTrigger.batch()` or `stagger` on a single tween.

## Sources

- [React & GSAP Patterns](https://gsap.com/resources/react-basics/)
- [GSAP Documentation](https://gsap.com/docs/v3/GSAP/)
- [ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP Getting Started Demos](https://demos.gsap.com/getting-started/)
