import * as THREE from 'three';
import { createMercury } from './planets/mercury';
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
// shows orientation of camera
const axes = new THREE.AxesHelper(20);
scene.add(axes);
const grid = new THREE.GridHelper(100, 100);
scene.add(grid);

// Tracks which direction the camera is moving/facing
const moving = { backward: false, forward: false, left: false, right: false};
const clock = new THREE.Clock(); // Measures time between frames

// Create the cube
const geometry = new THREE.BoxGeometry(); // data for a unit cube
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material); // Creates render
scene.add(cube); 

// Add mercury to scene
const mercury = createMercury(); // Create mercury and add it to the scene
mercury.position.set(10, 0, 0); 

// Create the pivot point (the cube) to have the sphere orbit around
const pivotPoint = new THREE.Object3D();

// Center the pivot point on the cube sp mercury orbits around the cube
pivotPoint.position.copy(cube.position);
scene.add(pivotPoint);

// Add sphere to the pivot point
pivotPoint.add(mercury);

// Simulate sunlight form the cube
const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
sunLight.position.set(0.1,0.1,0.1); 
cube.add(sunLight);
scene.add(sunLight); 

// Where to target the sunlight 
const lightTargeter = new THREE.Object3D();

// Make the light target the pivot point and offset it the same distance
// as mercury
pivotPoint.add(lightTargeter)
lightTargeter.position.set(10, 0, 0);
sunLight.target = lightTargeter;

const orbitSpeed = 1.0; // rad/sec

// Now to animate the cube
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
    // Normalize the vector to make it a unit vector in the right direction
    rightDirection.crossVectors(forwardDirection, wrapper.up).normalize();

    // controls to move the wrapper, changing view based on key presses,
    // updating the position based on the speed and delta time
    // all us vased on forwardDirection and rightDirection vectors
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

    // Rotate the cube 
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    pivotPoint.rotation.y += orbitSpeed * delta; // Rotate the pivot point

    // Render via the camera's pOV
    renderer.render(scene, camera);

}

// Animate!!!
animate();