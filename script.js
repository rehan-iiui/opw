// ============================================================
// OPEN WORLD 3D
// PHASE 1 - THIRD PERSON PROTOTYPE
// ============================================================

let scene;
let camera;
let renderer;
let clock;

let player;
let playerVelocityY = 0;

let gameStarted = false;
let isGrounded = true;

const keys = {};

let cameraYaw = 0;
let cameraPitch = 0.22;

const playerSpeed = 7;
const gravity = 20;
const jumpPower = 8;

let cameraDistance = 7;

const loadingScreen = document.getElementById("loadingScreen");
const loadingProgress = document.getElementById("loadingProgress");
const loadingText = document.getElementById("loadingText");

const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");

const speedValue = document.getElementById("speedValue");


// ============================================================
// STARTUP
// ============================================================

window.addEventListener("load", () => {

  fakeLoading();

});


function fakeLoading() {

  let progress = 0;

  const interval = setInterval(() => {

    progress += Math.random() * 15;

    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);

      loadingText.textContent = "World ready";

      setTimeout(() => {
        loadingScreen.classList.add("hidden");
      }, 500);
    }

    loadingProgress.style.width = progress + "%";

  }, 120);

}


// ============================================================
// INITIALIZE GAME
// ============================================================

function init() {

  scene = new THREE.Scene();

  scene.background = new THREE.Color(0x87b8d8);

  scene.fog = new THREE.Fog(
    0x87b8d8,
    40,
    250
  );


  clock = new THREE.Clock();


  // ==========================================================
  // CAMERA
  // ==========================================================

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );


  // ==========================================================
  // RENDERER
  // ==========================================================

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
  );

  renderer.shadowMap.enabled = true;

  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  document.body.appendChild(renderer.domElement);


  // ==========================================================
  // LIGHTING
  // ==========================================================

  const skyLight = new THREE.HemisphereLight(
    0xbfdfff,
    0x46534a,
    1.5
  );

  scene.add(skyLight);


  const sun = new THREE.DirectionalLight(
    0xffffff,
    2
  );

  sun.position.set(
    50,
    80,
    30
  );

  sun.castShadow = true;

  sun.shadow.mapSize.width = 2048;
  sun.shadow.mapSize.height = 2048;

  sun.shadow.camera.left = -100;
  sun.shadow.camera.right = 100;
  sun.shadow.camera.top = 100;
  sun.shadow.camera.bottom = -100;

  scene.add(sun);


  // ==========================================================
  // WORLD
  // ==========================================================

  createGround();

  createRoads();

  createBuildings();

  createTrees();

  createStreetLights();


  // ==========================================================
  // PLAYER
  // ==========================================================

  createPlayer();


  // ==========================================================
  // EVENTS
  // ==========================================================

  window.addEventListener(
    "resize",
    onWindowResize
  );

  document.addEventListener(
    "keydown",
    onKeyDown
  );

  document.addEventListener(
    "keyup",
    onKeyUp
  );

  document.addEventListener(
    "mousemove",
    onMouseMove
  );

  document.addEventListener(
    "wheel",
    onMouseWheel,
    { passive: true }
  );


  startButton.addEventListener(
    "click",
    startGame
  );


  animate();

}


// ============================================================
// GROUND
// ============================================================

function createGround() {

  const geometry = new THREE.PlaneGeometry(
    500,
    500
  );

  const material = new THREE.MeshStandardMaterial({
    color: 0x4e7545,
    roughness: 1
  });

  const ground = new THREE.Mesh(
    geometry,
    material
  );

  ground.rotation.x = -Math.PI / 2;

  ground.receiveShadow = true;

  scene.add(ground);

}


// ============================================================
// ROADS
// ============================================================

function createRoads() {

  createRoad(
    0,
    0,
    500,
    18,
    0
  );

  createRoad(
    0,
    0,
    18,
    500,
    0
  );

  createRoad(
    0,
    80,
    500,
    12,
    0
  );

  createRoad(
    80,
    0,
    12,
    500,
    0
  );

}


function createRoad(
  x,
  z,
  width,
  depth,
  rotation
) {

  const geometry =
    new THREE.BoxGeometry(
      width,
      0.08,
      depth
    );

  const material =
    new THREE.MeshStandardMaterial({
      color: 0x292d31,
      roughness: 0.9
    });

  const road =
    new THREE.Mesh(
      geometry,
      material
    );

  road.position.set(
    x,
    0.04,
    z
  );

  road.rotation.y = rotation;

  road.receiveShadow = true;

  scene.add(road);

}


// ============================================================
// BUILDINGS
// ============================================================

function createBuildings() {

  const positions = [

    [-35, -35],
    [35, -35],
    [-35, 35],
    [35, 35],

    [-65, -45],
    [65, -45],
    [-65, 45],
    [65, 45],

    [-105, -30],
    [105, -30],
    [-105, 30],
    [105, 30]

  ];


  positions.forEach((position, index) => {

    const height =
      8 + Math.random() * 15;

    const width =
      10 + Math.random() * 8;

    const depth =
      10 + Math.random() * 8;

    createBuilding(
      position[0],
      position[1],
      width,
      height,
      depth,
      index
    );

  });

}


function createBuilding(
  x,
  z,
  width,
  height,
  depth,
  index
) {

  const colors = [
    0x737a82,
    0x8b7565,
    0x626d76,
    0x806f64,
    0x6e7678
  ];

  const geometry =
    new THREE.BoxGeometry(
      width,
      height,
      depth
    );

  const material =
    new THREE.MeshStandardMaterial({
      color: colors[index % colors.length],
      roughness: 0.8
    });

  const building =
    new THREE.Mesh(
      geometry,
      material
    );

  building.position.set(
    x,
    height / 2,
    z
  );

  building.castShadow = true;
  building.receiveShadow = true;

  scene.add(building);


  // Roof

  const roofGeometry =
    new THREE.BoxGeometry(
      width + 0.5,
      0.4,
      depth + 0.5
    );

  const roofMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x30343a
    });

  const roof =
    new THREE.Mesh(
      roofGeometry,
      roofMaterial
    );

  roof.position.set(
    x,
    height + 0.2,
    z
  );

  roof.castShadow = true;

  scene.add(roof);


  // Windows

  const windowMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x9ed7e8,
      emissive: 0x16282d,
      roughness: 0.25
    });


  for (
    let floor = 1;
    floor < Math.floor(height / 3);
    floor++
  ) {

    for (
      let side = -1;
      side <= 1;
      side += 2
    ) {

      const windowGeometry =
        new THREE.BoxGeometry(
          1.4,
          1.2,
          0.12
        );

      const window =
        new THREE.Mesh(
          windowGeometry,
          windowMaterial
        );

      window.position.set(
        x + side * (width / 2 + 0.06),
        floor * 3,
        z
      );

      scene.add(window);

    }

  }

}


// ============================================================
// TREES
// ============================================================

function createTrees() {

  const treePositions = [

    [-20, -60],
    [20, -60],
    [-20, 60],
    [20, 60],

    [-55, -75],
    [55, -75],
    [-55, 75],
    [55, 75],

    [-120, -70],
    [120, -70],
    [-120, 70],
    [120, 70]

  ];


  treePositions.forEach(position => {

    createTree(
      position[0],
      position[1]
    );

  });

}


function createTree(x, z) {

  const trunkGeometry =
    new THREE.CylinderGeometry(
      0.45,
      0.6,
      4,
      8
    );

  const trunkMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x68452b
    });

  const trunk =
    new THREE.Mesh(
      trunkGeometry,
      trunkMaterial
    );

  trunk.position.set(
    x,
    2,
    z
  );

  trunk.castShadow = true;

  scene.add(trunk);


  const leavesGeometry =
    new THREE.SphereGeometry(
      2.5,
      12,
      12
    );

  const leavesMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x2d7038
    });

  const leaves =
    new THREE.Mesh(
      leavesGeometry,
      leavesMaterial
    );

  leaves.position.set(
    x,
    5.2,
    z
  );

  leaves.castShadow = true;

  scene.add(leaves);

}


// ============================================================
// STREET LIGHTS
// ============================================================

function createStreetLights() {

  const positions = [

    [-9, -40],
    [9, -40],
    [-9, 40],
    [9, 40],

    [-40, -9],
    [-40, 9],
    [40, -9],
    [40, 9]

  ];


  positions.forEach(position => {

    const poleGeometry =
      new THREE.CylinderGeometry(
        0.12,
        0.12,
        5,
        8
      );

    const poleMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x25282c
      });

    const pole =
      new THREE.Mesh(
        poleGeometry,
        poleMaterial
      );

    pole.position.set(
      position[0],
      2.5,
      position[1]
    );

    pole.castShadow = true;

    scene.add(pole);


    const lampGeometry =
      new THREE.SphereGeometry(
        0.35,
        10,
        10
      );

    const lampMaterial =
      new THREE.MeshStandardMaterial({
        color: 0xffffcc,
        emissive: 0xffff88,
        emissiveIntensity: 0.8
      });

    const lamp =
      new THREE.Mesh(
        lampGeometry,
        lampMaterial
      );

    lamp.position.set(
      position[0],
      5.1,
      position[1]
    );

    scene.add(lamp);

  });

}


// ============================================================
// PLAYER
// ============================================================

function createPlayer() {

  player =
    new THREE.Group();


  // Body

  const bodyGeometry =
    new THREE.BoxGeometry(
      1.1,
      1.6,
      0.65
    );

  const bodyMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x263b75
    });

  const body =
    new THREE.Mesh(
      bodyGeometry,
      bodyMaterial
    );

  body.position.y = 1.8;

  body.castShadow = true;

  player.add(body);


  // Head

  const headGeometry =
    new THREE.SphereGeometry(
      0.48,
      24,
      24
    );

  const skinMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xc98e68,
      roughness: 0.8
    });

  const head =
    new THREE.Mesh(
      headGeometry,
      skinMaterial
    );

  head.position.y = 3.0;

  head.castShadow = true;

  player.add(head);


  // Hair

  const hairGeometry =
    new THREE.SphereGeometry(
      0.5,
      20,
      12,
      0,
      Math.PI * 2,
      0,
      Math.PI / 2
    );

  const hairMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x171717
    });

  const hair =
    new THREE.Mesh(
      hairGeometry,
      hairMaterial
    );

  hair.position.y = 3.15;

  hair.castShadow = true;

  player.add(hair);


  // Left arm

  createLimb(
    -0.72,
    1.85,
    0.25,
    1.45,
    0x263b75
  );


  // Right arm

  createLimb(
    0.72,
    1.85,
    0.25,
    1.45,
    0x263b75
  );


  // Left leg

  createLimb(
    -0.32,
    0.55,
    0.3,
    1.3,
    0x20252d
  );


  // Right leg

  createLimb(
    0.32,
    0.55,
    0.3,
    1.3,
    0x20252d
  );


  // Position

  player.position.set(
    0,
    0,
    15
  );


  scene.add(player);

}


function createLimb(
  x,
  y,
  width,
  height,
  color
) {

  const geometry =
    new THREE.BoxGeometry(
      width,
      height,
      width
    );

  const material =
    new THREE.MeshStandardMaterial({
      color: color
    });

  const limb =
    new THREE.Mesh(
      geometry,
      material
    );

  limb.position.set(
    x,
    y,
    0
  );

  limb.castShadow = true;

  player.add(limb);

}


// ============================================================
// START GAME
// ============================================================

function startGame() {

  gameStarted = true;

  startScreen.classList.add("hidden");

  renderer.domElement.requestPointerLock();

}


// ============================================================
// KEYBOARD
// ============================================================

function onKeyDown(event) {

  keys[event.code] = true;


  if (
    event.code === "Space" &&
    isGrounded &&
    gameStarted
  ) {

    playerVelocityY = jumpPower;

    isGrounded = false;

  }

}


function onKeyUp(event) {

  keys[event.code] = false;

}


// ============================================================
// MOUSE CAMERA
// ============================================================

function onMouseMove(event) {

  if (
    !gameStarted ||
    document.pointerLockElement !== renderer.domElement
  ) {
    return;
  }


  cameraYaw -= event.movementX * 0.0025;

  cameraPitch -= event.movementY * 0.002;

  cameraPitch =
    Math.max(
      -0.15,
      Math.min(0.65, cameraPitch)
    );

}


// ============================================================
// CAMERA ZOOM
// ============================================================

function onMouseWheel(event) {

  if (!gameStarted) {
    return;
  }

  cameraDistance += event.deltaY * 0.01;

  cameraDistance =
    Math.max(
      4,
      Math.min(12, cameraDistance)
    );

}


// ============================================================
// PLAYER MOVEMENT
// ============================================================

function updatePlayer(delta) {

  if (!gameStarted) {
    return;
  }


  const movement =
    new THREE.Vector3();


  if (keys["KeyW"]) {
    movement.z -= 1;
  }

  if (keys["KeyS"]) {
    movement.z += 1;
  }

  if (keys["KeyA"]) {
    movement.x -= 1;
  }

  if (keys["KeyD"]) {
    movement.x += 1;
  }


  if (movement.length() > 0) {

    movement.normalize();


    // Move relative to camera direction

    const forward =
      new THREE.Vector3(
        -Math.sin(cameraYaw),
        0,
        -Math.cos(cameraYaw)
      );

    const right =
      new THREE.Vector3(
        Math.cos(cameraYaw),
        0,
        -Math.sin(cameraYaw)
      );


    const direction =
      new THREE.Vector3();


    direction.addScaledVector(
      forward,
      -movement.z
    );

    direction.addScaledVector(
      right,
      movement.x
    );


    direction.normalize();


    player.position.addScaledVector(
      direction,
      playerSpeed * delta
    );


    // Rotate character toward movement

    const targetRotation =
      Math.atan2(
        direction.x,
        direction.z
      );


    player.rotation.y =
      smoothAngle(
        player.rotation.y,
        targetRotation,
        10 * delta
      );

  }


  // Gravity

  playerVelocityY -=
    gravity * delta;


  player.position.y +=
    playerVelocityY * delta;


  if (player.position.y <= 0) {

    player.position.y = 0;

    playerVelocityY = 0;

    isGrounded = true;

  }


  // Keep player inside world

  player.position.x =
    THREE.MathUtils.clamp(
      player.position.x,
      -220,
      220
    );

  player.position.z =
    THREE.MathUtils.clamp(
      player.position.z,
      -220,
      220
    );


  const currentSpeed =
    movement.length() > 0
      ? playerSpeed
      : 0;


  speedValue.textContent =
    Math.round(currentSpeed * 10);

}


function smoothAngle(
  current,
  target,
  amount
) {

  let difference =
    target - current;


  while (difference > Math.PI) {
    difference -= Math.PI * 2;
  }


  while (difference < -Math.PI) {
    difference += Math.PI * 2;
  }


  return current + difference * amount;

}


// ============================================================
// THIRD-PERSON CAMERA
// ============================================================

function updateCamera() {

  if (!player) {
    return;
  }


  const target =
    new THREE.Vector3(
      player.position.x,
      player.position.y + 2.0,
      player.position.z
    );


  const horizontalDistance =
    cameraDistance *
    Math.cos(cameraPitch);


  const verticalDistance =
    cameraDistance *
    Math.sin(cameraPitch);


  const cameraX =
    target.x +
    Math.sin(cameraYaw) *
    horizontalDistance;


  const cameraZ =
    target.z +
    Math.cos(cameraYaw) *
    horizontalDistance;


  const cameraY =
    target.y +
    verticalDistance;


  const desiredPosition =
    new THREE.Vector3(
      cameraX,
      cameraY,
      cameraZ
    );


  // Smooth camera

  camera.position.lerp(
    desiredPosition,
    0.12
  );


  camera.lookAt(target);

}


// ============================================================
// WINDOW RESIZE
// ============================================================

function onWindowResize() {

  camera.aspect =
    window.innerWidth /
    window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

}


// ============================================================
// MAIN LOOP
// ============================================================

function animate() {

  requestAnimationFrame(
    animate
  );


  const delta =
    Math.min(
      clock.getDelta(),
      0.05
    );


  updatePlayer(delta);

  updateCamera();

  renderer.render(
    scene,
    camera
  );

}


// ============================================================
// ESCAPE
// ============================================================

document.addEventListener(
  "pointerlockchange",
  () => {

    if (
      document.pointerLockElement !==
      renderer.domElement
    ) {

      if (gameStarted) {
        // Mouse released.
        // Click the game to capture it again.
      }

    }

  }
);


// ============================================================
// RUN
// ============================================================

init();
