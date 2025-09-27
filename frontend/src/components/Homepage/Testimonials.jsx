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
        <div className="container my-5 min-vh-80" id="testimonials">
            <h2 className="mb-4 display-5 text-center">
                What Our <span className="text-primary">Users</span> Says
            </h2>
            <div className="row g-4">
                {mock_testimonials.map((t) => {
                    return (
                        <div className="col-md-4" key={t.id}>
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-body text-center">
                                    <img
                                        height={100}
                                        width={100}
                                        // src={placeholder}
                                        alt={t.name}
                                        className="rounded-circle mb-3"
                                    />
                                    <h5 className="card-title">{t.name}</h5>
                                    <p className="text-muted small">{t.role}</p>
                                    <p className="card-text">{t.feedback}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Testimonials;
