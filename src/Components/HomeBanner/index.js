import React from "react";
import Slider from "react-slick";


const HomeBanner = () => {
    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        autoplay: true,
    };

    return (
        <div className="homeBannerSection">
            <Slider {...settings}>
                <div className="item">
                    <img className="w-100" src="https://images.unsplash.com/photo-1658431618511-adeba775bd66?q=80&w=1388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Slider" />
                </div>
                <div className="item">
                    <img className="w-100" src="https://images.unsplash.com/photo-1744848279507-f6e20e647792?q=80&w=1363&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Slider" />
                </div>
            </Slider>
        </div>
    )
}

export default HomeBanner;