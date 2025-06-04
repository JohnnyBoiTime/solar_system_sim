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
import Cruiser from './features/ships/shipTypes/Cruiser';
import Fighter from './features/ships/shipTypes/Fighter'; 
import Carrier from './features/ships/shipTypes/Carrier';
import Bullet from './features/ships/ammoTypes/Bullet';
import Missile from './features/ships/ammoTypes/Missiles';
import Drone from './features/ships/ammoTypes/Drones';
import { spawnShips } from './features/placeShip';
import { handleCollisions } from './features/collisions';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export default class SolarSystem {

    // Create everything
    constructor(scene, camera, domElement, controls) {
        this.scene = scene;
        this.camera = camera;
        this.domElement = domElement;
        this.control = controls;
        this.battleMode = false;
        this.sizeOfSpawnedPlanetMultiplier = 1.0;
        this.sizeOfPlanetsMultipler = 1.0;
        this.name = "name";
        this._ChangeSizeOfPlanets();
        this._Initialize();

        this.collisionExplosion = new ParticleSystem({
            parent: this.scene,
            camera: this.camera
        });
    }

    // Thing to change the size of the spawned planets and solar system stuff
    _ChangeSizeOfPlanets() {
        
        // Size of planets that are spawned
        this.spawnedPlanetSizer = document.getElementById('spawnPlanetSizer');
        this.sizeOfSpawnedPlanetValue = document.getElementById('sizeOfSpawnedPlanet');

        this.spawnedPlanetSizer.addEventListener('input', e => {
            this.sizeOfSpawnedPlanetMultiplier = parseFloat(e.target.value);
            this.sizeOfSpawnedPlanetValue.textContent = this.sizeOfSpawnedPlanetMultiplier.toFixed(1) + 'x';
        });

        // Size of already existing solar system planets
        this.planetSizeSlider = document.getElementById('planetSizeSlider');
        this.sizeOfPlanet = document.getElementById('sizeOfPlanet');

        this.planetSizeSlider.addEventListener('input', e => {
            this.sizeOfPlanetsMultipler = parseFloat(e.target.value);
            this.sizeOfPlanet.textContent = this.sizeOfPlanetsMultipler.toFixed(1) + 'x';

            // Change size of all planets by the multiplier
            for (const [name, mesh] of Object.entries(this.planets)) {
                const normalSize = this.planetData[name].size;
                mesh.scale.set(normalSize * this.sizeOfPlanetsMultipler, normalSize * this.sizeOfPlanetsMultipler, normalSize * this.sizeOfPlanetsMultipler);
            }
        });
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

            // Create visual for planet 
            const mesh = createPlanets();
            mesh.scale.set(data.size, data.size, data.size);
            mesh.castShadow = true;
            mesh.recieveShadow = true;

            // Label that follows the planets around
            const div = document.createElement('div');
            div.className = 'label';
            div.textContent = name;
            div.style.marginTop = '1px';
            const label = new CSS2DObject(div);
            label.position.set(0, 2, 0);
            mesh.add(label);

            this.scene.add(mesh);
            this.planets[name] = mesh;

        }

        // Build the visuals for the planets orbits
        this.orbits = [];
        for (const [name, data] of Object.entries(this.planetData)) {

            // Formula for accurate orbits
            const bAxis = data.distance * Math.sqrt(1 - (data.eccentricity * data.eccentricity));
            const orbitalPath = new THREE.EllipseCurve(
                -data.distance * data.eccentricity, 0,
                data.distance, bAxis, 0, 2 * Math.PI, 
                false, 0
            );

            const orbitLine = createOrbitPathsOfPlanets(
                data.distance,
                data.eccentricity,
                128,
                0x8888ff
            );

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
        this.spawnedShips = [];
        this.shipTypes = [Fighter, Cruiser, Carrier];
        this.ammoTypes = [Bullet, Missile, Drone];
        

        // Change ship to what you want
        document.addEventListener('keydown', e => {

            const indexForShip = parseInt(e.key, 10);

            // Makes it so if wasd keys are pressed or otherwise, it
            // does not change the current chosen ship
            if (![1,2,3].includes(indexForShip)) {
                return;
            }

            // Stuff for ship selection
            this.chosenShip = Fighter;
            this.chosenAmmo = Bullet;
            this.currentShip = document.getElementById('shipSelected');

            switch(indexForShip) {
                case 1:
                   this.chosenShip = this.shipTypes[0];
                   this.chosenAmmo = this.ammoTypes[0];
                   this.name = "Fighter";
                   break;
                case 2: 
                    this.chosenShip = this.shipTypes[1];
                    this.chosenAmmo = this.ammoTypes[1];
                    this.name = "Cruiser";
                    break;
                case 3:
                    this.chosenShip = this.shipTypes[2];
                    this.chosenAmmo = this.ammoTypes[2];
                    this.name = "Carrier";
                    break;
                }

                this.currentShip.textContent = this.name;
            });

        // Place ships or planets
        this.placeSpawnedPlanets = spawnPlanets(this.scene, this.camera, this.domElement, this.spawnedPlanets, () => this.sizeOfSpawnedPlanetMultiplier);
        this.placeSpawnedShips = spawnShips(this.scene, this.camera, this.domElement, this.spawnedShips, () => this.chosenShip, () => this.chosenAmmo, () => this.name);

        // Switch between placing ships or placing planets
        document.addEventListener('keydown', e => {
            switch(e.code) {
                case 'KeyB':
                    this.placeSpawnedShips.enable();
                    this.placeSpawnedPlanets.disable();
                    break;
                case 'KeyP':
                    this.placeSpawnedPlanets.enable();
                    this.placeSpawnedShips.disable();
                    break;
                    }
                });
    }  
    
    // Update loop for the solar system
    update(delta) {
        this.sun.rotation.x += 0.01;
        this.sun.rotation.y += 0.01;


        // Have ships update one at a time
        this.spawnedShips.forEach(ship => {
            if (typeof ship.update !== 'function') {
                return;
            }
                
            ship.update(delta, this.spawnedShips);
            });

            /*
             this.spawnedShips.forEach(s => {
                if (s.ship === null) return;

                // Label that follows the planets around
                const div = document.createElement('div');
                div.className = 'label';
                div.textContent = this.name;
                div.style.marginTop = '1px';
                const label = new CSS2DObject(div);
                label.position.set(0, 10, 0);
                s.ship.add(label);
            });  */

        // Collision detection
        for (const ship of this.spawnedShips) {
          for (const otherShip of this.spawnedShips) {
            if (!otherShip.isLoaded || !otherShip.ship) continue;
            if (ship === otherShip) continue; // skip if ship collides with itself
            if (!ship.bullets.length) continue; // Skip no ammo
            // Check if bullet collided with a ship
            for (const bullet of ship.bullets) {
              if (bullet.position.distanceTo(otherShip.ship.position) < 10) {
                console.log(otherShip.ship.position);
                    // Remove bullet and ship
                    otherShip.destroyedShip();
              }
            }
          }
        }


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
        handleCollisions(this.scene, this.spawnedPlanets, this.collisionExplosion);
        this.collisionExplosion.step(delta);
    }
}