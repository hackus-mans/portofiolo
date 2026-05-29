# HoneyShield : Conception et déploiement d’un environnement honeypot pour la détection et l’analyse des cyberattaques


## <mark style="background:#ff4d4f">1. Présentation générale du projet</mark>

### 1.1 Présentation de HoneyShield

HoneyShield est un projet de cybersécurité qui consiste à concevoir et déployer un environnement honeypot destiné à la détection et à l’analyse des activités malveillantes. Un honeypot est un système volontairement exposé ou simulé afin d’attirer les attaquants dans un cadre contrôlé.

L’objectif de HoneyShield n’est pas de protéger directement un système de production, mais de créer un environnement d’observation permettant de capturer les comportements suspects. Lorsqu’un attaquant interagit avec les services exposés, ses actions sont enregistrées afin d’être étudiées par la suite.

Ce projet permet ainsi de mieux comprendre les méthodes utilisées par les attaquants, les services les plus ciblés, les types de tentatives d’intrusion et les traces laissées lors d’une attaque. HoneyShield transforme donc une tentative d’intrusion en source d’information utile pour renforcer la sécurité d’un système d’information.

### 1.2 Domaine du projet

Le projet HoneyShield s’inscrit dans le domaine de la cybersécurité, plus précisément dans les domaines de la détection d’intrusion, de la surveillance réseau, de l’analyse des menaces et de la supervision de sécurité.

Aujourd’hui, les organisations sont confrontées à des attaques de plus en plus fréquentes, automatisées et difficiles à détecter. Les solutions classiques comme les pare-feu, les antivirus ou les mécanismes de contrôle d’accès restent importantes, mais elles ne suffisent pas toujours à comprendre le comportement des attaquants.

HoneyShield vient compléter ces mécanismes de défense en permettant d’observer les tentatives d’attaque dans un environnement séparé du système réel. Le projet touche donc plusieurs aspects importants de la cybersécurité :

- la sécurité des réseaux informatiques ;
- la détection des comportements suspects ;
- l’analyse des cyberattaques ;
- la collecte et l’exploitation des journaux d’activité ;
- la supervision des événements de sécurité ;
- l’aide à la réponse aux incidents.

### 1.3 Environnement cible

L’environnement cible de HoneyShield est un réseau informatique contrôlé dans lequel des services exposés peuvent être surveillés afin de détecter des tentatives d’intrusion. Cet environnement peut être mis en place dans un laboratoire, une infrastructure de test, un réseau universitaire ou un environnement d’entreprise dédié à l’expérimentation.

Pour limiter les risques, le honeypot doit être isolé des systèmes réels. Cette séparation est essentielle, car le rôle du honeypot est justement d’attirer des activités suspectes. Il ne doit donc pas permettre à un attaquant d’accéder aux ressources sensibles de l’organisation.

L’environnement HoneyShield peut comprendre :

- une machine honeypot destinée à simuler des services vulnérables ;
- un réseau de test isolé ;
- des services exposés comme SSH, FTP ou HTTP ;
- un système de collecte des logs ;
- un poste d’analyse pour consulter et interpréter les données collectées.

Cette architecture permet d’étudier les attaques dans un cadre sécurisé, sans compromettre le système d’information principal.

### 1.4 Résumé de la solution proposée

La solution HoneyShield repose sur la mise en place d’un honeypot capable d’attirer des attaquants, d’enregistrer leurs interactions et de fournir des données exploitables pour l’analyse de la menace.

Lorsqu’une tentative d’accès ou d’exploitation est détectée, le système collecte plusieurs informations : l’adresse IP source, la date et l’heure de l’événement, le service ciblé, les identifiants utilisés, les commandes exécutées ou encore les fichiers éventuellement déposés.

Ces données sont ensuite centralisées et analysées afin d’identifier les comportements suspects, les attaques récurrentes et les méthodes employées. Grâce à cette approche, HoneyShield permet d’améliorer la compréhension des cybermenaces et de proposer des mesures de sécurité adaptées.

En résumé, HoneyShield constitue une solution proactive. Au lieu d’attendre qu’une attaque touche directement un système sensible, il crée un espace contrôlé permettant d’observer les menaces avant qu’elles ne provoquent des dommages réels.

## <mark style="background:#ff4d4f">2. Contexte et justification du projet</mark>

### 2.1 Contexte général de la cybersécurité

Le développement des technologies numériques a profondément transformé le fonctionnement des organisations. Les entreprises, les administrations, les établissements d’enseignement, les banques et les hôpitaux utilisent quotidiennement des systèmes informatiques pour gérer leurs activités, stocker des données et fournir des services.

Cette dépendance au numérique rend les systèmes d’information indispensables, mais elle les expose également à de nombreux risques. Les données, les serveurs, les applications et les réseaux sont devenus des cibles importantes pour les cyberattaquants.

La cybersécurité occupe donc une place essentielle. Elle vise à protéger les infrastructures informatiques contre les accès non autorisés, les pertes de données, les interruptions de service et les intrusions.

Cependant, la protection seule ne suffit plus. Les attaquants cherchent constamment à exploiter les failles, les erreurs de configuration ou les mots de passe faibles. Il devient donc nécessaire d’ajouter des mécanismes de surveillance, de détection et d’analyse afin d’identifier rapidement les comportements suspects.

### 2.2 Menaces actuelles sur les systèmes exposés

Les systèmes accessibles sur un réseau ou sur Internet sont particulièrement exposés aux attaques. Dès qu’un service est ouvert à distance, il peut être ciblé par des attaquants humains ou par des outils automatisés.

Les menaces les plus fréquentes sont les scans de ports, les tentatives de connexion par force brute, les attaques contre les services SSH, FTP ou HTTP, l’exploitation de vulnérabilités connues, les dépôts de fichiers suspects ou encore les tentatives d’élévation de privilèges.

Ces actions peuvent sembler isolées, mais elles représentent souvent les premières étapes d’une attaque plus avancée. Un simple scan réseau peut annoncer une tentative d’exploitation. Une série d’échecs de connexion peut révéler une attaque par dictionnaire.

Le principal danger est que ces signaux passent inaperçus lorsqu’ils ne sont pas correctement surveillés. Un système exposé sans outil de détection efficace risque de découvrir l’attaque trop tard, parfois après la compromission.

### 2.3 Importance de la détection précoce des attaques

La détection précoce est un élément essentiel de la cybersécurité moderne. Elle permet d’identifier les comportements suspects avant qu’ils n’entraînent des conséquences graves.

Lorsqu’une attaque est détectée rapidement, l’administrateur peut réagir plus efficacement : bloquer une adresse IP, isoler une machine, corriger une faille, renforcer une règle de sécurité ou analyser les journaux d’activité.

À l’inverse, une détection tardive donne plus de temps à l’attaquant pour explorer le réseau, voler des informations, installer des outils malveillants ou créer des accès persistants.

Dans le cadre de HoneyShield, la détection précoce est au cœur du projet. Le honeypot permet d’observer les premières traces d’une attaque, de collecter les informations nécessaires et de mieux comprendre les intentions de l’attaquant.

### 2.4 Justification du choix d’un honeypot

Le choix d’un honeypot se justifie par le besoin d’observer les attaques dans un environnement sécurisé et séparé des systèmes réels.

Contrairement à certaines solutions de sécurité qui se limitent à bloquer ou signaler une menace, le honeypot permet d’étudier les actions de l’attaquant. Il simule un système attractif afin d’inciter l’attaquant à interagir avec lui, tout en enregistrant ses activités.

Dans le projet HoneyShield, le honeypot joue donc plusieurs rôles. Il sert d’outil de détection, de plateforme d’observation et de support d’analyse. Il permet de recueillir des informations sur les adresses IP suspectes, les services ciblés, les identifiants testés, les commandes exécutées et les méthodes d’attaque utilisées.

Ce choix est également pertinent dans un cadre pédagogique, car il permet de reproduire des situations proches de la réalité tout en limitant les risques. Les attaques peuvent ainsi être observées, comprises et analysées dans un environnement contrôlé.

## <mark style="background:#ff4d4f">3. Problématique</mark>

La protection des systèmes informatiques ne repose pas uniquement sur la mise en place de barrières de sécurité. Elle nécessite aussi une capacité à observer et comprendre les comportements malveillants.

Dans de nombreuses infrastructures, les attaques ne sont détectées qu’après l’apparition de conséquences visibles : compromission d’un compte, vol de données, modification de fichiers, ralentissement d’un service ou indisponibilité d’une application. Cette détection tardive limite la capacité des administrateurs à comprendre l’origine de l’attaque et les actions réellement effectuées.

Face à cette situation, le projet HoneyShield cherche à répondre à la problématique suivante :

**Comment concevoir et déployer un environnement honeypot capable d’attirer, de détecter et d’analyser des tentatives de cyberattaques dans un cadre contrôlé, sans mettre en danger les systèmes réels ?**

### 3.1 Problème principal identifié

Le problème principal est la difficulté à détecter et analyser rapidement les comportements malveillants visant les systèmes exposés.

Lorsqu’un service est accessible sur un réseau, il peut être ciblé par des scans, des tentatives de connexion ou des attaques automatisées. Ces événements peuvent passer inaperçus si les journaux ne sont pas centralisés, surveillés ou correctement interprétés.

Les systèmes réels ne doivent pas servir directement de terrain d’observation, car cela pourrait mettre en danger l’organisation. Il est donc nécessaire de disposer d’un environnement sécurisé, isolé et contrôlé, capable de capter les tentatives d’attaque sans exposer les ressources critiques.


### 3.2 Questions techniques du projet

Pour répondre à cette problématique, plusieurs questions techniques se posent :

- Comment concevoir une architecture honeypot isolée et sécurisée ?
- Quels services exposer pour attirer les comportements suspects ?
- Comment collecter les journaux générés par les interactions avec le honeypot ?
- Comment centraliser les données issues des différents composants ?
- Comment analyser les traces afin d’identifier les comportements malveillants ?
- Comment visualiser les événements de sécurité dans un tableau de bord clair ?
- Comment vérifier que HoneyShield détecte correctement les scans, les connexions suspectes et les tentatives d’attaque ?

Ces questions orientent la conception, la mise en œuvre et l’évaluation du projet.


### 3.3 Hypothèse de solution proposée

L’hypothèse retenue est qu’un environnement honeypot bien conçu, isolé du système réel et associé à une solution de supervision, peut permettre de détecter et d’analyser efficacement des comportements malveillants.

Dans cette approche, HoneyShield servira de leurre contrôlé. Il exposera certains services afin d’attirer les tentatives d’attaque, tout en enregistrant les actions effectuées par les attaquants ou les outils automatisés.

L’utilisation d’outils comme Cowrie, Dionaea et Wazuh permettra de couvrir plusieurs besoins. Cowrie pourra observer les tentatives de connexion SSH, Dionaea pourra détecter certaines interactions avec des services exposés, tandis que Wazuh permettra de centraliser et visualiser les événements de sécurité.

Cette hypothèse sera vérifiée à travers la mise en place de l’environnement, la simulation contrôlée de certaines attaques et l’analyse des résultats obtenus.

## <mark style="background:#ff4d4f">4. Objectifs du projet</mark>


Les objectifs du projet HoneyShield permettent de définir clairement les résultats attendus. Ils concernent à la fois la conception de l’environnement, le déploiement des outils, la collecte des données et l’analyse des attaques observées.

HoneyShield ne se limite pas à l’installation d’un honeypot. Il s’agit de mettre en place une solution complète permettant de surveiller les interactions suspectes, de centraliser les journaux et d’exploiter les données collectées.

### 4.1 Objectif général

L’objectif général du projet HoneyShield est de concevoir et déployer un environnement honeypot sécurisé, isolé et supervisé, capable de détecter, collecter et analyser des tentatives de cyberattaques dans un cadre contrôlé.

Cet objectif vise à démontrer l’intérêt d’un honeypot dans une stratégie de cybersécurité proactive. Le projet doit permettre d’observer les comportements malveillants sans exposer les systèmes réels, tout en produisant des informations utiles pour améliorer la sécurité.

---

### 4.2 Objectifs spécifiques

Pour atteindre cet objectif général, le projet poursuit les objectifs spécifiques suivants :

- mettre en place une architecture honeypot isolée ;
- déployer des services exposés afin d’attirer des comportements suspects ;
- installer et configurer des outils honeypot comme Cowrie et Dionaea ;
- centraliser les journaux et les événements de sécurité ;
- intégrer une solution de supervision comme Wazuh ;
- réaliser des simulations contrôlées d’attaques ;
- analyser les données collectées ;
- identifier les adresses IP suspectes, les ports ciblés, les identifiants testés et les commandes exécutées ;
- évaluer l’apport de HoneyShield dans la détection des attaques ;
- proposer des pistes d’amélioration pour faire évoluer la solution.

Ces objectifs permettent de structurer le projet depuis la conception jusqu’à l’évaluation finale.

## <mark style="background:#ff4d4f">5. Intérêt du projet</mark>

Le projet HoneyShield présente un intérêt important, car il permet de relier les notions théoriques de cybersécurité à une mise en pratique concrète.

Il permet non seulement de comprendre le fonctionnement d’un honeypot, mais aussi d’observer des comportements suspects, de collecter des données et d’analyser les événements générés. Son intérêt se situe à plusieurs niveaux : pédagogique, technique, sécuritaire et organisationnel.


### 5.1 Intérêt pédagogique

Sur le plan pédagogique, HoneyShield constitue un support d’apprentissage concret pour comprendre les cyberattaques et les mécanismes de détection.

Grâce à ce projet, il devient possible d’observer les différentes étapes d’une attaque, depuis la reconnaissance jusqu’aux tentatives d’accès non autorisé. Les apprenants peuvent également analyser les traces laissées dans les journaux et comprendre comment ces informations peuvent être utilisées pour détecter une menace.

HoneyShield favorise donc l’apprentissage par la pratique. Il permet d’installer des outils, de configurer des services, de générer des événements, de consulter les logs et d’interpréter les alertes.

Ce projet transforme ainsi des notions parfois théoriques en expériences concrètes et observables.

### 5.2 Intérêt technique

Sur le plan technique, HoneyShield mobilise plusieurs compétences importantes dans le domaine de l’informatique et de la cybersécurité.

La mise en œuvre du projet nécessite des connaissances en administration Linux, en configuration réseau, en virtualisation, en gestion des services, en collecte des logs et en supervision.

Le projet permet notamment de travailler sur :

- l’installation et l’administration d’un serveur Linux ;
- la configuration d’un réseau isolé ;
- le déploiement d’outils honeypot ;
- la centralisation des journaux d’activité ;
- l’intégration d’une solution de supervision ;
- la visualisation des événements de sécurité ;
- la vérification du bon fonctionnement de l’architecture.

L’intérêt technique de HoneyShield réside donc dans sa dimension complète. Il ne s’agit pas seulement d’installer un outil, mais de concevoir une solution cohérente et fonctionnelle.

### 5.3 Intérêt en cybersécurité

En cybersécurité, HoneyShield permet d’améliorer la détection et l’analyse des comportements malveillants.

Le honeypot collecte des informations utiles sur les attaques : adresses IP, ports ciblés, identifiants utilisés, mots de passe testés, commandes exécutées ou comportements automatisés.

Ces données permettent de mieux comprendre les méthodes employées par les attaquants. Elles peuvent également aider à renforcer les règles de détection, améliorer les configurations de sécurité et préparer une meilleure réponse aux incidents.

HoneyShield contribue ainsi à passer d’une sécurité uniquement défensive à une approche plus active, basée sur l’observation, l’analyse et l’anticipation des menaces.

### 5.4 Intérêt pour une organisation

Pour une organisation, HoneyShield peut constituer un outil complémentaire dans une stratégie globale de cybersécurité.

Les entreprises, les universités, les administrations ou les structures disposant de services numériques sont régulièrement exposées à des tentatives d’intrusion. Même lorsqu’elles ne sont pas des cibles prioritaires, elles peuvent être visées par des attaques automatisées.

HoneyShield permet de surveiller ces comportements dans un environnement isolé. Les informations collectées peuvent aider les responsables informatiques à mieux comprendre les menaces, adapter les règles de sécurité, renforcer la supervision et sensibiliser les utilisateurs.

Le projet peut également servir de base pour une évolution vers des dispositifs plus avancés, comme l’intégration avec un SOC, un SIEM, des alertes automatiques ou des mécanismes d’analyse intelligente.

Ainsi, HoneyShield présente un intérêt stratégique, opérationnel et pédagogique pour toute organisation souhaitant renforcer sa capacité de détection et d’analyse des cybermenaces.

---
# Partie I : Cadre théorique

## <mark style="background:#ff4d4f">6. Généralités sur les honeypots</mark>

### 6.1 Définition d’un honeypot

Un honeypot est un système informatique volontairement conçu pour attirer les attaquants dans un environnement contrôlé. Il peut prendre la forme d’un serveur, d’un service réseau, d’une application ou d’une machine simulée qui donne l’apparence d’une cible réelle ou vulnérable.

Le principe du honeypot repose sur une idée simple : au lieu d’attendre qu’un attaquant cible directement un système sensible, on met en place un environnement leurre destiné à capter son attention. Lorsqu’un attaquant interagit avec ce système, ses actions sont enregistrées afin d’être analysées.

Un honeypot ne sert donc pas principalement à fournir un service normal aux utilisateurs. Sa fonction principale est d’observer les comportements suspects. Toute interaction avec le honeypot est généralement considérée comme anormale, car ce système n’est pas censé être utilisé par des utilisateurs légitimes.

Dans le cadre de la cybersécurité, un honeypot permet de collecter plusieurs types d’informations : les adresses IP sources, les ports ciblés, les identifiants testés, les mots de passe utilisés, les commandes exécutées, les fichiers déposés ou encore les méthodes employées par les attaquants.

Ainsi, un honeypot peut être défini comme un outil de leurre, de détection et d’analyse permettant d’étudier les cyberattaques dans un cadre sécurisé.

### 6.2 Rôle d’un honeypot en cybersécurité

Le rôle principal d’un honeypot est d’aider à détecter et comprendre les activités malveillantes. Il permet de repérer des tentatives d’intrusion qui pourraient passer inaperçues dans un système classique.

En cybersécurité, les attaquants commencent souvent par rechercher des services accessibles, tester des mots de passe faibles, scanner des ports ou exploiter des failles connues. Un honeypot permet de capter ces premières actions et de les transformer en données exploitables.

Le honeypot joue donc plusieurs rôles importants.

Il sert d’abord d’outil de détection. Lorsqu’une connexion est établie avec le honeypot, cela peut indiquer une activité suspecte. Cette interaction peut révéler qu’un attaquant ou un outil automatisé explore le réseau.

Il joue ensuite un rôle d’observation. Le honeypot permet de suivre les actions réalisées par l’attaquant : tentatives de connexion, commandes saisies, fichiers téléchargés, services ciblés ou comportements automatisés.

Il joue également un rôle d’analyse. Les informations collectées permettent de mieux comprendre les techniques utilisées par les attaquants. Ces données peuvent ensuite aider à renforcer les règles de sécurité, améliorer la supervision ou préparer une réponse aux incidents.

Enfin, le honeypot peut avoir un rôle pédagogique. Il permet aux étudiants, administrateurs et analystes de cybersécurité d’observer concrètement des attaques dans un environnement contrôlé, sans exposer directement les systèmes réels.

### 6.3 Fonctionnement général d’un honeypot

Le fonctionnement général d’un honeypot repose sur la mise en place d’un environnement qui imite un système réel ou vulnérable. Cet environnement est volontairement exposé afin d’attirer des interactions suspectes.

Dans un premier temps, le honeypot est installé sur une machine physique ou virtuelle. Il est ensuite configuré pour simuler certains services réseau, par exemple SSH, FTP, HTTP ou d’autres services fréquemment ciblés par les attaquants.

Dans un deuxième temps, le honeypot est placé dans un environnement contrôlé. Il doit être séparé des systèmes sensibles afin d’éviter qu’un attaquant puisse l’utiliser comme point d’entrée vers le réseau réel. Cette isolation est une règle essentielle dans la mise en place d’un honeypot.

Lorsqu’un attaquant tente d’interagir avec le honeypot, le système enregistre ses actions. Il peut collecter l’adresse IP de l’attaquant, l’heure de la connexion, le service ciblé, les identifiants utilisés, les mots de passe testés, les commandes exécutées ou les fichiers déposés.

Dans un troisième temps, les données collectées sont analysées. Cette analyse peut être réalisée directement dans les journaux du honeypot ou à travers une solution de supervision comme Wazuh, Kibana ou un autre outil SIEM.

Le fonctionnement d’un honeypot peut donc être résumé en quatre étapes :

- **Exposer** un service ou un système leurre.
- **Attirer** les tentatives d’interaction suspectes.
- **Collecter** les traces laissées par les attaquants.
- **Analyser** les informations obtenues pour mieux comprendre les menaces.

Dans le cadre de HoneyShield, ce fonctionnement sera appliqué à travers des outils comme Cowrie, Dionaea et Wazuh, afin de détecter, centraliser et analyser les événements générés par les interactions suspectes.

### 6.4 Types de honeypots

Il existe plusieurs types de honeypots. Ils peuvent être classés selon leur <font color="#4f6128">niveau d’interaction</font>, <font color="#76923c">leur objectif</font> ou <font color="#9bbb59">l<font color="#9bbb59">eur domaine d’utilisation</font></font>.

<font color="#4f6128">Selon le niveau d’interaction</font>, on distingue principalement les honeypots à <font color="#e36c09">faible interaction</font>, les honeypots à <font color="#974806">moyenne interaction</font> et les honeypots à <font color="#ff0000">forte interaction</font>.

<font color="#e36c09">Un honeypot à faible interaction</font> simule simplement certains services ou certaines réponses réseau. Il ne donne pas réellement accès à un système complet. Son objectif est surtout de détecter des scans, des connexions suspectes ou des tentatives simples d’exploitation. Ce type de honeypot est plus facile à installer et présente moins de risques, mais il fournit moins de détails sur les actions de l’attaquant.
![[Pasted image 20260529000306.png]]


<font color="#974806">Un honeypot à moyenne interaction </font>offre davantage de possibilités d’interaction. Il peut simuler un service de manière plus réaliste et collecter plus d’informations sur le comportement de l’attaquant. Il représente un bon équilibre entre richesse des données collectées et maîtrise des risques.

![[Pasted image 20260529000801.png]]

<font color="#ff0000">Un honeypot à forte interaction</font> fournit un environnement beaucoup plus proche d’un vrai système. L’attaquant peut interagir avec plusieurs services et réaliser davantage d’actions. Ce type de honeypot permet de collecter des informations très riches, mais il présente aussi plus de risques, car l’attaquant peut tenter d’utiliser l’environnement compromis pour mener d’autres actions malveillantes.

![[Pasted image 20260529001101.png]]

On peut aussi distinguer les <font color="#76923c">honeypots selon leur objectif</font>.

<font color="#4bacc6">Un honeypot de recherche</font> est utilisé pour étudier les comportements des attaquants, comprendre les nouvelles techniques d’attaque et collecter des données sur les menaces.

<font color="#92cddc">Un honeypot de production</font> est utilisé dans une organisation pour détecter rapidement les activités suspectes dans un environnement réel ou proche du réel.

Il existe également des <font color="#4bacc6">honeypots spécialisés</font>. Certains sont conçus pour observer les attaques SSH, d’autres pour les malwares, les services web, les bases de données, les objets connectés ou les protocoles industriels.

Le choix du type de honeypot dépend donc du niveau de détail recherché, du niveau de risque accepté et des objectifs du projet.

Dans le cadre du projet HoneyShield, le type de honeypot mis en place correspond principalement à un honeypot à faible interaction, avec certains aspects proches d’un honeypot à moyenne interaction. En effet, l’objectif n’est pas de fournir un système complet à l’attaquant, mais de simuler des services exposés afin d’attirer des tentatives de connexion, des scans ou des attaques automatisées.

L’utilisation de Cowrie permet d’observer les tentatives de connexion SSH, les identifiants testés et certaines commandes saisies par l’attaquant. Dionaea permet quant à lui de capter des interactions avec des services vulnérables ou exposés. Ces outils permettent donc de collecter des informations utiles tout en limitant les risques liés à une compromission réelle.

HoneyShield ne peut donc pas être considéré comme un honeypot à forte interaction, car il ne donne pas accès à une infrastructure complète ou à un système réel. Il s’agit plutôt d’un environnement contrôlé, isolé et supervisé, destiné à détecter et analyser les comportements suspects.

### 6.5 Avantages des honeypots

Les honeypots présentent plusieurs avantages importants en cybersécurité.

Le premier avantage est la détection des activités suspectes. Comme un honeypot n’est normalement pas utilisé par des utilisateurs légitimes, toute interaction avec lui peut être considérée comme potentiellement malveillante. Cela facilite l’identification des comportements anormaux.

Le deuxième avantage est la collecte d’informations détaillées. Un honeypot permet d’enregistrer les actions réalisées par un attaquant : services ciblés, identifiants testés, mots de passe utilisés, commandes exécutées ou fichiers déposés. Ces informations peuvent être très utiles pour comprendre les méthodes d’attaque.

Le troisième avantage est l’amélioration de la connaissance des menaces. En observant les attaques, il devient possible d’identifier les tendances, les techniques les plus fréquentes et les comportements automatisés. Cette connaissance peut ensuite aider à renforcer les politiques de sécurité.

Le quatrième avantage est la réduction des faux positifs. Dans certains systèmes de détection classiques, de nombreuses alertes peuvent être générées par des activités normales. Dans le cas d’un honeypot, les interactions sont plus facilement considérées comme suspectes, car le système n’a pas vocation à être utilisé normalement.

Le cinquième avantage est l’intérêt pédagogique. Les honeypots permettent de créer un environnement d’apprentissage réaliste dans lequel les étudiants ou les professionnels peuvent observer des attaques et analyser les traces laissées par les attaquants.

Enfin, les honeypots peuvent contribuer à améliorer la réponse aux incidents. Les données collectées peuvent aider les équipes de sécurité à comprendre les comportements hostiles, à adapter les règles de détection et à renforcer les mécanismes de défense existants.

### 6.6 Limites et risques des honeypots

Malgré leurs avantages, les honeypots présentent aussi certaines limites et certains risques.

La première limite est qu’un honeypot ne remplace pas les autres solutions de sécurité. Il ne doit pas être considéré comme une protection complète. Il vient plutôt compléter les pare-feu, les antivirus, les systèmes de détection d’intrusion, les solutions de supervision et les bonnes pratiques de sécurité.

La deuxième limite concerne le périmètre de détection. Un honeypot ne détecte que les attaques ou les interactions qui le ciblent directement. Si un attaquant ne touche pas le honeypot, celui-ci ne pourra pas observer son comportement.

La troisième limite est liée à la configuration. Un honeypot mal configuré peut être facilement identifié par un attaquant expérimenté. Si le leurre n’est pas crédible, l’attaquant peut l’éviter ou modifier son comportement.

La quatrième limite concerne le risque de compromission. Si le honeypot est mal isolé, un attaquant peut tenter de l’utiliser comme point d’appui pour attaquer d’autres systèmes. C’est pourquoi l’isolation réseau, la limitation des accès et la surveillance permanente sont indispensables.

La cinquième limite concerne l’analyse des données. Un honeypot peut générer beaucoup de logs. Si ces données ne sont pas correctement organisées, centralisées et interprétées, elles peuvent devenir difficiles à exploiter.

Enfin, l’utilisation d’un honeypot doit respecter un cadre éthique et légal. Il ne doit pas servir à piéger abusivement des utilisateurs légitimes ni à mener des actions offensives contre des tiers. Son rôle doit rester limité à l’observation, à la détection et à l’analyse dans un environnement contrôlé.

Ainsi, les honeypots sont des outils puissants pour la cybersécurité, mais ils doivent être utilisés avec prudence. Leur efficacité dépend fortement de leur bonne configuration, de leur isolation et de leur intégration dans une stratégie globale de sécurité.

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