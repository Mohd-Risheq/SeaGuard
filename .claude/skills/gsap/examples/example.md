# GSAP Working Examples

## Example 1: Landing Page Hero Animation

```js
import gsap from "gsap"
import SplitText from "gsap/SplitText"

gsap.registerPlugin(SplitText)

// Split the heading text
new SplitText(".hero-title", {
  type: "chars, words",
  autoSplit: true,
  mask: "words",
  onSplit: (self) => {
    const tl = gsap.timeline({ delay: 0.3 })

    tl.from(self.chars, {
      yPercent: 100,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.025,
    })
    .from(".hero-subtitle", {
      opacity: 0,
      y: 20,
      duration: 0.6,
    }, "-=0.3")
    .from(".hero-cta", {
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      ease: "back.out(1.7)",
    }, "-=0.2")
    .from(".hero-image", {
      opacity: 0,
      x: 50,
      duration: 0.8,
      ease: "power2.out",
    }, "-=0.5")
  },
})
```

```html
<section class="hero">
  <h1 class="hero-title">Build Something Amazing</h1>
  <p class="hero-subtitle">The modern platform for creative developers</p>
  <button class="hero-cta">Get Started</button>
  <img class="hero-image" src="/hero.png" alt="Hero" />
</section>
```

---

## Example 2: Scroll-Driven Storytelling (Pin + Scrub)

```js
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".story-section",
    start: "top top",
    end: "+=3000",
    pin: true,
    scrub: 1,
  },
})

// Step 1: Fade in first card
tl.from(".story-card-1", { opacity: 0, y: 100 })
  .to(".story-card-1 .progress", { width: "100%", duration: 2 })

// Step 2: Transition to second card
  .to(".story-card-1", { opacity: 0, y: -50 })
  .from(".story-card-2", { opacity: 0, y: 100 }, "-=0.3")
  .to(".story-card-2 .progress", { width: "100%", duration: 2 })

// Step 3: Final reveal
  .to(".story-card-2", { opacity: 0, y: -50 })
  .from(".story-final", { opacity: 0, scale: 0.8, ease: "power2.out" })
```

```html
<section class="story-section" style="height: 100vh; overflow: hidden;">
  <div class="story-card-1">
    <h2>Step 1</h2>
    <div class="progress" style="width: 0; height: 4px; background: blue;"></div>
  </div>
  <div class="story-card-2" style="opacity: 0;">
    <h2>Step 2</h2>
    <div class="progress" style="width: 0; height: 4px; background: green;"></div>
  </div>
  <div class="story-final" style="opacity: 0;">
    <h2>The Result</h2>
  </div>
</section>
```

---

## Example 3: React Card Grid with Flip Layout Toggle

```tsx
"use client"
import { useState, useRef } from "react"
import gsap from "gsap"
import Flip from "gsap/Flip"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(Flip, useGSAP)

const items = [
  { id: 1, title: "Design", color: "#ff6b6b" },
  { id: 2, title: "Develop", color: "#4ecdc4" },
  { id: 3, title: "Deploy", color: "#45b7d1" },
  { id: 4, title: "Monitor", color: "#96ceb4" },
]

export function FlipCards() {
  const [isGrid, setIsGrid] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  const toggleLayout = () => {
    const state = Flip.getState(".flip-card", { props: "borderRadius" })
    setIsGrid((prev) => !prev)

    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.6,
        ease: "power2.inOut",
        stagger: 0.05,
        absolute: true,
      })
    })
  }

  return (
    <div>
      <button onClick={toggleLayout}>
        {isGrid ? "List View" : "Grid View"}
      </button>
      <div
        ref={containerRef}
        style={{
          display: isGrid ? "grid" : "flex",
          gridTemplateColumns: isGrid ? "repeat(2, 1fr)" : undefined,
          flexDirection: isGrid ? undefined : "column",
          gap: 16,
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="flip-card"
            data-flip-id={`card-${item.id}`}
            style={{
              background: item.color,
              padding: 24,
              borderRadius: isGrid ? 12 : 8,
              color: "white",
              fontWeight: "bold",
            }}
          >
            {item.title}
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## Example 4: SVG Draw + Morph Animation

```js
import gsap from "gsap"
import DrawSVGPlugin from "gsap/DrawSVGPlugin"
import MorphSVGPlugin from "gsap/MorphSVGPlugin"

gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin)

const tl = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 1 })

// Draw the circle outline
tl.fromTo("#circle-outline",
  { drawSVG: "0%" },
  { drawSVG: "100%", duration: 1.5, ease: "power2.inOut" }
)

// Morph circle into star
.to("#circle-shape", {
  morphSVG: "#star-shape",
  duration: 1,
  ease: "power2.inOut",
}, "+=0.3")

// Color transition during morph
.to("#circle-shape", {
  fill: "#FFD700",
  duration: 1,
}, "<")
```

```html
<svg viewBox="0 0 200 200" width="200" height="200">
  <circle id="circle-outline" cx="100" cy="100" r="80"
    fill="none" stroke="#4ecdc4" stroke-width="3" />
  <circle id="circle-shape" cx="100" cy="100" r="60" fill="#4ecdc4" />
  <polygon id="star-shape" points="100,10 130,80 200,80 145,125 165,195 100,155 35,195 55,125 0,80 70,80"
    fill="#FFD700" style="visibility: hidden;" />
</svg>
```

---

## Example 5: Mouse-Following Element (quickTo)

```js
import gsap from "gsap"

// Create quickTo functions for performance
const xTo = gsap.quickTo(".cursor-follower", "x", { duration: 0.6, ease: "power3" })
const yTo = gsap.quickTo(".cursor-follower", "y", { duration: 0.6, ease: "power3" })

window.addEventListener("mousemove", (e) => {
  xTo(e.clientX)
  yTo(e.clientY)
})
```

```html
<div class="cursor-follower" style="
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(78, 205, 196, 0.5);
  position: fixed;
  top: -15px;
  left: -15px;
  pointer-events: none;
  z-index: 9999;
"></div>
```

## Sources

- [GSAP Getting Started Demos](https://demos.gsap.com/getting-started/)
- [GSAP ScrollTrigger Demos](https://gsap.com/scroll/)
- [React & GSAP Patterns](https://gsap.com/resources/react-basics/)
- [Codrops – GSAP Plugin Demos](https://tympanus.net/codrops/2025/05/14/from-splittext-to-morphsvg-5-creative-demos-using-free-gsap-plugins/)
