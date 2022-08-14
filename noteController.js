const jwt = require('jsonwebtoken');
const Note = require('./models/Note');

const secret = process.env.SECRET;

const getNotes = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedData = jwt.verify(token, secret);
    const notes = await Note.find({ userId: decodedData.id });
    res.status(200).json({
      offset: 0,
      limit: 0,
      count: 0,
      notes,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: 'Error' });
  }
};

const postNote = async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Note must be not empty, specify text field' });
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedData = jwt.verify(token, secret);

    const note = new Note({ text, userId: decodedData.id });
    await note.save();
    return res.status(200).json({ message: 'Success', note });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: 'Error' });
  }
};

const getNote = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const noteId = req.params.id;
    const decodedData = jwt.verify(token, secret);

    const note = await Note.findOne({ userId: decodedData.id, _id: noteId });
    if (!note) {
      return res.status(400).json({ message: 'No such note' });
    }
    return res.status(200).json({ note });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: 'Error' });
  }
};

const putNote = async (req, res) => {
  const { text } = req.body;
  try {
    const token = req.headers.authorization.split(' ')[1];
    const noteId = req.params.id;
    const decodedData = jwt.verify(token, secret);
    const note = await Note.findOne({ userId: decodedData.id, _id: noteId });
    if (!note) {
      return res.status(400).json({ message: 'No such note' });
    }
    note.text = text;
    note.save();
    return res.status(200).json({ message: 'Note successfully updated' });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: 'Error' });
  }
};

const patchNote = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const noteId = req.params.id;
    const decodedData = jwt.verify(token, secret);
    const note = await Note.findOne({ userId: decodedData.id, _id: noteId });
    if (!note) {
      return res.status(400).json({ message: 'No such note' });
    }
    note.completed = !note.completed;
    note.save();
    return res.status(200).json({ message: 'Succeffully checked', note });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: 'Error' });
  }
};

const deleteNote = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const noteId = req.params.id;
    const decodedData = jwt.verify(token, secret);
    const note = await Note.findOneAndRemove({ userId: decodedData.id, _id: noteId });
    if (!note) {
      return res.status(400).json({ message: 'No such note' });
    }
    return res.status(200).json({ message: 'Note successfully deleted' });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: 'Error' });
  }
};

module.exports = {
  getNotes,
  postNote,
  getNote,
  putNote,
  patchNote,
  deleteNote,
};
