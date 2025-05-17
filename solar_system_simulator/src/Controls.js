import * as THREE from 'three';


// Defines the controls
export default class Controls {

    // Basic control scheme
    constructor(controls) {
        this.controls = controls;
        this.wrapper = controls.getObject();

        this.moving = {
            forward: false,
            backward: false,
            right: false,
            left: false,
        };

        this.speed = 500;

        this.forwardDireciton = new THREE.Vector3();
        this.rightDirection = new THREE.Vector3();
    }

    // Pressing down moves camera
    handleKeyDown(event) {
        switch(event.code) {
            case 'KeyP':
                if (this.controls.isLocked) {
                    this.controls.unlock();
                }
                else {
                    this.controls.lock();
                }
            break;
            case 'KeyW':
                this.moving.forward = true;
                break;
            case 'KeyS':
                this.moving.backward = true;
                break;
            case 'KeyA':
                this.moving.left = true;
                break;
            case 'KeyD':
                this.moving.right = true;
                break;               
        }
    }

    // Letting go stops moving camera
    handleKeyUp(event) {
        switch(event.code) {
            case 'KeyW':
                this.moving.forward = false;
                break;
            case 'KeyS':
                this.moving.backward = false;
                break;
            case 'KeyA':
                this.moving.left = false;
                break;
            case 'KeyD':
                this.moving.right = false;
                break;               
        }
    }

    

    // Update direcitons
    update(delta) {
        this.wrapper.getWorldDirection(this.forwardDireciton);
        this.rightDirection.crossVectors(
            this.forwardDireciton, this.wrapper.up  
        ).normalize();

        if (this.moving.forward) {
            this.wrapper.position.addScaledVector(
                this.forwardDireciton,
                this.speed * delta
            );
        }
        if (this.moving.backward) {
            this.wrapper.position.addScaledVector(
                this.forwardDireciton,
                -this.speed * delta
            );
        }

        if (this.moving.left) {
            this.wrapper.position.addScaledVector(
                this.rightDirection,
                -this.speed * delta
            );
        }
        if (this.moving.right) {
            this.wrapper.position.addScaledVector(
                this.rightDirection, 
                this.speed * delta
            );
        }
    }

   

}