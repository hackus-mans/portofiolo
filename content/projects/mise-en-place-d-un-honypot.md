---
title: Mise en place d'un honypot
tools:
skills:
status: À documenter
category: Projet
---

# HoneyShield : Conception et déploiement d’un environnement honeypot pour la détection et l’analyse des cyberattaques


## <mark style="background:#ff4d4f">1. Présentation générale du projet</mark>

### 1.1 Présentation de HoneyShield

HoneyShield est un projet de cybersécurité portant sur la conception et le déploiement d’un environnement honeypot destiné à la détection, à l’observation et à l’analyse des cyberattaques. Il s’agit d’une solution de sécurité offensive contrôlée, conçue pour attirer volontairement des attaquants ou des comportements malveillants dans un environnement surveillé, sans exposer directement les systèmes réels de l’organisation.

Le principe de HoneyShield repose sur la mise en place de services volontairement exposés, simulant des machines, des applications ou des ports vulnérables. Ces éléments jouent le rôle de leurres numériques. Lorsqu’un attaquant tente d’interagir avec ces services, ses actions sont enregistrées, analysées et exploitées afin de mieux comprendre ses méthodes, ses outils, ses intentions et les techniques utilisées.

Ce projet ne vise donc pas uniquement à bloquer les attaques, mais surtout à les observer dans un cadre maîtrisé. HoneyShield permet ainsi de transformer une tentative d’intrusion en source d’information utile pour renforcer la posture de sécurité d’un système d’information.

### 1.2 Domaine du projet

Le projet HoneyShield s’inscrit dans le domaine de la cybersécurité, plus précisément dans les axes liés à la détection d’intrusion, à la surveillance réseau, à l’analyse des menaces et à la cyberdéfense proactive.

Dans un contexte où les attaques informatiques deviennent de plus en plus fréquentes, automatisées et sophistiquées, les organisations ne peuvent plus se limiter à des mécanismes classiques de protection tels que les pare-feu, les antivirus ou les systèmes de contrôle d’accès. Ces solutions restent importantes, mais elles doivent être complétées par des outils capables d’identifier les comportements suspects, de collecter des informations sur les attaques et de faciliter la réponse aux incidents.

HoneyShield se positionne donc comme un outil complémentaire aux solutions traditionnelles de sécurité. Il permet d’observer les cybermenaces dans un environnement isolé, de détecter les tentatives d’attaque à un stade précoce et de produire des informations exploitables pour améliorer les mécanismes de défense.

Le projet touche particulièrement les domaines suivants :

- **La sécurité des réseaux informatiques**, à travers la surveillance du trafic et des connexions suspectes.
- **La détection d’intrusion**, grâce à l’identification des comportements anormaux ou malveillants.
- **L’analyse des cyberattaques**, par l’étude des techniques utilisées par les attaquants.
- **La supervision de la sécurité**, à travers la collecte et l’analyse des journaux d’activité.
- **La réponse aux incidents**, en fournissant des informations utiles pour comprendre et traiter une menace.

### 1.3 Environnement cible

### 1.4 Résumé de la solution proposée

## <mark style="background:#ff4d4f">2. Contexte et justification du projet</mark>

### 2.1 Contexte général de la cybersécurité

### 2.2 Menaces actuelles sur les systèmes exposés

### 2.3 Importance de la détection précoce des attaques

### 2.4 Justification du choix d’un honeypot

## <mark style="background:#ff4d4f">3. Problématique</mark>

### 3.1 Problème principal identifié

### 3.2 Questions techniques du projet

### 3.3 Hypothèse de solution proposée

## <mark style="background:#ff4d4f">4. Objectifs du projet</mark>

### 4.1 Objectif général

### 4.2 Objectifs spécifiques

## <mark style="background:#ff4d4f">5. Intérêt du projet</mark>

### 5.1 Intérêt pédagogique

### 5.2 Intérêt technique

### 5.3 Intérêt en cybersécurité

### 5.4 Intérêt pour une organisation

-------------------------------------------------------------------------------

# Partie I : Cadre théorique

## 6. Généralités sur les honeypots

### 6.1 Définition d’un honeypot

### 6.2 Rôle d’un honeypot en cybersécurité

### 6.3 Fonctionnement général d’un honeypot

### 6.4 Types de honeypots

### 6.5 Avantages des honeypots

### 6.6 Limites et risques des honeypots

## 7. Cyberattaques ciblées par HoneyShield

### 7.1 Scan réseau

### 7.2 Attaque par force brute

### 7.3 Connexion SSH suspecte

### 7.4 Exploitation de services exposés

### 7.5 Comportements automatisés ou attaques par bots

---

# Partie II : Conception de la solution HoneyShield

## 8. Présentation de l’architecture HoneyShield

### 8.1 Architecture générale de la solution

### 8.2 Architecture réseau

### 8.3 Description des composants

### 8.4 Flux de fonctionnement de HoneyShield

### 8.5 Schéma de fonctionnement global

## 9. Technologies utilisées

### 9.1 Linux

### 9.2 Cowrie

### 9.3 Dionaea

### 9.4 Wazuh

### 9.5 Wazuh Indexer ou Elasticsearch

### 9.6 Wazuh Dashboard ou Kibana

### 9.7 Nmap

## 10. Sécurisation de l’environnement HoneyShield

### 10.1 Isolation du honeypot

### 10.2 Limitation des accès

### 10.3 Séparation entre environnement réel et environnement de test

### 10.4 Journalisation des activités

### 10.5 Précautions éthiques et légales

---

# Partie III : Mise en œuvre de HoneyShield

## 11. Mise en place de l’infrastructure

### 11.1 Préparation de l’environnement

### 11.2 Installation du serveur Linux

### 11.3 Configuration réseau

### 11.4 Installation et configuration de Cowrie

### 11.5 Installation et configuration de Dionaea

### 11.6 Installation et configuration de Wazuh

### 11.7 Centralisation des logs

### 11.8 Configuration du tableau de bord

### 11.9 Vérification du fonctionnement global

## 12. Collecte et remontée des données

### 12.1 Logs générés par Cowrie

### 12.2 Logs générés par Dionaea

### 12.3 Logs système

### 12.4 Événements remontés dans Wazuh

### 12.5 Organisation des données collectées

---

# Partie IV : Simulation, analyse et résultats

## 13. Simulation contrôlée des attaques

### 13.1 Cadre de test

### 13.2 Scan réseau avec Nmap

### 13.3 Simulation de connexions SSH suspectes

### 13.4 Simulation d’attaque par force brute

### 13.5 Simulation d’exploitation de services

### 13.6 Observation des événements générés

## 14. Analyse des résultats

### 14.1 Analyse des scans détectés

### 14.2 Analyse des adresses IP suspectes

### 14.3 Analyse des identifiants utilisés

### 14.4 Analyse des mots de passe testés

### 14.5 Analyse des commandes exécutées

### 14.6 Analyse des comportements automatisés

### 14.7 Visualisation des attaques dans le tableau de bord

## 15. Résultats obtenus

### 15.1 Types d’attaques détectées

### 15.2 Données collectées

### 15.3 Alertes générées

### 15.4 Apport de HoneyShield dans la détection

### 15.5 Interprétation générale des résultats

---

# Partie V : Bilan du projet

## 16. Difficultés rencontrées

### 16.1 Difficultés techniques

### 16.2 Difficultés liées à la configuration

### 16.3 Difficultés liées à la collecte des logs

### 16.4 Solutions apportées

## 17. Limites du projet

### 17.1 Limites techniques

### 17.2 Limites liées à l’environnement de test

### 17.3 Limites liées aux attaques simulées

## 18. Améliorations possibles

### 18.1 Intégration de l’intelligence artificielle

### 18.2 Corrélation avancée des événements

### 18.3 Géolocalisation des adresses IP

### 18.4 Alertes automatiques

### 18.5 Ajout d’autres honeypots

### 18.6 Intégration avec un SOC ou un SIEM plus avancé

## 19. Compétences mises en avant

### 19.1 Administration Linux

### 19.2 Sécurité réseau

### 19.3 Supervision et analyse des logs

### 19.4 Détection d’intrusion

### 19.5 Analyse des comportements malveillants

### 19.6 Utilisation d’outils de cybersécurité

## 20. Conclusion générale

---

# Annexes

## Annexe 1 : Commandes utilisées

## Annexe 2 : Fichiers de configuration

## Annexe 3 : Captures d’écran

## Annexe 4 : Exemples de logs

## Annexe 5 : Schéma réseau

## Annexe 6 : Références
