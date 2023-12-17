const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

// Création d'un groupe avec une fonction de rappel (callback) définie
router.post('/create', groupController.createGroup);

// Invitation de membres avec une fonction de rappel (callback) définie
router.post('/invite', groupController.inviteMembers);

// Réponse aux invitations avec une fonction de rappel (callback) définie
router.post('/respond', groupController.respondToInvitation);

// Obtenir la liste des groupes
router.get('/', async (req, res) => {
  try {
    // Utilisez le modèle ou la fonction appropriée pour obtenir la liste des groupes depuis la base de données
    // Exemple : const groups = await Group.find();
    // Envoyez la liste en tant que réponse
    // Exemple : res.json(groups);
    res.send('Liste des groupes');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
