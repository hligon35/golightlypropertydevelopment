const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');

window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 80), { passive: true });

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('open', !isOpen);
  document.body.style.overflow = isOpen ? '' : 'hidden';
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
  document.body.style.overflow = '';
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
document.querySelector('[data-year]').textContent = new Date().getFullYear();

const projectForm = document.querySelector('[data-project-form]');
const formStatus = document.querySelector('[data-form-status]');

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

  formStatus.textContent = 'Opening your messaging app…';
  window.location.href = `sms:+12705196659?body=${encodeURIComponent(message)}`;
});
