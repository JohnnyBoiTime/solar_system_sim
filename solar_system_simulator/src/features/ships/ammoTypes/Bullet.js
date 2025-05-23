import * as THREE from 'three';
import BulletModel from '../../../models/bullet.glb';
import Ammunition from '../Ammunition';

// Bullet ammotype
export default class Bullet extends Ammunition {

        // Static model/scale
        static ammoModel = BulletModel;
        static ammoScale = 0.5;

        // Construct new ammo by ovvrriding ammunition class
        constructor(scene, position, direction, speed, damage ) {

            const model = Bullet.ammoModel;
            const scale = Bullet.ammoScale;

            super( scene, position, direction, speed, damage, {
                model,
                scale
             });
        }
}