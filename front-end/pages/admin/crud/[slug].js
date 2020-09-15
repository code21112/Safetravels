import Layout from '../../../components/Layout';
import Admin from '../../../components/auth/Admin';
import UpdateBlog from '../../../components/crud/UpdateBlog';
import Link from 'next/link';

const Blog = () => {
    return (
        <Layout>
            <Admin>
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
            </Admin>
        </Layout>
    )
}

export default Blog;