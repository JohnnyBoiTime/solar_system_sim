import CruiserModel from '../../../models/cruiser.glb';
import SpaceShip from '../SpaceShip';

export default class Cruiser extends SpaceShip {

    static shipModel = CruiserModel;
    static shipScale = 0.1;

    constructor (scene, position) {
        const model = Cruiser.shipModel;
        const scale = Cruiser.shipScale;

        super( scene, position, {
            model,
            scale,
        });

        // Override the fire rate and cooldown of SpaceShip
        this.fireRate = 0.5;
        this.coolDown = 0;
    }
}