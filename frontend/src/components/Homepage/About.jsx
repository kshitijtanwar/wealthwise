

// import placeholder from "../../assets/images/Aboutus.webp";

const About = () => {
    return (
        <div className="min-vh-90 d-flex align-items-center" id="about-us">
            <div className="row w-100">
                <div className="col-md-6 d-flex justify-content-center justify-content-md-start">
                    <img
                        // src={placeholder}
                        alt="About us-image"
                        className="img-fluid rounded shadow"
                    />
                </div>

                <div className="col-md-6 d-flex flex-column justify-content-center">
                    <h2 className="mb-4 display-5 text-center">
                        {" "}
                        <span className="text-primary">About</span> our website
                    </h2>

                    <p className="text-md-start text-center">
                        "We at Wealthwise are dedicated to simplifying personal
                        finance management through an intutive and efficent web
                        application. Our platform helps users track expenses,
                        analyze spending patterns, and make smarter financial
                        decisions with ease. With a focous on user-friendly
                        design and robust features, we aim to empower
                        individuals to take control of their financial journey."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
