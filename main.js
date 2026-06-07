// Mobile-Menü
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
  }

  // Aktiven Nav-Link markieren
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Beitritts-Formular
  const form = document.getElementById('beitrittForm');
  if (form) {
    const sepaBox = document.getElementById('sepa');
    const sepaFields = document.getElementById('sepaFields');
    sepaBox.addEventListener('change', () => {
      sepaFields.hidden = !sepaBox.checked;
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      const v = (id) => (document.getElementById(id).value || '').trim();
      const art = (document.querySelector('input[name="art"]:checked') || {}).value || '–';

      const lines = [
        'Neuer Beitrittsantrag – Freundeskreis Sommersprossen Rottweil e.V.',
        '',
        'Mitgliedschaftsart: ' + art,
        '',
        '— Persönliche Daten —',
        'Name:         ' + v('vorname') + ' ' + v('nachname'),
        'Straße:       ' + v('strasse'),
        'PLZ / Ort:    ' + v('plz') + ' ' + v('ort'),
        'E-Mail:       ' + v('email'),
        'Telefon:      ' + (v('telefon') || '–'),
        'Geburtsdatum: ' + (v('geburtsdatum') || '–'),
        ''
      ];

      if (sepaBox.checked) {
        lines.push('— SEPA-Lastschrift gewünscht —',
          'IBAN:         ' + (v('iban') || '–'),
          'Kontoinhaber: ' + (v('kontoinhaber') || '(wie oben)'),
          '',
          'Hinweis: Das endgültige SEPA-Mandat wird per Post zur Unterschrift zugesandt.',
          ''
        );
      } else {
        lines.push('SEPA-Lastschrift: nein – Überweisung gewünscht.', '');
      }

      const bem = v('bemerkungen');
      if (bem) lines.push('— Bemerkungen —', bem, '');

      lines.push('— Einwilligung —',
        'Datenschutz akzeptiert: ja',
        'Datum:                  ' + new Date().toLocaleDateString('de-DE')
      );

      const subject = 'Beitrittsantrag Freundeskreis Sommersprossen – ' + v('vorname') + ' ' + v('nachname');
      const body = lines.join('\r\n');
      const mailto = 'mailto:veit.strasser@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

      // Confirmation hint before opening mail client
      const note = document.getElementById('formStatus');
      if (note) {
        note.textContent = 'E-Mail-Programm wird geöffnet. Falls nichts passiert: kopieren Sie die Daten oder nutzen Sie die PDF.';
        note.hidden = false;
      }
      window.location.href = mailto;
    });
  }
});
