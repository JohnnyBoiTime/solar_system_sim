import CruiserModel from '../../../models/cruiser.glb';
import Missile from '../ammoTypes/Missiles';
import SpaceShip from '../SpaceShip';

export default class Cruiser extends SpaceShip {

    static shipModel = CruiserModel;
    static shipScale = 0.1;
    static spray = 3; // Amont the ship type fires at once
    static shipHealth = 150; 
    static spread = 0.3
    static ammunition = Missile;    

    constructor (scene, position) {
        super( scene, position, {
            model: Cruiser.shipModel,
            scale: Cruiser.shipScale,
            health: Cruiser.shipHealth,
            ammunition: Cruiser.ammunition,
            firedAmount: Cruiser.spray,
            bulletArc: Cruiser.spread
        });

        // Override the fire rate and cooldown of SpaceShip
        this.fireRate = 100;
        this.coolDown = 0;
    }
}