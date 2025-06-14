import * as THREE from 'three';
import BulletModel from '../../../models/bullet.glb';
import Ammunition from '../Ammunition';

// Bullet ammotype
export default class Bullet extends Ammunition {

        // Static model/scale
        static model = BulletModel;
        static scale = 0.5;
        static damage = 10;
        static speed = 100;

        // Construct new ammo by ovvrriding ammunition class
        constructor(scene, position, direction) {

            super( scene, position, direction);
        }
}