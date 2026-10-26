/* ==========================================================================
   Techtivity — behaviour
   Content lives in data.js. Each section below is independent: delete or
   comment out a section and the rest of the page keeps working.

   Sections
   1. Helpers            6. Companies accordion + product modal
   2. Loader and intro   7. Image reveal (lenticular)
   3. Hero wordmark      8. Members
   4. Hero string        9. Contact form
   5. Text and stats    10. Theme, navigation, cursor
   ========================================================================== */

/* 1. Helpers ------------------------------------------------------------- */
const $  = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const IMAGE_DIR = 'images/';


/* 2. Loader and intro ---------------------------------------------------- */
function runLoader() {
  const counter = $('#cnt');
  const duration = prefersReducedMotion ? 1 : 1400;
  const start = performance.now();

  function tick(now) {
    const percent = Math.min(100, Math.round(((now - start) / duration) * 100));
    counter.textContent = percent;
    if (percent < 100) return requestAnimationFrame(tick);

    $('#load').classList.add('done');          // slides the loader away
    document.body.classList.add('go');         // starts the hero animation
    setTimeout(() => $('#load').remove(), 1100);
  }
  tick(start);
}


/* 3. Hero wordmark ------------------------------------------------------- */
function renderHeroWord() {
  $('#h1').innerHTML = [...SITE.heroWord]
    .map((letter, i) =>
      `<span aria-hidden="true" style="transition-delay:${0.9 + i * 0.06}s">${letter}</span>`)
    .join('');
}


/* 4. Hero string (spring physics) ---------------------------------------- */
function initHeroString() {
  const hero = $('#hero');
  const svg = $('#str');
  const path = $('#sp');
  const grip = $('#sg');

  const SPRING = 0.09;   // pull towards the target
  const DAMPING = 0.82;  // lower = wobbles longer
  const REACH = 0.28;    // how close (fraction of hero height) the cursor must be

  let width, height, restY;
  let targetX, targetY, x, y, velX = 0, velY = 0;

  function measure() {
    width = hero.clientWidth;
    height = hero.clientHeight;
    restY = height * 0.5;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    if (x === undefined) { x = targetX = width / 2; y = targetY = restY; }
  }
  function release() { targetX = width / 2; targetY = restY; }

  measure();
  addEventListener('resize', () => { measure(); release(); });

  hero.addEventListener('pointermove', (event) => {
    const box = hero.getBoundingClientRect();
    const px = event.clientX - box.left;
    const py = event.clientY - box.top;
    hero.style.setProperty('--mx', px + 'px');   // drives the cursor glow
    hero.style.setProperty('--my', py + 'px');

    if (Math.abs(py - restY) < height * REACH) { targetX = px; targetY = restY + (py - restY) * 2; }
    else release();
  });
  hero.addEventListener('pointerleave', release);

  (function frame() {
    velX = (velX + (targetX - x) * SPRING) * DAMPING;
    velY = (velY + (targetY - y) * SPRING) * DAMPING;
    x += velX;
    y += velY;

    path.setAttribute('d', `M0 ${restY} Q${x} ${y} ${width} ${restY}`);
    grip.setAttribute('cx', 0.5 * x + 0.25 * width);     // midpoint of the curve
    grip.setAttribute('cy', 0.5 * restY + 0.5 * y);

    if (!prefersReducedMotion) {
      $('#h1').style.transform = `translateY(${Math.min(scrollY, height) * 0.18}px)`; // parallax
    }
    requestAnimationFrame(frame);
  })();
}


/* 5. Text and stats ------------------------------------------------------ */
let thesisWords = [];

function renderStack() {
  $('#mt').innerHTML = [...STACK, ...STACK].map((item) => `<span>${item}</span>`).join('');
}

function splitThesis() {
  const paragraph = $('#th');
  paragraph.innerHTML = paragraph.textContent
    .split(' ')
    .map((word) => `<span class="w">${word}</span>`)
    .join(' ');
  thesisWords = $$('.w');
}

function renderStats() {
  const productCount = COMPANIES.reduce((sum, c) => sum + c.products.length, 0);
  const years = new Date().getFullYear() - SITE.foundedYear;
  const stats = [
    [COMPANIES.length, 'Companies'],
    [productCount, 'Products in production'],
    [MEMBERS.length, 'Members'],
    [years, 'Years building software'],
  ];
  $('#stats').innerHTML = stats
    .map(([value, label]) => `<div><b data-n="${value}">0</b><span>${label}</span></div>`)
    .join('');

  // Count up each number the first time it scrolls into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      observer.unobserve(target);
      const end = Number(target.dataset.n);
      const start = performance.now();
      (function count(now) {
        const t = Math.min(1, (now - start) / 1400);
        target.textContent = Math.round(end * (1 - Math.pow(1 - t, 4))); // ease-out
        if (t < 1) requestAnimationFrame(count);
      })(start);
    });
  }, { threshold: 0.6 });
  $$('[data-n]').forEach((el) => observer.observe(el));
}


/* 6. Companies accordion + product modal --------------------------------- */
function renderCompanies() {
  const productTile = (product, ci, pi) => `
    <button class="pj" data-company="${ci}" data-product="${pi}" tabindex="-1">
      <img src="${IMAGE_DIR + product.image}" alt="${product.name}" loading="lazy">
      <span><b>${product.name}</b><em>${product.year}</em></span>
    </button>`;

  $('#colist').innerHTML = COMPANIES.map((company, ci) => `
    <div class="co" id="co${ci}">
      <button class="ch" aria-expanded="false" aria-controls="cp${ci}">
        <span class="n mu">0${ci + 1}</span>
        <h3>${company.name}</h3>
        <span class="k">${company.category}</span>
        <span class="pl" aria-hidden="true"></span>
      </button>
      <div class="cp" id="cp${ci}"><div><div class="cd">
        <p>${company.summary}</p>
        <div class="pg">${company.products.map((p, pi) => productTile(p, ci, pi)).join('')}</div>
      </div></div></div>
    </div>`).join('');

  // Open one company at a time
  $$('.ch').forEach((button) => button.addEventListener('click', () => {
    const item = button.parentElement;
    const willOpen = !item.classList.contains('open');
    $$('.co').forEach((other) => {
      other.classList.remove('open');
      other.querySelector('.ch').setAttribute('aria-expanded', 'false');
      other.querySelectorAll('.pj').forEach((tile) => (tile.tabIndex = -1));
    });
    if (willOpen) {
      item.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
      item.querySelectorAll('.pj').forEach((tile) => (tile.tabIndex = 0));
    }
  }));
  $('#co0 .ch').click();   // first company starts open

  // Product detail modal
  const dialog = $('#dg');
  $$('.pj').forEach((tile) => tile.addEventListener('click', () => {
    const company = COMPANIES[tile.dataset.company];
    const product = company.products[tile.dataset.product];
    $('#di').src = IMAGE_DIR + product.image;
    $('#di').alt = product.name;
    $('#dk').textContent = `${company.name} · ${product.tag} · ${product.year}`;
    $('#dt').textContent = product.name;
    $('#dp').textContent = product.text;
    dialog.showModal();
  }));
  $('#dx').onclick = () => dialog.close();
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
}


/* 7. Image reveal (lenticular) ------------------------------------------- */
function initReveal() {
  const section = $('#len');
  const top = $('#lb');
  const line = $('#ll');
  let autoplay = !prefersReducedMotion;   // sweeps by itself until the pointer moves

  const setPosition = (p) => {
    top.style.clipPath = `inset(0 0 0 ${p * 100}%)`;
    line.style.left = p * 100 + '%';
  };

  section.addEventListener('pointermove', (event) => {
    autoplay = false;
    const box = section.getBoundingClientRect();
    setPosition(clamp((event.clientX - box.left) / box.width, 0, 1));
  });
  (function sweep(now) {
    if (autoplay) setPosition(0.5 + Math.sin(now / 1400) * 0.4);
    requestAnimationFrame(sweep);
  })(0);
}


/* 8. Members ------------------------------------------------------------- */
function renderMembers() {
  const personIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>`;
  const portrait = (m) => m.photo
    ? `<img src="${IMAGE_DIR + m.photo}" alt="${m.name}" style="width:100%;aspect-ratio:3/4;object-fit:cover">`
    : `<div class="ph" role="img" aria-label="Portrait placeholder for ${m.name}">${personIcon}<em>Photo, 3:4</em></div>`;

  const groups = ['All', ...new Set(MEMBERS.map((m) => m.group))];
  $('#chips').innerHTML = groups
    .map((g, i) => `<button class="chip${i ? '' : ' on'}" data-g="${g}" aria-pressed="${!i}">${g}</button>`)
    .join('');

  $('#ml').innerHTML = MEMBERS.map((m) => `
    <article class="mb" data-g="${m.group}">
      ${portrait(m)}
      <h3>${m.name}</h3><span class="r">${m.role}</span><span class="c">${m.group}</span>
    </article>`).join('');

  $$('.chip').forEach((chip) => chip.addEventListener('click', () => {
    $$('.chip').forEach((other) => {
      other.classList.toggle('on', other === chip);
      other.setAttribute('aria-pressed', other === chip);
    });
    $$('.mb').forEach((card) => {
      const visible = chip.dataset.g === 'All' || card.dataset.g === chip.dataset.g;
      card.classList.toggle('hid', !visible);
      card.classList.remove('show');
      if (visible) { void card.offsetWidth; card.classList.add('show'); }   // replay the animation
    });
  }));
}


/* 9. Contact form (validates, then opens the visitor's email app) --------- */
function initContactForm() {
  const form = $('#cf');
  const message = $('#msg');

  const rules = [
    { field: 'name',  valid: (v) => v.trim().length > 1,
      error: 'Enter your name.' },
    { field: 'email', valid: (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim()),
      error: 'Enter a valid email address, like name@company.com.' },
    { field: 'msg',   valid: (v) => v.trim().length > 9,
      error: 'Write at least 10 characters about your project.' },
  ];

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form));

    const failed = rules.filter((rule) => {
      const input = form.elements[rule.field];
      const ok = rule.valid(values[rule.field]);
      input.setAttribute('aria-invalid', !ok);
      return !ok;
    });
    if (failed.length) {
      message.textContent = failed[0].error;
      form.elements[failed[0].field].focus();
      return;
    }

    const subject = encodeURIComponent('Enquiry from ' + values.name.trim());
    const body = encodeURIComponent(
      `Name: ${values.name.trim()}\nEmail: ${values.email.trim()}\n\n${values.msg.trim()}`);
    location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;

    message.textContent =
      `Your email app should open with the message ready to send. If nothing opens, email ${SITE.email} directly.`;
    form.reset();
  });
}


/* 10. Theme, navigation, cursor ------------------------------------------ */
function initTheme() {
  // The initial theme is set by the inline script in <head> to avoid a flash.
  $('#tg').onclick = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('kt', next); } catch (_) { /* storage unavailable */ }
  };
}

function initNavigation() {
  const nav = $('#nav');
  const bar = $('#bar');
  const sections = $$('main section[id], footer[id]');
  const links = $$('#links a');
  const burger = $('#burger');
  let lastY = 0;

  addEventListener('scroll', () => {
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${y / max})`;                                  // progress bar

    const menuOpen = document.body.classList.contains('menu-open');
    nav.classList.toggle('hide', y > lastY && y > 200 && !menuOpen);             // hide on scroll down
    lastY = y;

    thesisWords.forEach((word) =>                                                // word-by-word highlight
      word.classList.toggle('l', word.getBoundingClientRect().top < innerHeight * 0.6));

    let current = '';
    sections.forEach((s) => { if (s.getBoundingClientRect().top < innerHeight * 0.4) current = s.id; });
    links.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + current));
  }, { passive: true });
  dispatchEvent(new Event('scroll'));

  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
  };
  burger.onclick = () => setMenu(!document.body.classList.contains('menu-open'));
  links.forEach((a) => a.addEventListener('click', () => setMenu(false)));

  document.documentElement.style.scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
}

function initCursor() {
  const hasMouse = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!hasMouse || prefersReducedMotion) return;

  const dot = $('#cur');
  const ring = $('#ring');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  addEventListener('pointermove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    document.body.classList.add('hasc');
  });
  (function follow() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(follow);
  })();

  document.addEventListener('pointerover', (event) =>
    ring.classList.toggle('big', !!event.target.closest('a, button, .mb, input, .len')));

  // Magnetic buttons: add class "mag" to any element
  $$('.mag').forEach((el) => {
    el.addEventListener('pointermove', (event) => {
      const box = el.getBoundingClientRect();
      const dx = (event.clientX - box.left - box.width / 2) * 0.3;
      const dy = (event.clientY - box.top - box.height / 2) * 0.4;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('pointerleave', () => (el.style.transform = ''));
  });
}


/* Start ------------------------------------------------------------------ */
runLoader();
renderHeroWord();
initHeroString();
renderStack();
splitThesis();
renderStats();
renderCompanies();
initReveal();
renderMembers();
initContactForm();
initTheme();
initNavigation();
initCursor();
