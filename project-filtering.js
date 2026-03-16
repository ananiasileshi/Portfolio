class ProjectFiltering {
    constructor() {
        this.projects = [];
        this.filters = {
            technology: [],
            category: [],
            year: []
        };
        this.activeFilters = {
            technology: [],
            category: [],
            year: []
        };
        this.sortBy = 'date';
        this.sortOrder = 'desc';
        this.searchQuery = '';
        this.flipAnimator = null;
        this.init();
    }
    init() {
        this.setupProjectData();
        this.createFilterUI();
        this.setupEventListeners();
        this.initializeFlipAnimator();
        this.applyFilters();
    }
    setupProjectData() {
        this.projects = [
            {
                id: 1,
                title: 'E-Commerce Platform',
                description: 'High-performance e-commerce solution handling millions of transactions with real-time inventory management and AI-powered recommendations.',
                technologies: ['React', 'Node.js', 'MongoDB', 'Redis', 'Docker'],
                category: 'fullstack',
                year: 2024,
                featured: true,
                demoUrl: 'https://demo-ecommerce.example.com',
                githubUrl: 'https://github.com/ananiasileshi/ecommerce-platform',
                image: 'ecommerce.jpg',
                tags: ['performance', 'scalability', 'ai'],
                status: 'completed'
            },
            {
                id: 2,
                title: 'Financial Dashboard',
                description: 'Real-time financial analytics platform with advanced data visualization and predictive modeling capabilities for institutional investors.',
                technologies: ['Vue.js', 'Python', 'PostgreSQL', 'D3.js', 'WebSocket'],
                category: 'analytics',
                year: 2024,
                featured: true,
                demoUrl: 'https://demo-finance.example.com',
                githubUrl: 'https://github.com/ananiasileshi/financial-dashboard',
                image: 'finance.jpg',
                tags: ['analytics', 'real-time', 'visualization'],
                status: 'completed'
            },
            {
                id: 3,
                title: 'AI Content Platform',
                description: 'Cutting-edge content management system powered by artificial intelligence for automated content generation and optimization.',
                technologies: ['Next.js', 'OpenAI', 'AWS', 'GraphQL', 'TypeScript'],
                category: 'ai',
                year: 2024,
                featured: true,
                demoUrl: 'https://demo-ai.example.com',
                githubUrl: 'https://github.com/ananiasileshi/ai-content-platform',
                image: 'ai-platform.jpg',
                tags: ['ai', 'automation', 'content'],
                status: 'in-development'
            },
            {
                id: 4,
                title: 'Social Media Analytics',
                description: 'Comprehensive social media analytics tool with sentiment analysis, trend detection, and automated reporting features.',
                technologies: ['React', 'Python', 'TensorFlow', 'MongoDB', 'Redis'],
                category: 'analytics',
                year: 2023,
                featured: false,
                demoUrl: 'https://demo-social.example.com',
                githubUrl: 'https://github.com/ananiasileshi/social-analytics',
                image: 'social.jpg',
                tags: ['analytics', 'sentiment', 'trends'],
                status: 'completed'
            },
            {
                id: 5,
                title: 'Real-time Chat Application',
                description: 'Scalable chat application with end-to-end encryption, video calling, and advanced collaboration features.',
                technologies: ['Node.js', 'Socket.io', 'WebRTC', 'Redis', 'PostgreSQL'],
                category: 'communication',
                year: 2023,
                featured: false,
                demoUrl: 'https://demo-chat.example.com',
                githubUrl: 'https://github.com/ananiasileshi/realtime-chat',
                image: 'chat.jpg',
                tags: ['real-time', 'communication', 'security'],
                status: 'completed'
            },
            {
                id: 6,
                title: 'Task Management System',
                description: 'Enterprise-grade task management system with advanced workflow automation, team collaboration, and AI-powered prioritization.',
                technologies: ['Angular', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes'],
                category: 'productivity',
                year: 2023,
                featured: false,
                demoUrl: 'https://demo-tasks.example.com',
                githubUrl: 'https://github.com/ananiasileshi/task-management',
                image: 'tasks.jpg',
                tags: ['productivity', 'automation', 'collaboration'],
                status: 'completed'
            }
        ];
        this.extractFilterOptions();
    }
    extractFilterOptions() {
        this.projects.forEach(project => {
            project.technologies.forEach(tech => {
                if (!this.filters.technology.includes(tech)) {
                    this.filters.technology.push(tech);
                }
            });
            if (!this.filters.category.includes(project.category)) {
                this.filters.category.push(project.category);
            }
            if (!this.filters.year.includes(project.year)) {
                this.filters.year.push(project.year);
            }
        });
        this.filters.technology.sort();
        this.filters.category.sort();
        this.filters.year.sort((a, b) => b - a);
    }
    createFilterUI() {
        const projectsSection = document.querySelector('.projects');
        if (!projectsSection) return;
        const filterContainer = document.createElement('div');
        filterContainer.className = 'project-filters';
        filterContainer.innerHTML = `
            <div class="filter-header">
                <h3>Filter Projects</h3>
                <div class="filter-controls">
                    <div class="search-box">
                        <input type="text" id="projectSearch" placeholder="Search projects..." />
                        <i class="fas fa-search"></i>
                    </div>
                    <div class="sort-controls">
                        <select id="sortSelect">
                            <option value="date">Sort by Date</option>
                            <option value="name">Sort by Name</option>
                            <option value="category">Sort by Category</option>
                        </select>
                        <button id="sortOrder" class="sort-order-btn" title="Toggle sort order">
                            <i class="fas fa-sort-amount-down"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="filter-sections">
                <div class="filter-section">
                    <h4>Technologies</h4>
                    <div class="filter-tags" data-filter="technology">
                        ${this.filters.technology.map(tech => 
                            `<button class="filter-tag" data-value="${tech}">${tech}</button>`
                        ).join('')}
                    </div>
                </div>
                <div class="filter-section">
                    <h4>Category</h4>
                    <div class="filter-tags" data-filter="category">
                        ${this.filters.category.map(cat => 
                            `<button class="filter-tag" data-value="${cat}">${this.formatCategory(cat)}</button>`
                        ).join('')}
                    </div>
                </div>
                <div class="filter-section">
                    <h4>Year</h4>
                    <div class="filter-tags" data-filter="year">
                        ${this.filters.year.map(year => 
                            `<button class="filter-tag" data-value="${year}">${year}</button>`
                        ).join('')}
                    </div>
                </div>
            </div>
            <div class="filter-actions">
                <button id="clearFilters" class="clear-filters-btn">Clear All Filters</button>
                <div class="filter-count">
                    <span id="filteredCount">0</span> projects found
                </div>
            </div>
        `;
        const projectsGrid = projectsSection.querySelector('.projects-showcase');
        if (projectsGrid) {
            projectsSection.insertBefore(filterContainer, projectsGrid);
        }
    }
    formatCategory(category) {
        return category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
    setupEventListeners() {
        const searchInput = document.getElementById('projectSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.applyFilters();
            });
        }
        const sortOrderBtn = document.getElementById('sortOrder');
        if (sortOrderBtn) {
            sortOrderBtn.addEventListener('click', () => {
                this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
                const icon = sortOrderBtn.querySelector('i');
                icon.className = this.sortOrder === 'desc' ? 'fas fa-sort-amount-down' : 'fas fa-sort-amount-up';
                this.applyFilters();
            });
        }
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const filterType = tag.parentElement.dataset.filter;
                const filterValue = tag.dataset.value;
                this.toggleFilter(filterType, filterValue);
                tag.classList.toggle('active');
                this.applyFilters();
            });
        });
        const clearFiltersBtn = document.getElementById('clearFilters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
    }
    toggleFilter(filterType, filterValue) {
        const index = this.activeFilters[filterType].indexOf(filterValue);
        if (index > -1) {
            this.activeFilters[filterType].splice(index, 1);
        } else {
            this.activeFilters[filterType].push(filterValue);
        }
    }
    clearAllFilters() {
        Object.keys(this.activeFilters).forEach(key => {
            this.activeFilters[key] = [];
        });
        this.searchQuery = '';
        const searchInput = document.getElementById('projectSearch');
        if (searchInput) {
            searchInput.value = '';
        }
        document.querySelectorAll('.filter-tag.active').forEach(tag => {
            tag.classList.remove('active');
        });
        this.applyFilters();
    }
    applyFilters() {
        let filteredProjects = [...this.projects];
        if (this.searchQuery) {
            filteredProjects = filteredProjects.filter(project => 
                project.title.toLowerCase().includes(this.searchQuery) ||
                project.description.toLowerCase().includes(this.searchQuery) ||
                project.technologies.some(tech => tech.toLowerCase().includes(this.searchQuery))
            );
        }
        if (this.activeFilters.technology.length > 0) {
            filteredProjects = filteredProjects.filter(project =>
                this.activeFilters.technology.some(tech => 
                    project.technologies.includes(tech)
                )
            );
        }
        if (this.activeFilters.category.length > 0) {
            filteredProjects = filteredProjects.filter(project =>
                this.activeFilters.category.includes(project.category)
            );
        }
        if (this.activeFilters.year.length > 0) {
            filteredProjects = filteredProjects.filter(project =>
                this.activeFilters.year.includes(project.year)
            );
        }
        filteredProjects = this.sortProjects(filteredProjects);
        this.updateFilterCount(filteredProjects.length);
        this.flipAnimator.updateProjects(filteredProjects);
    }
    sortProjects(projects) {
        return projects.sort((a, b) => {
            let comparison = 0;
            switch (this.sortBy) {
                case 'name':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'category':
                    comparison = a.category.localeCompare(b.category);
                    break;
                case 'date':
                default:
                    comparison = b.year - a.year;
                    break;
            }
            return this.sortOrder === 'desc' ? comparison : -comparison;
        });
    }
    updateFilterCount(count) {
        const countElement = document.getElementById('filteredCount');
        if (countElement) {
            countElement.textContent = count;
        }
    }
    initializeFlipAnimator() {
        this.flipAnimator = new FlipAnimator();
    }
}
class FlipAnimator {
    constructor() {
        this.projectsGrid = document.querySelector('.projects-showcase');
        this.currentProjects = [];
        this.animationDuration = 0.6;
        this.staggerDelay = 0.05;
    }
    updateProjects(newProjects) {
        const oldPositions = this.getCurrentPositions();
        this.updateProjectCards(newProjects);
        const newPositions = this.getCurrentPositions();
        this.animateFlip(oldPositions, newPositions);
        this.currentProjects = newProjects;
    }
    getCurrentPositions() {
        const cards = this.projectsGrid.querySelectorAll('.project-card');
        const positions = {};
        cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const projectId = card.dataset.projectId;
            positions[projectId] = {
                element: card,
                rect: rect,
                index: index
            };
        });
        return positions;
    }
    updateProjectCards(projects) {
        this.projectsGrid.innerHTML = '';
        projects.forEach((project, index) => {
            const card = this.createProjectCard(project, index);
            this.projectsGrid.appendChild(card);
        });
    }
    createProjectCard(project, index) {
        const card = document.createElement('article');
        card.className = 'project-card';
        card.dataset.projectId = project.id;
        card.innerHTML = `
            <div class="project-image">
                <div class="project-image-placeholder">
                    <i class="fas fa-${this.getProjectIcon(project.category)}" aria-hidden="true"></i>
                    <span>${project.title}</span>
                </div>
                ${project.featured ? '<div class="featured-badge">Featured</div>' : ''}
            </div>
            <div class="project-content">
                <div class="project-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-meta">
                    <span class="project-category">${this.formatCategory(project.category)}</span>
                    <span class="project-year">${project.year}</span>
                    <span class="project-status ${project.status}">${this.formatStatus(project.status)}</span>
                </div>
                <div class="tech-stack">
                    ${project.technologies.map(tech => 
                        `<span class="tech-tag">${tech}</span>`
                    ).join('')}
                </div>
                <div class="project-tags">
                    ${project.tags.map(tag => 
                        `<span class="project-tag">#${tag}</span>`
                    ).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="project-link">
                        <i class="fas fa-external-link-alt" aria-hidden="true"></i>
                        <span>Live Demo</span>
                    </a>
                    <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link">
                        <i class="fab fa-github" aria-hidden="true"></i>
                        <span>GitHub</span>
                    </a>
                </div>
            </div>
        `;
        return card;
    }
    getProjectIcon(category) {
        const icons = {
            fullstack: 'laptop-code',
            analytics: 'chart-line',
            ai: 'robot',
            communication: 'comments',
            productivity: 'tasks'
        };
        return icons[category] || 'code';
    }
    formatCategory(category) {
        return category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
    formatStatus(status) {
        return status.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
    animateFlip(oldPositions, newPositions) {
        const timeline = gsap.timeline();
        Object.values(newPositions).forEach(({ element, rect, index }) => {
            const oldPosition = oldPositions[element.dataset.projectId];
            if (oldPosition) {
                const deltaX = oldPosition.rect.left - rect.left;
                const deltaY = oldPosition.rect.top - rect.top;
                gsap.set(element, {
                    x: deltaX,
                    y: deltaY,
                    opacity: 0
                });
                timeline.to(element, {
                    x: 0,
                    y: 0,
                    opacity: 1,
                    duration: this.animationDuration,
                    ease: "power2.inOut",
                    delay: index * this.staggerDelay
                }, 0);
            } else {
                gsap.set(element, {
                    opacity: 0,
                    scale: 0.8,
                    rotationY: 180
                });
                timeline.to(element, {
                    opacity: 1,
                    scale: 1,
                    rotationY: 0,
                    duration: this.animationDuration,
                    ease: "back.out(1.7)",
                    delay: index * this.staggerDelay
                }, 0);
            }
        });
        Object.values(oldPositions).forEach(({ element, rect }) => {
            const newPosition = newPositions[element.dataset.projectId];
            if (!newPosition) {
                timeline.to(element, {
                    opacity: 0,
                    scale: 0.8,
                    rotationY: -180,
                    duration: this.animationDuration * 0.5,
                    ease: "power2.in",
                    onComplete: () => {
                        element.remove();
                    }
                }, 0);
            }
        });
        return timeline;
    }
}
class ProjectCardInteractions {
    constructor() {
        this.init();
    }
    init() {
        this.setupCardHovers();
        this.setupCardExpansions();
        this.setupQuickActions();
    }
    setupCardHovers() {
        document.addEventListener('mouseover', (e) => {
            const card = e.target.closest('.project-card');
            if (!card) return;
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const handleMouseMove = (e) => {
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                const percentX = (mouseX - centerX) / (rect.width / 2);
                const percentY = (mouseY - centerY) / (rect.height / 2);
                const rotateY = percentX * 10;
                const rotateX = -percentY * 10;
                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power2.out"
                });
            };
            card.addEventListener('mousemove', handleMouseMove);
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
                card.removeEventListener('mousemove', handleMouseMove);
            }, { once: true });
        });
    }
    setupCardExpansions() {
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.project-card');
            if (!card || e.target.closest('.project-link')) return;
            this.expandCard(card);
        });
    }
    expandCard(card) {
        const isExpanded = card.classList.contains('expanded');
        if (isExpanded) {
            this.collapseCard(card);
        } else {
            this.expandCardAnimation(card);
        }
    }
    expandCardAnimation(card) {
        const rect = card.getBoundingClientRect();
        const clone = card.cloneNode(true);
        clone.classList.add('card-expanded');
        gsap.set(clone, {
            position: 'fixed',
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            zIndex: 1000,
            transformOrigin: 'center center'
        });
        document.body.appendChild(clone);
        gsap.to(clone, {
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => {
                this.addExpandedContent(clone);
            }
        });
        gsap.to(card, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.in"
        });
    }
    collapseCard(card) {
        const expandedCard = document.querySelector('.card-expanded');
        if (!expandedCard) return;
        const originalCard = document.querySelector(`[data-project-id="${expandedCard.dataset.projectId}"]`);
        const rect = originalCard.getBoundingClientRect();
        gsap.to(expandedCard, {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => {
                expandedCard.remove();
                gsap.to(originalCard, {
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.in"
                });
            }
        });
    }
    addExpandedContent(expandedCard) {
        const projectId = expandedCard.dataset.projectId;
        const project = window.projectFiltering.projects.find(p => p.id == projectId);
        if (!project) return;
        const expandedContent = document.createElement('div');
        expandedContent.className = 'expanded-content';
        expandedContent.innerHTML = `
            <button class="close-expanded">
                <i class="fas fa-times"></i>
            </button>
            <div class="expanded-header">
                <h2>${project.title}</h2>
                <div class="expanded-meta">
                    <span class="project-category">${this.formatCategory(project.category)}</span>
                    <span class="project-year">${project.year}</span>
                    <span class="project-status ${project.status}">${this.formatStatus(project.status)}</span>
                </div>
            </div>
            <div class="expanded-body">
                <div class="expanded-description">
                    <h3>Project Overview</h3>
                    <p>${project.description}</p>
                </div>
                <div class="expanded-tech">
                    <h3>Technologies Used</h3>
                    <div class="tech-list">
                        ${project.technologies.map(tech => 
                            `<span class="tech-item">${tech}</span>`
                        ).join('')}
                    </div>
                </div>
                <div class="expanded-links">
                    <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="expanded-link">
                        <i class="fas fa-external-link-alt"></i>
                        View Live Demo
                    </a>
                    <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="expanded-link">
                        <i class="fab fa-github"></i>
                        View Source Code
                    </a>
                </div>
            </div>
        `;
        expandedCard.appendChild(expandedContent);
        const closeBtn = expandedContent.querySelector('.close-expanded');
        closeBtn.addEventListener('click', () => {
            this.collapseCard(expandedCard);
        });
        gsap.from(expandedContent.children, {
            opacity: 0,
            y: 30,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out"
        });
    }
    setupQuickActions() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.quick-action')) {
                e.preventDefault();
                const action = e.target.closest('.quick-action').dataset.action;
                const card = e.target.closest('.project-card');
                const projectId = card.dataset.projectId;
                this.handleQuickAction(action, projectId);
            }
        });
    }
    handleQuickAction(action, projectId) {
        const project = window.projectFiltering.projects.find(p => p.id == projectId);
        switch (action) {
            case 'favorite':
                this.toggleFavorite(projectId);
                break;
            case 'share':
                this.shareProject(project);
                break;
            case 'bookmark':
                this.toggleBookmark(projectId);
                break;
        }
    }
    toggleFavorite(projectId) {
        const card = document.querySelector(`[data-project-id="${projectId}"]`);
        const favoriteBtn = card.querySelector('.favorite-btn');
        if (favoriteBtn) {
            favoriteBtn.classList.toggle('active');
            gsap.fromTo(favoriteBtn.querySelector('i'), {
                scale: 1
            }, {
                scale: 1.3,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
        }
    }
    shareProject(project) {
        const shareModal = this.createShareModal(project);
        document.body.appendChild(shareModal);
        gsap.fromTo(shareModal, {
            opacity: 0,
            scale: 0.8
        }, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "back.out(1.7)"
        });
    }
    createShareModal(project) {
        const modal = document.createElement('div');
        modal.className = 'share-modal';
        modal.innerHTML = `
            <div class="share-content">
                <button class="close-share">
                    <i class="fas fa-times"></i>
                </button>
                <h3>Share ${project.title}</h3>
                <div class="share-options">
                    <button class="share-option" data-platform="twitter">
                        <i class="fab fa-twitter"></i>
                        Twitter
                    </button>
                    <button class="share-option" data-platform="linkedin">
                        <i class="fab fa-linkedin"></i>
                        LinkedIn
                    </button>
                    <button class="share-option" data-platform="facebook">
                        <i class="fab fa-facebook"></i>
                        Facebook
                    </button>
                    <button class="share-option" data-platform="copy">
                        <i class="fas fa-link"></i>
                        Copy Link
                    </button>
                </div>
            </div>
        `;
        modal.querySelector('.close-share').addEventListener('click', () => {
            this.closeShareModal(modal);
        });
        modal.querySelectorAll('.share-option').forEach(option => {
            option.addEventListener('click', () => {
                const platform = option.dataset.platform;
                this.handleShare(project, platform);
                this.closeShareModal(modal);
            });
        });
        return modal;
    }
    handleShare(project, platform) {
        const url = project.demoUrl;
        const text = `Check out ${project.title} - ${project.description}`;
        let shareUrl = '';
        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                this.showNotification('Link copied to clipboard!');
                return;
        }
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    closeShareModal(modal) {
        gsap.to(modal, {
            opacity: 0,
            scale: 0.8,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                modal.remove();
            }
        });
    }
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        gsap.fromTo(notification, {
            opacity: 0,
            y: 20
        }, {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
                setTimeout(() => {
                    gsap.to(notification, {
                        opacity: 0,
                        y: -20,
                        duration: 0.3,
                        ease: "power2.in",
                        onComplete: () => {
                            notification.remove();
                        }
                    });
                }, 2000);
            }
        });
    }
    formatCategory(category) {
        return category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
    formatStatus(status) {
        return status.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
}
document.addEventListener('DOMContentLoaded', () => {
    window.projectFiltering = new ProjectFiltering();
    window.projectCardInteractions = new ProjectCardInteractions();
});
