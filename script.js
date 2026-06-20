/* ==========================================================================
   PORTFOLIO SCRIPT CONTROLLER (SPA ROUTING & VIEWS CONTROLLER)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initSPARouting();
    initTheme();
    initTypewriter();
    initMobileMenu();
    initScrollSpyAndHeader();
    initIntersectionObservers();
    initProjectsModal();
    initContactForm();
    initBackToTop();
});

/* ==========================================================================
   1. SINGLE PAGE APPLICATION (SPA) ROUTING SYSTEM
   ========================================================================== */
function initSPARouting() {
    const pageHome = document.getElementById('page-home');
    const pageResume = document.getElementById('page-resume');
    const pageContact = document.getElementById('page-contact');
    
    const btnViewWork = document.getElementById('btn-view-work');
    const btnContactMe = document.getElementById('btn-contact-me');
    const routeButtons = document.querySelectorAll('.nav-route');

    const views = {
        'home': pageHome,
        'resume': pageResume,
        'contact': pageContact
    };

    function navigateTo(targetView) {
        if (!views[targetView]) return;

        // Hide all views
        Object.keys(views).forEach(key => {
            views[key].classList.add('hidden');
        });

        // Show active view
        views[targetView].classList.remove('hidden');

        // Scroll page to top instantly on navigate
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });

        showToast(`📂 Switched to ${targetView.toUpperCase()} page`);
    }

    // Connect splash buttons
    if (btnViewWork) {
        btnViewWork.addEventListener('click', () => navigateTo('resume'));
    }
    if (btnContactMe) {
        btnContactMe.addEventListener('click', () => navigateTo('contact'));
    }

    // Connect nav header links & footer routes
    routeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.getAttribute('data-target');
            navigateTo(target);
        });
    });
}

/* ==========================================================================
   2. THEME SWITCHER (DARK / LIGHT MODES)
   ========================================================================== */
function initTheme() {
    const themeActions = document.querySelectorAll('.theme-toggle-action');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.className = savedTheme;
    } else {
        body.className = 'dark-theme';
    }

    themeActions.forEach(btn => {
        btn.addEventListener('click', () => {
            if (body.classList.contains('dark-theme')) {
                body.className = 'light-theme';
                localStorage.setItem('theme', 'light-theme');
                showToast('☀️ Switched to Light Mode');
            } else {
                body.className = 'dark-theme';
                localStorage.setItem('theme', 'dark-theme');
                showToast('🌙 Switched to Dark Mode');
            }
        });
    });
}

/* ==========================================================================
   3. TYPEWRITER EFFECT (HOME PAGE)
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
            typingSpeed = 1500; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/* ==========================================================================
   4. MOBILE NAVBAR TOGGLES (FOR MULTIPLE NAV HEADERS)
   ========================================================================== */
function initMobileMenu() {
    const mobileToggles = document.querySelectorAll('.mobile-menu-action');

    mobileToggles.forEach(toggleBtn => {
        toggleBtn.addEventListener('click', () => {
            const targetId = toggleBtn.getAttribute('data-target');
            const navMenu = document.getElementById(targetId);
            
            if (navMenu) {
                toggleBtn.classList.toggle('active');
                navMenu.classList.toggle('active');
            }
        });
    });

    // Close mobile nav when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const parentMenu = link.closest('.nav-menu');
            if (parentMenu && parentMenu.classList.contains('active')) {
                parentMenu.classList.remove('active');
                const targetBtn = document.querySelector(`[data-target="${parentMenu.id}"]`);
                if (targetBtn) targetBtn.classList.remove('active');
            }
        });
    });
}

/* ==========================================================================
   5. HEADER SCROLL & RESUME INTERN NAV SPY
   ========================================================================== */
function initScrollSpyAndHeader() {
    const headers = document.querySelectorAll('.header');
    const sections = document.querySelectorAll('.resume-section');
    const navLinks = document.querySelectorAll('#nav-menu-resume .nav-link');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // Sticky header class toggle
        headers.forEach(header => {
            if (scrollPos > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Active link scroll spy (Resume page sections only)
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
   6. SKILLS PROGRESS FILL ON SCROLL
   ========================================================================== */
function initIntersectionObservers() {
    const skillsSection = document.getElementById('sec-skills');
    const progressFills = document.querySelectorAll('.sm-fill');

    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressFills.forEach(fill => {
                    const widthText = fill.parentElement.previousElementSibling.children[1].textContent;
                    fill.style.width = '0';
                    setTimeout(() => {
                        fill.style.width = widthText;
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
   7. PROJECT DESCRIPTION MODAL OVERLAYS
   ========================================================================== */
function initProjectsModal() {
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('modal-project-details');
    const openBtns = document.querySelectorAll('.open-modal-btn');
    const closeBtn = document.querySelector('.modal-close');
    const backdrop = document.querySelector('.modal-backdrop');

    if (!modal || !modalContent || !closeBtn || !backdrop) return;

    const projectData = {
        'waste-detection': {
            title: 'Real-Time Waste Detection & Alert System',
            subtitle: 'Java / OpenCV / IoT Webhooks',
            desc: 'Developed a robust automated detection network that isolates floating and submerged trash items in river channels and coastal borders. Analyzes real-time image packets, triggering direct alarms to regional clean-up teams for prompt debris recovery.',
            features: [
                'Computer Vision integration utilizing custom color filtering models.',
                'Submerged Analytics identifying density shapes underwater.',
                'Alert systems dispatching SMS/Email alerts via webhook configurations.',
                'Interactive database detailing local coordinates and metrics logs.'
            ],
            tech: ['Java', 'OpenCV', 'IoT Webhooks', 'Spring Boot', 'MySQL']
        },
        'invoice-extraction': {
            title: 'Intelligent Invoice Extraction System',
            subtitle: 'Python / GenAI / Spring Boot',
            desc: 'An AI-driven parsing portal designed to import invoice files (PDF/images), run optical character recognition (OCR), and parse critical entities (vendor details, taxation figures, items) using fine-tuned Prompt Engineering and Generative AI, dumping structured tables directly into databases.',
            features: [
                'Form Layout Independence: Automatically extracts data parameters without template constraints.',
                'Zero-shot Parser: Flexibly adapts to diverse vendor billing templates.',
                'Spring Boot API: Processes files asynchronously and securely.',
                'Export Utilities: Enables one-click exports to CSV and JSON formats.'
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
   8. CONTACT FORM SUBMISSION
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const origText = submitBtn.innerHTML;

        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showToast('✉️ Message Sent Successfully!');
            form.reset();

            // Force blur elements
            const inputs = form.querySelectorAll('.form-input');
            inputs.forEach(input => input.blur());

            submitBtn.innerHTML = origText;
            submitBtn.disabled = false;
        }, 1200);
    });
}

/* ==========================================================================
   9. BACK TO TOP CONTROLS
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
   10. TOAST NOTIFICATIONS
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
