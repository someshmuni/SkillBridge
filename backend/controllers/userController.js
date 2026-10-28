const clean = (u) => ({
  _id: u._id, name: u.name, email: u.email, role: u.role, university: u.university,
  degree: u.degree, targetRole: u.targetRole, skills: u.skills,
});

exports.updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    ['name', 'university', 'degree', 'targetRole'].forEach((f) => { if (req.body[f] !== undefined) user[f] = req.body[f]; });
    if (Array.isArray(req.body.skills)) user.skills = req.body.skills;
    await user.save();
    res.json({ message: 'Profile updated', user: clean(user) });
  } catch (err) { next(err); }
};

exports.addSkill = async (req, res, next) => {
  try {
    const skill = (req.body.skill || '').trim();
    if (!skill) return res.status(400).json({ message: 'Skill is required' });
    if (!req.user.skills.some((s) => s.toLowerCase() === skill.toLowerCase())) req.user.skills.push(skill);
    await req.user.save();
    res.json({ message: 'Skill added', user: clean(req.user) });
  } catch (err) { next(err); }
};

exports.removeSkill = async (req, res, next) => {
  try {
    const name = decodeURIComponent(req.params.skill).toLowerCase();
    req.user.skills = req.user.skills.filter((s) => s.toLowerCase() !== name);
    await req.user.save();
    res.json({ message: 'Skill removed', user: clean(req.user) });
  } catch (err) { next(err); }
};
