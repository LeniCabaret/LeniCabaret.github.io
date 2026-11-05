# Portfolio de Léni Cabaret · Tableau de bord SISR

Portfolio professionnel de Léni Cabaret pour le BTS SIO option SISR (session 2027, AFTEC Rennes) et son poste en alternance chez Loste Tradi-France à Bédée. Publié sur GitHub Pages : [https://lenicabaret.github.io/](https://lenicabaret.github.io/).

Le site adopte une interface de **dashboard de supervision technique** (inspiration Grafana / Zabbix), accessible, sobre et dynamique.

---

## Structure du projet

```text
atelier/
├── src/
│   ├── index.html            # Page d'accueil : dashboard de supervision (métriques, alternance, projets, heatmap E5, Gantt, contact)
│   ├── e5.html               # Tableau de synthèse E5 officiel (22 réalisations, 6 compétences, galerie des captures, visionneuse)
│   ├── mini-si-albatros.html # Fiche projet détaillée Mini-SI Albatros (architecture, AD/GPO, Docker, PRA restic, incidents, retex)
│   └── index.dc.html         # Ancienne maquette « Baie de brassage » (conservée comme archive documentaire)
├── assets/
│   ├── css/
│   │   ├── site.css          # Feuille de styles principale (variables CSS, mise en page, responsive, accessibilité)
│   │   └── themes.css        # Module de thèmes externe (fourni séparément)
│   ├── js/
│   │   ├── site.js           # Interactions : calculs dynamiques d'uptime, animations, visionneuse de captures, formulaire
│   │   └── themes.js         # Sélecteur de thèmes et fond animé (fourni séparément)
│   ├── fonts/                # Polices locales (Geist et Geist Mono en WOFF2)
│   ├── docs/                 # Documents téléchargeables (Tableau E5 .xlsx, rapport Sony Pictures .pdf)
│   └── img/                  # Logos (Loste Tradi-France), favicon et captures d'écran des projets
├── tools/
│   └── build.py              # Script de build statique en Python 3 (standard library)
└── README.md                 # Documentation du projet
```

---

## Règles et principes de conception

- **Source de vérité :** Données rigoureusement issues de la maquette originale et du fichier de synthèse officiel `portfolio-xlsx.txt`.
- **Calculs dynamiques :** L'uptime (âge) est calculé dynamiquement en JavaScript à partir du 20/07/1998 (jamais écrit en dur). Les années de bénévolat sont également calculées depuis 2016.
- **Confidentialité :** Aucun numéro de téléphone sur l'ensemble du site.
- **Accessibilité :**
  - Navigation au clavier complète (`:focus-visible` soigné, lien d'évitement).
  - Balisage sémantique (`<main>`, `<header>`, `<caption>`, `th scope="col"`).
  - Textes alternatifs (`alt`) sur toutes les images.
  - Respect strict des préférences utilisateur (`prefers-reduced-motion: reduce`).
- **Visionneuse d'images :** Basée sur la balise native accessible `<dialog>` avec gestion du clavier (Échap pour fermer, flèches gauche/droite pendant la consultation).
- **Responsive design :** Aucun débordement horizontal testé sur écrans 360 px, 390 px, 768 px et 1280 px.

---

## Compilation et publication locale

Le build nécessite uniquement **Python 3** (sans aucune dépendance externe) :

```bash
python3 tools/build.py
```

Le script réalise automatiquement :
1. Le nettoyage et la recréation de `dist/`.
2. La copie des pages HTML à la racine de `dist/`.
3. La copie du dossier `assets/` (en excluant les métadonnées internes comme `captures.json`).
4. L'injection sécurisée de la clé publique de production Web3Forms (`WEB3FORMS_KEY`).
5. La vérification automatisée de l'absence de numéros de téléphone.
6. Le contrôle d'intégrité de tous les liens et images relatifs référencés dans les pages.
7. La génération du fichier `dist/.nojekyll` pour GitHub Pages.

Une fois le build exécuté, ouvrez `dist/index.html` dans votre navigateur.
