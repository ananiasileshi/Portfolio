const liquidMorphVertexShader = `
    uniform float time;
    uniform vec2 mouse;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    void main() {
        vUv = uv;
        vPosition = position;
        vNormal = normal;
        vec3 pos = position;
        float noise = sin(pos.x * 10.0 + time) * cos(pos.y * 10.0 + time) * 0.1;
        pos += normal * noise;
        float dist = distance(pos.xy, mouse);
        pos.z += sin(dist * 5.0 - time * 3.0) * 0.2;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;
const liquidMorphFragmentShader = `
    uniform float time;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    void main() {
        vec2 uv = vUv;
        float gradient = (sin(time + uv.x * 3.0) + 1.0) * 0.5;
        vec3 color = mix(color1, color2, gradient);
        color = mix(color, color3, sin(time + uv.y * 2.0) * 0.5 + 0.5);
        float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        color += fresnel * 0.3;
        float noise = sin(uv.x * 20.0 + time) * cos(uv.y * 20.0 + time) * 0.1;
        color += noise * 0.1;
        gl_FragColor = vec4(color, 0.8);
    }
`;
const holographicVertexShader = `
    uniform float time;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    void main() {
        vUv = uv;
        vPosition = position;
        vNormal = normalize(normalMatrix * normal);
        vViewPosition = normalize(modelViewMatrix * vec4(position, 1.0)).xyz;
        vec3 pos = position;
        pos.y += sin(time + position.x * 2.0) * 0.02;
        pos.x += cos(time + position.y * 2.0) * 0.02;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;
const holographicFragmentShader = `
    uniform float time;
    uniform vec3 baseColor;
    uniform vec3 holographicColor;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    void main() {
        vec2 uv = vUv;
        vec3 color = baseColor;
        float rainbow = sin(time + uv.x * 10.0) * 0.5 + 0.5;
        color = mix(color, holographicColor, rainbow * 0.3);
        float scanline = sin(uv.y * 50.0 + time * 10.0) * 0.5 + 0.5;
        color *= (0.8 + scanline * 0.2);
        float fresnel = pow(1.0 - abs(dot(vNormal, vViewPosition)), 3.0);
        color += fresnel * holographicColor * 0.5;
        float edge = pow(fwidth(vUv.x) + fwidth(vUv.y), 0.5);
        color += edge * holographicColor * 2.0;
        float flicker = sin(time * 15.0) * 0.05 + 0.95;
        color *= flicker;
        gl_FragColor = vec4(color, 0.9);
    }
`;
const distortionVertexShader = `
    uniform float time;
    uniform float distortionStrength;
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
        vUv = uv;
        vPosition = position;
        vec3 pos = position;
        pos.x += sin(pos.y * 10.0 + time) * distortionStrength;
        pos.y += cos(pos.x * 10.0 + time) * distortionStrength;
        pos.z += sin(pos.x * 5.0 + pos.y * 5.0 + time) * distortionStrength * 0.5;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;
const distortionFragmentShader = `
    uniform float time;
    uniform vec3 color1;
    uniform vec3 color2;
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
        vec2 uv = vUv;
        float scrollEffect = sin(time * 0.5 + uv.y * 3.0) * 0.5 + 0.5;
        vec3 color = mix(color1, color2, scrollEffect);
        float noise = sin(uv.x * 20.0 + time) * cos(uv.y * 20.0 + time) * 0.1;
        color += noise * 0.2;
        float glow = sin(time * 2.0) * 0.3 + 0.7;
        color *= glow;
        gl_FragColor = vec4(color, 0.7);
    }
`;
class ShaderMaterials {
    constructor() {
        this.materials = {};
        this.createMaterials();
    }
    createMaterials() {
        this.materials.liquidMorph = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                mouse: { value: new THREE.Vector2(0, 0) },
                color1: { value: new THREE.Color(0x005BBB) },
                color2: { value: new THREE.Color(0x0080FF) },
                color3: { value: new THREE.Color(0x00D4AA) }
            },
            vertexShader: liquidMorphVertexShader,
            fragmentShader: liquidMorphFragmentShader,
            transparent: true,
            side: THREE.DoubleSide
        });
        this.materials.holographic = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                baseColor: { value: new THREE.Color(0x005BBB) },
                holographicColor: { value: new THREE.Color(0x7C3AED) }
            },
            vertexShader: holographicVertexShader,
            fragmentShader: holographicFragmentShader,
            transparent: true,
            side: THREE.DoubleSide
        });
        this.materials.distortion = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                distortionStrength: { value: 0.1 },
                color1: { value: new THREE.Color(0x005BBB) },
                color2: { value: new THREE.Color(0xFF6B35) }
            },
            vertexShader: distortionVertexShader,
            fragmentShader: distortionFragmentShader,
            transparent: true,
            side: THREE.DoubleSide
        });
    }
    getMaterial(type) {
        return this.materials[type];
    }
    updateUniforms(time, mouse, scrollPercent) {
        if (this.materials.liquidMorph) {
            this.materials.liquidMorph.uniforms.time.value = time;
            this.materials.liquidMorph.uniforms.mouse.value = mouse;
        }
        if (this.materials.holographic) {
            this.materials.holographic.uniforms.time.value = time;
        }
        if (this.materials.distortion) {
            this.materials.distortion.uniforms.time.value = time + scrollPercent * Math.PI * 2;
            this.materials.distortion.uniforms.distortionStrength.value = 0.1 + scrollPercent * 0.2;
        }
    }
}
window.ShaderMaterials = ShaderMaterials;
