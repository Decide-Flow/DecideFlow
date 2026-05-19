// DecideFlow 3D Background Engine
// Uses Three.js CDN – must be included in HTML before this script.

let scene, camera, renderer, particles, spheresGroup, linesGroup;
const colors = [0x061B4D, 0x0A5CFF, 0x19D8FF, 0x7EF9FF];

function initThreeScene() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xFFFFFF); // white base, canvas adds depth

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  camera.position.y = 0.5;

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // performance safe
  renderer.shadowMap.enabled = true;

  // Lights – realistic cinematic
  const ambientLight = new THREE.AmbientLight(0x404066);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(1, 2, 2);
  scene.add(dirLight);
  const pointLight1 = new THREE.PointLight(0x0A5CFF, 1, 10);
  pointLight1.position.set(-1, 1, 2);
  scene.add(pointLight1);
  const pointLight2 = new THREE.PointLight(0x19D8FF, 0.8, 10);
  pointLight2.position.set(1, -0.5, 1);
  scene.add(pointLight2);

  // Particle system (flow particles)
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 800;
  const posArray = new Float32Array(particlesCount * 3);
  for (let i = 0; i < particlesCount * 3; i += 3) {
    posArray[i] = (Math.random() - 0.5) * 8;
    posArray[i+1] = (Math.random() - 0.5) * 5;
    posArray[i+2] = (Math.random() - 0.5) * 4;
  }
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x0A5CFF,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0.6
  });
  particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  // Floating spheres (decision nodes)
  spheresGroup = new THREE.Group();
  const sphereGeom = new THREE.SphereGeometry(0.3, 32, 32);
  for (let i = 0; i < 6; i++) {
    const material = new THREE.MeshStandardMaterial({
      color: colors[i % colors.length],
      roughness: 0.2,
      metalness: 0.4,
      emissive: new THREE.Color(colors[i % colors.length]).multiplyScalar(0.3)
    });
    const sphere = new THREE.Mesh(sphereGeom, material);
    sphere.position.x = (Math.random() - 0.5) * 5;
    sphere.position.y = (Math.random() - 0.5) * 3.5;
    sphere.position.z = (Math.random() - 0.5) * 3;
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    spheresGroup.add(sphere);
  }
  scene.add(spheresGroup);

  // Connecting lines (flow lines)
  linesGroup = new THREE.Group();
  const points = [];
  for (let i = 0; i < 20; i++) {
    points.push(new THREE.Vector3((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 3));
  }
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x19D8FF, opacity: 0.25, transparent: true });
  for (let i = 0; i < points.length - 1; i++) {
    const geometry = new THREE.BufferGeometry().setFromPoints([points[i], points[i+1]]);
    const line = new THREE.Line(geometry, lineMaterial);
    linesGroup.add(line);
  }
  scene.add(linesGroup);

  // Large rotating gradient orb (background)
  const orbGeom = new THREE.SphereGeometry(1.8, 64, 64);
  const orbMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      color1: { value: new THREE.Color(0x061B4D) },
      color2: { value: new THREE.Color(0x19D8FF) }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime;
      uniform vec3 color1;
      uniform vec3 color2;
      void main() {
        vec2 uv = vUv;
        float mixVal = sin(uv.x * 3.0 + uTime) * 0.5 + 0.5;
        vec3 col = mix(color1, color2, mixVal);
        gl_FragColor = vec4(col, 0.15);
      }
    `,
    transparent: true,
    depthWrite: false,
  });
  const orb = new THREE.Mesh(orbGeom, orbMat);
  orb.position.z = -2;
  scene.add(orb);
  orb.userData = { material: orbMat };

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    // Update uniforms
    if (orb.userData.material) {
      orb.userData.material.uniforms.uTime.value += 0.005;
    }

    // Rotate particles slowly
    particles.rotation.y += 0.0002;
    particles.rotation.x += 0.0001;

    // Float spheres
    spheresGroup.rotation.y += 0.001;
    spheresGroup.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;

    // Move lines gently
    linesGroup.rotation.y += 0.0005;

    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  window.addEventListener('resize', onWindowResize, false);
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

// Start when page loads
window.addEventListener('load', initThreeScene);
