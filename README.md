# stockaarud.github.io

Le site de présentation de [Stockaarud](https://github.com/Stockaarud/stockaarud) : la page d'accueil avec le film, et le guide d'installation.

- `index.html` : l'accueil
- `installer.html` : une redirection vers le volet Installation de `guide.html`
- `guide.html` : le guide, en trois volets (installation, équipe, responsable stock)
- `flyer/fiche-equipe.html` : la fiche équipe d'une page
- `docs/` : les PDF (guide utilisateur, guide d'installation, fiche équipe), exportés de ces trois pages, et le logo
- `documents.html` : tous les documents à télécharger (flyers, affiche, guide PDF, vidéos, logo dans `docs/`)
- `site.css`, `tokens.css`, `base.css` : la mise en page
- `img/` : captures de la vraie appli, avec des données fictives
- `video/` : le film de présentation

L'appli elle-même reste à l'adresse https://stockaarud.github.io/stockaarud/

## Flyer

`flyer/flyer.html` est la source du flyer, `flyer/affiche-qr.html` celle de l'affiche QR code pour le local. Les PDF (A5, A4 à deux flyers) et le PNG du même dossier sont des exports : il faut les regénérer après chaque modification de `flyer.html`.
