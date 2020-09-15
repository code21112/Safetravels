import Layout from '../components/Layout';
import Private from '../components/auth/Private';
import Link from 'next/link';
// import { TweenMax } from "gsap";


const Index = () => {

    // const loading = () => {
    //     TweenMax.set('body', { opacity: 1 });
    //     let tl1 = new TimelineMax();

    //     tl1
    //         .from('.sphere', 0.8, { delay: 0.1, scale: 0, top: "50%", left: "50%", opacity: 0, ease: Back.easeOut.config(1.7) })
    //         .to('.intro-container', 1, { top: 80, left: 82, right: 82, bottom: 80 }, '+0.15')
    //         .to('.ligne1', 1, { width: "100%", ease: Circ.easeIn }, 1)
    //         .to('.ligne2', 1, { height: "100%", ease: Circ.easeIn }, 1)
    //         .to('.sphere', 1, { left: '75%', ease: Back.easeOut.config(2.7) })
    //         .from('.firstH1', 0.5, { opacity: 0, right: "200%" }, '-=1')
    //         .from('.secondH1', 0.7, { opacity: 0, right: "200%" }, '-=1')
    //         .staggerFrom('.item', 0.3, { y: 50, opacity: 0 }, 0.3);
    // }

    return (
        <Layout>
            {/* <h2>Index page</h2> */}
            {/* {loading()} */}

            <div className="ligne1"></div>
            <div className="ligne2"></div>

            <div className="containerAccueil">

                <div className="titre">
                    <h1>
                        <span className="firstH1">Safe</span>
                        <br />
                        <span className="secondH1">&nbsp;travels</span>
                    </h1>
                </div>

                <div className="imgItem">
                    <img src="../static/images/sphere.gif" alt="gif sphere" className="sphere" />
                </div>
            </div>

            {/* <Link href="/signup">
                <a>Signup</a>
            </Link> */}
        </Layout>
    )
}

export default Index;
