---
name: threejs
description: This skill should be used when the user asks to "create a 3D scene", "add Three.js to a project", "load a 3D model", "set up React Three Fiber", or needs guidance on 3D rendering, WebGL, lighting, materials, GLTF loading, or Three.js performance optimization. Provides knowledge about Three.js and React Three Fiber (R3F).
version: 0.1.0
---

# Three.js Skill

## Quick Reference

### Install
```bash
# Vanilla Three.js
npm install three

# React Three Fiber (React projects)
npm install three @react-three/fiber @react-three/drei
```

### Minimal Scene (Vanilla)
```js
import * as THREE from 'three'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild(renderer.domElement)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(5, 5, 5)
scene.add(light)
scene.add(new THREE.AmbientLight(0xffffff, 0.3))

function animate() {
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate)
```

### Minimal Scene (React Three Fiber)
```tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function Box() {
  return (
    <mesh rotation={[0.5, 0.5, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="green" />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} />
      <Box />
      <OrbitControls />
    </Canvas>
  )
}
```

---

## Core Concepts

### The Scene Graph
Every Three.js app has three essential pieces:

| Component | Class | Purpose |
|-----------|-------|---------|
| Scene | `THREE.Scene` | Container for all objects, lights, cameras |
| Camera | `THREE.PerspectiveCamera` | Defines viewpoint (FOV, aspect, near, far) |
| Renderer | `THREE.WebGLRenderer` | Draws the scene to a `<canvas>` element |

### Cameras
| Type | Use Case |
|------|----------|
| `PerspectiveCamera(fov, aspect, near, far)` | 3D scenes with depth (most common) |
| `OrthographicCamera(left, right, top, bottom, near, far)` | 2D/isometric views, UI overlays |

### Mesh = Geometry + Material
A `Mesh` combines a shape (geometry) with a surface appearance (material):

```js
const mesh = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),    // shape
  new THREE.MeshStandardMaterial({ color: 0xff0000 })  // surface
)
scene.add(mesh)
```

### Common Geometries
`BoxGeometry`, `SphereGeometry`, `PlaneGeometry`, `CylinderGeometry`, `TorusGeometry`, `ConeGeometry`, `RingGeometry`, `BufferGeometry` (custom).

### Common Materials
| Material | Description |
|----------|-------------|
| `MeshBasicMaterial` | Unlit, no shadows (cheapest) |
| `MeshStandardMaterial` | PBR, responds to light (recommended default) |
| `MeshPhysicalMaterial` | Extended PBR with clearcoat, transmission, sheen |
| `MeshPhongMaterial` | Shiny surfaces, specular highlights |
| `MeshLambertMaterial` | Matte surfaces, cheaper than Standard |
| `ShaderMaterial` / `RawShaderMaterial` | Custom GLSL shaders |

### Lighting
| Light | Cost | Shadows | Use Case |
|-------|------|---------|----------|
| `AmbientLight` | Cheap | No | Base fill, avoid pure black |
| `HemisphereLight` | Cheap | No | Sky/ground color gradient |
| `DirectionalLight` | Medium | Yes | Sun, uniform parallel rays |
| `PointLight` | Medium | Yes | Light bulbs, localized glow |
| `SpotLight` | Expensive | Yes | Flashlights, stage lights |

**Enable shadows:**
```js
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
light.castShadow = true
mesh.castShadow = true
floor.receiveShadow = true
```

### Loading 3D Models (GLTF/GLB)
GLTF is the recommended format — compact and fast to load:

```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const loader = new GLTFLoader()
loader.setDRACOLoader(dracoLoader)

const gltf = await loader.loadAsync('/models/robot.glb')
scene.add(gltf.scene)
```

**In React Three Fiber:**
```tsx
import { useGLTF } from '@react-three/drei'

function Model() {
  const { scene } = useGLTF('/models/robot.glb')
  return <primitive object={scene} />
}
```

### Animation Loop
```js
// Modern approach (replaces requestAnimationFrame)
renderer.setAnimationLoop((time) => {
  // Update objects
  cube.rotation.y = time * 0.001
  renderer.render(scene, camera)
})

// Stop the loop
renderer.setAnimationLoop(null)
```

### Responsive Canvas
```js
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
```

---

## React Three Fiber (R3F) Essentials

R3F is a React renderer for Three.js — every Three.js class maps to a JSX element:

| Three.js | R3F JSX |
|----------|---------|
| `new THREE.Mesh()` | `<mesh>` |
| `new THREE.BoxGeometry(1,1,1)` | `<boxGeometry args={[1,1,1]} />` |
| `new THREE.MeshStandardMaterial()` | `<meshStandardMaterial />` |
| `new THREE.DirectionalLight()` | `<directionalLight />` |

### Key R3F Hooks
| Hook | Purpose |
|------|---------|
| `useFrame((state, delta) => {})` | Run code every frame (animation loop) |
| `useThree()` | Access `scene`, `camera`, `gl` (renderer), `size` |
| `useLoader(GLTFLoader, url)` | Load assets with Suspense support |

### Key @react-three/drei Helpers
`OrbitControls`, `TransformControls`, `Environment`, `useGLTF`, `useTexture`, `Text`, `Html`, `Float`, `Stars`, `Sky`, `ContactShadows`, `PresentationControls`.

---

## Performance Checklist

- Keep draw calls under 100 per frame — use `InstancedMesh` for repeated objects
- Use `BufferGeometry` (not legacy `Geometry`)
- Limit shadow-casting lights and objects
- Use texture sizes as powers of 2 (256, 512, 1024)
- Dispose geometries, materials, and textures when removed: `geometry.dispose()`, `material.dispose()`, `texture.dispose()`
- Use Draco compression for GLTF models
- Set `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`
- Use `renderer.setAnimationLoop` instead of `requestAnimationFrame`
- Use `stats.js` or Spector.js to measure, not guess

## Additional Resources

- `references/api-reference.md` — Detailed API for geometries, materials, lights, loaders, and controls
- `references/patterns.md` — Architecture patterns, animation, post-processing, WebXR, and common pitfalls
- `examples/example.md` — Full working examples for common Three.js and R3F scenarios

## Sources

- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Manual](https://threejs.org/manual/)
- [Three.js GitHub](https://github.com/mrdoob/three.js/)
- [Discover three.js](https://discoverthreejs.com/tips-and-tricks/)
- [React Three Fiber Docs](https://r3f.docs.pmnd.rs/getting-started/introduction)
- [React Three Fiber GitHub](https://github.com/pmndrs/react-three-fiber)
- [Three.js Loading 3D Models](https://threejs.org/manual/en/loading-3d-models.html)
- [GLTFLoader Docs](https://threejs.org/docs/pages/GLTFLoader.html)
- [Codrops – Building Efficient Three.js Scenes](https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes-optimize-performance-while-maintaining-quality/)
- [Discover three.js – Tips and Tricks](https://discoverthreejs.com/tips-and-tricks/)
