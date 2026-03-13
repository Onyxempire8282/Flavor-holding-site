/* ============================================================
   FLAVOR HOLDINGS LLC — main.js
   No inline style mutations. All visual state via CSS classes.
   CSS custom property injection only where specified.
   ============================================================ */

(function () {
  'use strict';

  // ── WEBHOOK ENDPOINTS ─────────────────────────────────────
  var WEBHOOK_INSPECTOR = 'REPLACE_WITH_N8N_INSPECTOR_WEBHOOK';

  // ── SCROLL REVEAL ─────────────────────────────────────────
  var revealEls = document.querySelectorAll('.reveal');

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ── MOBILE NAV HAMBURGER ──────────────────────────────────
  var navHamburger = document.getElementById('navHamburger');
  var nav = navHamburger ? navHamburger.closest('.nav') : null;

  if (navHamburger && nav) {
    navHamburger.addEventListener('click', function () {
      nav.classList.toggle('nav--open');
      var expanded = navHamburger.getAttribute('aria-expanded') === 'true';
      navHamburger.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });

    nav.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('nav--open');
        navHamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── COVERAGE CIRCLE POSITIONING (CSS custom properties) ───
  document.querySelectorAll('.coverage__circle, .footer__map-circle')
    .forEach(function (el) {
      el.style.setProperty('--circle-left', el.dataset.left + '%');
      el.style.setProperty('--circle-top', el.dataset.top + '%');
    });

  // ── COVERAGE TOOLTIP ──────────────────────────────────────
  var tooltip = document.getElementById('coverageTooltip');
  var tooltipRegion = document.getElementById('tooltipRegion');
  var tooltipCta = document.getElementById('tooltipCta');
  var coverageMap = document.getElementById('coverageMap');

  if (tooltip && tooltipRegion && tooltipCta && coverageMap) {
    document.querySelectorAll('.coverage__circle').forEach(function (circle) {
      circle.addEventListener('mouseenter', function () {
        var region = circle.getAttribute('data-region');
        tooltipRegion.textContent = region;

        var circleRect = circle.getBoundingClientRect();
        var mapRect = coverageMap.getBoundingClientRect();
        var left = circleRect.left - mapRect.left + circleRect.width / 2;
        var top = circleRect.top - mapRect.top - 10;

        tooltip.style.setProperty('--tooltip-left', left + 'px');
        tooltip.style.setProperty('--tooltip-top', top + 'px');

        tooltip.classList.add('coverage__tooltip--visible');

        if (circle.classList.contains('coverage__circle--open')) {
          tooltipCta.classList.remove('coverage__tooltip-cta--hidden');
          tooltipCta.classList.add('coverage__tooltip-cta--visible');
        } else {
          tooltipCta.classList.add('coverage__tooltip-cta--hidden');
          tooltipCta.classList.remove('coverage__tooltip-cta--visible');
        }
      });

      circle.addEventListener('mouseleave', function () {
        tooltip.classList.remove('coverage__tooltip--visible');
        tooltipCta.classList.add('coverage__tooltip-cta--hidden');
        tooltipCta.classList.remove('coverage__tooltip-cta--visible');
      });
    });
  }

  // ── INSPECTOR APPLICATION FORM ────────────────────────────
  var inspectorBtn = document.getElementById('inspectorSubmit');

  if (inspectorBtn) {
    // Remove error class on input correction
    document.querySelectorAll('.form__input, .form__select, .form__textarea').forEach(function (input) {
      input.addEventListener('input', function () {
        input.classList.remove('form__input--error');
      });
    });

    inspectorBtn.addEventListener('click', function () {
      var fnameEl = document.getElementById('fname');
      var lnameEl = document.getElementById('lname');
      var emailEl = document.getElementById('email');
      var phoneEl = document.getElementById('phone');
      var cityEl = document.getElementById('city');

      var valid = true;

      // Clear previous errors
      [fnameEl, lnameEl, emailEl, phoneEl, cityEl].forEach(function (el) {
        el.classList.remove('form__input--error');
      });

      // Required: firstName
      if (!fnameEl.value.trim()) {
        fnameEl.classList.add('form__input--error');
        valid = false;
      }

      // Required: lastName
      if (!lnameEl.value.trim()) {
        lnameEl.classList.add('form__input--error');
        valid = false;
      }

      // Required: valid email
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailEl.value.trim())) {
        emailEl.classList.add('form__input--error');
        valid = false;
      }

      // Required: 10-digit phone
      var digits = phoneEl.value.replace(/\D/g, '');
      if (digits.length !== 10) {
        phoneEl.classList.add('form__input--error');
        valid = false;
      }

      // Required: city
      if (!cityEl.value.trim()) {
        cityEl.classList.add('form__input--error');
        valid = false;
      }

      if (!valid) return;

      inspectorBtn.disabled = true;
      inspectorBtn.textContent = 'Submitting\u2026';

      var availability = [];
      document.querySelectorAll('.form__checkbox-input:checked').forEach(function (cb) {
        availability.push(cb.value);
      });

      var payload = {
        firstName:    fnameEl.value.trim(),
        lastName:     lnameEl.value.trim(),
        email:        emailEl.value.trim(),
        phone:        phoneEl.value.trim(),
        city:         cityEl.value.trim(),
        experience:   document.getElementById('experience').value,
        vehicle:      document.getElementById('vehicle').value.trim(),
        availability: availability,
        bio:          document.getElementById('bio').value.trim()
      };

      fetch(WEBHOOK_INSPECTOR, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(function (res) {
        if (!res.ok) throw new Error(res.status);
        inspectorBtn.textContent = 'Application Received \u2014 We\u2019ll be in touch within 2 business days.';
        inspectorBtn.classList.add('form__submit--sent');
      })
      .catch(function () {
        inspectorBtn.textContent = 'Something went wrong \u2014 email inspects@flav8r.net';
        inspectorBtn.classList.add('form__submit--error');
        inspectorBtn.disabled = false;
      });
    });
  }

}());
