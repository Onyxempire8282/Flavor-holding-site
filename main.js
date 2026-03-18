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

// ── CLAIM MODAL ──────────────────────────────────────────────

var CLAIM_ENDPOINT = 'https://qrouuoycvxxxutkxkxpp.supabase.co/functions/v1/public-claim-submit';

function openClaimModal() {
  var modal = document.getElementById('claimModal');
  if (!modal) return;
  modal.classList.add('claim-modal--open');
  document.body.classList.add('body--modal-open');
  document.getElementById('cm_claim_number').focus();
}

function closeClaimModal() {
  var modal = document.getElementById('claimModal');
  if (!modal) return;
  modal.classList.remove('claim-modal--open');
  document.body.classList.remove('body--modal-open');
  resetClaimModal();
}

function resetClaimModal() {
  showClaimStep('claimStep1');
  hideClaimError();
  document.querySelectorAll('.claim-modal__input').forEach(function(input) {
    input.value = '';
    input.classList.remove('claim-modal__input--error');
  });
  var btn = document.getElementById('claimSubmitBtn');
  if (btn) {
    btn.disabled = false;
    btn.textContent = 'Submit Claim';
  }
}

function showClaimStep(stepId) {
  document.querySelectorAll('.claim-modal__step').forEach(function(step) {
    step.classList.add('claim-modal__step--hidden');
  });
  var target = document.getElementById(stepId);
  if (target) target.classList.remove('claim-modal__step--hidden');
}

function showClaimError(message) {
  var bar = document.getElementById('claimErrorBar');
  var text = document.getElementById('claimErrorText');
  if (!bar || !text) return;
  text.textContent = message;
  bar.classList.remove('claim-modal__error-bar--hidden');
}

function hideClaimError() {
  var bar = document.getElementById('claimErrorBar');
  if (bar) bar.classList.add('claim-modal__error-bar--hidden');
}

function claimModalNext() {
  hideClaimError();
  var required1 = ['cm_customer_name', 'cm_address_line1', 'cm_city', 'cm_state', 'cm_zip'];
  var valid = true;

  required1.forEach(function(id) {
    var field = document.getElementById(id);
    if (!field) return;
    field.classList.remove('claim-modal__input--error');
    if (!field.value.trim()) {
      field.classList.add('claim-modal__input--error');
      valid = false;
    }
  });

  if (!valid) {
    showClaimError('Please fill in all required fields before continuing.');
    return;
  }

  showClaimStep('claimStep2');
  document.getElementById('cm_contact_name').focus();
}

function claimModalBack() {
  hideClaimError();
  showClaimStep('claimStep1');
}

function getClaimFormData() {
  var fields = [
    'cm_claim_number', 'cm_date_of_loss', 'cm_customer_name',
    'cm_address_line1', 'cm_city', 'cm_state', 'cm_zip',
    'cm_contact_name', 'cm_contact_email', 'cm_contact_phone',
    'cm_vin', 'cm_year', 'cm_make', 'cm_model', 'cm_instructions'
  ];
  var data = {};
  fields.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      var key = id.replace('cm_', '');
      data[key] = el.value.trim();
    }
  });
  data['special_instructions'] = data['instructions'];
  delete data['instructions'];
  return data;
}

async function submitClaim() {
  hideClaimError();

  var contactName = document.getElementById('cm_contact_name');
  var contactEmail = document.getElementById('cm_contact_email');
  var valid = true;

  [contactName, contactEmail].forEach(function(field) {
    if (!field) return;
    field.classList.remove('claim-modal__input--error');
    if (!field.value.trim()) {
      field.classList.add('claim-modal__input--error');
      valid = false;
    }
  });

  if (!valid) {
    showClaimError('Please provide your name and email before submitting.');
    return;
  }

  var btn = document.getElementById('claimSubmitBtn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Submitting...';
  }

  var payload = getClaimFormData();

  try {
    var response = await fetch(CLAIM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    var result = await response.json();

    if (response.ok && result.success) {
      var numEl = document.getElementById('claimSuccessNumber');
      if (numEl && result.claim_number) {
        numEl.textContent = 'Claim #: ' + result.claim_number;
      }
      showClaimStep('claimSuccess');
    } else {
      var errorMsg = result.error || 'Something went wrong. Please try again or email admin@flav8r.net.';
      showClaimError(errorMsg);
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Submit Claim';
      }
    }
  } catch (err) {
    showClaimError('Unable to reach the server. Please check your connection or email admin@flav8r.net.');
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Submit Claim';
    }
  }
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    var modal = document.getElementById('claimModal');
    if (modal && modal.classList.contains('claim-modal--open')) {
      closeClaimModal();
    }
  }
});
