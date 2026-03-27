const ForumPost = require('../models/ForumPost');
const ForumComment = require('../models/ForumComment');

// Create new forum post
async function createPost(req, res) {
  try {
    const { title, content, oldAgeHome, isGlobal } = req.body;
    const userId = req.user._id;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Only Super Admin can create global posts
    if (isGlobal && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only Super Admin can create global announcements' });
    }

    // For global posts, oldAgeHome is not required
    if (!isGlobal && !oldAgeHome) {
      return res.status(400).json({ message: 'Home ID is required for regular posts' });
    }

    // Role-based validation for regular posts
    if (!isGlobal) {
      if (req.user.role === 'admin') {
        // Admin can only post to their assigned home
        if (!req.homeIds.includes(oldAgeHome)) {
          return res.status(403).json({ message: 'You can only post to your assigned home' });
        }
      } else if (req.user.role === 'volunteer') {
        // Volunteer can only post to selected home
        if (!req.homeIds.includes(oldAgeHome)) {
          return res.status(403).json({ message: 'You can only post to your selected home' });
        }
      }
      // Super Admin can post to any home
    }

    const post = await ForumPost.create({
      title,
      content,
      createdBy: userId,
      oldAgeHome: isGlobal ? null : oldAgeHome,
      isGlobal: isGlobal || false
    });

    // Populate user and home details
    const populatedPost = await ForumPost.findById(post._id)
      .populate('createdBy', 'name email')
      .populate('oldAgeHome', 'name address');

    res.status(201).json({
      message: isGlobal ? 'Global announcement created successfully' : 'Post created successfully',
      post: populatedPost
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
}

// Get posts for specific home
async function getPostsByHome(req, res) {
  try {
    const { id: homeId } = req.params;

    // Role-based filtering
    let filter = { $or: [] };
    
    if (req.user.role === 'admin') {
      // Admin can only see posts from their assigned home + global posts
      if (!req.homeIds.includes(homeId)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      filter.$or = [
        { oldAgeHome: homeId },
        { isGlobal: true }
      ];
    } else if (req.user.role === 'volunteer') {
      // Volunteer can only see posts from selected home + global posts
      if (!req.homeIds.includes(homeId)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      filter.$or = [
        { oldAgeHome: homeId },
        { isGlobal: true }
      ];
    } else if (req.user.role === 'superadmin') {
      // Super Admin can see all posts (home-specific + global)
      filter.$or = [
        { oldAgeHome: homeId },
        { isGlobal: true }
      ];
    }

    const posts = await ForumPost.find(filter)
      .populate('createdBy', 'name email role')
      .populate('oldAgeHome', 'name address')
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get posts', error: error.message });
  }
}

// Get single post with comments
async function getSinglePost(req, res) {
  try {
    const { id: postId } = req.params;
    console.log('🔍 Single Post - Looking for post ID:', postId);

    const post = await ForumPost.findById(postId)
      .populate('createdBy', 'name email role')
      .populate('oldAgeHome', 'name address');

    console.log('🔍 Single Post - Post found:', !!post);
    if (post) {
      console.log('🔍 Single Post - Post data:', {
        title: post.title,
        isGlobal: post.isGlobal,
        oldAgeHome: post.oldAgeHome,
        createdBy: post.createdBy
      });
    }

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Role-based access check
    console.log('🔍 Single Post - User role:', req.user.role);
    console.log('🔍 Single Post - Post isGlobal:', post.isGlobal);
    console.log('🔍 Single Post - Post oldAgeHome:', post.oldAgeHome);
    console.log('🔍 Single Post - User homeIds:', req.homeIds);
    
    if (req.user.role === 'admin') {
      // Admin can access global posts OR posts from their assigned homes
      if (post.isGlobal) {
        console.log('✅ Single Post - Admin accessing global post - allowed');
      } else {
        // For regular posts, check if admin has access to the home
        if (!post.oldAgeHome || !post.oldAgeHome._id) {
          console.log('❌ Single Post - Admin access denied - post has no valid home');
          return res.status(403).json({ message: 'Access denied - invalid post home' });
        }
        
        const homeIdStr = post.oldAgeHome._id.toString();
        if (!req.homeIds || !req.homeIds.includes(homeIdStr)) {
          console.log('❌ Single Post - Admin access denied - home not in admin homes');
          return res.status(403).json({ message: 'Access denied - not your home' });
        }
        console.log('✅ Single Post - Admin accessing home post - allowed');
      }
    } else if (req.user.role === 'volunteer') {
      // Volunteer can access global posts OR posts from their assigned homes
      if (post.isGlobal) {
        console.log('✅ Single Post - Volunteer accessing global post - allowed');
      } else {
        // For regular posts, check if volunteer has access to the home
        if (!post.oldAgeHome || !post.oldAgeHome._id) {
          console.log('❌ Single Post - Volunteer access denied - post has no valid home');
          return res.status(403).json({ message: 'Access denied - invalid post home' });
        }
        
        const homeIdStr = post.oldAgeHome._id.toString();
        if (!req.homeIds || !req.homeIds.includes(homeIdStr)) {
          console.log('❌ Single Post - Volunteer access denied - home not in volunteer homes');
          return res.status(403).json({ message: 'Access denied - not your assigned home' });
        }
        console.log('✅ Single Post - Volunteer accessing home post - allowed');
      }
    } else if (req.user.role === 'superadmin') {
      console.log('✅ Single Post - Super admin access - always allowed');
    }

    res.json({ post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get post', error: error.message });
  }
}

// Delete post (Admin or Super Admin only)
async function deletePost(req, res) {
  try {
    const { id: postId } = req.params;

    // Only Admin and Super Admin can delete posts
    if (!['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only admins can delete posts' });
    }

    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Role-based deletion check
    if (req.user.role === 'admin') {
      if (!req.homeIds.includes(post.oldAgeHome._id.toString())) {
        return res.status(403).json({ message: 'You can only delete posts from your assigned home' });
      }
    }
    // Super Admin can delete any post

    await ForumPost.findByIdAndDelete(postId);
    // Also delete all comments for this post
    await ForumComment.deleteMany({ postId });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post', error: error.message });
  }
}

module.exports = {
  createPost,
  getPostsByHome,
  getSinglePost,
  deletePost
};
