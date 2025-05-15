import * as THREE from 'three';

// dt = little change in time
export function gravitationalPull(planets, dt) {
const G = 6.67e-1; // Can't really do a big G here or else the planets barely move :(

    const numPlanets = planets.length;

    const acceleration = Array.from({length: numPlanets}, () => new THREE.Vector3());

    // Compute force between each planet
    for (let i = 0; i < numPlanets; i++) {

        // Pair each planet with the another, excluding itself
        for (let j = i + 1; j < numPlanets; j++) {
            const planet1 = planets[i], planet2 = planets[j];

            // Get R vectir (planet 1 pointing to planet 2)
            const rVector = new THREE.Vector3().subVectors(planet2.body.position, planet1.body.position);
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
        planet.body.position.addScaledVector(planet.velocity, dt);
    });
}