import FighterModel from '../../../models/fighter.glb';
import Bullet from '../ammoTypes/Bullet';
import SpaceShip from '../SpaceShip';

export default class Fighter extends SpaceShip {
    static shipModel = FighterModel;
    static shipScale = 2.0;
    static ammunition = Bullet;

    constructor (scene, position) {

        super( scene, position, {
            model: Fighter.shipModel,
            scale: Fighter.shipScale,
            ammunition: Fighter.ammunition
        });

        // Override the fire rate and cooldown of SpaceShip
        this.fireRate = 0.5;
        this.coolDown = 0;
    }
}