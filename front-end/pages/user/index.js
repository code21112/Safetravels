import Layout from '../../components/Layout';
import Private from '../../components/auth/Private';
import Link from 'next/link';

const UserIndex = () => {
    return (
        <Layout>
            <Private>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 pt-5 pb-5">
                            <h2>User dashboard</h2>
                        </div>
                        <div className="col-md-4">
                            <ul className="list-group">
                                {/* <li className="list-group-item">
                                    <Link href="/admin/crud/category-tag">
                                        <a>Create a category</a>
                                    </Link>
                                </li>
                                <li className="list-group-item">
                                    <Link href="/admin/crud/category-tag">
                                        <a>Create a tag</a>
                                    </Link>
                                </li> */}
                                {/* <li className="list-group-item">
                                    <Link href="/admin/crud/blog">
                                        <a>Create a blog</a>
                                    </Link>
                                </li> */}
                                <li className="list-group-item">
                                    <a href="/user/update">Update your profile</a>
                                </li>
                                <li className="list-group-item">
                                    <a href="/user/crud/blog">Create a blog</a>
                                </li>
                                <li className="list-group-item">
                                    <Link href="/user/crud/blogs">
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
            </Private>
        </Layout>
    )
}

export default UserIndex;