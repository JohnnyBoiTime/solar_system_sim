import * as THREE from 'three';

// Create the scene and the camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Creates the renderer and sets its size
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a basic cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Now to animate the cube
function animate() {

    // Request animation frame for smooth rendering
    requestAnimationFrame(animate);

    // Rotate the cube 
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Render via the camera
    renderer.render(scene, camera);
}

animate();
