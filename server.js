const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3500;
const path = require('path')
const jwt = require('jsonwebtoken');

// Secret key for JWT
const SECRET_KEY = require('./src/utils/key');
// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  console.log(token)
  if (!token) return res.status(401).send('Unauthorized');

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send('Forbidden');
    req.user = user;
    next();
  });
}
// Securisation de tous les endpoints
// app.get('*', authenticateToken, (req, res) => {
//   // Access is granted if the JWT token is valid
//   res.json({ message: 'This is secure data!' });
// });


// Configuration du middleware pour la gestion des corps de requête JSON
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Importer les différentes routes
const authRoutes = require('./src/routes/authRoutes');
const groupRoutes = require('./src/routes/groupRoutes');
const santaRoutes = require('./src/routes/santaRoutes');
const indexRoute = require('./src/routes/index');
// Branchement des différentes routes
app.use('/auth', authRoutes);
app.use('/groups', groupRoutes);
app.use('/santas', santaRoutes);
app.use('/', indexRoute);
//Indication des fichiers statiques du projet(images, css etc..)
app.use('/', express.static(path.join(__dirname, '/public')))

app.all('*', (req, res) => {
  res.status(404)
  if(req.accepts('html')){
    res.sendfile(path.join(__dirname, 'src', 'views', '404.html'))
  }else if(req.accepts('json')){
    res.json({message: "404 Not Found"})
  }else{
    res.type('txt').send('404 Not Found')
  }
})

// Connecter à la base de données MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/secretSantaDB', {});
const db = mongoose.connection;
// Gérer les erreurs de connexion à la base de données
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to the database');
});

// Définition d'une route de base pour vérifier si le serveur fonctionne
app.get('/', (req, res) => {
  res.send('Le serveur est bien lancé !');
});

//Configuration du point de lancement du serveur
app.listen(PORT, () => {
  console.log(`Le serveur tourne sur le port ${PORT}`);
});
