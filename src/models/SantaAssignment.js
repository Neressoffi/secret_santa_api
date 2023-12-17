const mongoose = require('mongoose');

const santaAssignmentSchema = new mongoose.Schema({
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  santa: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const SantaAssignment = mongoose.model('SantaAssignment', santaAssignmentSchema);

module.exports = SantaAssignment;
