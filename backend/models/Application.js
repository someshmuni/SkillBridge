const mongoose = require('mongoose');
const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
  status: { type: String, enum: ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'], default: 'Applied' },
  matchPercentage: { type: Number, default: 0 },
  notes: { type: String, default: '' },
}, { timestamps: true });
applicationSchema.index({ user: 1, internship: 1 }, { unique: true });
module.exports = mongoose.model('Application', applicationSchema);
