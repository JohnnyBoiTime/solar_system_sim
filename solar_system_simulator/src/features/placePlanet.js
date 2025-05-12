import * as THREE from 'three';

// Function to spawn planets in the scene
export function spawnPlanets(scene, camera, renderer) {
    
    // Create ray and mouse to position where to palce planet
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Position of mouse
    renderer.domElement.addEventListener('click', event => {
        
        // Center coordinates of mouse click on canvas
        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

        // Put rays where we click
        raycaster.setFromCamera(mouse, camera);

        // Compute point 10 units away from where we clicked
        const placementOfPlanet = new THREE.Vector3()
            .copy(raycaster.ray.direction)
            .multiplyScalar(10)
            .add(raycaster.ray.origin);

            // Create planet to put in position of coordinates from above
            const geometry = new THREE.SphereGeometry(1, 16, 16);
            const material = new THREE.MeshStandardMaterial({ color: 0xff0000});
            const planet = new THREE.Mesh(geometry, material);
            planet.position.copy(placementOfPlanet);
            scene.add(planet);
    });
}