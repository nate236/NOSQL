// controllers/userController.js
const { User, Thought } = require('../models');

const userController = {
  // GET all users
  getAllUsers(req, res) {
    User.find({})
      .populate({ path: 'thoughts', select: '-__v' })
      .populate({ path: 'friends', select: '-__v' })
      .select('-__v')
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(500).json(err));
  },
  // GET a single user by its _id and populate thought and friend data
  getUserById({ params }, res) {
    User.findOne({ _id: params.userId })
      .populate({ path: 'thoughts', select: '-__v' })
      .populate({ path: 'friends', select: '-__v' })
      .select('-__v')
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(500).json(err));
  },
  // POST a new user
  createUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(500).json(err));
  },
  // PUT to update a user by its _id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.userId }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(500).json(err));
  },
  // DELETE a user by its _id (BONUS: Remove associated thoughts)
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.userId })
      .then((deletedUser) => {
        if (!deletedUser) {
          return res.status(404).json({ message: 'No user with this id!' });
        }
        return Thought.deleteMany({ _id: { $in: deletedUser.thoughts } });
      })
      .then(() => res.json({ message: 'User and associated thoughts deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  // POST to add a friend to a user's friend list
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(500).json(err));
  },
  // DELETE to remove a friend from a user's friend list
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(500).json(err));
  },
};

module.exports = userController;
