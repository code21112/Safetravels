const User = require('../models/user');
const Blog = require('../models/blog');
const shortId = require('shortid');
const user = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { dbErrorHandler } = require('../helpers/dbErrorHandler');


exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
}


exports.signup = (req, res) => {
    User.findOne({ email: req.body.email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                email: 'Email already registered'
            })
        } else {
            const { name, email, password } = req.body;
            let username = shortId.generate();
            let profile = `${process.env.CLIENT_URL}/profile/${username}`;

            let newUser = new User({ name, email, password, username, profile });
            newUser.save((err, success) => {
                if (err) {
                    return res.status(400).json({
                        error: err
                    })
                } else {
                    // res.json({
                    //     user: success,
                    //     message: 'Signup completed. Please signin.'
                    // })

                    res.json({
                        message: 'Signup completed. Please signin.'
                    })
                }
            })
        }
    });
}

// exports.signup = (req, res) => {
//     const { name, email, password } = req.body
//     res.json({
//         user: { name, email, password }
//     });
// };


exports.signin = (req, res) => {
    const { email, password } = req.body;
    // checking user exists
    User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "No user exists with that email. Please signup."
            });
        }
        // if user doesn't exist ==> signup

        // authenticate ==> method ad hoc in user.js of models
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: "Email and password don't match. Please retry."
            });
        }
        //  generate a token ==> sent 
        // const token = jwt.sign({ userId: user._id }, `${process.env.JWT_SECRETKEY}`, { expiresIn: '1d' });
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRETKEY, { expiresIn: '1d' });
        res.cookie('token', token, { expiresIn: '1d' })
        const { userId, username, name, email, role } = user;
        return res.json({
            token,
            user: { userId, username, name, email, role }
        });
    });
};

exports.signout = (req, res) => {
    res.clearCookie('token');
    res.json({
        message: 'You signed out.'
    });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRETKEY
});

// Middleware for authorization
exports.authMiddleware = (req, res, next) => {
    const authUserId = req.user.userId
    User.findById({ _id: authUserId }).exec((err, data) => {
        if (err || !data) {
            return res.status(400).json({
                error: 'User not found'
            })
        }
        req.profile = data
        next()
    })
}

// Middleware for admin
exports.adminMiddleware = (req, res, next) => {
    const adminUserId = req.user.userId
    User.findById({ _id: adminUserId }).exec((err, data) => {
        if (err || !data) {
            return res.status(400).json({
                error: 'User not found.'
            })
        }
        // Checking if user is admin
        if (data.role !== 1) {
            return res.status(400).json({
                error: 'Admin part, access denied.'
            })
        }
        req.profile = data
        next()
    })
}

exports.canUpdateDeleteBlog = (req, res, next) => {
    const slug = req.params.slug.toLowerCase()
    Blog.findOne({ slug }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: dbErrorHandler(err)
            });
        }
        let authorizedUser = data.postedBy._id.toString() === req.profile._id.toString()
        if (!authorizedUser) {
            return res.status(400).json({
                error: 'No access'
            });
        }
        next()
    })
}


// exports.forgotPassword = (req, res) => {
//     const { email } = req.body
//     User.findOne({ email }).exec((err, user) => {
//         if (err || !user) {
//             return res.status(401).json({
//                 error: 'No user exists with that email'
//             });
//         }
//         const token = jwt.sign({ _id: user._id },)
//     })
// }

// exports.resetPassword = (req, res) => {

// }