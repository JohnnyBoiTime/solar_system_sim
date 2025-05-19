import * as THREE from 'three';
import SolarSystem from './SolarSystem.js';
import Controls from './Controls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

export default class App {
  constructor() {
    this.simulationSpeedMultiplier = 1.0;
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
    this.solarSystem = new SolarSystem(this.scene, this.camera, this.renderer.domElement, this.controls);
    this.inputController = new Controls(this.controls);

    // Simulation time
    this.clock = new THREE.Clock();
  }

  // Renderers
  _SetupRenderer() {
    
    // Three.js renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.25;
    document.body.appendChild(this.renderer.domElement);

    // Laben renderer, to label things!
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0px';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(this.labelRenderer.domElement);
  }

  // Basic camera setup
  _SetupCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100000);
    this.camera.position.set(10, 100, 500);
  }

  // Hud stuff
  _SetUpDomElements() {
    this.speedSlider = document.getElementById('simSpeedSlider');
    this.speedValue = document.getElementById('speedOfSim');

    this.speedSlider.addEventListener('input', e => {
      this.simulationSpeedMultiplier = parseFloat(e.target.value);
      this.speedValue.textContent = this.simulationSpeedMultiplier.toFixed(1) + 'x';
    })
  }

  // Setup for the controls of the simulation
  _SetupControls() {
    this.controls = new PointerLockControls(this.camera, this.renderer.domElement);
    const wrapper = this.controls.getObject();
    this.scene.add(wrapper);
    this._RegisterInputEvents();
    this._SetUpDomElements();
  }

  
  // Have pressing keys do things and resizing camera correctly
  _RegisterInputEvents() {
    document.addEventListener('keydown', (e) => this.inputController.handleKeyDown(e));
    document.addEventListener('keyup',   (e) => this.inputController.handleKeyUp(e));
    window.addEventListener('resize', () => {
      const width = window.innerWidth, height = window.innerHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
      this.labelRenderer.setSize(width, height);
    })
  }

  // Starts the simulation
  start() {
    this._Animate();
  }

  // Basic animation loop
  _Animate() {
    const delta = this.clock.getDelta();

    const simulationSpeed = delta * this.simulationSpeedMultiplier;

    this.inputController.update(delta);
    this.solarSystem.update(simulationSpeed);

    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);

    requestAnimationFrame(() => this._Animate());
  }
}