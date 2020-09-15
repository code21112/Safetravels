import Layout from '../components/Layout';
import Private from '../components/auth/Private';
import Link from 'next/link';

const Index = () => {
    return (
        <Layout>
            <div>Test</div>
            <h2>Index page</h2>
            <Link href="/signup">
                <a>Signup</a>
            </Link>
        </Layout>
    )
}

export default Index;
