const Group = require('../models/Group');

exports.assignSecretSantas = async (req, res) => {
  try {
    const groupId = req.body.groupId;

    // Récupérer les membres du groupe
    const group = await Group.findById(groupId).populate('members', 'username');
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const participants = group.members;
    const santas = [...participants];

    // Assigner secrètement un "Secret Santa" à chaque participant
    for (let i = 0; i < participants.length; i++) {
      let santaIndex;

      // Sélectionner un "Secret Santa" différent pour chaque participant
      do {
        santaIndex = Math.floor(Math.random() * santas.length);
      } while (santas[santaIndex]._id.toString() === participants[i]._id.toString());

      // Assigner le "Secret Santa"
      participants[i].secretSanta = {
        id: santas[santaIndex]._id,
        username: santas[santaIndex].username,
      };

      // Retirer le "Secret Santa" de la liste des disponibles
      santas.splice(santaIndex, 1);
    }

    // Enregistrer les modifications dans la base de données
    await group.save();

    res.status(200).json({ message: 'Secret Santas assigned successfully', group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
