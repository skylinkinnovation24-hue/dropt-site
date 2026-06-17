/* ============================================================
   DROPT — shared front-end behaviour
   Core interactions used on every page:
     • Cursor "heat map" glow (the signature animation)
     • Sticky nav that blurs on scroll
     • Hero parallax orbs
     • Reveal-on-scroll + animated counters
   Page-specific widgets live in each page's inline <script>,
   and reuse Dropt.observeReveal() / Dropt.countUp() where useful.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. Cursor heat-map glow ---------------------------- */
  /* A soft radial bloom that trails the pointer with an eased
     lerp (factor 0.1) so it "flows" rather than snapping. */
  function initGlow() {
    var g = document.querySelector('[data-glow]');
    if (!g || reduceMotion) return;

    var tx = window.innerWidth / 2, ty = 300;   // target (pointer)
    var cx = tx, cy = ty;                        // current (eased)
    var raf = null;

    function loop() {
      cx += (tx - cx) * 0.1;
      cy += (ty - cy) * 0.1;
      g.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
      if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    }
    window.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
  }

  /* ---- 2. Sticky nav -------------------------------------- */
  function initNav() {
    var nav = document.querySelector('[data-nav]');
    if (!nav) return;
    function onScroll() {
      nav.classList.toggle('is-scrolled', window.scrollY > 20);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- 3. Parallax orbs ----------------------------------- */
  function initParallax() {
    var els = [].slice.call(document.querySelectorAll('[data-parallax]'));
    if (!els.length || reduceMotion) return;
    var ticking = false;
    function update() {
      var y = window.scrollY;
      els.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.22;
        var centered = el.hasAttribute('data-parallax-center');
        el.style.transform = (centered ? 'translateX(-50%) ' : '') +
          'translateY(' + (y * speed) + 'px)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
  }

  /* ---- 4. Reveal-on-scroll + counters --------------------- */
  function countUp(el) {
    if (el._counted) return;
    el._counted = true;
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    var pre = el.getAttribute('data-pre') || '';
    var suf = el.getAttribute('data-suf') || '';
    var dec = parseInt(el.getAttribute('data-dec'), 10) || 0;
    var intl = el.hasAttribute('data-count-intl');
    var dur = 1300, start = performance.now();

    if (reduceMotion) {
      el.textContent = pre + (intl ? Math.round(target).toLocaleString('en-IN') : target.toFixed(dec)) + suf;
      return;
    }
    function step(now) {
      var p = Math.min(1, (now - start) / dur);
      p = 1 - Math.pow(1 - p, 3);                 // easeOutCubic
      var v = intl
        ? Math.round(target * p).toLocaleString('en-IN')
        : (target * p).toFixed(dec);
      el.textContent = pre + v + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var revealObserver = null;
  function observeReveal(scope) {
    scope = scope || document;
    var nodes = [].slice.call(scope.querySelectorAll('[data-reveal]:not(.reveal-bound)'));
    var counters = [].slice.call(scope.querySelectorAll('[data-count]:not(.count-bound)'));

    nodes.forEach(function (el) {
      el.classList.add('reveal', 'reveal-bound');
      if (reduceMotion) el.classList.add('is-in');
    });
    counters.forEach(function (el) { el.classList.add('count-bound'); });

    if (reduceMotion) {
      counters.forEach(countUp);
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          if (el.hasAttribute('data-count')) {
            countUp(el);
            revealObserver.unobserve(el);
          }
          if (el.classList.contains('reveal-bound') && !el._shown) {
            el._shown = true;
            var d = parseInt(el.getAttribute('data-reveal'), 10) || 0;
            setTimeout(function () { el.classList.add('is-in'); }, d);
            revealObserver.unobserve(el);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
    }
    nodes.forEach(function (el) { revealObserver.observe(el); });
    counters.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---- Boot ----------------------------------------------- */
  function boot() {
    initGlow();
    initNav();
    initParallax();
    observeReveal(document);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* Public helpers for page-specific scripts */
  window.Dropt = {
    observeReveal: observeReveal,
    countUp: countUp,
    reduceMotion: reduceMotion
  };
})();
