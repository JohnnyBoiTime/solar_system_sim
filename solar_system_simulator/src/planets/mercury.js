import * as THREE from 'three';
import mercuryTexture from '../textures/planetTextures/mars.jpg';

// Pretty self explanatory, this file creates mercury and adds it to the scene
export function createMercury() {

    // Create sphere, material, and mesh for mercury
    const mercury = new THREE.SphereGeometry(1, 32, 32);
    
    // Load JPG as a THREE texture to use
    const loadTexture = new THREE.TextureLoader();
    const texture = loadTexture.load(mercuryTexture);
    texture.colorSpace = THREE.SRGBColorSpace; 
    
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.6,
        metalness: 0.0,
    });

    const mercuryMesh = new THREE.Mesh(mercury, material);

    // Return mercury mesh
    return mercuryMesh;
};