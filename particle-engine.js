class ParticleEngine {
    constructor() {
        this.particles = [];
        this.config = {
            maxParticles: 2000,
            gravity: 0.1,
            wind: { x: 0, y: 0 },
            friction: 0.99,
            connectionDistance: 100,
            mouseRadius: 150,
            mouseForce: 0.5
        };
        this.mouse = { x: 0, y: 0 };
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.isMobile = window.innerWidth < 768;
        this.init();
    }
    init() {
        this.setupCanvas();
        this.createParticles();
        this.setupEventListeners();
        this.optimizeForMobile();
        this.animate();
    }
    setupCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'particle-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    createParticles() {
        const particleCount = this.isMobile ? 500 : this.config.maxParticles;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.canvas.width / 2, this.canvas.height / 2));
        }
    }
    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mouse.x = e.touches[0].clientX;
                this.mouse.y = e.touches[0].clientY;
            }
        });
        window.addEventListener('click', (e) => {
            this.createExplosion(e.clientX, e.clientY);
        });
    }
    optimizeForMobile() {
        if (this.isMobile) {
            this.config.maxParticles = 500;
            this.config.connectionDistance = 50;
            this.config.mouseRadius = 100;
        }
    }
    createExplosion(x, y) {
        const explosionParticles = 50;
        const colors = ['#005BBB', '#0080FF', '#00D4AA', '#7C3AED', '#FF6B35'];
        for (let i = 0; i < explosionParticles; i++) {
            const particle = new Particle(x, y);
            const angle = (Math.PI * 2 * i) / explosionParticles;
            const speed = Math.random() * 5 + 2;
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed;
            particle.color = colors[Math.floor(Math.random() * colors.length)];
            particle.size = Math.random() * 3 + 1;
            particle.life = 1;
            particle.decay = 0.02;
            this.particles.push(particle);
            if (this.particles.length > this.config.maxParticles + explosionParticles) {
                this.particles.splice(0, explosionParticles);
            }
        }
    }
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.vy += this.config.gravity;
            particle.vx += this.config.wind.x;
            particle.vy += this.config.wind.y;
            particle.vx *= this.config.friction;
            particle.vy *= this.config.friction;
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < this.config.mouseRadius) {
                const force = (1 - distance / this.config.mouseRadius) * this.config.mouseForce;
                particle.vx += (dx / distance) * force;
                particle.vy += (dy / distance) * force;
            }
            particle.x += particle.vx;
            particle.y += particle.vy;
            if (particle.life !== undefined) {
                particle.life -= particle.decay;
                if (particle.life <= 0) {
                    this.particles.splice(i, 1);
                    continue;
                }
            }
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -0.8;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -0.8;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }
        }
    }
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawConnections();
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life !== undefined ? particle.life : 1;
            this.ctx.fillStyle = particle.color || '#005BBB';
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = particle.color || '#005BBB';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.config.connectionDistance) {
                    this.ctx.save();
                    const opacity = 1 - (distance / this.config.connectionDistance);
                    this.ctx.globalAlpha = opacity * 0.3;
                    this.ctx.strokeStyle = '#005BBB';
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            }
        }
    }
    morphToText(text) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        tempCtx.font = 'bold 80px Bebas Neue';
        tempCtx.fillStyle = '#005BBB';
        tempCtx.textAlign = 'center';
        tempCtx.textBaseline = 'middle';
        tempCtx.fillText(text, tempCanvas.width / 2, tempCanvas.height / 2);
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const data = imageData.data;
        this.particles = [];
        for (let y = 0; y < tempCanvas.height; y += 4) {
            for (let x = 0; x < tempCanvas.width; x += 4) {
                const index = (y * tempCanvas.width + x) * 4;
                const alpha = data[index + 3];
                if (alpha > 128) {
                    const particle = new Particle(x, y);
                    particle.targetX = x;
                    particle.targetY = y;
                    particle.forming = true;
                    this.particles.push(particle);
                }
            }
        }
        this.animateToFormation();
    }
    animateToFormation() {
        const animate = () => {
            let allFormed = true;
            this.particles.forEach(particle => {
                if (particle.forming) {
                    const dx = particle.targetX - particle.x;
                    const dy = particle.targetY - particle.y;
                    particle.x += dx * 0.1;
                    particle.y += dy * 0.1;
                    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                        allFormed = false;
                    } else {
                        particle.forming = false;
                        particle.vx = (Math.random() - 0.5) * 0.5;
                        particle.vy = (Math.random() - 0.5) * 0.5;
                    }
                }
            });
            if (!allFormed) {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }
    createConstellation(technologies) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(this.canvas.width, this.canvas.height) * 0.3;
        this.particles = [];
        technologies.forEach((tech, index) => {
            const angle = (index / technologies.length) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            const nodeParticle = new Particle(x, y);
            nodeParticle.size = 4;
            nodeParticle.color = '#005BBB';
            nodeParticle.isNode = true;
            nodeParticle.technology = tech;
            this.particles.push(nodeParticle);
            const connectionCount = Math.floor(Math.random() * 3) + 2;
            for (let i = 0; i < connectionCount; i++) {
                const connectionParticle = new Particle(x, y);
                connectionParticle.targetNode = nodeParticle;
                connectionParticle.color = '#0080FF';
                connectionParticle.size = 1;
                this.particles.push(connectionParticle);
            }
        });
        this.animateConstellation();
    }
    animateConstellation() {
        const animate = () => {
            this.particles.forEach(particle => {
                if (particle.targetNode) {
                    const dx = particle.targetNode.x - particle.x;
                    const dy = particle.targetNode.y - particle.y;
                    particle.vx += dx * 0.02;
                    particle.vy += dy * 0.02;
                    particle.vx *= 0.95;
                    particle.vy *= 0.95;
                } else if (particle.isNode) {
                    const time = Date.now() * 0.001;
                    particle.x += Math.cos(time + particle.technology.length) * 0.5;
                    particle.y += Math.sin(time + particle.technology.length) * 0.5;
                }
                particle.x += particle.vx;
                particle.y += particle.vy;
            });
            requestAnimationFrame(animate);
        };
        animate();
    }
    setWind(x, y) {
        this.config.wind.x = x;
        this.config.wind.y = y;
    }
    setGravity(gravity) {
        this.config.gravity = gravity;
    }
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        this.updateParticles();
        this.drawParticles();
    }
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.size = Math.random() * 2 + 1;
        this.color = '#005BBB';
        this.life = 1;
        this.decay = 0;
        this.forming = false;
        this.targetX = null;
        this.targetY = null;
        this.isNode = false;
        this.targetNode = null;
        this.technology = null;
    }
}
document.addEventListener('DOMContentLoaded', () => {
    window.particleEngine = new ParticleEngine();
    setTimeout(() => {
        const technologies = ['React', 'Node.js', 'Python', 'MongoDB', 'AWS'];
        window.particleEngine.createConstellation(technologies);
    }, 2000);
});
