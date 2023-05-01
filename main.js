import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//scena
const scene = new THREE.Scene();

//camara
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//elemento del dom q renderizara
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);

renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(30);

renderer.render(scene, camera);

//geometria
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);

//material
const material = new THREE.MeshStandardMaterial({
  color: 0xff6347,
});

//mesh=geometry + material
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

//luces

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

//controles
const controls = new OrbitControls(camera, renderer.domElement);

//añadiendo estrellas
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// //texturas: fondo
// const spaceTexture = new THREE.TextureLoader().load("./images/space.jpg");
// scene.background = spaceTexture;

//textura individuales
const jeffTexture = new THREE.TextureLoader().load("./images/jeff.png");
const jeff = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: jeffTexture })
);

scene.add(jeff);

//textura individual de luna
const moonTexture = new THREE.TextureLoader().load("./images/moon.jpg");
const normalTexture = new THREE.TextureLoader().load("./images/normal.jpg");
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

moon.position.z = 30;
//otra forma de posicionar usando setX
moon.position.setX(-10);

scene.add(moon);

//moveCamera
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  jeff.rotation.y += 0.01;
  jeff.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

//animacion: game loop
function animate() {
  requestAnimationFrame(animate);

  //aqui le damos la rotacion
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();
