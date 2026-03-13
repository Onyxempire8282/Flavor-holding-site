/* ============================================================
   FLAVOR HOLDINGS LLC — main.js
   No inline style mutations. All visual state via CSS classes.
   ============================================================ */

(function () {
  'use strict';

  // ── WEBHOOK ENDPOINTS ─────────────────────────────────────
  // Replace with actual n8n webhook URL once the workflow is created.
  var WEBHOOK_INSPECTOR = 'REPLACE_WITH_N8N_WEBHOOK_URL';

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

  // ── INSPECTOR APPLICATION FORM ────────────────────────────
  var inspectorBtn = document.getElementById('inspectorSubmit');

  if (inspectorBtn) {
    inspectorBtn.addEventListener('click', function () {
      inspectorBtn.disabled = true;
      inspectorBtn.textContent = 'Submitting\u2026';

      var days = [];
      document.querySelectorAll('.form__checkbox input:checked').forEach(function (cb) {
        days.push(cb.value);
      });

      var payload = {
        firstName:  document.getElementById('fname').value.trim(),
        lastName:   document.getElementById('lname').value.trim(),
        email:      document.getElementById('email').value.trim(),
        phone:      document.getElementById('phone').value.trim(),
        city:       document.getElementById('city').value.trim(),
        experience: document.getElementById('experience').value,
        vehicle:    document.getElementById('vehicle').value.trim(),
        daysAvailable: days,
        about:      document.getElementById('about').value.trim()
      };

      fetch(WEBHOOK_INSPECTOR, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(function (res) {
        if (!res.ok) throw new Error(res.status);
        inspectorBtn.textContent = 'Application Received.';
        inspectorBtn.classList.add('form__submit--sent');
      })
      .catch(function () {
        inspectorBtn.textContent = 'Error \u2014 email inspects@flav8r.net';
        inspectorBtn.classList.add('form__submit--error');
        inspectorBtn.disabled = false;
      });
    });
  }

}());
