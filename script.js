// ---------------------------------------------------------------------------
// Centralized project links.
// Replace these placeholder URLs with your real GitHub / live-demo links.
// Every project card pulls its links from here via its `data-project` id.
// ---------------------------------------------------------------------------
const PROJECT_LINKS = {
  snapshare: {
    github: 'https://github.com/yourusername/snapshare',
    demo: 'https://your-demo-url.com',
  },
  anisync: {
    github: 'https://github.com/yourusername/anisync',
    demo: 'https://your-demo-url.com',
  },
};

const GITHUB_ICON = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.07.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .31.2.67.8.55A10.99 10.99 0 0 0 23.5 12c0-6.27-5.23-11.5-11.5-11.5Z"/></svg>`;
const DEMO_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>`;

const renderProjectLinks = () => {
  document.querySelectorAll('[data-project]').forEach((card) => {
    const key = card.getAttribute('data-project');
    const links = PROJECT_LINKS[key];
    const mount = card.querySelector('.project-links');
    if (!links || !mount) return;

    mount.innerHTML = '';

    if (links.github) {
      const githubLink = document.createElement('a');
      githubLink.className = 'project-btn is-primary';
      githubLink.href = links.github;
      githubLink.target = '_blank';
      githubLink.rel = 'noopener noreferrer';
      githubLink.setAttribute('aria-label', `View ${key} on GitHub`);
      githubLink.innerHTML = `${GITHUB_ICON}<span>View on GitHub</span>`;
      mount.appendChild(githubLink);
    }

    if (links.demo) {
      const demoLink = document.createElement('a');
      demoLink.className = 'project-btn';
      demoLink.href = links.demo;
      demoLink.target = '_blank';
      demoLink.rel = 'noopener noreferrer';
      demoLink.setAttribute('aria-label', `Open live demo for ${key}`);
      demoLink.innerHTML = `${DEMO_ICON}<span>Live demo</span>`;
      mount.appendChild(demoLink);
    }
  });
};

renderProjectLinks();

// ---------------------------------------------------------------------------
// Theme toggle
// ---------------------------------------------------------------------------
const themeToggle = document.getElementById('theme-toggle');

const applyTheme = (theme) => {
  document.body.setAttribute('data-theme', theme);
  const isDark = theme === 'dark';
  themeToggle?.setAttribute('aria-pressed', String(isDark));
  themeToggle?.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  localStorage.setItem('theme', theme);
};

const storedTheme = localStorage.getItem('theme');
const preferredTheme = storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(preferredTheme);

themeToggle?.addEventListener('click', () => {
  const currentTheme = document.body.getAttribute('data-theme');
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
});

// ---------------------------------------------------------------------------
// Mobile navigation
// ---------------------------------------------------------------------------
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const header = document.querySelector('.site-header');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
}

navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navLinks.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Open navigation');
}));

window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 12), { passive: true });
document.getElementById('year').textContent = new Date().getFullYear();

// ---------------------------------------------------------------------------
// Scroll-reveal animations
// ---------------------------------------------------------------------------
const revealTargets = document.querySelectorAll('.reveal');
revealTargets.forEach((element, index) => {
  element.style.setProperty('--reveal-delay', `${Math.min(index * 55, 220)}ms`);
});

if (reduceMotion) {
  revealTargets.forEach((element) => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -50px 0px' });

  revealTargets.forEach((element) => revealObserver.observe(element));
}

// ---------------------------------------------------------------------------
// Active nav-link tracking
// ---------------------------------------------------------------------------
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const id = entry.target.getAttribute('id');
    const link = navLinks?.querySelector(`a[href="#${id}"]`);
    if (entry.isIntersecting) {
      navLinks?.querySelectorAll('a').forEach((a) => a.classList.remove('is-active'));
      link?.classList.add('is-active');
    }
  });
}, { rootMargin: '-50% 0px -50% 0px' });

document.querySelectorAll('main [id]').forEach((section) => navObserver.observe(section));

// ---------------------------------------------------------------------------
// Subtle 3D tilt on hover (hero code card + project visuals)
// ---------------------------------------------------------------------------
const addTilt = (element, strength) => {
  element.addEventListener('mousemove', (e) => {
    if (reduceMotion) return;
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = (e.clientY - centerY) * strength;
    const rotateY = (centerX - e.clientX) * strength;
    element.style.setProperty('--tilt-x', `${rotateX}deg`);
    element.style.setProperty('--tilt-y', `${rotateY}deg`);
  });

  element.addEventListener('mouseleave', () => {
    element.style.setProperty('--tilt-x', '0deg');
    element.style.setProperty('--tilt-y', '0deg');
  });
};

const codeCard = document.querySelector('.code-card');
if (codeCard) addTilt(codeCard, 0.02);

document.querySelectorAll('.project-visual').forEach((visual) => addTilt(visual, 0.015));
