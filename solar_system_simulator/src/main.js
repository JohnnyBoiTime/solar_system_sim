import * as THREE from 'three';
import { createMercury } from './planets/mercury';
import { createVenus } from './planets/venus';
import { createEarth } from './planets/earth';
import { createMars } from './planets/mars';
import { createJupiter } from './planets/jupiter';
import { createSaturn } from './planets/saturn';
import { createUranus } from './planets/uranus';
import { createNeptune } from './planets/neptune';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

// Create the scene and the camera
const scene = new THREE.Scene();

// FOV (degrees), aspect ratio, near and far clipping planes
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// x, y, z position of the camera
camera.position.set(0, 25, 50);

// Vectors to avoid creating new vectors every frame
const forwardDirection = new THREE.Vector3();
const rightDirection = new THREE.Vector3(); 

// Speed (units/sec) for flying around
const speed = 20;

// Draws scene and smooths out the edges
const renderer = new THREE.WebGLRenderer({antialias: true});

// Sets size of canvas and adds it to the window
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding; 
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1; // Brightness of the scene
document.body.appendChild(renderer.domElement);

// Camera and its controls
const controls = new PointerLockControls(camera, renderer.domElement);
const wrapper = controls.getObject();
scene.add(wrapper);

// Clicking the canvas allows the user to look around. When user clicks,
// the cursor is hidden and the camera is locked to the canvas,
// allowing the user to look around
document.body.addEventListener('click', () => controls.lock());

// Events for pressing wasd keys, basic control scheme
function onKeyDown(event) {
    switch (event.code) {
        case 'KeyW':
            moving.forward = true;
            break;
        case 'KeyS':
            moving.backward = true;
            break;
        case 'KeyA':
            moving.left = true;
            break;
        case 'KeyD':
            moving.right = true;
            break;
    }
}

// Events for letting go of wasd keys
function onKeyUp(event) {
    switch (event.code) {
        case 'KeyW':
            moving.forward = false;
            break;
        case 'KeyS':
            moving.backward = false;
            break;
        case 'KeyA':
            moving.left = false;
            break;
        case 'KeyD':
            moving.right = false;
            break;
    }
}

// Resgister events
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);   

// Add a grid to give depth to the scene and 
// shows orientation of camera, 
// helps with placement and stuff
const axes = new THREE.AxesHelper(20); 
scene.add(axes);
const grid = new THREE.GridHelper(1000, 1000);
scene.add(grid);

// Tracks which direction the camera is moving/facing
const moving = { backward: false, forward: false, left: false, right: false};
const clock = new THREE.Clock(); // Measures time between frames

// Create the sun
const geometry = new THREE.SphereGeometry(); // data for a unit sun
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(geometry, material); // Creates render
sun.scale.set(10, 10, 10);
scene.add(sun); 

// Add planets 
const mercury = createMercury(); 
mercury.position.set(20, 0, 0); 

const venus = createVenus(); 
venus.position.set(30, 0, 0);

// 1 AU will be 40 away from the sun to set the scale
// OR 30 squares from edge of sun (position of earth relative to the sun).
// Make sure to scale everything mathematically so the planets are close together,
// So size the sun a good amount and size the planets to be accurate to that as well. 
const earth = createEarth(); 
earth.position.set(40, 0, 0);

const mars = createMars(); 
mars.position.set(50, 0, 0);

const jupiter = createJupiter(); 
jupiter.position.set(60, 0, 0); 

const saturn = createSaturn();
saturn.position.set(70, 0, 0);

const uranus = createUranus();
uranus.position.set(80, 0, 0);

const neptune = createNeptune();
neptune.position.set(90, 0, 0);

// Create the pivot point (the sun) to have the sphere orbit around
const pivotPoint = new THREE.Object3D();

// Center the pivot point on the sun sp mercury orbits around the sun
pivotPoint.position.copy(sun.position);
scene.add(pivotPoint);

// Add all planets to the pivot point (sun)
pivotPoint.add(mercury);
pivotPoint.add(venus);
pivotPoint.add(earth);
pivotPoint.add(mars);
pivotPoint.add(jupiter);
pivotPoint.add(saturn);
pivotPoint.add(uranus);
pivotPoint.add(neptune);

// Simulate sunlight form the sun
const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
sunLight.position.set(0.1,0.1,0.1); 
sun.add(sunLight);
scene.add(sunLight); 

// Where to target the sunlight 
const lightTargeter = new THREE.Object3D();

// Make the light target the pivot point and offset it the same distance
// as mercury
pivotPoint.add(lightTargeter)
lightTargeter.position.set(10, 0, 0);
sunLight.target = lightTargeter;

const orbitSpeed = 1.0; // rad/sec

// Now to animate the sun
function animate() {

    // Request animation frame for smooth rendering
    requestAnimationFrame(animate);

    // Seconds since last frame
    const delta = clock.getDelta(); 

    // Update the rotation of the camera
    controls.update(); 
    
    // Get forward-facing vector from the wrappers orientation
    wrapper.getWorldDirection(forwardDirection);

    // Cross product of the forward direction and the up vector gives us the right direction,
    // Normalized the vector to make it a unit vector in the right direction
    rightDirection.crossVectors(forwardDirection, wrapper.up).normalize();

    // controls to move the wrapper, changing view based on key presses,
    // updating the position based on the speed and delta time
    // all based on forwardDirection and rightDirection vectors
    if (moving.forward) {
        wrapper.position.addScaledVector(forwardDirection, speed * delta);
    }
    if (moving.backward) {
        wrapper.position.addScaledVector(forwardDirection, -speed * delta);
    }
    if (moving.left) {
        wrapper.position.addScaledVector(rightDirection, -speed * delta);
    }
    if (moving.right) {
        wrapper.position.addScaledVector(rightDirection, speed * delta);
    }

    // Rotate the sun 
    sun.rotation.x += 0.01;
    sun.rotation.y += 0.01;

    // Rotate the planets, find a way to get the rotations right later on
    earth.rotation.x += 0.01;
    earth.rotation.y += 0.01;

    mercury.rotation.x += 0.01;
    mercury.rotation.y += 0.01;

    venus.rotation.x += 0.01;
    venus.rotation.y += 0.01;

    mars.rotation.x += 0.01;
    mars.rotation.y += 0.01;

    jupiter.rotation.x += 0.01;
    jupiter.rotation.y += 0.01;

    saturn.planet.rotation.x += 0.01;
    saturn.planet.rotation.y += 0.01;

    uranus.rotation.x += 0.01;
    uranus.rotation.y += 0.01;

    neptune.rotation.x += 0.01;
    neptune.rotation.y += 0.01;

    pivotPoint.rotation.y += orbitSpeed * delta; // Rotate the pivot point

    // Render via the camera's pOV
    renderer.render(scene, camera);

}

// Animate!!!
animate();