/* ============================================
   MATAN MARGOLIN — PORTFOLIO JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Loading screen ---
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 800);
    });
    // Fallback: hide after 2.5s even if load event already fired
    setTimeout(() => { loader.classList.add('hidden'); }, 2500);

    // --- Animated counters ---
    const counters = document.querySelectorAll('.counter-number');
    let countersDone = false;

    const observerCounters = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersDone) {
                countersDone = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.target);
                    const duration = 1500;
                    const start = performance.now();

                    function update(now) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        counter.textContent = Math.round(target * eased);
                        if (progress < 1) requestAnimationFrame(update);
                    }
                    requestAnimationFrame(update);
                });
            }
        });
    }, { threshold: 0.5 });

    const countersSection = document.querySelector('.counters-section');
    if (countersSection) observerCounters.observe(countersSection);

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // --- Mobile nav toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });

    // --- Active nav link on scroll ---
    const sections = document.querySelectorAll('.section, .hero');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

    const observerNav = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navAnchors.forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(s => observerNav.observe(s));

    // --- Portfolio filter tabs ---
    const tabs = document.querySelectorAll('.tab-btn');
    const cards = document.querySelectorAll('.portfolio-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const cat = tab.dataset.category;
            cards.forEach(card => {
                if (cat === 'all' || card.dataset.category === cat) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // --- Credits filter tabs ---
    const ctabs = document.querySelectorAll('.ctab-btn');
    const creditRows = document.querySelectorAll('.credit-row');

    ctabs.forEach(tab => {
        tab.addEventListener('click', () => {
            ctabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const cat = tab.dataset.credit;
            creditRows.forEach(row => {
                if (cat === 'all' || row.dataset.creditCat === cat) {
                    row.classList.remove('hidden-credit');
                } else {
                    row.classList.add('hidden-credit');
                }
            });
        });
    });

    // --- Video lightbox (YouTube + Vimeo) ---
    const lightbox = document.getElementById('lightbox');
    const lightboxVideo = document.getElementById('lightboxVideo');
    const lightboxClose = document.getElementById('lightboxClose');

    document.querySelectorAll('.card-video').forEach(card => {
        card.addEventListener('click', () => {
            const ytId = card.dataset.videoId;
            const vimeoId = card.dataset.vimeoId;
            if (ytId) {
                lightboxVideo.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else if (vimeoId) {
                lightboxVideo.src = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Fetch Vimeo thumbnails (try oEmbed, fallback to v2 API)
    document.querySelectorAll('.card-video[data-vimeo-id]').forEach(card => {
        const vimeoId = card.dataset.vimeoId;
        const thumbEl = card.querySelector('.vimeo-thumb');
        if (!thumbEl) return;

        function applyThumb(url) {
            thumbEl.style.backgroundImage = `url(${url})`;
            thumbEl.style.backgroundSize = 'cover';
            thumbEl.style.backgroundPosition = 'center';
        }

        // Try oEmbed first
        fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}&width=640`)
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(data => { if (data.thumbnail_url) applyThumb(data.thumbnail_url); })
            .catch(() => {
                // Fallback: v2 API
                fetch(`https://vimeo.com/api/v2/video/${vimeoId}.json`)
                    .then(r => r.ok ? r.json() : Promise.reject())
                    .then(data => { if (data[0]?.thumbnail_large) applyThumb(data[0].thumbnail_large); })
                    .catch(() => {}); // silently keep placeholder
            });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightboxVideo.src = '';
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // --- Scroll reveal ---
    const revealElements = document.querySelectorAll(
        '.portfolio-card, .credit-item, .contact-card, .about-grid, .album-content, .appsoluti-content, .service-card, .counter-item'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const observerReveal = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observerReveal.observe(el));

    // --- Language toggle ---
    const langToggle = document.getElementById('langToggle');
    const langEn = langToggle.querySelector('.lang-en');
    const langHe = langToggle.querySelector('.lang-he');
    let currentLang = 'en';

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'he' : 'en';
        const dir = currentLang === 'he' ? 'rtl' : 'ltr';

        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute('lang', currentLang);

        langEn.style.display = currentLang === 'en' ? '' : 'none';
        langHe.style.display = currentLang === 'he' ? '' : 'none';

        // Swap text content for all translatable elements
        document.querySelectorAll('[data-en][data-he]').forEach(el => {
            const text = el.getAttribute(`data-${currentLang}`);
            if (text) {
                if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'SPAN') {
                    el.innerHTML = text;
                } else {
                    // Preserve inner HTML for elements with <strong> etc.
                    const enText = el.getAttribute('data-en');
                    const heText = el.getAttribute('data-he');
                    if (currentLang === 'he') {
                        el.innerHTML = heText;
                    } else {
                        el.innerHTML = enText;
                    }
                }
            }
        });
    });

    // --- Global firefly particles (whole page) ---
    const globalContainer = document.getElementById('globalParticles');
    for (let i = 0; i < 50; i++) {
        const p = document.createElement('div');
        const size = Math.random() * 3 + 1;
        const duration = Math.random() * 8 + 6;
        const delay = Math.random() * 6;
        const glow = size > 2.5; // larger ones get a subtle glow
        p.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: rgba(232, 168, 64, ${Math.random() * 0.25 + 0.08});
            ${glow ? `box-shadow: 0 0 ${size * 3}px rgba(232, 168, 64, 0.15);` : ''}
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: fireflyFloat${i % 4} ${duration}s ease-in-out infinite;
            animation-delay: ${delay}s;
            pointer-events: none;
        `;
        globalContainer.appendChild(p);
    }

    // Also keep hero particles for denser effect in hero
    const heroContainer = document.getElementById('heroParticles');
    if (heroContainer) {
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: rgba(232, 168, 64, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: fireflyFloat${i % 4} ${Math.random() * 6 + 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 4}s;
            `;
            heroContainer.appendChild(p);
        }
    }

    // Firefly animation keyframes (4 variations for natural movement)
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fireflyFloat0 {
            0%, 100% { transform: translate(0, 0); opacity: 0.2; }
            25% { transform: translate(30px, -20px); opacity: 0.6; }
            50% { transform: translate(-15px, -40px); opacity: 0.3; }
            75% { transform: translate(20px, 10px); opacity: 0.7; }
        }
        @keyframes fireflyFloat1 {
            0%, 100% { transform: translate(0, 0); opacity: 0.3; }
            25% { transform: translate(-25px, 15px); opacity: 0.5; }
            50% { transform: translate(35px, -25px); opacity: 0.2; }
            75% { transform: translate(-10px, -35px); opacity: 0.6; }
        }
        @keyframes fireflyFloat2 {
            0%, 100% { transform: translate(0, 0); opacity: 0.15; }
            33% { transform: translate(20px, 30px); opacity: 0.5; }
            66% { transform: translate(-30px, -10px); opacity: 0.7; }
        }
        @keyframes fireflyFloat3 {
            0%, 100% { transform: translate(0, 0); opacity: 0.25; }
            20% { transform: translate(-20px, -30px); opacity: 0.6; }
            50% { transform: translate(25px, 15px); opacity: 0.15; }
            80% { transform: translate(-15px, 25px); opacity: 0.5; }
        }
    `;
    document.head.appendChild(style);

});
