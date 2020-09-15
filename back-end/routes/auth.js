const express = require('express');
const router = express.Router();
const { signup, signin, signout, requireSignin, forgotPassword, resetPassword } = require('../controllers/authController');

// validators
const { runValidation } = require('../validators');
const { userSignUpValidator, userSignInValidator, forgotPasswordValidator, resetPasswordValidator } = require('../validators/auth');


router.post('/signup', userSignUpValidator, runValidation, signup);
router.post('/signin', userSignInValidator, runValidation, signin);
router.get('/signout', signout);

// router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword);
// router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword);


// route test
router.get('/secret', requireSignin, (req, res) => {
    res.json({
        user: req.user
        // message: 'you have access to secret page'
    });
});

module.exports = router;