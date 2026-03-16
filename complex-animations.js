class ComplexAnimations {
    constructor() {
        this.masterTimeline = null;
        this.pageLoadTimeline = null;
        this.sectionTransitions = {};
        this.init();
    }
    init() {
        this.setupPageLoadSequence();
        this.setupHeroEntrance();
        this.setupSectionTransitions();
        this.setupNavigationAnimations();
        this.setupProjectInteractions();
        this.setupFormAnimations();
        this.setupScrollSequences();
    }
    setupPageLoadSequence() {
        this.pageLoadTimeline = gsap.timeline({
            paused: true,
            onComplete: () => {
                this.startContinuousAnimations();
            }
        });
        this.pageLoadTimeline
            .to('.loader-logo', {
                scale: 1.2,
                rotation: 360,
                duration: 1,
                ease: "power2.inOut"
            })
            .to('.loader-text', {
                opacity: 0,
                y: -20,
                duration: 0.5,
                ease: "power2.in"
            }, "-=0.5")
            .to('.loader-bar', {
                width: "100%",
                duration: 1.5,
                ease: "power2.inOut"
            }, "-=0.5")
            .to('.loader-percentage', {
                textContent: "100%",
                duration: 1.5,
                ease: "power2.inOut",
                onUpdate: function() {
                    const progress = Math.round(this.progress());
                    this.targets()[0].textContent = progress + "%";
                }
            }, "-=1.5")
            .to('.loader', {
                opacity: 0,
                scale: 1.5,
                duration: 0.8,
                ease: "power2.in"
            })
            .call(() => {
                document.querySelector('.loader').style.display = 'none';
            });
        setTimeout(() => {
            this.pageLoadTimeline.play();
        }, 500);
    }
    setupHeroEntrance() {
        const heroTimeline = gsap.timeline({
            delay: 2.5, // Wait for loader to finish
            defaults: { ease: "power4.out" }
        });
        heroTimeline
            .from('#three-container', {
                opacity: 0,
                scale: 1.5,
                duration: 1.5
            })
            .from('.hero-video', {
                opacity: 0,
                scale: 1.2,
                duration: 1.2
            }, "-=1.2")
            .from('.hero-title-main', {
                y: 150,
                opacity: 0,
                scale: 0.3,
                rotationX: 90,
                transformOrigin: "center bottom",
                duration: 1.8,
                ease: "back.out(1.7)"
            })
            .to('.hero-title-main', {
                textShadow: "0 0 30px rgba(0, 91, 187, 0.8), 0 0 60px rgba(0, 91, 187, 0.4)",
                duration: 1
            }, "-=0.5")
            .from('.hero-tagline', {
                opacity: 0,
                x: -100,
                duration: 1
            }, "-=1")
            .call(() => {
                this.animateTypewriter('.hero-tagline #typed-text', [
                    'modern digital solutions',
                    'robust backend systems', 
                    'beautiful user interfaces'
                ]);
            }, "-=0.5")
            .from('.hero-description', {
                opacity: 0,
                y: 50,
                duration: 1
            }, "-=0.3")
            .from('.luxury-btn', {
                opacity: 0,
                scale: 0,
                rotation: -180,
                duration: 0.8,
                stagger: 0.2,
                ease: "back.out(1.7)"
            }, "-=0.5");
        return heroTimeline;
    }
    setupSectionTransitions() {
        this.sectionTransitions.about = gsap.timeline({
            scrollTrigger: {
                trigger: '.about',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
        this.sectionTransitions.about
            .from('.about-text', {
                x: -200,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            })
            .from('.about-stats', {
                scale: 0,
                opacity: 0,
                duration: 0.8,
                ease: 'back.out(1.7)'
            }, '-=0.5')
            .from('.skills-showcase', {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: 'power2.out'
            }, '-=0.3')
            .from('.experience-timeline', {
                x: 200,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            }, '-=0.5');
        this.sectionTransitions.projects = gsap.timeline({
            scrollTrigger: {
                trigger: '.projects',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
        this.sectionTransitions.projects
            .from('.projects-showcase', {
                scale: 0.8,
                opacity: 0,
                duration: 1,
                ease: 'power2.out'
            })
            .from('.project-card', {
                y: 200,
                opacity: 0,
                rotation: 45,
                duration: 1,
                stagger: 0.15,
                ease: 'back.out(1.7)'
            }, '-=0.5');
        this.sectionTransitions.expertise = gsap.timeline({
            scrollTrigger: {
                trigger: '.expertise',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
        this.sectionTransitions.expertise
            .from('.expertise-grid', {
                scale: 0.5,
                opacity: 0,
                duration: 1.2,
                ease: 'elastic.out(1, 0.5)'
            })
            .from('.expertise-card', {
                scale: 0,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'back.out(1.7)'
            }, '-=0.5');
    }
    setupNavigationAnimations() {
        const navTimeline = gsap.timeline({ paused: true });
        navTimeline
            .from('#header', {
                y: -100,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            })
            .from('nav a', {
                y: -50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out'
            }, '-=0.5');
        const mobileMenuTimeline = gsap.timeline({ paused: true });
        mobileMenuTimeline
            .from('#navMenu', {
                x: -300,
                opacity: 0,
                duration: 0.5,
                ease: 'power3.out'
            })
            .from('#navMenu li', {
                x: -50,
                opacity: 0,
                duration: 0.3,
                stagger: 0.05,
                ease: 'power2.out'
            }, '-=0.3');
        this.navTimeline = navTimeline;
        this.mobileMenuTimeline = mobileMenuTimeline;
    }
    setupProjectInteractions() {
        document.querySelectorAll('.project-card').forEach(card => {
            const cardTimeline = gsap.timeline({ paused: true });
            cardTimeline
                .to(card, {
                    scale: 1.05,
                    y: -10,
                    duration: 0.3,
                    ease: 'power2.out'
                })
                .to(card.querySelector('.project-image'), {
                    scale: 1.1,
                    duration: 0.3,
                    ease: 'power2.out'
                }, '-=0.3')
                .to(card.querySelector('.project-content'), {
                    y: -5,
                    duration: 0.3,
                    ease: 'power2.out'
                }, '-=0.3');
            card.addEventListener('mouseenter', () => cardTimeline.play());
            card.addEventListener('mouseleave', () => cardTimeline.reverse());
        });
        document.querySelectorAll('.project-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.expandProjectDetail(link.closest('.project-card'));
            });
        });
    }
    expandProjectDetail(card) {
        const detailTimeline = gsap.timeline();
        detailTimeline
            .to(card, {
                scale: 1.2,
                zIndex: 100,
                duration: 0.5,
                ease: 'power2.out'
            })
            .to(card.querySelector('.project-content'), {
                height: 'auto',
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.3')
            .to(card.querySelector('.project-description'), {
                height: 'auto',
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.3');
    }
    setupFormAnimations() {
        const formTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.contact-form',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
        formTimeline
            .from('.contact-form', {
                scale: 0.8,
                opacity: 0,
                duration: 1,
                ease: 'back.out(1.7)'
            })
            .from('.form-group', {
                y: 50,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out'
            }, '-=0.5');
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.animateFormSubmission(form);
            });
        }
    }
    animateFormSubmission(form) {
        const submitTimeline = gsap.timeline();
        submitTimeline
            .to('.form-submit', {
                scale: 0.9,
                duration: 0.2,
                ease: 'power2.in'
            })
            .to('.form-submit', {
                scale: 1.1,
                duration: 0.2,
                ease: 'power2.out'
            })
            .to('.form-submit', {
                scale: 1,
                duration: 0.2,
                ease: 'power2.in'
            })
            .call(() => {
                window.showSuccess(form);
                form.reset();
            });
    }
    setupScrollSequences() {
        this.masterTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1
            }
        });
        this.masterTimeline
            .to('.hero-title-main', { scale: 0.8, rotation: 5 }, 0)
            .to('.hero-content', { y: -100 }, 0)
            .to('.about-text', { x: 50 }, 0.2)
            .to('.skill-card', { y: -30 }, 0.4)
            .to('.project-card', { rotation: 180 }, 0.6)
            .to('.expertise-card', { scale: 1.1 }, 0.8);
    }
    animateTypewriter(element, strings) {
        let stringIndex = 0;
        let charIndex = 0;
        let currentString = '';
        let isDeleting = false;
        let typeSpeed = 100;
        const type = () => {
            if (!element) return;
            if (stringIndex < strings.length) {
                if (!isDeleting && charIndex < strings[stringIndex].length) {
                    currentString += strings[stringIndex].charAt(charIndex);
                    element.textContent = currentString;
                    charIndex++;
                    setTimeout(type, typeSpeed);
                } else if (isDeleting && charIndex > 0) {
                    currentString = currentString.substring(0, charIndex - 1);
                    element.textContent = currentString;
                    charIndex--;
                    setTimeout(type, typeSpeed / 2);
                } else if (!isDeleting) {
                    isDeleting = true;
                    setTimeout(type, 2000);
                } else {
                    isDeleting = false;
                    stringIndex++;
                    charIndex = 0;
                    setTimeout(type, 500);
                }
            }
        };
        type();
    }
    startContinuousAnimations() {
        gsap.to('#particles-js', {
            opacity: 0.8,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'power2.inOut'
        });
        gsap.utils.toArray('.floating').forEach(element => {
            gsap.to(element, {
                y: 'random(-20, 20)',
                duration: 'random(3, 6)',
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut'
            });
        });
        gsap.utils.toArray('.pulse').forEach(element => {
            gsap.to(element, {
                scale: 1.05,
                opacity: 0.8,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'power2.inOut'
            });
        });
    }
    playNavigationAnimation() {
        if (this.navTimeline) {
            this.navTimeline.play();
        }
    }
    playMobileMenuAnimation() {
        if (this.mobileMenuTimeline) {
            this.mobileMenuTimeline.restart();
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    window.complexAnimations = new ComplexAnimations();
});
