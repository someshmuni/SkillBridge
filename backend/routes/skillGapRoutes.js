const router = require('express').Router();
const c = require('../controllers/skillGapController');
const { protect } = require('../middleware/authMiddleware');
router.use(protect);
router.get('/overall', c.getOverallGap);
router.get('/internship/:id', c.getInternshipGap);
module.exports = router;
