import * as THREE from 'three';
import jupiterTexture from '../textures/planetTextures/jupiter.jpg';

// Pretty self explanatory, this file creates jupiter and adds it to the scene
export function createJupiter() {

    // Create sphere, material, and mesh for jupiter
    const jupiter = new THREE.SphereGeometry(1, 32, 32);
    
    // Load JPG as a THREE texture to use
    const loadTexture = new THREE.TextureLoader();
    const texture = loadTexture.load(jupiterTexture);
    texture.colorSpace = THREE.SRGBColorSpace; 
    
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.6,
        metalness: 0.0,
    });

    const jupiterMesh = new THREE.Mesh(jupiter, material);

    // Return jupiter mesh
    return jupiterMesh;
};