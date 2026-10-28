const Application = require('../models/Application');
const Internship = require('../models/Internship');

const matchPct = (userSkills, required) => {
  if (!required.length) return 0;
  const have = new Set(userSkills.map((s) => s.toLowerCase()));
  const hit = required.filter((s) => have.has(s.toLowerCase())).length;
  return Math.round((hit / required.length) * 100);
};

exports.getAll = async (req, res, next) => {
  try {
    const q = { user: req.user._id };
    if (req.query.status) q.status = req.query.status;
    const data = await Application.find(q).populate('internship').sort({ updatedAt: -1 });
    res.json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
};

exports.createOrUpdate = async (req, res, next) => {
  try {
    const { internshipId, status = 'Applied', notes } = req.body;
    const internship = await Internship.findById(internshipId);
    if (!internship) return res.status(404).json({ message: 'Internship not found' });
    const update = { status, matchPercentage: matchPct(req.user.skills, internship.requiredSkills) };
    if (notes !== undefined) update.notes = notes;
    const app = await Application.findOneAndUpdate(
      { user: req.user._id, internship: internshipId }, update,
      { new: true, upsert: true, setDefaultsOnInsert: true });
    res.json({ success: true, message: status === 'Saved' ? 'Internship bookmarked' : `Application marked as ${status}`, data: app });
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const app = await Application.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true, runValidators: true });
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json({ success: true, message: 'Application updated', data: app });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const app = await Application.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json({ success: true, message: 'Application removed' });
  } catch (err) { next(err); }
};

exports.getStats = async (req, res, next) => {
  try {
    const apps = await Application.find({ user: req.user._id }).populate('internship').sort({ updatedAt: -1 });
    const count = (s) => apps.filter((a) => a.status === s).length;
    res.json({
      stats: {
        totalApplications: apps.filter((a) => a.status !== 'Saved').length,
        activeApplications: count('Applied') + count('Interview'),
        interviews: count('Interview'),
        offers: count('Offer'),
      },
      recentApplications: apps.slice(0, 5),
    });
  } catch (err) { next(err); }
};
