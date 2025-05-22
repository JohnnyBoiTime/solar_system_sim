import MissileModel from '../../../models/missile.glb'
import Ammunition from '../Ammunition';

export default class Missile extends Ammunition {
        static ammoModel = MissileModel;
        static ammoScale = 20.0;


        constructor(scene, position, direction, speed, damage ) {

        const model = Missile.ammoModel;
        const scale = Missile.ammoScale;

        super( scene, position, direction, speed, damage, {
            model,
            scale
        });
    }


}