class SkillVisualization {
    constructor() {
        this.skills = {
            frontend: [
                { name: 'React', level: 95, experience: 5, projects: 25 },
                { name: 'Vue.js', level: 85, experience: 4, projects: 18 },
                { name: 'TypeScript', level: 90, experience: 4, projects: 20 },
                { name: 'Next.js', level: 88, experience: 3, projects: 15 },
                { name: 'HTML/CSS', level: 95, experience: 6, projects: 30 }
            ],
            backend: [
                { name: 'Node.js', level: 92, experience: 5, projects: 22 },
                { name: 'Python', level: 87, experience: 4, projects: 18 },
                { name: 'Express.js', level: 90, experience: 5, projects: 20 },
                { name: 'GraphQL', level: 82, experience: 3, projects: 12 },
                { name: 'REST APIs', level: 93, experience: 5, projects: 24 }
            ],
            database: [
                { name: 'MongoDB', level: 88, experience: 4, projects: 18 },
                { name: 'PostgreSQL', level: 85, experience: 4, projects: 16 },
                { name: 'Redis', level: 78, experience: 3, projects: 10 },
                { name: 'MySQL', level: 82, experience: 3, projects: 12 },
                { name: 'Firebase', level: 80, experience: 3, projects: 14 }
            ],
            devops: [
                { name: 'Docker', level: 80, experience: 3, projects: 12 },
                { name: 'AWS', level: 78, experience: 3, projects: 10 },
                { name: 'CI/CD', level: 75, experience: 2, projects: 8 },
                { name: 'Kubernetes', level: 70, experience: 2, projects: 6 },
                { name: 'Git', level: 90, experience: 5, projects: 25 }
            ]
        };
        this.radarChart = null;
        this.constellation = null;
        this.timeline = null;
        this.init();
    }
    init() {
        this.createSkillVisualizationUI();
        this.setupRadarChart();
        this.setupSkillConstellation();
        this.setupSkillTimeline();
        this.setupInteractiveProgress();
        this.setupSkillComparison();
    }
    createSkillVisualizationUI() {
        const skillsSection = document.querySelector('.skills-section');
        if (!skillsSection) return;
        const skillsContainer = document.createElement('div');
        skillsContainer.className = 'enhanced-skills-container';
        skillsContainer.innerHTML = `
            <div class="skills-tabs">
                <button class="skill-tab active" data-category="frontend">Frontend</button>
                <button class="skill-tab" data-category="backend">Backend</button>
                <button class="skill-tab" data-category="database">Database</button>
                <button class="skill-tab" data-category="devops">DevOps</button>
                <button class="skill-tab" data-category="overview">Overview</button>
            </div>
            <div class="skills-content">
                <div class="skills-view" id="skillsView">
                    <!-- Dynamic content will be inserted here -->
                </div>
                <div class="skills-visualization">
                    <div class="radar-chart-container">
                        <canvas id="radarChart"></canvas>
                    </div>
                    <div class="constellation-container">
                        <canvas id="skillConstellation"></canvas>
                    </div>
                </div>
            </div>
        `;
        const existingContent = skillsSection.querySelector('.container');
        if (existingContent) {
            existingContent.innerHTML = '';
            existingContent.appendChild(skillsContainer);
        }
        this.setupTabNavigation();
    }
    setupTabNavigation() {
        const tabs = document.querySelectorAll('.skill-tab');
        const skillsView = document.getElementById('skillsView');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const category = tab.dataset.category;
                this.displaySkillCategory(category);
            });
        });
        this.displaySkillCategory('frontend');
    }
    displaySkillCategory(category) {
        const skillsView = document.getElementById('skillsView');
        if (!skillsView) return;
        if (category === 'overview') {
            this.displayOverview();
        } else {
            this.displaySkillDetails(category);
        }
    }
    displaySkillDetails(category) {
        const skillsView = document.getElementById('skillsView');
        const skills = this.skills[category] || [];
        skillsView.innerHTML = `
            <div class="skill-details">
                <h3>${category.charAt(0).toUpperCase() + category.slice(1)} Skills</h3>
                <div class="skills-grid-enhanced">
                    ${skills.map(skill => this.createSkillCard(skill)).join('')}
                </div>
            </div>
        `;
        gsap.from('.skill-card-enhanced', {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
        });
    }
    createSkillCard(skill) {
        return `
            <div class="skill-card-enhanced" data-skill="${skill.name}">
                <div class="skill-header">
                    <h4>${skill.name}</h4>
                    <div class="skill-level">${skill.level}%</div>
                </div>
                <div class="skill-progress-enhanced">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${skill.level}%"></div>
                    </div>
                </div>
                <div class="skill-stats">
                    <div class="stat">
                        <span class="stat-value">${skill.experience}</span>
                        <span class="stat-label">Years</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${skill.projects}</span>
                        <span class="stat-label">Projects</span>
                    </div>
                </div>
                <div class="skill-actions">
                    <button class="skill-action-btn" data-action="details">Details</button>
                    <button class="skill-action-btn" data-action="compare">Compare</button>
                </div>
            </div>
        `;
    }
    displayOverview() {
        const skillsView = document.getElementById('skillsView');
        const categoryAverages = {};
        Object.keys(this.skills).forEach(category => {
            const skills = this.skills[category];
            const average = Math.round(skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length);
            categoryAverages[category] = average;
        });
        skillsView.innerHTML = `
            <div class="skills-overview">
                <h3>Skills Overview</h3>
                <div class="overview-stats">
                    <div class="overview-stat">
                        <div class="stat-number">${Object.values(this.skills).flat().length}</div>
                        <div class="stat-label">Total Skills</div>
                    </div>
                    <div class="overview-stat">
                        <div class="stat-number">${Math.round(Object.values(categoryAverages).reduce((sum, avg) => sum + avg, 0) / Object.keys(categoryAverages).length)}%</div>
                        <div class="stat-label">Average Level</div>
                    </div>
                    <div class="overview-stat">
                        <div class="stat-number">${Object.values(this.skills).flat().reduce((sum, skill) => sum + skill.projects, 0)}</div>
                        <div class="stat-label">Total Projects</div>
                    </div>
                </div>
                <div class="category-averages">
                    ${Object.entries(categoryAverages).map(([category, average]) => `
                        <div class="category-average">
                            <h4>${category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                            <div class="average-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${average}%"></div>
                                </div>
                                <span class="average-value">${average}%</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    setupRadarChart() {
        const canvas = document.getElementById('radarChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        this.radarChart = new RadarChart(ctx, canvas);
        this.updateRadarChart('frontend');
    }
    updateRadarChart(category) {
        if (!this.radarChart) return;
        const skills = this.skills[category] || [];
        const data = skills.map(skill => ({
            label: skill.name,
            value: skill.level,
            experience: skill.experience,
            projects: skill.projects
        }));
        this.radarChart.update(data);
    }
    setupSkillConstellation() {
        const canvas = document.getElementById('skillConstellation');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        this.constellation = new SkillConstellation(ctx, canvas);
        this.updateConstellation();
    }
    updateConstellation() {
        if (!this.constellation) return;
        const allSkills = Object.values(this.skills).flat();
        this.constellation.update(allSkills);
    }
    setupSkillTimeline() {
        this.timeline = new SkillTimeline();
        this.timeline.create();
    }
    setupInteractiveProgress() {
        document.addEventListener('mouseover', (e) => {
            const skillCard = e.target.closest('.skill-card-enhanced');
            if (!skillCard) return;
            const progressFill = skillCard.querySelector('.progress-fill');
            if (progressFill) {
                gsap.to(progressFill, {
                    width: '100%',
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
        document.addEventListener('mouseout', (e) => {
            const skillCard = e.target.closest('.skill-card-enhanced');
            if (!skillCard) return;
            const skillName = skillCard.dataset.skill;
            const skill = this.findSkill(skillName);
            if (skill) {
                const progressFill = skillCard.querySelector('.progress-fill');
                gsap.to(progressFill, {
                    width: `${skill.level}%`,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('skill-action-btn')) {
                const action = e.target.dataset.action;
                const skillCard = e.target.closest('.skill-card-enhanced');
                const skillName = skillCard.dataset.skill;
                this.handleSkillAction(action, skillName, skillCard);
            }
        });
    }
    findSkill(skillName) {
        for (const category of Object.values(this.skills)) {
            const skill = category.find(s => s.name === skillName);
            if (skill) return skill;
        }
        return null;
    }
    handleSkillAction(action, skillName, skillCard) {
        const skill = this.findSkill(skillName);
        if (!skill) return;
        switch (action) {
            case 'details':
                this.showSkillDetails(skill);
                break;
            case 'compare':
                this.showSkillComparison(skill);
                break;
        }
    }
    showSkillDetails(skill) {
        const modal = this.createSkillModal(skill, 'details');
        document.body.appendChild(modal);
        gsap.fromTo(modal, {
            opacity: 0,
            scale: 0.8
        }, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "back.out(1.7)"
        });
    }
    showSkillComparison(skill) {
        const modal = this.createSkillModal(skill, 'comparison');
        document.body.appendChild(modal);
        gsap.fromTo(modal, {
            opacity: 0,
            scale: 0.8
        }, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "back.out(1.7)"
        });
    }
    createSkillModal(skill, type) {
        const modal = document.createElement('div');
        modal.className = 'skill-modal';
        let content = '';
        if (type === 'details') {
            content = `
                <div class="skill-modal-content">
                    <button class="close-modal">
                        <i class="fas fa-times"></i>
                    </button>
                    <h3>${skill.name} Details</h3>
                    <div class="skill-details-grid">
                        <div class="detail-item">
                            <span class="detail-label">Proficiency Level</span>
                            <div class="detail-value">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${skill.level}%"></div>
                                </div>
                                <span>${skill.level}%</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Experience</span>
                            <span class="detail-value">${skill.experience} years</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Projects Completed</span>
                            <span class="detail-value">${skill.projects} projects</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Learning Curve</span>
                            <div class="learning-curve">
                                ${this.createLearningCurve(skill)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (type === 'comparison') {
            content = `
                <div class="skill-modal-content">
                    <button class="close-modal">
                        <i class="fas fa-times"></i>
                    </button>
                    <h3>${skill.name} Comparison</h3>
                    <div class="skill-comparison">
                        ${this.createSkillComparison(skill)}
                    </div>
                </div>
            `;
        }
        modal.innerHTML = content;
        modal.querySelector('.close-modal').addEventListener('click', () => {
            this.closeSkillModal(modal);
        });
        return modal;
    }
    createLearningCurve(skill) {
        const points = 10;
        let curveHTML = '<div class="curve-chart">';
        for (let i = 0; i < points; i++) {
            const progress = (i / points) * 100;
            const height = Math.sin((i / points) * Math.PI) * skill.level;
            curveHTML += `
                <div class="curve-point" style="left: ${progress}%; height: ${height}%;"></div>
            `;
        }
        curveHTML += '</div>';
        return curveHTML;
    }
    createSkillComparison(skill) {
        const allSkills = Object.values(this.skills).flat();
        const similarSkills = allSkills
            .filter(s => s.name !== skill.name && Math.abs(s.level - skill.level) < 20)
            .sort((a, b) => Math.abs(a.level - skill.level) - Math.abs(b.level - skill.level))
            .slice(0, 5);
        return `
            <div class="comparison-list">
                <div class="comparison-item current">
                    <span class="skill-name">${skill.name}</span>
                    <div class="comparison-bar">
                        <div class="comparison-fill" style="width: ${skill.level}%"></div>
                        <span>${skill.level}%</span>
                    </div>
                </div>
                ${similarSkills.map(s => `
                    <div class="comparison-item">
                        <span class="skill-name">${s.name}</span>
                        <div class="comparison-bar">
                            <div class="comparison-fill" style="width: ${s.level}%"></div>
                            <span>${s.level}%</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    closeSkillModal(modal) {
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
    setupSkillComparison() {
        const comparisonTool = new SkillComparisonTool();
        comparisonTool.init();
    }
}
class RadarChart {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.data = [];
        this.animationProgress = 0;
        this.init();
    }
    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.animate();
    }
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
    }
    update(data) {
        this.data = data;
        this.animationProgress = 0;
    }
    animate() {
        requestAnimationFrame(() => this.animate());
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.data.length === 0) return;
        if (this.animationProgress < 1) {
            this.animationProgress += 0.02;
        }
        this.draw();
    }
    draw() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 60;
        const angleStep = (Math.PI * 2) / this.data.length;
        this.drawGrid(centerX, centerY, radius, angleStep);
        this.drawData(centerX, centerY, radius, angleStep);
        this.drawLabels(centerX, centerY, radius, angleStep);
    }
    drawGrid(centerX, centerY, radius, angleStep) {
        this.ctx.strokeStyle = 'rgba(0, 91, 187, 0.2)';
        this.ctx.lineWidth = 1;
        for (let i = 1; i <= 5; i++) {
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, (radius * i) / 5, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        this.data.forEach((_, index) => {
            const angle = angleStep * index - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        });
    }
    drawData(centerX, centerY, radius, angleStep) {
        this.ctx.fillStyle = 'rgba(0, 91, 187, 0.3)';
        this.ctx.strokeStyle = '#005BBB';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.data.forEach((item, index) => {
            const angle = angleStep * index - Math.PI / 2;
            const value = (item.value / 100) * this.animationProgress;
            const x = centerX + Math.cos(angle) * radius * value;
            const y = centerY + Math.sin(angle) * radius * value;
            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        this.data.forEach((item, index) => {
            const angle = angleStep * index - Math.PI / 2;
            const value = (item.value / 100) * this.animationProgress;
            const x = centerX + Math.cos(angle) * radius * value;
            const y = centerY + Math.sin(angle) * radius * value;
            this.ctx.fillStyle = '#005BBB';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    drawLabels(centerX, centerY, radius, angleStep) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px Montserrat';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.data.forEach((item, index) => {
            const angle = angleStep * index - Math.PI / 2;
            const x = centerX + Math.cos(angle) * (radius + 20);
            const y = centerY + Math.sin(angle) * (radius + 20);
            this.ctx.fillText(item.label, x, y);
        });
    }
}
class SkillConstellation {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.nodes = [];
        this.connections = [];
        this.animationProgress = 0;
        this.init();
    }
    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.animate();
    }
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
    }
    update(skills) {
        this.nodes = skills.map((skill, index) => ({
            id: index,
            name: skill.name,
            level: skill.level,
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.sqrt(skill.level) * 2,
            color: this.getSkillColor(skill.level)
        }));
        this.updateConnections();
        this.animationProgress = 0;
    }
    getSkillColor(level) {
        if (level >= 90) return '#00D4AA';
        if (level >= 80) return '#005BBB';
        if (level >= 70) return '#0080FF';
        return '#7C3AED';
    }
    updateConnections() {
        this.connections = [];
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const distance = this.getDistance(this.nodes[i], this.nodes[j]);
                if (distance < 150) {
                    this.connections.push({
                        from: this.nodes[i],
                        to: this.nodes[j],
                        strength: 1 - (distance / 150)
                    });
                }
            }
        }
    }
    getDistance(node1, node2) {
        const dx = node1.x - node2.x;
        const dy = node1.y - node2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    animate() {
        requestAnimationFrame(() => this.animate());
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.nodes.length === 0) return;
        if (this.animationProgress < 1) {
            this.animationProgress += 0.02;
        }
        this.updateNodes();
        this.drawConnections();
        this.drawNodes();
    }
    updateNodes() {
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            if (node.x < node.radius || node.x > this.canvas.width - node.radius) {
                node.vx *= -1;
            }
            if (node.y < node.radius || node.y > this.canvas.height - node.radius) {
                node.vy *= -1;
            }
            node.x = Math.max(node.radius, Math.min(this.canvas.width - node.radius, node.x));
            node.y = Math.max(node.radius, Math.min(this.canvas.height - node.radius, node.y));
        });
        this.updateConnections();
    }
    drawConnections() {
        this.connections.forEach(connection => {
            const opacity = connection.strength * this.animationProgress * 0.5;
            this.ctx.strokeStyle = `rgba(0, 91, 187, ${opacity})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(connection.from.x, connection.from.y);
            this.ctx.lineTo(connection.to.x, connection.to.y);
            this.ctx.stroke();
        });
    }
    drawNodes() {
        this.nodes.forEach(node => {
            const scale = this.animationProgress;
            this.ctx.fillStyle = node.color;
            this.ctx.globalAlpha = this.animationProgress;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius * scale, 0, Math.PI * 2);
            this.ctx.fill();
            if (this.animationProgress === 1) {
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '10px Montserrat';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(node.name, node.x, node.y + node.radius + 15);
            }
            this.ctx.globalAlpha = 1;
        });
    }
}
class SkillTimeline {
    constructor() {
        this.timeline = [];
        this.init();
    }
    init() {
        this.createTimeline();
    }
    create() {
        const skillsSection = document.querySelector('.skills-section');
        if (!skillsSection) return;
        const timelineContainer = document.createElement('div');
        timelineContainer.className = 'skill-timeline-container';
        timelineContainer.innerHTML = `
            <h3>Skill Acquisition Timeline</h3>
            <div class="timeline-content">
                ${this.timeline.map(item => this.createTimelineItem(item)).join('')}
            </div>
        `;
        skillsSection.appendChild(timelineContainer);
        gsap.from('.timeline-item', {
            opacity: 0,
            x: -50,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.skill-timeline-container',
                start: 'top 80%'
            }
        });
    }
    createTimelineItem(item) {
        return `
            <div class="timeline-item">
                <div class="timeline-date">${item.year}</div>
                <div class="timeline-content">
                    <h4>${item.skill}</h4>
                    <p>${item.description}</p>
                    <div class="timeline-level">Level: ${item.level}%</div>
                </div>
            </div>
        `;
    }
}
class SkillComparisonTool {
    constructor() {
        this.init();
    }
    init() {
        this.createComparisonUI();
        this.setupComparisonLogic();
    }
    createComparisonUI() {
        const skillsSection = document.querySelector('.skills-section');
        if (!skillsSection) return;
        const comparisonContainer = document.createElement('div');
        comparisonContainer.className = 'skill-comparison-container';
        comparisonContainer.innerHTML = `
            <h3>Compare Skills</h3>
            <div class="comparison-controls">
                <select id="skill1Select" class="skill-select">
                    <option value="">Select first skill</option>
                </select>
                <select id="skill2Select" class="skill-select">
                    <option value="">Select second skill</option>
                </select>
                <button id="compareBtn" class="compare-btn">Compare</button>
            </div>
            <div id="comparisonResult" class="comparison-result"></div>
        `;
        skillsSection.appendChild(comparisonContainer);
        this.populateSkillSelects();
    }
    populateSkillSelects() {
        const skill1Select = document.getElementById('skill1Select');
        const skill2Select = document.getElementById('skill2Select');
        const allSkills = Object.values(window.skillVisualization.skills).flat();
        const uniqueSkills = [...new Set(allSkills.map(s => s.name))];
        uniqueSkills.forEach(skillName => {
            const option1 = document.createElement('option');
            option1.value = skillName;
            option1.textContent = skillName;
            skill1Select.appendChild(option1);
            const option2 = document.createElement('option');
            option2.value = skillName;
            option2.textContent = skillName;
            skill2Select.appendChild(option2);
        });
    }
    setupComparisonLogic() {
        const compareBtn = document.getElementById('compareBtn');
        if (compareBtn) {
            compareBtn.addEventListener('click', () => {
                this.performComparison();
            });
        }
    }
    performComparison() {
        const skill1Select = document.getElementById('skill1Select');
        const skill2Select = document.getElementById('skill2Select');
        const resultDiv = document.getElementById('comparisonResult');
        if (!skill1Select.value || !skill2Select.value) {
            resultDiv.innerHTML = '<p class="error">Please select two skills to compare</p>';
            return;
        }
        const skill1 = window.skillVisualization.findSkill(skill1Select.value);
        const skill2 = window.skillVisualization.findSkill(skill2Select.value);
        if (!skill1 || !skill2) return;
        const comparisonHTML = `
            <div class="comparison-result-content">
                <div class="comparison-header">
                    <h4>${skill1.name} vs ${skill2.name}</h4>
                </div>
                <div class="comparison-metrics">
                    <div class="metric">
                        <span class="metric-label">Proficiency</span>
                        <div class="metric-bars">
                            <div class="metric-bar">
                                <span class="skill-name">${skill1.name}</span>
                                <div class="bar">
                                    <div class="fill" style="width: ${skill1.level}%"></div>
                                </div>
                                <span class="value">${skill1.level}%</span>
                            </div>
                            <div class="metric-bar">
                                <span class="skill-name">${skill2.name}</span>
                                <div class="bar">
                                    <div class="fill" style="width: ${skill2.level}%"></div>
                                </div>
                                <span class="value">${skill2.level}%</span>
                            </div>
                        </div>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Experience</span>
                        <div class="metric-bars">
                            <div class="metric-bar">
                                <span class="skill-name">${skill1.name}</span>
                                <span class="value">${skill1.experience} years</span>
                            </div>
                            <div class="metric-bar">
                                <span class="skill-name">${skill2.name}</span>
                                <span class="value">${skill2.experience} years</span>
                            </div>
                        </div>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Projects</span>
                        <div class="metric-bars">
                            <div class="metric-bar">
                                <span class="skill-name">${skill1.name}</span>
                                <span class="value">${skill1.projects} projects</span>
                            </div>
                            <div class="metric-bar">
                                <span class="skill-name">${skill2.name}</span>
                                <span class="value">${skill2.projects} projects</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        resultDiv.innerHTML = comparisonHTML;
        gsap.from('.comparison-result-content', {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.out"
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    window.skillVisualization = new SkillVisualization();
});
