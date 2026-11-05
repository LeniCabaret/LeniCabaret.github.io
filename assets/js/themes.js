/* ==========================================================================
   PORTFOLIO DE LÉNI — BTS SIO
   Gestionnaire des 17 thèmes officiels portés de « Superviseur JER »
   Fichier autonome complet, encodage UTF-8, fins de ligne LF.
   IIFE, 'use strict', aucune dépendance, seule globale : window.PortfolioThemes
   ========================================================================== */

(function () {
  'use strict';

  // ------------------------------------------------------------------------
  // 1. Définition des 17 thèmes officiels
  // ------------------------------------------------------------------------
  var THEMES = [
    { id: 'sombre', nom: 'Sombre', type: 'sombre', fond: 'statique' },
    { id: 'clair', nom: 'Clair', type: 'clair', fond: 'statique' },
    { id: 'contraste-eleve', nom: 'Contraste élevé', type: 'sombre', fond: 'statique' },
    { id: 'acrylique', nom: 'Acrylique', type: 'sombre', fond: 'acrylique' },
    { id: 'tons-de-gris', nom: 'Tons de gris', type: 'sombre', fond: 'statique' },
    { id: 'neon-arcade', nom: 'Néon arcade', type: 'sombre', fond: 'grille-neon' },
    { id: 'terminal-retro', nom: 'Terminal rétro', type: 'sombre', fond: 'crt' },
    { id: 'aurore', nom: 'Aurore', type: 'sombre', fond: 'aurore' },
    { id: 'carbone', nom: 'Carbone', type: 'sombre', fond: 'carbone' },
    { id: 'papier', nom: 'Papier', type: 'clair', fond: 'papier' },
    { id: 'synthwave', nom: 'Synthwave', type: 'sombre', fond: 'synthwave' },
    { id: 'bretagne', nom: 'Bretagne', type: 'sombre', fond: 'granit' },
    { id: 'console-de-poche', nom: 'Console de poche', type: 'clair', fond: 'lcd' },
    { id: 'volcan', nom: 'Volcan', type: 'sombre', fond: 'lave' },
    { id: 'abysses', nom: 'Abysses', type: 'sombre', fond: 'abysses' },
    { id: 'halloween', nom: 'Halloween', type: 'sombre', fond: 'halloween' },
    { id: 'noel', nom: 'Noël', type: 'sombre', fond: 'neige' }
  ];

  // Nuancier de référence pour chaque thème (génération des curseurs et pastilles)
  var PALETTES = {
    'sombre': { bg: '#14171B', surface: '#1C2026', accent: '#4FB3C9', accentEnd: '#4FB3C9', text: '#F5F4F1' },
    'clair': { bg: '#F3F2EF', surface: '#FFFFFF', accent: '#0F6E80', accentEnd: '#0F6E80', text: '#14171B' },
    'contraste-eleve': { bg: '#000000', surface: '#0A0A0A', accent: '#FFD400', accentEnd: '#FFD400', text: '#FFFFFF' },
    'acrylique': { bg: '#1E2433', surface: '#262D3F', accent: '#7AA2F7', accentEnd: '#7AA2F7', text: '#EEF2FA' },
    'tons-de-gris': { bg: '#1A1A1A', surface: '#242424', accent: '#D6D6D6', accentEnd: '#D6D6D6', text: '#F2F2F2' },
    'neon-arcade': { bg: '#0D0A14', surface: '#140F1F', accent: '#FF3DAA', accentEnd: '#00E5FF', text: '#F5F0FF' },
    'terminal-retro': { bg: '#030803', surface: '#071207', accent: '#39FF14', accentEnd: '#39FF14', text: '#B8FFB8' },
    'aurore': { bg: '#0B1220', surface: '#111A2C', accent: '#5EEAD4', accentEnd: '#A78BFA', text: '#EAF2FF' },
    'carbone': { bg: '#111214', surface: '#18191C', accent: '#FF4D4D', accentEnd: '#FF8F5C', text: '#F2F2F2' },
    'papier': { bg: '#F4EEE2', surface: '#FBF7EF', accent: '#2F5DA8', accentEnd: '#2F5DA8', text: '#1F2A44' },
    'synthwave': { bg: '#140B24', surface: '#1C1030', accent: '#FF71CE', accentEnd: '#B967FF', text: '#FBF3FF' },
    'bretagne': { bg: '#15171C', surface: '#1C1F26', accent: '#F2C14E', accentEnd: '#FFF4D6', text: '#F4F1EA' },
    'console-de-poche': { bg: '#C4CFA1', surface: '#D6DEB5', accent: '#1E4D1F', accentEnd: '#1E4D1F', text: '#0F2A10' },
    'volcan': { bg: '#140C0A', surface: '#1E1310', accent: '#FF6A2B', accentEnd: '#FFC14D', text: '#FFF1EA' },
    'abysses': { bg: '#050E1A', surface: '#0A1626', accent: '#22E5D0', accentEnd: '#7C5CFF', text: '#E6F6FF' },
    'halloween': { bg: '#120D1A', surface: '#1D1429', accent: '#FF7700', accentEnd: '#7C3AED', text: '#F6F2FA' },
    'noel': { bg: '#0A170E', surface: '#13261A', accent: '#FF4D4D', accentEnd: '#FFD700', text: '#F5FAF6' }
  };

  var THEMES_ANIMES = {
    'sombre': true,
    'clair': true,
    'tons-de-gris': true,
    'acrylique': true,
    'carbone': true,
    'papier': true,
    'bretagne': true,
    'console-de-poche': true,
    'neon-arcade': true,
    'terminal-retro': true,
    'aurore': true,
    'synthwave': true,
    'volcan': true,
    'abysses': true,
    'halloween': true,
    'noel': true
  };

  var CLE_STOCKAGE = 'portfolio-theme';
  var CLE_STOCKAGE_ANIM = 'portfolio-animations';
  var themeActif = 'sombre';
  var animationsAutorisees = true;

  // ------------------------------------------------------------------------
  // 2. Gestion sécurisée du stockage local (toujours dans try/catch)
  // ------------------------------------------------------------------------
  function lireThemeStocke() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(CLE_STOCKAGE);
      }
    } catch (err) {
      console.warn('Accès à localStorage impossible pour le thème :', err);
    }
    return null;
  }

  function enregistrerTheme(id) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(CLE_STOCKAGE, id);
      }
    } catch (err) {
      console.warn('Impossible d\'enregistrer le thème dans localStorage :', err);
    }
  }

  function lireAnimationsStockees() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        var val = window.localStorage.getItem(CLE_STOCKAGE_ANIM);
        if (val !== null) {
          return val === 'true';
        }
      }
    } catch (err) {
      console.warn('Accès à localStorage impossible pour les animations :', err);
    }
    return true; // Activé par défaut
  }

  function enregistrerAnimations(val) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(CLE_STOCKAGE_ANIM, val ? 'true' : 'false');
      }
    } catch (err) {
      console.warn('Impossible d\'enregistrer les animations dans localStorage :', err);
    }
  }

  animationsAutorisees = lireAnimationsStockees();

  // ------------------------------------------------------------------------
  // 3. Génération dynamique des curseurs SVG vectoriels (32×32)
  // ------------------------------------------------------------------------
  function creerCurseurSVG(type, pal, isContrasteEleve) {
    var accent = pal.accent;
    var accentEnd = pal.accentEnd || pal.accent;
    var bg = pal.bg;
    var strokeColor = isContrasteEleve ? '#FFFFFF' : bg;
    var strokeWidth = isContrasteEleve ? 2.5 : 1.75;
    var strokeWidthText = isContrasteEleve ? 2.2 : 1.4;

    var gradDef = '<defs>' +
      '<linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">' +
      '<stop offset="0%" stop-color="' + accent + '"/>' +
      '<stop offset="100%" stop-color="' + accentEnd + '"/>' +
      '</linearGradient>' +
      '</defs>';

    var corps = '';
    if (type === 'fleche') {
      corps = '<path d="M 3.4,3.6 C 3.2,2.4 4.4,1.7 5.4,2.4 L 21.2,14.1 C 22.2,14.9 21.7,16.4 20.5,16.5 L 13.9,17.1 C 13.3,17.2 12.9,17.5 12.6,18 L 9.3,23.9 C 8.7,25 7.1,24.7 6.9,23.5 Z" fill="url(#g)" stroke="' + strokeColor + '" stroke-width="' + strokeWidth + '" stroke-linejoin="round"/>';
      if (!isContrasteEleve) {
        corps += '<path d="M 5.6,5.4 C 5.5,4.9 6,4.6 6.5,4.9 L 12.5,9.4 C 11,9.8 9.5,10.9 8.4,12.4 Z" fill="#FFFFFF" opacity="0.35"/>';
      }
    } else if (type === 'main') {
      corps = '<path d="M 11.6,4.6 A 2.1,2.1 0 0 1 15.8,4.6 L 15.8,11.4 C 18.5,10.6 25.6,11.4 25.6,16.2 L 25.6,21.4 C 25.6,25.8 22.8,28.6 18.8,28.6 L 16,28.6 C 13.2,28.6 11.4,27 10.2,24.8 L 7.4,19.8 C 6.6,18.4 7.6,16.9 9.1,17.2 C 10.2,17.4 11,18.3 11.6,19.2 Z" fill="url(#g)" stroke="' + strokeColor + '" stroke-width="' + strokeWidth + '" stroke-linejoin="round"/>';
      corps += '<path d="M 15.8,11.4 V 15.6 M 20.4,11.6 V 15.8" stroke="' + strokeColor + '" stroke-width="1" stroke-linecap="round" opacity="0.55"/>';
      if (!isContrasteEleve) {
        corps += '<rect x="12.6" y="4.4" width="1.4" height="7" rx="0.7" fill="#FFFFFF" opacity="0.3"/>';
      }
    } else if (type === 'texte') {
      corps = '<path d="M 11,4.5 H 14 C 15,4.5 16,5.2 16,6.2 C 16,5.2 17,4.5 18,4.5 H 21 V 6.7 H 18.6 C 17.7,6.7 17.1,7.3 17.1,8.2 V 23.8 C 17.1,24.7 17.7,25.3 18.6,25.3 H 21 V 27.5 H 18 C 17,27.5 16,26.8 16,25.8 C 16,26.8 15,27.5 14,27.5 H 11 V 25.3 H 13.4 C 14.3,25.3 14.9,24.7 14.9,23.8 V 8.2 C 14.9,7.3 14.3,6.7 13.4,6.7 H 11 Z" fill="url(#g)" stroke="' + strokeColor + '" stroke-width="' + strokeWidthText + '" stroke-linejoin="round"/>';
    }

    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">' + gradDef + corps + '</svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  function actualiserCurseursCSS(themeId) {
    if (typeof document === 'undefined' || !document.documentElement) return;
    var pal = PALETTES[themeId] || PALETTES['sombre'];
    var isContrasteEleve = (themeId === 'contraste-eleve');

    var uriFleche = creerCurseurSVG('fleche', pal, isContrasteEleve);
    var uriMain = creerCurseurSVG('main', pal, isContrasteEleve);
    var uriTexte = creerCurseurSVG('texte', pal, isContrasteEleve);

    var rootStyle = document.documentElement.style;
    rootStyle.setProperty('--cur-fleche', 'url("' + uriFleche + '") 4 3, auto');
    rootStyle.setProperty('--cur-main', 'url("' + uriMain + '") 13 3, pointer');
    rootStyle.setProperty('--cur-texte', 'url("' + uriTexte + '") 16 16, text');
  }

  // ------------------------------------------------------------------------
  // 4. Moteur de rendu et Web Worker OffscreenCanvas
  // ------------------------------------------------------------------------
  var canvasFond = null;
  var ctxFond = null;
  var workerFond = null;
  var modeWorker = false;
  var rAFParallaxe = null;

  var animationId = null;
  var dernierTempsMs = 0;
  var tempsSec = 0;
  var largeurVue = 0;
  var hauteurVue = 0;
  var dpr = 1;
  var estAnime = false;
  var erreursSignalees = {};

  // Suivi de la position de la souris et du défilement pour la parallaxe
  var sourisX = 0;
  var sourisY = 0;
  var defilementY = 0;

  function planifierParallaxeWorker() {
    if (!modeWorker || !workerFond) return;
    if (rAFParallaxe === null && typeof window !== 'undefined' && window.requestAnimationFrame) {
      rAFParallaxe = window.requestAnimationFrame(function () {
        rAFParallaxe = null;
        if (workerFond) {
          workerFond.postMessage({
            type: 'parallaxe',
            sourisX: sourisX,
            sourisY: sourisY,
            defilementY: defilementY
          });
        }
      });
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', function (e) {
      sourisX = e.clientX;
      sourisY = e.clientY;
      planifierParallaxeWorker();
    }, { passive: true });

    window.addEventListener('scroll', function () {
      defilementY = window.scrollY || window.pageYOffset || 0;
      planifierParallaxeWorker();
    }, { passive: true });
  }

  function hexVersRgb(hex) {
    if (!hex) return { r: 79, g: 179, b: 201 };
    var clean = hex.replace('#', '');
    if (clean.length === 3) {
      clean = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
    }
    var num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  // Détection de la préférence d'accessibilité prefers-reduced-motion
  var mediaReducedMotion = (typeof window !== 'undefined' && window.matchMedia)
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

  function aReducedMotion() {
    return mediaReducedMotion ? mediaReducedMotion.matches : false;
  }

  function obtenirCanvas() {
    if (canvasFond) return canvasFond;
    if (typeof document === 'undefined') return null;

    canvasFond = document.getElementById('fond-theme');
    if (!canvasFond && document.body) {
      canvasFond = document.createElement('canvas');
      canvasFond.id = 'fond-theme';
      canvasFond.setAttribute('aria-hidden', 'true');
      document.body.insertBefore(canvasFond, document.body.firstChild);
    }
    return canvasFond;
  }

  function initialiserMoteurFond() {
    obtenirCanvas();
    if (!canvasFond || typeof window === 'undefined') return;

    largeurVue = window.innerWidth;
    hauteurVue = window.innerHeight;
    canvasFond.style.width = largeurVue + 'px';
    canvasFond.style.height = hauteurVue + 'px';

    // Détection du support OffscreenCanvas et Web Worker
    var supporteWorker = (
      typeof window.Worker === 'function' &&
      typeof HTMLCanvasElement !== 'undefined' &&
      typeof HTMLCanvasElement.prototype.transferControlToOffscreen === 'function' &&
      typeof window.OffscreenCanvas === 'function'
    );

    if (supporteWorker) {
      try {
        workerFond = new Worker('assets/js/fond-worker.js');
        workerFond.onerror = function (evt) {
          console.error('Erreur retournée par le Web Worker assets/js/fond-worker.js :', evt.message || evt);
        };

        var offscreen = canvasFond.transferControlToOffscreen();
        modeWorker = true;

        workerFond.postMessage({
          type: 'init',
          canvas: offscreen,
          largeur: largeurVue,
          hauteur: hauteurVue,
          dpr: 1,
          theme: themeActif,
          palette: PALETTES[themeActif] || PALETTES['sombre'],
          animationsAutorisees: animationsAutorisees,
          reducedMotion: aReducedMotion(),
          visible: (typeof document !== 'undefined') ? !document.hidden : true
        }, [offscreen]);

        return;
      } catch (err) {
        console.warn('Initialisation du Web Worker OffscreenCanvas impossible, passage en repli fil principal :', err);
        workerFond = null;
        modeWorker = false;
      }
    }

    // Mode repli sur le fil principal (navigateur sans OffscreenCanvas ou échec)
    initialiserRepliFilPrincipal();
  }

  function initialiserRepliFilPrincipal() {
    if (!canvasFond) return;
    if (!ctxFond && canvasFond.getContext) {
      try {
        ctxFond = canvasFond.getContext('2d');
      } catch (err) {
        console.error('Impossible d\'obtenir le contexte 2D pour le repli fil principal :', err);
        ctxFond = null;
        return;
      }
    }
    redimensionnerCanvasRepli();
  }

  function redimensionnerCanvas() {
    if (typeof window === 'undefined') return;
    largeurVue = window.innerWidth;
    hauteurVue = window.innerHeight;

    if (canvasFond) {
      canvasFond.style.width = largeurVue + 'px';
      canvasFond.style.height = hauteurVue + 'px';
    }

    if (modeWorker && workerFond) {
      workerFond.postMessage({
        type: 'redimensionner',
        largeur: largeurVue,
        hauteur: hauteurVue
      });
    } else if (!modeWorker) {
      redimensionnerCanvasRepli();
    }
  }

  // ------------------------------------------------------------------------
  // 4.1 Réseau supervisé (nœuds, liens, impulsions et parallaxe) — REPLI
  // ------------------------------------------------------------------------
  var noeudsReseau = [];
  var impulsionsReseau = [];
  var tempsProchaineImpulsion = 2.0;
  var canvasMotifsHorsEcran = {};
  var motifPapierCache = null;
  var motifGranitCache = null;

  function reinitialiserNoeuds(w, h) {
    var surface = w * h;
    var cible = Math.min(70, Math.max(40, Math.floor(surface / 22000)));
    noeudsReseau = [];
    for (var i = 0; i < cible; i++) {
      noeudsReseau.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 1.6 + Math.random() * 0.8
      });
    }
    impulsionsReseau = [];
    tempsProchaineImpulsion = tempsSec + 2.0 + Math.random() * 2.0;
  }

  function ajusterPopulationNoeuds(w, h) {
    if (w <= 0 || h <= 0) return;
    if (noeudsReseau.length === 0) {
      reinitialiserNoeuds(w, h);
    } else {
      var surface = w * h;
      var cible = Math.min(70, Math.max(40, Math.floor(surface / 22000)));
      while (noeudsReseau.length < cible) {
        noeudsReseau.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: 1.6 + Math.random() * 0.8
        });
      }
      if (noeudsReseau.length > cible) {
        noeudsReseau.length = cible;
      }
    }
  }

  function dessinerReseauSupervise(ctx, w, h, t) {
    if (!noeudsReseau || noeudsReseau.length === 0) {
      reinitialiserNoeuds(w, h);
    }

    var pal = PALETTES[themeActif] || PALETTES['sombre'];
    var rgb = hexVersRgb(pal.accent);
    var seuilDist = 140;
    var seuilDistSq = seuilDist * seuilDist;

    for (var i = 0; i < noeudsReseau.length; i++) {
      var n = noeudsReseau[i];
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0) { n.x = 0; n.vx = Math.abs(n.vx); }
      else if (n.x > w) { n.x = w; n.vx = -Math.abs(n.vx); }
      if (n.y < 0) { n.y = 0; n.vy = Math.abs(n.vy); }
      else if (n.y > h) { n.y = h; n.vy = -Math.abs(n.vy); }
    }

    ctx.lineWidth = 1;
    var liensActifs = [];

    for (var a = 0; a < noeudsReseau.length; a++) {
      var na = noeudsReseau[a];
      for (var b = a + 1; b < noeudsReseau.length; b++) {
        var nb = noeudsReseau[b];
        var dx = nb.x - na.x;
        var dy = nb.y - na.y;
        var distSq = dx * dx + dy * dy;
        if (distSq < seuilDistSq) {
          var dist = Math.sqrt(distSq);
          var alphaLien = 0.12 * (1 - dist / seuilDist);
          ctx.strokeStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + alphaLien.toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(na.x, na.y);
          ctx.lineTo(nb.x, nb.y);
          ctx.stroke();

          liensActifs.push({ na: na, nb: nb, dist: dist });
        }
      }
    }

    ctx.fillStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.35)';
    for (var k = 0; k < noeudsReseau.length; k++) {
      var nd = noeudsReseau[k];
      ctx.beginPath();
      ctx.arc(nd.x, nd.y, nd.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (t >= tempsProchaineImpulsion && liensActifs.length > 0) {
      tempsProchaineImpulsion = t + 2.0 + Math.random() * 2.0;
      var lienChoisi = liensActifs[Math.floor(Math.random() * liensActifs.length)];
      impulsionsReseau.push({
        na: lienChoisi.na,
        nb: lienChoisi.nb,
        debut: t,
        duree: 0.6 + Math.random() * 0.4
      });
    }

    for (var m = impulsionsReseau.length - 1; m >= 0; m--) {
      var imp = impulsionsReseau[m];
      var p = (t - imp.debut) / imp.duree;
      if (p >= 0 && p <= 1) {
        var ix = imp.na.x + (imp.nb.x - imp.na.x) * p;
        var iy = imp.na.y + (imp.nb.y - imp.na.y) * p;
        var opaciteImp = 0.85 * (1 - Math.abs(p - 0.5) * 0.5);
        ctx.fillStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', ' + opaciteImp.toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(ix, iy, 3.2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p > 1) {
        impulsionsReseau.splice(m, 1);
      }
    }
  }

  function creerCanvasHorsEcranRepli(w, h) {
    if (typeof document !== 'undefined' && document.createElement) {
      var c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      return c;
    }
    return null;
  }

  function obtenirMotifHorsEcran(id, dessinateurOriginal, w, h) {
    var cle = id + '_' + w + 'x' + h;
    if (canvasMotifsHorsEcran[cle]) {
      return canvasMotifsHorsEcran[cle];
    }
    try {
      var off = creerCanvasHorsEcranRepli(w, h);
      if (!off) return null;
      var offCtx = off.getContext('2d');
      dessinateurOriginal(offCtx, w, h, 0);
      canvasMotifsHorsEcran[cle] = off;
      return off;
    } catch (err) {
      console.warn('Erreur lors du pré-rendu hors écran pour le motif « ' + id + ' » sur le fil principal :', err);
      return null;
    }
  }

  function redimensionnerCanvasRepli() {
    obtenirCanvas();
    if (!canvasFond || !ctxFond || typeof window === 'undefined') return;

    dpr = 1;
    largeurVue = window.innerWidth;
    hauteurVue = window.innerHeight;

    canvasFond.width = Math.floor(largeurVue * dpr);
    canvasFond.height = Math.floor(hauteurVue * dpr);
    canvasFond.style.width = largeurVue + 'px';
    canvasFond.style.height = hauteurVue + 'px';

    ctxFond.setTransform(1, 0, 0, 1, 0, 0);
    ctxFond.scale(dpr, dpr);

    ajusterPopulationNoeuds(largeurVue, hauteurVue);
    canvasMotifsHorsEcran = {};

    dessinerImageRepli(tempsSec, true);
  }

  // ------------------------------------------------------------------------
  // 5. Algorithmes de dessin des fonds — REPLI SUR LE FIL PRINCIPAL
  // ------------------------------------------------------------------------
  function dessinerStatiqueUni(ctx, w, h, couleur) {
    ctx.fillStyle = couleur || '#14171B';
    ctx.fillRect(0, 0, w, h);
  }

  function dessinerAurore(ctx, w, h, t) {
    ctx.fillStyle = '#0B1220';
    ctx.fillRect(0, 0, w, h);

    var dy = Math.sin(2 * Math.PI * t / 20.0) * 40;
    var grad = ctx.createLinearGradient(0, dy, w, h + dy);
    grad.addColorStop(0, 'rgba(94, 234, 212, 0.16)');
    grad.addColorStop(1, 'rgba(167, 139, 250, 0.16)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    var voiles = [
      { r: 94, g: 234, b: 212, pX: 11.0, wBase: 90 },
      { r: 167, g: 139, b: 250, pX: 13.0, wBase: 105 },
      { r: 126, g: 231, b: 135, pX: 9.5, wBase: 80 },
      { r: 94, g: 234, b: 212, pX: 12.0, wBase: 95 }
    ];

    for (var i = 0; i < voiles.length; i++) {
      var v = voiles[i];
      var xBase = (w / (voiles.length + 1)) * (i + 1);
      var xOffset = Math.sin(t * (2 * Math.PI / v.pX) + i * 1.3) * 42;
      var cx = xBase + xOffset;
      var wVoile = v.wBase * (0.85 + 0.35 * Math.sin(t * 0.7 + i));
      var opacite = 0.28 + 0.32 * (0.5 + 0.5 * Math.sin(t * (0.9 + i * 0.18) + i * 1.5));
      var hVoile = h * 0.65;
      var yVoile = h * 0.04 + Math.sin(t * 0.4 + i) * 15;

      var gVoile = ctx.createLinearGradient(cx - wVoile / 2, 0, cx + wVoile / 2, 0);
      gVoile.addColorStop(0, 'rgba(' + v.r + ',' + v.g + ',' + v.b + ', 0)');
      gVoile.addColorStop(0.5, 'rgba(' + v.r + ',' + v.g + ',' + v.b + ', ' + opacite + ')');
      gVoile.addColorStop(1, 'rgba(' + v.r + ',' + v.g + ',' + v.b + ', 0)');

      ctx.fillStyle = gVoile;
      ctx.fillRect(cx - wVoile / 2, yVoile, wVoile, hVoile);
    }
  }

  function dessinerGrilleNeon(ctx, w, h, t) {
    ctx.fillStyle = '#0D0A14';
    ctx.fillRect(0, 0, w, h);

    var pulse = 0.85 + 0.15 * (0.5 + 0.5 * Math.sin(2 * Math.PI * t / 4.0 - Math.PI / 2));

    var grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, 'rgba(255, 61, 170, ' + (0.12 * pulse) + ')');
    grad.addColorStop(1, 'rgba(0, 229, 255, ' + (0.12 * pulse) + ')');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(255, 61, 170, ' + (0.05 * pulse) + ')';
    ctx.lineWidth = 1;
    ctx.beginPath();
    var pas = 40;
    for (var x = 0; x < w; x += pas) {
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, h);
    }
    for (var y = 0; y < h; y += pas) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(w, y + 0.5);
    }
    ctx.stroke();

    var rMax = Math.max(w, h) * 0.55;
    var halo = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, rMax);
    halo.addColorStop(0, 'rgba(255, 61, 170, ' + (0.07 * pulse) + ')');
    halo.addColorStop(1, 'rgba(0, 229, 255, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, w, h);
  }

  function dessinerCRT(ctx, w, h, t) {
    ctx.fillStyle = '#030803';
    ctx.fillRect(0, 0, w, h);

    var tCycle = t % 4.7;
    var scintillement = 1.0;
    if (tCycle >= 2.95 && tCycle <= 3.0) scintillement = 0.5;
    else if (tCycle >= 3.43 && tCycle <= 3.47) scintillement = 0.7;

    ctx.fillStyle = 'rgba(57, 255, 20, ' + (0.09 * scintillement) + ')';
    for (var y = 0; y < h; y += 3) {
      ctx.fillRect(0, y, w, 1);
    }

    var yBande = ((t % 6.5) / 6.5) * (h + 150) - 150;
    var gPhosphore = ctx.createLinearGradient(0, yBande, 0, yBande + 150);
    gPhosphore.addColorStop(0, 'rgba(57, 255, 20, 0)');
    gPhosphore.addColorStop(0.85, 'rgba(57, 255, 20, ' + (0.13 * scintillement) + ')');
    gPhosphore.addColorStop(0.975, 'rgba(57, 255, 20, ' + (0.46 * scintillement) + ')');
    gPhosphore.addColorStop(1, 'rgba(57, 255, 20, 0)');
    ctx.fillStyle = gPhosphore;
    ctx.fillRect(0, yBande, w, 150);

    var tPar = t % 7.3;
    if ((tPar >= 1.6 && tPar <= 1.78) || (tPar >= 4.9 && tPar <= 4.98)) {
      var yPar = (tPar < 3 ? 0.32 : 0.74) * h;
      var dx = (Math.sin(t * 45) > 0 ? 5 : -5);
      ctx.fillStyle = 'rgba(184, 255, 184, 0.28)';
      ctx.fillRect(dx, yPar, w, 2);
    }
  }

  function dessinerCarbone(ctx, w, h) {
    ctx.fillStyle = '#111214';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (var y = 0; y < h; y += 4) {
      for (var x = 0; x < w; x += 4) {
        ctx.fillRect(x, y, 2, 2);
        ctx.fillRect(x + 2, y + 2, 2, 2);
      }
    }
  }

  function dessinerPapier(ctx, w, h) {
    ctx.fillStyle = '#F4EEE2';
    ctx.fillRect(0, 0, w, h);

    var grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    grad.addColorStop(1, 'rgba(226, 211, 181, 0.45)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    if (!motifPapierCache && typeof document !== 'undefined') {
      try {
        var off = creerCanvasHorsEcranRepli(96, 96);
        if (off) {
          var offCtx = off.getContext('2d');
          var imgData = offCtx.createImageData(96, 96);
          var seed = 1729;
          for (var i = 0; i < 96 * 96; i++) {
            seed = (seed * 1664525 + 1013904223) >>> 0;
            if ((seed % 100) > 48) {
              var val = (seed >>> 8) % 32;
              var idx = i * 4;
              imgData.data[idx] = 31;
              imgData.data[idx + 1] = 42;
              imgData.data[idx + 2] = 68;
              imgData.data[idx + 3] = val;
            }
          }
          offCtx.putImageData(imgData, 0, 0);
          motifPapierCache = ctx.createPattern(off, 'repeat');
        }
      } catch (err) {
        console.warn('Erreur lors de la création du motif papier sur le fil principal :', err);
        motifPapierCache = null;
      }
    }

    if (motifPapierCache) {
      ctx.fillStyle = motifPapierCache;
      ctx.fillRect(0, 0, w, h);
    }
  }

  function dessinerGranit(ctx, w, h) {
    ctx.fillStyle = '#15171C';
    ctx.fillRect(0, 0, w, h);

    var grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, 'rgba(46, 52, 64, 0.20)');
    grad.addColorStop(1, 'rgba(21, 23, 28, 0.20)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    if (!motifGranitCache && typeof document !== 'undefined') {
      try {
        var off = creerCanvasHorsEcranRepli(96, 96);
        if (off) {
          var offCtx = off.getContext('2d');
          var imgData = offCtx.createImageData(96, 96);
          var seed = 2026;
          for (var i = 0; i < 96 * 96; i++) {
            seed = (seed * 1664525 + 1013904223) >>> 0;
            var mod = seed % 100;
            var idx = i * 4;
            if (mod < 25) {
              imgData.data[idx] = 255;
              imgData.data[idx + 1] = 255;
              imgData.data[idx + 2] = 255;
              imgData.data[idx + 3] = 12;
            } else if (mod > 75) {
              imgData.data[idx] = 0;
              imgData.data[idx + 1] = 0;
              imgData.data[idx + 2] = 0;
              imgData.data[idx + 3] = 15;
            }
          }
          offCtx.putImageData(imgData, 0, 0);
          motifGranitCache = ctx.createPattern(off, 'repeat');
        }
      } catch (err) {
        console.warn('Erreur lors de la création du motif granit sur le fil principal :', err);
        motifGranitCache = null;
      }
    }

    if (motifGranitCache) {
      ctx.fillStyle = motifGranitCache;
      ctx.fillRect(0, 0, w, h);
    }
  }

  function dessinerLCD(ctx, w, h) {
    ctx.fillStyle = '#C4CFA1';
    ctx.fillRect(0, 0, w, h);

    var grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, 'rgba(224, 232, 192, 0.30)');
    grad.addColorStop(1, 'rgba(155, 170, 106, 0.30)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(30, 77, 31, 0.06)';
    for (var y = 0; y < h; y += 3) {
      ctx.fillRect(0, y, w, 1);
    }
  }

  function dessinerLave(ctx, w, h, t) {
    ctx.fillStyle = '#140C0A';
    ctx.fillRect(0, 0, w, h);

    var pulse = 0.85 + 0.15 * (0.5 + 0.5 * Math.sin(2 * Math.PI * t / 4.0 - Math.PI / 2));
    var grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, 'rgba(255, 61, 0, ' + (0.16 * pulse) + ')');
    grad.addColorStop(1, 'rgba(122, 30, 0, ' + (0.16 * pulse) + ')');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    for (var i = 0; i < 16; i++) {
      var taille = 2.0 + (i % 3);
      var duree = 4.2 + (i % 4) * 0.9;
      var debut = (i * 0.72) % duree;
      var prog = ((t + debut) % duree) / duree;
      var y = h - prog * (h * 0.75);
      var xBase = (18 + i * 59) % Math.max(100, w - 30);
      var x = xBase + Math.sin(t * 1.6 + i) * 12;
      var opacite = prog < 0.12 ? (prog / 0.12) : (prog > 0.65 ? (1 - prog) / 0.35 : 0.88);

      ctx.fillStyle = (i % 2 === 0 ? 'rgba(255, 193, 77, ' : 'rgba(255, 106, 43, ') + (opacite * 0.75) + ')';
      ctx.beginPath();
      ctx.arc(x, y, taille / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function dessinerAbysses(ctx, w, h, t) {
    ctx.fillStyle = '#050E1A';
    ctx.fillRect(0, 0, w, h);

    var grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(11, 61, 92, 0.20)');
    grad.addColorStop(1, 'rgba(5, 14, 26, 0.20)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    for (var i = 0; i < 4; i++) {
      var cycle = 15 + i * 2;
      var prog = ((t + i * 3.1) % cycle) / cycle;
      var y = (h * 0.85) - prog * (h * 0.5);
      var x = (w / 5) * (i + 1) + Math.sin(t * 0.6 + i) * 14;
      var scaleX = 1.0 - 0.14 * Math.sin(t * 2.8 + i);
      var alpha = (prog < 0.2 ? prog / 0.2 : (prog > 0.75 ? (1 - prog) / 0.25 : 0.85)) * 0.6;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scaleX, 1);
      ctx.strokeStyle = 'rgba(34, 229, 208, ' + alpha + ')';
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.moveTo(-11, 0);
      ctx.bezierCurveTo(-11, -13, 11, -13, 11, 0);
      ctx.bezierCurveTo(5, -2, -5, -2, -11, 0);
      ctx.fillStyle = 'rgba(34, 229, 208, ' + (alpha * 0.25) + ')';
      ctx.fill();
      ctx.stroke();

      ctx.lineWidth = 0.8;
      for (var tk = -6; tk <= 6; tk += 4) {
        ctx.beginPath();
        ctx.moveTo(tk, 0);
        var tx1 = tk + Math.sin(t * 3.2 + tk) * 3;
        var tx2 = tk - Math.sin(t * 3.2 + tk) * 3;
        ctx.bezierCurveTo(tx1, 7, tx2, 13, tk, 18);
        ctx.stroke();
      }
      ctx.restore();
    }

    for (var b = 0; b < 10; b++) {
      var bDuree = 9.5 + (b % 4) * 2;
      var bProg = ((t + b * 1.4) % bDuree) / bDuree;
      var by = h - bProg * (h + 30);
      var bx = (24 + b * 71) % Math.max(100, w - 40) + Math.sin(t * 1.2 + b) * 8;
      var bRayon = 2.5 + (b % 3);
      var bAlpha = (bProg < 0.1 ? bProg / 0.1 : (bProg > 0.85 ? (1 - bProg) / 0.15 : 0.8)) * 0.35;

      ctx.strokeStyle = 'rgba(34, 229, 208, ' + bAlpha + ')';
      ctx.fillStyle = 'rgba(34, 229, 208, ' + (bAlpha * 0.15) + ')';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(bx, by, bRayon, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  function dessinerHalloween(ctx, w, h, t) {
    ctx.fillStyle = '#120D1A';
    ctx.fillRect(0, 0, w, h);

    var grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, 'rgba(124, 58, 237, 0.14)');
    grad.addColorStop(1, 'rgba(255, 119, 0, 0.14)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    var lx = Math.max(80, w - 90);
    var ly = 75;
    var pulseHalo = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(2 * Math.PI * t / 4.0));
    var gHalo = ctx.createRadialGradient(lx, ly, 18, lx, ly, 75);
    gHalo.addColorStop(0, 'rgba(246, 242, 250, ' + (0.24 * pulseHalo) + ')');
    gHalo.addColorStop(1, 'rgba(246, 242, 250, 0)');
    ctx.fillStyle = gHalo;
    ctx.beginPath();
    ctx.arc(lx, ly, 75, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(246, 242, 250, 0.72)';
    ctx.beginPath();
    ctx.arc(lx, ly, 23, 0, Math.PI * 2);
    ctx.fill();

    for (var cs = 0; cs < 4; cs++) {
      var csDuree = 8 + cs * 1.5;
      var csProg = ((t + cs * 2.3) % csDuree) / csDuree;
      var versGauche = (cs % 2 === 1);
      var csX = versGauche ? (w + 40 - csProg * (w + 80)) : (-40 + csProg * (w + 80));
      var csY = 40 + cs * 35 + Math.sin(t * 1.5 + cs) * 15;
      var wingScaleY = 0.25 + 0.75 * Math.abs(Math.sin(t * 12 + cs * 2));

      ctx.save();
      ctx.translate(csX, csY);
      if (versGauche) ctx.scale(-1, 1);
      ctx.scale(1, wingScaleY);
      ctx.fillStyle = 'rgba(181, 168, 199, 0.45)';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(8, -8, 14, -4);
      ctx.quadraticCurveTo(8, 2, 0, 4);
      ctx.quadraticCurveTo(-8, 2, -14, -4);
      ctx.quadraticCurveTo(-8, -8, 0, 0);
      ctx.fill();
      ctx.restore();
    }

    var solY = h - 25;
    for (var cp = 0; cp < 3; cp++) {
      var cpx = (w / 4) * (cp + 1);
      var cpTaille = cp === 1 ? 22 : 18;
      var flicker = 0.55 + 0.45 * Math.sin(t * 8 + Math.cos(t * 15 + cp * 3));

      var gLueur = ctx.createRadialGradient(cpx, solY, 2, cpx, solY, cpTaille * 2);
      gLueur.addColorStop(0, 'rgba(255, 119, 0, ' + (0.35 * flicker) + ')');
      gLueur.addColorStop(1, 'rgba(255, 119, 0, 0)');
      ctx.fillStyle = gLueur;
      ctx.beginPath();
      ctx.arc(cpx, solY, cpTaille * 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 119, 0, ' + (0.5 + 0.4 * flicker) + ')';
      ctx.beginPath();
      ctx.ellipse(cpx, solY, cpTaille, cpTaille * 0.75, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#120D1A';
      ctx.beginPath();
      ctx.moveTo(cpx - 6, solY - 3);
      ctx.lineTo(cpx - 3, solY - 6);
      ctx.lineTo(cpx - 1, solY - 3);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cpx + 1, solY - 3);
      ctx.lineTo(cpx + 3, solY - 6);
      ctx.lineTo(cpx + 6, solY - 3);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cpx, solY + 3, 5, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }
  }

  function dessinerNeige(ctx, w, h, t) {
    ctx.fillStyle = '#0A170E';
    ctx.fillRect(0, 0, w, h);

    var grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
    grad.addColorStop(1, 'rgba(239, 68, 68, 0.12)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    var nbFlocons = 18;
    for (var i = 0; i < nbFlocons; i++) {
      var taille = 2.0 + (i % 3);
      var duree = 11.0 + (i % 5) * 1.8;
      var begin = (i * 0.65) % duree;
      var prog = ((t + begin) % duree) / duree;
      var y = prog * (h + 30) - 10;
      var xBase = 12 + ((i * 15) % Math.max(100, w - 24));
      var x = xBase + Math.sin(t * 0.75 + i) * 6;
      var opacite = 0.25 + (i % 4) * 0.08;

      ctx.fillStyle = 'rgba(245, 250, 246, ' + opacite + ')';
      ctx.beginPath();
      ctx.arc(x, y, taille / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function dessinerAcrylique(ctx, w, h) {
    ctx.fillStyle = '#1E2433';
    ctx.fillRect(0, 0, w, h);

    var grad = ctx.createLinearGradient(0, 0, 0, 48);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, 48);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(0, 47, w, 1);
  }

  function dessinerSynthwave(ctx, w, h, t) {
    ctx.fillStyle = '#140B24';
    ctx.fillRect(0, 0, w, h);

    var dy = Math.sin(2 * Math.PI * t / 20.0) * 40;
    var grad = ctx.createLinearGradient(0, dy, w, h + dy);
    grad.addColorStop(0, 'rgba(255, 113, 206, 0.16)');
    grad.addColorStop(1, 'rgba(1, 205, 254, 0.16)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    var pulse = 0.5 + 0.5 * Math.sin(t * 0.6);
    var gLigne = ctx.createLinearGradient(0, h * 0.45, w, h * 0.45);
    gLigne.addColorStop(0, 'rgba(255, 113, 206, 0)');
    gLigne.addColorStop(0.5, 'rgba(185, 103, 255, ' + (0.10 * pulse) + ')');
    gLigne.addColorStop(1, 'rgba(1, 205, 254, 0)');
    ctx.fillStyle = gLigne;
    ctx.fillRect(0, h * 0.35, w, h * 0.3);
  }

  var DESSINATEURS = {
    'sombre': function (ctx, w, h, t) {
      dessinerStatiqueUni(ctx, w, h, PALETTES['sombre'].bg);
      dessinerReseauSupervise(ctx, w, h, t);
    },
    'clair': function (ctx, w, h, t) {
      dessinerStatiqueUni(ctx, w, h, PALETTES['clair'].bg);
      dessinerReseauSupervise(ctx, w, h, t);
    },
    'tons-de-gris': function (ctx, w, h, t) {
      dessinerStatiqueUni(ctx, w, h, PALETTES['tons-de-gris'].bg);
      dessinerReseauSupervise(ctx, w, h, t);
    },
    'contraste-eleve': function (ctx, w, h) {
      dessinerStatiqueUni(ctx, w, h, '#000000');
    },
    'acrylique': function (ctx, w, h, t) {
      var off = obtenirMotifHorsEcran('acrylique', dessinerAcrylique, w, h);
      if (off) ctx.drawImage(off, 0, 0);
      else dessinerAcrylique(ctx, w, h);
      dessinerReseauSupervise(ctx, w, h, t);
    },
    'carbone': function (ctx, w, h, t) {
      var off = obtenirMotifHorsEcran('carbone', dessinerCarbone, w, h);
      if (off) ctx.drawImage(off, 0, 0);
      else dessinerCarbone(ctx, w, h);
      dessinerReseauSupervise(ctx, w, h, t);
    },
    'papier': function (ctx, w, h, t) {
      var off = obtenirMotifHorsEcran('papier', dessinerPapier, w, h);
      if (off) ctx.drawImage(off, 0, 0);
      else dessinerPapier(ctx, w, h);
      dessinerReseauSupervise(ctx, w, h, t);
    },
    'bretagne': function (ctx, w, h, t) {
      var off = obtenirMotifHorsEcran('bretagne', dessinerGranit, w, h);
      if (off) ctx.drawImage(off, 0, 0);
      else dessinerGranit(ctx, w, h);
      dessinerReseauSupervise(ctx, w, h, t);
    },
    'console-de-poche': function (ctx, w, h, t) {
      var off = obtenirMotifHorsEcran('console-de-poche', dessinerLCD, w, h);
      if (off) ctx.drawImage(off, 0, 0);
      else dessinerLCD(ctx, w, h);
      dessinerReseauSupervise(ctx, w, h, t);
    },
    'neon-arcade': dessinerGrilleNeon,
    'terminal-retro': dessinerCRT,
    'aurore': dessinerAurore,
    'synthwave': dessinerSynthwave,
    'volcan': dessinerLave,
    'abysses': dessinerAbysses,
    'halloween': dessinerHalloween,
    'noel': dessinerNeige
  };

  // ------------------------------------------------------------------------
  // 6. Boucle d'animation — REPLI SUR LE FIL PRINCIPAL (20 i/s au plus)
  // ------------------------------------------------------------------------
  function dessinerImageRepli(t, forcerImageUnique) {
    if (!ctxFond || largeurVue <= 0 || hauteurVue <= 0) return;

    var paralX = 0;
    var paralY = 0;
    if (!aReducedMotion() && animationsAutorisees && !forcerImageUnique) {
      paralX = (sourisX / Math.max(1, largeurVue) - 0.5) * 14;
      paralY = (sourisY / Math.max(1, hauteurVue) - 0.5) * 14 + (defilementY * 0.04) % 30;
    }

    var dessinateur = DESSINATEURS[themeActif] || DESSINATEURS['sombre'];
    try {
      ctxFond.save();
      if (paralX !== 0 || paralY !== 0) {
        ctxFond.translate(paralX, paralY);
      }
      dessinateur(ctxFond, largeurVue, hauteurVue, t);
      ctxFond.restore();
    } catch (err) {
      if (!erreursSignalees[themeActif]) {
        erreursSignalees[themeActif] = true;
        console.warn('Erreur lors du dessin du fond pour le thème « ' + themeActif + ' » sur le fil principal :', err);
      }
      var pal = PALETTES[themeActif] || PALETTES['sombre'];
      dessinerStatiqueUni(ctxFond, largeurVue, hauteurVue, pal.bg);
      arreterBoucleRepli();
    }
  }

  function boucleAnimationRepli(timestamp) {
    animationId = null;

    if (!estAnime || (typeof document !== 'undefined' && document.hidden) || aReducedMotion() || !animationsAutorisees) {
      return;
    }

    var delta = timestamp - dernierTempsMs;
    // Repli sur le fil principal à 20 i/s au plus (intervalle de 50 ms, tolérance à 48 ms)
    // Le fond continue à tourner pendant le défilement sans pause
    if (delta >= 48) {
      dernierTempsMs = timestamp;
      tempsSec += delta / 1000;
      dessinerImageRepli(tempsSec, false);
    }

    if (estAnime) {
      animationId = requestAnimationFrame(boucleAnimationRepli);
    }
  }

  function demarrerBoucleRepli() {
    arreterBoucleRepli();

    if (aReducedMotion() || !animationsAutorisees || !THEMES_ANIMES[themeActif]) {
      estAnime = false;
      dessinerImageRepli(0, true);
      return;
    }

    estAnime = true;
    dernierTempsMs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    dessinerImageRepli(tempsSec, true);
    animationId = requestAnimationFrame(boucleAnimationRepli);
  }

  function arreterBoucleRepli() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    estAnime = false;
  }

  // ------------------------------------------------------------------------
  // 7. Contrôle du panneau de configuration d'affichage et sélecteurs DOM
  // ------------------------------------------------------------------------
  function changerEtatAnimations(val) {
    animationsAutorisees = !!val;
    enregistrerAnimations(animationsAutorisees);

    var animToggle = (typeof document !== 'undefined') ? document.getElementById('theme-anim-toggle') : null;
    if (animToggle && animToggle.checked !== animationsAutorisees) {
      animToggle.checked = animationsAutorisees;
    }

    if (modeWorker && workerFond) {
      workerFond.postMessage({
        type: 'animations',
        autorisees: animationsAutorisees
      });
    } else {
      if (animationsAutorisees) {
        demarrerBoucleRepli();
      } else {
        arreterBoucleRepli();
        dessinerImageRepli(0, true);
      }
    }
  }

  function initialiserPanneauThemes() {
    if (typeof document === 'undefined') return;

    var toggleBtn = document.getElementById('theme-toggle-btn');
    var popover = document.getElementById('theme-popover');
    var animToggle = document.getElementById('theme-anim-toggle');

    if (animToggle) {
      animToggle.checked = animationsAutorisees;
      animToggle.addEventListener('change', function () {
        changerEtatAnimations(animToggle.checked);
      });
    }

    if (!toggleBtn || !popover) return;

    function ouvrirPopover() {
      popover.hidden = false;
      void popover.offsetWidth;
      popover.classList.add('is-open');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }

    function fermerPopover(remettreFocus) {
      if (!popover.classList.contains('is-open')) return;
      popover.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      setTimeout(function () {
        if (!popover.classList.contains('is-open')) {
          popover.hidden = true;
        }
      }, 200);
      if (remettreFocus !== false && typeof toggleBtn.focus === 'function') {
        toggleBtn.focus();
      }
    }

    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (popover.classList.contains('is-open')) {
        fermerPopover(true);
      } else {
        ouvrirPopover();
      }
    });

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && popover.classList.contains('is-open')) {
        e.preventDefault();
        fermerPopover(true);
      }
    });

    document.addEventListener('click', function (e) {
      if (!popover.classList.contains('is-open')) return;
      if (!popover.contains(e.target) && !toggleBtn.contains(e.target)) {
        fermerPopover(true);
      }
    });
  }

  function actualiserSelecteurs() {
    if (typeof document === 'undefined') return;

    var pickers = document.querySelectorAll('[data-theme-picker]');
    for (var p = 0; p < pickers.length; p++) {
      var picker = pickers[p];
      if (picker.children.length === 0) {
        for (var i = 0; i < THEMES.length; i++) {
          (function (th) {
            var pal = PALETTES[th.id] || PALETTES['sombre'];
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.setAttribute('aria-label', 'Thème ' + th.nom);
            btn.title = th.nom;
            btn.setAttribute('aria-pressed', th.id === themeActif ? 'true' : 'false');
            btn.setAttribute('data-target-theme', th.id);
            btn.style.setProperty('--btn-bg', pal.bg);
            btn.style.setProperty('--btn-accent', pal.accent);

            btn.addEventListener('click', function () {
              appliquerTheme(th.id);
            });

            picker.appendChild(btn);
          })(THEMES[i]);
        }
      } else {
        var boutons = picker.querySelectorAll('button[data-target-theme]');
        for (var b = 0; b < boutons.length; b++) {
          var btnExistant = boutons[b];
          var cible = btnExistant.getAttribute('data-target-theme');
          btnExistant.setAttribute('aria-pressed', cible === themeActif ? 'true' : 'false');
        }
      }
    }

    var nameLabels = document.querySelectorAll('[data-theme-name]');
    var themeObjet = THEMES[0];
    for (var k = 0; k < THEMES.length; k++) {
      if (THEMES[k].id === themeActif) {
        themeObjet = THEMES[k];
        break;
      }
    }
    for (var n = 0; n < nameLabels.length; n++) {
      nameLabels[n].textContent = themeObjet.nom;
    }
  }

  // ------------------------------------------------------------------------
  // 8. Application globale d'un thème
  // ------------------------------------------------------------------------
  function appliquerTheme(id) {
    var themeTrouve = null;
    for (var i = 0; i < THEMES.length; i++) {
      if (THEMES[i].id === id) {
        themeTrouve = THEMES[i];
        break;
      }
    }

    if (!themeTrouve) {
      id = 'sombre';
    }

    themeActif = id;
    enregistrerTheme(id);

    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.dataset.theme = id;
    }

    actualiserCurseursCSS(id);
    actualiserSelecteurs();

    if (modeWorker && workerFond) {
      workerFond.postMessage({
        type: 'theme',
        theme: id,
        palette: PALETTES[id] || PALETTES['sombre']
      });
    } else {
      redimensionnerCanvasRepli();
      demarrerBoucleRepli();
    }
  }

  // ------------------------------------------------------------------------
  // 9. Initialisation hâtive et écouteurs d'événements
  // ------------------------------------------------------------------------
  var stocke = lireThemeStocke();
  if (stocke) {
    for (var j = 0; j < THEMES.length; j++) {
      if (THEMES[j].id === stocke) {
        themeActif = stocke;
        break;
      }
    }
  }

  // Application immédiate sur documentElement pour éviter tout saut de style (FOUC)
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.dataset.theme = themeActif;
    actualiserCurseursCSS(themeActif);
  }

  function surChargementDOM() {
    initialiserMoteurFond();
    actualiserSelecteurs();
    initialiserPanneauThemes();
    if (!modeWorker) {
      demarrerBoucleRepli();
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', surChargementDOM);
    } else {
      surChargementDOM();
    }

    // Mise en pause / reprise lors des changements d'onglet
    document.addEventListener('visibilitychange', function () {
      if (modeWorker && workerFond) {
        workerFond.postMessage({
          type: 'visibilite',
          visible: !document.hidden
        });
      } else {
        if (document.hidden) {
          arreterBoucleRepli();
        } else {
          if (THEMES_ANIMES[themeActif] && !aReducedMotion() && animationsAutorisees) {
            dernierTempsMs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
            demarrerBoucleRepli();
          }
        }
      }
    });
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', redimensionnerCanvas);

    // Écoute des changements de réglage système prefers-reduced-motion
    if (mediaReducedMotion) {
      var gererChangementMotion = function () {
        if (modeWorker && workerFond) {
          workerFond.postMessage({
            type: 'reduced-motion',
            active: aReducedMotion()
          });
        } else {
          if (aReducedMotion()) {
            arreterBoucleRepli();
            dessinerImageRepli(0, true);
          } else {
            demarrerBoucleRepli();
          }
        }
      };

      if (mediaReducedMotion.addEventListener) {
        mediaReducedMotion.addEventListener('change', gererChangementMotion);
      } else if (mediaReducedMotion.addListener) {
        mediaReducedMotion.addListener(gererChangementMotion);
      }
    }
  }

  // ------------------------------------------------------------------------
  // 10. Exposition de l'unique variable globale autorisée
  // ------------------------------------------------------------------------
  if (typeof window !== 'undefined') {
    window.PortfolioThemes = {
      liste: THEMES,
      appliquer: appliquerTheme,
      animationsActives: function () {
        return animationsAutorisees;
      },
      definirAnimations: function (val) {
        changerEtatAnimations(val);
      }
    };
  }

})();
