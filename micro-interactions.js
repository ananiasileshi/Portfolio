class MicroInteractions {
    constructor() {
        this.cursorTrail = [];
        this.magneticButtons = [];
        this.tiltElements = [];
        this.init();
    }
    init() {
        this.setupMagneticButtons();
        this.setup3DTilt();
        this.setupCursorTrail();
        this.setupButtonHoverStates();
        this.setupLinkAnimations();
        this.setupLoadingAnimations();
        this.setupFeedbackAnimations();
        this.setupFormInteractions();
    }
    setupMagneticButtons() {
        const buttons = document.querySelectorAll('.luxury-btn, .form-submit, .social-link');
        buttons.forEach(button => {
            const magneticButton = new MagneticButton(button);
            this.magneticButtons.push(magneticButton);
        });
    }
    setup3DTilt() {
        const tiltElements = document.querySelectorAll('.skill-card, .project-card, .expertise-card, .blog-card, .testimonial-card, .certification-card');
        tiltElements.forEach(element => {
            const tiltCard = new TiltCard(element);
            this.tiltElements.push(tiltCard);
        });
    }
    setupCursorTrail() {
        const cursorTrail = new CursorTrail();
        this.cursorTrail = cursorTrail;
    }
    setupButtonHoverStates() {
        const buttons = document.querySelectorAll('.luxury-btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.left = '50%';
                ripple.style.top = '50%';
                button.appendChild(ripple);
                gsap.fromTo(ripple, {
                    width: 0,
                    height: 0,
                    opacity: 0.5
                }, {
                    width: 300,
                    height: 300,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power2.out",
                    onComplete: () => ripple.remove()
                });
            });
            gsap.to(button, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        buttons.forEach(button => {
            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }
    setupLinkAnimations() {
        const links = document.querySelectorAll('a:not(.luxury-btn):not(.social-link)');
        links.forEach(link => {
            const underline = document.createElement('span');
            underline.className = 'animated-underline';
            link.appendChild(underline);
            link.addEventListener('mouseenter', () => {
                gsap.to(underline, {
                    width: '100%',
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            link.addEventListener('mouseleave', () => {
                gsap.to(underline, {
                    width: '0%',
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }
    setupLoadingAnimations() {
        const loadingStates = document.querySelectorAll('.loading');
        loadingStates.forEach(loading => {
            const dots = Array(3).fill(0).map(() => {
                const dot = document.createElement('span');
                dot.className = 'loading-dot';
                loading.appendChild(dot);
                return dot;
            });
            gsap.to(dots, {
                scale: 1.5,
                opacity: 0.3,
                duration: 0.8,
                stagger: 0.2,
                repeat: -1,
                yoyo: true,
                ease: "power2.inOut"
            });
        });
    }
    setupFeedbackAnimations() {
        this.setupSuccessAnimation();
        this.setupErrorAnimation();
    }
    setupSuccessAnimation() {
        window.showSuccess = (element) => {
            const successIcon = document.createElement('div');
            successIcon.className = 'success-icon';
            successIcon.innerHTML = '<i class="fas fa-check"></i>';
            element.appendChild(successIcon);
            gsap.fromTo(successIcon, {
                scale: 0,
                rotation: -180,
                opacity: 0
            }, {
                scale: 1,
                rotation: 0,
                opacity: 1,
                duration: 0.5,
                ease: "back.out(1.7)"
            });
            setTimeout(() => {
                gsap.to(successIcon, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => successIcon.remove()
                });
            }, 2000);
        };
    }
    setupErrorAnimation() {
        window.showError = (element) => {
            const errorIcon = document.createElement('div');
            errorIcon.className = 'error-icon';
            errorIcon.innerHTML = '<i class="fas fa-times"></i>';
            element.appendChild(errorIcon);
            gsap.fromTo(errorIcon, {
                scale: 0,
                x: -50,
                opacity: 0
            }, {
                scale: 1,
                x: 0,
                opacity: 1,
                duration: 0.5,
                ease: "back.out(1.7)"
            });
            gsap.to(errorIcon, {
                x: 10,
                duration: 0.1,
                repeat: 5,
                yoyo: true,
                ease: "power2.inOut"
            });
            setTimeout(() => {
                gsap.to(errorIcon, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => errorIcon.remove()
                });
            }, 2000);
        };
    }
    setupFormInteractions() {
        const inputs = document.querySelectorAll('.form-input, .form-textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                gsap.to(input.parentElement, {
                    scale: 1.02,
                    duration: 0.2,
                    ease: "power2.out"
                });
                gsap.to(input, {
                    borderColor: '#005BBB',
                    duration: 0.3
                });
            });
            input.addEventListener('blur', () => {
                gsap.to(input.parentElement, {
                    scale: 1,
                    duration: 0.2,
                    ease: "power2.out"
                });
                gsap.to(input, {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    duration: 0.3
                });
            });
        });
    }
}
class MagneticButton {
    constructor(element) {
        this.element = element;
        this.bounds = element.getBoundingClientRect();
        this.magnetStrength = 0.3;
        this.init();
    }
    init() {
        this.element.addEventListener('mouseenter', () => this.updateBounds());
        this.element.addEventListener('mousemove', (e) => this.moveMagnetic(e));
        this.element.addEventListener('mouseleave', () => this.resetPosition());
    }
    updateBounds() {
        this.bounds = this.element.getBoundingClientRect();
    }
    moveMagnetic(e) {
        const { clientX, clientY } = e;
        const { left, top, width, height } = this.bounds;
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const deltaX = (clientX - centerX) * this.magnetStrength;
        const deltaY = (clientY - centerY) * this.magnetStrength;
        gsap.to(this.element, {
            x: deltaX,
            y: deltaY,
            duration: 0.3,
            ease: "power2.out"
        });
    }
    resetPosition() {
        gsap.to(this.element, {
            x: 0,
            y: 0,
            duration: 0.3,
            ease: "elastic.out(1, 0.3)"
        });
    }
}
class TiltCard {
    constructor(element) {
        this.element = element;
        this.bounds = element.getBoundingClientRect();
        this.tiltStrength = 15;
        this.init();
    }
    init() {
        this.element.addEventListener('mouseenter', () => this.updateBounds());
        this.element.addEventListener('mousemove', (e) => this.tilt(e));
        this.element.addEventListener('mouseleave', () => this.resetTilt());
    }
    updateBounds() {
        this.bounds = this.element.getBoundingClientRect();
    }
    tilt(e) {
        const { clientX, clientY } = e;
        const { left, top, width, height } = this.bounds;
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const percentX = (clientX - centerX) / (width / 2);
        const percentY = (clientY - centerY) / (height / 2);
        const rotateY = percentX * this.tiltStrength;
        const rotateX = -percentY * this.tiltStrength;
        gsap.to(this.element, {
            rotateX: rotateX,
            rotateY: rotateY,
            transformPerspective: 1000,
            duration: 0.1,
            ease: "power2.out"
        });
    }
    resetTilt() {
        gsap.to(this.element, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.3,
            ease: "elastic.out(1, 0.3)"
        });
    }
}
class CursorTrail {
    constructor() {
        this.trail = [];
        this.maxTrailLength = 20;
        this.mouseX = 0;
        this.mouseY = 0;
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
        dot.className = 'cursor-trail-dot';
        dot.style.left = this.mouseX + 'px';
        dot.style.top = this.mouseY + 'px';
        document.body.appendChild(dot);
        this.trail.push(dot);
        gsap.fromTo(dot, {
            scale: 0,
            opacity: 1
        }, {
            scale: 1,
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
const microInteractionStyles = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        pointer-events: none;
    }
    .animated-underline {
        position: absolute;
        bottom: -2px;
        left: 0;
        height: 2px;
        background: var(--accent-blue);
        width: 0;
        transition: width 0.3s ease;
    }
    .loading-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--accent-blue);
        margin: 0 2px;
    }
    .success-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #00D4AA;
        font-size: 24px;
        z-index: 1000;
    }
    .error-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #FF6B35;
        font-size: 24px;
        z-index: 1000;
    }
    .cursor-trail-dot {
        position: fixed;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--accent-blue);
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
    }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = microInteractionStyles;
document.head.appendChild(styleSheet);
document.addEventListener('DOMContentLoaded', () => {
    window.microInteractions = new MicroInteractions();
});
