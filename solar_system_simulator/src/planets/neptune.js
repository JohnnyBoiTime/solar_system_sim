import * as THREE from 'three';
import neptuneTexture from '../textures/neptune.jpg';

// Pretty self explanatory, this file creates neptune and adds it to the scene
export function createNeptune() {

    // Create sphere, material, and mesh for neptune
    const neptune = new THREE.SphereGeometry(1, 32, 32);

    // Load JPG as a THREE texture to use
    const loadTexture = new THREE.TextureLoader();
    const texture = loadTexture.load(neptuneTexture);
    texture.colorSpace = THREE.SRGBColorSpace; 
    
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.6,
        metalness: 0.0,
    });

    const neptuneMesh = new THREE.Mesh(neptune, material);

    // Return neptune mesh
    return neptuneMesh;
};
