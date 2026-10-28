
const Application = require('../models/Application');

exports.getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .populate('user', 'name email university degree targetRole skills')
      .populate(
        'internship',
        'title company location workMode stipend requiredSkills'
      )
      .sort({ updatedAt: -1 })
      .lean();

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    const allowedStatuses = [
      'Saved',
      'Applied',
      'Interview',
      'Offer',
      'Rejected',
    ];

    if (status !== undefined && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid application status',
      });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (status !== undefined) application.status = status;
    if (notes !== undefined) application.notes = notes;

    await application.save();

    const updated = await Application.findById(application._id)
      .populate('user', 'name email university degree targetRole skills')
      .populate(
        'internship',
        'title company location workMode stipend requiredSkills'
      );

    res.json({
      success: true,
      message: 'Application updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};
