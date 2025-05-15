// https://www.youtube.com/watch?v=OFqENgtqRAY

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const _VS = `
uniform float pointMultiplier;

attribute float size;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = size * pointMultiplier / gl_Position.w;
}`;

const _FS = `
uniform sampler2D diffuseTexture;

void main() {
    gl_FragColor = texture2D(diffuseTexture, gl_PointCoord);
}`;


class ParticleSystem {
    constructor(params) {
        const uniforms = {
            diffuseTexture: {
                value: new THREE.TextureLoader().load('../textures/particleTextures/fire.png')
            },
            pointMultiplier: {
                value: window.innerHeight / (2.0 * Math.tan(0.5 * 60 * Math.PI / 180))
            }
        };

    this._material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: _VS,
        fragmentShader: _FS,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        transparent: true,
        vertexColors: true
    });

    this._camera = params.camera;
    this._particles = [];

    this._geometry = new THREE.BufferGeometry();
    this._geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3));

    this._points = new THREE.Points(this._geometry, this._material);

    params.parent.add(this._points);
    
    }

    _AddParticles() {
        for (let i = 0; i < 10; i++) {
            this._particles.push({
                position: new THREE.Vector3(
                    (Math.random() * 2 - 1) * 1.0,
                    (Math.random() * 2 - 1) * 1.0,
                    (Math.random() * 2 - 1) * 1.0),
               size: Math.random() * 2.0,     
            });
        }     
    }

    _updateGeometry() {
        const positions = [];

        for (let particle of this._particles) {
            positions.push(particle.x, particle.y, particle.z);
        }

        this._geometry.setAttribute(
            'position', new THREE.Float32BufferAttribute(positions, 3));

        this._geometry.attributes.position.needsUpdate = true;    
    }

    _updateParticles(timeElapsed) {
        this._particles.sort((a, b) => {
            const d1 = this._camera.position.distanceTo(a.position);
            const d2 = this._camera.positon.distanceTo(b.position);

            if (d1 > d2) {
                return -1;
            }

            if (d1 < d2) {
                return 1;
            }

            return 0;
        });
    }

    Step(timeElapsed) {
        this._updateParticles(timeElapsed);
        this._updateGeometry();
    }
}

