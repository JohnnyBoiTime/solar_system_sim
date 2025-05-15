import * as THREE from 'three';
import venusTexture from '../textures/planetTextures/venus.jpg';

// Pretty self explanatory, this file creates venus and adds it to the scene
export function createVenus() {

    // Create sphere, material, and mesh for venus
    const venus = new THREE.SphereGeometry(1, 32, 32);
    
    // Load JPG as a THREE texture to use
    const loadTexture = new THREE.TextureLoader();
    const texture = loadTexture.load(venusTexture);
    texture.colorSpace = THREE.SRGBColorSpace; 
    
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.6,
        metalness: 0.0,
    });

    const venusMesh = new THREE.Mesh(venus, material);

    // Return venus mesh
    return venusMesh;
};