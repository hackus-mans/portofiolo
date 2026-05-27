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

L’environnement cible du projet HoneyShield est un réseau informatique dans lequel des services exposés peuvent être surveillés afin d’identifier les tentatives d’intrusion. Il peut s’agir d’un environnement de laboratoire, d’un réseau d’entreprise, d’un réseau universitaire ou d’une infrastructure de test dédiée à la cybersécurité.

Dans le cadre de ce projet, l’environnement honeypot sera conçu de manière isolée afin d’éviter tout risque pour les systèmes réels. Cette séparation est essentielle, car un honeypot attire volontairement des activités suspectes ou malveillantes. Il doit donc être contrôlé, surveillé et limité dans ses interactions avec le reste du réseau.

L’environnement cible peut comprendre :

- **Une machine honeypot**, destinée à simuler des services vulnérables.
- **Un réseau de test isolé**, permettant d’éviter la propagation d’une attaque vers des systèmes réels.
- **Des services exposés**, tels que SSH, FTP, HTTP ou d’autres services fréquemment ciblés.
- **Un système de collecte des logs**, permettant d’enregistrer les connexions, les commandes, les adresses IP et les activités suspectes.
- **Un poste d’analyse**, utilisé pour consulter les données collectées et interpréter les attaques observées.

Cette architecture permettra de créer un cadre sécurisé dans lequel les cyberattaques pourront être simulées, capturées et étudiées sans compromettre l’intégrité du système d’information principal.

### 1.4 Résumé de la solution proposée

La solution HoneyShield consiste à mettre en place un environnement honeypot capable d’attirer les attaquants, d’enregistrer leurs actions et de fournir des informations utiles pour l’analyse de la menace. Le système sera configuré de manière à simuler des services accessibles depuis un réseau, tout en restant isolé des ressources critiques.

Lorsqu’un attaquant tentera de se connecter au honeypot ou d’exploiter un service exposé, HoneyShield collectera automatiquement les informations liées à cette activité. Ces informations pourront inclure l’adresse IP de l’attaquant, la date et l’heure de la tentative, le service ciblé, les identifiants utilisés, les commandes exécutées ou encore les fichiers éventuellement déposés.

Les données collectées seront ensuite analysées afin d’identifier les types d’attaques, les comportements récurrents, les techniques employées et les éventuelles vulnérabilités exploitées. Cette analyse permettra de produire une meilleure compréhension des menaces et de proposer des mesures de sécurité adaptées.

En résumé, HoneyShield propose une approche proactive de la cybersécurité. Au lieu d’attendre qu’une attaque touche directement un système critique, le projet met en place un environnement contrôlé destiné à détecter et comprendre les attaques avant qu’elles ne causent des dommages réels.

Cette solution présente donc un double intérêt : elle sert à la fois d’outil de détection et de plateforme d’apprentissage pour mieux comprendre les cyberattaques modernes

## <mark style="background:#ff4d4f">2. Contexte et justification du projet</mark>

### 2.1 Contexte général de la cybersécurité

Le développement rapide des technologies numériques a profondément transformé le fonctionnement des organisations. Aujourd’hui, les entreprises, les administrations, les établissements d’enseignement, les banques, les hôpitaux et de nombreuses autres structures dépendent fortement des systèmes informatiques pour gérer leurs activités quotidiennes.

Les données, les applications, les serveurs, les réseaux et les services en ligne sont devenus des ressources stratégiques. Ils permettent de communiquer, de stocker des informations, de fournir des services, de gérer les utilisateurs et de soutenir les processus métier. Cette dépendance au numérique rend les systèmes d’information indispensables, mais elle les expose également à de nombreux risques.

Dans ce contexte, la cybersécurité occupe une place essentielle. Elle vise à protéger les infrastructures informatiques contre les accès non autorisés, les pertes de données, les interruptions de service, les intrusions et les différentes formes d’attaques informatiques. Elle ne concerne plus uniquement les grandes entreprises, mais toutes les organisations qui utilisent des outils numériques.

Cependant, malgré les efforts de protection mis en place, les systèmes informatiques restent exposés à des menaces constantes. Les attaquants cherchent en permanence à identifier des failles, à exploiter des erreurs de configuration ou à profiter de mots de passe faibles pour accéder aux ressources sensibles.

La cybersécurité ne peut donc plus être limitée à une simple logique de protection passive. Elle doit également intégrer des mécanismes de surveillance, de détection et d’analyse afin de mieux comprendre les menaces et de réagir rapidement lorsqu’un comportement suspect est observé.

### 2.2 Menaces actuelles sur les systèmes exposés

Les systèmes exposés sur un réseau ou sur Internet sont particulièrement ciblés par les cyberattaques. Lorsqu’un serveur, une application ou un service est accessible à distance, il devient automatiquement une cible potentielle pour des attaquants humains ou des programmes automatisés.

Ces menaces peuvent prendre plusieurs formes. Les attaquants peuvent effectuer des scans de ports afin d’identifier les services actifs sur une machine. Ils peuvent ensuite tenter de découvrir les versions des logiciels utilisés, rechercher des vulnérabilités connues ou tester des identifiants faibles pour obtenir un accès non autorisé.

Parmi les attaques les plus fréquentes contre les systèmes exposés, on retrouve les tentatives de connexion par force brute, les attaques contre les services SSH, FTP, HTTP ou les interfaces d’administration, l’exploitation de failles logicielles, les injections malveillantes, les dépôts de fichiers suspects ou encore les tentatives d’élévation de privilèges.

Ces attaques ne sont pas toujours visibles immédiatement. Certaines tentatives peuvent sembler isolées ou sans impact direct, alors qu’elles constituent en réalité les premières étapes d’une attaque plus sérieuse. Un simple scan de ports peut précéder une tentative d’exploitation. Une tentative de connexion échouée peut annoncer une attaque par dictionnaire. Une activité inhabituelle dans les journaux système peut révéler une reconnaissance en cours.

Le danger est donc que certaines menaces passent inaperçues lorsqu’elles ne sont pas correctement surveillées. Un système exposé sans mécanisme efficace de détection devient plus vulnérable, car l’organisation risque de découvrir l’attaque trop tard, parfois après la compromission du système.

### 2.3 Importance de la détection précoce des attaques

La détection précoce des attaques est un élément essentiel de la cybersécurité moderne. Elle consiste à identifier rapidement les comportements suspects avant qu’ils ne provoquent des conséquences graves sur le système d’information.

Lorsqu’une attaque est détectée à temps, il devient possible de réagir plus rapidement. L’administrateur peut bloquer une adresse IP suspecte, isoler une machine compromise, corriger une faille, renforcer une règle de sécurité ou analyser les journaux afin de comprendre l’origine de l’incident.

À l’inverse, lorsqu’une attaque n’est pas détectée rapidement, l’attaquant peut disposer de plus de temps pour explorer le réseau, voler des informations, installer des outils malveillants, créer des accès persistants ou perturber le fonctionnement normal des services.

La détection précoce permet donc de réduire les risques liés aux cyberattaques. Elle contribue à limiter les dégâts, à améliorer la réactivité des équipes de sécurité et à renforcer progressivement les mesures de protection.

Dans le cadre du projet HoneyShield, cette logique est particulièrement importante. Le projet vise à mettre en place un environnement permettant d’observer les tentatives d’attaque, d’identifier les comportements suspects et de collecter des informations utiles pour mieux comprendre les menaces.

Ainsi, le contexte du projet repose sur une réalité claire : les systèmes exposés sont constamment ciblés, les attaques peuvent commencer par des actions discrètes, et seule une surveillance efficace permet de détecter ces signaux faibles avant qu’ils ne deviennent de véritables incidents de sécurité.

### 2.4 Justification du choix d’un honeypot

Le choix d’un honeypot dans le cadre du projet HoneyShield se justifie par le besoin de disposer d’un environnement capable d’attirer, d’observer et d’analyser les tentatives d’attaque sans exposer directement les systèmes réels d’une organisation.

Dans un contexte où les systèmes exposés sont régulièrement ciblés par des scans réseau, des tentatives de connexion non autorisées, des attaques par force brute ou encore l’exploitation de services vulnérables, il devient nécessaire de mettre en place des mécanismes permettant de mieux comprendre le comportement des attaquants. Les solutions de sécurité classiques permettent souvent de bloquer ou de signaler certaines menaces, mais elles ne permettent pas toujours d’observer en détail les actions menées par un attaquant.

Le honeypot apparaît alors comme une solution adaptée, car il joue le rôle d’un leurre volontairement placé dans un environnement contrôlé. Il donne l’apparence d’un système réel ou vulnérable afin d’attirer les attaquants et de collecter des informations sur leurs activités. Ces informations peuvent concerner les adresses IP utilisées, les ports ciblés, les identifiants testés, les commandes exécutées, les fichiers déposés ou encore les méthodes d’attaque employées.

Dans le cas de HoneyShield, le honeypot n’est pas choisi uniquement comme un outil de détection. Il est également choisi comme un outil d’observation, d’apprentissage et d’analyse. Il permet de transformer une tentative d’intrusion en donnée exploitable pour mieux comprendre les menaces et améliorer les mécanismes de défense.

Ce choix est également pertinent dans un cadre pédagogique et expérimental. Le honeypot permet de reproduire un environnement proche de la réalité tout en limitant les risques pour les systèmes sensibles. Il offre ainsi la possibilité d’étudier concrètement les comportements malveillants, de suivre les traces laissées par les attaquants et d’analyser les événements générés dans un système de supervision.

Ainsi, le choix d’un honeypot pour HoneyShield se justifie par sa capacité à répondre à trois besoins essentiels : détecter précocement les activités suspectes, collecter des données utiles sur les attaques et fournir un cadre sécurisé pour l’analyse des cybermenaces. Cette approche correspond parfaitement à l’objectif du projet, qui est de concevoir et déployer un environnement permettant la détection et l’analyse des cyberattaques.

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
