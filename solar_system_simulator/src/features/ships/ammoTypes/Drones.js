import DroneModel from '../../../models/drones.glb'
import SpaceShip from '../SpaceShip';
import Bullet from './Bullet';

// Drone class
export default class Drone extends  SpaceShip{
        static ammoModel = DroneModel;
        static ammoScale = 10;


        // Override ammunition
        constructor(scene, position, direction, speed, damage ) {

        const model = Drone.ammoModel;
        const scale = Drone.ammoScale;
        const speedOfAmmo = 1000;

        super( scene, position, direction, speed = speedOfAmmo, damage, {
            model,
            scale
        });
    }
}