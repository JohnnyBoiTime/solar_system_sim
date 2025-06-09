import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

// Function to spawn planets in the scene
export function spawnShips(scene, camera, domElement, spawnedShips, SpaceShip, ammoType, shipHealth, nameOfShip) {

    
    // Create ray and mouse to position where to palce planet
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();


    // Position of mouse
    const placeShip = () => {

        // Register ship name at click  time
        const shipName = nameOfShip();
        const ammo = ammoType();
        const health = shipHealth();
        
        // Center coordinates of mouse click on canvas
        mouse.x = (event.clientX / domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / domElement.clientHeight) * 2 + 1;

        // Put rays where we click
        raycaster.setFromCamera(mouse, camera);

        // Compute point 10 units away from where we clicked
        const placementOfShip = new THREE.Vector3()
            .copy(raycaster.ray.direction)
            .multiplyScalar(1000)
            .add(raycaster.ray.origin);

            // Set the ship type
            const ShipType = SpaceShip();
            const newShip = new ShipType(scene, placementOfShip, {model: SpaceShip.shipModel, scale: SpaceShip.shipScale, Ammunition: ammo})

            // Label that follows the planets around
            const div = document.createElement('div');
            div.className = 'label';
            div.textContent = shipName;
            div.style.marginTop = '1px';
            const label = new CSS2DObject(div);
            label.position.set(0, 10, 0);

            // Track all spawned ships
            spawnedShips.push(newShip); 

            // Make sure ship is fully loaded before adding the label
            newShip.modelLoaderPromise.then(shipInstance => {
                shipInstance.ship.add(label);
            })
           
    };1

    return {
        enable: () => domElement.addEventListener('mousedown', placeShip),
        disable: () => domElement.removeEventListener('mousedown', placeShip)
    };

}