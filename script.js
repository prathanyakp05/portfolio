/* ==========================================================================
   IDE PORTFOLIO SCRIPT CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTypewriter();
    initSmoothScroll();
    initIntersectionObservers();
    initProjectsModal();
    initTerminal();
    initBackToTop();
});

/* ==========================================================================
   THEME SWITCHER (DARK / LIGHT IDE THEMES)
   ========================================================================== */
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.className = savedTheme;
    } else {
        body.className = 'dark-theme';
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light-theme');
            showToast('☀️ Switched to GitHub Light Theme');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark-theme');
            showToast('🌙 Switched to One Dark Pro Theme');
        }
    });
}

/* ==========================================================================
   HERO TYPING ANIMATION
   ========================================================================== */
function initTypewriter() {
    const textElement = document.getElementById('typewriter-text');
    if (!textElement) return;

    const phrases = [
        'Software Engineer',
        'Generative AI Developer',
        'Quality Assurance Analyst'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            textElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            textElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before next
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/* ==========================================================================
   SMOOTH SCROLL FOR HERO ACTION
   ========================================================================== */
function initSmoothScroll() {
    const btnViewWork = document.getElementById('btn-view-work');
    const secProjects = document.getElementById('sec-projects');

    if (btnViewWork && secProjects) {
        btnViewWork.addEventListener('click', () => {
            secProjects.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            showToast('📂 Scrolled to projects');
        });
    }
}

/* ==========================================================================
   SCROLL INTERSECTIONS (SKILLS PROGRESS SWEEPS)
   ========================================================================== */
function initIntersectionObservers() {
    const skillsSection = document.getElementById('sec-skills');
    const progressFills = document.querySelectorAll('.sm-fill');

    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressFills.forEach(fill => {
                    const width = fill.parentElement.previousElementSibling.children[1].textContent;
                    fill.style.width = '0';
                    setTimeout(() => {
                        fill.style.width = width;
                    }, 100);
                });
                skillsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
}

/* ==========================================================================
   PROJECT DETAILS OVERLAY DRAWER
   ========================================================================== */
function initProjectsModal() {
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('modal-project-details');
    const openBtns = document.querySelectorAll('.open-modal-btn');
    const closeBtn = document.querySelector('.modal-close');
    const backdrop = document.querySelector('.modal-backdrop');

    const projectData = {
        'waste-detection': {
            title: 'Real-Time Waste Detection & Alert System',
            subtitle: 'Java / OpenCV / IoT Webhooks',
            desc: 'Developed a robust automated detection network that isolates floating and submerged trash items in river channels and coastal borders. Analyzes real-time image packets, triggering direct alarms to regional clean-up teams for prompt debris recovery.',
            features: [
                'Computer Vision Integration: Custom color filters for detecting submerged plastics.',
                'Instant Webhooks: Automated alerts sent to environmental containment squads.',
                'Data Logging: Track trash accumulation stats over time.',
                'Highly responsive notification grid for local authorities.'
            ],
            tech: ['Java', 'OpenCV', 'IoT Webhooks', 'Spring Boot', 'MySQL']
        },
        'invoice-extraction': {
            title: 'Intelligent Invoice Extraction System',
            subtitle: 'Python / GenAI / Spring Boot',
            desc: 'An AI-driven parsing portal designed to import invoice files (PDF/images), run optical character recognition (OCR), and parse critical entities (vendor details, taxation figures, items) using fine-tuned Prompt Engineering and Generative AI, dumping structured tables directly into databases.',
            features: [
                'Adaptive Form Parsing: Extracts fields accurately without needing fixed layout coordinates.',
                'Zero-shot Entity Extraction: Flexibly pulls key-value pairs from complex vendor tables.',
                'Spring Boot Middleware: Runs asynchronous parsing tasks securely.',
                'Export Utilities: Download organized data as CSV or JSON arrays.'
            ],
            tech: ['Python', 'Generative AI', 'Spring Boot', 'OCR APIs', 'MySQL']
        }
    };

    function openModal(projectId) {
        const data = projectData[projectId];
        if (!data) return;

        let featuresHtml = '';
        data.features.forEach(f => {
            featuresHtml += `<li>${f}</li>`;
        });

        let techHtml = '';
        data.tech.forEach(t => {
            techHtml += `<span>${t}</span>`;
        });

        modalContent.innerHTML = `
            <h3 class="modal-project-title">${data.title}</h3>
            <span class="modal-project-subtitle">${data.subtitle}</span>
            <p class="modal-project-desc">${data.desc}</p>
            
            <h4 class="modal-project-subheading">Specifications</h4>
            <ul class="modal-project-list">
                ${featuresHtml}
            </ul>
            
            <h4 class="modal-project-subheading">Tech Stack</h4>
            <div class="modal-project-tech">
                ${techHtml}
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.getAttribute('data-project');
            openModal(projectId);
        });
    });

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

/* ==========================================================================
   INTERACTIVE SHELL / TERMINAL SIMULATOR
   ========================================================================== */
function initTerminal() {
    const input = document.getElementById('terminal-input');
    const history = document.getElementById('terminal-history');
    const body = document.getElementById('terminal-body');

    if (!input || !history || !body) return;

    const commands = {
        'help': 'Available commands: <span class="keyword">about</span>, <span class="keyword">skills</span>, <span class="keyword">projects</span>, <span class="keyword">contact</span>, <span class="keyword">clear</span>',
        'about': 'Prathanya P. | Aspiring Software Engineer | B.Sc. Computer Systems & Design | CGPA: 7.4. Passionate about backend development, software QA, and leveraging GenAI pipelines.',
        'skills': 'Technical skills: <span class="string">Java, Spring Boot, MySQL, HTML, CSS, JavaScript</span>. Soft skills: <span class="string">Strategic Planning, Teamwork, Leadership</span>.',
        'projects': 'Featured Projects:<br>1. <span class="keyword">waste-detection</span>: Real-time alert system for water debris.<br>2. <span class="keyword">invoice-extraction</span>: Intelligent parser using Generative AI.',
        'contact': 'Reach me at:<br>- Phone: <span class="string">9894390455</span><br>- Email: <span class="string">Prathanyakp@gmail.com</span><br>- GitHub: <span class="string">github.com/prathanyakp05</span><br>- LinkedIn: <span class="string">linkedin.com/in/prathanya-k-p-a673b9373/</span>'
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawVal = input.value.trim();
            const cmd = rawVal.toLowerCase();
            input.value = '';

            if (cmd === '') return;

            // Output command prompt line
            const promptLine = document.createElement('div');
            promptLine.className = 'term-line';
            promptLine.innerHTML = `<span class="prompt">guest@prathanya:~$</span> ${rawVal}`;
            history.appendChild(promptLine);

            // Execute commands
            const outputLine = document.createElement('div');
            outputLine.className = 'term-line';

            if (cmd === 'clear') {
                history.innerHTML = '';
                return;
            } else if (commands[cmd]) {
                outputLine.innerHTML = commands[cmd];
            } else {
                outputLine.className = 'term-line error';
                outputLine.innerHTML = `command not found: "${rawVal}". Type "help" for options.`;
            }

            history.appendChild(outputLine);
            
            // Auto scroll to bottom
            body.scrollTop = body.scrollHeight;
        }
    });

    // Keep focus on input if terminal is clicked
    body.addEventListener('click', () => {
        input.focus();
    });
}

/* ==========================================================================
   BACK TO TOP CONTROLS
   ========================================================================== */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================================================
   TOAST NOTIFICATION ENGINE
   ========================================================================== */
const toastContainer = document.getElementById('toast-container');

function showToast(message) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('removing');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 3000);
}
