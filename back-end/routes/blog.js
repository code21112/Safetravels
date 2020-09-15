const express = require('express');
const router = express.Router();
const { create, read, list, listFirstBlogs, listBlogsWithCategoriesAndTags, remove, update, photo, listRelatedBlogs, listSearch, listByUser } = require('../controllers/blogController');


// const { create, list, read, remove } = require('../controllers/blogController');
const { requireSignin, adminMiddleware, authMiddleware, canUpdateDeleteBlog } = require('../controllers/authController');

// validators
router.post('/blog', requireSignin, adminMiddleware, create);
router.get('/blogs', list);

// for listing all blogs with categories and tags
router.post('/blogs-categories-tags', listBlogsWithCategoriesAndTags);
router.get('/blog/:slug', read);
router.put('/blog/:slug', requireSignin, adminMiddleware, update);
router.delete('/blog/:slug', requireSignin, adminMiddleware, remove);
router.get('/blog/photo/:slug', photo);

router.post('/blogs/related/', listRelatedBlogs);

// for search engine
router.get('/blogs/search', listSearch);


// CRUD blog for regular user
router.post('/user/blog', requireSignin, authMiddleware, create);
router.put('/user/blog/:slug', requireSignin, authMiddleware, canUpdateDeleteBlog, update);
router.delete('/user/blog/:slug', requireSignin, authMiddleware, canUpdateDeleteBlog, remove);
router.get('/:username/blogs', listByUser);


// const { runValidation } = require('../validators');
// const { blogCreationValidator } = require('../validators/blog');
// const { requireSignin, adminMiddleware } = require('../controllers/blogController');

// router.post('/blog', blogCreationValidator, runValidation, requireSignin, adminMiddleware, create);
// router.get('/blogs', list);
// router.get('/blog/:slug', read);
// router.delete('/blog/:slug', requireSignin, adminMiddleware, remove);

module.exports = router;