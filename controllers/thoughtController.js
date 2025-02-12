const { Thought, User } = require('../models');

const thoughtController = {
  // GET all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .select('-__v')
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => res.status(500).json(err));
  },
  // GET a single thought by its _id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.thoughtId })
      .select('-__v')
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.status(500).json(err));
  },
  // POST a new thought and push its _id to the associated user's thoughts array field
  createThought({ body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'Thought created but no user found with this id!' });
        }
        res.json({ message: 'Thought successfully created!' });
      })
      .catch((err) => res.status(500).json(err));
  },
  // PUT to update a thought by its _id
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.status(500).json(err));
  },
  // DELETE to remove a thought by its _id and pull it from the associated user's thoughts array
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        return User.findOneAndUpdate(
          { username: dbThoughtData.username },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        );
      })
      .then(() => res.json({ message: 'Thought deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  // POST to add a reaction stored in a thought's reactions array field
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.status(500).json(err));
  },
  // DELETE to remove a reaction by its reactionId from a thought's reactions array
  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.status(500).json(err));
  },
};

module.exports = thoughtController;
