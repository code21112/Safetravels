// const fs = require('fs');
const User = require('../models/user');

const Blog = require('../models/blog');
const Category = require('../models/category');
const Tag = require('../models/tag');
const formidable = require('formidable');
const slugify = require('slugify');
const stripHtml = require('string-strip-html');
const _ = require('lodash');
const { dbErrorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');
const { smartTrim } = require('../helpers/blogHelper');

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        const { title, body, categories, tags } = fields;

        if (!title || !title.length) {
            return res.status(400).json({
                error: 'title is required'
            });
        }

        if (!body || body.length < 200) {
            return res.status(400).json({
                error: 'Content is too short'
            });
        }

        if (!categories || categories.length === 0) {
            return res.status(400).json({
                error: 'At least one category is required'
            });
        }

        if (!tags || tags.length === 0) {
            return res.status(400).json({
                error: 'At least one tag is required'
            });
        }

        let blog = new Blog();
        console.log('req.body', req.body)
        console.log('req.user', req.user)
        console.log('req.user', req.user.userId)

        blog.title = title;
        blog.body = body;
        blog.excerpt = smartTrim(body, 320, ' ', ' ...');
        blog.slug = slugify(title).toLowerCase();
        blog.mtitle = `${title} | ${process.env.APP_NAME}`;
        blog.mdesc = stripHtml(body.substring(0, 160));
        blog.postedBy = req.user.userId;
        // console.log('blog.postedBy', blog.postedBy)
        // categories and tags
        let arrayOfCategories = categories && categories.split(',');
        let arrayOfTags = tags && tags.split(',');
        // console.log('req.body', req.body)

        if (files.photo) {
            if (files.photo.size > 10000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            blog.photo.data = fs.readFileSync(files.photo.path);
            blog.photo.contentType = files.photo.type;
        }

        blog.save((err, result) => {
            console.log('BLOG CREATE ERROR', err)

            if (err) {
                console.log('blog.save but ERROR')
                return res.status(400).json({
                    error: dbErrorHandler(err)
                });
            }
            // res.json(result);
            console.log('blog.save OK')

            Blog.findByIdAndUpdate(result._id, { $push: { categories: arrayOfCategories } }, { new: true }).exec(
                (err, result) => {
                    console.log('BLOG CREATE ERROR 2', err)

                    if (err) {
                        console.log('first Blog.findByIdAndUpdate but Error')
                        // console.log('result._id', result._id)

                        return res.status(400).json({
                            error: dbErrorHandler(err)
                        });
                    } else {

                        console.log('first Blog.findByIdAndUpdate OK')
                        // console.log('result._id', result._id)

                        Blog.findByIdAndUpdate(result._id, { $push: { tags: arrayOfTags } }, { new: true }).exec(
                            (err, result) => {
                                console.log('BLOG CREATE ERROR 2', err)


                                if (err) {
                                    console.log('second Blog.findByIdAndUpdate but Error')

                                    return res.status(400).json({
                                        error: dbErrorHandler(err)
                                    });
                                } else {
                                    console.log('second Blog.findByIdAndUpdate OK')

                                    res.json(result);
                                }
                            }
                        );
                    }
                }
            );
        });
    });
};

// list, listAllBlogsCategoriesTags, read, remove, update

exports.list = (req, res) => {
    Blog.find({})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username')
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: dbErrorHandler(err)
                });
            }
            res.json(data);
        });
};

// exports.listBlogsWithCategoriesAndTags = (req, res) => {
//     //defining limits
//     let limit = req.body.limit ? parseInt(req.body.limit) : 10
//     // skipping limit when user wants it
//     let skip = req.body.skip ? parseInt(req.body.skip) : 0
//     // initiating variables
//     let blogs
//     let categories
//     let tags

//     // listing blogs
//     Blog.find({})
//         .populate('categories', '_id name slug')
//         .populate('tags', '_id name slug')
//         .populate('postedBy', '_id name username profile')
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
//         .exec((err, data) => {
//             if (err) {
//                 return res.json({
//                     error: dbErrorHandler(err)
//                 });
//             }
//             blogs = data
//             // get all categories
//             Category.find({}).exec((err, categories) => {
//                 if (err) {
//                     return res.json({
//                         error: dbErrorHandler(err)
//                     });
//                 } else {
//                     categories = categories
//                 }
//             })
//             // get all tags
//             Tag.find({}).exec((err, tags) => {
//                 if (err) {
//                     return res.json({
//                         error: dbErrorHandler(err)
//                     });
//                 } else {
//                     tags = tags
//                 }
//                 // return all blogs categories and tags
//                 res.json({ blogs, categories, tags, size: blogs.length })

//             })
//         });
// };

exports.listBlogsWithCategoriesAndTags = (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    let blogs;
    let categories;
    let tags;

    Blog.find({})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username profile')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: dbErrorHandler(err)
                });
            }
            blogs = data; // blogs
            // get all categories
            Category.find({}).exec((err, c) => {
                if (err) {
                    return res.json({
                        error: dbErrorHandler(err)
                    });
                }
                categories = c; // categories
                // get all tags
                Tag.find({}).exec((err, t) => {
                    if (err) {
                        return res.json({
                            error: dbErrorHandler(err)
                        });
                    }
                    tags = t;
                    // return all blogs categories tags
                    res.json({ blogs, categories, tags, size: blogs.length });
                });
            });
        });
};



exports.read = (req, res) => {
    //
    const slug = req.params.slug.toLowerCase()
    Blog.findOne({ slug })
        // .select('-photo')
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username')
        .select('_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: dbErrorHandler(err)
                })
            }
            res.json(data)
        });
};

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase()
    Blog.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: dbErrorHandler(err)
            })
        }
        res.json({
            message: 'Blog deleted successfully.'
        })
    });
};

// exports.update = (req, res) => {

//     // finding the targeted blog
//     const slug = req.params.slug.toLowerCase();
//     console.log('slug', slug)

//     Blog.findOne({ slug }).exec((err, oldData) => {
//         if (err) {
//             console.log('in error Blog.findOne')

//             return res.status(400).json({
//                 error: dbErrorHandler(err)
//             });
//         }
//         console.log('Blog.findOne is OK')
//         let form = new formidable.IncomingForm();
//         form.keepExtensions = true;
//         form.parse(req, (err, fields, files) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: 'Image could not upload'
//                 });
//             }

//             // const { title, body, categories, tags } = fields;

//             // saving slug
//             let oldSlug = oldData.slug
//             console.log('oldSlug', oldSlug)
//             // using method merge from lodash
//             oldData = _.merge(oldData, fields)
//             oldData.slug = oldSlug
//             console.log('oldSlug after saved', oldSlug)

//             const { body, desc, categories, tags } = fields

//             if (body) {
//                 oldData.excerpt = smartTrim(body, 320, ' ', ' ...')
//                 oldData.desc = stripHtml(body.substring(0, 160))
//             }

//             if (categories) {
//                 oldData.categories = categories.split(',')
//             }

//             if (tags) {
//                 oldData.tags = tags.split(',')
//             }


//             if (files.photo) {
//                 if (files.photo.size > 10000000) {
//                     return res.status(400).json({
//                         error: 'Image should be less than 1mb in size'
//                     });
//                 }
//                 oldData.photo.data = fs.readFileSync(files.photo.path);
//                 oldData.photo.contentType = files.photo.type;
//             }

//             oldData.save((err, result) => {
//                 if (err) {
//                     console.log('in error of saving oldBlog')
//                     console.log('err', err)
//                     return res.status(400).json({
//                         // error: dbErrorHandler(err)
//                         error: err
//                     });
//                 }
//                 console.log('saving oldBlog is OK')
//                 // result.photo = undefined
//                 res.json(result);
//             });
//         });
//     });
// };


exports.update = (req, res) => {

    // finding the targeted blog
    const slug = req.params.slug.toLowerCase();
    console.log('slug', slug)

    Blog.findOne({ slug }).exec((err, oldData) => {
        if (err) {
            console.log('in error Blog.findOne')

            return res.status(400).json({
                error: dbErrorHandler(err)
            });
        }
        console.log('Blog.findOne is OK')
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Image could not upload'
                });
            }

            // const { title, body, categories, tags } = fields;

            // saving slug
            let oldSlug = oldData.slug
            console.log('oldSlug', oldSlug)
            // using method merge from lodash
            oldData = _.merge(oldData, fields)
            oldData.slug = oldSlug
            console.log('oldSlug after saved', oldSlug)

            const { body, desc, categories, tags } = fields

            if (body) {
                oldData.excerpt = smartTrim(body, 320, ' ', ' ...')
                oldData.desc = stripHtml(body.substring(0, 160))
            }

            if (categories) {
                oldData.categories = categories.split(',')
            }

            if (tags) {
                oldData.tags = tags.split(',')
            }

            if (files.photo) {
                if (files.photo.size > 10000000) {
                    return res.status(400).json({
                        error: 'Image should be less than 1mb in size'
                    });
                }
                oldData.photo.data = fs.readFileSync(files.photo.path);
                oldData.photo.contentType = files.photo.type;
            }

            oldData.save((err, result) => {
                if (err) {
                    console.log('in error of saving oldBlog')
                    console.log('err', err)
                    return res.status(400).json({
                        // error: dbErrorHandler(err)
                        error: err
                    });
                }
                console.log('saving oldBlog is OK')
                // result.photo = undefined
                res.json(result);
            });
        });
    });
};


// exports.photo = (req, res) => {
//     // slug
//     const slug = req.params.slug.toLowerCase();
//     console.log('slug', slug)

//     // find the blog in database
//     Blog.findOne({ slug })
//         .select('photo')
//         .exec((err, data) => {
//             if (err || !data) {
//                 console.log('in error Blog.findOne of photo method')

//                 return res.status(400).json({
//                     // error: dbErrorHandler(err)
//                     error: err

//                 });
//             }
//             console.log('Blog.findOne of photo method OK ==> data', data)

//             res.set('Content-Type', data.photo.contentType);
//             return res.send(data.photo.data)
//         })
// }

exports.photo = (req, res) => {
    // slug
    const slug = req.params.slug.toLowerCase();
    console.log('slug', slug)

    // find the blog in database
    Blog.findOne({ slug })
        .select('photo')
        .exec((err, data) => {
            if (err || !data) {
                console.log('in error Blog.findOne of photo method')

                return res.status(400).json({
                    // error: dbErrorHandler(err)
                    error: err

                });
            }
            console.log('Blog.findOne of photo method OK ==> data', data)

            res.set('Content-Type', data.photo.contentType);
            return res.send(data.photo.data)
        })
}



exports.listRelatedBlogs = (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 3
    console.log('limit in listRelatedBlogs', limit)
    console.log('req.body', req.body)

    const { _id, categories } = req.body.blog
    Blog.find({ _id: { $ne: _id }, categories: { $in: categories } })
        .limit(limit)
        .populate('postedBy', '_id name username profile')
        .select('title slug excerpt postedBy createdAt updatedAt')
        .exec((err, blogs) => {
            if (err) {
                return res.status(400).json({
                    err: "No blog found."
                })
            }
            res.json(blogs)
        })
}


exports.listSearch = (req, res) => {
    console.log(req.query)

    const { search } = req.query
    if (search) {
        Blog.find({
            $or: [{ title: { $regex: search, $options: 'i' } }, { body: { $regex: search, $options: 'i' } }]
        }, (err, blogs) => {
            if (err) {
                return res.status(400).json({
                    error: dbErrorHandler(err)
                })
            }
            res.json(blogs)
        }).select('-photo -body')

    }
}


exports.listFirstBlogs = (req, res) => {
    //defining limits
    let limit = req.body.limit ? parseInt(req.body.limit) : 3
    // skipping limit when user wants it
    let skip = req.body.skip ? parseInt(req.body.skip) : 0
    // initiating variables
    let blogs
    let categories
    let tags

    // listing blogs
    Blog.find({})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username profile')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: dbErrorHandler(err)
                });
            }
            blogs = data
            // get all categories
            Category.find({}).exec((err, data) => {
                if (err) {
                    return res.json({
                        error: dbErrorHandler(err)
                    });
                } else {
                    categories = data
                }
            })
            // get all tags
            Tag.find({}).exec((err, data) => {
                if (err) {
                    return res.json({
                        error: dbErrorHandler(err)
                    });
                } else {
                    tags = data
                }
                // return all blogs categories and tags
                res.json({ blogs, categories, tags, size: blogs.length })

            })
        });
};

exports.listByUser = (req, res) => {
    let username = req.params.username
    User.findOne({ username }).exec((err, user) => {
        if (err) {
            return res.status(400).json({
                error: dbErrorHandler(err)
            })
        }
        let userID = user._id
        Blog.find({ postedBy: userID })
            .populate('categories', '_id name slug')
            .populate('tags', '_id name slug')
            .populate('postedBy', '_id name username')
            .select('_id title slug postedBy createdAt updatedAt')
            .exec((err, data) => {
                if (err) {
                    return res.json({
                        error: dbErrorHandler(err)
                    });
                }
                res.json(data)
            })
    })
}