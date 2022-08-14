const Router = require('express');

const router = new Router();
const { check } = require('express-validator');
const controller = require('./authController');

router.post('/register', [check('username', 'Username can not be empty').notEmpty(), check('password', 'Password shoud be more than 4 and less than 10 symbols').isLength({ min: 4, max: 10 })], controller.register);
router.post('/login', controller.login);

module.exports = router;
