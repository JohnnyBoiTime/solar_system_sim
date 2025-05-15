import * as THREE from 'three';


export function handleCollisions(scene, camera, planets, collisionExplosion) {

    // Amount of planets currently spawned in
    const numOfPlanets = planets.length;

    // Go through each planet and compare with another planet
    for (let i = 0; i < numOfPlanets; i++) {
        for (let j = i + 1; j < numOfPlanets; j++) {
            const planet1 = planets[i];
            const planet2 = planets[j];

            // Distance between the center of the planets
            const distance = new THREE.Vector3().subVectors(planet1.body.position, planet2.body.position)
            const distanceBetweenPlanets = distance.length();
            const minimumDistance = planet1.radius + planet2.radius;
        
            // Planets have collided
            if (distanceBetweenPlanets < minimumDistance) {

                console.log("COLLIDED!");

                // Calculate midpoint, add an animation later
                const midPointOfPlanets = planet1.body.position.clone()
                                            .add(planet2.body.position)
                                            .multiplyScalar(0.5);

                collisionExplosion._AddParticles(midPointOfPlanets);

                // Remove the planets from the scene
                scene.remove(planet1.body);
                scene.remove(planet2.body);

                planets.splice(j, 1); 
                planets.splice(i, 1);  

            }
        
        }
    }
    
}