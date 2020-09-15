import Link from 'next/link';
import { API } from '../../config';
import moment from 'moment';
import renderHtml from 'react-render-html';

const CardRelatedBlog = ({ relatedBlog }) => {

    return (
        <div className="card" style={{ maxHeight: '900px' }}>
            <section>
                <Link href={`/blogs/${relatedBlog.slug}`}>
                    <a>
                        <img
                            className="img img-fluid"
                            style={{ maxHeight: '200px', width: '100%' }}
                            // style={{ height: '150px', width: '100%' }}

                            src={`${API}/blog/photo/${relatedBlog.slug}`}
                            alt={relatedBlog.title}
                        // onError={i => i.target.src = `../../static/images/safeTravel.jpg`}
                        />
                    </a>
                </Link >
            </section>
            <div className="card-body">
                <section>
                    <Link href={`/blogs/${relatedBlog.slug}`}>
                        <a><h5 className="card-title">{relatedBlog.title}</h5></a>
                    </Link >
                    <p className="card-text" style={{ maxHeight: '200px' }}>{renderHtml(relatedBlog.excerpt)}</p>
                </section>
            </div>
            {/* <Link href={`/blogs/${relatedBlog.slug}`}>
                    <a className="btn btn-primary pt-2">Read more</a>
                </Link> */}
            <div className="card-body mt-5">
                <div>
                    <hr />
                    Posted: {moment(relatedBlog.createdAt).format('MMM DD YYYY h:mm A')}
                </div>
                <div>
                    by{' '}
                    <Link href={`/profile/${relatedBlog.postedBy.username}`}>
                        <a>{relatedBlog.postedBy.username}</a>
                    </Link>
                    <div>
                        Last update: {moment(relatedBlog.updatedAt).fromNow()}
                    </div>
                </div>
            </div>


        </div>
    )
}

export default CardRelatedBlog;