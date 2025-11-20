const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  text: String
}, { _id: false });

const DonationSchema = new mongoose.Schema({
  type: { type: String, enum: ['money', 'food', 'clothes', 'other'], default: 'other' },
  amount: Number,
  description: String,
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pledged', 'collected', 'delivered'], default: 'pledged' },
  location: locationSchema,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', DonationSchema);
