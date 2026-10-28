
const router = require('express').Router();

const {
  getAllApplications,
  updateApplicationStatus,
} = require('../controllers/adminApplicationController');

const {
  protect,
  adminOnly,
} = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/', getAllApplications);
router.put('/:id', updateApplicationStatus);

module.exports = router;
