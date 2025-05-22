import CruiserModel from '../../../models/cruiser.glb';
import Missile from '../ammoTypes/Missiles';
import SpaceShip from '../SpaceShip';

export default class Cruiser extends SpaceShip {

    static shipModel = CruiserModel;
    static shipScale = 0.1;
    static ammunition = Missile;    

    constructor (scene, position) {
        super( scene, position, {
            model: Cruiser.shipModel,
            scale: Cruiser.shipScale,
            ammunition: Cruiser.ammunition
        });

        // Override the fire rate and cooldown of SpaceShip
        this.fireRate = 0.5;
        this.coolDown = 0;
    }
}