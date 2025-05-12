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
import { createOrbitPathsOfPlanets } from './planets/orbitsOfPlanets';
import { spawnPlanets } from './features/placePlanet';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

// Create the scene and the camera
const scene = new THREE.Scene();

// Add milky way galaxy background
new TextureLoader().load(galaxyTexture, (texture) => {
    texture.mapping = EquirectangularReflectionMapping;
    scene.background = texture;
});

// FOV (degrees), aspect ratio, near and far clipping planes
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);

// x, y, z position of the camera
camera.position.set(10, 100, 500);

// Vectors to avoid creating new vectors every frame
const forwardDirection = new THREE.Vector3();
const rightDirection = new THREE.Vector3(); 

// Speed (units/sec) for flying around
const speed = 500;

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

// Events for pressing wasd keys, basic control scheme
function onKeyDown(event) {
    switch (event.code) {
        case 'KeyP':
            controls.unlock();
            if (!controls.unlock()) {
                controls.lock();
            }
            break;
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

/*
// Add a grid to give depth to the scene and 
// shows orientation of camera, 
// helps with placement and stuff
const axes = new THREE.AxesHelper(500); 
scene.add(axes);
const grid = new THREE.GridHelper(10000, 20);
scene.add(grid);

*/

// Tracks which direction the camera is moving/facing
const moving = { backward: false, forward: false, left: false, right: false};
const clock = new THREE.Clock(); // Measures time between frames

// Create the sun
const geometry = new THREE.SphereGeometry(); // data for a unit sun
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(geometry, material); // Creates render
sun.scale.set(109.17, 109.17, 109.17);
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

// Distance of planets from sun (current radius of sun + distance in km)
// from sun found on google, gross way to do it but it works
const distanceFromSun = {
    mercury: 166.91,
    venus: 189.21,
    earth: 263.17,
    mars: 336,
    jupiter: 887,
    saturn: 1539,
    uranus: 2979,
    neptune: 4609
};

// Speed of each planet is relative to earths speed (3 sig figs).
// Formula: speed of planet / speed of earth (km/s)
const orbitalSpeedOfPlanets = {
    mercury: 1.99,
    venus: 1.18,
    earth: 1, // 29.78 km/s
    mars: 0.81,
    jupiter: 0.44,
    saturn: 0.33,
    uranus: 0.22,
    neptune: 0.18
}

// Scale the planets in relation to the radius of earth (km)
const sizeOfthePlanets = {
    mercury: 0.4,
    venus: 0.95,
    earth: 1, // 6378 km
    mars: 0.53,
    jupiter: 11.2,
    saturn: 9.13,
    uranus: 4,
    neptune: 3.86
}

// Calculate the eccentricity of each planet
const eccentricityOfPlanets = {
    mercury: 0.2056,
    venus: 0.0068,
    earth: 0.0167,
    mars: 0.0934,
    jupiter: 0.0489,
    saturn: 0.0565,
    uranus: 0.0463,
    neptune: 0.0097
};

// Semi-major axis of each planet (just distance form sun)
const semiMajorAxisOfPlanets = {
    mercury: distanceFromSun.mercury,
    venus: distanceFromSun.venus,
    earth: distanceFromSun.earth,
    mars: distanceFromSun.mars,
    jupiter: distanceFromSun.jupiter,
    saturn: distanceFromSun.saturn,
    uranus: distanceFromSun.uranus,
    neptune: distanceFromSun.neptune
};

// Inclination of each planet (degrees)
const inclinationOfPlanets = {
    mercury: 7.0,
    venus: 3.39,
    earth: 0,
    mars: 1.85,
    jupiter: 1.3,
    saturn: 2.49,
    uranus: 0.77,
    neptune: 1.77
};

const perhelionOfPlanets = {
    mercury: 29.12,
    venus: 54.88,
    earth: 114.21,
    mars: 286.50,
    jupiter: 273.66,
    saturn: 339.39,
    uranus: 96.99,
    neptune: 273.187
}

// Sets scales of planets based on the size of earth!
planets.mercury.scale.set(sizeOfthePlanets.mercury, sizeOfthePlanets.mercury, sizeOfthePlanets.mercury);
planets.venus.scale.set(sizeOfthePlanets.venus, sizeOfthePlanets.venus, sizeOfthePlanets.venus);
planets.earth.scale.set(sizeOfthePlanets.earth, sizeOfthePlanets.earth, sizeOfthePlanets.earth);
planets.mars.scale.set(sizeOfthePlanets.mars, sizeOfthePlanets.mars, sizeOfthePlanets.mars);
planets.jupiter.scale.set(sizeOfthePlanets.jupiter, sizeOfthePlanets.jupiter, sizeOfthePlanets.jupiter);
planets.saturn.scale.set(sizeOfthePlanets.saturn, sizeOfthePlanets.saturn, sizeOfthePlanets.saturn);
planets.uranus.scale.set(sizeOfthePlanets.uranus, sizeOfthePlanets.uranus, sizeOfthePlanets.uranus);
planets.neptune.scale.set(sizeOfthePlanets.neptune, sizeOfthePlanets.neptune, sizeOfthePlanets.neptune);


// Sunlight!
const sunLight = new THREE.PointLight(0xffffff, 4, 0, 0);
 
sun.add(sunLight);
sunLight.position.set(0, 0, 0);

 Object.values(planets).forEach((planet) => {
    planet.castShadow = true; // Allow planets to cast shadows
    planet.receiveShadow = true; // Allow planets to receive shadows
 });

 // Create the orbits of the planets and add them to the scene
const orbitsOfPlanets = Object.entries(planets).map(([planet, mesh]) => {
    
    // Set distance and orbits
    const distance = semiMajorAxisOfPlanets[planet];
    const eccentricity = eccentricityOfPlanets[planet];
    const inclination = THREE.MathUtils.degToRad(inclinationOfPlanets[planet]);
    const perhelion = THREE.MathUtils.degToRad(perhelionOfPlanets[planet]);
    const b = distance * Math.sqrt(1 - eccentricity * eccentricity); // Semi-minor axis
    const changingXAxis = -distance * eccentricity; 
    const phase = Math.random(); 

    const orbitalPath = new THREE.EllipseCurve(
        changingXAxis, 0, // Center of ellipse at axis origin (0,0)
        distance, b,   // x and y radius of ellipse
        0, 2 * Math.PI, // starting and ending angles of ellipse
        false, // false = clockwise, true = counter-clockwise
        0 // rotation of ellipse in radians
    );

    // Draw orbit line
    const orbitLine = createOrbitPathsOfPlanets(distance, eccentricity, 256, 0x8888ff); // Create the orbit line
    orbitLine.rotation.x = inclination; 
    orbitLine.rotation.y = perhelion; 

    // Speed of each planet
    const speed = orbitalSpeedOfPlanets[planet];

    orbitLine.position.copy(sun.position); 
    // Center the pivot point on the sun sp mercury orbits around the sun
    scene.add(orbitLine);
    scene.add(mesh); // Add the planet to the scene

    return { mesh, orbitalPath, inclination, phase, perhelion, speed};

});


spawnPlanets(scene, camera, renderer);


// Now to animate the scene
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

    // Rotate planets around the sun
    orbitsOfPlanets.forEach(orbit => {
        // Advance the phase of the orbit based on speed and delta time
        orbit.phase = (orbit.phase + orbit.speed * delta) % 1;

        const pointIn2D = orbit.orbitalPath.getPoint(orbit.phase);
        const pointIn3D = new THREE.Vector3(pointIn2D.x, 0, pointIn2D.y)
            .applyAxisAngle(new THREE.Vector3(1, 0, 0), orbit.inclination) // Rotate around the y-axis
            .applyAxisAngle(new THREE.Vector3(0, 1, 0), orbit.perhelion)
            .add(sun.position);
        
            // Copy the rotation
            orbit.mesh.position.copy(pointIn3D); 
    });

    // Rotate the sun 
    sun.rotation.x += 0.01;
    sun.rotation.y += 0.01;

    // Render via the camera's pOV
    renderer.render(scene, camera);

}

// Animate!!!
animate();