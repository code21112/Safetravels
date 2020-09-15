import Layout from '../../components/Layout';
import Admin from '../../components/auth/Admin';
import Link from 'next/link';

const AdminIndex = () => {
    return (
        <Layout>
            <Admin>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 pt-5 pb-5">
                            <h2>Admin dashboard</h2>
                        </div>
                        <div className="col-md-4">
                            <ul className="list-group">
                                <li className="list-group-item">
                                    <Link href="/user/update">
                                        <a>Update profile</a>
                                    </Link>
                                </li>
                                <li className="list-group-item">
                                    <Link href="/admin/crud/category-tag">
                                        <a>Create a category</a>
                                    </Link>
                                </li>
                                <li className="list-group-item">
                                    <Link href="/admin/crud/category-tag">
                                        <a>Create a tag</a>
                                    </Link>
                                </li>
                                {/* <li className="list-group-item">
                                    <Link href="/admin/crud/blog">
                                        <a>Create a blog</a>
                                    </Link>
                                </li> */}
                                <li className="list-group-item">
                                    <a href="/admin/crud/blog">Create a blog</a>
                                </li>
                                <li className="list-group-item">
                                    <Link href="/admin/crud/blogs">
                                        <a>Manage blogs</a>
                                    </Link>
                                </li>


                            </ul>

                        </div>
                        <div className="col-md-8">
                            right
                    </div>

                    </div>

                </div>
            </Admin>
        </Layout >
    )
}

export default AdminIndex;