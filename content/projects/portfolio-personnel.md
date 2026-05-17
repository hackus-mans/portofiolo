---
tools:
  - HTML
  - CSS
  - JavaScript
  - GitHub Pages
status: En cours
category: Web / Branding personnel
---

# Portfolio personnel GitHub Pages

Ce projet consiste à construire un portfolio cybersécurité modifiable depuis une interface d'administration.

## Objectif

L'objectif est de disposer d'un site public professionnel pour présenter mes réalisations, mes certifications, mes compétences et mes articles.

## Fonctionnement

- Le site public affiche les contenus publiés.
- L'administration permet de modifier les contenus sans toucher au code.
- GitHub Pages publie automatiquement les modifications.

## Code utilisé

```javascript
fetch('assets/data/realisations.json')
  .then(response => response.json())
  .then(data => console.log(data.items));
```

## Ce que j'ai appris

- Structurer un portfolio technique.
- Organiser les contenus d'un site statique.
- Documenter un projet de manière claire.
