import * as THREE from 'three';

export function createOrbitPathsOfPlanets(radiusFromSun, segments = 64, color = 0x888888) {
    const curve = new THREE.EllipseCurve(
        0, 0, // Center of ellipse at axis origin (0,0)           
        radiusFromSun, radiusFromSun,   // x and y radius of ellipse      
        0, 2 * Math.PI, // starting and ending angles of ellipse
        false, // false = clockwise, true = counter-clockwise         
        0 // rotation of ellipse in radians              
    );

    // Get points of the curve
    const pointsIn2d = curve.getPoints(segments);

    // Convert 2D points to 3D points
    const pointsIn3d = pointsIn2d.map(point => new THREE.Vector3(point.x, 0, point.y));

    // Create a line from the points
    const geometry = new THREE.BufferGeometry().setFromPoints(pointsIn3d);
    const material = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.6 });
    const lineOfOrbit = new THREE.Line(geometry, material);

    // Set the line to be a loop orbit around the sun
    return lineOfOrbit;
}