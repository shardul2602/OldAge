const express = require('express');
const router = express.Router();
const { createPost, getPostsByHome, getSinglePost, deletePost } = require('../controllers/forumController');

// Create new forum post
router.post('/create', createPost);

// Get posts for specific home
router.get('/home/:id', getPostsByHome);

// Get single post with comments
router.get('/post/:id', getSinglePost);

// Delete post (Admin or Super Admin only)
router.delete('/post/:id', deletePost);

module.exports = router;
