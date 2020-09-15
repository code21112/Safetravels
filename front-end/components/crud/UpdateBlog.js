import Link from 'next/link';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';
import { getCookie, isAuth } from '../../actions/authActions';
import { getCategories } from '../../actions/categActions';
import { getTags } from '../../actions/tagActions';
import { showSingleBlog, updateBlog, showSingleBlogPhoto } from '../../actions/blogActions';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import '../../node_modules/react-quill/dist/quill.snow.css';
import '../../static/css/styles.css';
import { QuillModules, QuillFormats } from '../../helpers/quill';
import { API } from '../../config';

const UpdateBlog = ({ router }) => {
    // const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [photo, setPhoto] = useState([]);

    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])
    // const [BlogCategoriesArray, setBlogCategoriesArray] = useState([])
    // const [BlogTagsArray, setBlogTagsArray] = useState([])

    const [checkedCategory, setCheckedCategory] = useState([]);
    const [checkedTag, setCheckedTag] = useState([]);

    const [values, setValues] = useState({
        error: '',
        success: '',
        formData: '',
        title: '',
        body: ''
    })

    const { error, success, formData, title } = values;

    const token = getCookie('token')

    function wait(ms) {
        var start = new Date().getTime();
        var end = start;
        while (end < start + ms) {
            end = new Date().getTime();
        }
    }

    useEffect(() => {
        setValues({ ...values, formData: new FormData() })
        initBlog()
        initCategories()
        initTags()
    }, [router])

    const handleBody = e => {
        // console.log(e);
        setBody(e)
        formData.set('body', e)
    }


    const editBlog = (e) => {
        e.preventDefault()
        console.log('editBlog')
        updateBlog(formData, token, router.query.slug).then(data => {
            console.log('data in updateBlog', data)

            if (data.error) {
                console.log(data.error.message)
                setValues({ ...values, error: "An error occured, a title, a category and a tag are mandatory" })
                // console.log("an error occured", data.error)

            } else {
                console.log('all is fine, end of submit a blog')
                setValues({ ...values, title: '', error: '', success: `Blog "${data.title}" is updated` });
                if (isAuth() && isAuth().role === 1) {
                    wait(300)
                    Router.replace(`/admin/crud/${router.query.slug}`)
                } else if (isAuth() && isAuth().role !== 1) {
                    wait(300)
                    Router.replace(`/user/crud/${router.query.slug}`)
                }
            }
        })
    }

    const updateBlogForm = () => {
        if (ReactQuill) {
            return (
                <form onSubmit={editBlog}>
                    <div className="form-group">
                        <label className="text-muted">Title</label>
                        <input type="text" className="form-control" value={title} onChange={handleChange('title')} />
                        {/* <input type="text" className="form-control" value={title} /> */}

                    </div>

                    <div className="form-group">
                        <ReactQuill
                            modules={QuillModules}
                            formats={QuillFormats}
                            value={body}
                            placeholder="Write here"
                            onChange={handleBody} />
                    </div>
                    <div>
                        <button type-="submit" className="btn btn-primary" >Update</button>
                    </div>
                </form>
            )
        }
    };

    const initBlog = () => {
        if (router.query.slug) {
            showSingleBlog(router.query.slug).then(data => {
                console.log('data in initBlog', data)
                if (data.error) {
                    console.log(data.error)
                }
                console.log(data)
                // setTitle(data.title)
                setValues({ ...values, title: data.title })
                setBody(data.body)
                // setPhoto(data.photo)
                setBlogCategoriesArray(data.categories)
                setBlogTagsArray(data.tags)

            })
        }
    }

    const setBlogCategoriesArray = blogCategories => {
        let categoriesArray = []
        console.log('categoriesArray', categoriesArray)
        blogCategories.map((blogCategory, index) => {
            categoriesArray.push(blogCategory._id)
            console.log('categoriesArray', categoriesArray)
        })
        setCheckedCategory(categoriesArray)
    }

    const setBlogTagsArray = blogTags => {
        let tagsArray = []
        console.log('tagsArray', tagsArray)
        blogTags.map((blogTag, index) => {
            tagsArray.push(blogTag._id)
            console.log('tagsArray', tagsArray)
        })
        setCheckedTag(tagsArray)

    }

    const initCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                console.log('initCategories in error path', data)
                setValues({ ...values, error: data.error })
            } else {
                console.log('initCategories ok', data)
                setCategories(data)
            }
        })
    }

    const initTags = () => {
        getTags().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setTags(data)
            }
        })
    }

    const showCategories = () => {
        return (
            categories && categories.map((category, index) => (
                <li key={index} className="list-unstyled">
                    <input onChange={handleToggle(category._id)} checked={findBlogCategories(category._id)} type="checkbox" className="mr-2" />
                    <label className="form-check-label">{category.name}</label>
                </li>
            ))
        )
    }

    const showTags = () => {
        return (
            tags && tags.map((tag, index) => (
                <li key={index} className="list-unstyled">
                    <input onChange={handleTagsToggle(tag._id)} checked={findBlogTags(tag._id)} type="checkbox" className="mr-2" />
                    <label className="form-check-label">{tag.name}</label>
                </li>
            ))
        )
    }

    const findBlogCategories = category => {
        const result = checkedCategory.indexOf(category)
        // result = -1 if not found
        if (result !== -1) {
            return true
        } else {
            return false
        }
    }

    const findBlogTags = tag => {
        const result = checkedTag.indexOf(tag)
        // result = -1 if not found
        if (result !== -1) {
            return true
        } else {
            return false
        }
    }

    const handleToggle = category => () => {
        setValues({ ...values, error: '' })
        const all = [...checkedCategory]
        console.log('all', all)
        // checking if category in the state ==> return its index / if not ==> return -1
        const clickedCategory = checkedCategory.indexOf(category)
        if (clickedCategory === -1) {
            all.push(category)
        } else {
            all.splice(clickedCategory, 1)
        }
        console.log('all', all)
        setCheckedCategory(all)
        formData.set('categories', all)
    }

    const handleTagsToggle = tag => () => {
        setValues({ ...values, error: '' })
        const all = [...checkedTag]
        console.log('all', all)
        // checking if category in the state ==> return its index / if not ==> return -1
        const clickedTag = checkedTag.indexOf(tag)
        if (clickedTag === -1) {
            all.push(tag)
        } else {
            all.splice(clickedTag, 1)
        }
        console.log('all', all)
        setCheckedTag(all)
        formData.set('tags', all)
    }

    const handleChange = name => e => {
        // console.log(event.target.value);

        // OTHER VERSION
        const value = name === 'photo' ? e.target.files[0] : e.target.value
        console.log(value)
        formData.set(name, value)
        setValues({ ...values, [name]: value, formData, error: '' })
    }

    // const loadCurrentPhoto = (router) => {
    //     if (router.query.slug) {
    //         showSingleBlogPhoto(router.query.slug).then(data => {
    //             if (data.error) {
    //                 console.log(data.error)
    //             }
    //             console.log(data)
    //             setPhoto(data.photo)
    //         })
    //     }
    // }

    // const showCurrentPhoto = () => {
    //     return (<section>
    //         <img
    //             className="img img-fluid"
    //             style={{ maxHeight: '150px', width: 'auto' }}
    //             // src={`${API}/blog/photo/${router.query.slug}`}
    //             src={photo[0]}
    //         // alt={title}
    //         />
    //     </section>
    //     )
    // }

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>{error}</div>
    )

    const showSuccess = () => (
        <div className="alert alert-success" style={{ display: success ? '' : 'none' }}>{success}</div>
    )


    return (
        <div className="container-fluid pb-8">
            <div className="row">

                {/* <div className="row" onMouseMove={mouseMoveHandler}> */}
                <div className="col-md-8">
                    {/* {JSON.stringify(blog)} */}
                    {updateBlogForm()}
                    <div className="pt-3">
                        {showError()}
                        {showSuccess()}
                    </div>
                </div>
                {/* SIDEBAR */}
                {/* <div className="col-md-4">
                    <div className="form-group pb-2">
                        <h5>Current image</h5>
                        {/* {showCurrentPhoto()} */}
                {/* <br />
                        <h5>Featured image</h5>
                        <br />
                        <h5>Current categories</h5> */}
                {/* {JSON.stringify(categories)} */}
                {/* {showCategories()} */}
                {/* <br />
                        <h5>Current tags</h5> */}
                {/* {JSON.stringify(tags)} */}
                {/* {showTags()}

                    </div>
                </div > */}

                <div className="col-md-4">
                    <div className="form-group pb-2">
                        <h5>Featured image</h5>
                        <img
                            className="img img-fluid"
                            style={{ maxHeight: '150px', width: 'auto' }}
                            src={`${API}/blog/photo/${router.query.slug}`}
                        // alt={title}
                        />
                        <hr />
                        <small className="text-muted">Max size: 1MB</small>
                        <br />

                        <label className="btn btn-outline-info mt-2">Upload
                        <input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
                        </label>
                    </div>
                    <div>
                        <h5>Categories</h5>
                        <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>{showCategories()}</ul>
                        {/* MY FIRST MAP */}
                        {/* {categories.map((category, index) => {
                        return (<p key={index}>{category.name}</p>)
                    })} */}
                    </div>
                    <hr />
                    <div>
                        <h5>Tags</h5>
                        <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>{showTags()}</ul>
                        {/* MY FIRST MAP */}
                        {/* {tags.map((tag, index) => {
                        return (<p key={index}>{tag.name}</p>)
                    })} */}
                    </div>
                    <hr />
                </div>
            </div>
        </div >
    )
}
export default withRouter(UpdateBlog);
