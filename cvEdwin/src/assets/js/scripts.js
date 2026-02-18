/**
 * Portfolio Ultra-Profesional - Edwin Camilo Valencia Bustamante
 * Ingeniero de Sistemas y Telecomunicaciones
 * Scripts Avanzados con Efectos Premium
 */

// ============================================
// Configuración Global
// ============================================
const CONFIG = {
    emailjs: {
        publicKey: 'YOUR_PUBLIC_KEY',
        serviceId: 'YOUR_SERVICE_ID',
        templateId: 'YOUR_TEMPLATE_ID'
    },
    components: [
        { id: 'header-container', file: 'components/header.html' },
        { id: 'navigation-container', file: 'components/navegation.html' },
        { id: 'proyects-container', file: 'components/proyects.html' },
        { id: 'skills-container', file: 'components/Habilities.html' },
        { id: 'education-section', file: 'components/education.html' },
        { id: 'certificates-section', file: 'components/certificados.html' },
        { id: 'contact-section', file: 'components/contact.html' },
        { id: 'footer-container', file: 'components/footer.html' }
    ],
    typingTexts: [
        'Ingeniero de Sistemas',
        'Desarrollador Odoo ERP',
        'Python Backend Developer',
        'Especialista en IA y Automatización',
        'Full Stack Developer',
        'Creador de Chatbots IA'
    ],
    typingSpeed: 100,
    typingDelay: 2000
};

// ============================================
// Carga de Componentes
// ============================================
async function loadComponent(containerId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`Error cargando ${componentPath}`);
        const html = await response.text();
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = html;
        }
    } catch (error) {
        console.warn(`No se pudo cargar ${componentPath}:`, error.message);
    }
}

async function loadAllComponents() {
    const promises = CONFIG.components.map(comp =>
        loadComponent(comp.id, comp.file)
    );
    await Promise.all(promises);

    // Inicializar todo después de cargar
    initializeApp();
}

// ============================================
// Inicialización Principal
// ============================================
function initializeApp() {
    // Inicializar AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
            delay: 0
        });
    }

    // Inicializar Lightbox
    if (typeof lightbox !== 'undefined') {
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'albumLabel': 'Imagen %1 de %2',
            'fadeDuration': 300
        });
    }

    // Inicializar funcionalidades
    initTypingEffect();
    initCounterAnimation();
    initSkillBars();
    initNavigation();
    initCustomCursor();
    initBackToTop();
    setupContactForm();
    updateCurrentYear();

    // Ocultar preloader
    hidePreloader();
}

// ============================================
// Preloader
// ============================================
function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600);
        }, 500);
    }
}

// ============================================
// Efecto de Typing
// ============================================
function initTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = CONFIG.typingTexts[textIndex];

        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = CONFIG.typingSpeed;

        if (isDeleting) {
            typeSpeed /= 2;
        }

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = CONFIG.typingDelay;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % CONFIG.typingTexts.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

// ============================================
// Animación de Contadores
// ============================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out-expo)
        const easeOutExpo = 1 - Math.pow(2, -10 * progress);
        const currentValue = Math.floor(startValue + (target - startValue) * easeOutExpo);

        element.textContent = currentValue;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
            // Agregar + si es el contador de compromiso
            if (target === 100) {
                element.textContent = target + '%';
            } else if (target > 10) {
                element.textContent = target + '+';
            }
        }
    }

    requestAnimationFrame(updateCounter);
}

// ============================================
// Barras de Habilidades Animadas
// ============================================
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    skillBars.forEach(bar => observer.observe(bar));
}

// ============================================
// Navegación
// ============================================
function initNavigation() {
    const nav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], header[id]');

    // Scroll effect para nav
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (nav) {
            if (currentScroll > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }

        // Actualizar link activo
        updateActiveNav(sections, navLinks);

        lastScroll = currentScroll;
    });

    // Smooth scroll para links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function updateActiveNav(sections, navLinks) {
    const scrollY = window.scrollY + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ============================================
// Cursor Personalizado
// ============================================
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    if (!cursor || !follower) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Animación suave del follower
    function animateFollower() {
        cursorX += (mouseX - cursorX) * 0.12;
        cursorY += (mouseY - cursorY) * 0.12;

        follower.style.left = cursorX + 'px';
        follower.style.top = cursorY + 'px';

        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Efecto hover
    const hoverElements = 'a, button, .btn, .nav-link, .project-card, .skill-icon-card, .social-link, .certificate-card, .cert-card, .contact-item';

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverElements)) {
            follower.classList.add('hover');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverElements)) {
            follower.classList.remove('hover');
        }
    });
}

// ============================================
// Botón Back to Top
// ============================================
function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// Formulario de Contacto
// ============================================
function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn.innerHTML;

        // Estado de carga
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        // Obtener datos
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject') || 'Contacto desde Portafolio';
        const message = formData.get('message');

        // Intentar con EmailJS primero
        try {
            if (typeof emailjs !== 'undefined' && CONFIG.emailjs.publicKey !== 'YOUR_PUBLIC_KEY') {
                await emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, {
                    from_name: name,
                    from_email: email,
                    subject: subject,
                    message: message
                });

                showNotification('¡Mensaje enviado correctamente!', 'success');
                form.reset();
            } else {
                // Fallback a mailto
                const mailtoLink = `mailto:edwincamilovalencia2014@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`)}`;
                window.location.href = mailtoLink;
                showNotification('Abriendo cliente de correo...', 'info');
            }
        } catch (error) {
            console.error('Error enviando mensaje:', error);
            showNotification('Error al enviar. Intenta de nuevo.', 'error');
        }

        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

// ============================================
// Notificaciones
// ============================================
function showNotification(message, type = 'info') {
    // Remover notificación existente
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    // Estilos
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%) translateY(100px)',
        padding: '16px 24px',
        background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
        color: 'white',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.95rem',
        fontWeight: '500',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        zIndex: '10000',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    });

    document.body.appendChild(notification);

    // Animar entrada
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(-50%) translateY(0)';
    });

    // Remover después de 4 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// ============================================
// Actualizar Año
// ============================================
function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ============================================
// Parallax Effect (Opcional - Performance)
// ============================================
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (parallaxElements.length === 0) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(el => {
            const speed = el.getAttribute('data-parallax') || 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    }, { passive: true });
}

// ============================================
// Profile Card 3D Tilt Effect
// ============================================
function initProfileTilt() {
    const card = document.querySelector('.profile-card');
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        const inner = card.querySelector('.profile-card-inner');
        if (inner) {
            inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
    });

    card.addEventListener('mouseleave', () => {
        const inner = card.querySelector('.profile-card-inner');
        if (inner) {
            inner.style.transform = 'rotateX(0) rotateY(0)';
        }
    });
}

// ============================================
// Inicialización al cargar DOM
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadAllComponents();
});

// ============================================
// Certificate Modal Functions - Premium
// ============================================
function openCertModal(title, issuer, year, imagePath, pdfPath) {
    const modal = document.getElementById('cert-modal');
    const modalTitle = document.getElementById('cert-modal-title');
    const modalIssuer = document.getElementById('cert-modal-issuer');
    const modalYear = document.getElementById('cert-modal-year');
    const modalImage = document.getElementById('cert-modal-image');
    const modalBody = document.getElementById('cert-modal-body');
    const downloadBtn = document.getElementById('cert-modal-download');

    if (!modal) return;

    // Set text content
    if (modalTitle) modalTitle.textContent = title;
    if (modalIssuer) modalIssuer.textContent = issuer;
    if (modalYear) modalYear.textContent = year;

    // Handle PDF vs Image
    if (pdfPath) {
        // PDF Certificate: show embed viewer + download button
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="cert-pdf-viewer">
                    <div class="cert-pdf-icon">
                        <i class="fas fa-file-pdf"></i>
                    </div>
                    <p class="cert-pdf-title">${title}</p>
                    <p class="cert-pdf-subtitle">Documento PDF disponible para descarga</p>
                    <a href="${pdfPath}" target="_blank" class="cert-pdf-open-btn">
                        <i class="fas fa-external-link-alt"></i>
                        Abrir PDF en nueva pestaña
                    </a>
                </div>
            `;
        }
        if (downloadBtn) {
            downloadBtn.href = pdfPath;
            downloadBtn.style.display = 'inline-flex';
        }
    } else if (imagePath) {
        // Image Certificate
        if (modalBody) {
            modalBody.innerHTML = `<img id="cert-modal-image" src="${imagePath}" alt="Certificado: ${title}" style="max-width:100%;border-radius:12px;">`;
        }
        if (downloadBtn) {
            downloadBtn.style.display = 'none';
        }
    }

    // Show modal with animation
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCertModal() {
    const modal = document.getElementById('cert-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCertModal();
    }
});

// ============================================
// Exponer funciones globalmente si es necesario
// ============================================
window.portfolioApp = {
    showNotification,
    initTypingEffect,
    initCounterAnimation
};

// Expose modal functions globally
window.openCertModal = openCertModal;
window.closeCertModal = closeCertModal;

