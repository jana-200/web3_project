// Configuration
const SOCKET_URL = window.location.origin;
const SOCKET_PATH = '/socket.io';

// Initialiser la carte Leaflet
const map = L.map('map').setView([50.8503, 4.3517], 2); // Centré sur Bruxelles par défaut

// Ajouter la couche de tuiles OpenStreetMap 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

// Stockage des marqueurs des visiteurs
const visitorMarkers = new Map();

// Initialiser Socket.io
const socket = io(SOCKET_URL, {
    path: SOCKET_PATH
});

// Éléments DOM
const visitorCountEl = document.getElementById('visitor-count');
const locationCountEl = document.getElementById('location-count');
const connectionStatusEl = document.getElementById('connection-status');

// Gestion de la connexion
socket.on('connect', () => {
    console.log('Connecté au serveur');
    updateConnectionStatus(true);
    
    // Demander le nombre de visiteurs
    socket.emit('get-visitor-count');
    
    // Demander toutes les localisations existantes
    socket.emit('get-all-locations');
    
    // Demander la localisation de l'utilisateur
    requestLocation();
});

socket.on('disconnect', () => {
    console.log('Déconnecté du serveur');
    updateConnectionStatus(false);
});

// Écouter les mises à jour du nombre de visiteurs
socket.on('visitor-count', (data) => {
    visitorCountEl.textContent = data.count;
});

// Écouter les nouvelles localisations
socket.on('visitor-location', (data) => {
    const { visitorId, location } = data;
    updateVisitorMarker(visitorId, location);
    updateLocationCount();
});

// Écouter toutes les localisations
socket.on('all-locations', (data) => {
    const { visitors } = data;
    
    // Supprimer tous les marqueurs existants
    visitorMarkers.forEach(marker => map.removeLayer(marker));
    visitorMarkers.clear();
    
    // Ajouter tous les marqueurs
    visitors.forEach(visitor => {
        if (visitor.location) {
            updateVisitorMarker(visitor.id, visitor.location);
        }
    });
    
    updateLocationCount();
});

// Écouter les événements de connexion/déconnexion
socket.on('visitor-joined', (data) => {
    visitorCountEl.textContent = data.count;
});

socket.on('visitor-left', (data) => {
    const { visitorId, count } = data;
    visitorCountEl.textContent = count;
    
    // Supprimer le marqueur du visiteur déconnecté
    if (visitorMarkers.has(visitorId)) {
        map.removeLayer(visitorMarkers.get(visitorId));
        visitorMarkers.delete(visitorId);
        updateLocationCount();
    }
});

// Fonction pour mettre à jour le marqueur d'un visiteur
function updateVisitorMarker(visitorId, location) {
    const { lat, lng } = location;
    
    // Supprimer l'ancien marqueur s'il existe
    if (visitorMarkers.has(visitorId)) {
        map.removeLayer(visitorMarkers.get(visitorId));
    }
    
    // Créer un nouveau marqueur
    const marker = L.marker([lat, lng], {
        icon: L.divIcon({
            className: 'visitor-marker',
            html: '<div class="marker-pulse"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        })
    }).addTo(map);
    
    marker.bindPopup(`Visiteur: ${visitorId.substring(0, 8)}...`);
    visitorMarkers.set(visitorId, marker);
}

// Fonction pour mettre à jour le nombre de localisations
function updateLocationCount() {
    locationCountEl.textContent = visitorMarkers.size;
}

// Fonction pour mettre à jour le statut de connexion
function updateConnectionStatus(connected) {
    connectionStatusEl.classList.remove('connected', 'disconnected');
    connectionStatusEl.classList.add(connected ? 'connected' : 'disconnected');
    const statusText = connectionStatusEl.querySelector('.status-text');
    if (statusText) {
        statusText.textContent = connected ? 'Connecté' : 'Déconnecté';
    }
}

// Fonction pour demander la localisation de l'utilisateur
function requestLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                // Envoyer la localisation au serveur
                socket.emit('location', location);
                
                // Centrer la carte sur la position de l'utilisateur
                map.setView([location.lat, location.lng], 10);
            },
            (error) => {
                console.warn('Erreur de géolocalisation:', error);
                // Optionnel: utiliser une API de géolocalisation IP en fallback
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
        
        // Surveiller les changements de position
        navigator.geolocation.watchPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                socket.emit('location', location);
            },
            (error) => {
                console.warn('Erreur de suivi de géolocalisation:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 60000 // Mettre à jour toutes les minutes
            }
        );
    } else {
        console.warn('La géolocalisation n\'est pas supportée par ce navigateur');
    }
}

// Ajouter des styles pour les marqueurs
const style = document.createElement('style');
style.textContent = `
    .visitor-marker {
        background: transparent;
        border: none;
    }
    
    .marker-pulse {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #495057;
        border: 2px solid #ffffff;
        box-shadow: 0 0 0 0 rgba(73, 80, 87, 0.4);
        animation: markerPulse 2s infinite;
    }
    
    @keyframes markerPulse {
        0% {
            box-shadow: 0 0 0 0 rgba(73, 80, 87, 0.4);
        }
        70% {
            box-shadow: 0 0 0 8px rgba(73, 80, 87, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(73, 80, 87, 0);
        }
    }
`;
document.head.appendChild(style);

