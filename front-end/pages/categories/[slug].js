import Head from 'next/head';
import Link from 'next/link';
// import { withRouter } from 'next/router';
import Layout from '../../components/Layout';
// import { useState, useEffect } from 'react';
import { singleCategory } from '../../actions/categActions';

import { API, APP_NAME, DOMAIN } from '../../config';
import '../../static/css/styles.css';
import moment from 'moment';
import renderHtml from 'react-render-html';
import Card from '../../components/blogs/Card';


const Category = ({ category, blogsAssociated, query }) => {

    // const showBlogsAssociated = (blogsAssociated) => {
    //     return (
    //         blogsAssociated.map((blogAssociated, index) => {
    //             return (
    //                 <p key={index}>{blogAssociated.title}</p>
    //             )
    //         })
    //     )
    // }

    const head = () => (
        <Head>
            <title>{category.name} | {APP_NAME}</title>
            <meta
                name="description"
                content={`Safe travels about ${category.name}`}
            />
            {/* <link rel="canonical" href={`${DOMAIN}/blogs/${slug}`} /> */}
            <link rel="canonical" href={`${DOMAIN}/categories/${query.slug}`} />

            <meta
                property="og:title"
                content={`${category.name} | ${APP_NAME} `}
            />
            <meta
                property="og:description"
                content={`Safe travels about ${category.name}`}
            />
            <meta
                property="og:type"
                content="website"
            />
            <meta
                property="og:url"
                content={`${DOMAIN}/categories/${query.slug}`}
            />
            <meta
                property="og:site_name"
                content={`${APP_NAME}`}
            />
            <meta
                property="og:image"
                // content="/static/images/safeTravels.jpeg"
                // content={`${API}/blog/photo/${blog.slug}`}
                content={`${DOMAIN}/static/images/safeTravels.jpeg`}


            />
            <meta
                property="og:image:secure_url"
                // content="/static/images/safeTravels.jpeg"
                // content={`${API}/blog/photo/${query.slug}`}
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

    return (
        <React.Fragment>
            {head()}
            <Layout>
                <main>
                    <div className="container-fluid text-center">
                        <header>
                            <div className="col-md-12 pt-3">
                                <h1 className="display-4 font-weight-bold">{category.name}</h1>
                                {/* {JSON.stringify(blogsAssociated)} */}
                                {/* {showBlogsAssociated(blogsAssociated)} */}
                                {blogsAssociated.map((blogAssociated, index) => {
                                    return (
                                        <div>
                                            <br />
                                            <Card key={index} blog={blogAssociated} />
                                            <hr />
                                        </div>
                                    )
                                })}
                            </div>
                        </header>
                    </div>
                </main>
            </Layout>
        </React.Fragment >
    )
}

Category.getInitialProps = ({ query }) => {
    return singleCategory(query.slug).then(data => {

        // return showSingleBlog(`${query.slug}`).then(data => {
        console.log('data in singleCategory', data)
        if (data.error) {
            console.log('data.error in [slug].js of categories', data.error)
        } else {
            // console.log('data from getInitialProps', data);
            return {
                category: data.category,
                blogsAssociated: data.blogs,
                query: query
            }
        }
    })
}

export default Category;