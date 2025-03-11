# TRAPS Moniteur V1.3.5

## Description

Ce projet est une application de surveillance pour les dispositifs TRAPS, APs et PCs. Il permet de surveiller l'état de la batterie, la connexion WiFi et d'envoyer des notifications aux dispositifs connectés via MQTT.

## Contenu du projet

Le projet contient les fichiers suivants :

- `styles.css` : Fichier de style CSS pour la mise en page et le design de l'application.
- `settings.html` : Page HTML pour la configuration des paramètres du serveur MQTT, des dispositifs TRAPS, APs et PCs.
- `index.html` : Page principale de l'application pour la surveillance en temps réel des dispositifs.
- `js/mqtt_client.js` : Script JavaScript pour la gestion des connexions et des messages MQTT.
- `js/functions_utils.js` : Script JavaScript contenant des fonctions utilitaires pour l'application.
- `Datas/batteryData.json` : Fichier JSON contenant les données de batterie des dispositifs.
- `.vscode/settings.json` : Fichier de configuration pour l'éditeur Visual Studio Code.
- `.gitignore` : Fichier pour ignorer certains fichiers et dossiers dans le contrôle de version Git.

## Installation

1. Clonez le dépôt GitHub sur votre machine locale :
    ```bash
    git clone https://github.com/FranckCCC/TrapsMoniteurMQTT.git
    ```

2. Ouvrez le projet dans votre éditeur de code préféré (par exemple, Visual Studio Code).

3. Assurez-vous d'avoir un serveur web pour servir les fichiers HTML et un broker MQTT pour la communication.

## Utilisation

### Configuration des paramètres

1. Ouvrez le fichier `settings.html` dans votre navigateur web.
2. Configurez les paramètres du serveur MQTT, ajoutez les dispositifs TRAPS, APs et PCs à surveiller.
3. Cliquez sur "Enregistrer les paramètres" pour sauvegarder la configuration.

### Surveillance en temps réel

1. Ouvrez le fichier `index.html` dans votre navigateur web.
2. La page affichera l'état des dispositifs TRAPS, APs et PCs en temps réel.
3. Vous pouvez envoyer des notifications globales ou spécifiques à chaque dispositif.

## Détails des fichiers

### `styles.css`

Ce fichier contient les styles CSS pour la mise en page et le design de l'application. Voici quelques classes importantes :

- `.header` : Style pour l'en-tête de la page.
- `body` : Style global pour le corps de la page.
- `.settings-icon` : Style pour l'icône des paramètres.
- `.settings-container`, `.addition-container`, `.update-container` : Styles pour les différents cadres de la page de paramètres.
- `.device-element`, `.device-message-container` : Styles pour les éléments de dispositif et les messages.

### `settings.html`

Cette page permet de configurer les paramètres du serveur MQTT et d'ajouter les dispositifs à surveiller. Elle contient des formulaires pour entrer les adresses du serveur, les ports, et les informations des dispositifs.

### `index.html`

La page principale de l'application affiche l'état des dispositifs en temps réel. Elle utilise des scripts JavaScript pour se connecter au broker MQTT et recevoir les messages des dispositifs.

### `js/mqtt_client.js`

Ce script gère la connexion au broker MQTT, l'abonnement aux topics, et la réception des messages. Il met à jour l'interface utilisateur en fonction des messages reçus.

### `js/functions_utils.js`

Ce script contient des fonctions utilitaires pour l'application, telles que l'ouverture de la page des paramètres, la conversion du RSSI en pourcentage, et la génération d'icônes de niveau de batterie.

### `Datas/batteryData.json`

Ce fichier JSON contient les données de batterie des dispositifs TRAPS. Il est utilisé pour afficher l'historique des niveaux de batterie dans l'application.




