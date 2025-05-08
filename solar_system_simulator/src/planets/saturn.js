import * as THREE from 'three';
import saturnTexture from '../textures/saturn.jpg';

// Pretty self explanatory, this file creates saturn and adds it to the scene
export function createSaturn() {

    // Create sphere, material, and mesh for saturn
    const saturn = new THREE.SphereGeometry(1, 32, 32);
    

    // Load JPG as a THREE texture to use
    const loadTexture = new THREE.TextureLoader();
    const texture = loadTexture.load(saturnTexture);
    texture.encoding = THREE.sRGBEncoding; 
    
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.6,
        metalness: 0.0,
    });

    const saturnMesh = new THREE.Mesh(saturn, material);

    

    // Return saturn mesh
    return saturnMesh;
};

