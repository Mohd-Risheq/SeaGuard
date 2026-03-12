import * as THREE from 'three';

// Vertex Shader
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Layered sine wave displacement
    float wave1 = sin(pos.x * 0.8 + uTime * 0.6) * 0.3;
    float wave2 = sin(pos.y * 0.6 + uTime * 0.4) * 0.2;
    float wave3 = sin((pos.x + pos.y) * 0.5 + uTime * 0.8) * 0.15;
    float wave4 = sin(pos.x * 1.5 - uTime * 0.3) * cos(pos.y * 1.2 + uTime * 0.5) * 0.1;

    float elevation = wave1 + wave2 + wave3 + wave4;
    pos.z += elevation;

    vElevation = elevation;
    vPosition = pos;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Fragment Shader
const fragmentShader = `
  uniform float uTime;
  uniform vec3 uDeepColor;
  uniform vec3 uShallowColor;
  uniform vec3 uFresnelColor;
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vPosition;

  void main() {
    // Base color mix based on elevation
    float mixFactor = (vElevation + 0.5) * 0.7;
    vec3 color = mix(uDeepColor, uShallowColor, clamp(mixFactor, 0.0, 1.0));

    // Caustic pattern
    float caustic1 = sin(vUv.x * 20.0 + uTime * 0.5) * sin(vUv.y * 20.0 + uTime * 0.3);
    float caustic2 = sin(vUv.x * 15.0 - uTime * 0.4) * sin(vUv.y * 12.0 - uTime * 0.6);
    float caustics = (caustic1 + caustic2) * 0.05;
    color += vec3(caustics) * uFresnelColor;

    // Edge glow / Fresnel approximation
    float fresnel = pow(1.0 - abs(vElevation * 0.8), 3.0) * 0.15;
    color += uFresnelColor * fresnel;

    // Shimmer
    float shimmer = sin(vPosition.x * 8.0 + uTime * 2.0) * sin(vPosition.y * 6.0 + uTime * 1.5) * 0.03;
    color += vec3(shimmer);

    // Depth fade at edges
    float edgeFade = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x)
                   * smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
    color *= edgeFade * 0.5 + 0.5;

    gl_FragColor = vec4(color, 0.85);
  }
`;

export function initOcean(canvas) {
  if (!canvas) return { cleanup: () => {} };

  // Check WebGL support
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
  } catch (e) {
    console.warn('WebGL not supported, skipping ocean animation');
    canvas.style.background = 'linear-gradient(135deg, #0a1628, #134b6e, #1a8a8a)';
    return { cleanup: () => {} };
  }

  const isMobile = window.innerWidth < 768;
  const pixelRatio = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  // Scene
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a1628, 0.04);

  // Camera
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 4, 10);
  camera.lookAt(0, 0, 0);

  // Ocean surface
  const segments = isMobile ? 128 : 200;
  const geometry = new THREE.PlaneGeometry(24, 24, segments, segments);
  geometry.rotateX(-Math.PI / 2);

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uDeepColor: { value: new THREE.Color(0x0a1628) },
      uShallowColor: { value: new THREE.Color(0x1a8a8a) },
      uFresnelColor: { value: new THREE.Color(0x2dd4bf) },
    },
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const ocean = new THREE.Mesh(geometry, material);
  ocean.position.y = -1;
  scene.add(ocean);

  // Particles (bubbles)
  const particleCount = isMobile ? 200 : 500;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = Math.random() * 12 - 4;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    sizes[i] = Math.random() * 3 + 1;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.04,
    color: 0x2dd4bf,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // God rays
  const rays = [];
  const rayCount = 4;
  for (let i = 0; i < rayCount; i++) {
    const rayGeo = new THREE.PlaneGeometry(0.4, 12);
    const rayMat = new THREE.MeshBasicMaterial({
      color: 0x2dd4bf,
      transparent: true,
      opacity: 0.03,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ray = new THREE.Mesh(rayGeo, rayMat);
    ray.position.set(
      (Math.random() - 0.5) * 10,
      2,
      (Math.random() - 0.5) * 6 - 4
    );
    ray.rotation.z = (Math.random() - 0.5) * 0.5;
    ray.userData.rotationSpeed = (Math.random() - 0.5) * 0.002;
    ray.userData.baseOpacity = 0.02 + Math.random() * 0.02;
    scene.add(ray);
    rays.push(ray);
  }

  // Ambient light
  const ambientLight = new THREE.AmbientLight(0x1a8a8a, 0.3);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0x2dd4bf, 0.5);
  directionalLight.position.set(0, 10, 5);
  scene.add(directionalLight);

  // Animation
  let animationId;
  let isVisible = true;
  const clock = new THREE.Clock();

  function animate() {
    animationId = requestAnimationFrame(animate);

    if (!isVisible) return;

    const elapsed = clock.getElapsedTime();
    material.uniforms.uTime.value = elapsed;

    // Animate particles upward
    const posArray = particleGeometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3 + 1] += 0.005 + sizes[i] * 0.002;
      if (posArray[i * 3 + 1] > 8) {
        posArray[i * 3 + 1] = -4;
        posArray[i * 3] = (Math.random() - 0.5) * 20;
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 20;
      }
    }
    particleGeometry.attributes.position.needsUpdate = true;

    // Animate god rays
    for (const ray of rays) {
      ray.rotation.z += ray.userData.rotationSpeed;
      ray.material.opacity = ray.userData.baseOpacity * (0.7 + Math.sin(elapsed * 0.5 + rays.indexOf(ray)) * 0.3);
    }

    // Subtle camera movement
    camera.position.x = Math.sin(elapsed * 0.1) * 0.5;
    camera.position.y = 4 + Math.sin(elapsed * 0.15) * 0.3;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);

  // Visibility observer — pause when hero is not visible
  const observer = new IntersectionObserver(
    (entries) => {
      isVisible = entries[0].isIntersecting;
    },
    { threshold: 0.1 }
  );
  const heroSection = canvas.closest('.hero');
  if (heroSection) observer.observe(heroSection);

  // Mouse tracking
  function onMouseMove(e) {
    material.uniforms.uMouse.value.set(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    );
  }
  window.addEventListener('mousemove', onMouseMove);

  // Cleanup
  return {
    cleanup() {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      observer.disconnect();
      geometry.dispose();
      material.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      rays.forEach(r => { r.geometry.dispose(); r.material.dispose(); });
      renderer.dispose();
    }
  };
}
