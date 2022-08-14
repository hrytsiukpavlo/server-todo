const Router = require('express');

const router = new Router();
const authMiddleware = require('./middleware/authMiddleware');
const {
  getNotes, postNote, getNote, putNote, patchNote, deleteNote,
} = require('./noteController');

router.get('/', authMiddleware, getNotes);
router.post('/', authMiddleware, postNote);
router.get('/:id', authMiddleware, getNote);
router.put('/:id', authMiddleware, putNote);
router.patch('/:id', authMiddleware, patchNote);
router.delete('/:id', authMiddleware, deleteNote);

module.exports = router;
