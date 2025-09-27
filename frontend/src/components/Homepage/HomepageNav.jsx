import { HashLink } from "react-router-hash-link";

import { Link } from "react-router-dom";

import { useAuth } from "../../../hooks/useAuth";

const HomepageNav = () => {
    const { user, loading } = useAuth();

    return (
        <nav
            className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top"
            id="#"
        >
            <div className="container">
                <HashLink
                    className="navbar-brand fw-bold fs-3 text-primary"
                    href="#"
                >
                    <i className="bi bi-wallet2 me-2"></i>Wealthwise
                </HashLink>
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className="collapse navbar-collapse"
                    id="navbarNavAltMarkup"
                >
                    <div className="navbar-nav mx-auto">
                        <HashLink
                            smooth
                            className="nav-link px-3 py-2 fw-medium"
                            aria-current="page"
                            to="#about-us"
                        >
                            About
                        </HashLink>
                        <HashLink
                            smooth
                            className="nav-link px-3 py-2 fw-medium"
                            to="#features"
                        >
                            Features
                        </HashLink>
                        <HashLink
                            smooth
                            className="nav-link px-3 py-2 fw-medium"
                            to="#services"
                        >
                            Services
                        </HashLink>
                        <HashLink
                            smooth
                            className="nav-link px-3 py-2 fw-medium"
                            to="#testimonials"
                        >
                            Testimonials
                        </HashLink>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        {user && !loading ? (
                            <Link
                                to={"/dashboard"}
                                className="btn btn-primary px-4 py-2 rounded-pill"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to={"/login"}
                                    className="btn btn-outline-primary px-4 py-2 rounded-pill"
                                >
                                    Login
                                </Link>
                                <Link
                                    to={"/register"}
                                    className="btn btn-primary px-4 py-2 rounded-pill ms-2"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default HomepageNav;
