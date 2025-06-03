import * as THREE from 'three';
import DroneModel from '../../../models/drones.glb'
import SpaceShip from '../SpaceShip';
import Bullet from './Bullet';
import { distance } from 'three/src/nodes/TSL.js';

// Drone class
export default class Drone extends SpaceShip {
           static shipModel = DroneModel;
           static shipScale = 30;
           static spray = 3; // Amont the ship type fires at once
           static spread = 0.3
           static ammunition = Bullet;    
       
           constructor (scene, position, targetShip) {
               super( scene, position, {
                   model: Drone.shipModel,
                   scale: Drone.shipScale,
                   ammunition: Drone.ammunition,
                   firedAmount: Drone.spray,
                   bulletArc: Drone.spread
               });
       
               // Override the fire rate and cooldown of SpaceShip, among other things
               this.coolDown = 0;
               this.targetShip = targetShip;
               this.orbitRadius = 150;
               this.angularSpeed = Math.PI;
               this.currentAngle = 0;
               this.fireRate = 0.5;
               this.coolDown = 0;
               this.travelingToTarget = true;
               this.attack = false;
               this.travelSpeed = 800;
            }    

            update(delta, allShips) {
                    if (!this.alive || !this.isLoaded) return; // If ship is destroyed, the current instance of the ship does nothing

                    /*
                    // Drones orbit around target
                    this.currentAngle += this.angularSpeed * delta;
                    const offset = new THREE.Vector3(
                    Math.cos(this.currentAngle),
                    0,
                    Math.sin(this.currentAngle)).multiplyScalar(this.orbitRadius)
                    this.ship.position.copy(this.targetShip.ship.position.clone().add(offset)); 
            
                    this.ship.lookAt(this.targetShip.ship.position);
                    */ 

                    // Takes too long to type out this.target.ship.position
                    const targetsPosition = this.targetShip.ship.position;

                    // Drone is traveling to the target
                    if (this.travelingToTarget === true && this.attack === false) {
                        const distanceToTarget = targetsPosition.clone().sub(this.ship.position);
                        const distanceLeftToTravel = distanceToTarget.length();
                        

                        // Closing in on target
                        if (distanceLeftToTravel > this.orbitRadius) {
                            const move = distanceToTarget.normalize();
                            const distanceMoved = move.clone().multiplyScalar(this.travelSpeed * delta);
                            this.ship.position.add(distanceMoved);
                            console.log("Closing in, currently: ", distanceLeftToTravel);
                        } 

                        // Closed in on the target!
                        else {
                            this.travelingToTarget = false; // Reached the target
                            this.attack = true;

                            // Set angle from where the drone approaches the ship
                            const orbiter = this.ship.position.clone().sub(targetsPosition).setY(0);
                            this.currentAngle = Math.atan2(orbiter.z, orbiter.x);
                        }
                    }

                    // Drone has reached the target, determines how it attacks
                    else {

                        // Drones orbit around target
                        this.currentAngle += this.angularSpeed * delta;
                        const offset = new THREE.Vector3(
                            Math.cos(this.currentAngle),
                            0,
                            Math.sin(this.currentAngle)).multiplyScalar(this.orbitRadius)
                        this.ship.position.copy(targetsPosition.clone().add(offset)); 
                        
                        this.ship.lookAt(targetsPosition);
                    
                        // Cooldown firerate
                        this.coolDown -= delta;
                        if (this.coolDown <= 0) {
            
                            // How many should be fired in one volley
                            for (let i = 0; i < this.fired; i++) {
                                const directionToShip = this.targetShip.ship.position.clone().sub(this.ship.position).normalize();
                                this._Shoot(directionToShip);
                                this.coolDown = this.fireRate;

                                /*
                                // Controls spread of the bullets fired
                                const randomX = ((Math.random() * 2) - 1) * this.arc;
                                const spread = new THREE.Vector3(pointAtShip.x + randomX, pointAtShip.y,  pointAtShip.z);
                                this._Shoot(spread);
                                this.coolDown = this.fireRate;
                                */
                            }
                        }
                        // Update bullet shot position
                        this.bullets.forEach(bullet => bullet.update(delta));
                    }
            
                }

}