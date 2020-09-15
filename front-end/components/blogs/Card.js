import Link from 'next/link';
import { API } from '../../config';
import moment from 'moment';
import renderHtml from 'react-render-html';

const Card = ({ blog }) => {

    const showBlogCategories = blog =>
        // console.log('blog in showBlogCategories', blog)
        // console.log('blog.categories in showBlogCategories', blog.categories)
        blog.categories.map((category, index) => (
            <Link href={`/categories/${category.slug}`} key={index}>
                <a className="btn btn-dark mr-1 ml-1 mt-3 mb-3">{category.name}</a>
            </Link>
        ))


    const showBlogTags = blog => {
        // console.log('blog in showBlogCategories', blog)
        // console.log('blog.categories in showBlogCategories', blog.categories)
        return blog.tags.map((tag, index) => (
            <Link href={`/tags/${tag.slug}`} key={index}>
                <a className="btn btn-outline-dark mr-1 ml-1 mt-3 mb-3">{tag.name}</a>
            </Link>
        ))
    }

    return (
        <div className="lead pb-4">
            <header>
                <Link href={`/blogs/${blog.slug}`}>
                    <a>
                        {/* <h2 className="pt-3 pb-3 font-weight-bold">{blog.title}</h2> */}
                        <h2 className="pt-3 pb-3 font-weight-bold blog-title text-decoration-none effect4">{blog.title}</h2>
                    </a>
                </Link>
            </header>
            <section>
                <p className="mark ml-1 pt-2 pb-2 text-decoration-none">
                    Written by: <Link href={`/profile/${blog.postedBy.username}`}><a>{blog.postedBy.username}</a></Link> | Last update: {moment(blog.updatedAt).fromNow()}
                    | Created: {moment(blog.createdAt).format('MMM DD YYYY h:mm A')}

                </p>
            </section>
            <section>
                <p>Blog's categories and tags</p>
                {/* <div className="container-fluid display-flex"> */}
                {showBlogCategories(blog)}
                {showBlogTags(blog)}
                {/* <hr />
                        {JSON.stringify(blog.categories)}
                        {JSON.stringify(blog.tags)} */}

                {/* </div> */}
            </section>
            <br />

            <div className="row">
                <div className="col-md-4">

                    <section>
                        <img
                            className="img img-fluid"
                            style={{ maxHeight: '500px', width: 'auto' }}
                            src={`${API}/blog/photo/${blog.slug}`}
                            alt={blog.title}
                        />

                        {/* <img
                            src={`${process.env.REACT_APP_API_URL}/post/photo/${blog._id}`}
                            alt={blog.title}
                            onError={image => (image.target.src = `${DefaultBlog}`)}
                            className="img-thunbnail mb-3"
                        /> */}
                    </section>
                </div>
                <div className="col-md-4">Excerpt
                            <section>
                        <div className="pb-3">
                            {renderHtml(blog.excerpt)}

                        </div>
                        <Link href={`/blogs/${blog.slug}`}>
                            <a className="btn btn-outline-dark pt-2">Read more</a>
                        </Link>
                    </section>
                </div>

            </div>
        </div >
    )
}

export default Card;