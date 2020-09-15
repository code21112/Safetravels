import Layout from '../components/Layout';
import Private from '../components/auth/Private';
import Link from 'next/link';
import { TweenMax, TimelineLite, Power3 } from "gsap";
import { useRef, useEffect } from 'react';


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
    let app = useRef(null)
    let firstH1 = useRef(null);
    let secondH1 = useRef(null);
    let image = useRef(null);
    let ligne1 = useRef(null);
    let ligne2 = useRef(null);
    let containerAccueil = useRef(null);
    let introContainer = useRef(null);


    let tl = new TimelineLite({ delay: 0.8 });

    // .from('.sphere', 0.8, { delay: 0.1, scale: 0, top: "50%", left: "50%", opacity: 0, ease: Back.easeOut.config(4) })
    //     .to('.intro-container', 1, { top: 80, left: 82, right: 82, bottom: 80 }, '+0.15')
    //     .to('.ligne1', 1, { width: "100%", ease: Circ.easeIn }, 1)
    //     .to('.ligne2', 1, { height: "100%", ease: Circ.easeIn }, 1)
    //     .to('.sphere', 1, { left: '75%', ease: Back.easeOut.config(2.7) })
    //     .from('.firstH1', 0.5, { opacity: 0, right: "200%" }, '-=1')
    //     .from('.secondH1', 0.7, { opacity: 0, right: "200%" }, '-=1')
    //     .staggerFrom('.item', 0.3, { y: 50, opacity: 0 }, 0.3);

    useEffect(() => {
        console.log(image)
        console.log(firstH1)
        console.log(secondH1)
        // TweenMax.set('body', { opacity: 1 });
        // TweenMax.to(app, 0, { css: { opacity: 1 } })
        // TweenMax.to(introContainer, { opacity: 1 });

        tl.from(image, 0.8, { delay: 0.1, scale: 0, top: "50%", left: "50%", opacity: 0, ease: Power3.easeOut })
            .to(ligne1, 1, { width: "100%", ease: Circ.easeIn }, 1)
            .to(ligne2, 1, { height: "100%", ease: Circ.easeIn }, 1)
            .to(image, 1, { left: '55%', ease: Back.easeOut.config(2.7) })
            .from(firstH1, 0.5, { opacity: 0, right: "200%" }, '-=1')
            .from(secondH1, 0.7, { opacity: 0, right: "200%" }, '-=1')

    }, [tl])

    return (
        <Layout>
            {/* <h2>Index page</h2> */}
            {/* {loading()} */}

            <div className="introContainer" ref={element => introContainer = element}>

                <div className="ligne1" ref={element => ligne1 = element}></div>
                <div className="ligne2" ref={element => ligne2 = element}></div>

                <div className="containerAccueil" ref={element => containerAccueil = element}>

                    <div className="titre">
                        <h1>
                            <span className="firstH1" ref={element => firstH1 = element}>Safe</span>
                            <br />
                            <span className="secondH1" ref={element => secondH1 = element}>&nbsp;travels</span>
                        </h1>
                    </div>

                    <div className="imgItem">
                        <img src="../static/images/sphere.gif" alt="gif sphere" className="sphere" ref={element => image = element} />
                    </div>
                </div>

            </div>

            {/* <Link href="/signup">
                <a>Signup</a>
            </Link> */}
        </Layout>
    )
}

export default Index;
