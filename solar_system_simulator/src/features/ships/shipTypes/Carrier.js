import * as THREE from 'three';
import CarrierModel from '../../../models/carrier.glb';
import Drone from '../ammoTypes/Drones';
import SpaceShip from '../SpaceShip';

// Carrier class to spit out drones
export default class Carrier extends SpaceShip {

    static shipModel = CarrierModel;
    static shipScale = 20;
    static shipHealth = 1000;

    constructor (scene, position) {
        super( scene, position, {
            model: Carrier.shipModel,
            health: Carrier.shipHealth,
            scale: Carrier.shipScale,
        });

        // Override the fire rate and cooldown of SpaceShip
        this.fireRate = 5;
        this.coolDown = 1;
    }

    update(delta, allShips) {
        super.update(delta, allShips); // Carrier acts like a regular ship

        this.coolDown -= delta;


        // Send out a drone
        if (this.coolDown <= 0) {
            const target = this._FindNearestShip(allShips);
            if (target) {
                const directionOfShip = this.ship.getWorldDirection(new THREE.Vector3());
                const spawnDrone = this.ship.position.clone().add(directionOfShip.multiplyScalar(this.ship.scale.x * 15));

                const drone = new Drone(this.scene, spawnDrone, target);
                allShips.push(drone);
            }
            this.coolDown = this.fireRate;
        }
    }
}