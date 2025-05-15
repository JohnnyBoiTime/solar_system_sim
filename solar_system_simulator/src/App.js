import * as THREE from 'three';
import SolarSystem from './SolarSystem.js';
import Controls from './Controls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

export default class App {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    
    this.scene = new THREE.Scene();

    this._SetupRenderer();

    this._SetupCamera();

    this._SetupControls();

    this.solarSystem = new SolarSystem(this.scene, this.camera, this.renderer.domElement);
    this.inputController = new Controls(this.controls);

    this.clock = new THREE.Clock();
  }

  _SetupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.25;
    document.body.appendChild(this.renderer.domElement);
  }

  _SetupCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100000);
    this.camera.position.set(10, 100, 500);
  }

  _SetupControls() {
    this.controls = new PointerLockControls(this.camera, this.renderer.domElement);
    const wrapper = this.controls.getObject();
    this.scene.add(wrapper);
    this._RegisterInputEvents();
  }

  _RegisterInputEvents() {
    document.addEventListener('keydown', (e) => this.inputController.handleKeyDown(e));
    document.addEventListener('keyup',   (e) => this.inputController.handleKeyUp(e));
  }

  start() {
    this._Animate();
  }

  _Animate() {
    const delta = this.clock.getDelta();

    this.inputController.update(delta);
    this.solarSystem.update(delta);

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(() => this._Animate());
  }
}