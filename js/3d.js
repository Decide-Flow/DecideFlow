// Three.js CDN
import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';

const canvas = document.getElementById('bgCanvas');
const scene = new THREE.Scene();
scene.background = null; // transparent

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 8);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Floating orbs
const group = new THREE.Group();
const colors = [0x0A5CFF, 0x19D8FF, 0x7EF9FF];
for (let i = 0; i < 40; i++) {
    const size = 0.08 + Math.random() * 0.1;
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(size, 16, 16),
        new THREE.MeshStandardMaterial({ color: colors[Math.floor(Math.random() * colors.length)], emissive: 0x0A5CFF, emissiveIntensity: 0.3 })
    );
    sphere.position.x = (Math.random() - 0.5) * 12;
    sphere.position.y = (Math.random() - 0.5) * 6;
    sphere.position.z = (Math.random() - 0.5) * 8 - 4;
    group.add(sphere);
}
scene.add(group);

// Central glowing torus knot
const knotGeo = new THREE.TorusKnotGeometry(0.6, 0.12, 128, 16, 3, 4);
const knotMat = new THREE.MeshStandardMaterial({ color: 0x19D8FF, emissive: 0x0A5CFF, emissiveIntensity: 0.8, metalness: 0.7, roughness: 0.3 });
const knot = new THREE.Mesh(knotGeo, knotMat);
knot.position.y = 0.5;
scene.add(knot);

// Lights
const ambientLight = new THREE.AmbientLight(0x404060);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(1, 2, 1);
scene.add(dirLight);
const backLight = new THREE.PointLight(0x0A5CFF, 0.5);
backLight.position.set(0, 1, -2);
scene.add(backLight);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += 0.002;
    group.rotation.x += 0.001;
    knot.rotation.x += 0.01;
    knot.rotation.y += 0.015;
    renderer.render(scene, camera);
}
animate();

// Handle resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
