import FighterModel from '../../../models/fighter.glb';
import SpaceShip from '../SpaceShip';

export default class Fighter extends SpaceShip {
    static shipModel = FighterModel;
    static shipScale = 0.1;

    constructor (scene, position) {

        const model = Fighter.shipModel;
        const scale = Fighter.shipScale;
        super( scene, position, {
            model,
            scale,
        });

        // Override the fire rate and cooldown of SpaceShip
        this.fireRate = 0.1;
        this.coolDown = 0;
    }
}