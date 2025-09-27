import { HashLink } from "react-router-hash-link";

const Footer = () => {
    return (
        <footer className="bg-dark text-white py-5">
            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-4">
                        <div className="mb-4">
                            <h3 className="fw-bold text-primary">
                                <i className="bi bi-wallet2 me-2"></i>Wealthwise
                            </h3>
                            <p className="text-light opacity-75">
                                Empowering individuals to take control of their
                                financial journey with intelligent money
                                management solutions.
                            </p>
                        </div>
                        <div className="d-flex gap-3">
                            <a
                                href="#"
                                className="text-white opacity-75 hover-opacity-100"
                            >
                                <i
                                    className="bi bi-facebook"
                                    style={{ fontSize: "1.5rem" }}
                                ></i>
                            </a>
                            <a
                                href="#"
                                className="text-white opacity-75 hover-opacity-100"
                            >
                                <i
                                    className="bi bi-twitter"
                                    style={{ fontSize: "1.5rem" }}
                                ></i>
                            </a>
                            <a
                                href="#"
                                className="text-white opacity-75 hover-opacity-100"
                            >
                                <i
                                    className="bi bi-linkedin"
                                    style={{ fontSize: "1.5rem" }}
                                ></i>
                            </a>
                            <a
                                href="#"
                                className="text-white opacity-75 hover-opacity-100"
                            >
                                <i
                                    className="bi bi-instagram"
                                    style={{ fontSize: "1.5rem" }}
                                ></i>
                            </a>
                        </div>
                    </div>

                    <div className="col-lg-2 col-md-6">
                        <h5 className="fw-bold mb-3">Quick Links</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <HashLink
                                    smooth
                                    to="#"
                                    className="text-white opacity-75 text-decoration-none hover-opacity-100"
                                >
                                    Home
                                </HashLink>
                            </li>
                            <li className="mb-2">
                                <HashLink
                                    smooth
                                    to="#about-us"
                                    className="text-white opacity-75 text-decoration-none hover-opacity-100"
                                >
                                    About
                                </HashLink>
                            </li>
                            <li className="mb-2">
                                <HashLink
                                    smooth
                                    to="#features"
                                    className="text-white opacity-75 text-decoration-none hover-opacity-100"
                                >
                                    Features
                                </HashLink>
                            </li>
                            <li className="mb-2">
                                <HashLink
                                    smooth
                                    to="#services"
                                    className="text-white opacity-75 text-decoration-none hover-opacity-100"
                                >
                                    Services
                                </HashLink>
                            </li>
                        </ul>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <h5 className="fw-bold mb-3">Services</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <a
                                    href="#"
                                    className="text-white opacity-75 text-decoration-none hover-opacity-100"
                                >
                                    Financial Planning
                                </a>
                            </li>
                            <li className="mb-2">
                                <a
                                    href="#"
                                    className="text-white opacity-75 text-decoration-none hover-opacity-100"
                                >
                                    Expense Tracking
                                </a>
                            </li>
                            <li className="mb-2">
                                <a
                                    href="#"
                                    className="text-white opacity-75 text-decoration-none hover-opacity-100"
                                >
                                    Budget Management
                                </a>
                            </li>
                            <li className="mb-2">
                                <a
                                    href="#"
                                    className="text-white opacity-75 text-decoration-none hover-opacity-100"
                                >
                                    Investment Analysis
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="col-lg-3">
                        <h5 className="fw-bold mb-3">Contact Info</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2 d-flex align-items-center">
                                <i className="bi bi-geo-alt text-primary me-2"></i>
                                <span className="text-white opacity-75">
                                    123 Financial St, Money City
                                </span>
                            </li>
                            <li className="mb-2 d-flex align-items-center">
                                <i className="bi bi-telephone text-primary me-2"></i>
                                <span className="text-white opacity-75">
                                    +1 (555) 123-4567
                                </span>
                            </li>
                            <li className="mb-2 d-flex align-items-center">
                                <i className="bi bi-envelope text-primary me-2"></i>
                                <span className="text-white opacity-75">
                                    info@wealthwise.com
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <hr className="my-4 opacity-25" />

                <div className="row align-items-center">
                    <div className="col-md-6">
                        <p className="mb-0 text-white opacity-75">
                            © 2025 Wealthwise, Inc. All rights reserved.
                        </p>
                    </div>
                    <div className="col-md-6 text-md-end">
                        <div className="d-flex justify-content-md-end gap-3">
                            <a
                                href="#"
                                className="text-white opacity-75 text-decoration-none hover-opacity-100"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="text-white opacity-75 text-decoration-none hover-opacity-100"
                            >
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
