export const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vPosition;
  varying float vDistToMouse;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Layered sine wave displacement — more complex
    float wave1 = sin(pos.x * 0.8 + uTime * 0.6) * 0.35;
    float wave2 = sin(pos.y * 0.6 + uTime * 0.4) * 0.25;
    float wave3 = sin((pos.x + pos.y) * 0.5 + uTime * 0.8) * 0.18;
    float wave4 = sin(pos.x * 1.5 - uTime * 0.3) * cos(pos.y * 1.2 + uTime * 0.5) * 0.12;
    float wave5 = sin(pos.x * 2.5 + uTime * 1.2) * cos(pos.y * 2.0 - uTime * 0.7) * 0.06;

    // Mouse interaction wave
    float mouseDist = length(vec2(pos.x, pos.y) - uMouse * 12.0);
    float mouseWave = sin(mouseDist * 0.5 - uTime * 3.0) * exp(-mouseDist * 0.15) * 0.3;

    float elevation = wave1 + wave2 + wave3 + wave4 + wave5 + mouseWave;
    pos.z += elevation;

    vElevation = elevation;
    vPosition = pos;
    vDistToMouse = mouseDist;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const fragmentShader = `
  uniform float uTime;
  uniform vec3 uDeepColor;
  uniform vec3 uShallowColor;
  uniform vec3 uFresnelColor;
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vPosition;
  varying float vDistToMouse;

  void main() {
    // Base color mix based on elevation
    float mixFactor = (vElevation + 0.5) * 0.7;
    vec3 color = mix(uDeepColor, uShallowColor, clamp(mixFactor, 0.0, 1.0));

    // Enhanced caustic pattern
    float caustic1 = sin(vUv.x * 20.0 + uTime * 0.5) * sin(vUv.y * 20.0 + uTime * 0.3);
    float caustic2 = sin(vUv.x * 15.0 - uTime * 0.4) * sin(vUv.y * 12.0 - uTime * 0.6);
    float caustic3 = sin(vUv.x * 30.0 + uTime * 0.8) * sin(vUv.y * 25.0 - uTime * 0.5) * 0.5;
    float caustics = (caustic1 + caustic2 + caustic3) * 0.05;
    color += vec3(caustics) * uFresnelColor;

    // Edge glow / Fresnel approximation
    float fresnel = pow(1.0 - abs(vElevation * 0.8), 3.0) * 0.18;
    color += uFresnelColor * fresnel;

    // Wave crest highlights
    float crest = smoothstep(0.3, 0.6, vElevation) * 0.15;
    color += vec3(crest) * uFresnelColor;

    // Mouse glow
    float mouseGlow = exp(-vDistToMouse * 0.2) * 0.1;
    color += uFresnelColor * mouseGlow;

    // Shimmer
    float shimmer = sin(vPosition.x * 8.0 + uTime * 2.0) * sin(vPosition.y * 6.0 + uTime * 1.5) * 0.04;
    color += vec3(shimmer);

    // Depth fade at edges
    float edgeFade = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x)
                   * smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
    color *= edgeFade * 0.5 + 0.5;

    gl_FragColor = vec4(color, 0.88);
  }
`;
