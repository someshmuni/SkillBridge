const router = require('express').Router();
const c = require('../controllers/internshipController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
router.get('/', c.getAll);
router.get('/:id', c.getById);
router.post('/', protect, adminOnly, c.create);
router.put('/:id', protect, adminOnly, c.update);
router.delete('/:id', protect, adminOnly, c.remove);
module.exports = router;
