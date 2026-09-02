/* ===================================================
   PROFESOR JHONY — main.js
   Cursor · Navbar · Hamburger · Hero cards · Scroll top
   =================================================== */
(function () {

  /* =====================
     1. CUSTOM CURSOR
  ===================== */
  const cursor    = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');

  if (cursor && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    (function ringLoop() {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(ringLoop);
    })();

    const hoverSels = 'a, button, .btn, .hero-card, .instrument-card, .resume-item, .testimonial-card, .gallery-item, .nav-hamburger, .social-icon, .tool-item';
    document.querySelectorAll(hoverSels).forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursorRing.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorRing.classList.remove('hover');
      });
    });
  }


  /* =====================
     2. NAVBAR SCROLL
  ===================== */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });


  /* =====================
     3. HAMBURGER / MOBILE NAV
  ===================== */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  function closeMobile() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link, .mobile-nav .btn').forEach(el => {
    el.addEventListener('click', closeMobile);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobile();
  });


  /* =====================
     4. SMOOTH SCROLL for anchor links
  ===================== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        closeMobile();
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    });
  });


  /* =====================
     5. HERO CARDS — staggered entrance
  ===================== */
  const heroCards = document.querySelectorAll('.hero-card');
  heroCards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add('visible');
    }, 700 + i * 200);
  });


  /* =====================
     6. SCROLL-TO-TOP BUTTON
  ===================== */
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.className = 'scroll-top';
  scrollTopBtn.setAttribute('aria-label', 'Volver arriba');
  scrollTopBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`;
  document.body.appendChild(scrollTopBtn);

  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* =====================
     7. HERO SVG CONNECTIONS
        (draw animated dashed lines between card centers)
  ===================== */
  function drawHeroConnections() {
    const svg = document.getElementById('heroConnections');
    const visual = document.querySelector('.hero-visual');
    if (!svg || !visual) return;

    const cards = ['hc1', 'hc2', 'hc3', 'hc4', 'hc5'];
    const centers = cards.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const vRect = visual.getBoundingClientRect();
      const eRect = el.getBoundingClientRect();
      return {
        x: eRect.left - vRect.left + eRect.width  / 2,
        y: eRect.top  - vRect.top  + eRect.height / 2,
      };
    }).filter(Boolean);

    const pairs = [[0,4],[1,4],[2,4],[3,4],[0,2],[1,3]];
    svg.innerHTML = '';

    pairs.forEach(([a, b]) => {
      if (!centers[a] || !centers[b]) return;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', centers[a].x);
      line.setAttribute('y1', centers[a].y);
      line.setAttribute('x2', centers[b].x);
      line.setAttribute('y2', centers[b].y);
      line.setAttribute('stroke', 'rgba(232,163,61,0.14)');
      line.setAttribute('stroke-width', '1');
      line.setAttribute('stroke-dasharray', '4 6');
      svg.appendChild(line);
    });
  }

  setTimeout(drawHeroConnections, 1400);
  window.addEventListener('resize', drawHeroConnections);


  /* =====================
     8. METHODOLOGY TIMELINE — mobile vertical animation
  ===================== */
  function initProcessTimeline() {
    if (window.innerWidth > 768) return;

    const container = document.getElementById('stepsContainer');
    if (!container) return;

    const steps = Array.from(container.querySelectorAll('.step'));

    if (!container.querySelector('.steps-progress-line')) {
      const line = document.createElement('div');
      line.className = 'steps-progress-line';
      container.appendChild(line);
    }

    steps.forEach(step => {
      if (!step.querySelector('.steps-dot')) {
        const dot = document.createElement('div');
        dot.className = 'steps-dot';
        step.insertBefore(dot, step.firstChild);
      }
    });

    const progressLine = container.querySelector('.steps-progress-line');

    function updateTimeline() {
      const winH = window.innerHeight;
      let activeCount = 0;

      steps.forEach((step, i) => {
        const rect = step.getBoundingClientRect();
        const mid  = rect.top + rect.height / 2;
        if (mid < winH * 0.75) {
          step.classList.add('step-active');
          activeCount = i + 1;
        }
      });

      if (progressLine && steps.length > 0) {
        progressLine.style.height = ((activeCount / steps.length) * 100) + '%';
      }
    }

    window.addEventListener('scroll', updateTimeline, { passive: true });
    updateTimeline();
  }

  initProcessTimeline();
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initProcessTimeline, 200);
  });

})();
