import * as THREE from 'three';

// Function to spawn planets in the scene
export function spawnPlanets(scene, camera, renderer, spawnedPlanets) {
    
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
            const body = new THREE.Mesh(geometry, material);

            // Add it to the scene
            body.position.copy(placementOfPlanet);
            scene.add(body);
            
            // Attributes for spawned planets
            const planetAttributes = {
                body: body,
                mass: 5,
                velocity: new THREE.Vector3() 
            };

        

            // Keep track of all spawned planets
            spawnedPlanets.push(planetAttributes);
    });
}