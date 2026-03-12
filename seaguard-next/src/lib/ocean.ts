import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shaders';

export function initOcean(canvas: HTMLCanvasElement) {
  if (!canvas) return { cleanup: () => {} };

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    canvas.style.background = 'linear-gradient(135deg, #0a1628, #134b6e, #1a8a8a)';
    return { cleanup: () => {} };
  }

  const isMobile = window.innerWidth < 768;
  const pixelRatio = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a1628, 0.035);

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 4, 10);
  camera.lookAt(0, 0, 0);

  // Ocean plane with higher detail
  const segments = isMobile ? 150 : 256;
  const geometry = new THREE.PlaneGeometry(28, 28, segments, segments);
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

  // Enhanced particles — floating light motes
  const particleCount = isMobile ? 300 : 800;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const alphas = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 24;
    positions[i * 3 + 1] = Math.random() * 14 - 5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 24;
    sizes[i] = Math.random() * 3 + 1;
    alphas[i] = Math.random() * 0.6 + 0.1;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x2dd4bf,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // Bubble particles — larger, more visible
  const bubbleCount = isMobile ? 30 : 80;
  const bubbleGeometry = new THREE.BufferGeometry();
  const bubblePositions = new Float32Array(bubbleCount * 3);
  const bubbleSizes = new Float32Array(bubbleCount);

  for (let i = 0; i < bubbleCount; i++) {
    bubblePositions[i * 3] = (Math.random() - 0.5) * 20;
    bubblePositions[i * 3 + 1] = Math.random() * 10 - 5;
    bubblePositions[i * 3 + 2] = (Math.random() - 0.5) * 16;
    bubbleSizes[i] = Math.random() * 4 + 2;
  }

  bubbleGeometry.setAttribute('position', new THREE.BufferAttribute(bubblePositions, 3));

  const bubbleMaterial = new THREE.PointsMaterial({
    size: 0.12,
    color: 0x60e8d6,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const bubbles = new THREE.Points(bubbleGeometry, bubbleMaterial);
  scene.add(bubbles);

  // Enhanced god rays
  const rays: THREE.Mesh[] = [];
  const rayCount = isMobile ? 4 : 7;
  for (let i = 0; i < rayCount; i++) {
    const rayGeo = new THREE.PlaneGeometry(0.5 + Math.random() * 0.5, 14);
    const rayMat = new THREE.MeshBasicMaterial({
      color: 0x2dd4bf,
      transparent: true,
      opacity: 0.025,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ray = new THREE.Mesh(rayGeo, rayMat);
    ray.position.set((Math.random() - 0.5) * 14, 3, (Math.random() - 0.5) * 8 - 4);
    ray.rotation.z = (Math.random() - 0.5) * 0.6;
    ray.userData.rotationSpeed = (Math.random() - 0.5) * 0.002;
    ray.userData.baseOpacity = 0.015 + Math.random() * 0.025;
    ray.userData.pulseOffset = Math.random() * Math.PI * 2;
    scene.add(ray);
    rays.push(ray);
  }

  // Lighting
  scene.add(new THREE.AmbientLight(0x1a8a8a, 0.4));
  const directionalLight = new THREE.DirectionalLight(0x2dd4bf, 0.6);
  directionalLight.position.set(0, 10, 5);
  scene.add(directionalLight);

  // Subtle point light that follows mouse
  const mouseLight = new THREE.PointLight(0x2dd4bf, 0.3, 15);
  mouseLight.position.set(0, 3, 5);
  scene.add(mouseLight);

  let animationId: number;
  let isVisible = true;
  const clock = new THREE.Clock();
  const mouseTarget = new THREE.Vector2(0, 0);
  const mouseSmooth = new THREE.Vector2(0, 0);

  function animate() {
    animationId = requestAnimationFrame(animate);
    if (!isVisible) return;

    const elapsed = clock.getElapsedTime();
    material.uniforms.uTime.value = elapsed;

    // Smooth mouse
    mouseSmooth.x += (mouseTarget.x - mouseSmooth.x) * 0.05;
    mouseSmooth.y += (mouseTarget.y - mouseSmooth.y) * 0.05;
    material.uniforms.uMouse.value.copy(mouseSmooth);

    // Update mouse light position
    mouseLight.position.x = mouseSmooth.x * 6;
    mouseLight.position.z = 5 - mouseSmooth.y * 3;

    // Animate small particles
    const posArray = particleGeometry.attributes.position.array as Float32Array;
    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3 + 1] += 0.004 + sizes[i] * 0.002;
      posArray[i * 3] += Math.sin(elapsed * 0.3 + i) * 0.002;
      if (posArray[i * 3 + 1] > 9) {
        posArray[i * 3 + 1] = -5;
        posArray[i * 3] = (Math.random() - 0.5) * 24;
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 24;
      }
    }
    particleGeometry.attributes.position.needsUpdate = true;

    // Animate bubbles — slower, wobbling rise
    const bPosArray = bubbleGeometry.attributes.position.array as Float32Array;
    for (let i = 0; i < bubbleCount; i++) {
      bPosArray[i * 3 + 1] += 0.008 + bubbleSizes[i] * 0.001;
      bPosArray[i * 3] += Math.sin(elapsed * 0.5 + i * 0.7) * 0.006;
      bPosArray[i * 3 + 2] += Math.cos(elapsed * 0.4 + i * 1.1) * 0.004;
      if (bPosArray[i * 3 + 1] > 8) {
        bPosArray[i * 3 + 1] = -5;
        bPosArray[i * 3] = (Math.random() - 0.5) * 20;
        bPosArray[i * 3 + 2] = (Math.random() - 0.5) * 16;
      }
    }
    bubbleGeometry.attributes.position.needsUpdate = true;

    // Animate god rays
    for (const ray of rays) {
      ray.rotation.z += ray.userData.rotationSpeed;
      const pulse = 0.6 + Math.sin(elapsed * 0.4 + ray.userData.pulseOffset) * 0.4;
      (ray.material as THREE.MeshBasicMaterial).opacity = ray.userData.baseOpacity * pulse;
    }

    // Gentle camera movement
    camera.position.x = Math.sin(elapsed * 0.08) * 0.8 + mouseSmooth.x * 0.5;
    camera.position.y = 4 + Math.sin(elapsed * 0.12) * 0.4 + mouseSmooth.y * 0.2;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);

  const observer = new IntersectionObserver(
    (entries) => { isVisible = entries[0].isIntersecting; },
    { threshold: 0.1 }
  );
  const heroSection = canvas.closest('.hero');
  if (heroSection) observer.observe(heroSection);

  function onMouseMove(e: MouseEvent) {
    mouseTarget.set(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    );
  }
  window.addEventListener('mousemove', onMouseMove);

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
      bubbleGeometry.dispose();
      bubbleMaterial.dispose();
      rays.forEach(r => { r.geometry.dispose(); (r.material as THREE.Material).dispose(); });
      renderer.dispose();
    }
  };
}
