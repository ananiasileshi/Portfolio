class ParticleEffects {
    constructor() {
        this.effects = {
            background: null,
            cursorTrail: null,
            explosions: [],
            celebrations: [],
            transitions: []
        };
        this.init();
    }
    init() {
        this.setupBackgroundParticles();
        this.setupCursorTrail();
        this.setupClickExplosions();
        this.setupFormCelebration();
        this.setupSectionTransitions();
        this.setupLoadingParticles();
    }
    setupBackgroundParticles() {
        this.effects.background = new BackgroundParticles();
    }
    setupCursorTrail() {
        this.effects.cursorTrail = new CursorTrail();
    }
    setupClickExplosions() {
        document.addEventListener('click', (e) => {
            this.createClickExplosion(e.clientX, e.clientY);
        });
    }
    createClickExplosion(x, y) {
        const explosion = new ParticleExplosion(x, y, 'click');
        this.effects.explosions.push(explosion);
        setTimeout(() => {
            explosion.destroy();
            const index = this.effects.explosions.indexOf(explosion);
            if (index > -1) {
                this.effects.explosions.splice(index, 1);
            }
        }, 2000);
    }
    setupFormCelebration() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createFormCelebration();
            });
        }
    }
    createFormCelebration() {
        const form = document.getElementById('contactForm');
        const rect = form.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const celebration = new CelebrationEffect(centerX, centerY);
        this.effects.celebrations.push(celebration);
        setTimeout(() => {
            celebration.destroy();
            const index = this.effects.celebrations.indexOf(celebration);
            if (index > -1) {
                this.effects.celebrations.splice(index, 1);
            }
        }, 3000);
    }
    setupSectionTransitions() {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            ScrollTrigger.create({
                trigger: section,
                start: 'top 80%',
                onEnter: () => this.createSectionTransition(section),
                onLeave: () => this.clearSectionTransition(section)
            });
        });
    }
    createSectionTransition(section) {
        const transition = new SectionTransition(section);
        this.effects.transitions.push(transition);
    }
    clearSectionTransition(section) {
        const transition = this.effects.transitions.find(t => t.section === section);
        if (transition) {
            transition.clear();
            const index = this.effects.transitions.indexOf(transition);
            if (index > -1) {
                this.effects.transitions.splice(index, 1);
            }
        }
    }
    setupLoadingParticles() {
        const loader = document.querySelector('.loader');
        if (loader) {
            const loadingParticles = new LoadingParticles(loader);
            loadingParticles.start();
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'class' && 
                        mutation.target.classList.contains('hidden')) {
                        loadingParticles.stop();
                    }
                });
            });
            observer.observe(loader, { attributes: true });
        }
    }
    createCustomExplosion(x, y, type = 'custom', color = '#005BBB') {
        const explosion = new ParticleExplosion(x, y, type, color);
        this.effects.explosions.push(explosion);
        setTimeout(() => {
            explosion.destroy();
            const index = this.effects.explosions.indexOf(explosion);
            if (index > -1) {
                this.effects.explosions.splice(index, 1);
            }
        }, 2000);
    }
    createTextMorph(text, x, y) {
        const morph = new TextMorph(text, x, y);
        return morph;
    }
    destroy() {
        Object.values(this.effects).forEach(effect => {
            if (effect && typeof effect.destroy === 'function') {
                effect.destroy();
            }
        });
    }
}
class BackgroundParticles {
    constructor() {
        this.particles = [];
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.animationId = null;
        this.setupCanvas();
        this.createParticles();
        this.animate();
    }
    setupCanvas() {
        this.canvas.className = 'background-particles';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';
        this.canvas.style.opacity = '0.3';
        document.body.appendChild(this.canvas);
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    createParticles() {
        const particleCount = window.innerWidth < 768 ? 50 : 100;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new BackgroundParticle());
        }
    }
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });
    }
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}
class BackgroundParticle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = `hsla(${Math.random() * 60 + 200}, 70%, 50%, ${this.opacity})`;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0) this.x = window.innerWidth;
        if (this.x > window.innerWidth) this.x = 0;
        if (this.y < 0) this.y = window.innerHeight;
        if (this.y > window.innerHeight) this.y = 0;
        if (Math.random() < 0.01) {
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
        }
    }
    draw(ctx) {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}
class CursorTrail {
    constructor() {
        this.trail = [];
        this.maxTrailLength = 30;
        this.mouseX = 0;
        this.mouseY = 0;
        this.colors = ['#005BBB', '#0080FF', '#00D4AA', '#7C3AED'];
        this.init();
    }
    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.createTrailDot();
        });
    }
    createTrailDot() {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail-dot-enhanced';
        dot.style.left = this.mouseX + 'px';
        dot.style.top = this.mouseY + 'px';
        dot.style.background = this.colors[Math.floor(Math.random() * this.colors.length)];
        dot.style.boxShadow = `0 0 10px ${dot.style.background}`;
        document.body.appendChild(dot);
        this.trail.push(dot);
        gsap.fromTo(dot, {
            scale: 0,
            opacity: 1
        }, {
            scale: 1.5,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            onComplete: () => {
                dot.remove();
                this.trail.shift();
            }
        });
        if (this.trail.length > this.maxTrailLength) {
            const oldDot = this.trail.shift();
            oldDot.remove();
        }
    }
}
class ParticleExplosion {
    constructor(x, y, type = 'click', color = '#005BBB') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.color = color;
        this.particles = [];
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.animationId = null;
        this.setupCanvas();
        this.createParticles();
        this.animate();
    }
    setupCanvas() {
        this.canvas.className = 'particle-explosion';
        this.canvas.style.position = 'fixed';
        this.canvas.style.left = '0';
        this.canvas.style.top = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1000';
        document.body.appendChild(this.canvas);
    }
    createParticles() {
        const particleCount = this.type === 'click' ? 50 : 100;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = Math.random() * 8 + 2;
            const particle = {
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 4 + 2,
                opacity: 1,
                decay: 0.02
            };
            this.particles.push(particle);
        }
    }
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.2; // Gravity
            particle.opacity -= particle.decay;
            if (particle.opacity <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = this.color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = this.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
        if (this.particles.length === 0) {
            this.destroy();
        }
    }
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}
class CelebrationEffect {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.animationId = null;
        this.setupCanvas();
        this.createCelebrationParticles();
        this.animate();
    }
    setupCanvas() {
        this.canvas.className = 'celebration-effect';
        this.canvas.style.position = 'fixed';
        this.canvas.style.left = '0';
        this.canvas.style.top = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1000';
        document.body.appendChild(this.canvas);
    }
    createCelebrationParticles() {
        const colors = ['#00D4AA', '#FFD700', '#FF6B35', '#7C3AED'];
        const shapes = ['circle', 'star', 'heart'];
        for (let i = 0; i < 100; i++) {
            const angle = (Math.PI * 2 * i) / 100;
            const speed = Math.random() * 10 + 5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const particle = {
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 5,
                size: Math.random() * 6 + 2,
                color: color,
                shape: shape,
                opacity: 1,
                decay: 0.01,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.2
            };
            this.particles.push(particle);
        }
    }
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1;
            particle.opacity -= particle.decay;
            particle.rotation += particle.rotationSpeed;
            if (particle.opacity <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
            this.drawParticle(particle);
        }
        if (this.particles.length === 0) {
            this.destroy();
        }
    }
    drawParticle(particle) {
        this.ctx.save();
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.fillStyle = particle.color;
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate(particle.rotation);
        if (particle.shape === 'circle') {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (particle.shape === 'star') {
            this.drawStar(0, 0, 5, particle.size, particle.size / 2);
        } else if (particle.shape === 'heart') {
            this.drawHeart(0, 0, particle.size);
        }
        this.ctx.restore();
    }
    drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = y;
        const step = Math.PI / spikes;
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
        }
        this.ctx.lineTo(cx, cy - outerRadius);
        this.ctx.closePath();
        this.ctx.fill();
    }
    drawHeart(x, y, size) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + size / 4);
        this.ctx.quadraticCurveTo(x, y, x - size / 2, y - size / 4);
        this.ctx.quadraticCurveTo(x - size, y - size / 2, x, y - size / 4);
        this.ctx.quadraticCurveTo(x, y, x + size / 2, y - size / 4);
        this.ctx.quadraticCurveTo(x + size, y - size / 2, x, y);
        this.ctx.closePath();
        this.ctx.fill();
    }
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}
class SectionTransition {
    constructor(section) {
        this.section = section;
        this.particles = [];
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.animationId = null;
        this.setupCanvas();
        this.createTransitionParticles();
    }
    setupCanvas() {
        this.canvas.className = 'section-transition';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '5';
        this.section.appendChild(this.canvas);
    }
    createTransitionParticles() {
        const rect = this.section.getBoundingClientRect();
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            const particle = {
                x: Math.random() * rect.width,
                y: Math.random() * rect.height,
                targetX: Math.random() * rect.width,
                targetY: Math.random() * rect.height,
                size: Math.random() * 3 + 1,
                color: `hsla(${Math.random() * 60 + 200}, 70%, 50%, 0.8)`,
                speed: 0.02
            };
            this.particles.push(particle);
        }
    }
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(particle => {
            particle.x += (particle.targetX - particle.x) * particle.speed;
            particle.y += (particle.targetY - particle.y) * particle.speed;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    clear() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    destroy() {
        this.clear();
        if (this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}
class LoadingParticles {
    constructor(loader) {
        this.loader = loader;
        this.particles = [];
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.animationId = null;
        this.isActive = false;
        this.setupCanvas();
        this.createParticles();
    }
    setupCanvas() {
        this.canvas.className = 'loading-particles';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '10';
        this.loader.appendChild(this.canvas);
    }
    createParticles() {
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            const particle = {
                angle: (Math.PI * 2 * i) / particleCount,
                radius: 50,
                speed: 0.02,
                size: Math.random() * 2 + 1,
                color: '#005BBB'
            };
            this.particles.push(particle);
        }
    }
    start() {
        this.isActive = true;
        this.animate();
    }
    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    animate() {
        if (!this.isActive) return;
        this.animationId = requestAnimationFrame(() => this.animate());
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        this.particles.forEach((particle, index) => {
            particle.angle += particle.speed;
            const x = centerX + Math.cos(particle.angle) * particle.radius;
            const y = centerY + Math.sin(particle.angle) * particle.radius;
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = 0.6;
            this.ctx.beginPath();
            this.ctx.arc(x, y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    destroy() {
        this.stop();
        if (this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}
class TextMorph {
    constructor(text, x, y) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.particles = [];
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.animationId = null;
        this.setupCanvas();
        this.createTextParticles();
        this.animate();
    }
    setupCanvas() {
        this.canvas.className = 'text-morph';
        this.canvas.style.position = 'fixed';
        this.canvas.style.left = '0';
        this.canvas.style.top = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1000';
        document.body.appendChild(this.canvas);
    }
    createTextParticles() {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = 400;
        tempCanvas.height = 100;
        tempCtx.font = 'bold 40px Bebas Neue';
        tempCtx.fillStyle = '#005BBB';
        tempCtx.textAlign = 'center';
        tempCtx.textBaseline = 'middle';
        tempCtx.fillText(this.text, 200, 50);
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const data = imageData.data;
        for (let y = 0; y < tempCanvas.height; y += 4) {
            for (let x = 0; x < tempCanvas.width; x += 4) {
                const index = (y * tempCanvas.width + x) * 4;
                const alpha = data[index + 3];
                if (alpha > 128) {
                    const particle = {
                        x: this.x + x - 200,
                        y: this.y + y - 50,
                        targetX: this.x + x - 200,
                        targetY: this.y + y - 50,
                        size: 2,
                        color: '#005BBB'
                    };
                    this.particles.push(particle);
                }
            }
        }
    }
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let allFormed = true;
        this.particles.forEach(particle => {
            const dx = particle.targetX - particle.x;
            const dy = particle.targetY - particle.y;
            particle.x += dx * 0.1;
            particle.y += dy * 0.1;
            if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                allFormed = false;
            }
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        if (!allFormed) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.floatingAnimation();
        }
    }
    floatingAnimation() {
        this.animationId = requestAnimationFrame(() => this.floatingAnimation());
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const time = Date.now() * 0.001;
        this.particles.forEach((particle, index) => {
            particle.x += Math.sin(time + index) * 0.5;
            particle.y += Math.cos(time + index) * 0.3;
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = 0.8;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    window.particleEffects = new ParticleEffects();
});
