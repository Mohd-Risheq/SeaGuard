# Three.js Patterns & Best Practices

## Architecture Patterns

### Scene Manager Pattern (Vanilla)
Organize larger apps with a manager class:

```js
class SceneManager {
  constructor(canvas) {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    this.clock = new THREE.Clock()
    this.objects = []
  }

  add(object) {
    this.objects.push(object)
    this.scene.add(object.mesh || object)
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      const delta = this.clock.getDelta()
      this.objects.forEach(obj => obj.update?.(delta))
      this.renderer.render(this.scene, this.camera)
    })
  }

  dispose() {
    this.renderer.setAnimationLoop(null)
    this.renderer.dispose()
  }
}
```

### React Three Fiber Component Pattern
Compose scenes with reusable components:

```tsx
function Scene() {
  return (
    <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
      <Environment preset="sunset" />
      <Lighting />
      <Ground />
      <Models />
      <OrbitControls />
    </Canvas>
  )
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow
        shadow-mapSize={[2048, 2048]} />
    </>
  )
}
```

---

## Animation Patterns

### useFrame for R3F Animation
```tsx
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

function SpinningBox() {
  const meshRef = useRef()

  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta
    // Access clock: state.clock.elapsedTime
    // Access mouse: state.pointer
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}
```

### GLTF Animation Playback (Vanilla)
```js
const clock = new THREE.Clock()
const mixer = new THREE.AnimationMixer(model)
const idleAction = mixer.clipAction(animations.find(a => a.name === 'Idle'))
const walkAction = mixer.clipAction(animations.find(a => a.name === 'Walk'))

idleAction.play()

// Transition between animations
function switchToWalk() {
  idleAction.crossFadeTo(walkAction, 0.5, true)
  walkAction.play()
}

// In loop
renderer.setAnimationLoop(() => {
  mixer.update(clock.getDelta())
  renderer.render(scene, camera)
})
```

### GLTF Animation in R3F
```tsx
import { useAnimations, useGLTF } from '@react-three/drei'

function AnimatedModel({ url }) {
  const { scene, animations } = useGLTF(url)
  const { actions } = useAnimations(animations, scene)

  useEffect(() => {
    actions['Idle']?.play()
    return () => actions['Idle']?.stop()
  }, [actions])

  return <primitive object={scene} />
}
```

---

## Performance Patterns

### InstancedMesh (Thousands of Identical Objects)
```js
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 })
const instancedMesh = new THREE.InstancedMesh(geometry, material, 1000)

const dummy = new THREE.Object3D()
for (let i = 0; i < 1000; i++) {
  dummy.position.set(Math.random() * 50 - 25, 0, Math.random() * 50 - 25)
  dummy.updateMatrix()
  instancedMesh.setMatrixAt(i, dummy.matrix)
}
scene.add(instancedMesh)
```

### R3F Instancing with drei
```tsx
import { Instances, Instance } from '@react-three/drei'

function Trees({ count = 1000 }) {
  return (
    <Instances limit={count}>
      <boxGeometry />
      <meshStandardMaterial color="green" />
      {Array.from({ length: count }, (_, i) => (
        <Instance
          key={i}
          position={[Math.random() * 50 - 25, 0, Math.random() * 50 - 25]}
        />
      ))}
    </Instances>
  )
}
```

### Level of Detail (LOD)
```js
const lod = new THREE.LOD()
lod.addLevel(highDetailMesh, 0)    // < 10 units away
lod.addLevel(mediumDetailMesh, 10) // 10-50 units
lod.addLevel(lowDetailMesh, 50)    // > 50 units
scene.add(lod)
```

### Texture Optimization
- Use power-of-2 dimensions (256, 512, 1024, 2048)
- Use KTX2 compressed textures for GPU-compressed formats
- Resize textures to the minimum needed resolution
- Reuse materials and textures across meshes

---

## Post-Processing

### Vanilla (EffectComposer)
```js
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'

const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))
composer.addPass(new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,  // strength
  0.4,  // radius
  0.85  // threshold
))

// Replace renderer.render() with:
renderer.setAnimationLoop(() => {
  composer.render()
})
```

### R3F Post-Processing
```tsx
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

function Scene() {
  return (
    <Canvas>
      {/* scene content */}
      <EffectComposer>
        <Bloom intensity={1.5} luminanceThreshold={0.8} />
        <Vignette darkness={0.5} />
      </EffectComposer>
    </Canvas>
  )
}
```

---

## WebXR (VR/AR)

### Basic VR Setup
```js
import { VRButton } from 'three/addons/webxr/VRButton.js'

renderer.xr.enabled = true
document.body.appendChild(VRButton.createButton(renderer))
```

### R3F XR
```tsx
import { XR, Controllers, Hands } from '@react-three/xr'

function App() {
  return (
    <Canvas>
      <XR>
        <Controllers />
        <Hands />
        {/* scene content */}
      </XR>
    </Canvas>
  )
}
```

---

## Common Pitfalls

1. **Black model after loading** — Missing lights in the scene. Always add at least an `AmbientLight` and one directional light.
2. **Model not visible** — Scale mismatch. Try `model.scale.set(0.01, 0.01, 0.01)` or `model.scale.set(100, 100, 100)`.
3. **Memory leaks** — Not calling `.dispose()` on geometries, materials, and textures when removing objects.
4. **Blurry textures** — Not setting `texture.colorSpace = THREE.SRGBColorSpace` for color/albedo maps.
5. **Z-fighting** — Two surfaces at the same position cause flickering. Offset by `0.001`.
6. **Performance drops** — Too many draw calls. Use `InstancedMesh` for repeated objects, merge static geometries, reduce shadow-casting objects.
7. **Wrong colors** — Not setting `renderer.outputColorSpace = THREE.SRGBColorSpace` and `renderer.toneMapping`.
8. **Pixelated on HiDPI** — Not calling `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`.

## Sources

- [Three.js Manual](https://threejs.org/manual/)
- [Discover three.js – Tips and Tricks](https://discoverthreejs.com/tips-and-tricks/)
- [React Three Fiber Docs](https://r3f.docs.pmnd.rs/getting-started/introduction)
- [Three.js Journey – Performance Tips](https://threejs-journey.com/lessons/performance-tips)
- [Codrops – Efficient Three.js Scenes](https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes-optimize-performance-while-maintaining-quality/)
