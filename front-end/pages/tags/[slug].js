import Head from 'next/head';
import Link from 'next/link';
// import { withRouter } from 'next/router';
import Layout from '../../components/Layout';
// import { useState, useEffect } from 'react';
import { singleTag } from '../../actions/tagActions';

import { API, APP_NAME, DOMAIN } from '../../config';
import '../../static/css/styles.css';
import moment from 'moment';
import renderHtml from 'react-render-html';
import Card from '../../components/blogs/Card';


const Tag = ({ tag, blogsAssociated, query }) => {

    const head = () => (
        <Head>
            <title>{tag.name} | {APP_NAME}</title>
            <meta
                name="description"
                content={`Safe travels about ${tag.name}`}
            />
            {/* <link rel="canonical" href={`${DOMAIN}/blogs/${slug}`} /> */}
            <link rel="canonical" href={`${DOMAIN}/tags/${query.slug}`} />

            <meta
                property="og:title"
                content={`${tag.name} | ${APP_NAME} `}
            />
            <meta
                property="og:description"
                content={`Safe travels about ${tag.name}`}
            />
            <meta
                property="og:type"
                content="website"
            />
            <meta
                property="og:url"
                content={`${DOMAIN}/tags/${query.slug}`}
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
            <Layout>
                <main>
                    <div className="container-fluid text-center">
                        <header>
                            <div className="col-md-12 pt-3">
                                <h1 className="display-4 font-weight-bold">{tag.name}</h1>
                                {blogsAssociated.map((blogAssociated, index) => {
                                    return (
                                        <div>
                                            <br />
                                            <Card blog={blogAssociated} key={index} />
                                            <hr />
                                        </div>
                                    )
                                })}
                            </div>
                        </header>
                    </div>

                </main>
            </Layout>
        </React.Fragment>
    )
}

Tag.getInitialProps = ({ query }) => {
    return singleTag(query.slug).then(data => {

        // return showSingleBlog(`${query.slug}`).then(data => {
        console.log('data in singleTag', data)
        if (data.error) {
            console.log('data.error in [slug].js of tags', data.error)
        } else {
            // console.log('data from getInitialProps', data);
            return {
                tag: data.tag,
                blogsAssociated: data.blogs,
                query: query
            }
        }
    })
}

export default Tag;