// import mockImg from "../../assets/images/bulbasaur.avif"

// import easy from "../../assets/images/Easytouse.png"

// import ui from "../../assets/images/ui.jpg";

import FeatureCard from "../Features/FeatureCard";

// import security from "../../assets/images/security.webp"

const MOCK_FEATURES = [
    {
        id: 1,
        title: "Easy to Use",
        desc: "Designed for simplicity, our platform offers an intuitive experience that allows users to manage finances effortlessly and with confidence.",
        icon: "bi-lightning-charge",
    },
    {
        id: 2,
        title: "Intuitive UI/UX",
        desc: "Enjoy a modern and visually appealing interface that makes navigating through complex financial data seamless and engaging.",
        icon: "bi-palette",
    },
    {
        id: 3,
        title: "Secure",
        desc: "Your privacy matters. We provide robust, industry-standard data protection to ensure all your financial information is guarded and confidential.",
        icon: "bi-shield-check",
    },
];

const Features = () => {
    return (
        <section className="py-5 bg-light" id="features">
            <div className="container py-5">
                <div className="row justify-content-center mb-5">
                    <div className="col-lg-8 text-center">
                        <h2 className="display-4 fw-bold mb-3">
                            Why Choose{" "}
                            <span className="text-primary">Wealthwise?</span>
                        </h2>
                        <p className="lead text-muted">
                            Discover the powerful features that make financial
                            management effortless and effective
                        </p>
                    </div>
                </div>
                <div className="row g-4">
                    {MOCK_FEATURES.map((feat) => {
                        return (
                            <div
                                key={feat.id}
                                className="col-12 col-md-6 col-lg-4"
                            >
                                <FeatureCard
                                    title={feat.title}
                                    desc={feat.desc}
                                    icon={feat.icon}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Features;
