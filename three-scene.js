class ThreeScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.composer = null;
        this.container = null;
        this.mouse = { x: 0, y: 0 };
        this.objects = [];
        this.particles = null;
        this.shaderMaterials = null;
        this.time = 0;
        this.scrollPercent = 0;
        this.init();
    }
    init() {
        if (!this.checkWebGLSupport()) {
            console.warn('WebGL not supported, falling back to 2D');
            return;
        }
        this.container = document.getElementById('three-container');
        if (!this.container) return;
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupControls();
        this.setupPostProcessing();
        this.setupLights();
        this.createObjects();
        this.setupEventListeners();
        this.animate();
    }
    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 1, 1000);
    }
    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.z = 5;
    }
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);
    }
    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = false;
        this.controls.enablePan = false;
        this.controls.minPolarAngle = Math.PI * 0.4;
        this.controls.maxPolarAngle = Math.PI * 0.6;
        this.controls.minAzimuthAngle = -Math.PI * 0.2;
        this.controls.maxAzimuthAngle = Math.PI * 0.2;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;
    }
    setupPostProcessing() {
        this.composer = new THREE.EffectComposer(this.renderer);
        const renderPass = new THREE.RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        const bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, 0.4, 0.85
        );
        bloomPass.renderToScreen = true;
        this.composer.addPass(bloomPass);
    }
    setupLights() {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
        const light1 = new THREE.PointLight(0x005BBB, 2, 100);
        light1.position.set(10, 10, 10);
        this.scene.add(light1);
        const light2 = new THREE.PointLight(0x0080FF, 1.5, 100);
        light2.position.set(-10, -10, -10);
        this.scene.add(light2);
        const light3 = new THREE.PointLight(0x00D4AA, 1, 100);
        light3.position.set(0, 10, -10);
        this.scene.add(light3);
    }
    createObjects() {
        this.shaderMaterials = new ShaderMaterials();
        this.createFloatingShapes();
        this.createCodeCube();
        this.createNameParticles();
        this.createLiquidBackground();
    }
    createFloatingShapes() {
        const icosahedronGeometry = new THREE.IcosahedronGeometry(0.5, 0);
        const icosahedron = new THREE.Mesh(
            icosahedronGeometry, 
            this.shaderMaterials.getMaterial('holographic')
        );
        icosahedron.position.set(-2, 1, 0);
        icosahedron.userData = { rotationSpeed: 0.01, floatSpeed: 0.005 };
        this.scene.add(icosahedron);
        this.objects.push(icosahedron);
        const torusGeometry = new THREE.TorusGeometry(0.3, 0.1, 16, 100);
        const torus = new THREE.Mesh(
            torusGeometry, 
            this.shaderMaterials.getMaterial('liquidMorph')
        );
        torus.position.set(2, -1, 0);
        torus.userData = { rotationSpeed: 0.02, floatSpeed: 0.003 };
        this.scene.add(torus);
        this.objects.push(torus);
        const octahedronGeometry = new THREE.OctahedronGeometry(0.4, 0);
        const octahedron = new THREE.Mesh(
            octahedronGeometry, 
            this.shaderMaterials.getMaterial('distortion')
        );
        octahedron.position.set(0, 2, -1);
        octahedron.userData = { rotationSpeed: 0.015, floatSpeed: 0.004 };
        this.scene.add(octahedron);
        this.objects.push(octahedron);
    }
    createCodeCube() {
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 512, 512);
        ctx.fillStyle = '#0080FF';
        ctx.font = '14px monospace';
        const codeLines = [
            'const developer = {',
            '  name: "Anania Sileshi",',
            '  skills: ["React", "Node.js"],',
            '  passion: "Full Stack",',
            '  create: () => "Excellence"',
            '};'
        ];
        codeLines.forEach((line, i) => {
            ctx.fillText(line, 20, 30 + i * 20);
        });
        const texture = new THREE.CanvasTexture(canvas);
        const cubeMaterial = new THREE.MeshPhongMaterial({
            map: texture,
            emissive: 0x0080FF,
            emissiveIntensity: 0.1
        });
        const codeCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        codeCube.position.set(0, 0, 0);
        codeCube.userData = { rotationSpeed: 0.005, floatSpeed: 0.002 };
        this.scene.add(codeCube);
        this.objects.push(codeCube);
    }
    createNameParticles() {
        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = 2 + Math.random() * 2;
            positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.5;
            positions[i * 3 + 1] = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.5;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
            colors[i * 3] = 0.0 + Math.random() * 0.3;
            colors[i * 3 + 1] = 0.36 + Math.random() * 0.2;
            colors[i * 3 + 2] = 0.73 + Math.random() * 0.27;
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const material = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.8
        });
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    createLiquidBackground() {
        const planeGeometry = new THREE.PlaneGeometry(20, 20, 50, 50);
        const liquidPlane = new THREE.Mesh(
            planeGeometry,
            this.shaderMaterials.getMaterial('liquidMorph')
        );
        liquidPlane.position.z = -5;
        liquidPlane.rotation.x = -Math.PI / 4;
        this.scene.add(liquidPlane);
    }
    setupEventListeners() {
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('scroll', () => this.onScroll());
    }
    onWindowResize() {
        if (!this.camera || !this.renderer) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        if (this.composer) {
            this.composer.setSize(window.innerWidth, window.innerHeight);
        }
    }
    onScroll() {
        const scrollY = window.pageYOffset;
        this.scrollPercent = scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        if (this.camera) {
            this.camera.position.z = 5 + this.scrollPercent * 3;
            this.camera.rotation.x = this.scrollPercent * 0.2;
        }
    }
    animate() {
        requestAnimationFrame(() => this.animate());
        if (!this.scene || !this.camera) return;
        this.time += 0.01;
        if (this.shaderMaterials) {
            this.shaderMaterials.updateUniforms(this.time, this.mouse, this.scrollPercent);
        }
        this.objects.forEach((obj, index) => {
            obj.rotation.x += obj.userData.rotationSpeed;
            obj.rotation.y += obj.userData.rotationSpeed * 0.7;
            const time = Date.now() * 0.001;
            obj.position.y += Math.sin(time + index) * obj.userData.floatSpeed;
            const targetX = this.mouse.x * 0.8;
            const targetY = this.mouse.y * 0.8;
            obj.position.x += (targetX - obj.position.x) * 0.04;
            obj.position.y += (targetY - obj.position.y) * 0.04;
        });
        if (this.particles) {
            this.particles.rotation.y += 0.001;
            this.particles.rotation.x += 0.0005;
            const time = Date.now() * 0.0005;
            this.particles.position.y = Math.sin(time) * 0.5;
        }
        if (this.controls) {
            this.controls.update();
        }
        if (this.composer) {
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    }
    optimizeForMobile() {
        if (window.innerWidth < 768) {
            if (this.particles) {
                const newGeometry = new THREE.BufferGeometry();
                const positions = new Float32Array(500 * 3);
                const colors = new Float32Array(500 * 3);
                for (let i = 0; i < 500; i++) {
                    positions[i * 3] = (Math.random() - 0.5) * 10;
                    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
                    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
                    colors[i * 3] = Math.random();
                    colors[i * 3 + 1] = Math.random();
                    colors[i * 3 + 2] = Math.random();
                }
                newGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                newGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
                this.particles.geometry.dispose();
                this.particles.geometry = newGeometry;
            }
            if (this.composer) {
                this.composer.dispose();
                this.composer = null;
            }
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    window.threeScene = new ThreeScene();
    window.threeScene.optimizeForMobile();
});
