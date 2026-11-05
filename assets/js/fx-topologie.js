/* ==========================================================================
   Portfolio de Léni Cabaret — schéma animé du réseau Albatros (page Mini-SI)
   Inséré après le tableau d'architecture. Données tirées du dossier projet :
   VMnet8 192.168.205.0/24, SRV-DC01 .2, SRV-LNX01 .3 (Docker), WKS-01 (DHCP).
   ========================================================================== */
(function () {
  'use strict';

  var table = null;
  document.querySelectorAll('main table').forEach(function (t) {
    if (!table && /SRV-DC01/.test(t.textContent) && /SRV-LNX01/.test(t.textContent)) table = t;
  });
  if (!table) return;
  var ancre = table.closest('.table-wrap, .table-container, [class*="scroll"]') || table;

  var NOEUDS = [
    { id: 'wks', x: 90, y: 210, titre: 'WKS-01', sous: 'poste client · DHCP', type: 'poste' },
    { id: 'dc', x: 330, y: 70, titre: 'SRV-DC01', sous: '192.168.205.2 · AD, DNS, GPO', type: 'serveur' },
    { id: 'squid', x: 340, y: 300, titre: 'Squid', sous: ':3128 · proxy', type: 'service' },
    { id: 'net', x: 90, y: 365, titre: 'Internet', sous: 'via le proxy', type: 'nuage' },
    { id: 'glpi', x: 600, y: 185, titre: 'GLPI + MariaDB', sous: ':8080 · LDAPS vers l\'AD', type: 'service' },
    { id: 'zbx', x: 600, y: 255, titre: 'Zabbix 7', sous: ':8081 · agents', type: 'service' },
    { id: 'graf', x: 600, y: 325, titre: 'Grafana · Loki', sous: ':3000 · logs', type: 'service' },
    { id: 'minio', x: 600, y: 393, titre: 'MinIO', sous: ':9000 · sauvegardes restic', type: 'service' }
  ];
  var LIENS = [
    ['wks', 'dc', 'GPO, authentification'],
    ['wks', 'squid', 'proxy 3128'],
    ['squid', 'net', 'sortie web'],
    ['wks', 'glpi', 'portail 8080'],
    ['glpi', 'dc', 'LDAPS 636'],
    ['zbx', 'dc', 'agent 10050'],
    ['squid', 'graf', 'journal d\'accès'],
    ['glpi', 'minio', 'restic'],
    ['zbx', 'minio', 'restic']
  ];
  var pos = {};
  NOEUDS.forEach(function (n) { pos[n.id] = n; });

  var NS = 'http://www.w3.org/2000/svg';
  function s(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(e);
    return e;
  }

  var figure = document.createElement('figure');
  figure.className = 'fx-topo';
  var svg = s('svg', { viewBox: '0 0 720 430', role: 'img', 'aria-labelledby': 'fx-topo-titre fx-topo-desc' });
  s('title', { id: 'fx-topo-titre' }, svg).textContent = 'Schéma du réseau Albatros';
  s('desc', { id: 'fx-topo-desc' }, svg).textContent =
    'Réseau NAT VMnet8 192.168.205.0/24. Le poste WKS-01 s\'authentifie sur SRV-DC01 et sort sur Internet par le proxy Squid. ' +
    'SRV-LNX01 héberge en conteneurs Squid, GLPI relié à l\'AD en LDAPS, Zabbix, Grafana et Loki, et MinIO qui reçoit les sauvegardes restic.';

  // Hôte Docker : cadre autour des conteneurs
  s('rect', { x: 228, y: 130, width: 484, height: 290, rx: 14, class: 'fx-topo-hote' }, svg);
  s('text', { x: 244, y: 152, class: 'fx-topo-hote-titre' }, svg).textContent = 'SRV-LNX01 · 192.168.205.3 · hôte Docker';

  var groupeLiens = s('g', {}, svg);
  LIENS.forEach(function (l, i) {
    var a = pos[l[0]], b = pos[l[1]];
    var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - 18;
    var d = 'M' + a.x + ',' + a.y + ' Q' + mx + ',' + my + ' ' + b.x + ',' + b.y;
    var chemin = s('path', { d: d, class: 'fx-topo-lien', id: 'fx-topo-l' + i }, groupeLiens);
    s('path', { d: d, class: 'fx-topo-flux', style: 'animation-delay:' + (-i * 0.7) + 's' }, groupeLiens);
    var paquet = s('circle', { r: 3.5, class: 'fx-topo-paquet' }, groupeLiens);
    var anim = s('animateMotion', { dur: (2.6 + (i % 3) * 0.6) + 's', repeatCount: 'indefinite', begin: (i * 0.45) + 's' }, paquet);
    s('mpath', { href: '#fx-topo-l' + i }, anim);
    chemin.appendChild(s('title', {})).textContent = l[2];
  });

  NOEUDS.forEach(function (n) {
    var g = s('g', { class: 'fx-topo-noeud fx-topo-' + n.type, transform: 'translate(' + n.x + ',' + n.y + ')' }, svg);
    s('rect', { x: -90, y: -24, width: 180, height: 48, rx: 9 }, g);
    s('circle', { cx: -76, cy: -10, r: 4, class: 'fx-topo-voyant' }, g);
    s('text', { x: -66, y: -5, class: 'fx-topo-titre' }, g).textContent = n.titre;
    s('text', { x: -82, y: 14, class: 'fx-topo-sous' }, g).textContent = n.sous;
  });

  figure.appendChild(svg);
  var legende = document.createElement('figcaption');
  legende.textContent = 'Flux du mini-SI Albatros (réseau NAT VMnet8, 192.168.205.0/24). Survolez un lien pour voir son rôle.';
  figure.appendChild(legende);
  ancre.parentNode.insertBefore(figure, ancre.nextSibling);

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    svg.querySelectorAll('animateMotion').forEach(function (a) { a.parentNode.remove(); });
  }
})();
