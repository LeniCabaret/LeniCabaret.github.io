/* ==========================================================================
   Portfolio de Léni Cabaret — console interactive « leni@lc-01 »
   Insère, avant la section #contact de l'accueil, un petit terminal où le
   visiteur tape des commandes (help, whoami, projets, e5, contact, theme…).
   Les réponses ne reprennent que le contenu déjà publié sur le site.
   ========================================================================== */
(function () {
  'use strict';

  var contact = document.getElementById('contact');
  if (!contact || !contact.parentNode) return;

  function ageDepuis(annee, mois, jour) {
    var n = new Date(), a = n.getFullYear() - annee;
    if (n.getMonth() < mois || (n.getMonth() === mois && n.getDate() < jour)) a -= 1;
    return a;
  }

  var section = document.createElement('section');
  section.className = 'panel fx-console';
  section.id = 'console';
  section.setAttribute('aria-labelledby', 'fx-console-titre');
  section.innerHTML =
    '<div class="fx-console-barre"><span class="fx-console-points" aria-hidden="true"><i></i><i></i><i></i></span>' +
    '<h2 id="fx-console-titre">Console · leni@lc-01</h2></div>' +
    '<div class="fx-console-sortie" role="log" aria-live="polite" tabindex="0"></div>' +
    '<form class="fx-console-ligne" autocomplete="off">' +
    '<label for="fx-console-champ" class="fx-console-invite">leni@lc-01:~$</label>' +
    '<input id="fx-console-champ" class="fx-console-champ" type="text" spellcheck="false" autocapitalize="off" ' +
    'aria-describedby="fx-console-aide" placeholder="tapez help">' +
    '</form>' +
    '<p id="fx-console-aide" class="fx-console-aide">Essayez : <button type="button" data-cmd="whoami">whoami</button> ' +
    '<button type="button" data-cmd="projets">projets</button> <button type="button" data-cmd="e5">e5</button> ' +
    '<button type="button" data-cmd="theme aurore">theme aurore</button> <button type="button" data-cmd="help">help</button></p>';
  contact.parentNode.insertBefore(section, contact);

  var sortie = section.querySelector('.fx-console-sortie');
  var champ = section.querySelector('.fx-console-champ');
  var historique = [], position = 0;

  function ecrire(texte, classe) {
    var ligne = document.createElement('div');
    if (classe) ligne.className = classe;
    ligne.textContent = texte;
    sortie.appendChild(ligne);
    sortie.scrollTop = sortie.scrollHeight;
  }
  function lien(texte, href) {
    var ligne = document.createElement('div');
    var a = document.createElement('a');
    a.href = href;
    a.textContent = texte;
    ligne.appendChild(a);
    sortie.appendChild(ligne);
    sortie.scrollTop = sortie.scrollHeight;
  }

  var themes = (window.PortfolioThemes && window.PortfolioThemes.liste) || [];
  var commandes = {
    help: function () {
      ['Commandes disponibles :',
        '  whoami          qui je suis',
        '  alternance      mon poste chez Loste Tradi-France',
        '  projets         la liste de mes projets',
        '  e5              le tableau de synthèse E5',
        '  competences     mes compétences par domaine',
        '  contact         m\'écrire',
        '  theme [nom]     changer de thème (theme seul : la liste)',
        '  clear           effacer la console'].forEach(function (l) { ecrire(l); });
    },
    whoami: function () {
      ecrire('Léni Cabaret, ' + ageDepuis(1998, 6, 20) + ' ans, Rennes.');
      ecrire('Technicien support helpdesk en alternance, 2e année de BTS SIO option SISR (AFTEC Rennes, session 2027).');
      ecrire('Bénévole aux Jeux en Réseau des EPN de Bretagne Porte de Loire Communauté depuis 2016.');
    },
    alternance: function () {
      ecrire('Loste Tradi-France, Bédée · technicien support helpdesk depuis septembre 2025.');
      ecrire('Demandes utilisateurs, postes, téléphones, PDA et imprimantes, dépannage sous Windows, relais via GLPI.');
      lien('→ voir la section Alternance', '#alternance');
    },
    projets: function () {
      var lignes = document.querySelectorAll('#projets tbody tr');
      if (!lignes.length) { lien('→ voir la section Projets', '#projets'); return; }
      lignes.forEach(function (tr) {
        var titre = tr.querySelector('strong, .project-title, td:nth-child(2)');
        if (titre) ecrire('  • ' + titre.textContent.trim().split('\n')[0]);
      });
      lien('→ dossier complet du Mini-SI Albatros', 'mini-si-albatros.html');
    },
    e5: function () {
      ecrire('Tableau de synthèse E5 : réalisations en formation et en entreprise, avec les six compétences.');
      lien('→ ouvrir le tableau E5', 'e5.html');
      lien('→ télécharger l\'Excel', 'assets/docs/tableau-synthese-e5-leni-cabaret.xlsx');
    },
    competences: function () {
      var cartes = document.querySelectorAll('#competences .panel, #competences article, #competences [class*="skill"]');
      if (!cartes.length) { lien('→ voir la section Compétences', '#competences'); return; }
      cartes.forEach(function (c) { ecrire('  ' + c.textContent.replace(/\s+/g, ' ').trim()); });
    },
    contact: function () {
      ecrire('cabaret.leni@gmail.com · github.com/LeniCabaret');
      lien('→ aller au formulaire « Contactez-moi »', '#contact');
    },
    theme: function (arg) {
      if (!themes.length) { ecrire('Thèmes indisponibles.', 'fx-console-erreur'); return; }
      if (!arg) { ecrire('Thèmes : ' + themes.map(function (t) { return t.id; }).join(', ')); return; }
      var cible = arg.toLowerCase();
      var th = themes.filter(function (t) { return t.id === cible || t.nom.toLowerCase() === cible; })[0];
      if (!th) { ecrire('Thème inconnu : ' + arg + '. Tapez « theme » pour la liste.', 'fx-console-erreur'); return; }
      window.PortfolioThemes.appliquer(th.id);
      ecrire('Thème « ' + th.nom + ' » appliqué.', 'fx-console-ok');
    },
    clear: function () { sortie.textContent = ''; },
    sudo: function () { ecrire('Permission refusée : cet incident sera signalé… au support.', 'fx-console-erreur'); },
    ls: function () { ecrire('alternance/  benevolat/  projets/  e5.html  mini-si-albatros.html  contact'); }
  };

  function executer(saisie) {
    var brut = saisie.trim();
    ecrire('leni@lc-01:~$ ' + brut, 'fx-console-echo');
    if (!brut) return;
    historique.push(brut);
    position = historique.length;
    var morceaux = brut.split(/\s+/), nom = morceaux[0].toLowerCase(), arg = morceaux.slice(1).join(' ');
    var fn = commandes[nom];
    if (!fn) { ecrire('Commande introuvable : ' + nom + '. Tapez « help ».', 'fx-console-erreur'); return; }
    try { fn(arg); } catch (err) {
      ecrire('Erreur pendant « ' + nom + ' ».', 'fx-console-erreur');
      console.error('Console : commande « ' + nom + ' » en échec :', err);
    }
  }

  section.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    executer(champ.value);
    champ.value = '';
  });
  champ.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp' && historique.length) { e.preventDefault(); position = Math.max(0, position - 1); champ.value = historique[position]; }
    else if (e.key === 'ArrowDown' && historique.length) { e.preventDefault(); position = Math.min(historique.length, position + 1); champ.value = historique[position] || ''; }
    else if (e.key === 'Tab' && champ.value) {
      var m = Object.keys(commandes).filter(function (k) { return k.indexOf(champ.value.toLowerCase()) === 0; });
      if (m.length === 1) { e.preventDefault(); champ.value = m[0] + ' '; }
    }
  });
  section.querySelectorAll('[data-cmd]').forEach(function (b) {
    b.addEventListener('click', function () { executer(b.getAttribute('data-cmd')); champ.focus(); });
  });

  ecrire('LC-01 · console de démonstration. Tapez « help » pour la liste des commandes.', 'fx-console-ok');
})();
