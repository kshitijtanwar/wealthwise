const FeatureCard = ({ img, title, desc }) => {
    return <div className="card" >
        <img src={img} className="card-img-top object-fit-contain" alt={title} width={200} height={200}/>
        <div className="card-body">
            <h5 className="card-title text-center">{title}</h5>
            <p className="card-text text-center">{desc}</p>
        </div>
    </div>
}

export default FeatureCard