const jwt = require('jsonwebtoken');
const User = require('../models/User');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
const clean = (u) => ({
  _id: u._id, name: u.name, email: u.email, role: u.role, university: u.university,
  degree: u.degree, targetRole: u.targetRole, skills: u.skills,
});

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, university, degree, targetRole, skills } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, university, degree, targetRole, skills: skills || [] });
    res.status(201).json({ token: sign(user._id), user: clean(user) });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password || ''))) return res.status(401).json({ message: 'Invalid email or password' });
    res.json({ token: sign(user._id), user: clean(user) });
  } catch (err) { next(err); }
};

exports.getMe = async (req, res) => res.json({ user: clean(req.user) });
