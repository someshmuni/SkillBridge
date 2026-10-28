const router = require('express').Router();

const { getUsers } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/users', getUsers);

module.exports = router;