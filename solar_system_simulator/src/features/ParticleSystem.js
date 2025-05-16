// Particle logic: https://www.youtube.com/watch?v=OFqENgtqRAY

import * as THREE from 'three';
import fireTextureURL from '../textures/particleTextures/fire.jpg';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Vertex Shader. Runs once per vertex (corners/points of the shape)
// gl_position decides where each vertex goes on the screen.
// This pretty much positions the geometry in the scene by taking the 
// corners/vertexes of the shape and connects them together.

// Varying passes down the information from the vertex shader into the
// fragment shader.

// model space: Coordinate system where mesh is, all positions are relative to model
// view space: all positions are relative to camera
// Clip space: Where the vertices/fragments are in the cameras 3-d view
const _VS = `
uniform float pointMultiplier; 

attribute float size;
attribute float angle;
attribute vec4 colour;

varying vec4 vColour;
varying vec2 vAngle;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = size * pointMultiplier / gl_Position.w;

    vAngle = vec2(cos(angle), sin(angle));
    vColour = colour;
}`;

// Fragment Shader. Runs once per pixel that covers the shape
// Decides what color each pixel should be
// Gets data from the vertex shader, getting info for the color/angle.
// This pretty much paints inside of the shape the vertex shader created
const _FS = `
uniform sampler2D diffuseTexture;

varying vec4 vColour;
varying vec2 vAngle;

void main() {
    vec2 coords = (gl_PointCoord - 0.5) * mat2(vAngle.x, vAngle.y, -vAngle.y, vAngle.x) + 0.5;
    gl_FragColor = texture2D(diffuseTexture, coords) * vColour;
}`;

// Simplifying the above: the VS draws the shape, the FS shades it in. 


class LinearSpline {
    constructor(lerp) {
        this._points = [];
        this._lerp = lerp;
    }

    AddPoint(t, d) {
        this._points.push([t, d]);
    }

    Get(t) {
        let p1 = 0;

        for (let i = 0; i < this._points.length; i++) {
            if (this._points[i][0] >= t) {
                break;
            }
            p1 = i;
        }

        const p2 = Math.min(this._points.length - 1, p1 + 1);

        if (p1 == p2) {
            return this._points[p1][1];
        }

        return this._lerp(
            (t - this._points[p1][0]) / (
                this._points[p2][0] - this._points[p1][0]),
                this._points[p1][1], this._points[p2][1]);
         
    }
}

export default class ParticleSystem {
    constructor(params) {
        const uniforms = {
            diffuseTexture: {
                value: new THREE.TextureLoader().load(fireTextureURL)
            },
            pointMultiplier: {
                value: window.innerHeight / (2.0 * Math.tan(0.5 * 60 * Math.PI / 180))
            }
        };

    this._material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: _VS,
        fragmentShader: _FS,
        blending: THREE.NormalBlending,
        depthTest: true,
        depthWrite: false,
        transparent: true,
        vertexColors: true
    });

    this._camera = params.camera;
    this._particles = [];

    // Create buffers. 
    this._geometry = new THREE.BufferGeometry();
    this._geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
    this._geometry.setAttribute('size', new THREE.Float32BufferAttribute([], 1));
    this._geometry.setAttribute('colour', new THREE.Float32BufferAttribute([], 4));
    this._geometry.setAttribute('angle', new THREE.Float32BufferAttribute([], 1));

    this._points = new THREE.Points(this._geometry, this._material);

    params.parent.add(this._points);

    this._alphaSpline = new LinearSpline((t, a, b) => {
        return a + t * (b - a);
    });

    this._alphaSpline.AddPoint(0.0, 0.0);
    this._alphaSpline.AddPoint(0.1, 1.0);
    this._alphaSpline.AddPoint(0.5, 1.0);
    this._alphaSpline.AddPoint(1.0, 0.0);

    this._colorSpline = new LinearSpline((t, a, b) => {
        const c = a.clone();
        return c.lerp(b, t);
    });

    this._colorSpline.AddPoint(0.0, new THREE.Color(0xFF0000));
    this._colorSpline.AddPoint(0.2, new THREE.Color(0xFF0000));
    this._colorSpline.AddPoint(0.3, new THREE.Color(0x00FF00));
    this._colorSpline.AddPoint(0.5, new THREE.Color(0x00FF00));
    this._colorSpline.AddPoint(0.6, new THREE.Color(0x000000));
    this._colorSpline.AddPoint(1.0, new THREE.Color(0x000000));
    
    }

    _AddParticles(origin = new THREE.Vector3(0, 0, 0)) {
        for (let i = 0; i < 10; i++) {
            const newParticle = {
                position: origin.clone().add(new THREE.Vector3(
                    (Math.random() * 2 - 1),
                    (Math.random() * 2 - 1),
                    (Math.random() * 2 - 1),
                )),
               size: 1.0,     
               color: new THREE.Color(Math.random(), Math.random(), Math.random()),
               alpha: Math.random(),
               life: 0.1,
               rotation: Math.random() * 2.0 * Math.PI,
            };
            this._particles.push(newParticle);

            console.log("Particle spawn point: ", newParticle.position.x, newParticle.position.y, newParticle.position.z); 
        }     
    }

    _UpdateGeometry() {
        const positions = [];
        const sizes = [];
        const colors = [];
        const angles = [];

        // Update the positions, colors, size, rotations
        for (let particle of this._particles) {
            positions.push(particle.position.x, particle.position.y, particle.position.z);
            colors.push(particle.color.r, particle.color.g, particle.color.b, particle.alpha);
            sizes.push(particle.size);
            angles.push(particle.rotation);
        }

        // Sets attributes to be used in vertex and fragment shaders
        this._geometry.setAttribute(
            'position', new THREE.Float32BufferAttribute(positions, 3));
        this._geometry.setAttribute(
            'size', new THREE.Float32BufferAttribute(sizes, 1));
        this._geometry.setAttribute(
            'colour', new THREE.Float32BufferAttribute(colors, 4));            
        this._geometry.setAttribute(
            'angle', new THREE.Float32BufferAttribute(angles, 1));    
            


        this._geometry.attributes.position.needsUpdate = true;    
        this._geometry.attributes.size.needsUpdate = true;    
        this._geometry.attributes.colour.needsUpdate = true; 
        this._geometry.attributes.angle.needsUpdate = true;   
    }

    _UpdateParticles(timeElapsed) {

        for (let particle of this._particles) {
            particle.life -= timeElapsed;
        }

        this._particles = this._particles.filter(particle => {
            return particle.life > 0;
        });

        for (let particle of this._particles) {
            const t = 1.0 - particle.life / 5.0;

            particle.rotation += timeElapsed * 0.5;
            // particle.alpha = this._alphaSpline.Get(t);
            //particle.color.copy(this._colorSpline,Get(t));
        }

        this._particles.sort((a, b) => {
            const d1 = this._camera.position.distanceTo(a.position);
            const d2 = this._camera.position.distanceTo(b.position);

            if (d1 > d2) {
                return -1;
            }

            if (d1 < d2) {
                return 1;
            }

            return 0;
        });
    }

    step(timeElapsed) {
        this._UpdateParticles(timeElapsed);
        this._UpdateGeometry();
    }
}