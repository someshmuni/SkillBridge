require('dotenv').config();
const mongoose = require('mongoose');
const Internship = require('../models/Internship');

const data = [
  ['Frontend Developer Intern', 'TechNova', 'Bengaluru', 'Hybrid', '₹15,000/mo', '3 months', ['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Git']],
  ['Full-Stack Web Intern', 'CodeCraft', 'Remote', 'Remote', '₹20,000/mo', '6 months', ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'JavaScript']],
  ['Backend Developer Intern', 'ServerSide Labs', 'Pune', 'On-site', '₹18,000/mo', '4 months', ['Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Git']],
  ['Data Analyst Intern', 'DataWise', 'Hyderabad', 'Hybrid', '₹12,000/mo', '3 months', ['Python', 'SQL', 'Excel', 'Power BI']],
  ['DevOps Intern', 'CloudBridge', 'Remote', 'Remote', '₹16,000/mo', '3 months', ['Docker', 'Linux', 'Git', 'AWS', 'CI/CD']],
  ['UI/UX Design Intern', 'PixelPerfect', 'Mumbai', 'Hybrid', '₹10,000/mo', '3 months', ['Figma', 'HTML5', 'CSS3', 'User Research']],
  ['Machine Learning Intern', 'AI Forge', 'Remote', 'Remote', '₹25,000/mo', '6 months', ['Python', 'TensorFlow', 'Pandas', 'SQL', 'Git']],
  ['TypeScript React Intern', 'StackLeap', 'Ahmedabad', 'On-site', '₹14,000/mo', '3 months', ['React.js', 'TypeScript', 'JavaScript', 'Git', 'Tailwind CSS']],
].map(([title, company, location, workMode, stipend, duration, requiredSkills]) => ({
  title, company, location, workMode, stipend, duration, requiredSkills,
  description: `Join ${company} as a ${title} and work on real-world projects with mentorship from experienced engineers.`,
}));

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillbridge');
    await Internship.deleteMany({});
    await Internship.insertMany(data);
    console.log(`Seeded ${data.length} internships`);
  } catch (e) { console.error(e.message); }
  process.exit(0);
})();
