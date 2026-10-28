
const router = require('express').Router();

const { getAnalytics } = require('../controllers/adminAnalyticsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);
router.get('/', getAnalytics);

module.exports = router;
