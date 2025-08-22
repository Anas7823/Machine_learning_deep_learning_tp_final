# Détecteur de Marques de Voitures

Une application web qui permet de détecter la marque d'une voiture à partir d'une image en utilisant le machine learning.

## Prérequis

- Node.js (v16 ou supérieur)
- Python (v3.8 ou supérieur)
- MongoDB (pour la base de données)

## Installation

1. Cloner le projet
```bash
git clone <url-du-repo>
cd BrandCar
```
2. Installer les dépendances Python
```bash
python -m venv .venv
source .venv/bin/activate  # Sur Unix/Mac
# OU
.venv\Scripts\activate     # Sur Windows
pip install tensorflow pillow flask flask-cors numpy
```

3. Installer les dépendances du backend Node.js

```bash
cd back
npm install
```

4. Installer les dépendances du frontend

```bash
cd ../front
npm install
```

## Configuration

1. Assurez-vous que le fichier model.h5 est présent dans le dossier racine
2. Vérifiez que le fichier car_brands.json contient les bonnes marques de voitures

## Lancement du projet
1. Démarrer le serveur Python (dans le dossier racine)

```bash
python app.py
```

2. Démarrer le serveur backend Node.js (dans le dossier /back)

```bash
cd back
npm start
```
3. Démarrer le frontend React (dans le dossier /front)

```bash
cd front
npm start
```

## Utilisation

1. Ouvrez votre navigateur et accédez à http://localhost:3000
2. Sélectionnez une image de voiture à analyser
3. Cliquez sur "Analyser l'image"
4. Le résultat de la détection s'affichera avec le pourcentage de confiance

## Structure des ports

- Frontend React: Port 3000
- Backend Node.js: Port 3001
- Serveur Python Flask: Port 5000

## Technologies utilisées

- Frontend: React.js
- Backend: Node.js, Express
- ML Server: Python, Flask, TensorFlow

## Auteur

[Anas7823](https://github.com/Anas7823)