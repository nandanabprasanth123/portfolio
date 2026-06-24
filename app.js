document.addEventListener('DOMContentLoaded', () => {
    // Dynamic content loading
    fetch('portfolio-data.json')
        .then(response => response.json())
        .then(data => {
            initializePortfolio(data);
        })
        .catch(error => {
            console.error('Error loading portfolio data:', error);
            // Fallback content in case JSON fails to load
            document.getElementById('profile-name').textContent = "Nandana B Prasanth";
        });

    // Setup interactive background canvas
    initNeuralBackground();
    
    // Setup scroll animations and navigation
    initScrollInteractions();
});

function initializePortfolio(data) {
    const personal = data.personal;
    
    // Set personal information
    document.getElementById('profile-name').textContent = personal.name;
    document.getElementById('hero-name').textContent = personal.name;
    document.getElementById('about-text').textContent = personal.about;
    
    // Init Typing Effect
    initTypingEffect([
        personal.branch,
        "Specializing in Artificial Intelligence",
        "Robotics Enthusiast",
        "Database Systems Architect"
    ]);

    // Populate Skills
    populateSkills(data.skills);

    // Populate Projects
    populateProjects(data.projects);

    // Populate Contact links
    const contact = data.contact;
    
    const phoneLink = document.getElementById('contact-phone-link');
    const phoneText = document.getElementById('contact-phone-text');
    if (phoneLink && phoneText) {
        phoneLink.href = `tel:${contact.phone.replace(/\s+/g, '')}`;
        phoneText.textContent = contact.phone;
    }

    const emailLink = document.getElementById('contact-email-link');
    const emailText = document.getElementById('contact-email-text');
    if (emailLink && emailText) {
        emailLink.href = `mailto:${contact.email}`;
        emailText.textContent = contact.email;
    }

    const githubLink = document.getElementById('contact-github-link');
    const githubText = document.getElementById('contact-github-text');
    if (githubLink && githubText) {
        githubLink.href = contact.github;
        const username = contact.github.split('github.com/')[1] || 'GitHub';
        githubText.textContent = username;
    }

    const linkedinLink = document.getElementById('contact-linkedin-link');
    const linkedinText = document.getElementById('contact-linkedin-text');
    if (linkedinLink && linkedinText) {
        linkedinLink.href = contact.linkedin;
        linkedinText.textContent = "Nandana B Prasanth";
    }
    
    // Set class references for fallback
    document.querySelectorAll('.github-link').forEach(link => link.href = contact.github);
    document.querySelectorAll('.linkedin-link').forEach(link => link.href = contact.linkedin);
}

// Typing Effect
function initTypingEffect(words) {
    const target = document.getElementById('typing-text');
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            target.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            target.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 120;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at full word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before typing next word
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

// Skills Renderer
function populateSkills(categories) {
    const container = document.getElementById('skills-container');
    container.innerHTML = ''; // Clear fallback

    categories.forEach(category => {
        const catCard = document.createElement('div');
        catCard.className = 'skills-card glass-panel fade-in';
        
        let skillsHtml = `
            <h3 class="skills-category-title gradient-text">${category.category}</h3>
            <div class="skills-list">
        `;

        category.items.forEach(skill => {
            skillsHtml += `
                <div class="skill-item">
                    <div class="skill-info">
                        <span class="skill-name">
                            <i class="${skill.icon}" style="color: ${skill.color || 'var(--accent-cyan)'}; margin-right: 8px;"></i>
                            ${skill.name}
                        </span>
                        <span class="skill-level">${skill.level}</span>
                    </div>
                    <div class="skill-bar-bg">
                        <div class="skill-bar-fill" style="width: 0%; background: linear-gradient(90deg, var(--accent-blue), ${skill.color || 'var(--accent-cyan)'});" data-width="${skill.percentage}%"></div>
                    </div>
                </div>
            `;
        });

        skillsHtml += `</div>`;
        catCard.innerHTML = skillsHtml;
        container.appendChild(catCard);
    });

    // Trigger skills bar animation when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fills = entry.target.querySelectorAll('.skill-bar-fill');
                fills.forEach(fill => {
                    fill.style.width = fill.getAttribute('data-width');
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.skills-card').forEach(card => observer.observe(card));
}

// Projects Renderer
function populateProjects(projects) {
    const container = document.getElementById('projects-container');
    container.innerHTML = '';

    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card glass-panel fade-in';

        // Choose placeholder icon based on tags
        let projectIcon = 'fa-laptop-code';
        if (project.tags.includes('Robotics')) projectIcon = 'fa-robot';
        else if (project.tags.includes('DBMS') || project.tags.includes('Database')) projectIcon = 'fa-database';
        else if (project.tags.includes('AI') || project.tags.includes('NLP')) projectIcon = 'fa-brain';

        let tagsHtml = project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('');

        card.innerHTML = `
            <div class="project-visual">
                <div class="project-icon-wrapper">
                    <i class="fas ${projectIcon} project-large-icon"></i>
                </div>
                <div class="project-glow"></div>
            </div>
            <div class="project-info">
                <span class="project-subtitle">${project.subtitle}</span>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-desc">${project.description}</p>
                <div class="project-tags">
                    ${tagsHtml}
                </div>
                <div class="project-actions">
                    <a href="${project.github}" class="btn btn-icon btn-secondary" target="_blank" aria-label="GitHub Repository">
                        <i class="fab fa-github"></i> Source Code
                    </a>
                    <a href="${project.live}" class="btn btn-icon btn-primary" target="_blank" aria-label="Live Demo">
                        <i class="fas fa-external-link-alt"></i> Live Demo
                    </a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Scroll interactions and navigation menu active states
function initScrollInteractions() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const header = document.querySelector('header');

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll listener for header shrink and active links
    window.addEventListener('scroll', () => {
        // Header transparency adjustment
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }

        // Active link dynamic class
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = '#' + section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSectionId) {
                link.classList.add('active');
            }
        });
    });

    // Fade-in entries on scroll using IntersectionObserver
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    // Mark sections for fade-in
    sections.forEach(section => {
        section.classList.add('section-fade');
        fadeObserver.observe(section);
    });
}

// Interactive Neural Canvas Background
function initNeuralBackground() {
    const canvas = document.getElementById('background-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    // Handle screen resize
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        createParticles();
    });

    // Track mouse coordinates
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 2.5 + 1;
            // Introduce beautiful cyan/purple neural glow
            this.color = Math.random() > 0.5 ? 'rgba(0, 242, 254, 0.7)' : 'rgba(155, 93, 229, 0.7)';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off walls
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse interact (gentle attraction / gravity)
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= (dx / dist) * force * 0.6;
                    this.y -= (dy / dist) * force * 0.6;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0; // reset shadow for performance
        }
    }

    function createParticles() {
        particles = [];
        // Adaptive density based on resolution
        const count = Math.floor((width * height) / 13000);
        const maxParticles = Math.min(count, 110); // cap to keep it performance friendly
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }
    }

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Threshold distance to draw connection lines
                if (dist < 110) {
                    const alpha = (110 - dist) / 110 * 0.2;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        drawLines();
        requestAnimationFrame(animate);
    }

    createParticles();
    animate();
}
