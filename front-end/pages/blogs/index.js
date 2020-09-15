import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import { withRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useState } from 'react';
import { listBlogsWithCategoriesAndTags } from '../../actions/blogActions';
import { API } from '../../config';
import { Fragment } from 'react';
// import moment from 'moment';
// import renderHtml from 'react-render-html';
import Card from '../../components/blogs/Card';
import { APP_NAME, DOMAIN } from '../../config';
// import { FB_APP_ID } from '../../config';

const Blogs = ({ blogs, categories, tags, totalBlogs, blogsLimit, blogsSkip, router }) => {

    const [limit, setLimit] = useState(blogsLimit)
    const [skip, setSkip] = useState(0)
    const [size, setSize] = useState(totalBlogs)
    const [loadedBlogs, setLoadedBlogs] = useState([])

    function wait(ms) {
        var start = new Date().getTime();
        var end = start;
        while (end < start + ms) {
            end = new Date().getTime();
        }
    }

    const head = () => (
        <Head>
            <title>Blogs | {APP_NAME}</title>
            <meta
                name="description"
                content="Safe travels"
            />
            <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
            <meta
                property="og:title"
                content={`Journal | ${APP_NAME} `}
            />
            <meta
                property="og:description"
                content="Safe travels"
            />
            <meta
                property="og:type"
                content="website"
            />
            <meta
                property="og:url"
                content={`${DOMAIN}${router.pathname}`}
            />
            <meta
                property="og:site_name"
                content={`${APP_NAME}`}
            />
            <meta
                property="og:image"
                // content="/static/images/safeTravels.jpeg"
                content={`${DOMAIN}/static/images/safeTravels.jpeg`}

            />
            <meta
                property="og:image:secure_url"
                // content="/static/images/safeTravels.jpeg"
                content={`${DOMAIN}/static/images/safeTravels.jpeg`}
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

    // His Head
    //     <Head>
    //     <title>Programming blogs | {APP_NAME}</title>
    //     <meta
    //         name="description"
    //         content="Programing blogs..."
    //     />
    //     <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
    //     <meta 
    //     property="og:title" 
    //     content={`Latest web development tutorials | ${APP_NAME}`} />
    // </Head>
    // 

    const loadMoreBlogs = () => {
        let toSkip = skip + limit
        listBlogsWithCategoriesAndTags(toSkip, limit).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                setLoadedBlogs([...loadedBlogs, ...data.blogs])
                setSize(data.size)
                setSkip(toSkip)
            }
        })
    }

    const loadMoreButton = () => {
        return (
            size > 0 && size >= limit &&
            (<button onClick={loadMoreBlogs} className="btn btn-dark btn-lg">Load more</button>)
        )
    }

    const showAllBlogs = () => {
        return blogs.map((blog, index) => {
            return (
                <article key={index}>
                    <Card blog={blog} />
                    <hr />
                </article>
            );
        });
    };

    // const showAllCategories = () => {
    //     if (categories) {
    //         return categories.map((category, index) => {
    //             return (
    //                 <Link key={index} href={`/categories/${category.slug}`}>
    //                     <a className="btn btn-primary mr-1 ml-1 mt-3">{category.name}</a>
    //                 </Link>
    //             )
    //         })
    //     }
    // }

    const showAllCategories = () => {
        if (categories) {
            return categories.map((c, i) => (
                <Link href={`/categories/${c.slug}`} key={i}>
                    <a className="btn btn-dark mr-1 ml-1 mt-3">{c.name}</a>
                </Link>
            ));
        }
        else {
            wait(5000)
            Router.push('/blogs')
            // showAllCategories()
        }
    };

    // const showAllCategories = () => {
    //     if (categories) {
    //         return categories.map((c, i) => (
    //             <Link href={`/categories/${c.slug}`} key={i}>
    //                 <a className="btn btn-primary mr-1 ml-1 mt-3">{c.name}</a>
    //             </Link>
    //         ));
    //     }
    //     else if (categories) {
    //         return categories.map((c, i) => (
    //             <Link href={`/categories/${c.slug}`} key={i}>
    //                 <a className="btn btn-primary mr-1 ml-1 mt-3">{c.name}</a>
    //             </Link>
    //         ));

    //     }
    // };

    const showAllTags = () => {
        return tags.map((tag, index) => {
            return (
                <Link key={index} href={`/tags/${tag.slug}`}>
                    <a className="btn btn-outline-dark mr-1 ml-1 mt-3">{tag.name}</a>
                </Link>
            )
        })
    }

    const showLoadedBlogs = () => {
        return loadedBlogs.map((blog, index) => {
            return (
                <article key={index}>
                    <Card blog={blog} />
                    <hr />
                </article>
            );
        });
    };

    return (
        <React.Fragment>
            {head()}
            <Layout>
                <main>
                    <div className="container-fluid">
                        <header>
                            <div className="col-md-12 pt-0 mt-5 center">
                                <h1 className="display-4 font-weight-bold text-center">Blogs</h1>
                            </div>
                            <section>
                                {/* <p>Show categories and tags</p> */}
                                {/* <p>{JSON.stringify(categories).map((category, index) => {
                                return (
                                    <p key={index}>caegory.name</p>
                                )
                            })}</p> */}
                                <div className="pb-5 text-center">
                                    <br />
                                    <br />
                                    {showAllCategories()}
                                    <br />
                                    {showAllTags()}
                                </div>

                            </section>
                        </header>
                    </div>
                    {/* <div className="container-fluid"> */}
                    {/* <div className="row"> */}
                    {/* <div className="col-md-12">Show all {JSON.stringify(size)} blogs</div> */}
                    {/* <div className="col-md-12">
                                {showAllBlogs()}
                            </div> */}
                    <div className="container-fluid">{showAllBlogs()}</div>
                    <div className="container-fluid">{showLoadedBlogs()}</div>
                    <div className="text-center pt-5 pb-5">{loadMoreButton()}</div>
                    {/* </div> */}
                    {/* </div> */}
                </main>
            </Layout>
        </React.Fragment>

    )
}

Blogs.getInitialProps = () => {
    let skip = 0
    let limit = 2
    return listBlogsWithCategoriesAndTags(skip, limit).then(data => {
        if (data.error) {
            console.log('data.error in Blogs.js', data.error)
        } else {
            // console.log('data from getInitialProps', data);
            return {
                blogs: data.blogs,
                categories: data.categories,
                tags: data.tags,
                totalBlogs: data.size,
                blogsLimit: limit,
                blogsSkip: skip
            }
        }
    })
}

export default withRouter(Blogs);
