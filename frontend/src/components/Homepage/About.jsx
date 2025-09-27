// import placeholder from "../../assets/images/Aboutus.webp";
import { HashLink } from "react-router-hash-link";

const About = () => {
    return (
        <div
            className="bg-gradient"
            style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
            id="about-us"
        >
            <div className="container py-5">
                <div className="row min-vh-100 align-items-center text-white">
                    <div className="col-lg-6 order-lg-2">
                        <div className="text-center mb-5 mb-lg-0">
                            <div
                                className="bg-white bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center"
                                style={{ width: "300px", height: "300px" }}
                            >
                                <i
                                    className="bi bi-graph-up-arrow text-white"
                                    style={{ fontSize: "8rem" }}
                                ></i>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 order-lg-1">
                        <div className="pe-lg-5">
                            <h1 className="display-3 fw-bold mb-4">
                                Welcome to{" "}
                                <span className="text-warning">Wealthwise</span>
                            </h1>
                            <p className="lead fs-4 mb-4">
                                Transform your financial future with intelligent
                                money management
                            </p>
                            <p className="fs-5 mb-4 opacity-90">
                                We at Wealthwise are dedicated to simplifying
                                personal finance management through an intuitive
                                and efficient web application. Our platform
                                helps users track expenses, analyze spending
                                patterns, and make smarter financial decisions
                                with ease.
                            </p>
                            <p className="fs-5 opacity-90">
                                With a focus on user-friendly design and robust
                                features, we aim to empower individuals to take
                                control of their financial journey.
                            </p>
                            <div className="mt-5">
                                <HashLink
                                    smooth
                                    to="#features"
                                    className="btn btn-warning btn-lg px-5 py-3 rounded-pill me-3"
                                >
                                    Explore Features
                                </HashLink>
                                <HashLink
                                    smooth
                                    to="#services"
                                    className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill"
                                >
                                    Our Services
                                </HashLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
