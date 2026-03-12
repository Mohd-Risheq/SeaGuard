---
name: gsap
description: This skill should be used when the user asks to "animate elements with GSAP", "add scroll animations", "create a GSAP timeline", "set up ScrollTrigger", "use SplitText for text animation", or needs guidance on GSAP tweens, timelines, plugins, or scroll-driven animations. Provides knowledge about GSAP 3 and its plugin ecosystem.
version: 0.1.0
---

# GSAP Skill

## Quick Reference

### Install
```bash
npm install gsap
# For React
npm install gsap @gsap/react
```

### CDN
```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
```

### Basic Import & Plugin Registration
```js
import gsap from "gsap"
import { useGSAP } from "@gsap/react"       // React only
import ScrollTrigger from "gsap/ScrollTrigger"
import Flip from "gsap/Flip"
import SplitText from "gsap/SplitText"
import Draggable from "gsap/Draggable"
import MotionPathPlugin from "gsap/MotionPathPlugin"
import DrawSVGPlugin from "gsap/DrawSVGPlugin"
import MorphSVGPlugin from "gsap/MorphSVGPlugin"

gsap.registerPlugin(ScrollTrigger, Flip, SplitText, Draggable, MotionPathPlugin)
```

> GSAP is now 100% free (including all plugins) thanks to Webflow's acquisition.

---

## Core API

### Tweens — The Four Methods

```js
// Animate TO target values
gsap.to(".box", { x: 200, opacity: 0.5, duration: 1 })

// Animate FROM starting values (ends at current CSS)
gsap.from(".box", { x: -200, opacity: 0, duration: 1 })

// Animate FROM start TO end values
gsap.fromTo(".box",
  { x: -200, opacity: 0 },
  { x: 200, opacity: 1, duration: 1 }
)

// Set immediately (duration: 0)
gsap.set(".box", { x: 0, opacity: 1 })
```

### Targets
Pass CSS selectors, DOM elements, refs, or arrays:
```js
gsap.to(".my-class", { ... })        // Selector string
gsap.to(myElement, { ... })          // DOM element
gsap.to(myRef.current, { ... })     // React ref
gsap.to([el1, el2, el3], { ... })   // Array
```

### Common Tween Properties

| Property | Description |
|----------|-------------|
| `duration` | Seconds (default: 0.5) |
| `delay` | Seconds before start |
| `ease` | Easing function (e.g., `"power2.out"`, `"elastic.out"`, `"bounce.out"`) |
| `repeat` | Number of repeats (-1 = infinite) |
| `yoyo` | Reverse on each repeat |
| `stagger` | Delay between each target (number or object) |
| `onComplete` | Callback when done |
| `onUpdate` | Callback each frame |

### Transform Shortcuts

| GSAP | CSS Equivalent |
|------|----------------|
| `x: 100` | `translateX(100px)` |
| `y: 100` | `translateY(100px)` |
| `rotation: 360` | `rotate(360deg)` |
| `scale: 2` | `scale(2)` |
| `skewX: 20` | `skewX(20deg)` |
| `xPercent: -50` | `translateX(-50%)` |
| `yPercent: -50` | `translateY(-50%)` |

### Stagger
```js
gsap.to(".item", {
  y: -20,
  opacity: 1,
  stagger: 0.1,              // 0.1s between each
  // or advanced:
  stagger: { each: 0.1, from: "center", grid: "auto" }
})
```

---

## Timelines

Sequence multiple animations with precise control:

```js
const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.out" } })

tl.to(".heading", { opacity: 1, y: 0 })
  .to(".subheading", { opacity: 1, y: 0 }, "-=0.3")   // overlap by 0.3s
  .to(".cta", { opacity: 1, scale: 1 }, "+=0.2")       // 0.2s gap
  .to(".image", { opacity: 1 }, "<")                     // same start as previous
```

### Position Parameter
| Value | Meaning |
|-------|---------|
| `"+=0.5"` | 0.5s after end of timeline |
| `"-=0.3"` | 0.3s before end (overlap) |
| `"<"` | Start of previous animation |
| `"<0.2"` | 0.2s after start of previous |
| `2` | Absolute 2s mark |

### Timeline Controls
```js
tl.play()
tl.pause()
tl.reverse()
tl.restart()
tl.progress(0.5)     // Jump to 50%
tl.timeScale(2)      // 2x speed
tl.kill()            // Destroy
```

---

## ScrollTrigger

```js
gsap.to(".panel", {
  scrollTrigger: {
    trigger: ".panel",          // Element that triggers
    start: "top 80%",           // "trigger-pos viewport-pos"
    end: "bottom 20%",
    scrub: true,                // Link to scroll (true or number for smoothing)
    pin: true,                  // Pin element during scroll
    pinSpacing: true,           // Add spacing (default true)
    markers: true,              // Debug markers (dev only)
    toggleActions: "play pause resume reset",  // onEnter onLeave onEnterBack onLeaveBack
    onEnter: () => {},
    onLeave: () => {},
  },
  x: 500,
  opacity: 0,
})
```

### Horizontal Scroll Pattern
```js
const sections = gsap.utils.toArray(".panel")
gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: ".container",
    pin: true,
    scrub: 1,
    end: () => "+=" + document.querySelector(".container").offsetWidth,
  },
})
```

### Batch Animations
```js
ScrollTrigger.batch(".card", {
  onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.1 }),
  start: "top 90%",
})
```

---

## React / Next.js Integration

### useGSAP Hook (Recommended)
```tsx
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

gsap.registerPlugin(useGSAP)

function AnimatedComponent() {
  const container = useRef(null)

  useGSAP(() => {
    gsap.from(".box", { opacity: 0, y: 50, stagger: 0.2 })
  }, { scope: container })   // Scoped selectors — only targets .box inside container

  return (
    <div ref={container}>
      <div className="box">1</div>
      <div className="box">2</div>
    </div>
  )
}
```

### Cleanup with ScrollTrigger
```tsx
useGSAP(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".section",
      start: "top center",
      end: "bottom center",
      scrub: true,
    }
  })
  tl.to(".element", { x: 200 })
  // Cleanup is automatic with useGSAP
}, { scope: container })
```

### Centralize Plugin Registration (Next.js)
Register plugins once in a layout or provider — not in every component:
```tsx
// app/layout.tsx or a dedicated provider
"use client"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger)
```

---

## Key Plugins

| Plugin | Purpose |
|--------|---------|
| `ScrollTrigger` | Scroll-driven animations, pin, scrub |
| `SplitText` | Split text into chars/words/lines for animation |
| `Flip` | Smooth layout animations (FLIP technique) |
| `Draggable` | Drag, spin, fling elements |
| `MorphSVG` | Morph between SVG shapes |
| `DrawSVG` | Animate SVG strokes (hand-drawn effect) |
| `MotionPath` | Animate along SVG paths |
| `ScrollSmoother` | Smooth scrolling wrapper |
| `Observer` | Unified input events (scroll, touch, pointer) |
| `ScrambleText` | Scramble/decode text animation |
| `Text` | Animate text content changes |

---

## Performance Checklist

- Animate only `transform` and `opacity` — avoid `width`, `height`, `filter`, `boxShadow`
- Use `gsap.quickTo()` or `gsap.quickSetter()` for high-frequency events (mousemove)
- Use `will-change` sparingly and only on actively animating elements
- Kill tweens and ScrollTriggers on component unmount
- Call `ScrollTrigger.refresh()` after major DOM changes
- Use `stagger` instead of creating individual tweens for lists
- Set `markers: true` during dev to debug ScrollTrigger start/end positions

## Additional Resources

- `references/api-reference.md` — Detailed API for tweens, timelines, eases, and all plugin configs
- `references/patterns.md` — Common animation patterns, SplitText, Flip, SVG animations, and architecture
- `examples/example.md` — Full working examples for common GSAP scenarios

## Sources

- [GSAP Documentation](https://gsap.com/docs/v3/GSAP/)
- [GSAP Installation](https://gsap.com/docs/v3/Installation/)
- [ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [React & GSAP Patterns](https://gsap.com/resources/react-basics/)
- [GSAP GitHub](https://github.com/greensock/GSAP)
- [GSAP Core](https://gsap.com/core/)
- [GSAP Scroll](https://gsap.com/scroll/)
- [Codrops – GSAP Plugin Demos](https://tympanus.net/codrops/2025/05/14/from-splittext-to-morphsvg-5-creative-demos-using-free-gsap-plugins/)
