const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    max: 200,
  },
  image: {
    type: String,
  },
  likes: {
    type: Array,
    default: [],
  },
},
    { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema); 