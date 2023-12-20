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

    res.status(201).json({ message: 'Group created successfully' });
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
      return res.status(404).json({ error: 'Group not found' });
    }

    // Ajouter de nouveaux membres au groupe
    group.members.push(...members);

    // Enregistrer les modifications dans la base de données
    await group.save();

    res.status(200).json({ message: 'Members invited successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.respondToInvitation = async (req, res) => {
  try {
    const { userId, groupId, response } = req.body;

    // Trouver le groupe par ID
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Vérifier si l'utilisateur est membre du groupe
    if (!group.members.includes(userId)) {
      return res.status(403).json({ error: 'User is not a member of the group' });
    }

    // Mettre à jour la réponse de l'utilisateur
    const userIndex = group.members.indexOf(userId);
    group.memberResponses[userIndex] = response;

    // Enregistrer les modifications dans la base de données
    await group.save();

    res.status(200).json({ message: 'Response recorded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteGroup =  async (req, res) => {
  const groupId = req.params.groupId;
 // console.log(groupId)
  try {

    const deletedGroup = await Group.findByIdAndDelete(groupId);

    if (!deletedGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }

    return res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
