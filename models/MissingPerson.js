const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  text: String
}, { _id: false });

const MissingPersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  gender: String,
  lastSeenLocation: locationSchema,
  dateMissing: { type: Date, default: Date.now },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  photos: [String],
  status: { type: String, enum: ['missing', 'found'], default: 'missing' },
  foundReport: { type: mongoose.Schema.Types.ObjectId, ref: 'FoundReport' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MissingPerson', MissingPersonSchema);
