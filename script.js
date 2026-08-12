const navToggle = document.querySelector('.nav-toggle');
const pageNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id]');
const themeToggle = document.querySelector('.theme-toggle');
const revealItems = document.querySelectorAll('.reveal');

const setTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('theme', theme);
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? 'Light' : 'Dark';
    themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
  }
};

const loadTheme = () => {
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(stored || (prefersDark ? 'dark' : 'light'));
};

const closeMenu = () => {
  document.body.classList.remove('menu-open');
  navToggle?.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
};

const toggleMenu = () => {
  const isOpen = document.body.classList.toggle('menu-open');
  navToggle?.classList.toggle('open', isOpen);
  navToggle?.setAttribute('aria-expanded', String(isOpen));
};

const updateActiveLink = () => {
  const offset = window.scrollY + 160;
  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const link = document.querySelector(`.site-nav a[href='#${section.id}']`);
    if (!link) return;

    if (offset >= top && offset < bottom) {
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
    }
  });
};

const revealOnScroll = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('reveal-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealItems.forEach((item) => observer.observe(item));
};

navToggle?.addEventListener('click', toggleMenu);
pageNav?.addEventListener('click', (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    closeMenu();
  }
});
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    closeMenu();
  });
});

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
window.addEventListener('load', () => {
  loadTheme();
  updateActiveLink();
  revealOnScroll();
});
