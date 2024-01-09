const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

// Middleware d'authentification pour les routes liées aux groupes d'administration
const authMiddleware = require('../middlewares/authenticationMiddleware');
// Route pour afficher la liste des groupes à l'administrateur

router.get('/admin', authMiddleware.authenticateAdmin, groupController.adminGroups);
// Route pour afficher les membres d'un groupe à l'administrateur
router.get('/admin/:groupId/members', authMiddleware.authenticateAdmin, groupController.viewGroupMembers);
// Route pour supprimer un groupe à l'administrateur
router.post('/admin/:groupId/delete', authMiddleware.authenticateAdmin, groupController.deleteGroup);

// Création d'un groupe avec une fonction de rappel
router.post('/create', groupController.createGroup);

// Invitation de membres avec une fonction de rappel 
router.post('/invite', groupController.inviteMembers);

// Réponse aux invitations avec une fonction de rappel
router.post('/respond', groupController.respondToInvitation);

// Suppression d'un groupe
router.delete('/:groupId', groupController.deleteGroup);

// Obtenir la liste des groupes
router.get('/', async (req, res) => {
  try {
    res.send('Liste des groupes');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
