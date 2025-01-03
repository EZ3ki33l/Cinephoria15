# Utiliser l'image de base Node.js
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install --legacy-peer-deps

# Copier le reste de l'application
COPY . .

# Exposer le port de l'application
EXPOSE 3000

# Définir la commande pour démarrer l'application
CMD ["npm", "run", "dev"]