/* ==========================================================================
   Portfolio de Léni Cabaret — effets « LC-01 »
   1. Séquence de démarrage (une fois par session)
   2. Barre de progression du défilement
   3. Titres de section « décryptés » à l'apparition
   4. Palette de commandes (Ctrl+K ou /) : sections, pages, thèmes, actions
   5. Copie de l'adresse e-mail avec notification
   Autonome, sans dépendance. Tout mouvement est coupé en prefers-reduced-motion.
   ========================================================================== */
(function () {
  'use strict';

  var reduit = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EMAIL = 'cabaret.leni@gmail.com';

  function lireSession(cle) {
    try { return window.sessionStorage.getItem(cle); } catch (e) { return null; }
  }
  function ecrireSession(cle, val) {
    try { window.sessionStorage.setItem(cle, val); } catch (e) { /* stockage refusé : sans mémoire */ }
  }
  function el(tag, cls, texte) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (texte) n.textContent = texte;
    return n;
  }

  /* ---------- 1. Séquence de démarrage ---------- */
  function demarrage() {
    if (reduit || lireSession('lc01-boot')) return;
    ecrireSession('lc01-boot', '1');
    var nomTheme = (document.documentElement.dataset.theme || 'sombre').replace(/-/g, ' ');
    var lignes = [
      'BIOS LC-01 · contrôle mémoire ............ OK',
      'Montage de /alternance /projets /e5 ...... OK',
      'Chargement du thème « ' + nomTheme + ' » ...... OK',
      'Démarrage de la supervision .............. OK',
      'Bienvenue.'
    ];
    var voile = el('div', 'fx-boot');
    voile.setAttribute('aria-hidden', 'true');
    var pre = el('pre', 'fx-boot-texte');
    voile.appendChild(pre);
    document.body.appendChild(voile);

    var fini = false;
    function terminer() {
      if (fini) return;
      fini = true;
      voile.classList.add('fx-boot-fin');
      window.setTimeout(function () { voile.remove(); }, 450);
      document.removeEventListener('keydown', terminer, true);
    }
    voile.addEventListener('click', terminer);
    document.addEventListener('keydown', terminer, true);

    var i = 0;
    (function suivante() {
      if (fini) return;
      if (i >= lignes.length) { window.setTimeout(terminer, 350); return; }
      pre.textContent += (i ? '\n' : '') + '> ' + lignes[i];
      i += 1;
      window.setTimeout(suivante, 230);
    })();
  }

  /* ---------- 2. Barre de progression du défilement ---------- */
  function progression() {
    var barre = el('div', 'fx-progression');
    barre.setAttribute('aria-hidden', 'true');
    document.body.appendChild(barre);
    var attente = false;
    function maj() {
      attente = false;
      var h = document.documentElement.scrollHeight - window.innerHeight;
      barre.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ')';
    }
    window.addEventListener('scroll', function () {
      if (!attente) { attente = true; window.requestAnimationFrame(maj); }
    }, { passive: true });
    maj();
  }

  /* ---------- 3. Titres décryptés ---------- */
  function decryptage() {
    if (reduit || !('IntersectionObserver' in window)) return;
    var signes = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/<>_';
    var obs = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        var t = e.target;
        if (t.children.length) return; // titres simples uniquement : ne pas casser le balisage
        var final = t.textContent;
        t.setAttribute('aria-label', final);
        var debut = performance.now(), duree = 550;
        (function pas(now) {
          var p = Math.min(1, (now - debut) / duree), n = Math.floor(final.length * p), s = '';
          for (var k = 0; k < final.length; k += 1) {
            s += (k < n || /\s/.test(final[k])) ? final[k] : signes[Math.floor(Math.random() * signes.length)];
          }
          t.textContent = s;
          if (p < 1) window.requestAnimationFrame(pas); else { t.textContent = final; t.removeAttribute('aria-label'); }
        })(debut);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('main h2').forEach(function (t) { obs.observe(t); });
  }

  /* ---------- 5. Notification ---------- */
  var toastMinuterie = null;
  function toast(message) {
    var t = document.querySelector('.fx-toast');
    if (!t) {
      t = el('div', 'fx-toast');
      t.setAttribute('role', 'status');
      t.setAttribute('aria-live', 'polite');
      document.body.appendChild(t);
    }
    t.textContent = message;
    t.classList.add('fx-visible');
    window.clearTimeout(toastMinuterie);
    toastMinuterie = window.setTimeout(function () { t.classList.remove('fx-visible'); }, 2600);
  }
  function copierEmail() {
    if (!navigator.clipboard) { window.location.href = 'mailto:' + EMAIL; return; }
    navigator.clipboard.writeText(EMAIL).then(function () {
      toast('Adresse copiée : ' + EMAIL);
    }, function (err) {
      console.warn('Copie de l\'adresse impossible :', err);
      window.location.href = 'mailto:' + EMAIL;
    });
  }

  /* ---------- 4. Palette de commandes ---------- */
  function palette() {
    var commandes = [], vus = {};
    function ajouter(groupe, libelle, action) {
      var cle = groupe + '|' + libelle;
      if (vus[cle]) return;
      vus[cle] = true;
      commandes.push({ groupe: groupe, libelle: libelle, action: action });
    }
    document.querySelectorAll('.topbar-nav a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      ajouter(href.charAt(0) === '#' ? 'Aller à' : 'Ouvrir', a.textContent.trim(), function () { window.location.href = href; });
    });
    ajouter('Ouvrir', 'Accueil', function () { window.location.href = 'index.html'; });
    ajouter('Ouvrir', 'Tableau de synthèse E5', function () { window.location.href = 'e5.html'; });
    ajouter('Ouvrir', 'Dossier Mini-SI Albatros', function () { window.location.href = 'mini-si-albatros.html'; });
    ajouter('Action', 'Télécharger le tableau E5 (Excel)', function () { window.location.href = 'assets/docs/tableau-synthese-e5-leni-cabaret.xlsx'; });
    ajouter('Action', 'Copier mon adresse e-mail', copierEmail);
    ajouter('Action', 'Voir mon GitHub', function () { window.open('https://github.com/LeniCabaret', '_blank', 'noopener'); });
    if (window.PortfolioThemes && window.PortfolioThemes.liste) {
      window.PortfolioThemes.liste.forEach(function (th) {
        ajouter('Thème', th.nom, function () { window.PortfolioThemes.appliquer(th.id); toast('Thème « ' + th.nom + ' »'); });
      });
    }

    var dlg = el('dialog', 'fx-palette');
    dlg.setAttribute('aria-label', 'Palette de commandes');
    var champ = el('input', 'fx-palette-champ');
    champ.type = 'search';
    champ.placeholder = 'Rechercher une section, une page, un thème…';
    champ.setAttribute('aria-label', 'Rechercher une commande');
    champ.setAttribute('aria-controls', 'fx-palette-liste');
    champ.setAttribute('autocomplete', 'off');
    var liste = el('ul', 'fx-palette-liste');
    liste.id = 'fx-palette-liste';
    liste.setAttribute('role', 'listbox');
    dlg.appendChild(champ);
    dlg.appendChild(liste);
    dlg.appendChild(el('p', 'fx-palette-aide', '↑ ↓ pour choisir · Entrée pour valider · Échap pour fermer'));
    document.body.appendChild(dlg);

    var filtrees = [], actif = 0, retourFocus = null;
    function normaliser(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
    function rendre() {
      var q = normaliser(champ.value.trim());
      filtrees = commandes.filter(function (c) { return !q || normaliser(c.groupe + ' ' + c.libelle).indexOf(q) !== -1; });
      actif = Math.min(actif, Math.max(0, filtrees.length - 1));
      liste.textContent = '';
      if (!filtrees.length) { liste.appendChild(el('li', 'fx-palette-vide', 'Aucun résultat')); return; }
      filtrees.forEach(function (c, i) {
        var li = el('li', 'fx-palette-item' + (i === actif ? ' fx-actif' : ''));
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', i === actif ? 'true' : 'false');
        li.appendChild(el('span', 'fx-palette-groupe', c.groupe));
        li.appendChild(el('span', '', c.libelle));
        li.addEventListener('click', function () { executer(i); });
        li.addEventListener('mousemove', function () { if (actif !== i) { actif = i; rendre(); } });
        liste.appendChild(li);
      });
      var a = liste.querySelector('.fx-actif');
      if (a) a.scrollIntoView({ block: 'nearest' });
    }
    function executer(i) {
      var c = filtrees[i];
      if (!c) return;
      dlg.close();
      try { c.action(); } catch (err) { console.error('Commande « ' + c.libelle + ' » en échec :', err); }
    }
    function ouvrir() {
      if (dlg.open) return;
      retourFocus = document.activeElement;
      champ.value = '';
      actif = 0;
      rendre();
      dlg.showModal();
      champ.focus();
    }
    champ.addEventListener('input', function () { actif = 0; rendre(); });
    champ.addEventListener('keydown', function (e) {
      var n = Math.max(1, filtrees.length);
      if (e.key === 'ArrowDown') { e.preventDefault(); actif = (actif + 1) % n; rendre(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); actif = (actif - 1 + n) % n; rendre(); }
      else if (e.key === 'Enter') { e.preventDefault(); executer(actif); }
    });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () { if (retourFocus && retourFocus.focus) retourFocus.focus(); });

    document.addEventListener('keydown', function (e) {
      var c = e.target, saisie = c && (c.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(c.tagName));
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); ouvrir(); }
      else if (e.key === '/' && !saisie && !dlg.open) { e.preventDefault(); ouvrir(); }
    });

    var nav = document.querySelector('.topbar-nav');
    if (nav) {
      var bouton = el('button', 'fx-palette-bouton');
      bouton.type = 'button';
      bouton.setAttribute('aria-label', 'Ouvrir la palette de commandes (Ctrl+K)');
      bouton.innerHTML = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><span>Rechercher</span><kbd>Ctrl K</kbd>';
      bouton.addEventListener('click', ouvrir);
      nav.appendChild(bouton);
    }
  }

  /* ---------- Liens e-mail : copie de l'adresse ---------- */
  function emails() {
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (e.ctrlKey || e.metaKey || e.shiftKey) return;
        e.preventDefault();
        copierEmail();
      });
      a.title = 'Cliquer pour copier l\'adresse';
    });
  }

  function init() {
    try { demarrage(); } catch (e) { console.error('Séquence de démarrage :', e); }
    try { progression(); } catch (e) { console.error('Barre de progression :', e); }
    try { decryptage(); } catch (e) { console.error('Titres décryptés :', e); }
    try { palette(); } catch (e) { console.error('Palette de commandes :', e); }
    try { emails(); } catch (e) { console.error('Liens e-mail :', e); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
