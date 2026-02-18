import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

//////////////////////
// SCENE
//////////////////////
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd1e5);
scene.fog = new THREE.FogExp2(0xbfd1e5, 0.02);

//////////////////////
// CAMERA
//////////////////////
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(20, 12, 25);

//////////////////////
// RENDERER
//////////////////////
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

//////////////////////
// CONTROLS
//////////////////////
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

//////////////////////
// LIGHTING
//////////////////////
const ambient = new THREE.AmbientLight(0xffffff, 0.55);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffffff, 2.0);
sun.position.set(30, 40, 20);
sun.castShadow = true;
sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;
scene.add(sun);

//////////////////////
// TEXTURE LOADER
//////////////////////
const textureLoader = new THREE.TextureLoader();

const wallTexture = textureLoader.load('textures/wall.jpg');
const roofTexture = textureLoader.load('textures/roof.jpg');
const roadTexture = textureLoader.load('textures/road.jpg');
const pavementTexture = textureLoader.load('textures/pavement.jpg');

wallTexture.colorSpace = THREE.SRGBColorSpace;
roofTexture.colorSpace = THREE.SRGBColorSpace;
roadTexture.colorSpace = THREE.SRGBColorSpace;
pavementTexture.colorSpace = THREE.SRGBColorSpace;

//////////////////////
// ROAD
//////////////////////
roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping;
roadTexture.repeat.set(10, 1);

const road = new THREE.Mesh(
  new THREE.PlaneGeometry(120, 12),
  new THREE.MeshStandardMaterial({ map: roadTexture, roughness: 1.0 })
);
road.rotation.x = -Math.PI / 2;
road.receiveShadow = true;
scene.add(road);

//////////////////////
// SIDEWALK
//////////////////////
pavementTexture.wrapS = pavementTexture.wrapT = THREE.RepeatWrapping;
pavementTexture.repeat.set(10, 2);

const sidewalk = new THREE.Mesh(
  new THREE.PlaneGeometry(120, 8),
  new THREE.MeshStandardMaterial({ map: pavementTexture, roughness: 1.0 })
);
sidewalk.position.z = -10;
sidewalk.rotation.x = -Math.PI / 2;
sidewalk.receiveShadow = true;
scene.add(sidewalk);

//////////////////////
// HELPERS
//////////////////////
function makeArchedWindow(w = 1.2, h = 2.6, d = 0.15) {
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x141414, metalness: 0.1, roughness: 0.35 });
  const group = new THREE.Group();

  const rect = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), frameMat);
  rect.castShadow = true;
  rect.receiveShadow = true;
  group.add(rect);

  const archRadius = w / 2;
  const arch = new THREE.Mesh(new THREE.CylinderGeometry(archRadius, archRadius, d, 18, 1, false, 0, Math.PI), frameMat);
  arch.rotation.z = Math.PI / 2;
  arch.position.y = h / 2;
  arch.castShadow = true;
  arch.receiveShadow = true;
  group.add(arch);

  return group;
}

//////////////////////
// HOUSE GROUP
//////////////////////
const house = new THREE.Group();
scene.add(house);

const wallMat = new THREE.MeshStandardMaterial({ map: wallTexture, roughness: 0.95 });
const trimMat = new THREE.MeshStandardMaterial({ color: 0x1c1c1c, roughness: 0.6 });
const roofMat = new THREE.MeshStandardMaterial({ map: roofTexture, roughness: 0.85 });

// Floor 1
const houseFloor1 = new THREE.Mesh(new THREE.CylinderGeometry(6.3, 6.3, 7, 8), wallMat);
houseFloor1.position.y = 3.5;
houseFloor1.castShadow = true;
houseFloor1.receiveShadow = true;
house.add(houseFloor1);

// Floor 2
const houseFloor2 = new THREE.Mesh(new THREE.CylinderGeometry(6.15, 6.15, 5, 8), wallMat);
houseFloor2.position.y = 7 + 2.5;
houseFloor2.castShadow = true;
houseFloor2.receiveShadow = true;
house.add(houseFloor2);

// Trims
const trim1 = new THREE.Mesh(new THREE.CylinderGeometry(6.36, 6.36, 0.25, 8), trimMat);
trim1.position.y = 7.0; trim1.castShadow = true; trim1.receiveShadow = true; house.add(trim1);

const trim2 = new THREE.Mesh(new THREE.CylinderGeometry(6.22, 6.22, 0.25, 8), trimMat);
trim2.position.y = 12.0; trim2.castShadow = true; trim2.receiveShadow = true; house.add(trim2);

// Roof main
const roofMain = new THREE.Mesh(new THREE.ConeGeometry(7.6, 4.2, 4), roofMat);
roofMain.position.y = 15.1;
roofMain.rotation.y = Math.PI / 4;
roofMain.castShadow = true;
roofMain.receiveShadow = true;
house.add(roofMain);

// Top tower block
const roofTopBlock = new THREE.Mesh(new THREE.BoxGeometry(4.2, 3.2, 3.6), wallMat);
roofTopBlock.position.set(0, 17.0, 0);
roofTopBlock.castShadow = true;
roofTopBlock.receiveShadow = true;
house.add(roofTopBlock);

// Small top roof
const roofTop = new THREE.Mesh(new THREE.ConeGeometry(3.2, 2.6, 4), roofMat);
roofTop.position.set(0, 19.5, 0);
roofTop.rotation.y = Math.PI / 4;
roofTop.castShadow = true;
roofTop.receiveShadow = true;
house.add(roofTop);

//////////////////////
// FIXED WINDOWS
//////////////////////

// Floor1 windows
for (let i = -1; i <= 1; i++) {
  const win1 = makeArchedWindow(1.35, 2.8, 0.18);
  win1.position.set(i * 2.6, 0, 6.1);
  houseFloor1.add(win1);
}

// Floor2 windows
for (let i = -2; i <= 2; i++) {
  if (i === 0) continue;
  const win2 = makeArchedWindow(1.15, 2.2, 0.18);
  win2.position.set(i * 1.9, 0, 6.0);
  houseFloor2.add(win2);
}

// Extra tall windows on top
for (let i = -1; i <= 1; i += 2) {
  const win3 = makeArchedWindow(1.1, 2.2, 0.18);
  win3.position.set(i * 1.4, 0, 3.8);
  win3.rotation.y = i > 0 ? -0.6 : 0.6;
  roofTopBlock.add(win3);
}

//////////////////////
// SIDE BUILDING GROUP
//////////////////////
const sideGroup = new THREE.Group();
scene.add(sideGroup);

const sideBuilding = new THREE.Mesh(
  new THREE.BoxGeometry(12, 15, 30),
  new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.9 })
);
sideBuilding.position.set(15, 7.5, 0);
sideBuilding.castShadow = true;
sideBuilding.receiveShadow = true;
sideGroup.add(sideBuilding);

// Windows on sideBuilding
const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.05, roughness: 0.35 });
for (let i = -3; i <= 3; i += 3) {
  for (let j = 3; j <= 12; j += 4) {
    const windowSide = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 0.2), windowMaterial);
    windowSide.position.set(i, j - sideBuilding.position.y, 15.1);
    windowSide.castShadow = true;
    windowSide.receiveShadow = true;
    sideGroup.add(windowSide);
  }
}

// Door
const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.8 });
const door = new THREE.Mesh(new THREE.BoxGeometry(3, 5, 0.3), doorMaterial);
door.position.set(0, 2.5 - sideBuilding.position.y, 15.12);
door.castShadow = true;
door.receiveShadow = true;
sideGroup.add(door);

sideGroup.position.copy(sideBuilding.position);
sideBuilding.position.set(0, 0, 0);

//////////////////////
// PROFESSIONAL LOGO
//////////////////////
const fontLoader = new FontLoader();
fontLoader.load('fonts/helvetiker_regular.typeface.json', (font) => {
  const label = 'VISION University';

  const textGeo = new TextGeometry(label, {
    font,
    size: 1.2,
    depth: 0.25,
    curveSegments: 10,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelSegments: 3,
  });

  textGeo.computeBoundingBox();
  const bbox = textGeo.boundingBox;
  const textWidth = bbox.max.x - bbox.min.x;
  const textHeight = bbox.max.y - bbox.min.y;
  textGeo.translate(-textWidth / 2, -textHeight / 2, 0);

  const plate = new THREE.Mesh(
    new THREE.PlaneGeometry(textWidth + 1.2, textHeight + 0.8),
    new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 })
  );

  const sideDepth = 30;
  const zFront = sideDepth / 2 + 0.02;
  plate.position.set(0, 4.2, zFront);
  plate.castShadow = true;
  plate.receiveShadow = true;
  sideGroup.add(plate);

  const textMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.15, roughness: 0.35 });
  const textMesh = new THREE.Mesh(textGeo, textMat);
  textMesh.position.set(0, 4.2, zFront + 0.03);
  textMesh.castShadow = true;
  sideGroup.add(textMesh);
});

//////////////////////
// TREE
//////////////////////
const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 5), new THREE.MeshStandardMaterial({ color: 0x6b3e26, roughness: 0.9 }));
trunk.position.set(-8, 2.5, -6);
trunk.castShadow = true;
trunk.receiveShadow = true;
scene.add(trunk);

const leaves = new THREE.Mesh(new THREE.SphereGeometry(2.5, 18, 18), new THREE.MeshStandardMaterial({ color: 0x2e8b57, roughness: 0.9 }));
leaves.position.set(-8, 6, -6);
leaves.castShadow = true;
leaves.receiveShadow = true;
scene.add(leaves);

//////////////////////
// CAR MODEL
//////////////////////
const loader = new GLTFLoader();
loader.load('models/car.glb', (gltf) => {
  const car = gltf.scene;
  car.scale.set(2, 2, 2);
  car.position.set(-10, 0, 5);

  car.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });

  scene.add(car);
});

//////////////////////
// ANIMATION LOOP
//////////////////////
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

//////////////////////
// RESIZE
//////////////////////
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
