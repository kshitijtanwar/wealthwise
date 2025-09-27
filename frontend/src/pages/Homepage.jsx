import HomepageNav from "../components/Homepage/HomepageNav";

import About from "../components/Homepage/About";

import Features from "../components/Homepage/Features";

import Services from "../components/Homepage/Services";

import Testimonials from "../components/Homepage/Testimonials";

import Footer from "../components/Homepage/Footer";

const Homepage = () => {
    return (
        <div>
            <HomepageNav />
            <main>
                <About />
                <Features />
                <Services />
                <Testimonials />
            </main>
            <Footer />
        </div>
    );
};

export default Homepage;
