import * as THREE from 'three';
import { TextureLoader, EquirectangularReflectionMapping } from 'three';
import galaxyTexture from './textures/MilkyWayGalaxy.jpg';
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

// Add milky way galaxy background
new TextureLoader().load(galaxyTexture, (texture) => {
    texture.mapping = EquirectangularReflectionMapping;
    scene.background = texture;
});

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
renderer.toneMappingExposure = 0.25; // Brightness of the scene
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

// Planets
const planets = {
    mercury: createMercury(),
    venus: createVenus(),
    earth: createEarth(),
    mars: createMars(),
    jupiter: createJupiter(),
    saturn: createSaturn(),
    uranus: createUranus(),
    neptune: createNeptune()
};

// Distance of planets from sun
const distanceFromSun = {
    mercury: 20,
    venus: 30,
    earth: 40,
    mars: 50,
    jupiter: 60,
    saturn: 70,
    uranus: 80,
    neptune: 90
};

// Speed of each planet is relative to earths speed (3 sig figs).
// Formula: speed of planet / speed of earth
const orbitalSpeedOfPlanets = {
    mercury: 1.99,
    venus: 1.18,
    earth: 1,
    mars: 0.81,
    jupiter: 0.44,
    saturn: 0.33,
    uranus: 0.22,
    neptune: 0.18
}

// Sunlight!
const sunLight = new THREE.PointLight(0xffffff, 4, 200, 0);
 
sun.add(sunLight);
sunLight.position.set(0, 0, 0);

 Object.values(planets).forEach((planet) => {
    planet.castShadow = true; // Allow planets to cast shadows
    planet.receiveShadow = true; // Allow planets to receive shadows
 });

 // Create the orbits of the planets and add them to the scene
const orbitsOfPlanets = Object.entries(planets).map(([planet, mesh]) => {
    const distance = distanceFromSun[planet];
    const speed = orbitalSpeedOfPlanets[planet];
    const startingPosition = Math.random() * Math.PI * 2;
    mesh.position.set(distance * Math.cos(startingPosition), 0, distance * Math.sin(startingPosition)); 

    // Create the pivot point (the sun) to have the sphere orbit around
    const pivotPoint = new THREE.Object3D();

    // Center the pivot point on the sun sp mercury orbits around the sun
    pivotPoint.position.copy(sun.position);
    scene.add(pivotPoint);

    pivotPoint.add(mesh); 

    return {pivotPoint, speed};

});

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

    orbitsOfPlanets.forEach(({pivotPoint, speed}) => {
        pivotPoint.rotation.y += speed * delta;
    });

    // Rotate the sun 
    sun.rotation.x += 0.01;
    sun.rotation.y += 0.01;

    /*
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

    */
    // Render via the camera's pOV
    renderer.render(scene, camera);

}

// Animate!!!
animate();