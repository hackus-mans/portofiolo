---
title: Mise en place d'un honypot
tools:
skills:
  - Honypot
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

La mise en place d’un environnement de cybersécurité efficace ne repose pas uniquement sur la protection des systèmes contre les attaques. Elle nécessite également une capacité à observer, comprendre et analyser les comportements malveillants. Dans un contexte où les systèmes exposés sont constamment ciblés par des attaques automatisées ou humaines, il devient important de disposer d’outils permettant de détecter les tentatives d’intrusion dès leurs premières manifestations.

Cependant, dans de nombreuses infrastructures, les attaques ne sont détectées qu’après avoir produit des effets visibles : compromission d’un compte, indisponibilité d’un service, vol de données, modification de fichiers ou installation d’un logiciel malveillant. Cette détection tardive limite la capacité des administrateurs à comprendre l’origine de l’attaque, les techniques utilisées et les actions réellement effectuées par l’attaquant.

Face à cette situation, le projet HoneyShield cherche à répondre à une question centrale : comment concevoir et déployer un environnement honeypot capable d’attirer, de détecter et d’analyser des tentatives de cyberattaques dans un cadre contrôlé, sans mettre en danger les systèmes réels ?

### 3.1 Problème principal identifié

Le problème principal identifié est la difficulté à détecter et analyser précocement les comportements malveillants visant les systèmes exposés.

Lorsqu’un service est accessible sur un réseau, il peut être rapidement ciblé par des scans, des tentatives de connexion, des attaques par force brute ou des essais d’exploitation de vulnérabilités. Ces actions peuvent paraître simples ou isolées, mais elles constituent souvent les premières étapes d’une attaque plus avancée.

Dans une infrastructure classique, ces comportements ne sont pas toujours suffisamment visibles. Les journaux système peuvent contenir des traces importantes, mais celles-ci sont parfois dispersées, difficiles à interpréter ou consultées uniquement après un incident. De plus, les systèmes réels ne doivent pas être utilisés comme terrain d’observation des attaquants, car cela pourrait compromettre la sécurité de l’organisation.

Le besoin principal est donc de disposer d’un environnement sécurisé, isolé et contrôlé, capable de capter les tentatives d’attaque, de collecter les traces associées et de faciliter leur analyse. Cet environnement doit permettre d’observer les actions suspectes sans exposer les ressources critiques de l’organisation.

### 3.2 Questions techniques du projet

À partir du problème identifié, plusieurs questions techniques se posent :

- **Comment concevoir une architecture honeypot isolée et sécurisée afin d’éviter tout impact sur le système réel ?**
- **Quels services exposer pour attirer les attaquants ou simuler des comportements réalistes ?**
- **Comment collecter efficacement les journaux et les événements générés par les interactions avec le honeypot ?**
- **Comment centraliser les données issues des différents composants de HoneyShield ?**
- **Comment analyser les traces d’attaque afin d’identifier les comportements suspects ?**
- **Comment visualiser les événements de sécurité dans un tableau de bord clair et exploitable ?**
- **Comment vérifier que l’environnement HoneyShield permet réellement de détecter des scans, des connexions suspectes ou des tentatives d’attaque par force brute ?**

Ces questions permettent d’orienter la conception et la mise en œuvre du projet. Elles montrent que HoneyShield ne se limite pas à l’installation d’un honeypot, mais implique aussi une réflexion sur l’architecture, la sécurité, la collecte des données, la supervision et l’analyse des résultats.

### 3.3 Hypothèse de solution proposée

L’hypothèse de solution proposée est qu’un environnement honeypot bien conçu, isolé du système réel et associé à une solution de supervision centralisée, peut permettre de détecter précocement des comportements malveillants et de collecter des informations utiles pour l’analyse des cyberattaques.

Dans cette approche, HoneyShield servira de leurre contrôlé. Il exposera certains services susceptibles d’attirer des tentatives d’attaque, tout en enregistrant les interactions effectuées par les attaquants ou par les outils automatisés. Les données collectées seront ensuite centralisées et analysées afin de mieux comprendre les actions observées.

L’utilisation d’outils comme Cowrie, Dionaea et Wazuh permettra de couvrir plusieurs aspects du projet. Cowrie pourra être utilisé pour observer les tentatives de connexion SSH suspectes. Dionaea pourra servir à détecter certaines interactions avec des services exposés. Wazuh permettra de centraliser, superviser et visualiser les événements de sécurité.

Ainsi, l’hypothèse défendue dans ce projet est la suivante : la combinaison d’un honeypot, d’une architecture isolée et d’un système de supervision peut constituer une solution pertinente pour détecter, observer et analyser des cyberattaques dans un environnement contrôlé.

Cette hypothèse sera vérifiée à travers la mise en œuvre de HoneyShield, la simulation contrôlée de certaines attaques et l’analyse des événements générés par l’environnement déployé.

## <mark style="background:#ff4d4f">4. Objectifs du projet</mark>

Les objectifs du projet HoneyShield permettent de préciser ce que le projet cherche à atteindre sur les plans technique, pédagogique et sécuritaire. Après avoir présenté le contexte et la problématique, il est nécessaire de définir clairement le but général du projet ainsi que les actions spécifiques à réaliser pour y parvenir.

Le projet HoneyShield ne consiste pas seulement à installer un outil de cybersécurité. Il vise à concevoir un environnement complet permettant d’attirer des comportements suspects, de collecter les traces d’attaque, de centraliser les données et d’analyser les événements observés. Les objectifs définis ci-dessous orientent donc toute la démarche de conception, de mise en œuvre, de simulation et d’évaluation de la solution.

### 4.1 Objectif général

L’objectif général du projet HoneyShield est de **concevoir et déployer un environnement honeypot sécurisé, isolé et supervisé, capable de détecter, collecter et analyser des tentatives de cyberattaques dans un cadre contrôlé**.

Cet objectif vise à mettre en place une solution permettant d’observer les comportements malveillants sans exposer directement les systèmes réels d’une organisation. HoneyShield doit ainsi jouer le rôle d’un environnement d’observation et d’analyse, capable de fournir des informations utiles sur les attaques visant des services exposés.

À travers cet objectif général, le projet cherche également à démontrer l’intérêt d’un honeypot dans une stratégie de cybersécurité proactive. Il ne s’agit pas uniquement de bloquer les attaques, mais de mieux comprendre leur déroulement, les techniques utilisées, les services ciblés et les traces laissées par les attaquants.

Ainsi, HoneyShield doit permettre de passer d’une logique de sécurité passive à une logique plus active, fondée sur la surveillance, l’apprentissage et l’analyse des menaces.

### 4.2 Objectifs spécifiques

Pour atteindre l’objectif général, plusieurs objectifs spécifiques sont définis. Ces objectifs correspondent aux différentes étapes nécessaires à la réalisation du projet HoneyShield.

Le premier objectif spécifique est de **mettre en place une architecture honeypot isolée**. Cette isolation est essentielle afin de protéger les systèmes réels et d’éviter qu’une activité malveillante observée dans le honeypot puisse affecter l’environnement principal. Le projet devra donc prévoir une séparation claire entre l’environnement de test et les ressources sensibles.

Le deuxième objectif spécifique est de **déployer des services attractifs pour les attaquants**. Ces services doivent permettre de simuler un système exposé et intéressant pour un attaquant. Ils peuvent inclure des services comme SSH ou d’autres services réseau souvent ciblés dans les attaques informatiques.

Le troisième objectif spécifique est de **installer et configurer des outils honeypot adaptés**, notamment Cowrie et Dionaea. Cowrie permettra principalement d’observer les tentatives de connexion SSH suspectes, tandis que Dionaea pourra être utilisé pour capter certaines interactions avec des services vulnérables ou exposés.

Le quatrième objectif spécifique est de **centraliser les journaux et les événements de sécurité**. Les informations générées par les honeypots doivent être collectées et organisées afin de faciliter leur analyse. Cette centralisation permettra d’avoir une meilleure visibilité sur les activités observées dans l’environnement HoneyShield.

Le cinquième objectif spécifique est de **intégrer une solution de supervision**, notamment Wazuh, afin de suivre les événements générés par l’environnement. Cette solution permettra de visualiser les alertes, de consulter les logs, d’identifier les comportements suspects et d’améliorer l’exploitation des données collectées.

Le sixième objectif spécifique est de **réaliser des simulations contrôlées d’attaques**. Ces simulations permettront de vérifier le bon fonctionnement de HoneyShield face à des scénarios comme le scan réseau, les tentatives de connexion SSH suspectes ou les attaques par force brute.

Le septième objectif spécifique est de **analyser les données collectées** afin d’identifier les informations utiles : adresses IP suspectes, ports ciblés, identifiants utilisés, mots de passe testés, commandes exécutées ou comportements automatisés.

Le huitième objectif spécifique est de **évaluer l’apport de HoneyShield dans la détection des attaques**. Cette évaluation permettra de déterminer dans quelle mesure l’environnement mis en place facilite l’observation, la détection et l’analyse des cybermenaces.

Enfin, le dernier objectif spécifique est de **proposer des pistes d’amélioration** pour faire évoluer HoneyShield. Ces améliorations pourront concerner l’ajout d’autres honeypots, l’intégration de l’intelligence artificielle, la corrélation avancée des événements, la géolocalisation des adresses IP ou encore l’intégration dans un environnement SOC ou SIEM plus avancé.

En résumé, les objectifs spécifiques du projet HoneyShield sont les suivants :

- **Mettre en place** une architecture honeypot isolée et sécurisée.
- **Déployer** des services exposés permettant d’attirer des comportements suspects.
- **Installer et configurer** des outils honeypot tels que Cowrie et Dionaea.
- **Centraliser** les journaux et les événements générés par l’environnement.
- **Intégrer** une solution de supervision comme Wazuh.
- **Réaliser** des simulations contrôlées d’attaques.
- **Analyser** les données collectées lors des interactions avec le honeypot.
- **Évaluer** l’apport de HoneyShield dans la détection et l’analyse des cyberattaques.
- **Proposer** des pistes d’amélioration pour renforcer la solution.

## <mark style="background:#ff4d4f">5. Intérêt du projet</mark>

Le projet HoneyShield présente un intérêt important, car il permet de relier la théorie de la cybersécurité à une mise en pratique concrète. Il ne se limite pas à l’étude des concepts liés aux cyberattaques ou aux honeypots, mais propose la conception et le déploiement d’un environnement réel permettant d’observer, de collecter et d’analyser des comportements malveillants.

L’intérêt du projet se situe à plusieurs niveaux. Il est d’abord pédagogique, parce qu’il permet de comprendre concrètement le fonctionnement des attaques et des mécanismes de détection. Il est également technique, car il mobilise plusieurs compétences liées à l’administration système, au réseau, à la supervision et à la gestion des logs. Il présente aussi un intérêt direct en cybersécurité, puisqu’il contribue à la détection et à l’analyse des menaces. Enfin, il peut être utile pour une organisation qui souhaite renforcer sa capacité de surveillance et d’anticipation face aux attaques informatiques.

### 5.1 Intérêt pédagogique

Sur le plan pédagogique, HoneyShield constitue un excellent support d’apprentissage pour comprendre les mécanismes des cyberattaques et les méthodes de détection. En effet, la cybersécurité ne peut pas être maîtrisée uniquement à travers des notions théoriques. Elle nécessite également des mises en situation, des observations pratiques et des analyses concrètes.

Grâce à HoneyShield, il devient possible d’observer comment un attaquant ou un outil automatisé interagit avec un système exposé. Les étudiants ou les apprenants peuvent ainsi comprendre les étapes d’une attaque, depuis la reconnaissance jusqu’aux tentatives d’accès non autorisé. Ils peuvent également analyser les traces laissées dans les journaux et comprendre comment ces informations peuvent être exploitées pour détecter une menace.

Ce projet permet donc de développer une approche plus concrète de la cybersécurité. Au lieu de seulement expliquer ce qu’est un scan réseau, une attaque par force brute ou une connexion SSH suspecte, HoneyShield permet de voir ces événements apparaître dans un environnement réel ou simulé.

Il favorise aussi l’apprentissage par la pratique. Les apprenants peuvent installer des outils, configurer des services, générer des événements, consulter les logs, interpréter les alertes et proposer des mesures de sécurité. Cette démarche renforce la compréhension et prépare mieux aux réalités du terrain.

L’intérêt pédagogique de HoneyShield réside donc dans sa capacité à transformer des notions parfois abstraites en expériences concrètes, observables et exploitables.

### 5.2 Intérêt technique

Sur le plan technique, HoneyShield permet de mobiliser plusieurs compétences indispensables dans le domaine de l’informatique et de la cybersécurité. La mise en œuvre du projet nécessite la maîtrise de l’administration système, de la configuration réseau, de la virtualisation, de l’installation de services, de la gestion des journaux et de la supervision.

Le projet permet notamment de travailler sur un environnement Linux, qui est largement utilisé dans les infrastructures serveurs et les solutions de cybersécurité. Il permet aussi de comprendre comment installer, configurer et sécuriser des outils spécialisés comme Cowrie, Dionaea ou Wazuh.

HoneyShield présente également un intérêt technique parce qu’il repose sur une architecture composée de plusieurs éléments interconnectés. Il faut définir les rôles des composants, organiser les flux de données, assurer la remontée des logs et vérifier que les informations collectées sont exploitables dans un tableau de bord.

Ce projet permet donc de développer des compétences pratiques autour de plusieurs aspects techniques :

- **L’installation et l’administration** d’un serveur Linux.
- **La configuration réseau** d’un environnement isolé.
- **Le déploiement** d’outils honeypot.
- **La collecte et la centralisation** des journaux d’activité.
- **L’intégration** d’une solution de supervision.
- **La visualisation** des événements de sécurité.
- **La vérification** du bon fonctionnement d’une architecture de détection.

L’intérêt technique du projet réside donc dans sa dimension complète. HoneyShield ne consiste pas seulement à installer un outil, mais à concevoir une solution cohérente, fonctionnelle et sécurisée.

### 5.3 Intérêt en cybersécurité

En cybersécurité, l’intérêt principal de HoneyShield est de permettre la détection, l’observation et l’analyse des comportements malveillants. Dans un contexte où les attaques sont de plus en plus automatisées et fréquentes, il devient nécessaire de disposer d’outils capables d’identifier rapidement les tentatives suspectes.

HoneyShield permet de surveiller les interactions avec des services exposés et de collecter des informations utiles sur les attaques. Ces informations peuvent concerner les adresses IP suspectes, les ports ciblés, les identifiants utilisés, les mots de passe testés, les commandes exécutées ou encore les comportements automatisés.

Ces données sont importantes, car elles permettent de mieux comprendre les méthodes utilisées par les attaquants. Une organisation peut ainsi identifier les services les plus ciblés, les types d’attaques les plus fréquents et les comportements qui doivent être considérés comme suspects.

Le projet contribue également à renforcer la posture de sécurité. En observant les attaques dans un environnement contrôlé, il devient possible d’améliorer les règles de détection, de renforcer les configurations, de sensibiliser les utilisateurs et de préparer une meilleure réponse aux incidents.

HoneyShield présente donc un intérêt direct pour la cybersécurité, car il permet de passer d’une simple logique de protection à une logique d’analyse et d’anticipation. Il aide à mieux connaître les menaces afin de mieux s’en protéger.

### 5.4 Intérêt pour une organisation

Pour une organisation, HoneyShield peut représenter un outil complémentaire dans une stratégie de cybersécurité. Les entreprises, les institutions publiques, les universités ou les structures disposant de services numériques peuvent être confrontées à des tentatives d’intrusion, même lorsqu’elles ne pensent pas être des cibles prioritaires.

L’intérêt de HoneyShield pour une organisation est qu’il permet de disposer d’un environnement contrôlé destiné à attirer les comportements suspects. Au lieu de laisser les attaquants interagir directement avec des systèmes sensibles, l’organisation peut observer certaines tentatives dans un espace isolé et surveillé.

Les informations collectées peuvent aider les responsables informatiques à mieux comprendre les menaces qui visent leur infrastructure. Elles peuvent également permettre d’améliorer les politiques de sécurité, de renforcer les règles de filtrage, d’adapter les mécanismes de supervision et de mieux préparer les équipes à la gestion des incidents.

HoneyShield peut aussi contribuer à la sensibilisation interne. Les résultats obtenus peuvent être utilisés pour montrer aux utilisateurs, aux étudiants ou aux équipes techniques que les attaques sont réelles, fréquentes et parfois automatisées. Cela permet de renforcer la culture de sécurité au sein de l’organisation.

Enfin, le projet peut servir de base à une évolution vers des dispositifs plus avancés, comme l’intégration avec un SOC, un SIEM, des alertes automatiques ou des mécanismes d’analyse intelligente des comportements.

Ainsi, pour une organisation, HoneyShield présente un intérêt à la fois stratégique, opérationnel et pédagogique. Il permet de mieux surveiller les menaces, de renforcer la sécurité globale et de développer une meilleure compréhension des risques cyber.

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
