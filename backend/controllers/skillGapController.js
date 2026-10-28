const Internship = require('../models/Internship');

const RESOURCES = {
  'react.js': { course: 'React - Learn (official docs)', duration: '40 hrs', url: 'https://react.dev/learn' },
  'node.js': { course: 'Node.js Official Guides', duration: '20 hrs', url: 'https://nodejs.org/en/learn' },
  'mongodb': { course: 'MongoDB University Basics', duration: '15 hrs', url: 'https://learn.mongodb.com' },
  'python': { course: 'Python for Everybody', duration: '30 hrs', url: 'https://www.py4e.com' },
  'sql': { course: 'SQLBolt Interactive Lessons', duration: '10 hrs', url: 'https://sqlbolt.com' },
  'docker': { course: 'Docker Getting Started', duration: '8 hrs', url: 'https://docs.docker.com/get-started/' },
  'git': { course: 'Pro Git Book', duration: '6 hrs', url: 'https://git-scm.com/book' },
  'javascript': { course: 'JavaScript.info', duration: '30 hrs', url: 'https://javascript.info' },
  'typescript': { course: 'TypeScript Handbook', duration: '12 hrs', url: 'https://www.typescriptlang.org/docs/' },
  'express.js': { course: 'Express Guide', duration: '8 hrs', url: 'https://expressjs.com/en/starter/installing.html' },
};
const resourceFor = (skill) =>
  RESOURCES[skill.toLowerCase()] || {
    course: `Learn ${skill}`, duration: 'Self-paced',
    url: `https://www.google.com/search?q=${encodeURIComponent('learn ' + skill + ' tutorial')}`,
  };

exports.getInternshipGap = async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ message: 'Internship not found' });
    const have = new Set(req.user.skills.map((s) => s.toLowerCase()));
    const matched = internship.requiredSkills.filter((s) => have.has(s.toLowerCase()));
    const missing = internship.requiredSkills.filter((s) => !have.has(s.toLowerCase()));
    const total = internship.requiredSkills.length;
    res.json({
      internship: { _id: internship._id, title: internship.title, company: internship.company },
      matchPercentage: total ? Math.round((matched.length / total) * 100) : 0,
      matchedSkills: matched,
      missingSkills: missing.map((skill) => ({ skill, resource: resourceFor(skill) })),
    });
  } catch (err) { next(err); }
};

exports.getOverallGap = async (req, res, next) => {
  try {
    const internships = await Internship.find({ isActive: true });
    const demand = {};
    internships.forEach((i) => i.requiredSkills.forEach((s) => {
      const k = s.toLowerCase();
      demand[k] = demand[k] || { skill: s, marketDemandCount: 0 };
      demand[k].marketDemandCount += 1;
    }));
    const have = new Set(req.user.skills.map((s) => s.toLowerCase()));
    const all = Object.entries(demand).sort((a, b) => b[1].marketDemandCount - a[1].marketDemandCount);
    res.json({
      overallAnalysis: {
        userTargetRole: req.user.targetRole,
        matchingAlgorithm: 'Case-insensitive skill frequency matching',
        totalInternshipsAnalyzed: internships.length,
        ownedMarketSkills: all.filter(([k]) => have.has(k)).map(([, v]) => v),
        topMissingSkills: all.filter(([k]) => !have.has(k)).map(([, v]) => ({ ...v, resource: resourceFor(v.skill) })),
      },
    });
  } catch (err) { next(err); }
};
