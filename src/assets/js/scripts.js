/**
 * Portfolio - Edwin Camilo Valencia Bustamante
 * Ingeniero de Sistemas y Telecomunicaciones
 * Scripts principales
 */

// ============================================
// Configuración
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
    ]
};

// ============================================
// Carga de componentes
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
    
    // Inicializar funcionalidades después de cargar componentes
    initializeAfterLoad();
}

// ============================================
// Inicialización después de cargar componentes
// ============================================
function initializeAfterLoad() {
    // Inicializar AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 50
        });
    }
    
    // Inicializar Lightbox
    if (typeof lightbox !== 'undefined') {
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'albumLabel': 'Imagen %1 de %2'
        });
    }
    
    // Configurar formulario de contacto
    setupContactForm();
    
    // Navegación activa
    setupActiveNavigation();
}

// ============================================
// Preloader
// ============================================
function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
}

// ============================================
// Cursor personalizado
// ============================================
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;
    
    // Solo en dispositivos con mouse
    if (window.matchMedia('(pointer: fine)').matches) {
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
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            
            follower.style.left = cursorX + 'px';
            follower.style.top = cursorY + 'px';
            
            requestAnimationFrame(animateFollower);
        }
        animateFollower();
        
        // Efecto hover en elementos interactivos
        const interactiveElements = document.querySelectorAll('a, button, .btn, .nav-btn, .project-card, .skill-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                follower.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }
}

// ============================================
// Back to Top Button
// ============================================
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// Navegación activa
// ============================================
function setupActiveNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('section[id]');
    
    if (navButtons.length === 0 || sections.length === 0) return;
    
    function setActiveNav() {
        const scrollY = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navButtons.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.getAttribute('href') === `#${sectionId}`) {
                        btn.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', setActiveNav);
    setActiveNav();
}

// ============================================
// Formulario de contacto
// ============================================
function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Estado de carga
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Obtener datos del formulario
        const formData = {
            name: form.querySelector('#name').value,
            email: form.querySelector('#email').value,
            message: form.querySelector('#message').value
        };
        
        try {
            // Intentar enviar con EmailJS si está configurado
            if (typeof emailjs !== 'undefined' && CONFIG.emailjs.publicKey !== 'YOUR_PUBLIC_KEY') {
                await emailjs.send(
                    CONFIG.emailjs.serviceId,
                    CONFIG.emailjs.templateId,
                    formData
                );
                showNotification('¡Mensaje enviado correctamente!', 'success');
            } else {
                // Fallback: mostrar datos y abrir cliente de correo
                const mailtoLink = `mailto:edwincamilovalencia@gmail.com?subject=Contacto desde Portafolio - ${formData.name}&body=${encodeURIComponent(`Nombre: ${formData.name}\nEmail: ${formData.email}\n\nMensaje:\n${formData.message}`)}`;
                window.open(mailtoLink);
                showNotification('Se abrirá tu cliente de correo para enviar el mensaje.', 'success');
            }
            
            form.reset();
        } catch (error) {
            console.error('Error al enviar:', error);
            showNotification('Error al enviar el mensaje. Por favor, intenta de nuevo.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ============================================
// Notificaciones
// ============================================
function showNotification(message, type = 'success') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Estilos inline para la notificación
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '15px 25px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        zIndex: '10000',
        animation: 'slideUp 0.3s ease',
        background: type === 'success' ? '#10b981' : '#ef4444'
    });
    
    document.body.appendChild(notification);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Añadir estilos de animación para notificaciones
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideUp {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    @keyframes slideDown {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(20px); }
    }
`;
document.head.appendChild(notificationStyles);

// ============================================
// Smooth scroll para links internos
// ============================================
function initSmoothScroll() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const navHeight = document.querySelector('.navigation-section')?.offsetHeight || 70;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
}

// ============================================
// Inicialización principal
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar todos los componentes
    await loadAllComponents();
    
    // Ocultar preloader
    setTimeout(hidePreloader, 500);
    
    // Inicializar funcionalidades
    initCustomCursor();
    initBackToTop();
    initSmoothScroll();
});

// Si la página ya está cargada
if (document.readyState === 'complete') {
    loadAllComponents().then(() => {
        hidePreloader();
        initCustomCursor();
        initBackToTop();
        initSmoothScroll();
    });
}

