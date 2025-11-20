const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  text: String
}, { _id: false });

const FoundReportSchema = new mongoose.Schema({
  missingPerson: { type: mongoose.Schema.Types.ObjectId, ref: 'MissingPerson', required: true },
  foundBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  location: locationSchema,
  photos: [String],
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FoundReport', FoundReportSchema);
