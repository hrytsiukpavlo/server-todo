const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Credentials = require('./models/Credentials');

const secret = process.env.SECRET;

const generateAccessToken = (id, username) => {
  const payload = {
    id,
    username,
  };

  return jwt.sign(payload, secret);
};

class AutoController {
  // eslint-disable-next-line class-methods-use-this
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Registation error', errors });
      }
      const { username, password } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const user = new User({ username, createdDate: new Date() });
      await user.save();
      const credentials = new Credentials({ username, password: hashPassword });
      await credentials.save();
      return res.json({ message: 'User has been successfully registered' });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: 'Registration error' });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      const credentials = await Credentials.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: `User ${username} was not found` });
      }
      const validPassword = bcrypt.compareSync(password, credentials.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Wrong password' });
      }
      const token = generateAccessToken(user.get('_id'), username);
      return res.json({ message: 'Success', jwt_token: token });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: 'Login error' });
    }
  }
}

module.exports = new AutoController();
