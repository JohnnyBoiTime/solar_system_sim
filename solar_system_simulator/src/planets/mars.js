import * as THREE from 'three';
import marsTexture from '../textures/mars.jpg';

// Pretty self explanatory, this file creates mars and adds it to the scene
export function createMars() {

    // Create sphere, material, and mesh for mars
    const mars = new THREE.SphereGeometry(1, 32, 32);
    
    // Load JPG as a THREE texture to use
    const loadTexture = new THREE.TextureLoader();
    const texture = loadTexture.load(marsTexture);
    texture.colorSpace = THREE.SRGBColorSpace; 
    
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.6,
        metalness: 0.0,
    });

    const marsMesh = new THREE.Mesh(mars, material);

    // Return mars mesh
    return marsMesh;
};