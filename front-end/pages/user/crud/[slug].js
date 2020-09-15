import Layout from '../../../components/Layout';
import Private from '../../../components/auth/Private';
import UpdateBlog from '../../../components/crud/UpdateBlog';
import Link from 'next/link';

const Blog = () => {
    return (
        <Layout>
            <Private>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 pt-5 pb-5">
                            <h2>Update a blog</h2>
                        </div>
                        <div className="col-md-6">
                            {/* <p>Categories</p> */}
                            <UpdateBlog />
                        </div>
                    </div>

                </div>
            </Private>
        </Layout>
    )
}

export default Blog;