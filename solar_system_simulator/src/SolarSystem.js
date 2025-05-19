import * as THREE from 'three';
import { TextureLoader, EquirectangularReflectionMapping } from 'three';
import { gravitationalPull } from './features/gravity';
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
import ParticleSystem from './features/ParticleSystem';
import { handleCollisions } from './features/collisions';

export default class SolarSystem {

    // Create everything
    constructor(scene, camera, domElement, controls) {
        this.scene = scene;
        this.camera = camera;
        this.domElement = domElement;
        this.control = controls;
        this.sizeOfPlanetsMultiplier = 1.0;
        this._ChangeSizeOfPlanets();
        this._Initialize();

        this.collisionExplosion = new ParticleSystem({
            parent: this.scene,
            camera: this.camera
        });
    }

    // Thing to change the size of the spawned planets
    _ChangeSizeOfPlanets() {
        this.planetSizeSlider = document.getElementById('planetSizeSlider');
        this.sizeOfPlanetValue = document.getElementById('sizeOfPlanet');

        this.planetSizeSlider.addEventListener('input', e => {
            this.sizeOfPlanetsMultiplier = parseFloat(e.target.value);
            this.sizeOfPlanetValue.textContent = this.sizeOfPlanetsMultiplier.toFixed(1) + 'x';
    })
    }

    // Create the solar system
    _Initialize() {

        // Load textures for all planets
        new TextureLoader().load(galaxyTexture, (texture) => {
            texture.mapping = EquirectangularReflectionMapping;
            this.scene.background = texture;
        });

        // Create the sun
        const sunGeometry = new THREE.SphereGeometry();
        const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00});
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.sun.scale.set(109.17, 109.17, 109.17);
        this.scene.add(this.sun);
        this.sunLight = new THREE.PointLight(0xffffff, 4, 0, 0);
        this.sun.add(this.sunLight);

        // All planets and their parameters
        this.planetData = {
            mercury: { distance: 166.91, speed: 1.99,   size: 0.4,  eccentricity: 0.2056, inclination: 7.0,  perhelion: 29.12  },
            venus:   { distance: 189.21, speed: 1.18,   size: 0.95, eccentricity: 0.0068, inclination: 3.39, perhelion: 54.88  },
            earth:   { distance: 263.17, speed: 1.0,    size: 1.0,  eccentricity: 0.0167, inclination: 0.0,  perhelion: 114.21 },
            mars:    { distance: 336.0,  speed: 0.81,   size: 0.53, eccentricity: 0.0934, inclination: 1.85, perhelion: 286.50 },
            jupiter: { distance: 887.0,  speed: 0.44,   size: 11.2, eccentricity: 0.0489, inclination: 1.30, perhelion: 273.66 },
            saturn:  { distance: 1539.0, speed: 0.33,   size: 9.13, eccentricity: 0.0565, inclination: 2.49, perhelion: 339.39 },
            uranus:  { distance: 2979.0, speed: 0.22,   size: 4.0,  eccentricity: 0.0463, inclination: 0.77, perhelion: 96.99  },
            neptune: { distance: 4609.0, speed: 0.18,   size: 3.86, eccentricity: 0.0097, inclination: 1.77, perhelion: 273.187 }
        };

        // Build the planet array
        this.planets = {};
        for (const [name, data] of Object.entries(this.planetData)) {
            const createPlanets = {
                mercury: createMercury,
                venus: createVenus,
                earth: createEarth,
                mars: createMars,
                jupiter: createJupiter,
                saturn: createSaturn,
                uranus: createUranus,
                neptune: createNeptune
            }[name];

            const mesh = createPlanets();
            mesh.scale.set(data.size, data.size, data.size);
            mesh.castShadow = true;
            mesh.recieveShadow = true;
            this.scene.add(mesh);
            this.planets[name] = mesh;
        }

        // Build the orbit array
        this.orbits = [];
        for (const [name, data] of Object.entries(this.planetData)) {

            // Formula for accurate orbits
            const bAxis = data.distance * Math.sqrt(1 - data.eccentricity * data.eccentricity);
            const orbitalPath = new THREE.EllipseCurve(
                -data.distance * data.eccentricity, 0,
                data.distance, bAxis, 0, 2 * Math.PI, 
                false, 0
            );

            const orbitLine = createOrbitPathsOfPlanets(
                data.distance,
                data.eccentricity,
                256,
                0x8888ff
            );

            orbitLine.rotation.x = THREE.MathUtils.degToRad(data.inclination);
            orbitLine.rotation.y = THREE.MathUtils.degToRad(data.perhelion);
            orbitLine.position.copy(this.sun.position);
            this.scene.add(orbitLine);

            this.orbits.push({
                mesh: this.planets[name],
                orbitalPath,
                inclination: THREE.MathUtils.degToRad(data.inclination),
                phase: Math.random(),
                perhelion: THREE.MathUtils.degToRad(data.perhelion),
                speed: data.speed
            });
        }

        // Store all spawned planets to be used in collisions and various other 
        // interactions
        this.spawnedPlanets = [];

        // pass in this.sizeOfPlanetMultiplier as a function so it can get the current value everytime spawnPlanets is called
        this.placeSpawnedPlanets = spawnPlanets(this.scene, this.camera, this.domElement, this.spawnedPlanets, () => this.sizeOfPlanetsMultiplier);
        this.control.addEventListener('lock', () => this.placeSpawnedPlanets.disable());
        this.control.addEventListener('unlock', () => this.placeSpawnedPlanets.enable());

    
    }    
        update(delta) {

            this.sun.rotation.x += 0.01;
            this.sun.rotation.y += 0.01;

            // Draw the orbit of the planets
            for (const orbit of this.orbits) {
                orbit.phase = (orbit.phase + orbit.speed * delta) % 1;
                const points2D = orbit.orbitalPath.getPoint(orbit.phase);
                const points3D = new THREE.Vector3(points2D.x, 0, points2D.y)
                    .applyAxisAngle(new THREE.Vector3(1, 0, 0), orbit.inclination)
                    .applyAxisAngle(new THREE.Vector3(0, 1, 0), orbit.perhelion)
                    .add(this.sun.position);
                orbit.mesh.position.copy(points3D);
            }

            // Gravity and collision
            gravitationalPull(this.spawnedPlanets, delta);
            handleCollisions(this.scene, this.camera, this.spawnedPlanets, this.collisionExplosion);
            this.collisionExplosion.step(delta);
        }
}