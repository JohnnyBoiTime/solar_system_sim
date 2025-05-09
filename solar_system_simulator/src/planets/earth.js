import * as THREE from 'three';
import earthTexture from '../textures/earth.jpg';

// Pretty self explanatory, this file creates earth and adds it to the scene
export function createEarth() {

    // Create sphere, material, and mesh for earth
    const earth = new THREE.SphereGeometry(1, 32, 32);
    
    // Load JPG as a THREE texture to use
    const loadTexture = new THREE.TextureLoader();
    const texture = loadTexture.load(earthTexture);
    texture.colorSpace = THREE.SRGBColorSpace; 
    
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.6,
        metalness: 0.0,
    });

    const earthMesh = new THREE.Mesh(earth, material);

    // Return earth mesh
    return earthMesh;
};