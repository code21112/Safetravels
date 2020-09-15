import Head from 'next/head';
import Link from 'next/link';
// import { withRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { showSingleBlog, listRelatedBlogs } from '../../actions/blogActions';

import { API, APP_NAME, DOMAIN } from '../../config';
import '../../static/css/styles.css';
import moment from 'moment';
import renderHtml from 'react-render-html';
import CardRelatedBlog from '../../components/blogs/CardRelatedBlog';
import DisqusThread from '../../components/DisqusThread';

const SingleBlog = ({ blog, query }) => {

    const head = () => (
        <Head>
            <title>{blog.title} | {APP_NAME}</title>
            <meta
                name="description"
                content={blog.mdesc}
            />
            {/* <link rel="canonical" href={`${DOMAIN}/blogs/${slug}`} /> */}
            <link rel="canonical" href={`${DOMAIN}/blogs/${query.slug}`} />

            <meta
                property="og:title"
                content={`${blog.title} | ${APP_NAME} `}
            />
            <meta
                property="og:description"
                content={blog.mdesc}
            />
            <meta
                property="og:type"
                content="website"
            />
            <meta
                property="og:url"
                content={`${DOMAIN}/blogs/${query.slug}`}
            />
            <meta
                property="og:site_name"
                content={`${APP_NAME}`}
            />
            <meta
                property="og:image"
                // content="/static/images/safeTravels.jpeg"
                content={`${API}/blog/photo/${blog.slug}`}

            />
            <meta
                property="og:image:secure_url"
                // content="/static/images/safeTravels.jpeg"
                content={`${API}/blog/photo/${query.slug}`}
            />
            <meta
                property="og:image:type"
                content="image/jpeg"
            />
            <meta
                property="fb:app_id"
                content={`${APP_NAME}`}
            // AFTER THE IMPORT 
            // content={`${FB_APP_ID}`}

            />
        </Head>
    )


    const [relatedBlogs, setRelatedBlogs] = useState([]);

    const loadRelatedBlogs = () => {
        listRelatedBlogs({ blog }).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                setRelatedBlogs(data)
            }
        })
    }

    useEffect(() => {
        loadRelatedBlogs()
    }, [])

    const showBlogCategories = blog =>
        // console.log('blog in showBlogCategories', blog)
        // console.log('blog.categories in showBlogCategories', blog.categories)
        blog.categories.map((category, index) => (
            <Link href={`/categories/${category.slug}`} key={index}>
                <a className="btn btn-primary mr-1 ml-1 mt-3 mb-3">{category.name}</a>
            </Link>
        ))


    const showBlogTags = blog => {
        // console.log('blog in showBlogCategories', blog)
        // console.log('blog.categories in showBlogCategories', blog.categories)
        return blog.tags.map((tag, index) => (
            <Link href={`/tags/${tag.slug}`} key={index}>
                <a className="btn btn-outline-primary mr-1 ml-1 mt-3 mb-3">{tag.name}</a>
            </Link>
        ))
    }


    const showRelatedBlogs = () => {
        return relatedBlogs.map((relatedBlog, index) => (
            <div className="col-md-4" key={index}>
                <article>
                    <CardRelatedBlog relatedBlog={relatedBlog} />
                </article>
            </div>
        ))
    }

    const showComments = () => {
        return (
            <div>
                <DisqusThread id={blog._id} title={blog.title} path={`/blog/${blog.slug}`} />
            </div>
        )
    }


    return (
        <React.Fragment>
            {head()}
            <Layout>
                <main>
                    <article>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="pl-5 col-md-3 ">
                                    <section className="display-4 pb-3 pt-3 font-weight-bold ml-4">
                                        {renderHtml(blog.title)}
                                    </section>
                                </div>
                                <div className="col-md-5 pl-0 pr-4">
                                    <section>
                                        {/* {JSON.stringify(blog)} */}
                                        <div className="row" style={{ marginTop: '-30px' }}>
                                            <img
                                                src={`${API}/blog/photo/${blog.slug}`}
                                                alt={blog.title}
                                                className="img img-fluid featured-img ml-5"
                                            />
                                        </div>
                                    </section>
                                </div>
                            </div>

                            <section>
                                <div className="container ml-0">
                                    <div className="row">
                                        {/* <div className="lead col-4-md mark">
                                            Written by: {blog.postedBy.username} | Last update: {moment(blog.updatedAt).fromNow()}
                    | Created: {moment(blog.createdAt).format('MMM DD YYYY h:mm A')}
                                        </div> */}
                                    </div>
                                </div>
                            </section>
                            <section>
                                <div className="container">
                                    <h1 className="display-2pb-3 pt-3 text-center font-weight-bold">{blog.title}</h1>
                                    <p className="lead mt-3 mark" style={{ width: '100%' }}>
                                        Written by: <Link href={`/profile/${blog.postedBy.username}`}><a>{blog.postedBy.username}</a></Link> | Last update: {moment(blog.updatedAt).fromNow()}
                    | Created: {moment(blog.createdAt).format('MMM DD YYYY h:mm A')}
                                    </p>
                                    <div className="pb-3">
                                        {showBlogCategories(blog)}
                                        {showBlogTags(blog)}
                                    </div>
                                </div>
                            </section>
                        </div>
                        <div className="container">
                            <section>
                                <div className="col-md-12 lead text-justified"> {renderHtml(blog.body)}</div>
                            </section>
                        </div>
                        <div className="container pb-5">
                            <h4 className="text-center pt-5 pb-5 h2">Related blogs</h4>
                            <hr />
                            {/* <p>Show related blogs</p> */}
                            {/* {JSON.stringify(relatedBlogs)} */}
                            <div className="row">
                                {showRelatedBlogs()}
                            </div>
                        </div>
                        <div className="container pb-5">
                            {/* <p>Show comments</p> */}
                            {showComments()}
                        </div>
                    </article>
                </main>
            </Layout>
        </React.Fragment >
    )
}


SingleBlog.getInitialProps = ({ query }) => {
    return showSingleBlog(query.slug).then(data => {

        // return showSingleBlog(`${query.slug}`).then(data => {
        console.log('data in showSingleBlog', data)
        if (data.error) {
            console.log('data.error in [slug].js', data.error)
        } else {
            // console.log('data from getInitialProps', data);
            return {
                blog: data,
                query: query
            }
        }
    })
}

export default SingleBlog;