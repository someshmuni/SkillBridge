
const User = require('../models/User');
const Application = require('../models/Application');

exports.getAnalytics = async (req, res, next) => {
  try {
    const [
      totalStudents,
      totalApplications,
      totalInternships,
      statusBreakdown,
      registrations,
      applicationTrends,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),

      Application.countDocuments(),

      require('../models/Internship').countDocuments(),

      Application.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      User.aggregate([
        { $match: { role: 'student' } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),

      Application.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        totalStudents,
        totalApplications,
        totalInternships,
        statusBreakdown: statusBreakdown.map((item) => ({
          status: item._id,
          count: item.count,
        })),
        registrations: registrations.map((item) => ({
          month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
          count: item.count,
        })),
        applicationTrends: applicationTrends.map((item) => ({
          month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
          count: item.count,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};
