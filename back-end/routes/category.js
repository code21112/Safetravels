const express = require('express');
const router = express.Router();
const { create, list, read, remove } = require('../controllers/categoryController');
// const { requireSignin, adminMiddleware } = require('../controllers/authController');


// validators
const { runValidation } = require('../validators');
const { categoryCreationValidator } = require('../validators/categ');
const { requireSignin, adminMiddleware } = require('../controllers/authController');

router.post('/category', categoryCreationValidator, runValidation, requireSignin, adminMiddleware, create);
router.get('/categories', list);
router.get('/category/:slug', read);
router.delete('/category/:slug', requireSignin, adminMiddleware, remove);

module.exports = router;