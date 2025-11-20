const asyncHandler = require('express-async-handler');
const MissingPerson = require('../models/MissingPerson');

// Create missing person
exports.createMissing = asyncHandler(async (req, res) => {
  const { name, age, gender, lastSeenText, lat, lng, dateMissing } = req.body;
  // const photos = (req.files || []).map(f => `/uploads/${f.filename}`);
  const photos = (req.files || []).map(f => f.path);

  const mp = await MissingPerson.create({
    name,
    age,
    gender,
    lastSeenLocation: { lat: lat ? Number(lat) : undefined, lng: lng ? Number(lng) : undefined, text: lastSeenText },
    dateMissing: dateMissing || Date.now(),
    reportedBy: req.user.id,
    photos
  });

  // Emit socket event
  const io = req.app.get('io');
  io && io.emit('new-missing', { id: mp._id, name: mp.name, status: mp.status, lastSeenLocation: mp.lastSeenLocation });

  res.status(201).json(mp);
});

// List missing with filters and search (supports q for text search and location)
exports.listMissing = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20, q: search, location } = req.query;
  const q = {};
  if (status) q.status = status;

  // Text search across name and lastSeenLocation.text
  if (search) {
    const re = new RegExp(search, 'i');
    q.$or = [ { name: re }, { 'lastSeenLocation.text': re } ];
  }

  // Location filter (substring match in lastSeenLocation.text)
  if (location) {
    const reLoc = new RegExp(location, 'i');
    q['lastSeenLocation.text'] = reLoc;
  }

  const items = await MissingPerson.find(q).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
  res.json(items);
});

exports.getMissing = asyncHandler(async (req, res) => {
  const item = await MissingPerson.findById(req.params.id).populate('reportedBy').populate('foundReport');
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const item = await MissingPerson.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  item.status = status;
  await item.save();
  const io = req.app.get('io');
  io && io.emit('update-found', { id: item._id, status: item.status });
  res.json(item);
});
