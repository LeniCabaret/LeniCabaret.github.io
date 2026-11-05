#!/usr/bin/env python3
"""Construit le site statique (dist/) du portfolio de Léni Cabaret.

Usage : python3 tools/build.py
- Vide puis recrée dist/
- Copie src/*.html à la racine de dist/ et assets/ (sauf captures.json)
- Injecte la clé publique Web3Forms
- Vérifie l'absence de numéros de téléphone (règle stricte)
- Vérifie l'existence de toutes les ressources relatives référencées (src/href)
- Crée dist/.nojekyll pour GitHub Pages
"""

import os
import re
import shutil
import sys
import urllib.parse
from pathlib import Path

# Console Windows en cp1252 : forcer l'UTF-8 pour les caractères du résumé.
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

WEB3FORMS_KEY = 'f6a9fa10-e75f-4b66-8e44-1beafd96b822'

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / 'src'
ASSETS_DIR = ROOT / 'assets'
DIST_DIR = ROOT / 'dist'


def main():
    print("=== Construction du portfolio de Léni Cabaret (dist/) ===")

    # 1. Vérification des répertoires sources
    if not SRC_DIR.exists():
        sys.exit(f"ERREUR : Le répertoire source {SRC_DIR} n'existe pas.")
    if not ASSETS_DIR.exists():
        sys.exit(f"ERREUR : Le répertoire assets {ASSETS_DIR} n'existe pas.")

    # 2. Vider puis recréer dist/
    if DIST_DIR.exists():
        shutil.rmtree(DIST_DIR)
    DIST_DIR.mkdir(parents=True, exist_ok=True)
    print("✓ Répertoire dist/ initialisé.")

    # 3. Copie des pages HTML (src/*.html -> dist/)
    html_src_files = list(SRC_DIR.glob('*.html'))
    # Ignorer l'ancienne maquette index.dc.html
    html_src_files = [f for f in html_src_files if not f.name.endswith('.dc.html')]

    if not html_src_files:
        sys.exit("ERREUR : Aucun fichier HTML valide trouvé dans src/.")

    for f in html_src_files:
        shutil.copy2(f, DIST_DIR / f.name)
    print(f"✓ {len(html_src_files)} page(s) HTML copiée(s) dans dist/ : {[f.name for f in html_src_files]}")

    # 4. Copie du dossier assets/ (sauf assets/img/projets/mini-si/captures.json)
    def ignore_assets(folder, names):
        p = Path(folder).resolve()
        target_p = (ASSETS_DIR / 'img' / 'projets' / 'mini-si').resolve()
        if p == target_p:
            return ['captures.json']
        return []

    shutil.copytree(ASSETS_DIR, DIST_DIR / 'assets', ignore=ignore_assets)
    print("✓ Dossier assets/ copié (hors captures.json).")

    # 5. Remplacement de __WEB3FORMS_KEY__
    key_replaced_count = 0
    for html_file in DIST_DIR.glob('*.html'):
        content = html_file.read_text(encoding='utf-8')
        if '__WEB3FORMS_KEY__' in content:
            content = content.replace('__WEB3FORMS_KEY__', WEB3FORMS_KEY)
            html_file.write_text(content, encoding='utf-8')
            key_replaced_count += 1
    print(f"✓ Clé Web3Forms injectée dans {key_replaced_count} fichier(s).")

    # 6. Vérification de l'absence de numéro de téléphone
    # Regex stricte : 0[1-9]( ?[0-9]{2}){4}
    phone_regex = re.compile(r'0[1-9](?: ?[0-9]{2}){4}')
    phone_errors = []
    for html_file in DIST_DIR.glob('*.html'):
        content = html_file.read_text(encoding='utf-8')
        matches = phone_regex.findall(content)
        if matches:
            phone_errors.append(f"{html_file.name}: {matches}")

    if phone_errors:
        sys.exit(f"ERREUR : Numéro de téléphone détecté dans les pages générées :\n" + "\n".join(phone_errors))
    print("✓ Vérification de confidentialité : aucun numéro de téléphone détecté.")

    # 7. Vérification que chaque fichier référencé par src="..." ou href="..." relatif existe dans dist/
    ref_regex = re.compile(r'(?:src|href)=["\']([^"\']+)["\']', re.IGNORECASE)
    missing_files = []
    checked_refs = 0

    for html_file in DIST_DIR.glob('*.html'):
        content = html_file.read_text(encoding='utf-8')
        for match in ref_regex.finditer(content):
            ref = match.group(1).strip()
            # Ignorer ancres et protocoles externes
            if not ref or ref.startswith('#'):
                continue
            if ref.startswith(('http://', 'https://', 'mailto:', 'tel:', 'javascript:', 'data:')):
                continue

            # Nettoyer query strings et ancres dans les chemins relatifs
            clean_ref = urllib.parse.unquote(ref.split('#')[0].split('?')[0])
            if not clean_ref:
                continue

            target_file = (html_file.parent / clean_ref).resolve()
            checked_refs += 1
            if not target_file.exists():
                missing_files.append(f"Dans {html_file.name} : '{ref}' introuvable -> {target_file}")

    if missing_files:
        sys.exit(f"ERREUR : Fichiers référencés relatifs manquants dans dist/ :\n" + "\n".join(missing_files))
    print(f"✓ Intégrité des liens : {checked_refs} référence(s) relative(s) vérifiée(s), 0 manquante.")

    # 8. Création de dist/.nojekyll
    (DIST_DIR / '.nojekyll').write_text('', encoding='utf-8')
    print("✓ Fichier dist/.nojekyll généré.")

    print("\n=== Résumé du build ===")
    print(f"- Destination : {DIST_DIR}")
    print(f"- Pages : {len(html_src_files)}")
    print("- Statut : Succès complet, prêt pour GitHub Pages.")


if __name__ == '__main__':
    main()
