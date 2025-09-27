import { HashLink } from "react-router-hash-link"


 

const Footer = () => {

    return <div className="container">

        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">

            <p className="col-md-4 mb-0 text-muted">© 2025 Wealthwise, Inc</p>


 

            <HashLink to="/" className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">

                <svg className="bi me-2" width="40" height="32"><use xlink:to="#bootstrap"></use></svg>

            </HashLink>


 

            <ul className="nav col-md-4 justify-content-end">

                <li className="nav-item"><HashLink smooth to="#" className="nav-link px-2 text-muted">Home</HashLink></li>

                <li className="nav-item"><HashLink smooth to="#about-us" className="nav-link px-2 text-muted">About</HashLink></li>

                <li className="nav-item"><HashLink smooth to="#features" className="nav-link px-2 text-muted">Features</HashLink></li>

                <li className="nav-item"><HashLink smooth to="#services" className="nav-link px-2 text-muted">Services</HashLink></li>

                <li className="nav-item"><HashLink smooth to="#testimonials" className="nav-link px-2 text-muted">Testimonials</HashLink></li>

            </ul>

        </footer>

    </div>

}


 

export default Footer