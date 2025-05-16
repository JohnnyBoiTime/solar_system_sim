import * as THREE from 'three';


export function handleCollisions(scene, camera, planets, collisionExplosion) {

    // Amount of planets currently spawned in
    const numOfPlanets = planets.length;

    // Get all the planets that are still intact and have not collided with another
    const intactPlanets = planets.filter(planet => planet.alive);

    // Go through each planet and compare with another planet
    for (let i = 0; i < numOfPlanets; i++) {

        const planet1 = planets[i]

        if (!planet1.alive) continue;
        for (let j = i + 1; j < numOfPlanets; j++) {
            if (i == j) continue;
             const planet2 = planets[j];

             if (!planet2.alive) continue;

            // Distance between the center of the planets
            const distance = new THREE.Vector3().subVectors(planet1.body.position, planet2.body.position)
            const distanceBetweenPlanets = distance.length();
            const minimumDistance = planet1.radius + planet2.radius;
        
            // Planets have collided
            if (distanceBetweenPlanets < minimumDistance) {


                console.log("COLLIDED!");
                

                // Put explosion between the planets
                const midPointOfPlanets = planet1.body.position.clone()
                                    .add(planet2.body.position)
                                    .multiplyScalar(0.5);

                // Only plays animations on planets that are alive
                if (planet1.alive == true && planet2.alive == true && planet1.mass > 0.00001 && planet2.mass > 0.00001) {                    
                    collisionExplosion._AddParticles(midPointOfPlanets);
                    scene.remove(planet1.body);
                    scene.remove(planet2.body);
                    planet1.alive = false;
                    planet2.alive = false;
                    planet1.mass = 0.00001;
                    planet2.mass = 0.00001;
                }
            }
        
        }
    }
}