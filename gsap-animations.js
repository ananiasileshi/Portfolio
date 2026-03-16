class GSAPAnimations {
    constructor() {
        this.timeline = null;
        this.init();
    }
    init() {
        gsap.registerPlugin(ScrollTrigger, TextPlugin);
        this.setupHeroAnimations();
        this.setupSectionAnimations();
        this.setupParallaxEffects();
        this.setupTextRevealAnimations();
        this.setupHorizontalScroll();
        this.setupProgressIndicators();
        this.setupPinnedElements();
    }
    setupHeroAnimations() {
        const heroTimeline = gsap.timeline({
            defaults: { ease: "power4.out", duration: 1 }
        });
        heroTimeline
            .from(".hero-title-main", {
                y: 100,
                opacity: 0,
                scale: 0.8,
                rotationX: 45,
                transformOrigin: "center bottom",
                duration: 1.5
            })
            .from(".hero-tagline", {
                y: 50,
                opacity: 0,
                duration: 1.2
            }, "-=0.8")
            .from(".hero-description", {
                y: 30,
                opacity: 0,
                duration: 1
            }, "-=0.6")
            .from(".luxury-btn", {
                y: 30,
                opacity: 0,
                stagger: 0.2,
                duration: 0.8
            }, "-=0.4");
        gsap.to(".hero-title-main", {
            y: -10,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
        gsap.to(".hero-title-main", {
            textShadow: "0 0 20px rgba(0, 91, 187, 0.8), 0 0 40px rgba(0, 91, 187, 0.4)",
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
        });
    }
    setupSectionAnimations() {
        gsap.utils.toArray(".about-text").forEach((element, index) => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                },
                x: -100,
                opacity: 0,
                duration: 1,
                delay: index * 0.2,
                ease: "power3.out"
            });
        });
        gsap.utils.toArray(".timeline-item").forEach((item, index) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none reverse"
                },
                x: 50,
                opacity: 0,
                duration: 0.8,
                delay: index * 0.15,
                ease: "power2.out"
            });
        });
        gsap.utils.toArray(".skill-card").forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none reverse"
                },
                y: 50,
                opacity: 0,
                scale: 0.8,
                duration: 0.6,
                delay: index * 0.1,
                ease: "back.out(1.7)"
            });
        });
        gsap.utils.toArray(".project-card").forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none reverse"
                },
                rotationY: 180,
                opacity: 0,
                duration: 1,
                delay: index * 0.2,
                ease: "power2.out"
            });
        });
        gsap.utils.toArray(".expertise-card").forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none reverse"
                },
                scale: 0,
                opacity: 0,
                duration: 0.8,
                delay: index * 0.15,
                ease: "elastic.out(1, 0.5)"
            });
        });
        gsap.utils.toArray(".blog-card").forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none reverse"
                },
                y: 100,
                opacity: 0,
                duration: 0.7,
                delay: index * 0.1,
                ease: "power3.out"
            });
        });
        gsap.utils.toArray(".testimonial-card").forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none reverse"
                },
                x: -50,
                opacity: 0,
                duration: 0.8,
                delay: index * 0.2,
                ease: "power2.out"
            });
        });
        gsap.utils.toArray(".certification-card").forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none reverse"
                },
                scale: 0.5,
                opacity: 0,
                duration: 0.6,
                delay: index * 0.1,
                ease: "back.out(1.7)"
            });
        });
    }
    setupParallaxEffects() {
        gsap.to(".hero-video", {
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 1
            },
            yPercent: -50,
            ease: "none"
        });
        gsap.to(".hero-content", {
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 0.5
            },
            yPercent: 30,
            ease: "none"
        });
        gsap.utils.toArray(".section-header").forEach(header => {
            gsap.to(header, {
                scrollTrigger: {
                    trigger: header,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                },
                yPercent: -20,
                ease: "none"
            });
        });
        gsap.to("#particles-js", {
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 2
            },
            yPercent: -50,
            ease: "none"
        });
    }
    setupTextRevealAnimations() {
        gsap.utils.toArray(".section-header h2").forEach(header => {
            const text = header.innerText;
            header.innerHTML = "";
            text.split("").forEach(char => {
                const span = document.createElement("span");
                span.innerText = char === " " ? "\u00A0" : char;
                span.style.display = "inline-block";
                header.appendChild(span);
            });
            gsap.from(header.querySelectorAll("span"), {
                scrollTrigger: {
                    trigger: header,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none reverse"
                },
                y: 50,
                opacity: 0,
                duration: 0.05,
                stagger: 0.02,
                ease: "power2.out"
            });
        });
        gsap.utils.toArray(".section-header p").forEach(p => {
            const words = p.innerText.split(" ");
            p.innerHTML = "";
            words.forEach(word => {
                const span = document.createElement("span");
                span.innerText = word;
                span.style.display = "inline-block";
                span.style.marginRight = "0.3em";
                p.appendChild(span);
            });
            gsap.from(p.querySelectorAll("span"), {
                scrollTrigger: {
                    trigger: p,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none reverse"
                },
                y: 30,
                opacity: 0,
                duration: 0.1,
                stagger: 0.05,
                ease: "power2.out"
            });
        });
    }
    setupHorizontalScroll() {
        const projectsSection = document.querySelector(".projects");
        if (projectsSection) {
            const projectsGrid = projectsSection.querySelector(".projects-showcase");
            gsap.set(projectsGrid, {
                display: "flex",
                gap: "50px",
                width: "auto"
            });
            gsap.to(projectsGrid, {
                scrollTrigger: {
                    trigger: projectsSection,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1
                },
                x: () => -(projectsGrid.scrollWidth - window.innerWidth),
                ease: "none"
            });
        }
    }
    setupProgressIndicators() {
        gsap.utils.toArray(".skill-progress").forEach(bar => {
            const width = bar.style.width;
            gsap.set(bar, { width: "0%" });
            gsap.to(bar, {
                scrollTrigger: {
                    trigger: bar,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none reverse"
                },
                width: width,
                duration: 1.5,
                ease: "power2.out"
            });
        });
        gsap.utils.toArray(".stat-number").forEach(counter => {
            const target = parseInt(counter.getAttribute("data-target"));
            gsap.fromTo(counter, {
                textContent: "0"
            }, {
                scrollTrigger: {
                    trigger: counter,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none reverse"
                },
                textContent: target,
                duration: 2,
                ease: "power2.out",
                snap: { textContent: 1 },
                onUpdate: function() {
                    counter.textContent = Math.ceil(this.targets()[0].textContent);
                }
            });
        });
    }
    setupPinnedElements() {
        ScrollTrigger.create({
            trigger: "body",
            start: "top -80px",
            end: 99999,
            toggleClass: { className: "scrolled", targets: "#header" }
        });
        gsap.utils.toArray(".project-card").forEach(card => {
            gsap.to(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    end: "bottom 20%",
                    scrub: 1
                },
                scale: 1.02,
                ease: "none"
            });
        });
    }
    createTimelineSequence() {
        this.timeline = gsap.timeline({
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 1
            }
        });
        this.timeline
            .to(".hero-title-main", { scale: 0.8, rotation: 5 }, 0)
            .to(".about-text", { x: 50 }, 0.2)
            .to(".skill-card", { y: -20 }, 0.4)
            .to(".project-card", { rotationY: 360 }, 0.6)
            .to(".expertise-card", { scale: 1.1 }, 0.8);
    }
    start() {
        ScrollTrigger.refresh();
        this.createTimelineSequence();
    }
}
document.addEventListener('DOMContentLoaded', () => {
    window.gsapAnimations = new GSAPAnimations();
    setTimeout(() => {
        window.gsapAnimations.start();
    }, 100);
});
window.addEventListener('resize', () => {
    if (window.gsapAnimations) {
        ScrollTrigger.refresh();
    }
});
