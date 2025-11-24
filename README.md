# 🌍 Real-Time Visitor Tracker - Integration Demo

> **Projet Web 3** | Microservice de suivi de visiteurs en temps réel

Ce dépôt contient le code source d'un microservice (`visitor-tracker`) permettant de comptabiliser les visiteurs d'un site web en temps réel et d'afficher leur géolocalisation (sous réserve d'autorisation), ainsi qu'une application de démonstration complète (Frontend + Backend) illustrant son intégration.

---

## 👥 L'Équipe

Projet réalisé par :
* **Gana Kamal**
* **Assia Chahid**
* **Larisa Coita**
* **Sacha Croon**
* **Kashvi Kapoor**

---

## 📂 Structure du Projet

Le projet est divisé en trois modules distincts :

### 1. `visitor-tracker` (Le Microservice) 🚀
C'est le cœur du projet. Il s'agit du service autonome responsable de la logique de tracking.
* **Fonctionnalité :** API pour incrémenter/décrémenter le nombre de visiteurs et récupérer les données de géolocalisation.
* **Documentation :** Pour les détails techniques, l'installation et l'API, **[voir le README du dossier visitor-tracker](./visitor-tracker/README.md)**.

### 2. `frontend` (Client de Démo) 🎨
Une application web (React/Vite) qui consomme le microservice pour démontrer l'affichage côté client.
* Affiche le compteur en direct.
* Demande la permission de localisation à l'utilisateur.

### 3. `backend` (Serveur de Démo) ⚙️
Un serveur d'application qui simule une intégration "business" du tracker, montrant comment un backend tiers peut interagir avec le service de tracking.

---

## 🌟 Fonctionnalités Clés

* **Comptage en Temps Réel :** Mise à jour instantanée du nombre de visiteurs connectés (via WebSockets ou Polling).
* **Géolocalisation :** Affichage de l'origine des visiteurs (Pays/Ville) lorsque l'utilisateur autorise le partage de sa position.
* **Architecture Modulaire :** Séparation claire entre le service de tracking et les applications qui l'utilisent.

---

## 🚀 Installation et Lancement

Pour tester l'ensemble de l'écosystème, vous devez lancer les services dans l'ordre suivant :

1.  **Démarrer le Tracker :**
    ```bash
    cd visitor-tracker
    # Voir les instructions spécifiques dans le readme présent dans le dossier
    ```

2.  **Démarrer le Backend de démo :**
    ```bash
    cd backend
    npm install && npm start
    ```

3.  **Démarrer le Frontend :**
    ```bash
    cd frontend
    npm install && npm run dev
    ```

---

*Ce projet a été développé dans le cadre du cours de Développement Web Avancé (Web 3).*
