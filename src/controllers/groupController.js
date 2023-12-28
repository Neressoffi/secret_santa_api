const Group = require('../models/Group');
const User = require('../models/User');

exports.createGroup = async (req, res) => {
  try {
    const { 
      name,
      members
     } = req.body;

    // Créer un nouveau groupe
    const newGroup = new Group({
      name,
      members,
    });

    // Enregistrer le groupe dans la base de données
    await newGroup.save();

    res.status(201).json({ message: 'Groupe créé avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.inviteMembers = async (req, res) => {
  try {
    const { groupId, members } = req.body;

    // Trouver le groupe par ID
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Groupe non trouvé' });
    }

    // Ajouter de nouveaux membres au groupe
    group.members.push(...members);

    // Enregistrer les modifications dans la base de données
    await group.save();

    res.status(200).json({ message: 'Membres invités avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
};

exports.respondToInvitation = async (req, res) => {
  try {
    const { userId, groupId, response } = req.body;

    // Trouver le groupe par ID
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Groupe non trouvé' });
    }

    // Vérifier si l'utilisateur est membre du groupe
    if (!group.members.includes(userId)) {
      return res.status(403).json({ error: 'Utilisateur n est pas membre du groupe.' });
    }

    // Mettre à jour la réponse de l'utilisateur
    const userIndex = group.members.indexOf(userId);
    group.memberResponses[userIndex] = response;

    // Enregistrer les modifications dans la base de données
    await group.save();

    res.status(200).json({ message: 'Réponse enregistrée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

exports.deleteGroup =  async (req, res) => {
  const groupId = req.params.groupId;
 // console.log(groupId)
  try {

    const deletedGroup = await Group.findByIdAndDelete(groupId);

    if (!deletedGroup) {
      return res.status(404).json({ message: 'Groupe non trouvé' });
    }

    return res.json({ message: 'Groupe supprimé avec succès' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};
