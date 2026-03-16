document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    let loadProgress = 0;
    const loaderProgress = document.querySelector('.loader-progress');
    const loaderPercentage = document.querySelector('.loader-percentage');
    const updateLoader = setInterval(() => {
        loadProgress += Math.random() * 15;
        if (loadProgress > 100) loadProgress = 100;
        if (loaderProgress) {
            loaderProgress.style.width = loadProgress + '%';
        }
        if (loaderPercentage) {
            loaderPercentage.textContent = Math.floor(loadProgress) + '%';
        }
        if (loadProgress >= 100) {
            clearInterval(updateLoader);
            setTimeout(() => {
                const loader = document.getElementById('loader');
                if (loader) {
                    loader.classList.add('hidden');
                    setTimeout(() => {
                        loader.style.display = 'none';
                    }, 800);
                }
            }, 500);
        }
    }, 100);
    class SmoothScroll {
        constructor() {
            this.bindMethods();
            this.data = {
                ease: 0.08,
                current: 0,
                previous: 0,
                rounded: 0
            };
            this.dom = {
                el: document.querySelector('#smooth-content'),
                viewport: document.querySelector('#smooth-wrapper')
            };
            this.rAF = null;
            this.init();
        }
        bindMethods() {
            ['scroll', 'run', 'resize'].forEach(fn => this[fn] = this[fn].bind(this));
        }
        setStyles() {
            if (this.dom.el) {
                document.body.style.height = `${this.dom.el.getBoundingClientRect().height}px`;
            }
        }
        scroll() {
            this.data.current = window.scrollY;
        }
        run() {
            this.data.previous += (this.data.current - this.data.previous) * this.data.ease;
            this.data.rounded = Math.round(this.data.previous * 100) / 100;
            if (this.dom.el) {
                this.dom.el.style.transform = `translateY(-${this.data.rounded}px)`;
            }
            this.rAF = requestAnimationFrame(this.run);
        }
        resize() {
            this.setStyles();
        }
        init() {
            this.setStyles();
            this.scroll();
            this.run();
            window.addEventListener('resize', this.resize);
            window.addEventListener('scroll', this.scroll);
        }
    }
    if (window.innerWidth > 768) {
        new SmoothScroll();
    }
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    if (window.matchMedia('(hover: hover)').matches && cursor && cursorFollower) {
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let followerX = 0;
        let followerY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.5;
            cursorY += (mouseY - cursorY) * 0.5;
            followerX += (mouseX - followerX) * 0.17;
            followerY += (mouseY - followerY) * 0.17;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        const hoverElements = document.querySelectorAll('a, button, .skill-card, .project-card, .expertise-card');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            element.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#005BBB' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#005BBB',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'grab' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 0.5 } },
                    push: { particles_nb: 4 }
                }
            }
        });
    }
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                const navMenu = document.getElementById('navMenu');
                const menuToggle = document.getElementById('menuToggle');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
    let lastScrollTop = 0;
    const scrollThreshold = 100;
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (header) {
            if (scrollTop > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            header.classList.remove('hidden');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive);
        });
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('experience-timeline')) {
                    const items = entry.target.querySelectorAll('.timeline-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 200);
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    document.querySelectorAll('.about-text, .experience-timeline, .project-card, .expertise-card').forEach(el => {
        observer.observe(el);
    });
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            let isValid = true;
            const requiredFields = ['name', 'email', 'subject', 'message'];
            requiredFields.forEach(field => {
                const input = e.target.querySelector(`[name="${field}"]`);
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ff0000';
                } else {
                    input.style.borderColor = '';
                }
            });
            if (!isValid) {
                alert('Please fill in all required fields.');
                return;
            }
            const emailInput = e.target.querySelector('[name="email"]');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                alert('Please enter a valid email address.');
                emailInput.style.borderColor = '#ff0000';
                return;
            }
            const button = e.target.querySelector('.form-submit');
            const originalText = button.textContent;
            button.textContent = 'Sending...';
            button.disabled = true;
            console.log('Form submitted:', data);
            setTimeout(() => {
                button.textContent = 'Message Sent Successfully!';
                button.style.background = 'var(--accent-blue)';
                button.style.borderColor = 'var(--accent-blue)';
                setTimeout(() => {
                    e.target.reset();
                    button.textContent = originalText;
                    button.style.background = '';
                    button.style.borderColor = '';
                    button.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
    window.addEventListener('scroll', () => {
        const scrollProgress = document.getElementById('scrollProgress');
        if (scrollProgress) {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercentage = (scrollTop / scrollHeight) * 100;
            scrollProgress.style.width = scrollPercentage + '%';
        }
    }, { passive: true });
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }, { passive: true });
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const increment = target / 100;
                let current = 0;
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current);
                        setTimeout(updateCounter, 20);
                    } else {
                        counter.textContent = target;
                    }
                };
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(counter => {
        if (counter) counterObserver.observe(counter);
    });
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'skillLoad 2s ease-out forwards';
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    skillBars.forEach(bar => {
        if (bar) skillObserver.observe(bar);
    });
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }
    setTimeout(() => {
        const typedElement = document.getElementById('typed-text');
        if (typedElement && typeof Typed !== 'undefined') {
            new Typed('#typed-text', {
                strings: [
                    'modern digital solutions',
                    'robust backend systems',
                    'beautiful user interfaces'
                ],
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 2000,
                loop: true,
                showCursor: true,
                cursorChar: '|',
                startDelay: 500
            });
        }
    }, 1500);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const navMenu = document.getElementById('navMenu');
            const menuToggle = document.getElementById('menuToggle');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.focus();
            }
        }
    });
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const placeholder = this.nextElementSibling;
            if (placeholder && placeholder.classList.contains('profile-image-placeholder')) {
                placeholder.style.display = 'flex';
            }
        });
    });
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    const prefetchLinks = document.querySelectorAll('a[href^="http"]');
    const prefetchObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = entry.target.href;
                document.head.appendChild(link);
                prefetchObserver.unobserve(entry.target);
            }
        });
    });
    prefetchLinks.forEach(link => {
        prefetchObserver.observe(link);
    });
    console.log('%c Portfolio Website ', 'background: #005BBB; color: #fff; padding: 5px 10px; border-radius: 3px;');
    console.log('%c Built with precision and passion ', 'color: #0080FF;');
    console.log('%c Contact: contact@ananiasileshi.dev ', 'color: #888;');
});
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
