
document.addEventListener('DOMContentLoaded', function () {

  /* Mark active nav page */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active-page');
    }
  });

  /* ── Nav scroll shadow */
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  /* ── Hamburger */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('open');
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
      });
    });
  }

  /* Scroll Reveal */
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.09 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  /* Counter animation  */
  function animateCounter(el) {
    const target   = parseInt(el.dataset.target);
    const suffix   = el.dataset.suffix || '';
    const duration = 1800;
    const start    = performance.now();
    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }
  const impactSection = document.getElementById('impact');
  if (impactSection) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('[data-target]').forEach(animateCounter);
          counterObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    counterObs.observe(impactSection);
  }

  /* GALLERY SLIDER */
  const sliderTrack = document.querySelector('.slider-track');
  const slides      = document.querySelectorAll('.slide');
  const dots        = document.querySelectorAll('.s-dot');
  const thumbs      = document.querySelectorAll('.g-thumb');
  let current       = 0;
  let autoTimer     = null;

  if (sliderTrack && slides.length) {
    function goTo(n) {
      current = (n + slides.length) % slides.length;
      sliderTrack.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
      thumbs.forEach((t, i) => t.classList.toggle('active', i === current));
    }
    function start() { stopAuto(); autoTimer = setInterval(() => goTo(current + 1), 4200); }
    function stopAuto() { if (autoTimer) clearInterval(autoTimer); }

    document.querySelector('.slider-btn.prev')?.addEventListener('click', () => { goTo(current - 1); start(); });
    document.querySelector('.slider-btn.next')?.addEventListener('click', () => { goTo(current + 1); start(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); start(); }));
    thumbs.forEach((t, i) => t.addEventListener('click', () => { goTo(i); start(); openLightbox(i); }));

    // Touch swipe
    let tx = 0;
    sliderTrack.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    sliderTrack.addEventListener('touchend', e => {
      const diff = tx - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? goTo(current + 1) : goTo(current - 1); start(); }
    });

    goTo(0);
    start();
  }

  /* Gallery filters*/
  document.querySelectorAll('.gf-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.gf-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  /* Lightbox */
  const lightbox   = document.getElementById('lightbox');
  const lbEmoji    = document.getElementById('lbEmoji');
  const lbTitle    = document.getElementById('lbTitle');
  const lbDesc     = document.getElementById('lbDesc');
  const galleryData = window.galleryData || [];

  function openLightbox(i) {
    if (!lightbox || !galleryData[i]) return;
    const item = galleryData[i];
    if (lbEmoji) lbEmoji.textContent = item.emoji;
    if (lbTitle) lbTitle.textContent = item.title;
    if (lbDesc)  lbDesc.textContent  = item.desc;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (lightbox) lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  window.openLightbox = openLightbox;

  /* Volunteer form */
  window.submitVol = function () {
    const req = ['vFN','vLN','vEmail','vRole'];
    let ok = true;
    req.forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.value.trim()) { el.style.borderColor = '#F87171'; ok = false; }
      else if (el) el.style.borderColor = '';
    });
    if (!ok) return;
    document.getElementById('volForm').style.display  = 'none';
    document.getElementById('volOk').style.display    = 'block';
  };

  /*  Contact form  */
  window.submitContact = function () {
    const fields = ['cName','cEmail','cMsg'];
    let ok = true;
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.value.trim()) { el.style.borderColor = '#EF4444'; ok = false; }
      else if (el) el.style.borderColor = '';
    });
    if (!ok) { return; }
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('contactOk').style.display   = 'block';
  };

});
