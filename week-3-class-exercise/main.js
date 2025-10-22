import * as THREE from 'three';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(3, 3, 8);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Floor (Plane)
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; // make it flat
floor.position.y = -1;
scene.add(floor);

// Geometries

// 1. Cube (ngjyra e re: e verdhë)
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 1.5, 1.5),
  new THREE.MeshPhongMaterial({ color: 0xffff00 }) // e verdhë
);
cube.position.set(0, 0, 0);
scene.add(cube);

// 2. Sphere (ngjyra e re: e kaltër)
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x0000ff }) // blu
);
sphere.position.set(-3, 0, 0);
scene.add(sphere);

// 3. Torus (ngjyra e re: rozë)
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 16, 100),
  new THREE.MeshLambertMaterial({ color: 0xff00ff }) // rozë
);
torus.position.set(3, 0, 0);
scene.add(torus);

// Lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation
function animate() {
  requestAnimationFrame(animate);

  // Objektet jane pa rrotullime (drejt)

  renderer.render(scene, camera);
}
animate();
