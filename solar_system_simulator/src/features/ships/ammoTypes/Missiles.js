import MissileModel from '../../../models/missile.glb'
import Ammunition from '../Ammunition';

export default class Missile extends Ammunition {
        static ammoModel = MissileModel;
        static ammoScale = 20.0;


        constructor(scene, position, direction, speed, damage ) {

        const model = Missile.ammoModel;
        const scale = Missile.ammoScale;
        const speedOfAmmo = 1000;

        super( scene, position, direction, speed = speedOfAmmo, damage, {
            model,
            scale
        });
    }


}