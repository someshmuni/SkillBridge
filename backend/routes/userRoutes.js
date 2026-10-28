const router = require('express').Router();
const { updateProfile, addSkill, removeSkill } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
router.use(protect);
router.put('/profile', updateProfile);
router.post('/skills', addSkill);
router.delete('/skills/:skill', removeSkill);
module.exports = router;
