import * as THREE from 'three';
import uranusTexture from '../textures/planetTextures/uranus.jpg';

// Pretty self explanatory, this file creates uranus and adds it to the scene
export function createUranus() {

    // Create sphere, material, and mesh for uranus
    const uranus = new THREE.SphereGeometry(1, 32, 32);
    
    // Load JPG as a THREE texture to use
    const loadTexture = new THREE.TextureLoader();
    const texture = loadTexture.load(uranusTexture);
    texture.colorSpace = THREE.SRGBColorSpace; 
    
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.6,
        metalness: 0.0,
    });

    const uranusMesh = new THREE.Mesh(uranus, material);
    // Return uranus mesh
    return uranusMesh;
};
