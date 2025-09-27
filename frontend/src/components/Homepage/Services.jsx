const Services = () => {
    return (
        <section className="py-5" id="services">
            <div className="container py-5">
                <div className="row justify-content-center mb-5">
                    <div className="col-lg-8 text-center">
                        <h2 className="display-4 fw-bold mb-3">
                            Our Core{" "}
                            <span className="text-primary">Services</span>
                        </h2>
                        <p className="lead text-muted mb-5">
                            Unlock your financial potential with holistic
                            planning, gain clarity with insightful
                            visualizations, and move forward confidently with
                            uncompromising data security protecting your
                            journey.
                        </p>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-12 col-lg-4">
                        <div
                            className="card h-100 border-0 shadow-sm hover-lift"
                            style={{ transition: "transform 0.3s ease" }}
                        >
                            <div className="card-body p-4 text-center">
                                <div
                                    className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                                    style={{ width: "80px", height: "80px" }}
                                >
                                    <i
                                        className="bi bi-graph-up text-primary"
                                        style={{ fontSize: "2.5rem" }}
                                    ></i>
                                </div>
                                <h4 className="fw-bold mb-3">
                                    Financial Planning
                                </h4>
                                <p className="text-muted">
                                    Personalized strategies to achieve your
                                    financial goals with comprehensive planning
                                    and analysis.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-4">
                        <div
                            className="card h-100 border-0 shadow-sm hover-lift"
                            style={{ transition: "transform 0.3s ease" }}
                        >
                            <div className="card-body p-4 text-center">
                                <div
                                    className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                                    style={{ width: "80px", height: "80px" }}
                                >
                                    <i
                                        className="bi bi-bar-chart-line text-success"
                                        style={{ fontSize: "2.5rem" }}
                                    ></i>
                                </div>
                                <h4 className="fw-bold mb-3">
                                    Data Visualization
                                </h4>
                                <p className="text-muted">
                                    Gain deeper insights into your financial
                                    activities with intuitive and interactive
                                    visualizations.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-4">
                        <div
                            className="card h-100 border-0 shadow-sm hover-lift"
                            style={{ transition: "transform 0.3s ease" }}
                        >
                            <div className="card-body p-4 text-center">
                                <div
                                    className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                                    style={{ width: "80px", height: "80px" }}
                                >
                                    <i
                                        className="bi bi-shield-lock text-warning"
                                        style={{ fontSize: "2.5rem" }}
                                    ></i>
                                </div>
                                <h4 className="fw-bold mb-3">Data Security</h4>
                                <p className="text-muted">
                                    User data is encrypted and privacy is
                                    maintained at all points with
                                    industry-standard security.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;
