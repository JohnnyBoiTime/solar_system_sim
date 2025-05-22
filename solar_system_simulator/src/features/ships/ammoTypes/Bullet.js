import * as THREE from 'three';
import BulletModel from '../../../models/bullet.glb';
import Ammunition from '../Ammunition';

export default class Bullet extends Ammunition {
        static ammoModel = BulletModel;
        static ammoScale = 0.5;

        constructor(scene, position, direction, speed, damage ) {

            const model = Bullet.ammoModel;
            const scale = Bullet.ammoScale;

            super( scene, position, direction, speed, damage, {
                model,
                scale
             });
        }
}