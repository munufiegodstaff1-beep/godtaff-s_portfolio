// Theme toggle
const themeBtn = document.getElementById('theme-toggle');
const root = document.documentElement;
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(next);
});

// Mobile nav
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.getElementById('site-nav');
navToggle.addEventListener('click', () => {
  const open = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Animate count-up numbers
function animateCount(el) {
  const target = Number(el.dataset.count || '0');
  const duration = 1200;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Animate skill bars
function animateBar(el) {
  const span = el.querySelector('span');
  const targetWidth = span.getAttribute('data-width') || span.style.width;
  span.style.width = '0'; // reset
  setTimeout(() => {
    span.style.width = targetWidth;
  }, 50);
}

// Observer for counters and bars (re-trigger enabled)
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains('num')) {
        animateCount(entry.target);
      }
      if (entry.target.classList.contains('meter')) {
        animateBar(entry.target);
      }
    }
  });
}, { threshold: 0.3 });

// Attach observer
document.querySelectorAll('.stat .num, .meter').forEach(el => {
  // Save original width for bars
  if (el.classList.contains('meter')) {
    const span = el.querySelector('span');
    span.setAttribute('data-width', span.style.width);
    span.style.width = '0'; // collapse initially
  }
  io.observe(el);
});

// Reveal on scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
    } else {
      entry.target.classList.remove('in'); // re-trigger reveal
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section, .project-card').forEach((el) => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Filter projects
const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.project-card');

filters.forEach((btn) => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tag = btn.dataset.filter;

    cards.forEach((card) => {
      const tags = (card.dataset.tags || '').split(' ');
      const show = tag === 'all' || tags.includes(tag);
      card.style.display = show ? '' : 'none';
    });
  });
});

// Contact form validation
const form = document.getElementById('contact-form');
const statusEl = document.querySelector('.form-status');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  let valid = true;

  function setError(id, msg) {
    const field = document.getElementById(id);
    const errorEl = field.parentElement.querySelector('.error');
    errorEl.textContent = msg;
    if (msg) valid = false;
  }

  setError('name', name ? '' : 'Please enter your name.');
  setError('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Enter a valid email.');
  setError('message', message.length >= 10 ? '' : 'Message should be at least 10 characters.');

  if (!valid) return;

  statusEl.textContent = 'Sending...';
  statusEl.style.color = '';

  setTimeout(() => {
    statusEl.textContent = 'Thanks! Your message has been sent.';
    statusEl.style.color = 'var(--success)';
    form.reset();
  }, 900);
});

// Keyboard focus outline for accessibility
function handleFirstTab(e) {
  if (e.key === 'Tab') {
    document.body.classList.add('user-tabbing');
    window.removeEventListener('keydown', handleFirstTab);
  }
}
window.addEventListener('keydown', handleFirstTab);


// Back to top button
const backBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backBtn.classList.add('show');
  } else {
    backBtn.classList.remove('show');
  }
});
backBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
