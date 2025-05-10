import * as THREE from 'three';

export function createOrbitPathsOfPlanets(a, e, segments = 128, color = 0x888888) {
   
    // Computs the semi-minor axis
    const b = a * Math.sqrt(1 - (e * e));

    // Shifts center of the ellipse 
    const centerXAxis = -a * e;
  
    const curve = new THREE.EllipseCurve(
        centerXAxis, 0, // Center of ellipse at axis origin (0,0)           
        a, b,   // x and y radius of ellipse      
        0, 2 * Math.PI, // starting and ending angles of ellipse
        false, // false = clockwise, true = counter-clockwise         
        0 // rotation of ellipse in radians              
    );

    // Get points of the ellipse curve in 2 dimensions
    const pointsIn2d = curve.getPoints(segments);

    // Convert 2D points to 3D points
    const pointsIn3d = pointsIn2d.map(point => new THREE.Vector3(point.x, 0, point.y));

    // Create a line from the points mapped in 3D space
    const geometry = new THREE.BufferGeometry().setFromPoints(pointsIn3d);
    const material = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.6 });
    const lineOfOrbit = new THREE.Line(geometry, material);

    // Set the line to be a loop orbit around the sun
    return lineOfOrbit;
}