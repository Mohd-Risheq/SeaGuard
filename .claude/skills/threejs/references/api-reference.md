# Three.js API Reference

## Scene

```js
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)       // Solid color
scene.background = cubeTexture                      // Skybox
scene.fog = new THREE.Fog(0xffffff, 1, 100)         // Linear fog
scene.fog = new THREE.FogExp2(0xffffff, 0.01)       // Exponential fog
scene.add(object)                                    // Add object
scene.remove(object)                                 // Remove object
scene.traverse((child) => { /* visit all */ })       // Walk tree
```

## Cameras

### PerspectiveCamera
```js
// PerspectiveCamera(fov, aspect, near, far)
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
camera.position.set(0, 5, 10)
camera.lookAt(0, 0, 0)
camera.updateProjectionMatrix()  // Call after changing fov/aspect/near/far
```

### OrthographicCamera
```js
// OrthographicCamera(left, right, top, bottom, near, far)
const camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 100)
```

## Renderer

```js
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,                    // Transparent background
  powerPreference: 'high-performance',
})
renderer.setSize(width, height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.0
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Animation loop
renderer.setAnimationLoop((time) => {
  renderer.render(scene, camera)
})

// Dispose
renderer.dispose()
```

## Geometries

```js
new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
new THREE.SphereGeometry(radius, widthSegments, heightSegments)
new THREE.PlaneGeometry(width, height, widthSegments, heightSegments)
new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments)
new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments)
new THREE.ConeGeometry(radius, height, radialSegments)
new THREE.CircleGeometry(radius, segments)
new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments)
new THREE.TorusKnotGeometry(radius, tube, tubularSegments, radialSegments)
```

### Custom BufferGeometry
```js
const geometry = new THREE.BufferGeometry()
const vertices = new Float32Array([
  -1, -1, 0,
   1, -1, 0,
   0,  1, 0,
])
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
geometry.computeVertexNormals()
```

## Materials

### MeshStandardMaterial (PBR — recommended default)
```js
const material = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  metalness: 0.5,          // 0 = non-metallic, 1 = fully metallic
  roughness: 0.5,          // 0 = mirror, 1 = fully rough
  map: colorTexture,       // Albedo/color texture
  normalMap: normalTexture,
  roughnessMap: roughTexture,
  metalnessMap: metalTexture,
  aoMap: aoTexture,        // Ambient occlusion
  envMap: envTexture,      // Environment reflection
  transparent: true,
  opacity: 0.8,
  side: THREE.DoubleSide,
  wireframe: false,
})
```

### MeshPhysicalMaterial (Extended PBR)
```js
const material = new THREE.MeshPhysicalMaterial({
  ...standardProps,
  clearcoat: 1.0,          // Car paint, lacquer
  clearcoatRoughness: 0.1,
  transmission: 1.0,       // Glass, water
  ior: 1.5,                // Index of refraction
  thickness: 0.5,          // Volume for transmission
  sheen: 1.0,              // Fabric
  sheenColor: new THREE.Color(0xff0000),
})
```

### MeshBasicMaterial (Unlit)
```js
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: false,
  map: texture,
})
```

## Textures

```js
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('/textures/wood.jpg')
texture.colorSpace = THREE.SRGBColorSpace   // For color maps
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping
texture.repeat.set(2, 2)

// Environment map (cubemap)
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
const rgbeLoader = new RGBELoader()
const envMap = await rgbeLoader.loadAsync('/textures/env.hdr')
envMap.mapping = THREE.EquirectangularReflectionMapping
scene.environment = envMap
scene.background = envMap
```

## Lights

```js
// Ambient — uniform fill
new THREE.AmbientLight(color, intensity)

// Hemisphere — sky/ground gradient
new THREE.HemisphereLight(skyColor, groundColor, intensity)

// Directional — parallel rays (sun)
const dirLight = new THREE.DirectionalLight(color, intensity)
dirLight.position.set(5, 10, 5)
dirLight.castShadow = true
dirLight.shadow.mapSize.set(2048, 2048)
dirLight.shadow.camera.near = 0.5
dirLight.shadow.camera.far = 50

// Point — omni-directional (light bulb)
const pointLight = new THREE.PointLight(color, intensity, distance, decay)

// Spot — cone-shaped beam
const spotLight = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay)
spotLight.target = targetObject
```

## Object3D Transform

```js
// Position
object.position.set(x, y, z)
object.position.x = 5

// Rotation (Euler, radians)
object.rotation.set(x, y, z)
object.rotation.y = Math.PI / 4

// Scale
object.scale.set(2, 2, 2)

// Look at a point
object.lookAt(new THREE.Vector3(0, 0, 0))

// Visibility
object.visible = false

// Hierarchy
parent.add(child)
parent.remove(child)
```

## Loaders

```js
// GLTF/GLB (recommended 3D format)
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
const gltf = await new GLTFLoader().loadAsync('/model.glb')
scene.add(gltf.scene)
// Access animations: gltf.animations

// Draco compression
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
const draco = new DRACOLoader()
draco.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(draco)

// FBX
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'

// OBJ
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
```

## Animation

```js
// AnimationMixer for GLTF animations
const mixer = new THREE.AnimationMixer(gltf.scene)
const action = mixer.clipAction(gltf.animations[0])
action.play()

// In animation loop
renderer.setAnimationLoop((time) => {
  const delta = clock.getDelta()
  mixer.update(delta)
  renderer.render(scene, camera)
})

// Control actions
action.play()
action.stop()
action.paused = true
action.crossFadeTo(otherAction, duration)
```

## Controls

```js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.minDistance = 2
controls.maxDistance = 20
controls.maxPolarAngle = Math.PI / 2  // Prevent going below ground

// Update in animation loop
controls.update()
```

## Raycasting (Mouse Picking)

```js
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()

window.addEventListener('click', (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(pointer, camera)
  const intersects = raycaster.intersectObjects(scene.children, true)

  if (intersects.length > 0) {
    const hit = intersects[0]
    console.log('Hit:', hit.object.name, 'at', hit.point)
  }
})
```

## Disposal / Memory Cleanup

```js
// Always dispose when removing objects
geometry.dispose()
material.dispose()
texture.dispose()
renderer.dispose()

// Recursive cleanup helper
function disposeObject(obj) {
  obj.traverse((child) => {
    if (child.isMesh) {
      child.geometry.dispose()
      if (Array.isArray(child.material)) {
        child.material.forEach(m => m.dispose())
      } else {
        child.material.dispose()
      }
    }
  })
}
```

## Sources

- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Manual](https://threejs.org/manual/)
- [GLTFLoader Docs](https://threejs.org/docs/pages/GLTFLoader.html)
