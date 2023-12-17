const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Importer les différentes routes
const authRoutes = require('./src/routes/authRoutes');
const groupRoutes = require('./src/routes/groupRoutes');
const santaRoutes = require('./src/routes/santaRoutes');

// Configuration du middleware pour la gestion des corps de requête JSON
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Connecter à la base de données MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/secretSantaDB', {});

const db = mongoose.connection;

// Gérer les erreurs de connexion à la base de données
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to the database');
});

// Utilisation des différentes routes
app.use('/auth', authRoutes);
app.use('/groups', groupRoutes);
app.use('/santas', santaRoutes);

// Définition d'une route de base pour vérifier si le serveur fonctionne
app.get('/', (req, res) => {
  res.send('Le serveur est bien lancé !');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Le serveur tourne sur le port ${PORT}`);
});
