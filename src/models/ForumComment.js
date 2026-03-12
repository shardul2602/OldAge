const mongoose = require('mongoose');

const forumCommentSchema = new mongoose.Schema({
  commentText: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumPost',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ForumComment', forumCommentSchema);
