const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-toggle]');
const menuLabel = document.querySelector('[data-menu-label]');
const nav = document.querySelector('[data-nav]');
const mobileMenuQuery = window.matchMedia('(max-width: 960px)');

let lockedScrollY = 0;

function updateHeader() {
  if (!header || document.body.classList.contains('menu-open')) return;
  header.classList.toggle('scrolled', window.scrollY > 80);
}

function openMenu() {
  if (!menuButton || !nav || !header) return;

  lockedScrollY = window.scrollY;
  menuButton.setAttribute('aria-expanded', 'true');
  menuLabel.textContent = 'Close menu';
  nav.classList.add('open');
  header.classList.add('menu-open');
  document.body.classList.add('menu-open');
  document.body.style.position = 'fixed';
  document.body.style.top = `-${lockedScrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
}

function closeMenu({ restoreScroll = true } = {}) {
  if (!menuButton || !nav || !header) return;

  menuButton.setAttribute('aria-expanded', 'false');
  menuLabel.textContent = 'Open menu';
  nav.classList.remove('open');
  header.classList.remove('menu-open');
  document.body.classList.remove('menu-open');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';

  if (restoreScroll) window.scrollTo(0, lockedScrollY);
  updateHeader();
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    if (isOpen) closeMenu();
    else openMenu();
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (menuButton.getAttribute('aria-expanded') === 'true') closeMenu();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });

  mobileMenuQuery.addEventListener('change', (event) => {
    if (!event.matches && menuButton.getAttribute('aria-expanded') === 'true') closeMenu();
  });
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
}

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const projectForm = document.querySelector('[data-project-form]');
const formStatus = document.querySelector('[data-form-status]');

if (projectForm) {
  projectForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(projectForm);
    const message = [
      'New project inquiry for Golightly Property Development',
      '',
      `Name: ${data.get('name')}`,
      `Phone: ${data.get('phone')}`,
      `Email: ${data.get('email') || 'Not provided'}`,
      `Project location: ${data.get('location')}`,
      `Project type: ${data.get('projectType')}`,
      '',
      `Project details: ${data.get('details')}`,
    ].join('\n');

    const subject = `Project inquiry: ${data.get('projectType')} — ${data.get('name')}`;
    if (formStatus) formStatus.textContent = 'Opening your email app…';
    window.location.href = `mailto:info@gldevelopment.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  });
}
