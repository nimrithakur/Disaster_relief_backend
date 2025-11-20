const asyncHandler = require('express-async-handler');
const FoundReport = require('../models/FoundReport');
const MissingPerson = require('../models/MissingPerson');

exports.createFound = asyncHandler(async (req, res) => {
  const { missingPersonId, notes, lat, lng, locationText } = req.body;
  const photos = (req.files || []).map(f => `/uploads/${f.filename}`);
  const mp = await MissingPerson.findById(missingPersonId);
  if (!mp) return res.status(404).json({ message: 'Missing person not found' });

  const fr = await FoundReport.create({
    missingPerson: mp._id,
    foundBy: req.user.id,
    location: { lat: lat ? Number(lat) : undefined, lng: lng ? Number(lng) : undefined, text: locationText },
    photos,
    notes
  });

  mp.status = 'found';
  mp.foundReport = fr._id;
  await mp.save();

  const io = req.app.get('io');
  io && io.emit('update-found', { id: mp._id, status: mp.status, foundReport: fr });

  // Optionally notify the original reporter - in production you'd lookup and notify via email/push
  res.status(201).json(fr);
});

exports.listFound = asyncHandler(async (req, res) => {
  const items = await FoundReport.find().sort({ createdAt: -1 }).limit(100).populate('foundBy').populate('missingPerson');
  res.json(items);
});
