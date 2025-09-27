// import placeholder from "../../assets/images/bulbasaur.avif";
const mock_testimonials = [
    {
        id: 1,
        name: "John Doe",
        role: "Web Developer",
        feedback:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam voluptate est a beatae veniam adipisci aut expedita iste nesciunt atque.",
        image: "https://via.placeholder.com/80",
    },
    {
        id: 2,
        name: "Jane Doe",
        role: "UI/UX Designer",
        feedback:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam voluptate est a beatae veniam adipisci aut expedita iste nesciunt atque.",
        image: "https://via.placeholder.com/80",
    },
    {
        id: 3,
        name: "Micheal Lee",
        role: "Web Developer",
        feedback:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam voluptate est a beatae veniam adipisci aut expedita iste nesciunt atque.",
        image: "https://via.placeholder.com/80",
    },
];

const Testimonials = () => {
    return (
        <section className="py-5 bg-light" id="testimonials">
            <div className="container py-5">
                <div className="row justify-content-center mb-5">
                    <div className="col-lg-8 text-center">
                        <h2 className="display-4 fw-bold mb-3">
                            What Our <span className="text-primary">Users</span>{" "}
                            Say
                        </h2>
                        <p className="lead text-muted">
                            Don't just take our word for it - hear from our
                            satisfied customers
                        </p>
                    </div>
                </div>

                <div className="row g-4">
                    {mock_testimonials.map((t) => {
                        return (
                            <div className="col-md-6 col-lg-4" key={t.id}>
                                <div
                                    className="card h-100 shadow-sm border-0 hover-lift"
                                    style={{
                                        transition: "transform 0.3s ease",
                                    }}
                                >
                                    <div className="card-body p-4 text-center">
                                        <div className="mb-4">
                                            <div
                                                className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center"
                                                style={{
                                                    width: "80px",
                                                    height: "80px",
                                                }}
                                            >
                                                <i
                                                    className="bi bi-person-circle text-primary"
                                                    style={{ fontSize: "3rem" }}
                                                ></i>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <i
                                                className="bi bi-quote text-primary"
                                                style={{ fontSize: "2rem" }}
                                            ></i>
                                        </div>
                                        <p className="card-text text-muted mb-4">
                                            {t.feedback}
                                        </p>
                                        <div className="border-top pt-3">
                                            <h5 className="card-title fw-bold mb-1">
                                                {t.name}
                                            </h5>
                                            <p className="text-muted small mb-0">
                                                {t.role}
                                            </p>
                                        </div>
                                        <div className="mt-3">
                                            <div className="text-warning">
                                                <i className="bi bi-star-fill"></i>
                                                <i className="bi bi-star-fill"></i>
                                                <i className="bi bi-star-fill"></i>
                                                <i className="bi bi-star-fill"></i>
                                                <i className="bi bi-star-fill"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
