import { HashLink } from "react-router-hash-link"

import { Link } from "react-router-dom";

import { useAuth } from "../../../hooks/useAuth";

const HomepageNav = () => {

    const { user, loading } = useAuth();

   

    return <nav className="navbar navbar-expand-lg navbar-light bg-light" id="#">

        <div className="container">

            <HashLink className="navbar-brand text-primary" href="#">Wealthwise</HashLink>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">

                <span className="navbar-toggler-icon"></span>

            </button>

            <div className="collapse navbar-collapse d-lg-flex justify-content-between" id="navbarNavAltMarkup">

                <div className="navbar-nav">

                    <HashLink smooth className="nav-link" aria-current="page" to="#about-us">About us</HashLink>

                    <HashLink smooth className="nav-link" to="#features">Features</HashLink>

                    <HashLink smooth className="nav-link" to="#services">Services</HashLink>

                    <HashLink smooth className="nav-link" to="#testimonials">Testimonials</HashLink>

                </div>

                <div className="d-flex align-items-center gap-2">

                    {

                        (user && !loading) ?

                            <Link to={"/dashboard"} className="btn btn-outline-primary btn-sm">Dashboard</Link> :

                            <>

                                <Link to={"/login"} className="btn btn-outline-primary btn-sm">Login</Link>

                                <Link to={"/register"} className="btn btn-outline-success btn-sm">Sign up</Link>

                            </>

                    }


 

                </div>

            </div>

        </div>

    </nav>

}


 

export default HomepageNav;