import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { userPublicProfile } from '../../actions/userActions';
import { API, APP_NAME, DOMAIN } from '../../config';
import '../../static/css/styles.css';
import moment from 'moment';
import { sendMail } from "../../mailing/sendinblue";


const UserProfile = ({ user, blogs, query }) => {

    const head = () => (
        <Head>
            <title>{user.username} | {APP_NAME}</title>
            <meta
                name="description"
                content={`Blogs by ${user.username}`}
            />
            {/* <link rel="canonical" href={`${DOMAIN}/blogs/${slug}`} /> */}
            <link rel="canonical" href={`${DOMAIN}/profile/${query.username}`} />

            <meta
                property="og:title"
                content={`Blogs by ${user.username}| ${APP_NAME} `}
            />
            <meta
                property="og:description"
                content={`Blogs by ${user.username}`}
            />
            <meta
                property="og:type"
                content="website"
            />
            <meta
                property="og:url"
                content={`${DOMAIN}/profile/${query.username}`}
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

    const showUserBlogs = () => {
        return (
            blogs.map((blog, index) => {
                return (
                    <div key={index} className="mt-4 mb-4">
                        <Link href={`/blogs/${blog.slug}`}>
                            <a className="lead">{blog.title}</a>
                        </Link>

                    </div>
                )
            })
        )
    }

    // CODE for Sendinblue and emailing

    const buttonWrapperStyle = {
        color: "white",
        display: "inline-block",
        backgroundColor: "DodgerBlue",
        padding: "10px",
        fontFamily: "Arial",
        maxWidth: '240px',
        margin: '0 auto',
        borderRadius: '3px'
    };

    async function handleOnClick() {
        let response = await sendMail('https://craftcode.design/');
        console.log(response);
    }

    const handleChange = () => {
        return
    }

    //   END of CODE for Sendinblue and emailing
    return (
        <React.Fragment>
            {head()}
            <Layout>
                <div className="container">
                    <div className="row pt-4">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <h5>{user.name}</h5>
                                            <p className="text-muted">Joined {moment(user.createdAt).fromNow()}</p>
                                            {/* | Created: {moment(blog.createdAt).format('MMM DD YYYY h:mm A')} */}
                                        </div>
                                        <div className="col-md-4">
                                            <img
                                                src={`${API}/user/photo/${user.username}`}
                                                className="img img-fluid img-thumbnail mb-3"
                                                style={{ maxHeight: '100px', maxWidth: '100%' }}
                                                alt="user profile"
                                            />
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <br />
                <div className="container pb-5">
                    <div className="row">
                        <div className="col-6">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title bg-primary pt-4 pb-4 pl-4 pr-4 text-white">Recent blogs by {user.name}</h5>
                                    {/* <br /> */}
                                    <div className="card-body pt-0">
                                        {showUserBlogs()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title bg-primary pt-4 pb-4 pl-4 pr-4 text-white">Contact {user.name}</h5>
                                    <br />
                                    <div style={buttonWrapperStyle}>
                                        <input onChange={() => handleChange()} onClick={() => handleOnClick()} type="text" value="https://craftcode.design/" /><button>Send me this url</button>
                                    </div>
                                    <p>Contact form</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </React.Fragment >
    )
}

UserProfile.getInitialProps = ({ query }) => {
    return userPublicProfile(query.username).then(data => {

        // return showSingleBlog(`${query.slug}`).then(data => {
        // console.log('data in userPublicProfile', data)
        if (data.error) {
            console.log('data.error in [username].js', data.error)
        } else {
            // console.log('data from getInitialProps', data);
            return {
                user: data.user,
                blogs: data.blogs,
                query: query
            }
        }
    })
}

export default UserProfile;