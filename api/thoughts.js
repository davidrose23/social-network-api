const router = require('express').Router();
const { Thought, User } = require('../models');

// GET all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.status(200).json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a single thought and its reactions by id
router.get('/:id', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id).populate('reactions');
    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});


// POST to create a new thought
router.post('/', async (req, res) => {
  try {
    const { thoughtText, username, user } = req.body;
    const thought = await Thought.create({ thoughtText, username, user });
    await User.findByIdAndUpdate(user, { $push: { thoughts: thought._id } });
    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT to update a thought by _id
router.put('/:id', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE to remove a thought by _id
router.delete('/:id', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(thought.userId, { $pull: { thoughts: thought._id } });
    res.status(200).json({ message: 'Thought has been deleted.' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST to create a reaction stored in a single thought's reactions array field
router.post('/:id/reactions', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(req.params.id, { $push: { reactions: req.body } }, { new: true });
    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});


// DELETE to pull and remove a reaction by the reaction's reactionId value
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, { $pull: { reactions: { reactionId: req.params.reactionId } } }, { new: true });
    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
