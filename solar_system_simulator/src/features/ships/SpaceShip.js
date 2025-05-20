import * as THREE from 'three';
import Bullet from './Bullet';

export default class SpaceShip {
    constructor(scene, position = new THREE.Vector3(), color = 0x888ff) {
        this.scene = scene;
        this.alive = true;
        // Create the ship
        const hull = new THREE.ConeGeometry(10, 20, 8);
        const paintJob = new THREE.MeshStandardMaterial({ color });
        this.ship = new THREE.Mesh(hull, paintJob);
        this.ship.position.copy(position);
        this.ship.rotation.x = Math.PI / 2;
        scene.add(this.ship);

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
        if (!this.alive) return; // If ship is destroyed, the current instance of the ship does nothing
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