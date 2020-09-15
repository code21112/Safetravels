const User = require('../models/user');
const Blog = require('../models/blog');
const { dbErrorHandler } = require('../helpers/dbErrorHandler');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const { use } = require('../routes/user');

exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
}


exports.publicProfile = (req, res) => {
    let username = req.params.username
    let user
    let blogs

    User.findOne({ username }).exec((err, userFromDB) => {
        if (err || !userFromDB) {
            console.log('in publicProfile error pour User')
            return res.status(400).json({
                error: 'User not found'
            })
        }
        // res.json(userFromDB)
        console.log('in publicProfile OK pour User')
        user = userFromDB
        let userID = userFromDB._id

        Blog.find({ postedBy: userID })
            .populate('categories', '_id name slug')
            .populate('tags', '_id name slug')
            .populate('postedBy', '_id name')
            .limit(10)
            .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
            .exec((err, data) => {
                if (err) {
                    console.log('in publicProfile error pour Blog')
                    return res.status(400).json({
                        error: dbErrorHandler(err)
                    })
                }
                user.photo = undefined
                user.hashed_password = undefined
                user.salt = undefined
                res.json({
                    user, blogs: data
                })
                console.log('in publicProfile OK pour Blog')
            });
    });
}


// exports.update = (req, res) => {
//     let form = new formidable.IncomingForm()
//     form.keepExtension = true;
//     form.parse(req, (err, fields, files) => {
//         if (err) {
//             return res.status(400).json({
//                 error: 'Image could not be uploaded'
//             });
//         }
//         let user = req.profile
//         user = _.extend(user, fields)

//         if (files.photo) {
//             if (files.photo.size > 10000000) {
//                 return res.status(400).json({
//                     error: 'Your image size should be less than 1MB'
//                 });
//             }
//             user.photo.data = fs.readFileSync(files.photo.path);
//             user.photo.contentType = files.photo.type;
//         }
//         user.save((err, result) => {
//             if (err) {
//                 console.log('USER PROFILE UPDATE ERROR')
//                 return res.status(400).json({
//                     error: dbErrorHandler(err)
//                 });
//             }
//             console.log('USER PROFILE UPDATE OK')
//             user.hashed_password = undefined
//             user.salt = undefined
//             res.json(user)
//         })
//     })
// }



exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtension = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            });
        }
        let user = req.profile;
        user = _.extend(user, fields);

        if (fields.password && fields.password.length < 6) {
            return res.status(400).json({
                error: "Your password needs to be at least 6 characters long"
            })
        }

        if (files.photo) {
            if (files.photo.size > 10000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb'
                });
            }
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: dbErrorHandler(err)
                });
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            user.photo = undefined;
            res.json(user);
        });
    });
};

exports.photo = (req, res) => {
    const username = req.params.username
    User.findOne({ username }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }
        if (user.photo.data) {
            res.set('Content-Type', user.photo.contentType);
            return res.send(user.photo.data)
        }
    })
}


