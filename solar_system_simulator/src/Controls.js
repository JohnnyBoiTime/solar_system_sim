import * as THREE from 'three';

// Defines the controls
export default class Controls {

    // Basic control scheme
    constructor(controls, camera) {
        this.controls = controls;
        this.camera = camera;
        this.wrapper = controls.getObject();
        this.battleMode = false;
        this.keepControlsLocked = false;

        this.moving = {
            forward: false,
            backward: false,
            right: false,
            left: false,
        };

        this.speed = 500;
        this.position = 10;

        this.forwardDireciton = new THREE.Vector3();
        this.upwardDirection = new THREE.Vector3();
        this.rightDirection = new THREE.Vector3();
    }

    // Pressing down moves camera
    handleKeyDown(event) {
        switch(event.code) {
            // Placing planet mode
            case 'KeyP':
                this.battleMode = false;
                this.camera.position.set(10, 100, 500);
                this.camera.lookAt(0, 0, 0);
                if (this.controls.isLocked) {
                    this.controls.unlock();
                }
                else {
                    this.controls.lock();
                }
            break;
            // Battle mode to simulate space battles
            case 'KeyB':
                if (this.controls.isLocked) {
                    this.controls.unlock();
                }
                else {
                    this.controls.lock();
                    this.battleMode = true;
                    this.camera.position.y = 1000;
                    this.camera.rotation.set(-Math.PI/2, 0, 0);
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

        // Controls for simulation mode
        if (this.battleMode == false) {

            // Goes in and out of the scene to explore
            this.wrapper.getWorldDirection(this.forwardDireciton);
            this.rightDirection.crossVectors(
                this.forwardDireciton, this.wrapper.up)
                .normalize();
        
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


        // Controls for battle mode
        else {

            if (this.moving.forward) {
                this.camera.position.z -= this.speed * delta;
            }
            if (this.moving.backward) {
                this.camera.position.z += this.speed * delta;
            }

            if (this.moving.left) {
                this.camera.position.x -= this.speed * delta;
            }
            if (this.moving.right) {
                 this.camera.position.x += this.speed * delta;
            }
        }

    }

}