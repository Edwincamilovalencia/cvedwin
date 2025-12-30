// Scripts mejorados para el portafolio

// Inicializar EmailJS (si está disponible)
(function(){
    try {
        if (typeof emailjs !== 'undefined') {
            emailjs.init('eiaRBfy6I2Dacouy4');
            console.log('EmailJS inicializado');
        }
    } catch (e) {
        console.warn('EmailJS no disponible', e);
    }
})();

// Cargar componentes y funcionalidades cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function(){
    // Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) setTimeout(() => preloader.classList.add('hidden'), 700);

    // Cargar componentes de la página (solo si existen los contenedores)
    const components = [
        { file: 'components/header.html', container: 'header-container' },
        { file: 'components/navegation.html', container: 'navigation-container' },
        { file: 'components/services.html', container: 'services-container' },
        { file: 'components/proyects.html', container: 'proyects-container' },
        { file: 'components/Habilities.html', container: 'skills-container' },
        { file: 'components/education.html', container: 'education-section' },
        { file: 'components/certificados.html', container: 'certificates-section' },
        { file: 'components/contact.html', container: 'contact-section' },
        { file: 'components/footer.html', container: 'footer-container' }
    ];

    Promise.all(components.map(c => fetch(c.file).then(r => r.text()).then(html => {
        const el = document.getElementById(c.container);
        if (el) el.innerHTML = html;
    }).catch(()=>{}))).then(() => {
        if (typeof AOS !== 'undefined') AOS.init({ duration: 800, once: true });
    });

    // Cursor personalizado
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    if (cursor && follower) {
        let mx = 0, my = 0, fx = 0, fy = 0;
        document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; cursor.style.transform = `translate(${mx}px, ${my}px)`; });
        const loop = () => { fx += (mx - fx) * 0.14; fy += (my - fy) * 0.14; follower.style.transform = `translate(${fx}px, ${fy}px)`; requestAnimationFrame(loop); };
        loop();
    }

    // Back-to-top button
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (!backToTop) return;
        if (window.scrollY > 600) backToTop.classList.add('visible'); else backToTop.classList.remove('visible');
    });
    if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Animated counters
    document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.dataset.count || '0', 10);
        const io = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { animateCount(el, target); io.disconnect(); } }); }, { threshold: 0.6 });
        io.observe(el);
    });

    function animateCount(el, to) {
        let start = 0; const duration = 1200; const step = Math.max(1, Math.floor(to / (duration / 16)));
        const tick = () => { start += step; if (start >= to) el.textContent = to; else { el.textContent = start; requestAnimationFrame(tick); } };
        tick();
    }

    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!expanded));
            document.body.classList.toggle('nav-open');
            if (mobileOverlay) mobileOverlay.classList.toggle('active');
        });
    }
    if (mobileOverlay) mobileOverlay.addEventListener('click', () => { document.body.classList.remove('nav-open'); mobileOverlay.classList.remove('active'); if (navToggle) navToggle.setAttribute('aria-expanded', 'false'); });

    // Smooth anchor behavior
    document.querySelectorAll('a[href^="#"]').forEach(a => { a.addEventListener('click', function(e){ const href = this.getAttribute('href'); if (href && href.startsWith('#') && href.length>1) { e.preventDefault(); const t = document.querySelector(href); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); document.body.classList.remove('nav-open'); if (mobileOverlay) mobileOverlay.classList.remove('active'); if (navToggle) navToggle.setAttribute('aria-expanded','false'); } }); });

    // Contact form handling (EmailJS fallback if not available)
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            if (btn) { btn.disabled = true; btn.classList.add('loading'); }
            const params = { from_name: contactForm.name.value, reply_to: contactForm.email.value, subject: contactForm.subject.value || 'Contacto', message: contactForm.message.value };
            if (typeof emailjs !== 'undefined') {
                emailjs.send('service_kkudgzm','template_n7qtgrj', params).then(()=> showFormSuccess()).catch(()=> showFormError()).finally(()=> { if (btn) { btn.disabled = false; btn.classList.remove('loading'); } });
            } else {
                setTimeout(()=> { showFormSuccess(); if (btn) { btn.disabled = false; btn.classList.remove('loading'); } }, 800);
            }
        });
    }

    function showFormSuccess(){ if (formMessage) { formMessage.classList.add('visible'); setTimeout(()=> formMessage.classList.remove('visible'), 3500); } else alert('Mensaje enviado con éxito'); }
    function showFormError(){ if (formMessage) { formMessage.classList.add('error'); setTimeout(()=> formMessage.classList.remove('error'), 3500); } else alert('Error al enviar el mensaje'); }

    // Initialize particles.js if present
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', { particles: { number: { value: 50, density: { enable: true, value_area: 800 } }, color: { value: ['#4f46e5', '#06b6d4'] }, shape: { type: 'circle' }, opacity: { value: 0.18 }, size: { value: 3 }, line_linked: { enable: true, distance: 120, color: '#0b1020', opacity: 0.06, width: 1 }, move: { enable: true, speed: 1 } }, interactivity: { events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } } } });
    }

    // Accessibility: show focus outlines when using keyboard
    document.addEventListener('keyup', (e) => { if (e.key === 'Tab') document.body.classList.add('show-focus-outline'); });

});

