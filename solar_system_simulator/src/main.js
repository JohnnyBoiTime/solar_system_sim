import * as THREE from 'three';
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
document.body.appendChild(renderer.domElement);

// Camera and its controls
const controls = new PointerLockControls(camera, renderer.domElement);
const wrapper = controls.getObject();
scene.add(wrapper);

// Clicking turns the view
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

    // Get the right-facing vector from the wrappers orientation
    // (upward, forward)
    rightDirection.crossVectors(wrapper.up, forwardDirection).normalize();

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
        wrapper.position.addScaledVector(rightDirection, speed * delta);
    }
    if (moving.right) {
        wrapper.position.addScaledVector(rightDirection, -speed * delta);
    }

    // Rotate the cube 
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Render via the camera's pOV
    renderer.render(scene, camera);

}

// Animate!!!
animate();
