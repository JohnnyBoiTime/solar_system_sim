import * as THREE from 'three';

export default class Bullet {
    constructor(position, direction, speed = 200) {
        
        // Building the bullet
        const bulletGeometry = new THREE.SphereGeometry(2, 8, 8);
        const bulletMaterial = new THREE.MeshBasicMaterial({color: 0xffaa00});
        this.bulletMesh = new THREE.Mesh(bulletGeometry, bulletMaterial);


        // Spawns bullet where the ship is
        this.bulletMesh.position.copy(position);

        // Make bullet go brrrr
        this.velocity = direction.clone().normalize().multiplyScalar(speed);
    }

    // Update bullet positon
    update(delta) {
        this.bulletMesh.position.addScaledVector(this.velocity, delta);
    }
}