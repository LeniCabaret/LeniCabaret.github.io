# Portfolio de Léni Cabaret

Portfolio BTS SIO SISR, publié sur https://lenicabaret.github.io/.

- `src/index.dc.html` : la page (maquette « Baie de brassage »), contenu compris.
- `tools/build.py` : construit `dist/` (rendu statique, variantes interactives, formulaire Web3Forms).
- `assets/` : styles, script, polices, images et documents.
- Publication : à chaque push sur `main`, GitHub Actions construit et déploie le site.

Construire en local : `python3 tools/build.py`, puis ouvrir `dist/index.html`.
