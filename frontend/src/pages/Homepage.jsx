import HomepageNav from "../components/Homepage/HomepageNav";

import About from "../components/Homepage/About";

import Features from "../components/Homepage/Features";

import Services from "../components/Homepage/Services";

import Testimonials from "../components/Homepage/Testimonials";

import Footer from "../components/Homepage/Footer";

const Homepage = () => {
    return (
        <section>
            <HomepageNav />

            <div className="container-fluid">
                <About />

                <Features />

                <Services />

                <Testimonials />
            </div>

            <Footer />
        </section>
    );
};

export default Homepage;
