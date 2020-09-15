import Link from 'next/link';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';
import { getCookie, isAuth } from '../../actions/authActions';
import { getCategories } from '../../actions/categActions';
import { getTags } from '../../actions/tagActions';
import { createBlog } from '../../actions/blogActions';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import '../../node_modules/react-quill/dist/quill.snow.css';
import '../../static/css/styles.css';
import { QuillModules, QuillFormats } from '../../helpers/quill';

const CreateBlog = ({ router }) => {

    const blogFromLocalStorage = () => {
        if (typeof window === 'undefined') {
            return false
        }
        if (localStorage.getItem('blog')) {
            return JSON.parse(localStorage.getItem('blog'))
        } else {
            return false
        }
    }

    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])
    const [checkedCategory, setCheckedCategory] = useState([]);
    const [checkedTag, setCheckedTag] = useState([]);


    const [body, setBody] = useState(blogFromLocalStorage());
    const [values, setValues] = useState({
        error: '',
        sizeError: '',
        success: '',
        formData: '',
        title: '',
        hidePublishButton: false
    })

    const { error, sizeError, success, formData, title, hidePublishButton } = values;

    // FIRST VERSION OF MESSAGES
    // const showSuccess = () => (success ? <div className="alert alert-info">{success}</div> : '');
    // const showError = () => (error ? <div className="alert alert-danger">{error}</div> : '');
    // const showMessage = () => (message ? <div className="alert alert-info">{message}</div> : '');

    // SECOND VERSION OF MESSAGES
    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>{error}</div>
    )

    const showSuccess = () => (
        <div className="alert alert-success" style={{ display: success ? '' : 'none' }}>{success}</div>
    )
    // MY FUNCTION mouseMovehandler
    // const mouseMoveHandler = (e) => {
    //     setValues({ ...values, error: '', success: '' })
    // };

    const token = getCookie('token');

    useEffect(() => {
        setValues({ ...values, formData: new FormData() })
        initCategories()
        initTags()
    }, [router])

    const initCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                console.log('getCategories in error path', data)
                setValues({ ...values, error: data.error })
            } else {
                console.log('getCategories ok', data)
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

    const publishBlog = e => {
        e.preventDefault()
        // if (!values.image) {
        //     alert('Image is required')
        //     return
        // }
        console.log("ready to go")
        createBlog(formData, token).then(data => {
            console.log('data in publisBlog', data)
            if (data.error) {
                setValues({ ...values, error: data.error })
                console.log("an error occured", data.error)
            } else {
                console.log('all is fine, end of submit a blog')
                setValues({ ...values, title: '', error: '', success: `A new blog titled "${data.title}" is created` });
                setBody('');
                setCategories([]);
                setTags([]);
            }
        })
    }

    const handleChange = name => e => {
        // console.log(event.target.value);

        // OTHER VERSION
        const value = name === 'photo' ? e.target.files[0] : e.target.value
        console.log(value)
        formData.set(name, value)
        setValues({ ...values, [name]: value, formData, error: '' })

        // FIRST VERSION
        // const value = name
        // if (name === 'photo') {
        //     let value = e.target.files[0]
        // } else {
        //     let value = e.target.values
        // }
        // formData.set(name, value)
        // setValues({ ...values, [name]: value, formData, error: '' })
    }

    const handleBody = e => {
        // console.log(e);
        setBody(e)
        formData.set('body', e)
        if (typeof window !== 'undefined') {
            localStorage.setItem('blog', JSON.stringify(e))
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

    const showCategories = () => {
        return (
            categories && categories.map((category, index) => (
                <li key={index} className="list-unstyled">
                    <input onChange={handleToggle(category._id)} type="checkbox" className="mr-2" />
                    <label className="form-check-label">{category.name}</label>
                </li>
            ))
        )
    }


    const showTags = () => {
        return (
            tags && tags.map((tag, index) => (
                <li key={index} className="list-unstyled">
                    <input onChange={handleTagsToggle(tag._id)} type="checkbox" className="mr-2" />
                    <label className="form-check-label">{tag.name}</label>
                </li>
            ))
        )
    }

    const createBlogForm = () => {
        if (ReactQuill) {
            return (
                <form onSubmit={publishBlog}>
                    <div className="form-group">
                        <label className="text-muted">Title</label>
                        <input type="text" className="form-control" value={title} onChange={handleChange('title')} />
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
                        <button type-="submit" className="btn btn-primary" >Publish</button>
                    </div>
                </form>
            )
        }
    };

    return (
        <div className="container-fluid pb-8">
            <div className="row">

                {/* <div className="row" onMouseMove={mouseMoveHandler}> */}
                <div className="col-md-8">
                    {createBlogForm()}

                    {/* <hr />
                    {JSON.stringify(title)}
                    <hr />
                    {JSON.stringify(body)}
                    <hr />
                    {JSON.stringify(categories)}
                    <hr />
                    {JSON.stringify(tags)} */}
                    <div className="pt-3">
                        {showError()}
                        {showSuccess()}
                    </div>
                </div>
                {/* SIDEBAR */}
                <div className="col-md-4">
                    <div className="form-group pb-2">
                        <h5>Featured image</h5>
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
                {/* END OF SIDEBAR */}

            </div>
        </div >
    )
}

// CreateBlog.modules = {
//     toolbar: [
//         [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }, { font: [] }],
//         [{ size: [] }],
//         ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//         [{ list: 'ordered' }, { list: 'bullet' }],
//         ['link', 'image', 'video'],
//         ['clean'],
//         ['code-block']
//     ]
// };

// CreateBlog.formats = [
//     'header',
//     'font',
//     'size',
//     'bold',
//     'italic',
//     'underline',
//     'strike',
//     'blockquote',
//     'list',
//     'bullet',
//     'link',
//     'image',
//     'video',
//     'code-block'
// ];


export default withRouter(CreateBlog);


/////////////////////////////////////////////////
// SON CODE


// import Link from 'next/link';
// import { useState, useEffect } from 'react';
// import Router from 'next/router';
// import dynamic from 'next/dynamic';
// import { withRouter } from 'next/router';
// import { getCookie, isAuth } from '../../actions/authActions';
// import { getCategories } from '../../actions/categActions';
// import { getTags } from '../../actions/tagActions';
// import { createBlog } from '../../actions/blogActions';
// const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
// import '../../node_modules/react-quill/dist/quill.snow.css';

// const CreateBlog = ({ router }) => {
//     const blogFromLS = () => {
//         if (typeof window === 'undefined') {
//             return false;
//         }

//         if (localStorage.getItem('blog')) {
//             return JSON.parse(localStorage.getItem('blog'));
//         } else {
//             return false;
//         }
//     };

//     const [categories, setCategories] = useState([]);
//     const [tags, setTags] = useState([]);

//     const [checked, setChecked] = useState([]); // categories
//     const [checkedTag, setCheckedTag] = useState([]); // tags

//     const [body, setBody] = useState(blogFromLS());
//     const [values, setValues] = useState({
//         error: '',
//         sizeError: '',
//         success: '',
//         formData: '',
//         title: '',
//         hidePublishButton: false
//     });

//     const { error, sizeError, success, formData, title, hidePublishButton } = values;
//     const token = getCookie('token');

//     useEffect(() => {
//         setValues({ ...values, formData: new FormData() });
//         initCategories();
//         initTags();
//     }, [router]);

//     const initCategories = () => {
//         getCategories().then(data => {
//             if (data.error) {
//                 setValues({ ...values, error: data.error });
//             } else {
//                 setCategories(data);
//             }
//         });
//     };

//     const initTags = () => {
//         getTags().then(data => {
//             if (data.error) {
//                 setValues({ ...values, error: data.error });
//             } else {
//                 setTags(data);
//             }
//         });
//     };

//     const publishBlog = e => {
//         e.preventDefault();
//         // console.log('ready to publishBlog');
//         createBlog(formData, token).then(data => {
//             if (data.error) {
//                 setValues({ ...values, error: data.error });
//             } else {
//                 setValues({ ...values, title: '', error: '', success: `A new blog titled "${data.title}" is created` });
//                 setBody('');
//                 setCategories([]);
//                 setTags([]);
//             }
//         });
//     };

//     const handleChange = name => e => {
//         // console.log(e.target.value);
//         const value = name === 'photo' ? e.target.files[0] : e.target.value;
//         formData.set(name, value);
//         setValues({ ...values, [name]: value, formData, error: '' });
//     };

//     const handleBody = e => {
//         // console.log(e);
//         setBody(e);
//         formData.set('body', e);
//         if (typeof window !== 'undefined') {
//             localStorage.setItem('blog', JSON.stringify(e));
//         }
//     };

//     const handleToggle = c => () => {
//         setValues({ ...values, error: '' });
//         // return the first index or -1
//         const clickedCategory = checked.indexOf(c);
//         const all = [...checked];

//         if (clickedCategory === -1) {
//             all.push(c);
//         } else {
//             all.splice(clickedCategory, 1);
//         }
//         console.log(all);
//         setChecked(all);
//         formData.set('categories', all);
//     };

//     const handleTagsToggle = t => () => {
//         setValues({ ...values, error: '' });
//         // return the first index or -1
//         const clickedTag = checked.indexOf(t);
//         const all = [...checkedTag];

//         if (clickedTag === -1) {
//             all.push(t);
//         } else {
//             all.splice(clickedTag, 1);
//         }
//         console.log(all);
//         setCheckedTag(all);
//         formData.set('tags', all);
//     };

//     const showCategories = () => {
//         return (
//             categories &&
//             categories.map((c, i) => (
//                 <li key={i} className="list-unstyled">
//                     <input onChange={handleToggle(c._id)} type="checkbox" className="mr-2" />
//                     <label className="form-check-label">{c.name}</label>
//                 </li>
//             ))
//         );
//     };

//     const showTags = () => {
//         return (
//             tags &&
//             tags.map((t, i) => (
//                 <li key={i} className="list-unstyled">
//                     <input onChange={handleTagsToggle(t._id)} type="checkbox" className="mr-2" />
//                     <label className="form-check-label">{t.name}</label>
//                 </li>
//             ))
//         );
//     };

//     const createBlogForm = () => {
//         return (
//             <form onSubmit={publishBlog}>
//                 <div className="form-group">
//                     <label className="text-muted">Title</label>
//                     <input type="text" className="form-control" value={title} onChange={handleChange('title')} />
//                 </div>

//                 <div className="form-group">
//                     <ReactQuill
//                         modules={CreateBlog.modules}
//                         formats={CreateBlog.formats}
//                         value={body}
//                         placeholder="Write something amazing..."
//                         onChange={handleBody}
//                     />
//                 </div>

//                 <div>
//                     <button type="submit" className="btn btn-primary">
//                         Publish
//                     </button>
//                 </div>
//             </form>
//         );
//     };

//     return (
//         <div className="container-fluid">
//             <div className="row">
//                 <div className="col-md-8">
//                     {createBlogForm()}
//                     <hr />
//                     {JSON.stringify(title)}
//                     <hr />
//                     {JSON.stringify(body)}
//                     <hr />
//                     {JSON.stringify(categories)}
//                     <hr />
//                     {JSON.stringify(tags)}
//                 </div>

//                 <div className="col-md-4">
//                     <div>
//                         <div className="form-group pb-2">
//                             <h5>Featured image</h5>
//                             <hr />

//                             <small className="text-muted">Max size: 1mb</small>
//                             <label className="btn btn-outline-info">
//                                 Upload featured image
//                                 <input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
//                             </label>
//                         </div>
//                     </div>
//                     <div>
//                         <h5>Categories</h5>
//                         <hr />

//                         <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>{showCategories()}</ul>
//                     </div>
//                     <div>
//                         <h5>Tags</h5>
//                         <hr />
//                         <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>{showTags()}</ul>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// CreateBlog.modules = {
//     toolbar: [
//         [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }, { font: [] }],
//         [{ size: [] }],
//         ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//         [{ list: 'ordered' }, { list: 'bullet' }],
//         ['link', 'image', 'video'],
//         ['clean'],
//         ['code-block']
//     ]
// };

// CreateBlog.formats = [
//     'header',
//     'font',
//     'size',
//     'bold',
//     'italic',
//     'underline',
//     'strike',
//     'blockquote',
//     'list',
//     'bullet',
//     'link',
//     'image',
//     'video',
//     'code-block'
// ];
// export default withRouter(CreateBlog);