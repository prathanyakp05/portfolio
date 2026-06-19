/* ==========================================================================
   PORTFOLIO INTERACTIVE CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initTypewriter();
    initScrollSpyAndHeader();
    initTabs();
    initIntersectionObservers();
    initProjectsModal();
    initContactForm();
    initBackToTop();
});

/* ==========================================================================
   THEME TOGGLER (DARK / LIGHT MODE)
   ========================================================================== */
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Check saved theme or system settings
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.className = savedTheme;
    } else {
        // Default to dark theme
        body.className = 'dark-theme';
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light-theme');
            showToast('☀️ Switched to Light Theme');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark-theme');
            showToast('🌙 Switched to Dark Theme');
        }
    });
}

/* ==========================================================================
   MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    toggleBtn.addEventListener('click', () => {
        toggleBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleBtn.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

/* ==========================================================================
   HERO TYPOWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
    const textElement = document.getElementById('typewriter-text');
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
            typingSpeed = 50; // Deleting is faster
        } else {
            textElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        // Typing finished
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at end of word
        } 
        // Deletion finished
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/* ==========================================================================
   HEADER SCROLL & ACTIVE NAV SPY
   ========================================================================== */
function initScrollSpyAndHeader() {
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // Shrink header background
        if (scrollPos > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll Spy active sections
        sections.forEach(sec => {
            const top = sec.offsetTop - 120;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/* ==========================================================================
   ABOUT TABS (EDUCATION VS CERTIFICATIONS)
   ========================================================================== */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Deactivate all
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Activate target
            btn.classList.add('active');
            document.getElementById(`tab-${targetTab}`).classList.add('active');
        });
    });
}

/* ==========================================================================
   SCROLL REVEAL & SKILLS PROGRESS ANIMATION
   ========================================================================== */
function initIntersectionObservers() {
    // 1. Reveal sections on scroll
    const fadeSections = document.querySelectorAll('.fade-in-section');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, {
        threshold: 0.15
    });

    fadeSections.forEach(section => revealObserver.observe(section));

    // 2. Animate skill progress bars
    const skillsSection = document.getElementById('skills');
    const progressFills = document.querySelectorAll('.progress-fill');
    
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressFills.forEach(fill => {
                    const width = fill.style.width;
                    // Reset to 0 then fill to trigger animation
                    fill.style.width = '0';
                    setTimeout(() => {
                        fill.style.width = width;
                    }, 50);
                });
                skillsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
}

/* ==========================================================================
   PROJECTS DRAWER MODAL SYSTEM
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
            subtitle: 'Environmental Protection & Computer Vision Solution',
            desc: 'Developed an automated visual monitoring framework designed to locate floating and submerged plastics/debris inside rivers and coastal borders. Utilizing integrated camera feeds, the system triggers swift alerts to localized municipal departments for fast waste recovery.',
            features: [
                'Object Identification: Built using custom models tuned to isolate floating garbage types.',
                'Submerged Analytics: Integrates custom color distortion filters to recognize debris underwater.',
                'Alert Mechanisms: Automated Webhook APIs triggering text/email notifications to environmental response units.',
                'Interactive dashboard showing local coordinates and historical garbage volume graphs.'
            ],
            tech: ['Java', 'OpenCV', 'IoT Webhooks', 'Spring Boot', 'MySQL', 'CSS Grid']
        },
        'invoice-extraction': {
            title: 'Intelligent Invoice Extraction System',
            subtitle: 'AI Document Parsing & OCR Pipeline',
            desc: 'A smart web platform engineered to import raw, unstructured billing files (PDF/JPG) and execute OCR extraction. Utilizing fine-tuned Prompt Engineering and Generative AI, it parses specific items (like vendor names, totals, and line items) automatically, dumping structured tables straight into a secure database.',
            features: [
                'Zero-shot Invoice Recognition: Adapts to diverse invoicing layouts without needing manual templates.',
                'Advanced Prompt Engineering: Optimized system prompts reducing data extraction errors by 90%.',
                'Spring Boot Middleware: Robust RESTful endpoints executing tasks asynchronously.',
                'CSV & JSON Downloader: Export formatted tables instantly for corporate ledger integration.'
            ],
            tech: ['Python', 'Generative AI', 'Spring Boot', 'OCR APIs', 'React (Frontend mock)', 'MySQL']
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
            
            <h4 class="modal-project-subheading">Key Specifications</h4>
            <ul class="modal-project-list">
                ${featuresHtml}
            </ul>
            
            <h4 class="modal-project-subheading">Tech Stack</h4>
            <div class="modal-project-tech">
                ${techHtml}
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
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

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

/* ==========================================================================
   TOAST SYSTEM & CONTACT FORM SUBMIT
   ========================================================================== */
const toastContainer = document.getElementById('toast-container');

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    
    toastContainer.appendChild(toast);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.classList.add('removing');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 4000);
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Simulating sending animation
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showToast('✉️ Message Sent Successfully! I will reply shortly.');
            form.reset();
            
            // Reset floating labels
            const inputs = form.querySelectorAll('.form-input');
            inputs.forEach(input => {
                input.blur();
            });

            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

/* ==========================================================================
   BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    
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
