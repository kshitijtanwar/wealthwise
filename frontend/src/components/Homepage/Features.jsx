import mockImg from "../../assets/images/bulbasaur.avif"

import easy from "../../assets/images/Easytouse.png"

import ui from "../../assets/images/ui.jpg";

import FeatureCard from "../Features/FeatureCard"

import security from "../../assets/images/security.webp"


 

const MOCK_FEATURES = [

    {

        id: 1,

        title: "Easy to Use",

        desc: "Designed for simplicity, our platform offers an intuitive experience that allows users to manage finances effortlessly and with confidence.",

        img: easy

    },

    {

        id: 2,

        title: "Intuitive UI/UX",

        desc: "Enjoy a modern and visually appealing interface that makes navigating through complex financial data seamless and engaging.",

        img: ui

    },

    {

        id: 3,

        title: "Secure",

        desc: "Your privacy matters. We provide robust,industry-standard data protection to ensure all your financial information is gaurded and confidential.",

        img: security

    },

]


 

const Features = () => {

    return <div className="min-vh-80" id="features">

        <h2 className="mb-4 display-5 text-center">Our <span className="text-primary">Features</span></h2>

        <div className="container">

            <div className="row g-3 mt-4">

                {

                    MOCK_FEATURES.map((feat) => {

                        return <div key={feat.id} className="col-12 col-md-4">

                            <FeatureCard title={feat.title} desc={feat.desc} img={feat.img} />

                        </div>

                    })

                }

            </div>

        </div>


 

    </div>

}


 

export default Features