const express = require('express');
const router = express.Router();
const { contactForm } = require('../controllers/formController');
// const { requireSignin, adminMiddleware } = require('../controllers/authController');


// validators
const { runValidation } = require('../validators');
const { contactFormValidator } = require('../validators/form');

router.post('/contact', contactFormValidator, runValidation, contactForm);


module.exports = router;