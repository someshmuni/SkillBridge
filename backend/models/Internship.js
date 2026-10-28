const mongoose = require('mongoose');
const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  location: { type: String, default: 'India' },
  workMode: { type: String, enum: ['Remote', 'Hybrid', 'On-site'], default: 'Remote' },
  stipend: { type: String, default: 'Unpaid' },
  duration: { type: String, default: '3 months' },
  description: { type: String, default: '' },
  requiredSkills: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
module.exports = mongoose.model('Internship', internshipSchema);
