const asyncHandler = require('express-async-handler');
const Donation = require('../models/Donation');

exports.createDonation = asyncHandler(async (req, res) => {
  const { type, amount, description, lat, lng, locationText } = req.body;
  const d = await Donation.create({
    type,
    amount: amount ? Number(amount) : undefined,
    description,
    donor: req.user ? req.user.id : undefined,
    location: { lat: lat ? Number(lat) : undefined, lng: lng ? Number(lng) : undefined, text: locationText }
  });
  const io = req.app.get('io');
  io && io.emit('new-donation', { id: d._id, type: d.type, amount: d.amount });
  res.status(201).json(d);
});

exports.listDonations = asyncHandler(async (req, res) => {
  const items = await Donation.find().sort({ createdAt: -1 }).limit(200).populate('donor');
  res.json(items);
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const d = await Donation.findById(req.params.id);
  if (!d) return res.status(404).json({ message: 'Not found' });
  d.status = status;
  await d.save();
  res.json(d);
});

exports.totals = asyncHandler(async (req, res) => {
  const totals = await Donation.aggregate([
    { $group: { _id: '$type', totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } }
  ]);
  res.json(totals);
});
