import * as THREE from 'three';

export default class Bullet {
    constructor(position, direction, speed = 200) {
        
        // Building the bullet
        const bulletGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        const bulletMaterial = new THREE.MeshBasicMaterial({color: 0xffaa00});
        this.bulletMesh = new THREE.Mesh(bulletGeometry, bulletMaterial);


        this.bulletMesh.position.copy(position);

        this.velocity = direction.clone().normalize().multiplyScalar(speed);
    }

    update(delta) {
        this.mesh.position.addScaledVector(this.velocity, delta);
    }
}