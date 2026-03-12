# GSAP API Reference

## Tween Configuration (vars)

### All Properties

```js
gsap.to(target, {
  // Animation values
  x: 100,                    // translateX (px)
  y: 100,                    // translateY (px)
  xPercent: -50,             // translateX (%)
  yPercent: -50,             // translateY (%)
  rotation: 360,             // rotate (degrees)
  rotationX: 45,             // rotateX (3D)
  rotationY: 45,             // rotateY (3D)
  scale: 2,                  // scale
  scaleX: 1.5,
  scaleY: 1.5,
  skewX: 20,                 // skewX (degrees)
  skewY: 20,
  opacity: 0.5,
  autoAlpha: 0,              // opacity + visibility:hidden at 0
  width: "50%",
  height: 200,
  color: "#ff0000",
  backgroundColor: "blue",
  borderRadius: "50%",
  transformOrigin: "center center",

  // Timing
  duration: 1,               // seconds
  delay: 0.5,
  ease: "power2.out",
  repeat: 3,                 // -1 = infinite
  repeatDelay: 0.5,
  yoyo: true,                // reverse on repeat

  // Multiple targets
  stagger: 0.1,              // or { each: 0.1, from: "center" }

  // Callbacks
  onStart: () => {},
  onUpdate: () => {},
  onComplete: () => {},
  onRepeat: () => {},
  onReverseComplete: () => {},

  // ScrollTrigger (inline)
  scrollTrigger: { ... },

  // Overwrite behavior
  overwrite: "auto",         // "auto" | true | false

  // Immediately apply starting values
  immediateRender: false,    // default true for .from()
})
```

## Eases

### Built-in Eases
```
"none"                       // Linear
"power1.in"  / "power1.out"  / "power1.inOut"    // Subtle
"power2.in"  / "power2.out"  / "power2.inOut"    // Moderate (default)
"power3.in"  / "power3.out"  / "power3.inOut"    // Strong
"power4.in"  / "power4.out"  / "power4.inOut"    // Extra strong
"back.in"    / "back.out"    / "back.inOut"      // Overshoot
"elastic.in" / "elastic.out" / "elastic.inOut"   // Springy
"bounce.in"  / "bounce.out"  / "bounce.inOut"    // Bounce
"circ.in"    / "circ.out"    / "circ.inOut"      // Circular
"expo.in"    / "expo.out"    / "expo.inOut"      // Exponential
"sine.in"    / "sine.out"    / "sine.inOut"      // Gentle sine
"steps(12)"                                       // Stepped
```

### Custom Ease with Back
```js
ease: "back.out(1.7)"    // 1.7 = overshoot amount
ease: "elastic.out(1, 0.3)"  // amplitude, period
```

## Timeline API

### Creation
```js
const tl = gsap.timeline({
  defaults: { duration: 0.5, ease: "power2.out" },
  repeat: -1,
  yoyo: true,
  paused: true,          // Don't auto-play
  onComplete: () => {},
  scrollTrigger: { ... },
})
```

### Adding Animations
```js
tl.to(target, vars, position)
tl.from(target, vars, position)
tl.fromTo(target, fromVars, toVars, position)
tl.set(target, vars, position)
tl.add(tween, position)           // Add existing tween
tl.add(otherTimeline, position)   // Nest a timeline
tl.addLabel("sectionTwo", 2)      // Named position
tl.to(".el", { x: 100 }, "sectionTwo")  // Use label as position
tl.call(myFunction, [args], position)    // Call function at position
tl.addPause(position)             // Pause at position
```

### Controls
```js
tl.play()
tl.pause()
tl.resume()
tl.reverse()
tl.restart()
tl.seek(2)              // Jump to 2 seconds
tl.seek("labelName")    // Jump to label
tl.progress(0.5)        // 0–1
tl.time(1.5)            // Seconds
tl.timeScale(2)         // Playback speed
tl.kill()               // Destroy
tl.isActive()           // Boolean
tl.totalDuration()      // Total duration including repeats
```

## ScrollTrigger Configuration

```js
ScrollTrigger.create({
  trigger: ".element",          // Required: element or selector
  start: "top 80%",            // "triggerPos viewportPos" or function
  end: "bottom 20%",           // Same syntax as start
  scrub: true,                 // true | number (smoothing seconds)
  pin: true,                   // Pin trigger element
  pinSpacing: true,            // Add spacer for pinned element
  markers: true,               // Show debug markers

  // Toggle actions: onEnter onLeave onEnterBack onLeaveBack
  toggleActions: "play none none none",
  // Options: play, pause, resume, reset, restart, complete, reverse, none

  toggleClass: "active",       // Toggle CSS class
  snap: 0.25,                  // Snap to 25% increments
  // or snap: { snapTo: [0, 0.25, 0.5, 1], duration: 0.3, ease: "power2" }

  anticipatePin: 1,            // Reduce pin jankiness
  fastScrollEnd: true,         // Settle more quickly

  // Callbacks
  onEnter: (self) => {},
  onLeave: (self) => {},
  onEnterBack: (self) => {},
  onLeaveBack: (self) => {},
  onUpdate: (self) => {},       // self.progress, self.direction, self.isActive
  onToggle: (self) => {},
  onRefresh: (self) => {},
})
```

### ScrollTrigger Static Methods
```js
ScrollTrigger.refresh()                    // Recalculate positions
ScrollTrigger.update()                     // Force update
ScrollTrigger.getAll()                     // Get all instances
ScrollTrigger.getById("myId")              // Get by id
ScrollTrigger.kill()                       // Kill all
ScrollTrigger.matchMedia({                 // Responsive breakpoints
  "(min-width: 768px)": () => { /* desktop */ },
  "(max-width: 767px)": () => { /* mobile */ },
})
ScrollTrigger.batch(".card", {             // Batch enter
  onEnter: (batch) => gsap.to(batch, { opacity: 1, stagger: 0.1 }),
})
```

## SplitText

```js
import SplitText from "gsap/SplitText"
gsap.registerPlugin(SplitText)

const split = new SplitText(".heading", {
  type: "chars, words, lines",    // What to split
  charsClass: "char",
  wordsClass: "word",
  linesClass: "line",
  autoSplit: true,                // Re-split on resize
  mask: "lines",                  // Clip overflow per line
  onSplit: (self) => {
    // Create animations here for autoSplit compatibility
    gsap.from(self.chars, { opacity: 0, y: 20, stagger: 0.02 })
  },
})

// Access split elements
split.chars    // Array of char elements
split.words    // Array of word elements
split.lines    // Array of line elements
split.revert() // Restore original HTML
```

## Flip Plugin

```js
import Flip from "gsap/Flip"
gsap.registerPlugin(Flip)

// 1. Record current state
const state = Flip.getState(".items")

// 2. Make DOM changes (reorder, reparent, toggle classes)
container.classList.toggle("reordered")

// 3. Animate from old state to new
Flip.from(state, {
  duration: 0.6,
  ease: "power2.inOut",
  stagger: 0.05,
  absolute: true,         // Use position:absolute during animation
  onEnter: (elements) => gsap.fromTo(elements, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1 }),
  onLeave: (elements) => gsap.to(elements, { opacity: 0, scale: 0 }),
})
```

## Draggable

```js
import Draggable from "gsap/Draggable"
gsap.registerPlugin(Draggable)

Draggable.create(".draggable", {
  type: "x,y",             // "x" | "y" | "x,y" | "rotation"
  bounds: ".container",    // Constrain to element
  inertia: true,           // Fling with momentum (requires InertiaPlugin)
  snap: { x: 50, y: 50 }, // Snap to grid
  onDrag: function () {
    console.log(this.x, this.y)
  },
  onDragEnd: function () {},
})
```

## SVG Plugins

### DrawSVG
```js
import DrawSVGPlugin from "gsap/DrawSVGPlugin"
gsap.registerPlugin(DrawSVGPlugin)

// Animate stroke from hidden to fully drawn
gsap.fromTo("path", { drawSVG: "0%" }, { drawSVG: "100%", duration: 2 })

// Partial reveal
gsap.to("path", { drawSVG: "20% 80%", duration: 1 })
```

### MorphSVG
```js
import MorphSVGPlugin from "gsap/MorphSVGPlugin"
gsap.registerPlugin(MorphSVGPlugin)

gsap.to("#circle", { morphSVG: "#star", duration: 1 })
gsap.to("#shape", { morphSVG: { shape: "#target", shapeIndex: 2 }, duration: 1 })
```

### MotionPath
```js
import MotionPathPlugin from "gsap/MotionPathPlugin"
gsap.registerPlugin(MotionPathPlugin)

gsap.to(".rocket", {
  motionPath: {
    path: "#flightPath",     // SVG path element
    align: "#flightPath",
    autoRotate: true,
    alignOrigin: [0.5, 0.5],
  },
  duration: 3,
})
```

## Utility Methods

```js
gsap.utils.toArray(".items")             // NodeList → Array
gsap.utils.clamp(0, 100, value)          // Clamp value to range
gsap.utils.mapRange(0, 100, 0, 1, 50)   // Map 50 from [0,100] to [0,1] → 0.5
gsap.utils.wrap([0, 1, 2], index)        // Wrap around array
gsap.utils.random(1, 10)                 // Random number
gsap.utils.interpolate(0, 100, 0.5)     // → 50
gsap.utils.shuffle(array)               // Shuffle array
gsap.utils.distribute({ base: 0, amount: 100, ease: "power2" })
```

## Sources

- [GSAP Documentation](https://gsap.com/docs/v3/GSAP/)
- [ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP Eases Visualizer](https://gsap.com/docs/v3/Eases/)
- [SplitText Docs](https://gsap.com/docs/v3/Plugins/SplitText/)
- [Flip Docs](https://gsap.com/docs/v3/Plugins/Flip/)
