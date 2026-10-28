const Internship = require('../models/Internship');
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.getAll = async (req, res, next) => {
  try {
    const { search, workMode } = req.query;
    const q = { isActive: true };
    if (workMode) q.workMode = workMode;
    if (search) {
      const rx = new RegExp(esc(search), 'i');
      q.$or = [{ title: rx }, { company: rx }, { requiredSkills: rx }];
    }
    const data = await Internship.find(q).sort({ createdAt: -1 });
    res.json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const item = await Internship.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Internship not found' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await Internship.create(req.body) }); }
  catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Internship.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Internship not found' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await Internship.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Internship not found' });
    res.json({ success: true, message: 'Internship deleted' });
  } catch (err) { next(err); }
};
