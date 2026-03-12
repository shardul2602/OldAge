const express = require('express');
const router = express.Router();
const { addComment, viewCommentsByPost, deleteComment } = require('../controllers/commentController');

// Add comment to a post
router.post('/add', addComment);

// Get comments for a post
router.get('/:postId', viewCommentsByPost);

// Delete comment
router.delete('/:id', deleteComment);

module.exports = router;
