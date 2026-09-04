// ---- Three.js WebGL Ripple Effect ----
// Studio Name Ripple
let scene, camera, renderer, rippleMaterial, container, planeMesh;
// Hero Image Ripple
let heroScene, heroCamera, heroRenderer, heroRippleMaterial, heroContainer, heroPlaneMesh;

let mouseX = 0, mouseY = 0;
let imageLoaded = false;
let heroImageLoaded = false;
let imageAspectRatio = 1;
let heroImageAspectRatio = 1;
let currentTexture = null;
let heroCurrentTexture = null;
let lastInteractionTime = 0;
let interactionTimeout = 3000; // 3 seconds before ripples settle
let rippleIntensity = 0; // 0 = still, 1 = full interaction
let isMobileViewport = false; // Auto-ripple on mobile
let autoRippleInterval = null; // Mobile auto-ripple interval

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

function initRippleForElement(imageSelector, containerSelector, isHeroImage = false) {
  const img = document.querySelector(imageSelector);
  const cont = document.querySelector(containerSelector);

  if (!img.complete || !img.naturalWidth) {
    console.warn('Image not loaded yet:', imageSelector);
    return;
  }

  if (!window.THREE) {
    console.error('Three.js not loaded');
    return;
  }

  // Get image dimensions
  let imgWidth = img.naturalWidth || img.width || img.clientWidth;
  let imgHeight = img.naturalHeight || img.height || img.clientHeight;

  if (!imgWidth || !imgHeight) {
    console.warn('Image dimensions not available', { imgWidth, imgHeight });
    return;
  }

  const aspectRatio = imgWidth / imgHeight;
  console.log(isHeroImage ? 'Hero' : 'Studio', 'Image dimensions:', imgWidth, 'x', imgHeight, 'aspect:', aspectRatio.toFixed(3));

  // Get container dimensions
  const rect = cont.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  // Create Three.js scene
  const newScene = new THREE.Scene();
  newScene.background = null;

  // Create camera
  const newCamera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0.1, 1000);
  newCamera.position.z = 1;

  // Create renderer
  const newRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  newRenderer.setSize(width, height);
  newRenderer.setPixelRatio(window.devicePixelRatio);
  newRenderer.domElement.id = isHeroImage ? 'hero-image-canvas' : 'studio-name-canvas';
  cont.appendChild(newRenderer.domElement);

  // Load texture
  const textureLoader = new THREE.TextureLoader();
  console.log('Loading texture from:', img.src);

  textureLoader.load(
    img.src,
    (texture) => {
      console.log('Texture loaded successfully');

      // Create material with ripple shader
      const newRippleMaterial = new THREE.ShaderMaterial({
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

      // Create geometry and mesh
      const newPlaneMesh = createPlaneWithAspectRatio(width, height, aspectRatio, newRippleMaterial);
      newScene.add(newPlaneMesh);

      // Set canvas aspect ratio
      newRenderer.domElement.style.aspectRatio = aspectRatio.toFixed(4);
      newRenderer.domElement.style.width = '100%';
      newRenderer.domElement.style.height = 'auto';

      // Hide original image
      img.style.display = 'none';

      // Store references
      if (isHeroImage) {
        heroImageAspectRatio = aspectRatio;
        heroScene = newScene;
        heroCamera = newCamera;
        heroRenderer = newRenderer;
        heroRippleMaterial = newRippleMaterial;
        heroPlaneMesh = newPlaneMesh;
        heroCurrentTexture = texture;
        heroImageLoaded = true;
      } else {
        imageAspectRatio = aspectRatio;
        scene = newScene;
        camera = newCamera;
        renderer = newRenderer;
        rippleMaterial = newRippleMaterial;
        planeMesh = newPlaneMesh;
        currentTexture = texture;
        imageLoaded = true;
      }

      const displayRect = newRenderer.domElement.getBoundingClientRect();
      console.log((isHeroImage ? 'Hero' : 'Studio'), 'Ripple initialized. Display:', displayRect.width.toFixed(0), 'x', displayRect.height.toFixed(0), 'px');

      if (!isHeroImage) {
        updateMobileRippleState();
      }
    },
    undefined,
    (error) => {
      console.error('Texture load error:', error);
      img.style.opacity = '1';
    }
  );
}

function initRipple() {
  initRippleForElement('.studio-name-img', '#studio-name-container', false);
}

function initHeroRipple() {
  initRippleForElement('.hero-image img', '.hero-image', true);
}

// ---- Layout measurement (cached, recomputed on resize) ----
function measureLayout() {
  const rect = container.getBoundingClientRect();
  // Additional layout calculations can go here if needed
}

// ---- Mobile viewport detection and auto-ripple ----
function isMobileSize() {
  return window.innerWidth >= 320 && window.innerWidth <= 768;
}

function startAutoRipple() {
  if (autoRippleInterval) clearInterval(autoRippleInterval);

  autoRippleInterval = setInterval(() => {
    // Generate ripple at random point within container (with slight bias toward center)
    const randX = 0.3 + Math.random() * 0.4; // 0.3 to 0.7 range (center-biased)
    const randY = 0.3 + Math.random() * 0.4; // 0.3 to 0.7 range (center-biased)

    // Update studio-name ripple
    if (rippleMaterial && container) {
      rippleMaterial.uniforms.cursorPos.value.set(randX, randY);
    }

    // Update hero-image ripple
    if (heroRippleMaterial && heroContainer) {
      heroRippleMaterial.uniforms.cursorPos.value.set(randX, randY);
    }

    lastInteractionTime = Date.now();
    rippleIntensity = 0.7; // Slightly lower intensity for ambient effect
    if (rippleMaterial) rippleMaterial.uniforms.rippleIntensity.value = rippleIntensity;
    if (heroRippleMaterial) heroRippleMaterial.uniforms.rippleIntensity.value = rippleIntensity;
  }, 1500); // Auto-ripple every 1.5 seconds on mobile
}

function stopAutoRipple() {
  if (autoRippleInterval) {
    clearInterval(autoRippleInterval);
    autoRippleInterval = null;
  }
}

function updateMobileRippleState() {
  const wasMobile = isMobileViewport;
  isMobileViewport = isMobileSize();

  if (isMobileViewport && !wasMobile && imageLoaded) {
    startAutoRipple();
  } else if (!isMobileViewport && wasMobile) {
    stopAutoRipple();
  }
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

  // Render hero image ripple if loaded
  if (heroImageLoaded && heroRippleMaterial && heroRenderer) {
    heroRippleMaterial.uniforms.time.value += 0.016;
    heroRippleMaterial.uniforms.rippleIntensity.value = rippleIntensity;
    heroRenderer.render(heroScene, heroCamera);
  }

  requestAnimationFrame(animate);
}

// ---- Event listeners ----
document.addEventListener('mousemove', (e) => {
  // Update studio-name ripple
  if (rippleMaterial && container) {
    const rect = container.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width;
    const normalizedY = 1.0 - (e.clientY - rect.top) / rect.height;
    rippleMaterial.uniforms.cursorPos.value.set(normalizedX, normalizedY);
  }

  // Update hero-image ripple
  if (heroRippleMaterial && heroContainer) {
    const heroRect = heroContainer.getBoundingClientRect();
    const heroNormalizedX = (e.clientX - heroRect.left) / heroRect.width;
    const heroNormalizedY = 1.0 - (e.clientY - heroRect.top) / heroRect.height;
    heroRippleMaterial.uniforms.cursorPos.value.set(heroNormalizedX, heroNormalizedY);
  }

  // Track interaction time
  lastInteractionTime = Date.now();
  rippleIntensity = 1.0; // Restore full intensity on interaction
  if (rippleMaterial) rippleMaterial.uniforms.rippleIntensity.value = rippleIntensity;
  if (heroRippleMaterial) heroRippleMaterial.uniforms.rippleIntensity.value = rippleIntensity;
});

window.addEventListener('resize', () => {
  // Resize studio-name ripple
  if (renderer && camera && container && imageLoaded) {
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
  }

  // Resize hero-image ripple
  if (heroRenderer && heroCamera && heroContainer && heroImageLoaded) {
    const heroRect = heroContainer.getBoundingClientRect();
    const heroWidth = heroRect.width;
    const heroHeight = heroRect.height;

    heroRenderer.setSize(heroWidth, heroHeight);
    heroRenderer.setPixelRatio(window.devicePixelRatio);

    heroCamera.left = heroWidth / -2;
    heroCamera.right = heroWidth / 2;
    heroCamera.top = heroHeight / 2;
    heroCamera.bottom = heroHeight / -2;
    heroCamera.updateProjectionMatrix();

    if (heroPlaneMesh) {
      heroPlaneMesh.geometry.dispose();
      heroPlaneMesh.geometry = createPlaneWithAspectRatio(heroWidth, heroHeight, heroImageAspectRatio, heroRippleMaterial).geometry;
    }
  }

  // Check if mobile viewport changed
  updateMobileRippleState();
});

// Load sequence
const studioImg = document.querySelector('.studio-name-img');
const heroImg = document.querySelector('.hero-image img');

container = document.getElementById('studio-name-container');
heroContainer = document.querySelector('.hero-image');

if (studioImg.complete) {
  setTimeout(() => initRipple(), 0);
} else {
  studioImg.addEventListener('load', initRipple, { once: true });
}

if (heroImg && heroImg.complete) {
  setTimeout(() => initHeroRipple(), 0);
} else if (heroImg) {
  heroImg.addEventListener('load', initHeroRipple, { once: true });
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
