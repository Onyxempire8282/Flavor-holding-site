/* ============================================================
   FLAVOR HOLDINGS LLC — main.js
   No inline style mutations. All visual state via CSS classes.
   ============================================================ */

(function () {
  'use strict';

  // ── SCROLL REVEAL ─────────────────────────────────────────
  // Adds .reveal--visible to elements as they enter the viewport.
  // Transition delay is handled entirely by CSS (.reveal--d1 ... --d6).

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

  // ── INSPECTOR FORM SUBMIT ────────────────────────────────
  // Swaps button text and applies a CSS modifier class.
  // Zero inline style changes — visual feedback lives in CSS.

  var submitBtn = document.getElementById('inspectorSubmit');

  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      submitBtn.textContent = "Submitted — We'll be in touch.";
      submitBtn.classList.add('form__submit--sent');
      submitBtn.disabled = true;
    });
  }

}());
