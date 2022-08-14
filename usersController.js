const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Credentials = require('./models/Credentials');

const secret = process.env.SECRET;

const getMe = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedData = jwt.verify(token, secret);
    if (!(await User.findById(decodedData.id))) {
      res.status(400).json({ message: 'No such user' });
    } else {
      const user = await User.findById(decodedData.id);
      res.status(200).json({ user });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: 'Error' });
  }
};

function compareHash(password, hashed) {
  return bcrypt.compareSync(password, hashed);
}

const patchMe = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedData = jwt.verify(token, secret);
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      res.status(400).json({ message: 'Specify oldPassword or newPassword field' });
    }

    await Credentials.findOne({ username: decodedData.username }).then((credentials) => {
      if (compareHash(oldPassword, credentials.password)) {
        bcrypt.genSalt(7, (errFromSalt, salt) => {
          if (errFromSalt) throw errFromSalt;
          bcrypt.hash(newPassword, salt, (err, hash) => {
            if (err) {
              throw err;
            }
            credentials.set('password', hash);
            credentials.save();
          });
        });
        res.status(200).json({ message: 'Password successfully changed' });
      } else {
        res.status(400).json({ message: 'Wrong password' });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: 'Error' });
  }
};

const deleteMe = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedData = jwt.verify(token, secret);

    if (!(await User.findOne({ username: decodedData.username }))) {
      res.status(400).json({ message: 'User does not exist' });
    } else {
      try {
        await User.findOneAndRemove({ username: decodedData.username });
        await Credentials.findOneAndRemove({ username: decodedData.username });
        res.status(200).json({ message: 'User is successfully deleted' });
      } catch (e) {
        console.log(e);
        res.status(400).json({ message: 'Error' });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: 'Error' });
  }
};

module.exports = {
  getMe,
  patchMe,
  deleteMe,
};
