import * as THREE from 'three';
import saturnTexture from '../textures/planetTextures/saturn.jpg';
import ringTexture from '../textures/planetTextures/saturnRings.jpg';

// Pretty self explanatory, this file creates saturn and adds it to the scene
export function createSaturn() {

    const saturn = new THREE.Group();

    // Create sphere for the planet of saturn
    const planet = new THREE.SphereGeometry(1, 32, 32);

    // Load JPG as a THREE texture to use
    const loadPlanetTexture = new THREE.TextureLoader();
    const planetTexture = loadPlanetTexture.load(saturnTexture);
    planetTexture.colorSpace = THREE.SRGBColorSpace; 
    
    const sphereMaterial = new THREE.MeshStandardMaterial({
        map: planetTexture,
        roughness: 0.6,
        metalness: 0.0,
    });

    const planetMesh = new THREE.Mesh(planet, sphereMaterial);

    const rings = new THREE.RingGeometry(1.2, 3, 32);

    const loadRingTexture = new THREE.TextureLoader();
    const ringsTexture = loadRingTexture.load(ringTexture);
    ringsTexture.colorSpace = THREE.SRGBColorSpace;  

    const ringMaterial = new THREE.MeshStandardMaterial({
        map: ringsTexture,
        roughness: 0.6,
        metalness: 0.0,
    });

    const ringMesh = new THREE.Mesh(rings, ringMaterial);
    ringMesh.rotation.x = -Math.PI / 2.5; // Rotate the rings to be flat
    ringMaterial.side = THREE.DoubleSide; // Make the rings visible from both sides

    saturn.planet = planetMesh;

    saturn.add(planetMesh);
    saturn.add(ringMesh);


    // Return saturn mesh
    return saturn;
};

