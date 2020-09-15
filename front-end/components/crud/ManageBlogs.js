import Link from 'next/link';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import { getCookie, isAuth } from '../../actions/authActions';
import { listAllBlogs, removeBlog } from '../../actions/blogActions';
import moment from 'moment';
import { API } from '../../config';


const ManageBlogs = ({ router, username }) => {

    const [blogs, setBlogs] = useState([]);
    const [messageSuccess, setMessageSuccess] = useState('')
    const token = getCookie('token')

    useEffect(() => {
        loadBlogs()
    }, [])


    const loadBlogs = () => {
        listAllBlogs(username).then(data => {
            if (data.error) {
                console.log('loadBlogs with error', data)
            } else {
                console.log('loadBlogs ok', data)
                setBlogs(data)
            }
        })
    }

    // MY showAllBlogs function
    // const showAllBlogs = () => {
    //     return (
    //         blogs.map((blog, index) => (
    //             <div key={index} className="mt-2 pb-3">
    //                 <div className="container">
    //                     <div className="row">
    //                         <div className="col-md-3">
    //                             <img
    //                                 className="img img-fluid"
    //                                 style={{ maxHeight: '70px', width: 'auto' }}
    //                                 src={`${API}/blog/photo/${blog.slug}`}
    //                                 alt={blog.title}
    //                             // onError={i => i.target.src = `../../static/images/safeTravel.jpg`}
    //                             />                            </div>
    //                         <div className="col-md-9">
    //                             <h3>{blog.title}</h3>
    //                             <p className="mark">Written by: {blog.postedBy.name} | Published on: {moment(blog.createdAt).format('MMM DD YYYY h:mm A')}</p>
    //                             <div className="container">
    //                                 <div className="row" style={{ justifyContent: 'center' }}>
    //                                     <div className="col-md-6">
    //                                         <button className="btn btn-sm btn-danger" onClick={() => deleteConfirm(blog.slug)}>Delete</button>
    //                                     </div>
    //                                     <div className="col-md-6">
    //                                         <button className="btn btn-sm btn-primary">Update</button>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    //                 <hr />
    //             </div>
    //         ))
    //     )
    // }
    // End of MY showAllBlogs function

    const showUpdateButton = (blog) => {
        if (isAuth() && isAuth().role === 0) {
            return (
                <Link href={`/user/crud/${blog.slug}`}>
                    <a className="btn btn-sm btn-outline-primary">Update</a>
                </Link>
            )
        } else if (isAuth() && isAuth().role === 1) {
            return (
                <Link href={`/admin/crud/${blog.slug}`}>
                    <a className="btn btn-sm btn-outline-primary">Update</a>
                </Link>
            )
        }
    }



    const showAllBlogs = () => {
        return (
            blogs.map((blog, index) => (
                <div key={index} className="mt-2 pb-3">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-3">
                                <img
                                    className="img img-fluid"
                                    style={{ maxHeight: '70px', width: 'auto' }}
                                    src={`${API}/blog/photo/${blog.slug}`}
                                    alt={blog.title}
                                // onError={i => i.target.src = `../../static/images/safeTravel.jpg`}
                                />                            </div>
                            <div className="col-md-9">
                                <h3>{blog.title}</h3>
                                <p className="mark">Written by: {blog.postedBy.name} | Published on: {moment(blog.createdAt).format('MMM DD YYYY h:mm A')}</p>
                                <div className="container">
                                    <div className="row" style={{ justifyContent: 'center' }}>
                                        <div className="col-md-6">
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => deleteConfirm(blog.slug)}>Delete</button>
                                        </div>
                                        {showUpdateButton(blog)}
                                        {/* <div className="col-md-6">
                                                <button className="btn btn-sm btn-primary">Update</button>
                                            </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                </div>
            ))
        )
    }




    const deleteConfirm = (slug) => {
        // console.log('slug', slug)
        // console.log('token', getCookie('token'))

        let answer = window.confirm('Confirm the deletion')
        if (answer) {
            deleteBlog(slug, token)
        }
    }

    const deleteBlog = (slug, token) => {
        console.log(slug)
        console.log(token)
        removeBlog(slug, token).then(data => {
            console.log('data', data)
            if (data.error) {
                console.log(data.error)
            }
            setMessageSuccess(data.message)
            loadBlogs()
        })
    }

    const mouseMoveHandler = (e) => {
        setMessageSuccess('')
    }

    return (
        <React.Fragment>
            <div className="row" onMouseMove={mouseMoveHandler}>
                <div className="col-md-12">
                    {messageSuccess && (
                        <div className="alert alert-success" style={{ overflowY: 'scroll', display: messageSuccess ? '' : 'none' }}> {messageSuccess}</div>
                    )}
                    {showAllBlogs()}
                </div>
            </div>
        </React.Fragment>)
};


export default ManageBlogs;