import Layout from '../../../components/Layout';
import Admin from '../../../components/auth/Admin';
import ManageBlogs from '../../../components/crud/ManageBlogs';
import Link from 'next/link';

const Blog = () => {
    return (
        <Layout>
            <Admin>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 pt-5 pb-5 text-center">
                            <h2>Manage blogs</h2>
                        </div>
                        <div className="col-md-6">
                            {/* <p>Categories</p> */}
                            <ManageBlogs />
                        </div>
                    </div>

                </div>
            </Admin>
        </Layout>
    )
}

export default Blog;