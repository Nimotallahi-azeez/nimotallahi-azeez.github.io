// ============================================================
//  ENHANCED PORTFOLIO — script.js
//  Nimotallahi Azeez | Technical Communication Specialist
// ============================================================

// ============================================================
//  UTILITY
// ============================================================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ============================================================
//  NAVIGATION — scroll effect, active link, mobile menu
// ============================================================
const navbar   = $('#navbar');
const hamburger = $('#hamburger');
const navMenu  = $('#nav-menu');
const navLinks = $$('.nav-link');

// Scroll effects
window.addEventListener('scroll', () => {
    const y = window.scrollY;

    // Navbar background
    navbar.classList.toggle('scrolled', y > 60);

    // Progress bar
    const pct = (y / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    $('#progress-bar').style.width = pct + '%';

    // Back-to-top button
    $('#back-top').classList.toggle('visible', y > 500);

    // Highlight active nav link
    let current = '';
    $$('section[id]').forEach(sec => {
        if (window.pageYOffset >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}, { passive: true });

// Smooth scroll on nav click
navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
        }
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
    });
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
});

document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
    }
});

// ============================================================
//  BACK TO TOP
// ============================================================
$('#back-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
//  SCROLL REVEAL
// ============================================================
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

$$('.reveal').forEach(el => revealObserver.observe(el));

// Staggered reveal for children
const childObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const siblings = $$('.reveal-child', entry.target.closest('.container, section'));
            const children = $$('.reveal-child', entry.target.parentElement);
            const idx = children.indexOf(entry.target);
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, idx * 120);
            childObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08 });

$$('.reveal-child').forEach(el => childObserver.observe(el));

// ============================================================
//  ANIMATED STATS COUNTER
// ============================================================
function animateCount(el, target, duration = 1800) {
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current);
        if (current >= target) clearInterval(timer);
    }, 16);
}

const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            $$('.stat-num', entry.target).forEach(el => {
                animateCount(el, parseInt(el.dataset.target));
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutSection = $('#about');
if (aboutSection) statsObserver.observe(aboutSection);

// ============================================================
//  HERO FLOATING ORBS
// ============================================================
function createOrbs() {
    const container = $('#hero-orbs');
    if (!container) return;
    for (let i = 0; i < 12; i++) {
        const orb = document.createElement('div');
        const size = Math.random() * 4 + 1.5;
        orb.style.cssText = `
            position: absolute;
            width: ${size}px; height: ${size}px;
            border-radius: 50%;
            background: rgba(200, 150, 62, ${Math.random() * 0.4 + 0.1});
            left: ${Math.random() * 100}%;
            top:  ${Math.random() * 100}%;
            animation: orbFloat ${Math.random() * 12 + 10}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        container.appendChild(orb);
    }
    if (!document.getElementById('orb-style')) {
        const s = document.createElement('style');
        s.id = 'orb-style';
        s.textContent = `
            @keyframes orbFloat {
                0%,100% { transform: translate(0, 0); opacity: .4; }
                25%      { transform: translate(${Math.random()*80-40}px, ${Math.random()*80-40}px); opacity:.9; }
                75%      { transform: translate(${Math.random()*60-30}px, ${Math.random()*60-30}px); opacity:.6; }
            }
        `;
        document.head.appendChild(s);
    }
}

window.addEventListener('load', createOrbs);

// ============================================================
//  HERO PARALLAX
// ============================================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = $('.hero-content');
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.25}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.6;
    }
}, { passive: true });

// ============================================================
//  EXPERIENCE VIEW TOGGLE
// ============================================================
const toggleBtns  = $$('.toggle-btn');
const listView    = $('#list-view');
const timelineView = $('#timeline-view');

toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (btn.dataset.view === 'list') {
            listView.style.display = 'grid';
            timelineView.style.display = 'none';
        } else {
            listView.style.display = 'none';
            timelineView.style.display = 'block';
            // Re-trigger reveal for timeline items
            $$('.tl-card').forEach((el, i) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    el.style.transition = 'all .5s ease';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, i * 150);
            });
        }
    });
});

// ============================================================
//  GALLERY FILTER & LIGHTBOX
// ============================================================
const gfBtns      = $$('.gf-btn');
const galleryItems = $$('.gallery-item');
const lightbox    = $('#lightbox');
const lbImg       = $('#lb-img');
const lbCaption   = $('#lb-caption');
const lbClose     = $('#lb-close');

// Filter buttons
gfBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        gfBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        galleryItems.forEach(item => {
            const match = filter === 'all' || item.dataset.category === filter;
            item.classList.toggle('hidden', !match);
        });
    });
});

// Lightbox — only opens for items with real <img> (not placeholders)
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (!img) return;  // placeholder, skip
        const caption = item.querySelector('.gallery-caption');
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lbCaption.innerHTML = caption ? caption.innerHTML : '';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
});

function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
}

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ============================================================
//  CONTACT FORM (Formspree / native submit)
// ============================================================
const contactForm = $('#contact-form');
const formStatus  = $('#form-status');
const formBtnText = $('#form-btn-text');

if (contactForm) {
    contactForm.addEventListener('submit', async e => {
        e.preventDefault();
        formBtnText.textContent = 'Sending…';

        try {
            const res = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                formStatus.textContent = '✓ Message sent! I\'ll be in touch soon.';
                formStatus.className = 'form-status success';
                contactForm.reset();
            } else {
                throw new Error('Server error');
            }
        } catch {
            formStatus.textContent = '✗ Something went wrong. Please email me directly at nazeez42@tntech.edu';
            formStatus.className = 'form-status error';
        } finally {
            formBtnText.textContent = 'Send Message';
        }
    });
}

// ============================================================
//  BUTTON RIPPLE
// ============================================================
if (!document.getElementById('ripple-style')) {
    const s = document.createElement('style');
    s.id = 'ripple-style';
    s.textContent = `@keyframes ripple { to { transform: scale(3); opacity: 0; } }`;
    document.head.appendChild(s);
}

$$('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect   = this.getBoundingClientRect();
        const sz     = Math.max(rect.width, rect.height);
        ripple.style.cssText = `
            position:absolute; pointer-events:none;
            width:${sz}px; height:${sz}px; border-radius:50%;
            background:rgba(255,255,255,.35);
            left:${e.clientX - rect.left - sz/2}px;
            top:${e.clientY - rect.top  - sz/2}px;
            transform:scale(0); animation:ripple .6s ease-out forwards;
        `;
        this.style.position  = 'relative';
        this.style.overflow  = 'hidden';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// ============================================================
//  INIT
// ============================================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    console.log('%c📄 Nimotallahi Azeez — Portfolio', 'font-size:16px; font-weight:bold; color:#c8963e;');
    console.log('%cM.A. Candidate | Technical Communication Specialist', 'color:#7a7d87;');
});
