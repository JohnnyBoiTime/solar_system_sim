import * as THREE from 'three';
import SolarSystem from './SolarSystem.js';
import Controls from './Controls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

export default class App {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    
    // Create the scene 
    this.scene = new THREE.Scene();

    // Set up the render, camera, and scene
    this._SetupRenderer();

    this._SetupCamera();

    this._SetupControls();

    // Create the solar system and controls to navigate around it
    this.solarSystem = new SolarSystem(this.scene, this.camera, this.renderer.domElement);
    this.inputController = new Controls(this.controls);

    // Simulation time
    this.clock = new THREE.Clock();
  }

  // Basic three.js render setup
  _SetupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.25;
    document.body.appendChild(this.renderer.domElement);
  }

  // Basic camera setup
  _SetupCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100000);
    this.camera.position.set(10, 100, 500);
  }

  // Setup for the controls of the simulation
  _SetupControls() {
    this.controls = new PointerLockControls(this.camera, this.renderer.domElement);
    const wrapper = this.controls.getObject();
    this.scene.add(wrapper);
    this._RegisterInputEvents();
  }

  
  // Have pressing keys do things
  _RegisterInputEvents() {
    document.addEventListener('keydown', (e) => this.inputController.handleKeyDown(e));
    document.addEventListener('keyup',   (e) => this.inputController.handleKeyUp(e));
  }

  // Starts the simulation
  start() {
    this._Animate();
  }

  // Basic animation loop
  _Animate() {
    const delta = this.clock.getDelta();

    this.inputController.update(delta);
    this.solarSystem.update(delta);

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(() => this._Animate());
  }
}