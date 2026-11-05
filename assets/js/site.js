// Interactions du portfolio : échanges de sections, apparition au défilement, formulaire.
(() => {
  document.documentElement.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Remplace une section par une variante pré-rendue et redonne le focus au bouton équivalent.
  function swap(sectionId, variant, selector, index) {
    const tpl = document.getElementById('v-' + variant);
    const current = document.getElementById(sectionId);
    if (!tpl || !current) { console.error('Variante introuvable :', variant); return; }
    const fresh = tpl.content.firstElementChild.cloneNode(true);
    fresh.classList.add('in', 'swapped');
    current.replaceWith(fresh);
    const btn = fresh.querySelectorAll(selector)[index];
    if (btn) btn.focus({ preventScroll: true });
  }

  const projIds = [...document.querySelectorAll('template[id^="v-proj-"]')]
    .map(t => t.id.slice(7)).filter(id => id !== 'none');

  document.addEventListener('click', e => {
    const port = e.target.closest('#alternance button[aria-pressed]');
    if (port) {
      const all = [...document.querySelectorAll('#alternance button[aria-pressed]')];
      const i = all.indexOf(port);
      swap('alternance', 'alt-' + i, 'button[aria-pressed]', i);
      return;
    }
    const blade = e.target.closest('#projets button[aria-expanded]');
    if (blade) {
      const all = [...document.querySelectorAll('#projets button[aria-expanded]')];
      const i = all.indexOf(blade);
      const open = blade.getAttribute('aria-expanded') === 'true';
      swap('projets', 'proj-' + (open ? 'none' : projIds[i]), 'button[aria-expanded]', i);
    }
  });

  // Les appareils situés plus bas s'insèrent dans la baie quand ils arrivent à l'écran.
  const units = [...document.querySelectorAll('[data-rack] > *')];
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    units.forEach((u, i) => { if (i >= 3) { u.classList.add('later'); io.observe(u); } });
  }

  // Formulaire de contact envoyé à Web3Forms sans quitter la page.
  const form = document.querySelector('[data-form]');
  if (form) {
    const status = form.querySelector('[data-form-status]');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      status.textContent = 'Envoi du ticket…';
      try {
        const res = await fetch(form.action, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || res.status);
        status.textContent = 'Ticket ouvert : je vous réponds par email.';
        form.reset();
      } catch (err) {
        console.error('Envoi du formulaire impossible :', err);
        status.textContent = 'Envoi impossible. Écrivez-moi à cabaret.leni@gmail.com.';
      } finally {
        btn.disabled = false;
      }
    });
  }
})();
