const FeatureCard = ({ title, desc, icon }) => {
    return (
        <div
            className="card h-100 shadow-sm border-0 hover-lift"
            style={{ transition: "transform 0.3s ease" }}
        >
            <div className="card-body text-center p-4">
                <div
                    className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                    style={{ width: "80px", height: "80px" }}
                >
                    <i
                        className={`bi ${icon} text-primary`}
                        style={{ fontSize: "2.5rem" }}
                    ></i>
                </div>
                <h5 className="card-title fw-bold mb-3">{title}</h5>
                <p className="card-text text-muted">{desc}</p>
            </div>
        </div>
    );
};

export default FeatureCard;
