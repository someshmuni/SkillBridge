const User = require('../models/User');
const Application = require('../models/Application');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'student' })
      .select('name email role university degree targetRole skills createdAt')
      .sort({ createdAt: -1 })
      .lean();

    const applications = await Application.find()
      .populate('internship', 'title company location workMode stipend')
      .select('user internship status matchPercentage notes createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean();

    const usersWithApplications = users.map((user) => ({
      ...user,
      applications: applications
        .filter((application) =>
          application.user.toString() === user._id.toString()
        )
        .map((application) => ({
          _id: application._id,
          internship: application.internship,
          status: application.status,
          matchPercentage: application.matchPercentage,
          notes: application.notes,
          appliedAt: application.createdAt,
          updatedAt: application.updatedAt,
        })),
    }));

    res.json({
      count: usersWithApplications.length,
      users: usersWithApplications,
    });
  } catch (err) {
    next(err);
  }
};