import * as THREE from 'three';
import Ammunition from './Ammunition';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


/**
 * Needs to be constructed manually to spawn a ship, so caller
 * needs to provide the object attributes
 * 
 * @param {THREE.Scene} scene The main scene for the ship to be added/visible in
 * @param {THREE.Vector3} position Spawn point of the ship
 * @param {object} ship Ship attributes
 * @param {string} ship.model 3D model for the ship 
 * @param {number} ship.scale How big the ship is in space
 * @param {number} ship.health How much health the ship has
 * @param {object} ship.ammunition What the ship fires
 * @param {number} ship.firedAmount How many of the ammunition is fired
 * @param {number} ship.bulletArc Spread of the fired ammunition
 */
export default class SpaceShip {
    constructor(scene, position = new THREE.Vector3(), 
        {model, scale, health, ammunition = Ammunition, firedAmount, bulletArc } = {}) {
        this.ship = null;
        this.scale = scale;
        this.coolDown = 0;
        this.fireRate = 0;
        this.currentHealth = health;
        this.maxHealth = health;
        this.fired = firedAmount;
        this.arc = bulletArc;
        this.position = position.clone();
        this.isLoaded = false;
        this.scene = scene;
        this.ammunition = ammunition;
        this.alive = true;
        
        // The bullets it has fired
        this.bullets = [];

        // Load ship from the texture
        const modelLoader = new GLTFLoader();

        // Promise to ensure ship is fully loaded
        this.modelLoaderPromise = new Promise(resolve => {
            modelLoader.load(
            model,
            (glb) => {
                this.ship = glb.scene;
                this.ship.scale.set(scale, scale, scale);
                this.ship.position.copy(position);
                scene.add(this.ship);
                this.isLoaded = true;
                resolve(this);
            });
        });

    }
       
    

    // Method to find the nearest ship
    _FindNearestShip(allShips) {

        // Set everything to a changable value
        let closest = 0;
        let closestDistanceSquared = Infinity;

        // Go through each spaceship and determine which ship is the closest to the current ship
        for (const oneShip of allShips) {
            if (!oneShip.alive) continue; // Skip dead ships
            if (oneShip === this) continue;
            if (!oneShip.ship) continue;
            const distanceToOtherShip = oneShip.ship.position.distanceToSquared(this.ship.position);
            if (distanceToOtherShip < closestDistanceSquared) {
                closestDistanceSquared = distanceToOtherShip;
                closest = oneShip;
            }
        }

        // Return closest ship to current ship to attack
        return closest;
    }

    // Shoot in the direction of the ship
    _Shoot(direction) {
        const cannon = this.ship.position.clone().add(direction.clone().multiplyScalar(1.5));
        const speed = 100;
        const damage = 1;
        const ammo = this.ammunition;
        const bullet = new ammo(this.scene, cannon, direction, speed, damage, { 
                        model: ammo.ammoModel,
                        scale: ammo.ammoScale});
        bullet.modelLoaderPromise.then(() => {
        this.scene.add(bullet.ammo);
            
        })
        this.bullets.push(bullet);
    }

    // Update the health bar of the ship 
    damageToShip(damage) {
        this.currentHealth = Math.max(0, this.currentHealth - damage);

        if (this.healthBarSlider) {
            this.healthBarSlider.value = String(this.currentHealth);
            console.log("Current ship Health: ", this.currentHealth)
        }

        if (this.currentHealth <= 0) {
            this.destroyedShip();
        }
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

                // How many should be fired in one volley
                for (let i = 0; i < this.fired; i++) {
                    
                    // Controls spread of the bullets fired
                    const randomX = ((Math.random() * 2) - 1) * this.arc;
                    const spread = new THREE.Vector3(pointAtShip.x + randomX, pointAtShip.y,  pointAtShip.z);
                    this._Shoot(spread);
                    this.coolDown = this.fireRate;
                }
            }
        }

        // Update bullet shot position
        this.bullets.forEach(bullet => bullet.update(delta));

    }
}