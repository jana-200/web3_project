# visitor-tracker
![Demo](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2F5ZXk4MGk3bzRtNTc5eGZnd2Vsdmg5MWJhN3JuMXMyZXp0djZuMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JVvNVItg3I51n08Th2/giphy.gif)

Projet réalisé dans le cadre du cours de Web3 avancé de l'IPL (Vinci)

## 📋 Description

Ce projet est un microservice en temps réel basé sur Socket.io. Il permet d'afficher le nombre de visiteurs connectés ainsi que leur localisation géographique sur une carte interactive.
Il expose à la fois une API Socket.io et une API REST, ce qui le rend facilement intégrable dans n'importe quel site web.
Déployé séparément (par exemple via Docker ou Render), il peut servir plusieurs projets simultanément.

## ✨ Fonctionnalités

- ✅ Suivi en temps réel grâce à Socket.io
- ✅ Détection de la connexion et déconnexion des utilisateurs
- ✅ Récupération et diffusion de leur localisation géographique
- ✅ Mise à jour dynamique d'une carte interactive (Leaflet)
- ✅ API REST pour obtenir des informations (comme le nombre de visiteurs)
- ✅ Microservice autonome, simple à déployer et réutilisable dans plusieurs applications

## 📁 Structure du projet

```
visitor-tracker/
├── config/                 # Configuration de l'application
│   └── config.js          # Paramètres (port, CORS, etc.)
├── src/                   # Code source du serveur
│   ├── models/           # Modèles de données
│   │   └── Visitor.js    # Modèle Visitor
│   ├── routes/           # Routes REST API
│   │   └── api.js        # Endpoints API
│   ├── socket/           # Gestion Socket.io
│   │   └── socketHandler.js  # Handlers des événements Socket
│   ├── utils/            # Utilitaires
│   │   └── visitorManager.js # Gestionnaire des visiteurs
│   └── index.js          # Point d'entrée de l'application
├── public/               # Fichiers statiques (client)
│   ├── index.html        # Interface utilisateur
│   ├── styles.css        # Styles CSS
│   └── app.js            # Code client JavaScript
├── Dockerfile            # Configuration Docker
├── docker-compose.yml    # Configuration Docker Compose
├── package.json          # Dépendances Node.js
└── README.md            # Documentation
```

## 🚀 Installation

### Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn

### Installation locale

1. Cloner le repository :
```bash
git clone https://github.com/cynaxo/visitor-tracker.git
cd visitor-tracker
```

2. Installer les dépendances :
```bash
npm install
```

3. Créer un fichier `.env` (optionnel) :
```bash
PORT=3000
CORS_ORIGIN=http://localhost:3000,http://localhost:8080
SOCKET_PATH=/socket.io
```

4. Démarrer le serveur :
```bash
# Mode production
npm start

# Mode développement (avec nodemon)
npm run dev
```

5. Ouvrir votre navigateur à l'adresse : `http://localhost:3000`

## 🐳 Déploiement avec Docker

### Utilisation de Docker Compose (recommandé)

```bash
docker-compose up -d
```

### Utilisation de Docker directement

```bash
# Construire l'image
docker build -t visitor-tracker .

# Lancer le conteneur
docker run -p 3000:3000 visitor-tracker
```

## 📡 API REST

### Endpoints disponibles

#### `GET /api/visitors`
Retourne le nombre de visiteurs connectés.

**Réponse :**
```json
{
  "count": 5,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### `GET /api/visitors/details`
Retourne les détails de tous les visiteurs connectés.

**Réponse :**
```json
{
  "visitors": [
    {
      "id": "socket-id-123",
      "location": { "lat": 50.8503, "lng": 4.3517 },
      "connectedAt": "2024-01-15T10:25:00.000Z",
      "lastUpdate": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### `GET /api/visitors/locations`
Retourne uniquement les visiteurs avec leur localisation.

**Réponse :**
```json
{
  "visitors": [
    {
      "id": "socket-id-123",
      "location": { "lat": 50.8503, "lng": 4.3517 },
      "connectedAt": "2024-01-15T10:25:00.000Z",
      "lastUpdate": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### `GET /api/health`
Endpoint de santé pour vérifier que le service est opérationnel.

**Réponse :**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600
}
```

## 🔌 API Socket.io

### Événements émis par le serveur

- `visitor-count` : Nombre de visiteurs connectés
- `visitor-joined` : Un nouveau visiteur s'est connecté
- `visitor-left` : Un visiteur s'est déconnecté
- `visitor-location` : Mise à jour de la localisation d'un visiteur
- `all-locations` : Toutes les localisations des visiteurs

### Événements écoutés par le serveur

- `location` : Reçoit la localisation d'un client `{ lat, lng }`
- `get-visitor-count` : Demande le nombre de visiteurs
- `get-all-locations` : Demande toutes les localisations

### Exemple d'intégration client

```javascript
const socket = io('http://localhost:3000', {
  path: '/socket.io'
});

// Envoyer sa localisation
socket.emit('location', { lat: 50.8503, lng: 4.3517 });

// Écouter les mises à jour
socket.on('visitor-count', (data) => {
  console.log('Visiteurs connectés:', data.count);
});

socket.on('visitor-location', (data) => {
  console.log('Nouvelle localisation:', data);
});
```

## 🛠️ Technologies utilisées

- **Node.js** : Runtime JavaScript
- **Express** : Framework web
- **Socket.io** : Communication en temps réel
- **Leaflet** : Bibliothèque de cartes interactives
- **Docker** : Conteneurisation

## 📝 Configuration

Les paramètres de configuration peuvent être définis via des variables d'environnement ou dans le fichier `config/config.js` :

- `PORT` : Port du serveur (défaut: 3000)
- `CORS_ORIGIN` : Origines autorisées pour CORS (séparées par des virgules)
- `SOCKET_PATH` : Chemin pour Socket.io (défaut: /socket.io)

## 🔒 Sécurité

- Configurez correctement les origines CORS pour la production
- Utilisez HTTPS en production
- Considérez l'ajout d'une authentification pour les environnements sensibles

## 📄 Licence

MIT


## Photos 
<img width="2789" height="1567" alt="image" src="https://github.com/user-attachments/assets/d52206ff-6b19-4892-875c-66f9105f9e80" />


