/* ==========================================================================
   Klaudia Schall · Seven Sundays Schlafberatung
   Navigation · Scroll-Reveal · Mehrstufiges Qualifizierungs-Formular
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------
     KONFIGURATION
     -------------------------------------------------------------
     Web3Forms verschickt die Anfragen per E-Mail – kein Server nötig.
     TODO: Eigenen Access-Key für Klaudia Schall auf https://web3forms.com
     anfordern (Empfänger = Klaudias E-Mail) und hier eintragen.
     Aktuell läuft es über den Ländle-Digital-Key als Platzhalter.        */
  var WEB3FORMS_ACCESS_KEY = '2df05c94-c19f-46ed-a4c2-ea64cf4aa302';
  var LEAD_SUBJECT = 'Neue Schlafberatungs-Anfrage · klaudia-schall.de';
  var FALLBACK_CONTACT = 'klaudia.schall@web.de';

  document.addEventListener('DOMContentLoaded', function () {
    initYear();
    initMobileNav();
    initReveal();
    initLeadForm();
  });

  /* ---- Footer-Jahr ---- */
  function initYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---- Mobile Navigation ---- */
  function initMobileNav() {
    var burger = document.getElementById('burger');
    var mobile = document.getElementById('mobileNav');
    if (!burger || !mobile) return;

    burger.addEventListener('click', function () {
      var open = mobile.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobile.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Scroll-Reveal ---- */
  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* =============================================================
     MEHRSTUFIGES QUALIFIZIERUNGS-FORMULAR
  ============================================================== */
  function initLeadForm() {
    var form = document.getElementById('leadForm');
    if (!form) return;

    var steps = Array.prototype.slice.call(form.querySelectorAll('.fstep'));
    var fill = document.getElementById('progressFill');
    var counter = document.getElementById('progressCounter');
    var prevBtn = form.querySelector('[data-prev]');
    var nextBtn = form.querySelector('[data-next]');
    var errorBox = document.getElementById('formError');
    var current = 0;
    var total = steps.length;

    var LABELS = {
      anliegen: 'Anliegen',
      schlafposition: 'Schlafposition',
      matratze_alter: 'Aktuelle Matratze',
      personen: 'Schläft im Bett',
      plz_ort: 'PLZ / Ort',
      kontaktweg: 'Kontakt bevorzugt',
      zeitfenster: 'Wunsch-Zeit',
      vorname: 'Vorname',
      nachname: 'Nachname',
      email: 'E-Mail',
      telefon: 'Telefon',
      nachricht: 'Nachricht'
    };

    function showError(msg) {
      if (!errorBox) return;
      errorBox.textContent = msg;
      errorBox.classList.add('is-visible');
    }
    function clearError() {
      if (!errorBox) return;
      errorBox.classList.remove('is-visible');
      errorBox.textContent = '';
    }

    function render() {
      steps.forEach(function (s, i) { s.classList.toggle('is-active', i === current); });
      var pct = Math.round(((current + 1) / total) * 100);
      if (fill) fill.style.width = pct + '%';
      if (counter) counter.textContent = 'Schritt ' + (current + 1) + ' / ' + total;
      if (prevBtn) prevBtn.style.visibility = current === 0 ? 'hidden' : 'visible';
      if (nextBtn) {
        var last = current === total - 1;
        nextBtn.innerHTML = last
          ? 'Anfrage senden <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>'
          : 'Weiter <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
      }
      clearError();
    }

    /* Validierung eines Schritts anhand data-required="feld1,feld2" */
    function validateStep(stepEl) {
      var required = (stepEl.getAttribute('data-required') || '')
        .split(',').map(function (s) { return s.trim(); }).filter(Boolean);

      for (var i = 0; i < required.length; i++) {
        var name = required[i];
        var fields = stepEl.querySelectorAll('[name="' + name + '"]');
        if (!fields.length) continue;
        var type = fields[0].type;

        if (type === 'radio' || type === 'checkbox') {
          var anyChecked = Array.prototype.some.call(fields, function (f) { return f.checked; });
          if (!anyChecked) {
            return name === 'consent'
              ? 'Bitte stimme der Verarbeitung deiner Daten zu, damit wir dich kontaktieren dürfen.'
              : 'Bitte triff noch eine Auswahl bei: ' + (LABELS[name] || name) + '.';
          }
        } else {
          var emptyField = Array.prototype.filter.call(fields, function (f) { return !f.value.trim(); })[0];
          if (emptyField) {
            emptyField.focus();
            return 'Bitte fülle das Feld „' + (LABELS[name] || name) + '“ aus.';
          }
          if (fields[0].type === 'email') {
            var em = fields[0];
            if (!em.checkValidity() || !/.+@.+\..+/.test(em.value)) {
              em.focus();
              return 'Bitte gib eine gültige E-Mail-Adresse ein.';
            }
          }
          if (fields[0].type === 'tel') {
            var digits = fields[0].value.replace(/[^0-9]/g, '');
            if (digits.length < 6) {
              fields[0].focus();
              return 'Bitte gib eine gültige Telefonnummer an.';
            }
          }
        }
      }
      return null;
    }

    function goNext() {
      var err = validateStep(steps[current]);
      if (err) { showError(err); return; }
      if (current < total - 1) {
        current++;
        render();
        scrollFormIntoView();
      } else {
        submitForm();
      }
    }

    function goPrev() {
      if (current > 0) { current--; render(); scrollFormIntoView(); }
    }

    function scrollFormIntoView() {
      var card = document.getElementById('formCard');
      if (!card) return;
      var top = card.getBoundingClientRect().top + window.pageYOffset - 96;
      if (window.pageYOffset > top || (top - window.pageYOffset) > window.innerHeight) {
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    }

    /* Lesbare Zusammenfassung für die E-Mail an Klaudia */
    function buildSummary() {
      var data = collect();
      var lines = [];
      Object.keys(LABELS).forEach(function (key) {
        if (data[key]) lines.push(LABELS[key] + ': ' + data[key]);
      });
      return lines.join('\n');
    }

    function collect() {
      var fd = new FormData(form);
      var out = {};
      fd.forEach(function (val, key) {
        if (key === 'consent') return;
        val = String(val).trim();
        if (!val) return;
        out[key] = out[key] ? out[key] + ', ' + val : val;
      });
      return out;
    }

    function submitForm() {
      var err = validateStep(steps[current]);
      if (err) { showError(err); return; }
      clearError();

      var fd = new FormData(form);
      fd.append('access_key', WEB3FORMS_ACCESS_KEY);
      fd.append('subject', LEAD_SUBJECT);
      fd.append('from_name', 'Website Klaudia Schall');
      fd.append('zusammenfassung', buildSummary());
      fd.append('source', location.href);

      nextBtn.disabled = true;
      if (prevBtn) prevBtn.disabled = true;
      var original = nextBtn.innerHTML;
      nextBtn.innerHTML = 'Wird gesendet …';

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: fd
      })
        .then(function (res) { return res.json().catch(function () { return {}; }).then(function (j) { return { ok: res.ok, j: j }; }); })
        .then(function (r) {
          if (!r.ok || r.j.success === false) { throw new Error(r.j.message || 'Submit failed'); }
          showSuccess();
        })
        .catch(function () {
          nextBtn.disabled = false;
          if (prevBtn) prevBtn.disabled = false;
          nextBtn.innerHTML = original;
          showError('Das Senden hat leider nicht geklappt. Bitte versuche es erneut oder schreibe an ' + FALLBACK_CONTACT + '.');
        });
    }

    function showSuccess() {
      var data = collect();
      var name = (data.vorname || '').split(' ')[0] || '';
      var card = document.getElementById('formCard');
      if (!card) return;
      card.innerHTML =
        '<div class="form-success">' +
          '<div class="form-success__icon">' +
            '<svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>' +
          '</div>' +
          '<h3>Danke' + (name ? ', ' + escapeHtml(name) : '') + '!</h3>' +
          '<p>Deine Anfrage ist angekommen. Klaudia meldet sich in der Regel innerhalb von 24&nbsp;Stunden persönlich bei dir – über deinen gewünschten Kontaktweg.</p>' +
          (data.email ? '<p style="margin-top:8px;font-size:14px;">Bestätigung an <b>' + escapeHtml(data.email) + '</b></p>' : '') +
        '</div>';
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    /* Auto-Advance bei Single-Choice (Radio) für schnelleren Flow */
    form.addEventListener('change', function (e) {
      var t = e.target;
      if (t && t.type === 'radio' && t.closest('.fstep') === steps[current]) {
        clearError();
      }
    });

    if (nextBtn) nextBtn.addEventListener('click', goNext);
    if (prevBtn) prevBtn.addEventListener('click', goPrev);
    form.addEventListener('submit', function (e) { e.preventDefault(); goNext(); });
    form.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') { e.preventDefault(); goNext(); }
    });

    render();
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
})();
