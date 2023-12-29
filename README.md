
# MybadAPI RESTful web API avec Node.js, Express.js, MySQL


## Lancer le Projet MybadAPI avec MySQL

Ce projet est une API RESTful construite avec Express.js et Node.js, utilisant `JWT` pour l'authentification, `dotenv` pour la gestion des variables d'environnement, `cors` pour permettre le partage de ressources entre différentes origines, et `mysql2` pour interagir avec une base de données MySQL.

## Table des Matières
- [Prérequis](#prérequis)
- [Lancer le projet](#Lancer-le-projet)
  - [Installation des Dépendances](#installation-des-dépendances)
  - [Configuration de l'Environnement](#configuration-de-lenvironnement)
  - [Création de la Base de Données](#création-de-la-base-de-données)
  - [Lancement du Serveur](#lancement-du-serveur)
  - [URL d'Entrée de l'API](#url-dentrée-de-lapi)
- [Conception](#Conception)
  - [Dictionnaire de Données](#dictionnaire-de-données)
  - [Routes de l'API](#routes-de-lapi)
  - [Entités de la Base de Données](#entités-de-la-base-de-données)
  - [Modèle Conceptuel de Données (MCD)](#modèle-conceptuel-de-données-mcd)
- [Remarques](#remarques)
- [Références](#références)

## Prérequis

- Node.js
- npm (Node Package Manager)
- MySQL installé localement

## Lancer le Projet

### Installation des dépendances

Exécutez la commande suivante dans votre terminal à la racine de votre projet pour installer les dépendances nécessaires :

```sh
npm install
```

### Configuration des variables d'environnement

Ajoutez les informations de connexion MySQL dans votre fichier `.env` :

```env
DB_HOST=localhost
DB_USER=votre_utilisateur_mysql
DB_PASSWORD=votre_mot_de_passe_mysql
DB_DATABASE=res_badminton
```

Remplacez les valeurs par vos propres informations de connexion MySQL.

### Création de la base de données

1. Sauvegardez le script `res_badminton.sql` localement.
2. Ouvrez votre terminal MySQL ou un outil de gestion de base de données MySQL.
3. Connectez-vous à votre serveur MySQL.
4. Créez la base de données en exécutant : `CREATE DATABASE res_badminton;`
5. Sélectionnez la base de données : `USE res_badminton;`
6. Importez les tables et les données : `source chemin/vers/res_badminton.sql;`

### Lancement du serveur

Pour lancer le serveur, exécutez la commande suivante :

```sh
node app.js
```

Ou, si vous avez configuré un script de démarrage spécifique dans votre `package.json`, utilisez ce script pour démarrer l'application.

### URL d'entrée de l'API

Une fois le serveur démarré, votre API sera accessible à l'adresse :

```
http://localhost:8000/
```

Le port doit correspondre à celui défini dans votre fichier `.env`.


## Conception 

### Dictionnaire de données pour res_badminton

Le tableau ci-dessous décrit la structure de données pour l'API de la base de données `res_badminton`.

|    | Libellé/Désignation          | Code               | Type   | Obligatoire?   |   Taille | Commentaires                     |
|---:|:-----------------------------|:-------------------|:-------|:---------------|---------:|:---------------------------------|
|  0 | ID Utilisateur               | user_id            | N      | Oui            |      nan |                                  |
|  1 | Pseudo Utilisateur           | pseudo             | AN     | Oui            |       45 | Unique                           |
|  2 | ID Court                     | court_id           | A      | Oui            |        1 |                                  |
|  3 | Statut Court                 | court_status       | AN     | Oui            |      nan | Enum('available', 'unavailable') |
|  4 | ID Réservation               | reservation_id     | N      | Oui            |      nan |                                  |
|  5 | Heure de début               | start_time         | D      | Oui            |      nan |                                  |
|  6 | Heure de fin                 | end_time           | D      | Oui            |      nan |                                  |
|  7 | Statut Réservation           | reservation_status | AN     | Oui            |      nan | Enum('confirmed', 'canceled')    |
|  8 | ID Utilisateur (Réservation) | user_id_fk         | N      | Oui            |      nan | Clé étrangère vers Utilisateur   |
|  9 | ID Court (Réservation)       | court_id_fk        | A      | Oui            |        1 | Clé étrangère vers Court         |
| 10 | ID Admin                     | admin_id           | N      | Oui            |      nan |                                  |
| 11 | Pseudo Admin                 | admin_pseudo       | AN     | Oui            |       45 | Unique                           |
| 12 | Mot de passe Admin           | admin_password     | AN     | Oui            |       45 |                                  |



### API Routes

Ressources exposées par l'API.

**Note:** toutes les ressources autorisent les méthodes HTTP OPTIONS et HEAD.

|    | Nom de la ressource         | URL                             | Méthode   | Paramètres d'url   | Commentaires                                                |
|---:|:----------------------------|:--------------------------------|:----------|:-------------------|:------------------------------------------------------------|
|  0 | Authentification Admin      | /Auth                           | POST      |                    | Authentification pour les administrateurs uniquement        |
|  1 | Création de Pseudo          | /Register                       | POST      |                    | Créer un nouveau pseudo utilisateur                         |
|  2 | Ajout de Réservation        | /reservations                   | POST      |                    |                                                             |
|  3 | Liste des Réservations      | /reservations/all               | GET       |                    |                                                             |
|  4 | Modification de Réservation | /reservations/{id-reservation}  | PATCH     | id-reservation     | Modifier le statut d'une réservation par ID                 |
|  5 | Suppression de Réservation  | /reservations/{id-reservation}  | DELETE    | id-reservation     |                                                             |
|  6 | Réservations par Court      | /courts/{id-court}/reservations | GET       | id-court           |                                                             |
|  7 | Liste des Courts            | /courts                         | GET       |                    |                                                             |
|  8 | Mise à jour d'un Court      | /courts/{id-court}              | PATCH     | id-court           | Mettre à jour l'état d'un court, admin avec JWT             |



### Entités (base de données)

#### User (Utilisateur)
- `id` 
- `pseudo`

#### Courts (Terrains)
- `id` 
- `statut` 

#### Reservation (Réservation)
- `id` 
- `start_time` 
- `end_time` 
- `status` 
- `user_id`
- `courts_id` 

#### Admin (Administrateur)
- `id`
- `pseudo` 
- `password`



### Modèle Conceptuel des Données (MCD) pour la base de données `res_badminton`

Le MCD suivant décrit les entités et leurs relations dans un format de diagramme UML simplifié.

#### Entités et Attributs

##### User (Utilisateur)
- **id** : INT, clé primaire, auto-incrémentée.
- **pseudo** : VARCHAR(45), unique, non nul.

##### Courts (Terrains)
- **id** : CHAR(1), clé primaire.
- **statut** : ENUM('available', 'unavailable'), non nul, par défaut 'available'.

##### Reservation (Réservation)
- **id** : INT, clé primaire, auto-incrémentée.
- **start_time** : DATETIME, non nul.
- **end_time** : DATETIME, non nul.
- **status** : ENUM('confirmed', 'canceled'), non nul, par défaut 'confirmed'.
- **user_id** : INT, non nul, clé étrangère vers `User.id`.
- **courts_id** : CHAR(1), non nul, clé étrangère vers `Courts.id`.

##### Admin (Administrateur)
- **id** : INT, clé primaire, auto-incrémentée.
- **pseudo** : VARCHAR(45), unique, non nul.
- **password** : VARCHAR(45), non nul.

#### Relations

- **User -> Reservation** : Un-à-plusieurs (Un utilisateur peut avoir plusieurs réservations).
- **Courts -> Reservation** : Un-à-plusieurs (Un terrain peut avoir plusieurs réservations).

#### Représentation des Relations

- `User.id` ---< `Reservation.user_id`
- `Courts.id` ---< `Reservation.courts_id`

> Les symboles ---< indiquent une relation de un-à-plusieurs.

### Remarques
- J'ai travaillé avec `fetch` pour le côté client de la page admin et son fichier est `admin.html`.
- Si vous souhaitez ajouter JWT à une ressource, il suffit d'ajouter la variable `verifyToken` à l'entrée de la fonction de la ressource.
- Pour supprimer l'authentification JWT d'une ressource, il suffit de supprimer `verifyToken` de l'entrée de la fonction.
- Je n'ai pas travaillé avec `HAL`.
### Références

Ce projet a été réalisé en utilisant diverses ressources pour guider la conception et le développement. Voici une liste des références principales qui ont été consultées :

#### Documentation Officielle
- [Express.js Documentation](https://expressjs.com/): Guide et référence officiels pour Express.js.
- [Node.js Documentation](https://nodejs.org/en/docs/): Documentation officielle de Node.js pour le développement backend.

#### Livres
- "Learning Node.js: A Hands-On Guide to Building Web Applications in JavaScript" par Marc Wandschneider: Un guide approfondi sur Node.js.

  
#### Forums et Communautés
- [Stack Overflow](https://stackoverflow.com/): Questions et réponses sur des problèmes spécifiques rencontrés pendant le développement.
- [Reddit/r/node](https://www.reddit.com/r/node/): Discussions et conseils de la communauté Node.js.

Chaque ressource a contribué d'une manière unique à la réalisation de ce projet. Les documentations officielles ont fourni une base solide, tandis que les livres, articles, et tutoriels ont offert des perspectives et des approfondissements spécifiques. Les forums et les communautés ont été indispensables pour résoudre les problèmes et apprendre des expériences des autres. Un grand merci à tous les auteurs et contributeurs de ces ressources !
