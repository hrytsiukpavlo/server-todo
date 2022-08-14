const Router = require('express');

const router = new Router();
const authMiddleware = require('./middleware/authMiddleware');
const { getMe, patchMe, deleteMe } = require('./usersController');

router.get('/me', authMiddleware, getMe);
router.patch('/me', authMiddleware, patchMe);
router.delete('/me', authMiddleware, deleteMe);

module.exports = router;
