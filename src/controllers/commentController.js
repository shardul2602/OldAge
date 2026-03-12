const ForumComment = require('../models/ForumComment');
const ForumPost = require('../models/ForumPost');

// Add comment to a post
async function addComment(req, res) {
  try {
    const { commentText, postId } = req.body;
    const userId = req.user._id;

    if (!commentText || !postId) {
      return res.status(400).json({ message: 'Comment text and post ID are required' });
    }

    // Check if post exists and user has access to it
    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Role-based access check (user can only comment on posts they can view)
    if (req.user.role === 'admin') {
      if (!req.homeIds.includes(post.oldAgeHome._id.toString())) {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else if (req.user.role === 'volunteer') {
      if (!req.homeIds.includes(post.oldAgeHome._id.toString())) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }
    // Super Admin can comment on any post

    const comment = await ForumComment.create({
      commentText,
      postId,
      userId
    });

    // Populate user details
    const populatedComment = await ForumComment.findById(comment._id)
      .populate('userId', 'name email');

    res.status(201).json({
      message: 'Comment added successfully',
      comment: populatedComment
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment', error: error.message });
  }
}

// Get all comments for a specific post
async function viewCommentsByPost(req, res) {
  try {
    const { postId } = req.params;

    // Check if post exists and user has access to it
    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Role-based access check (user can only view comments on posts they can view)
    if (req.user.role === 'admin') {
      if (!req.homeIds.includes(post.oldAgeHome._id.toString())) {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else if (req.user.role === 'volunteer') {
      if (!req.homeIds.includes(post.oldAgeHome._id.toString())) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }
    // Super Admin can view all comments

    const comments = await ForumComment.find({ postId })
      .populate('userId', 'name email')
      .sort({ createdAt: 1 });

    res.json({ comments });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get comments', error: error.message });
  }
}

// Delete comment (author or Admin/Super Admin)
async function deleteComment(req, res) {
  try {
    const { id: commentId } = req.params;

    const comment = await ForumComment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the comment author or has admin privileges
    const isAuthor = comment.userId.toString() === req.user._id.toString();
    const isAdmin = ['admin', 'superadmin'].includes(req.user.role);

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: 'You can only delete your own comments' });
    }

    // If admin but not author, check if they have access to the post
    if (isAdmin && !isAuthor) {
      const post = await ForumPost.findById(comment.postId);
      if (req.user.role === 'admin') {
        if (!req.homeIds.includes(post.oldAgeHome._id.toString())) {
          return res.status(403).json({ message: 'You can only delete comments from your assigned home' });
        }
      }
      // Super Admin can delete any comment
    }

    await ForumComment.findByIdAndDelete(commentId);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete comment', error: error.message });
  }
}

module.exports = {
  addComment,
  viewCommentsByPost,
  deleteComment
};
