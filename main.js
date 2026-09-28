// Burger Menu //
const burger = document.getElementById('burger');
const navLinks = document.getElementById('nav-links');
if (burger && navLinks) {
    burger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });
}


// GitHub Stat Cards //
// The external service bakes its colours into the image, so the URL itself has to change
// with the theme. Both variants are stored in data-* on each <img>.
function updateStatImages(theme) {
    document.querySelectorAll('.github-stat-img').forEach(img => {
        const next = theme === 'dark' ? img.dataset.srcDark : img.dataset.srcLight;
        if (next && img.getAttribute('src') !== next) {
            img.setAttribute('src', next);
        }
    });
}


// Theme Toggle //
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    const themeIcon = themeToggle.querySelector('ion-icon');

    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        if (themeIcon) {
            themeIcon.setAttribute('name', theme === 'dark' ? 'sunny' : 'moon');
        }
        localStorage.setItem('theme', theme);
        updateStatImages(theme);
    };

    applyTheme(localStorage.getItem('theme') || 'dark');
    themeToggle.addEventListener('click', () => {
        applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
}


// Nav Shrink (scroll) //
const header = document.querySelector('header');
if (header) {
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
}


// Page Transition //
document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');

    if (href && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('#') && link.getAttribute('target') !== '_blank') {
        link.addEventListener('click', e => {
            e.preventDefault();
            document.body.classList.add('fade-out');
            setTimeout(() => window.location.href = href, 150);
        });
    }
});


// Toast //
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}


// Home - Fade In //
document.querySelectorAll('.role-row, .left h1, .left p, .left .btn, .left .social').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.animation = `fadeInUp 0.6s ease ${(i + 1) * 0.18}s forwards`;
});

const right = document.querySelector('.right');
if (right) {
    right.style.opacity = '0';
    right.style.animation = 'fadeInUp 0.6s ease 0.2s forwards';
}


// Home - role badge typewriter //
const roleEl = document.querySelector('.role-row span');
if (roleEl) {
    const roleText = roleEl.textContent;
    let idx = 0;

    const typeRole = () => {
        if (idx < roleText.length) {
            roleEl.textContent = roleText.substring(0, ++idx) + '|';
            setTimeout(typeRole, 75);
        } else {
            roleEl.textContent = roleText;
        }
    };

    roleEl.textContent = '|';
    setTimeout(typeRole, 150);
}


// Contact - fade in //
document.querySelectorAll('.contact-bubble').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.animation = `fadeInUp 0.5s ease ${i * 0.1 + 0.1}s forwards`;
});


// Contact - Discord username copy //
const discordBubble = document.getElementById('discord-bubble');
if (discordBubble) {
    discordBubble.addEventListener('click', () => {
        const username = discordBubble.querySelector('small').textContent.trim();

        // navigator.clipboard is undefined on file:// and plain http, so check before calling it.
        if (!navigator.clipboard) {
            showToast(`Copy manually: ${username}`);
            return;
        }

        navigator.clipboard.writeText(username)
            .then(() => showToast('Discord username copied!'))
            .catch(() => showToast(`Copy manually: ${username}`));
    });
}


// Work - fall back to a GitHub link if a streak image fails to load //
// (the public streak-stats service is prone to 503s). Empty on other pages, so no guard needed.
document.querySelectorAll('.github-stat-img').forEach(img => {
    img.addEventListener('error', () => {
        const fallback = document.createElement('a');
        fallback.href = 'https://github.com/NikolaosGazis';
        fallback.target = '_blank';
        fallback.rel = 'noopener noreferrer';
        fallback.className = 'stats-fallback';
        fallback.textContent = `${img.alt} unavailable — view on GitHub →`;
        img.replaceWith(fallback);
    }, { once: true });
});

// Scroll Reveal //
// The .reveal class is added here rather than in the HTML, so nothing is hidden for a
// visitor without JS. Elements reveal once and are then unobserved.
const revealTargets = document.querySelectorAll('.skills-section, .github-stats-section, .work-hero, footer');
if (revealTargets.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('visible');

            // Stagger the tech-stack tiles as the section arrives.
            if (entry.target.classList.contains('skills-section')) {
                entry.target.querySelectorAll('.skill-item').forEach((el, i) => {
                    el.style.animation = `fadeInUp 0.5s ease ${i * 0.08}s backwards`;
                });
            }

            obs.unobserve(entry.target);
        });
    }, { threshold: 0.15 });

    revealTargets.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
}
