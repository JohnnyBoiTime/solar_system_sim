import * as THREE from 'three';
import Bullet from './Bullet';
import starShip from '../../models/super_starfury.glb';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default class SpaceShip {
    constructor(scene, position = new THREE.Vector3(), color = 0x888ff) {
        this.ship = null;
        this.isLoaded = false;
        this.scene = scene;
        this.alive = true;

        // Load ship from the texture
        const modelLoader = new GLTFLoader();

        modelLoader.load(
            starShip,
            (glb) => {
                this.ship = glb.scene;
                this.isLoaded = true;
                this.ship.scale.set(0.1, 0.1, 0.1);
                this.ship.position.copy(position);
                scene.add(this.ship);
            }
        )

        // How fast the ship shoots
        this.fireRate = 0.5;
        this.coolDown = 0;

        // The bullets it has fired
        this.bullets = [];
    }

    // Method to find the nearest ship
    _FindNearestShip(allShips) {

        // Set everything to a changable value
        let closest = null;
        let closestDistanceSquared = Infinity;

        // Go through each spaceship and determine which ship is the closest to the current ship
        for (const oneShip of allShips) {
            if (oneShip === this) continue;
            if (!oneShip.ship) continue;
            const distanceToOtherShip = oneShip.ship.position.distanceToSquared(this.ship.position);
            if (distanceToOtherShip < closestDistanceSquared) {
                closestDistanceSquared = distanceToOtherShip;
                closest = oneShip;
            }
        }
        return closest;
    }

    // Shoot in the direction of the ship
    _Shoot(direction) {
        const cannon = this.ship.position.clone().add(direction.clone().multiplyScalar(1.5));
        const bullet = new Bullet(cannon, direction, 300);
        this.scene.add(bullet.bulletMesh);
        this.bullets.push(bullet);
    }

    // Destroy the ship when it gets hit
    destroyedShip() {
        this.alive = false;
        this.scene.remove(this.ship);
    }

    
    update(delta, allShips) {
        if (!this.alive || !this.isLoaded) return; // If ship is destroyed, the current instance of the ship does nothing
        const targetShip = this._FindNearestShip(allShips);

        // Retarget to other ships
        if(targetShip) {
            const pointAtShip = targetShip.ship.position.clone().sub(this.ship.position).normalize();
            this.ship.lookAt(targetShip.ship.position);

            // Cooldown firerate
            this.coolDown -= delta;
            if (this.coolDown <= 0) {
                this._Shoot(pointAtShip);
                this.coolDown = this.fireRate;
            }
        }

        // Update bullet shot position
        this.bullets.forEach(bullet => bullet.update(delta));
    }
}