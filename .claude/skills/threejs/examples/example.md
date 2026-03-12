# Three.js Working Examples

## Example 1: Interactive 3D Product Viewer (Vanilla)

```html
<!DOCTYPE html>
<html>
<head>
  <style>body { margin: 0; overflow: hidden; }</style>
</head>
<body>
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.170/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.170/examples/jsm/"
  }
}
</script>
<script type="module">
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'

// Setup
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100)
camera.position.set(0, 1, 4)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2
document.body.appendChild(renderer.domElement)

// Environment lighting
const rgbeLoader = new RGBELoader()
const envMap = await rgbeLoader.loadAsync('/textures/studio.hdr')
envMap.mapping = THREE.EquirectangularReflectionMapping
scene.environment = envMap
scene.background = new THREE.Color(0xf0f0f0)

// Load product model
const loader = new GLTFLoader()
const gltf = await loader.loadAsync('/models/product.glb')
const model = gltf.scene
model.position.y = -0.5
scene.add(model)

// Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.minDistance = 2
controls.maxDistance = 8
controls.maxPolarAngle = Math.PI / 2

// Ground shadow
const planeGeometry = new THREE.PlaneGeometry(10, 10)
const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.3 })
const ground = new THREE.Mesh(planeGeometry, planeMaterial)
ground.rotation.x = -Math.PI / 2
ground.position.y = -0.5
ground.receiveShadow = true
scene.add(ground)

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
})

// Animate
renderer.setAnimationLoop(() => {
  controls.update()
  renderer.render(scene, camera)
})
</script>
</body>
</html>
```

---

## Example 2: React Three Fiber Scene with Model, Physics & UI

```tsx
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, Html, ContactShadows } from '@react-three/drei'

function Model({ url, ...props }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} {...props} />
}

function InfoPoint({ position, label }) {
  return (
    <Html position={position} distanceFactor={8}>
      <div style={{
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: 8,
        fontSize: 14,
        whiteSpace: 'nowrap',
      }}>
        {label}
      </div>
    </Html>
  )
}

export default function ProductViewer() {
  return (
    <Canvas shadows camera={{ position: [3, 2, 5], fov: 50 }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <Environment preset="city" />

      <Suspense fallback={null}>
        <Model url="/models/shoe.glb" scale={2} position={[0, 0.5, 0]} />
        <InfoPoint position={[0.5, 1.5, 0]} label="Premium leather upper" />
        <InfoPoint position={[-0.3, 0.3, 0.5]} label="Cushioned sole" />
      </Suspense>

      <ContactShadows position={[0, 0, 0]} opacity={0.5} blur={2} />
      <OrbitControls enablePan={false} minDistance={3} maxDistance={10} />
    </Canvas>
  )
}
```

---

## Example 3: Particle System

```js
import * as THREE from 'three'

// Create particles
const count = 5000
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 20
  colors[i] = Math.random()
}

const geometry = new THREE.BufferGeometry()
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const material = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  vertexColors: true,
  transparent: true,
  alphaMap: new THREE.TextureLoader().load('/textures/particle.png'),
  depthWrite: false,
  blending: THREE.AdditiveBlending,
})

const particles = new THREE.Points(geometry, material)
scene.add(particles)

// Animate particles
renderer.setAnimationLoop((time) => {
  const positions = particles.geometry.attributes.position.array
  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    positions[i3 + 1] += Math.sin(time * 0.001 + positions[i3]) * 0.002
  }
  particles.geometry.attributes.position.needsUpdate = true
  renderer.render(scene, camera)
})
```

---

## Example 4: Custom Shader Material

```js
const shaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(0x00aaff) },
  },
  vertexShader: `
    uniform float uTime;
    varying vec2 vUv;
    varying float vElevation;

    void main() {
      vUv = uv;
      vec3 pos = position;
      float elevation = sin(pos.x * 3.0 + uTime) * 0.2
                       + sin(pos.z * 3.0 + uTime * 0.5) * 0.2;
      pos.y += elevation;
      vElevation = elevation;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    varying vec2 vUv;
    varying float vElevation;

    void main() {
      float brightness = vElevation * 2.0 + 0.5;
      gl_FragColor = vec4(uColor * brightness, 1.0);
    }
  `,
  side: THREE.DoubleSide,
})

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5, 64, 64),
  shaderMaterial
)
plane.rotation.x = -Math.PI / 2
scene.add(plane)

const clock = new THREE.Clock()
renderer.setAnimationLoop(() => {
  shaderMaterial.uniforms.uTime.value = clock.getElapsedTime()
  renderer.render(scene, camera)
})
```

## Sources

- [Three.js Examples](https://threejs.org/examples/)
- [Three.js Manual](https://threejs.org/manual/)
- [React Three Fiber Docs](https://r3f.docs.pmnd.rs/)
- [Discover three.js](https://discoverthreejs.com/)
