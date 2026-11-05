"""Construit le site statique (dist/) à partir de la maquette src/index.dc.html.

Usage : python3 tools/build.py
Les parties interactives (ports de l'alternance, lames des projets) sont rendues
dans chaque état, puis échangées par assets/js/site.js.
"""
import json, re, shutil, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC, DIST = ROOT / 'src' / 'index.dc.html', ROOT / 'dist'
WEB3FORMS_KEY = 'f6a9fa10-e75f-4b66-8e44-1beafd96b822'  # clé publique par conception (Web3Forms)


def render(state=None):
    with tempfile.NamedTemporaryFile(suffix='.json', delete=False) as f:
        out = f.name
    args = ['node', str(ROOT / 'tools' / 'render-dc.mjs'), str(SRC), out]
    if state is not None:
        args.append(json.dumps(state))
    subprocess.run(args, check=True, capture_output=True)
    return json.loads(Path(out).read_text(encoding='utf-8'))


def section(html, sid):
    m = re.search(rf'<section id="{sid}"[\s\S]*?</section>', html)
    if not m:
        sys.exit(f'Section introuvable : {sid}')
    return m.group(0)


base = render()
main, helmet = base['main'], base['helmet']

# Variantes : un état par port de l'alternance, un par lame de projet ouverte (ou aucune).
ports = len(re.findall(r'aria-pressed="(?:true|false)"', section(main, 'alternance')))
ids = re.findall(r"\{ id: '(\w+)'", SRC.read_text(encoding='utf-8'))
variants = {f'alt-{i}': section(render({'port': i})['main'], 'alternance') for i in range(ports)}
variants.update({f'proj-{k}': section(render({'open': k})['main'], 'projets') for k in ids})
variants['proj-none'] = section(render({'open': None})['main'], 'projets')

# Formulaire : vrais champs nommés, envoi Web3Forms, piège à robots.
main = main.replace('<form aria-label="Ouvrir un ticket"',
                    '<form aria-label="Ouvrir un ticket" action="https://api.web3forms.com/submit" method="POST" data-form')
main = main.replace('<input id="k-email" type="email"', '<input id="k-email" name="email" type="email" required autocomplete="email"')
main = main.replace('<textarea id="k-message"', '<textarea id="k-message" name="message" required minlength="10"')
main = re.sub(r'<button type="button"( style="align-self: flex-start[^"]*")>Ouvrir le ticket</button>',
              r'<input type="hidden" name="access_key" value="' + WEB3FORMS_KEY + '">'
              r'<input type="hidden" name="subject" value="Nouveau message depuis le portfolio">'
              r'<input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" style="display:none">'
              r'<button type="submit"\1>Ouvrir le ticket</button><p data-form-status role="status" style="margin:0;min-height:1.5em"></p>', main)
if 'access_key' not in main:
    sys.exit('Bouton du formulaire introuvable')

# Polices locales à la place de Google Fonts.
helmet = re.sub(r'<link rel="stylesheet" href="https://fonts.googleapis.com[^>]*>', '', helmet)
fonts = ("@font-face{font-family:'Geist';src:url(assets/fonts/geist-latin-variable.woff2) format('woff2');font-weight:100 900;font-display:swap}"
         "@font-face{font-family:'Geist Mono';src:url(assets/fonts/geist-mono-latin-variable.woff2) format('woff2');font-weight:100 900;font-display:swap}")
helmet = helmet.replace('<style>', '<style>' + fonts, 1)

templates = ''.join(f'<template id="v-{k}">{v}</template>' for k, v in variants.items())
page = f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Léni Cabaret, technicien support et BTS SIO SISR</title>
<meta name="description" content="Portfolio de Léni Cabaret : technicien support en alternance chez Loste Tradi-France, BTS SIO option SISR à l'AFTEC Rennes, session 2027.">
<meta property="og:title" content="Léni Cabaret, portfolio BTS SIO SISR">
<meta property="og:description" content="Support, réseau et outils utiles : projets, alternance et tableau de synthèse E5.">
<meta property="og:url" content="https://lenicabaret.github.io/">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
{helmet}
<link rel="stylesheet" href="assets/css/site.css">
</head>
<body>
{main}
{templates}
<script src="assets/js/site.js" defer></script>
</body>
</html>
'''
if DIST.exists():
    shutil.rmtree(DIST)
shutil.copytree(ROOT / 'assets', DIST / 'assets')
(DIST / 'index.html').write_text(page, encoding='utf-8')
(DIST / '.nojekyll').write_text('', encoding='utf-8')
print(f'dist/index.html : {len(page)} caractères, {len(variants)} variantes')
