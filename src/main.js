import * as THREE from "three";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9bd7f2);
scene.fog = new THREE.Fog(0x9bd7f2, 9, 22);

const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 2.8, 8);
camera.lookAt(0, 1.2, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(1);
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff, 0x6c8ca0, 2.0));
const sun = new THREE.DirectionalLight(0xffffff, 3);
sun.position.set(-4, 8, 5);
sun.castShadow = true;
scene.add(sun);

const mat = color => new THREE.MeshToonMaterial({ color });
const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), mat(0x75bd68));
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.02;
ground.receiveShadow = true;
scene.add(ground);

const platform = new THREE.Mesh(new THREE.CylinderGeometry(2.7, 2.9, 0.28, 48), mat(0xe9c77c));
platform.position.y = 0.12;
platform.castShadow = true;
platform.receiveShadow = true;
scene.add(platform);

const character = new THREE.Group();
scene.add(character);

const body = new THREE.Mesh(new THREE.SphereGeometry(0.78, 32, 24), mat(0xff9b42));
body.scale.set(0.82, 1.05, 0.62);
body.position.y = 1.25;
body.castShadow = true;
character.add(body);

const head = new THREE.Mesh(new THREE.SphereGeometry(0.58, 32, 24), mat(0xffd2a1));
head.position.set(0, 2.15, 0.05);
head.castShadow = true;
character.add(head);

const eyeMat = new THREE.MeshBasicMaterial({ color: 0x20202a });
for (const x of [-0.2, 0.2]) {
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), eyeMat);
  eye.position.set(x, 2.2, 0.56);
  character.add(eye);
}
const smile = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.025, 8, 24, Math.PI), new THREE.MeshBasicMaterial({ color: 0x7b3434 }));
smile.position.set(0, 2.02, 0.57);
smile.rotation.z = Math.PI;
character.add(smile);

const armMat = mat(0xffd2a1);
const arms = [];
for (const side of [-1, 1]) {
  const pivot = new THREE.Group();
  pivot.position.set(side * 0.62, 1.65, 0);
  const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.52, 4, 12), armMat);
  arm.position.y = -0.28;
  arm.castShadow = true;
  pivot.add(arm);
  character.add(pivot);
  arms.push(pivot);
}
for (const side of [-1, 1]) {
  const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.38, 4, 12), mat(0x315c9b));
  leg.position.set(side * 0.25, 0.45, 0);
  leg.castShadow = true;
  character.add(leg);
}

const tree = new THREE.Group();
const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 1.7, 12), mat(0x8a5636));
trunk.position.y = 0.85;
trunk.castShadow = true;
tree.add(trunk);
const leaves = new THREE.Mesh(new THREE.SphereGeometry(0.85, 16, 12), mat(0x2f9c59));
leaves.position.y = 2;
leaves.castShadow = true;
tree.add(leaves);
tree.position.set(2.5, 0, -1.5);
scene.add(tree);

const cloudMat = new THREE.MeshToonMaterial({ color: 0xffffff });
for (const [x, y, z] of [[-2.8,4,-3], [1,4.5,-5], [3.4,3.8,-4]]) {
  const cloud = new THREE.Group();
  for (const [dx,dy,s] of [[0,0,0.55],[0.45,0.05,0.42],[-0.4,0.02,0.4]]) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(s, 16, 12), cloudMat);
    puff.position.set(dx,dy,0);
    cloud.add(puff);
  }
  cloud.position.set(x,y,z);
  scene.add(cloud);
}

window.renderAt = (t) => {
  character.position.y = 0.08 + Math.abs(Math.sin(t * 3.2)) * 0.16;
  character.rotation.y = Math.sin(t * 0.8) * 0.18;
  head.rotation.z = Math.sin(t * 2.1) * 0.06;
  arms[0].rotation.z = Math.sin(t * 3.2) * 0.55 - 0.2;
  arms[1].rotation.z = -Math.sin(t * 3.2) * 0.55 + 0.2;
  tree.rotation.y = Math.sin(t * 0.35) * 0.04;
  camera.position.x = Math.sin(t * 0.25) * 0.25;
  camera.lookAt(0, 1.35, 0);
  renderer.render(scene, camera);
};
window.renderAt(0);

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
