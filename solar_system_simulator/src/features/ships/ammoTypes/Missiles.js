import MissileModel from '../../../models/missile.glb'
import Ammunition from '../Ammunition';

// Missile Class
export default class Missile extends Ammunition {
        static model = MissileModel;
        static scale = 20.0;
        static damage = 50;
        static speed = 200;

        // Override ammunition
        constructor(scene, position, direction) {

        super( scene, position, direction);
    }
}