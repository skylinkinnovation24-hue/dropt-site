/* Dropt site interactivity (converted from the Claude Design dc-runtime to vanilla JS).
   Everything is feature-detected so the same file works on every page. */
(function () {
  'use strict';
  var root = document.documentElement;

  /* ---- auto-stagger children of [data-stagger] BEFORE reveal is wired ---- */
  [].forEach.call(document.querySelectorAll('[data-stagger]'), function (group) {
    [].slice.call(group.children).forEach(function (child, i) {
      if (!child.hasAttribute('data-reveal')) { child.setAttribute('data-reveal', String(i * 80)); }
    });
  });

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

  /* ---- hero dashboard stack auto-rotator ---- */
  var rotator = document.querySelector('[data-rotator]');
  if (rotator) {
    var rcards = [].slice.call(rotator.querySelectorAll('.rotCard'));
    var rdots = [].slice.call(document.querySelectorAll('[data-rotdot]'));
    var ri = 0;
    var setRot = function (n) {
      ri = (n + rcards.length) % rcards.length;
      rcards.forEach(function (c, i) { c.classList.toggle('active', i === ri); });
      rdots.forEach(function (d, i) { d.classList.toggle('on', i === ri); });
    };
    setRot(0);
    var rtimer = setInterval(function () { setRot(ri + 1); }, 4000);
    rdots.forEach(function (d, i) { d.addEventListener('click', function () { clearInterval(rtimer); setRot(i); rtimer = setInterval(function () { setRot(ri + 1); }, 4000); }); });
  }

  /* ---- scroll-driven delivery journey (package travels, nodes light, line grows) ---- */
  var journey = document.querySelector('[data-journey]');
  if (journey) {
    var nodes = [].slice.call(journey.querySelectorAll('.jNode'));
    var line = journey.querySelector('.jLineFill');
    var pkg = journey.querySelector('.jPkg');
    var onJ = function () {
      var r = journey.getBoundingClientRect();
      var vh = window.innerHeight;
      // progress as the section passes through the middle band of the viewport
      var p = (vh * 0.75 - r.top) / (r.height + vh * 0.4);
      p = Math.max(0, Math.min(1, p));
      var idx = Math.round(p * (nodes.length - 1));
      nodes.forEach(function (n, i) { n.classList.toggle('lit', i <= idx); });
      if (line) line.style.width = (p * 100) + '%';
      if (pkg) pkg.style.left = (p * 100) + '%';
    };
    window.addEventListener('scroll', onJ, { passive: true });
    window.addEventListener('resize', onJ, { passive: true });
    onJ();
  }

  /* ---- ROI calculator ---- */
  var roi = document.querySelector('[data-roi]');
  if (roi) {
    var inputs = {};
    [].forEach.call(roi.querySelectorAll('[data-roi-input]'), function (el) { inputs[el.getAttribute('data-roi-input')] = el; });
    var outEls = {};
    [].forEach.call(roi.querySelectorAll('[data-roi-out]'), function (el) { outEls[el.getAttribute('data-roi-out')] = el; });
    var fmtINR = function (n) { return '₹' + Math.round(n).toLocaleString('en-IN'); };
    var animTo = function (el, to, render) {
      var from = el._val || 0, start = performance.now(), dur = 550;
      (function step(now) {
        var t = Math.min(1, (now - start) / dur); t = 1 - Math.pow(1 - t, 3);
        var v = from + (to - from) * t; el.textContent = render(v);
        if (t < 1) requestAnimationFrame(step); else el._val = to;
      })(start);
    };
    var compute = function () {
      var orders = +inputs.orders.value, aov = +inputs.aov.value, stores = +inputs.stores.value, radius = +inputs.radius.value;
      // reflect slider values in their labels
      [].forEach.call(roi.querySelectorAll('[data-roi-val]'), function (el) {
        var k = el.getAttribute('data-roi-val');
        el.textContent = k === 'orders' ? (+orders).toLocaleString('en-IN')
          : k === 'aov' ? fmtINR(aov)
          : k === 'stores' ? stores : radius + ' km';
      });
      var share = Math.max(0.2, Math.min(0.8, 0.30 + stores * 0.03 - Math.max(0, radius - 3) * 0.03));
      var sameDay = orders * share;
      var revenue = orders * aov;
      var util = Math.max(35, Math.min(95, 42 + stores * 3.5 + share * 30));
      var dtime = Math.round(16 + radius * 6);
      var retention = Math.round(14 + share * 22);
      animTo(outEls.sameday, sameDay, function (v) { return Math.round(v).toLocaleString('en-IN'); });
      animTo(outEls.revenue, revenue, function (v) { return fmtINR(v); });
      animTo(outEls.util, util, function (v) { return Math.round(v) + '%'; });
      animTo(outEls.dtime, dtime, function (v) { return Math.round(v) + ' min'; });
      animTo(outEls.retention, retention, function (v) { return '+' + Math.round(v) + '%'; });
    };
    Object.keys(inputs).forEach(function (k) { inputs[k].addEventListener('input', compute); });
    if ('IntersectionObserver' in window) {
      var fired = false;
      new IntersectionObserver(function (e) { if (e[0].isIntersecting && !fired) { fired = true; compute(); } }, { threshold: 0.3 }).observe(roi);
    } else { compute(); }
  }

  /* ---- scroll-spy nav (highlight active section) ---- */
  var spyLinks = [].slice.call(document.querySelectorAll('[data-spy] a[href^="#"]'));
  if (spyLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    spyLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          spyLinks.forEach(function (a) { a.classList.remove('spyOn'); });
          var a = byId[e.target.id]; if (a) a.classList.add('spyOn');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---- glass reflection follows pointer ---- */
  if (window.matchMedia('(pointer:fine)').matches) {
    [].forEach.call(document.querySelectorAll('.glass'), function (el) {
      el.addEventListener('mousemove', function (ev) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((ev.clientX - r.left) / r.width * 100) + '%');
        el.style.setProperty('--my', ((ev.clientY - r.top) / r.height * 100) + '%');
        el.classList.add('glassOn');
      });
      el.addEventListener('mouseleave', function () { el.classList.remove('glassOn'); });
    });
  }

})();
