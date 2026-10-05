import './styles.css';
import * as THREE from 'three';

const host = document.querySelector('#canvas-target');

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2('#070b12', 0.06);

const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
camera.position.set(0, 0.7, 9.5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
host.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight('#fff7d6', 1.6);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight('#ffde72', 2.8);
keyLight.position.set(3.5, 4, 6);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight('#47d2ff', 1.5);
rimLight.position.set(-4, -2, 5);
scene.add(rimLight);

const device = new THREE.Group();
scene.add(device);

const bodyMaterial = new THREE.MeshStandardMaterial({
  color: '#f9d74d',
  roughness: 0.6,
  metalness: 0.15,
  emissive: '#362300',
  emissiveIntensity: 0.2,
});

const accentMaterial = new THREE.MeshStandardMaterial({
  color: '#ff5c70',
  roughness: 0.4,
  metalness: 0.2,
  emissive: '#400912',
  emissiveIntensity: 0.4,
});

const darkMaterial = new THREE.MeshStandardMaterial({
  color: '#10161c',
  roughness: 0.7,
  metalness: 0.3,
});

const screenMaterial = new THREE.MeshStandardMaterial({
  color: '#0d1d2a',
  emissive: '#164f66',
  emissiveIntensity: 0.8,
  roughness: 0.3,
});

const buttonMaterial = new THREE.MeshStandardMaterial({
  color: '#171c22',
  roughness: 0.75,
  metalness: 0.35,
});

const shell = new THREE.Mesh(new THREE.BoxGeometry(4.8, 3.2, 1.15), bodyMaterial);
const shellTop = new THREE.Mesh(new THREE.BoxGeometry(4.0, 2.4, 0.18), accentMaterial);
shellTop.position.z = 0.64;
shellTop.position.y = 0.15;

device.add(shell, shellTop);

const screenFrame = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.1, 0.22), darkMaterial);
screenFrame.position.set(0, 0.25, 0.72);
device.add(screenFrame);

const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.55), screenMaterial);
screen.position.set(0, 0.3, 0.92);

device.add(screen);

const buttonCluster = new THREE.Group();
buttonCluster.position.set(0, -0.8, 0.8);

const dPadBase = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.18), buttonMaterial);
dPadBase.position.set(-1.4, 0, 0);
buttonCluster.add(dPadBase);

const padHorizontal = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.3, 0.18), buttonMaterial);
padHorizontal.position.set(-1.4, 0, 0.03);
buttonCluster.add(padHorizontal);

const padVertical = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.7, 0.18), buttonMaterial);
padVertical.position.set(-1.4, 0, 0.03);
buttonCluster.add(padVertical);

const aButton = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 20), accentMaterial);
aButton.scale.set(1.25, 1.25, 0.7);
aButton.position.set(1.6, -0.1, 0.05);
buttonCluster.add(aButton);

const bButton = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 20), accentMaterial);
bButton.scale.set(1.25, 1.25, 0.7);
bButton.position.set(1.15, 0.55, 0.05);
buttonCluster.add(bButton);

const startButton = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.12, 18), darkMaterial);
startButton.rotation.x = Math.PI / 2;
startButton.position.set(0.1, -0.3, 0.1);
buttonCluster.add(startButton);

const selectButton = startButton.clone();
selectButton.position.set(-0.45, -0.3, 0.1);
buttonCluster.add(selectButton);

device.add(buttonCluster);

const cartridgeBase = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.52, 1.1), darkMaterial);
cartridgeBase.position.set(0, -2.15, -0.2);
const cartridgeTop = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.22, 0.9), accentMaterial);
cartridgeTop.position.set(0, -1.85, -0.2);
const cartridgeAccent = new THREE.Mesh(
  new THREE.BoxGeometry(0.7, 0.15, 0.3),
  new THREE.MeshStandardMaterial({
    color: '#5cf1ff',
    emissive: '#0e4857',
    emissiveIntensity: 0.45,
  })
);
cartridgeAccent.position.set(0, -1.92, 0.2);
device.add(cartridgeBase, cartridgeTop, cartridgeAccent);

const parts = {
  shell,
  shellTop,
  screenFrame,
  screen,
  buttonCluster,
  cartridgeBase,
  cartridgeTop,
  cartridgeAccent,
};

Object.entries(parts).forEach(([key, mesh]) => {
  mesh.userData.basePos = mesh.position.clone();
  mesh.userData.baseRot = mesh.rotation.clone();
  mesh.userData.baseScale = mesh.scale.clone();
});

const pointer = new THREE.Vector2(0, 0);
const particleMeshes = [];
const particleGroup = new THREE.Group();
scene.add(particleGroup);

for (let i = 0; i < 60; i += 1) {
  const particle = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.12, 0.12),
    new THREE.MeshStandardMaterial({
      color: i % 2 === 0 ? '#ffeb61' : i % 3 === 0 ? '#7fddff' : '#ff4a74',
      emissive: '#1a1a1a',
      emissiveIntensity: 0.5,
    })
  );

  particle.position.set(
    (Math.random() - 0.5) * 12,
    (Math.random() - 0.5) * 7,
    (Math.random() - 0.5) * 6
  );
  particle.userData.base = particle.position.clone();
  particleGroup.add(particle);
  particleMeshes.push(particle);
}

device.rotation.set(0.2, -0.9, 0.15);

const state = {
  targetX: 0.2,
  targetY: -0.9,
  currentX: 0.2,
  currentY: -0.9,
  isDragging: false,
  hover: false,
  scrollProgress: 0,
};

const resize = () => {
  const { clientWidth, clientHeight } = host;
  const width = Math.max(clientWidth, 320);
  const height = Math.max(clientHeight, 420);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
};

window.addEventListener('resize', resize);
resize();

window.addEventListener('pointermove', (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  if (!state.isDragging) {
    state.targetY = -0.9 + pointer.x * 0.8;
    state.targetX = 0.2 + pointer.y * 0.5;
  }
});

window.addEventListener('pointerdown', () => {
  state.isDragging = true;
});

window.addEventListener('pointerup', () => {
  state.isDragging = false;
});

window.addEventListener('pointerleave', () => {
  state.isDragging = false;
});

const hero = document.querySelector('.hero');
const updateScroll = () => {
  const vh = window.innerHeight;
  const fullScroll = document.body.scrollHeight - vh;
  const progress = fullScroll > 0 ? Math.min(Math.max(window.scrollY / fullScroll, 0), 1) : 0;
  state.scrollProgress = progress;

  const rect = hero.getBoundingClientRect();
  const hoverStrength = Math.min(Math.max((vh * 0.65 - rect.top) / (vh * 0.8), 0), 1);
  state.hover = hoverStrength > 0.15;
};

window.addEventListener('scroll', updateScroll, { passive: true });
updateScroll();

const updateExplode = () => {
  const explode = Math.min(Math.max((state.scrollProgress - 0.15) / 0.6, 0), 1);
  const ease = 1 - Math.abs(explode - 0.5) * 1.5;

  parts.shell.position.z = parts.shell.userData.basePos.z + explode * 1.7;
  parts.shellTop.position.z = parts.shellTop.userData.basePos.z + explode * 1.4;
  parts.screenFrame.position.z = parts.screenFrame.userData.basePos.z + explode * 1.8;
  parts.screen.position.z = parts.screen.userData.basePos.z + explode * 1.9;
  parts.buttonCluster.position.z = parts.buttonCluster.userData.basePos.z + explode * 1.3;
  parts.buttonCluster.position.x = parts.buttonCluster.userData.basePos.x + explode * 0.5;
  parts.cartridgeBase.position.y = parts.cartridgeBase.userData.basePos.y - explode * 1.8;
  parts.cartridgeBase.position.z = parts.cartridgeBase.userData.basePos.z - explode * 0.8;
  parts.cartridgeTop.position.y = parts.cartridgeTop.userData.basePos.y - explode * 1.6;
  parts.cartridgeAccent.position.y = parts.cartridgeAccent.userData.basePos.y - explode * 1.45;

  const hoverBoost = state.hover ? 1.18 : 1;
  const hoverScale = hoverBoost + explode * 0.18;
  device.scale.setScalar(hoverScale);

  const wobble = 0.25 + Math.sin(state.scrollProgress * Math.PI * 2) * 0.08;
  parts.shell.rotation.z = parts.shell.userData.baseRot.z + explode * 0.6;
  parts.buttonCluster.rotation.x = parts.buttonCluster.userData.baseRot.x + explode * 0.28;
  parts.cartridgeBase.rotation.y = parts.cartridgeBase.userData.baseRot.y + explode * 0.35;
  device.rotation.z = wobble * ease;
};

const animate = () => {
  state.currentX += (state.targetX - state.currentX) * 0.08;
  state.currentY += (state.targetY - state.currentY) * 0.08;
  device.rotation.x = state.currentX;
  device.rotation.y = state.currentY;

  if (state.isDragging) {
    state.targetY += 0.005;
  }

  particleMeshes.forEach((particle, index) => {
    const phase = performance.now() * 0.0012 + index * 0.3;
    const targetX = particle.userData.base.x + pointer.x * 2.5 + Math.sin(phase) * 0.5;
    const targetY = particle.userData.base.y + pointer.y * 1.7 + Math.cos(phase) * 0.4;
    particle.position.x += (targetX - particle.position.x) * 0.04;
    particle.position.y += (targetY - particle.position.y) * 0.04;
    particle.position.z += (particle.userData.base.z + Math.sin(phase * 2) * 0.8 - particle.position.z) * 0.04;
  });

  updateExplode();
  renderer.render(scene, camera);
};

const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach((card) => {
  card.addEventListener('mouseenter', () => {
    featureCards.forEach((item) => item.classList.remove('active'));
    card.classList.add('active');
  });
});

document.querySelector('[data-scroll-target]')?.addEventListener('click', () => {
  const target = document.querySelector('#features');
  target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

renderer.setAnimationLoop(animate);
