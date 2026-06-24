/* Dropt site interactivity (converted from the Claude Design dc-runtime to vanilla JS).
   Everything is feature-detected so the same file works on every page. */
(function () {
  'use strict';
  var root = document.documentElement;

  /* ---- reveal-on-scroll + count-up ---- */
  var reveals = [].slice.call(document.querySelectorAll('[data-reveal]'));
  var counters = [].slice.call(document.querySelectorAll('[data-count]'));
  function runCount(el) {
    var target = parseFloat(el.dataset.count); if (isNaN(target)) return;
    var pre = el.dataset.pre || '', suf = el.dataset.suf || '', dec = parseInt(el.dataset.dec) || 0, dur = 1300, start = performance.now();
    (function step(now) {
      var p = Math.min(1, (now - start) / dur); p = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + (target * p).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        if (el.hasAttribute('data-reveal')) {
          var d = parseInt(el.dataset.reveal) || 0;
          setTimeout(function () { el.classList.add('shown'); }, d);
        }
        if (el.hasAttribute('data-count') && !el._counted) { el._counted = true; runCount(el); }
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    counters.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('shown'); });
    counters.forEach(runCount);
  }

  /* ---- nav scroll background ---- */
  var nav = document.querySelector('[data-nav]');
  if (nav) {
    var onNav = function () {
      if (window.scrollY > 20) {
        nav.style.background = 'rgba(13,13,13,0.72)'; nav.style.backdropFilter = 'blur(18px)';
        nav.style.webkitBackdropFilter = 'blur(18px)'; nav.style.borderBottomColor = 'rgba(255,255,255,0.08)';
      } else {
        nav.style.background = 'rgba(13,13,13,0)'; nav.style.backdropFilter = 'blur(0px)';
        nav.style.webkitBackdropFilter = 'blur(0px)'; nav.style.borderBottomColor = 'rgba(255,255,255,0)';
      }
    };
    window.addEventListener('scroll', onNav, { passive: true }); onNav();
  }

  /* ---- cursor glow ---- */
  var glow = document.querySelector('[data-glow]');
  if (glow && window.matchMedia('(pointer:fine)').matches) {
    var tx = window.innerWidth / 2, ty = 300, cx = tx, cy = ty, raf = null;
    var loop = function () {
      cx += (tx - cx) * 0.1; cy += (ty - cy) * 0.1;
      glow.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
      if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) raf = requestAnimationFrame(loop); else raf = null;
    };
    window.addEventListener('mousemove', function (ev) { tx = ev.clientX; ty = ev.clientY; if (!raf) raf = requestAnimationFrame(loop); });
  }

  /* ---- hero parallax ---- */
  var px = document.querySelector('[data-parallax]');
  if (px) window.addEventListener('scroll', function () { px.style.transform = 'translateY(' + (window.scrollY * 0.18) + 'px)'; }, { passive: true });

  /* ---- mobile menu ---- */
  var menu = document.querySelector('[data-menu]');
  function toggleMenu(open) { if (menu) menu.classList[open ? 'add' : 'remove']('open'); }
  [].forEach.call(document.querySelectorAll('[data-burger]'), function (b) { b.addEventListener('click', function () { toggleMenu(true); }); });
  [].forEach.call(document.querySelectorAll('[data-close]'), function (b) { b.addEventListener('click', function () { toggleMenu(false); }); });
  if (menu) [].forEach.call(menu.querySelectorAll('a'), function (a) { a.addEventListener('click', function () { toggleMenu(false); }); });

  /* ---- showcase tabs (mock + features switch together by index) ---- */
  var tabsWrap = document.querySelector('[data-tabs]');
  if (tabsWrap) {
    var btns = [].slice.call(tabsWrap.querySelectorAll('[data-tab]'));
    var panels = [].slice.call(document.querySelectorAll('[data-panel]'));
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = btn.getAttribute('data-tab');
        btns.forEach(function (b) { b.classList.toggle('active', b === btn); });
        panels.forEach(function (p) { p.classList.toggle('active', p.getAttribute('data-panel') === idx); });
      });
    });
  }

  /* ---- animated delivery flow ---- */
  var flow = document.querySelector('[data-flow]');
  if (flow) {
    var cards = [].slice.call(flow.querySelectorAll('.flowCard'));
    var started = false;
    var startFlow = function () {
      if (started) return; started = true;
      var step = 0;
      setInterval(function () {
        cards.forEach(function (c, i) { c.classList.toggle('lit', i <= step); });
        step = (step + 1) % (cards.length + 1);
      }, 700);
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { if (e[0].isIntersecting) startFlow(); }, { threshold: 0.4 }).observe(flow);
    } else { startFlow(); }
  }
})();
