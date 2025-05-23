import CarrierModel from '../../../models/carrier.glb';
import Drone from '../ammoTypes/Drones';
import SpaceShip from '../SpaceShip';

// Carrier class to spit out drones
export default class Carrier extends SpaceShip {

    static shipModel = CarrierModel;
    static shipScale = 0.1;
    static ammunition = Drone;    

    constructor (scene, position) {
        super( scene, position, {
            model: Carrier.shipModel,
            scale: Carrier.shipScale,
            ammunition: Carrier.ammunition
        });

        // Override the fire rate and cooldown of SpaceShip
        this.fireRate = 0.5;
        this.coolDown = 0;
    }
}