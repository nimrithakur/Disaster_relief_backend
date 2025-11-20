const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = { id: decoded.id };
      next();
    } catch (err) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
});

exports.requireRole = (roles = []) => (req, res, next) => {
  // roles: array of allowed roles
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });
  User.findById(req.user.id).then(user => {
    if (!user) return res.status(401).json({ message: 'Not authorized' });
    if (roles.length && !roles.includes(user.role)) return res.status(403).json({ message: 'Forbidden' });
    req.user.role = user.role;
    next();
  }).catch(err => next(err));
};
