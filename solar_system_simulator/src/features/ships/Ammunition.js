import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Ammunition blueprint for types of projectiles the ships shoot
export default class Ammunition {
    constructor(scene, position, direction, speed = {}, damage = 1.0, 
        {model = this.constructor.model, 
        scale = this.constructor.scale}) {

        // Set basic stuff for ammo
        this.scene = scene;
        this.ammo = null;
        this.isLoaded = false;
        this.position = position.clone();
        this.speed = speed;
        this.damage = damage;
        this.velocity = direction.clone().normalize().multiplyScalar(speed);

        // Load ship from the texture
        const modelLoader = new GLTFLoader();

        // Promise to ensure ship is fully loaded
        this.modelLoaderPromise = new Promise(resolve => {
            modelLoader.load(
            model,
            (glb) => {
                this.ammo = glb.scene;

                // Set direction of missile to face forward
                const normDirection = direction.clone().normalize();
                const forwardDirection = new THREE.Vector3(0, 0, 1);
                const q = new THREE.Quaternion().setFromUnitVectors(forwardDirection, normDirection);
                this.ammo.quaternion.copy(q);

                // Loaded and ready to set
                this.isLoaded = true;
                this.ammo.scale.set(scale, scale, scale);
                this.ammo.position.copy(position);
                this.scene.add(this.ammo);
                resolve(this);
            });
        });


    }

    // Update bullet positon
    update(delta) {
        if (!this.isLoaded || !this.ammo) return;
        this.ammo.position.addScaledVector(this.velocity, delta);
        this.position.copy(this.ammo.position);
    }
}