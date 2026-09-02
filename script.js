// ---- Three.js WebGL Ripple Effect ----
let scene, camera, renderer, rippleMaterial, container, planeMesh;
let mouseX = 0, mouseY = 0;
let imageLoaded = false;
let imageAspectRatio = 1;
let currentTexture = null;
let lastInteractionTime = 0;
let interactionTimeout = 3000; // 3 seconds before ripples settle
let rippleIntensity = 0; // 0 = still, 1 = full interaction

// Vertex shader - simple pass-through
const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader - circular ripple effect with distortion
const fragmentShader = `
  uniform sampler2D tTexture;
  uniform vec2 cursorPos;
  uniform float time;
  uniform float rippleIntensity;

  varying vec2 vUv;

  float ripple(vec2 uv, vec2 center, float t) {
    float dist = length(uv - center);
    float wave = sin(dist * 15.0 - t * 2.0) * exp(-dist * 3.5);
    return wave;
  }

  void main() {
    vec2 uv = vUv;
    vec2 centerUv = cursorPos;

    // Calculate multiple ripple layers with varying frequencies and decays
    float distortion = 0.0;
    distortion += ripple(uv, centerUv, time) * 0.20;
    distortion += ripple(uv, centerUv, time - 0.6) * 0.12;
    distortion += ripple(uv, centerUv, time - 1.2) * 0.08;
    distortion += ripple(uv, centerUv, time - 1.8) * 0.06;
    distortion += ripple(uv, centerUv, time - 2.4) * 0.04;

    // High-frequency small ripple layers for water detail
    float dist = length(uv - centerUv);
    float smallRipple1 = sin(dist * 40.0 - time * 2.5) * exp(-dist * 6.0);
    distortion += smallRipple1 * 0.03;

    float smallRipple2 = sin(dist * 50.0 - time * 3.0) * exp(-dist * 7.0);
    distortion += smallRipple2 * 0.02;

    // Apply distortion to UV coordinates with increased strength, modulated by interaction intensity
    vec2 distortedUv = uv + distortion * normalize(uv - centerUv) * 0.08 * rippleIntensity;

    // Clamp to [0, 1] to avoid sampling outside texture
    distortedUv = clamp(distortedUv, 0.0, 1.0);

    // Sample texture with distorted coordinates
    vec4 texColor = texture(tTexture, distortedUv);

    // Add subtle shading based on distortion (softer), also modulated by interaction intensity
    float shade = 1.0 - abs(distortion) * 0.05 * rippleIntensity;
    texColor.rgb = mix(texColor.rgb, texColor.rgb * shade, rippleIntensity);
    texColor.rgb *= mix(1.0, shade, rippleIntensity);

    gl_FragColor = texColor;
  }
`;

function createPlaneWithAspectRatio(containerWidth, containerHeight, aspectRatio, material) {
  const containerAspect = containerWidth / containerHeight;
  let planeWidth, planeHeight;

  if (containerAspect > aspectRatio) {
    planeHeight = containerHeight;
    planeWidth = planeHeight * aspectRatio;
  } else {
    planeWidth = containerWidth;
    planeHeight = planeWidth / aspectRatio;
  }

  const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
  return new THREE.Mesh(geometry, material);
}

function initRipple() {
  const studioImg = document.querySelector('.studio-name-img');
  container = document.getElementById('studio-name-container');

  console.log('initRipple called, image complete:', studioImg.complete, 'naturalWidth:', studioImg.naturalWidth);

  if (!studioImg.complete || !studioImg.naturalWidth) {
    console.warn('Image not loaded yet');
    return;
  }

  if (!window.THREE) {
    console.error('Three.js not loaded');
    return;
  }

  // Get image dimensions (handle SVG which may not have naturalWidth/Height)
  let imgWidth = studioImg.naturalWidth || studioImg.width || studioImg.clientWidth;
  let imgHeight = studioImg.naturalHeight || studioImg.height || studioImg.clientHeight;

  if (!imgWidth || !imgHeight) {
    console.warn('Image dimensions not available', { imgWidth, imgHeight, naturalW: studioImg.naturalWidth, naturalH: studioImg.naturalHeight });
    rippleReady = false;
    return;
  }

  // Use image's native resolution directly for sharpest output
  imageAspectRatio = imgWidth / imgHeight;
  console.log('Image dimensions:', imgWidth, 'x', imgHeight, 'aspect:', imageAspectRatio.toFixed(3));

  // Get container dimensions
  const rect = container.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  // Create Three.js scene
  scene = new THREE.Scene();
  scene.background = null;

  // Create camera (orthographic to match 2D overlay)
  camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0.1, 1000);
  camera.position.z = 1;

  // Create renderer
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.domElement.id = 'studio-name-canvas';
  container.appendChild(renderer.domElement);

  // Load texture from image
  const textureLoader = new THREE.TextureLoader();
  console.log('Loading texture from:', studioImg.src);

  textureLoader.load(
    studioImg.src,
    (texture) => {
      console.log('Texture loaded successfully');
      currentTexture = texture;

      // Create material with ripple shader
      rippleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          tTexture: { value: texture },
          cursorPos: { value: new THREE.Vector2(0.5, 0.5) },
          time: { value: 0 },
          rippleIntensity: { value: 0 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true
      });

      // Create geometry and mesh with correct aspect ratio
      planeMesh = createPlaneWithAspectRatio(width, height, imageAspectRatio, rippleMaterial);
      scene.add(planeMesh);

      // Set canvas to maintain image aspect ratio via CSS
      const canvasAspect = imageAspectRatio;
      renderer.domElement.style.aspectRatio = canvasAspect.toFixed(4);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = 'auto';

      // Hide the original image
      studioImg.style.display = 'none';

      imageLoaded = true;
      const displayRect = renderer.domElement.getBoundingClientRect();
      console.log('Ripple initialized. Display:', displayRect.width.toFixed(0), 'x', displayRect.height.toFixed(0), 'px');

      animate();
    },
    undefined,
    (error) => {
      console.error('Texture load error:', error);
      studioImg.style.opacity = '1';
      rippleReady = false;
    }
  );
}

// ---- Layout measurement (cached, recomputed on resize) ----
function measureLayout() {
  const rect = container.getBoundingClientRect();
  // Additional layout calculations can go here if needed
}

// ---- Easing function for smooth settling ----
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// ---- Main animation loop ----
function animate() {
  if (!imageLoaded || !rippleMaterial) {
    requestAnimationFrame(animate);
    return;
  }

  rippleMaterial.uniforms.time.value += 0.016; // ~60fps

  // Dampen ripple intensity over time when not interacting
  const timeSinceInteraction = Date.now() - lastInteractionTime;
  if (timeSinceInteraction > interactionTimeout) {
    // Gradually fade out ripples after timeout with easing
    const fadeDuration = 1500; // 1.5 second fade with easing
    const fadeElapsed = timeSinceInteraction - interactionTimeout;
    const fadeProgress = Math.min(1, fadeElapsed / fadeDuration);
    rippleIntensity = Math.max(0, 1 - easeOutCubic(fadeProgress));
    rippleMaterial.uniforms.rippleIntensity.value = rippleIntensity;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// ---- Event listeners ----
document.addEventListener('mousemove', (e) => {
  if (!rippleMaterial || !container) return;

  const rect = container.getBoundingClientRect();

  // Normalize to [0, 1] based on container position
  const normalizedX = (e.clientX - rect.left) / rect.width;
  const normalizedY = 1.0 - (e.clientY - rect.top) / rect.height; // Flip Y for WebGL

  rippleMaterial.uniforms.cursorPos.value.set(normalizedX, normalizedY);

  // Track interaction time
  lastInteractionTime = Date.now();
  rippleIntensity = 1.0; // Restore full intensity on interaction
  rippleMaterial.uniforms.rippleIntensity.value = rippleIntensity;
});

window.addEventListener('resize', () => {
  if (!renderer || !camera || !container || !imageLoaded) return;

  const rect = container.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);

  camera.left = width / -2;
  camera.right = width / 2;
  camera.top = height / 2;
  camera.bottom = height / -2;
  camera.updateProjectionMatrix();

  if (planeMesh) {
    planeMesh.geometry.dispose();
    planeMesh.geometry = createPlaneWithAspectRatio(width, height, imageAspectRatio, rippleMaterial).geometry;
  }

  if (rippleMaterial) {
    rippleMaterial.uniforms.resolution.value.set(width, height);
  }
});

// Load sequence
const studioImg = document.querySelector('.studio-name-img');
if (studioImg.complete) {
  setTimeout(() => initRipple(), 0);
} else {
  studioImg.addEventListener('load', initRipple, { once: true });
}

// Start animation loop
requestAnimationFrame(animate);

// ---- Grid overlay toggle (unchanged) ----
const gridOverlay = document.querySelector('.grid-overlay');
document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'g') {
    gridOverlay.classList.toggle('grid-visible');
  }
});
