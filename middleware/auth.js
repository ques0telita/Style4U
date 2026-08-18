const jwt = require('jsonwebtoken');
const User = require('../models/user');


const userExtractor = async (req, res, next) => {
    try {
        const token = req.cookies.acces_token;
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id);
        req.user = user;
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
    next();
};

const adminExtractor = (req, res, next) => {
  // req.user viene del userExtractor previo
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  next();
};

module.exports = { userExtractor };