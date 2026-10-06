/* =========================================================
   PORTFOLIO · nowii-core
   Vanilla JS — Nessuna dipendenza esterna
   ========================================================= */
'use strict';

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ---------------------------------------------------------
   1. TEMA CHIARO/SCURO
   --------------------------------------------------------- */
const themeToggle = $('#themeToggle');
const root = document.documentElement;

const savedTheme = localStorage.getItem('theme');
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
root.setAttribute('data-theme', savedTheme || (prefersLight ? 'light' : 'dark'));

themeToggle?.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ---------------------------------------------------------
   2. HEADER: scroll + progress + back-to-top
   --------------------------------------------------------- */
const header = $('#header');
const progressBar = $('#scrollProgress');
const toTop = $('#toTop');

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 20);
  toTop.classList.toggle('show', y > 500);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------------------------------------------------------
   3. MENU MOBILE
   --------------------------------------------------------- */
const burger = $('#burger');
const navLinks = $('#navLinks');

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});

$$('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ---------------------------------------------------------
   4. NAV LINK ATTIVO ALLO SCROLL
   --------------------------------------------------------- */
const sections = $$('section[id]');
const navAnchors = $$('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
    });
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

sections.forEach(s => sectionObserver.observe(s));

/* ---------------------------------------------------------
   5. MACCHINA DA SCRIVERE
   --------------------------------------------------------- */
const typedEl = $('#typed');
const PHRASES = [
  'Full-Stack Developer',
  'Game & 3D Developer',
  'Cybersecurity Enthusiast',
  'Python Expert',
  'UI/UX Designer'
];

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = PHRASES[phraseIndex];

  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);

    if (charIndex === current.length) {
      deleting = true;
      return setTimeout(typeLoop, 1600);
    }
    return setTimeout(typeLoop, 75);
  }

  charIndex--;
  typedEl.textContent = current.slice(0, charIndex);

  if (charIndex === 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % PHRASES.length;
    return setTimeout(typeLoop, 350);
  }
  setTimeout(typeLoop, 38);
}

if (typedEl) setTimeout(typeLoop, 500);

/* ---------------------------------------------------------
   6. REVEAL ON SCROLL
   --------------------------------------------------------- */
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const siblings = [...entry.target.parentElement.children].filter(el =>
      el.classList.contains('reveal')
    );
    const delay = Math.min(siblings.indexOf(entry.target), 5) * 90;

    setTimeout(() => entry.target.classList.add('visible'), delay);
    obs.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

$$('.reveal').forEach(el => revealObserver.observe(el));

/* ---------------------------------------------------------
   7. CONTATORI ANIMATI
   --------------------------------------------------------- */
function animateCount(el) {
  const target = Number(el.dataset.count);
  const duration = 1600;
  const start = performance.now();

  function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased);
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const statObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    animateCount(entry.target);
    obs.unobserve(entry.target);
  });
}, { threshold: 0.5 });

$$('.stat-num').forEach(el => statObserver.observe(el));

/* ---------------------------------------------------------
   8. BARRE DI COMPETENZA
   --------------------------------------------------------- */
const barObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const bar = entry.target;
    bar.style.width = `${bar.dataset.width}%`;
    obs.unobserve(bar);
  });
}, { threshold: 0.4 });

$$('.bar span').forEach(el => barObserver.observe(el));

/* ---------------------------------------------------------
   9. GLOW MOUSE SULLE CARD
   --------------------------------------------------------- */
$$('.skill-card').forEach(card => {
  card.addEventListener('pointermove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
});

/* ---------------------------------------------------------
   10. MARQUEE TECNOLOGIE
   --------------------------------------------------------- */
const TECHS = [
  'HTML5', 'CSS3', 'JavaScript ES6+', 'TypeScript', 'React', 'Node.js',
  'Python', 'C++', 'C#', 'Unity', 'Blender', 'Cybersecurity',
  'TCP/IP', 'Docker', 'Linux', 'SQL', 'MongoDB', 'Figma'
];

const marqueeTrack = $('#marqueeTrack');
if (marqueeTrack) {
  const items = [...TECHS, ...TECHS]
    .map(t => `<span>${t}</span>`)
    .join('');
  marqueeTrack.innerHTML = items;
}

/* ---------------------------------------------------------
   11. COPIA EMAIL
   --------------------------------------------------------- */
$$('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const text = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    const original = btn.textContent;
    btn.textContent = 'Copiato!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove('copied');
    }, 1800);
  });
});

/* ---------------------------------------------------------
   12. VALIDAZIONE FORM
   --------------------------------------------------------- */
const form = $('#contactForm');
const formNote = $('#formNote');
const submitBtn = $('#submitBtn');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function setError(fieldName, message) {
  const input = form.elements[fieldName];
  const wrap = input.closest('.field');
  const errorEl = $(`[data-error-for="${fieldName}"]`);
  wrap.classList.toggle('invalid', Boolean(message));
  errorEl.textContent = message || '';
}

function validateField(name) {
  const value = form.elements[name].value.trim();

  if (name === 'name') {
    if (value.length < 2) return setError('name', 'Inserisci almeno 2 caratteri.'), false;
  }
  if (name === 'email') {
    if (!EMAIL_RE.test(value)) return setError('email', 'Inserisci un indirizzo email valido.'), false;
  }
  if (name === 'message') {
    if (value.length < 10) return setError('message', 'Scrivi almeno 10 caratteri.'), false;
  }
  setError(name, '');
  return true;
}

['name', 'email', 'message'].forEach(name => {
  const el = form.elements[name];
  el.addEventListener('blur', () => validateField(name));
  el.addEventListener('input', () => {
    if (el.closest('.field').classList.contains('invalid')) validateField(name);
  });
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const valid = ['name', 'email', 'message']
    .map(validateField)
    .every(Boolean);

  if (!valid) {
    formNote.textContent = 'Controlla i campi evidenziati.';
    formNote.className = 'form-note error';
    return;
  }

  const label = $('.btn-label', submitBtn);
  label.textContent = 'Invio in corso...';
  submitBtn.disabled = true;

  await new Promise(r => setTimeout(r, 1200));

  form.reset();
  label.textContent = 'Invia messaggio';
  submitBtn.disabled = false;
  formNote.textContent = 'Messaggio inviato! Ti risponderò al più presto.';
  formNote.className = 'form-note success';

  setTimeout(() => { formNote.textContent = ''; formNote.className = 'form-note'; }, 6000);
});

/* ---------------------------------------------------------
   13. ANNO NEL FOOTER
   --------------------------------------------------------- */
$('#year').textContent = new Date().getFullYear();

/* ---------------------------------------------------------
   14. PRELOADER
   --------------------------------------------------------- */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hidden');
      setTimeout(() => preloader.remove(), 800);
    }, 2200);
  }
});

/* ---------------------------------------------------------
   15. CURSOR GLOW
   --------------------------------------------------------- */
(() => {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.matchMedia('(max-width: 760px)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function animateGlow() {
    currentX += (mouseX - currentX) * 0.15;
    currentY += (mouseY - currentY) * 0.15;
    glow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
})();

/* ---------------------------------------------------------
   16. 3D TILT SU CARD
   --------------------------------------------------------- */
function initTilt() {
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (isTouch) return;

  const cards = document.querySelectorAll('.skill-card:not([data-tilt-init]), .stat-card:not([data-tilt-init]), .projects-soon:not([data-tilt-init])');

  cards.forEach(card => {
    card.setAttribute('data-tilt-init', '1');

    let rafId = null;
    let targetRX = 0, targetRY = 0, targetLift = 0;
    let currentRX = 0, currentRY = 0, currentLift = 0;

    function applyTilt() {
      currentRX += (targetRX - currentRX) * 0.15;
      currentRY += (targetRY - currentRY) * 0.15;
      currentLift += (targetLift - currentLift) * 0.15;

      card.style.transform = `perspective(1000px) rotateX(${currentRX}deg) rotateY(${currentRY}deg) translateY(${currentLift}px)`;

      const stillMoving = Math.abs(targetRX - currentRX) > 0.01 ||
                          Math.abs(targetRY - currentRY) > 0.01 ||
                          Math.abs(targetLift - currentLift) > 0.1;

      if (stillMoving) {
        rafId = requestAnimationFrame(applyTilt);
      } else {
        rafId = null;
      }
    }

    card.addEventListener('pointerenter', () => {
      targetLift = -6;
      if (!rafId) rafId = requestAnimationFrame(applyTilt);
    });

    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRX = -y * 6;
      targetRY = x * 6;
      if (!rafId) rafId = requestAnimationFrame(applyTilt);
    });

    card.addEventListener('pointerleave', () => {
      targetRX = 0;
      targetRY = 0;
      targetLift = 0;
      if (!rafId) rafId = requestAnimationFrame(applyTilt);
    });
  });
}
initTilt();

/* ---------------------------------------------------------
   17. MAGNETIC BUTTONS
   --------------------------------------------------------- */
(() => {
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (isTouch) return;

  const magnets = document.querySelectorAll('.btn, .theme-toggle');

  magnets.forEach(btn => {
    btn.addEventListener('pointermove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px) scale(1.05)`;
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.transform = '';
    });
  });
})();

/* ---------------------------------------------------------
   18. PARALLASSE BLOB
   --------------------------------------------------------- */
(() => {
  const blob1 = document.querySelector('.blob-1');
  const blob2 = document.querySelector('.blob-2');
  if (!blob1 || !blob2) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      blob1.style.translate = `${y * 0.15}px ${y * 0.2}px`;
      blob2.style.translate = `${-y * 0.15}px ${-y * 0.15}px`;
      ticking = false;
    });
  }, { passive: true });
})();