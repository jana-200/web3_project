# 📚 Guide Complet - Visitor Tracker

## 🎯 Comment fonctionne le projet concrètement ?

### Architecture générale

Le projet est un **microservice en temps réel** qui fonctionne en deux parties :

1. **Serveur Node.js** (backend)
   - Express.js : sert les fichiers statiques et expose l'API REST
   - Socket.io : gère les connexions WebSocket en temps réel
   - VisitorManager : stocke en mémoire la liste des visiteurs connectés

2. **Client Web** (frontend)
   - Interface HTML/CSS/JS qui se connecte au serveur via Socket.io
   - Demande la géolocalisation du navigateur
   - Affiche une carte interactive avec les positions des visiteurs

### Flux de données détaillé

#### 1. Connexion d'un visiteur

```
Client (navigateur)
    ↓
    Connexion WebSocket via Socket.io
    ↓
Serveur reçoit l'événement 'connection'
    ↓
VisitorManager.addVisitor(socketId)
    ↓
Serveur émet 'visitor-count' au nouveau client
    ↓
Serveur émet 'visitor-joined' à tous les autres clients
```

**Code correspondant :**
- `src/socket/socketHandler.js` lignes 7-21
- `src/utils/visitorManager.js` méthode `addVisitor()`

#### 2. Partage de localisation

```
Client demande la géolocalisation (navigateur)
    ↓
Client émet 'location' avec { lat, lng }
    ↓
Serveur reçoit l'événement 'location'
    ↓
VisitorManager.updateVisitorLocation(socketId, location)
    ↓
Serveur émet 'visitor-location' à tous les autres clients
    ↓
Serveur émet 'all-locations' au client qui a partagé sa position
```

**Code correspondant :**
- `public/app.js` lignes 150-160 (demande de géolocalisation)
- `public/app.js` lignes 192-196 (émission de la localisation)
- `src/socket/socketHandler.js` lignes 24-44 (traitement serveur)

#### 3. Déconnexion d'un visiteur

```
Client ferme l'onglet/navigateur
    ↓
Socket.io détecte la déconnexion
    ↓
Serveur reçoit l'événement 'disconnect'
    ↓
VisitorManager.removeVisitor(socketId)
    ↓
Serveur émet 'visitor-left' à tous les clients restants
```

**Code correspondant :**
- `src/socket/socketHandler.js` lignes 61-72

### Stockage des données

⚠️ **Important** : Les données sont stockées **en mémoire** (dans un `Map` JavaScript).

- ✅ **Avantages** : Ultra rapide, pas de base de données nécessaire
- ⚠️ **Limitations** : 
  - Les données sont perdues au redémarrage du serveur
  - Ne fonctionne pas en mode cluster (plusieurs instances)
  - Limité par la mémoire disponible

Pour la production avec persistance, vous devriez ajouter une base de données (Redis, MongoDB, etc.).

---

## 🔧 SOCKET_PATH : Dois-je le changer et pourquoi ?

### Qu'est-ce que SOCKET_PATH ?

`SOCKET_PATH` est le **chemin URL** utilisé par Socket.io pour établir la connexion WebSocket.

Par défaut : `/socket.io`

### Quand et pourquoi le changer ?

#### ✅ **Vous DEVEZ changer SOCKET_PATH si :**

1. **Vous utilisez un reverse proxy (Nginx, Apache, Cloudflare)**
   - Si votre application principale utilise déjà `/socket.io` pour autre chose
   - Pour éviter les conflits de routes

2. **Vous intégrez dans un projet existant**
   - Votre site principal est sur `https://monsite.com`
   - Le microservice est sur `https://tracker.monsite.com`
   - Vous voulez un chemin personnalisé comme `/visitor-tracker/socket.io`

3. **Sécurité et isolation**
   - Pour masquer que vous utilisez Socket.io (sécurité par l'obscurité)
   - Pour éviter les conflits avec d'autres services

#### ❌ **Vous N'AVEZ PAS besoin de le changer si :**

- Vous déployez le microservice sur un **domaine/sous-domaine séparé**
- C'est votre seul service Socket.io
- Vous utilisez le service de manière isolée

### Exemples concrets

#### Exemple 1 : Déploiement isolé (pas besoin de changer)

```
Microservice : https://tracker.monsite.com
SOCKET_PATH = /socket.io (défaut)
```

**Client se connecte :**
```javascript
const socket = io('https://tracker.monsite.com', {
  path: '/socket.io'  // Par défaut
});
```

#### Exemple 2 : Intégration dans un projet existant (changer nécessaire)

```
Site principal : https://monsite.com
Microservice : https://monsite.com/api/tracker
SOCKET_PATH = /api/tracker/socket.io
```

**Client se connecte :**
```javascript
const socket = io('https://monsite.com', {
  path: '/api/tracker/socket.io'  // Chemin personnalisé
});
```

#### Exemple 3 : Reverse proxy Nginx (changer recommandé)

**Configuration Nginx :**
```nginx
location /visitor-tracker/ {
    proxy_pass http://localhost:3000/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

**Configuration .env :**
```env
SOCKET_PATH=/visitor-tracker/socket.io
```

---

## 🚀 Déploiement en production

### Option 1 : Déploiement avec Docker (Recommandé)

#### Étape 1 : Préparer l'environnement

Créez un fichier `.env` pour la production :

```env
PORT=3000
CORS_ORIGIN=https://monsite.com,https://autre-site.com
SOCKET_PATH=/socket.io
```

#### Étape 2 : Construire et déployer

```bash
# Construire l'image Docker
docker build -t visitor-tracker:latest .

# Lancer le conteneur
docker run -d \
  --name visitor-tracker \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  visitor-tracker:latest
```

#### Étape 3 : Avec Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  visitor-tracker:
    build: .
    container_name: visitor-tracker-prod
    ports:
      - "3000:3000"
    env_file:
      - .env
    restart: always
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Option 2 : Déploiement sur Render

#### Étape 1 : Préparer le repository

Assurez-vous que votre code est sur GitHub/GitLab.

#### Étape 2 : Créer un nouveau service Web sur Render

1. Allez sur [render.com](https://render.com)
2. Cliquez sur "New +" → "Web Service"
3. Connectez votre repository
4. Configurez :
   - **Name** : `visitor-tracker`
   - **Environment** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Plan** : Free ou Paid selon vos besoins

#### Étape 3 : Configurer les variables d'environnement

Dans les paramètres du service, ajoutez :

```
PORT=10000
CORS_ORIGIN=https://votre-site.com,https://autre-site.com
SOCKET_PATH=/socket.io
```

⚠️ **Note** : Render utilise le port défini dans `PORT` ou un port aléatoire. Utilisez `10000` ou laissez Render gérer automatiquement.

#### Étape 4 : Déployer

Render déploiera automatiquement à chaque push sur la branche principale.

### Option 3 : Déploiement sur un VPS (DigitalOcean, AWS, etc.)

#### Étape 1 : Se connecter au serveur

```bash
ssh user@votre-serveur.com
```

#### Étape 2 : Installer Node.js et Docker

```bash
# Installer Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

#### Étape 3 : Cloner et configurer

```bash
git clone https://github.com/cynaxo/visitor-tracker.git
cd visitor-tracker
npm install --production

# Créer le fichier .env
nano .env
```

#### Étape 4 : Utiliser PM2 pour la gestion du processus

```bash
# Installer PM2 globalement
sudo npm install -g pm2

# Démarrer l'application
pm2 start src/index.js --name visitor-tracker

# Sauvegarder la configuration
pm2 save

# Configurer le démarrage automatique
pm2 startup
```

#### Étape 5 : Configurer Nginx comme reverse proxy

```bash
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/visitor-tracker
```

**Configuration Nginx :**
```nginx
server {
    listen 80;
    server_name tracker.votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/visitor-tracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Étape 6 : Configurer SSL avec Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d tracker.votre-domaine.com
```

### Checklist de production

- [ ] Variables d'environnement configurées (`.env`)
- [ ] CORS configuré avec les bons domaines
- [ ] HTTPS activé (SSL/TLS)
- [ ] Process manager configuré (PM2, Docker, etc.)
- [ ] Monitoring en place (logs, alertes)
- [ ] Backup de la configuration
- [ ] Firewall configuré (port 3000 si nécessaire)
- [ ] Reverse proxy configuré (Nginx, Apache)

---

## 🧪 Projet de test d'intégration

Un projet d'exemple a été créé dans le dossier `Intégration-microservice-newproject/` pour démontrer comment intégrer le microservice visitor-tracker dans un autre projet.

### Objectif du projet de test

Ce projet sert de **référence et de test** pour l'intégration du microservice. Il montre :
- Comment se connecter au microservice via Socket.io depuis un projet externe
- Comment recevoir et afficher les données en temps réel
- Comment partager les mêmes données entre plusieurs projets

### Utilisation du projet de test

1. **Démarrer le microservice** (visitor-tracker) :
```bash
cd visitor-tracker
npm start
```

2. **Démarrer le projet de test** :
```bash
cd Intégration-microservice-newproject
npm install
npm start
```

3. **Ouvrir les deux interfaces** :
   - `http://localhost:3000` → Interface du microservice
   - `http://localhost:3001` → Projet de test d'intégration

Les deux projets partagent les mêmes données en temps réel via Socket.io !

### ⚠️ Important : Redémarrage après modification de config.js

Si vous modifiez le fichier `config/config.js` du microservice (par exemple pour changer les ports CORS ou le SOCKET_PATH), **vous devez redémarrer le serveur** pour que les changements prennent effet :

```bash
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer
npm start
```

**Pourquoi ?** Le fichier `config.js` est chargé au démarrage du serveur. Les modifications ne sont prises en compte qu'après un redémarrage complet.

**Note :** Si vous utilisez des variables d'environnement (fichier `.env`), vous devrez également redémarrer le serveur après modification.

---

## 🔗 Intégration dans différents projets

### Scénario 1 : Intégration simple (domaine séparé)

Le microservice est déployé sur un domaine/sous-domaine séparé.

**Configuration :**
- Microservice : `https://tracker.monsite.com`
- Site principal : `https://monsite.com`

**Code d'intégration dans votre site :**

```html
<!-- Dans votre site principal -->
<script src="https://cdn.socket.io/4.6.1/socket.io.min.js"></script>
<script>
  // Se connecter au microservice
  const socket = io('https://tracker.monsite.com', {
    path: '/socket.io'
  });

  // Envoyer la localisation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      socket.emit('location', {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });
  }

  // Écouter les mises à jour
  socket.on('visitor-count', (data) => {
    document.getElementById('visitor-count').textContent = data.count;
  });
</script>
```

### Scénario 2 : Intégration avec chemin personnalisé

Le microservice est sur le même domaine mais avec un chemin spécifique.

**Configuration :**
- Site principal : `https://monsite.com`
- Microservice : `https://monsite.com/api/tracker`
- `SOCKET_PATH=/api/tracker/socket.io`

**Code d'intégration :**

```html
<script src="https://cdn.socket.io/4.6.1/socket.io.min.js"></script>
<script>
  const socket = io('https://monsite.com', {
    path: '/api/tracker/socket.io'  // Chemin personnalisé
  });

  // ... reste du code identique
</script>
```

### Scénario 3 : Intégration avec React

**Installation :**
```bash
npm install socket.io-client
```

**Composant React :**

```jsx
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function VisitorTracker() {
  const [visitorCount, setVisitorCount] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Se connecter au microservice
    const newSocket = io('https://tracker.monsite.com', {
      path: '/socket.io'
    });

    setSocket(newSocket);

    // Écouter les mises à jour
    newSocket.on('visitor-count', (data) => {
      setVisitorCount(data.count);
    });

    // Envoyer la localisation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        newSocket.emit('location', {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }

    // Nettoyage à la déconnexion
    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <div>
      <p>Visiteurs connectés : {visitorCount}</p>
    </div>
  );
}

export default VisitorTracker;
```

### Scénario 4 : Intégration avec Vue.js

**Installation :**
```bash
npm install socket.io-client
```

**Composant Vue :**

```vue
<template>
  <div>
    <p>Visiteurs connectés : {{ visitorCount }}</p>
  </div>
</template>

<script>
import { io } from 'socket.io-client';

export default {
  name: 'VisitorTracker',
  data() {
    return {
      visitorCount: 0,
      socket: null
    };
  },
  mounted() {
    // Se connecter au microservice
    this.socket = io('https://tracker.monsite.com', {
      path: '/socket.io'
    });

    // Écouter les mises à jour
    this.socket.on('visitor-count', (data) => {
      this.visitorCount = data.count;
    });

    // Envoyer la localisation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.socket.emit('location', {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  },
  beforeUnmount() {
    // Nettoyer la connexion
    if (this.socket) {
      this.socket.close();
    }
  }
};
</script>
```

### Scénario 5 : Utilisation de l'API REST uniquement

Si vous ne voulez pas utiliser Socket.io, vous pouvez utiliser uniquement l'API REST :

```javascript
// Récupérer le nombre de visiteurs
async function getVisitorCount() {
  const response = await fetch('https://tracker.monsite.com/api/visitors');
  const data = await response.json();
  console.log('Visiteurs connectés:', data.count);
  return data.count;
}

// Récupérer toutes les localisations
async function getVisitorLocations() {
  const response = await fetch('https://tracker.monsite.com/api/visitors/locations');
  const data = await response.json();
  console.log('Localisations:', data.visitors);
  return data.visitors;
}

// Polling toutes les 5 secondes
setInterval(getVisitorCount, 5000);
```

### Scénario 6 : Intégration avec plusieurs projets simultanément

Le microservice peut servir **plusieurs projets en même temps** grâce à CORS.

**Configuration .env :**
```env
CORS_ORIGIN=https://site1.com,https://site2.com,https://site3.com
```

**Dans chaque projet :**
```javascript
// Site 1
const socket1 = io('https://tracker.monsite.com', {
  path: '/socket.io'
});

// Site 2
const socket2 = io('https://tracker.monsite.com', {
  path: '/socket.io'
});

// Les deux sites partagent les mêmes données en temps réel !
```

### Exemple complet : Widget de compteur de visiteurs

Créez un widget réutilisable :

```html
<!-- widget.html -->
<div id="visitor-tracker-widget">
  <span id="visitor-count">0</span> visiteurs en ligne
</div>

<script>
(function() {
  const TRACKER_URL = 'https://tracker.monsite.com';
  const socket = io(TRACKER_URL, {
    path: '/socket.io'
  });

  socket.on('visitor-count', (data) => {
    document.getElementById('visitor-count').textContent = data.count;
  });

  // Envoyer la localisation si autorisée
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      socket.emit('location', {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });
  }
})();
</script>
```

**Utilisation dans n'importe quel site :**
```html
<script src="https://tracker.monsite.com/widget.js"></script>
```

---

## 📋 Résumé des étapes pour la production

### 1. Préparation

```bash
# Cloner le projet
git clone https://github.com/votre-repo/visitor-tracker.git
cd visitor-tracker

# Installer les dépendances
npm install
```

### 2. Configuration

```bash
# Créer le fichier .env
cp env.example .env
nano .env
```

**Contenu de .env pour production :**
```env
PORT=3000
CORS_ORIGIN=https://monsite.com,https://autre-site.com
SOCKET_PATH=/socket.io
```

### 3. Déploiement

**Option A - Docker :**
```bash
docker build -t visitor-tracker .
docker run -d -p 3000:3000 --env-file .env visitor-tracker
```

**Option B - PM2 :**
```bash
npm install -g pm2
pm2 start src/index.js --name visitor-tracker
pm2 save
pm2 startup
```

### 4. Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name tracker.monsite.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 5. SSL (Let's Encrypt)

```bash
certbot --nginx -d tracker.monsite.com
```

### 6. Intégration dans vos projets

Ajoutez le code Socket.io dans vos sites web (voir exemples ci-dessus).

---

## ❓ Questions fréquentes

### Q: Les données sont-elles persistantes ?

**R:** Non, les données sont stockées en mémoire. Au redémarrage du serveur, toutes les données sont perdues. Pour la persistance, ajoutez Redis ou une base de données.

### Q: Combien de visiteurs peut supporter le service ?

**R:** Cela dépend de votre serveur. En général, Socket.io peut gérer des milliers de connexions simultanées sur un serveur standard. Pour plus de capacité, utilisez Redis Adapter avec plusieurs instances.

### Q: Puis-je utiliser ce service sans géolocalisation ?

**R:** Oui ! Les visiteurs sans géolocalisation seront quand même comptés, mais ne seront pas affichés sur la carte.

### Q: Comment sécuriser le service en production ?

**R:** 
- Utilisez HTTPS
- Configurez correctement CORS
- Ajoutez une authentification si nécessaire
- Utilisez un firewall
- Limitez les requêtes (rate limiting)

### Q: Puis-je personnaliser l'interface client ?

**R:** Oui, modifiez les fichiers dans le dossier `public/` (HTML, CSS, JS).

---

