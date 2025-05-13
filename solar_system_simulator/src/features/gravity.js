import * as THREE from 'three';

// dt = little change in time
export function gravitationalPull(planets, dt) {
    const acceleration = planets.map(_ => new THREE.Vector3());

    // Compute force between each planet
    for (let i = 0; i < planets.length; i++) {

        // Pair each planet with the another, excluding itself
        for (let j = i + 1; j < planets.length; j++) {
            const planet1 = planets[i], planet2 = planets[j];

            // Get R vectir (planet 1 pointing to planet 2)
            const rVector = new THREE.Vector3().subVectors(planet2.mesh.position, planet1.mesh.position);
            const distanceBetweenPlanets = rVector.lengthSq() + 0.01; // Added 0.01 so we don't crash by div0
            const gravForce = G * (planet1.mass * planet2.mass) / distanceBetweenPlanets; // big G formula
            
            // Normalize vector in a direction 
            const totalForce = rVector.normalize().multiplyScalar(gravForce);

            // totalForce / mass (F = ma => F/m = a). Also N2L, equal opposite force 
            // which is why we have the negative sign
            acceleration[i].addScaledVector(totalForce, 1 / planet1.mass);
            acceleration[j].addScaledVector(totalForce, -1 / planet2.mass)
        }
    }

    // We are integrating the velocity and position by dt
    planets.forEach((planet, index) => {
        planet.velocity.addScaledVector(acceleration[index], dt);
        planet.mesh.position.addScaledVector(planet.velocty, dt);
    });
}