const router = require('express').Router();
const { User, Thought } = require('../models');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single user by _id and populate thought and friend data
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('thoughts')
      .populate('friends');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});



// POST a new user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT to update a user by _id
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE to remove user by _id and their thoughts
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    await Thought.deleteMany({ _id: { $in: user.thoughts } });
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User and their thoughts have been deleted.' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST to add a new friend to a user's friend list
router.post('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { $addToSet: { friends: req.params.friendId } }, { new: true });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE to remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { $pull: { friends: req.params.friendId } }, { new: true });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
