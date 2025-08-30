// Slider
import Slider from 'react-slick';

// Zoom Image
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';

// React
import { useRef } from 'react';

const ProductZoom = (props) => {
    const zoomSliderBig = useRef();
    const zoomSlider = useRef();
    const imagesPro = props.proDetail?.images;

    const handlePercent = () => {
        const { priceInit, priceDiscount } = props.proDetail || {};
        if (!priceInit || !priceDiscount || priceDiscount >= priceInit) return null;
        return Math.round(((priceInit - priceDiscount) / priceInit) * 100);
    };

    const goto = (index) => {
        zoomSlider.current.slickGoTo(index);
        zoomSliderBig.current.slickGoTo(index);
    };

    var settingDetails = {
        dots: false,
        infinite: false,
        speed: 700,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: false,
    };

    var settingSliders = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: true,
        fade: false,
    };

    return (
        <div className="productZoomContainer">
            <div className="productZoom position-relative">
                <div className="badge bg-primary">
                    {props.proDetail?.priceDiscount > 0 && handlePercent() ? `${handlePercent()}%` : null}
                </div>
                <Slider {...settingDetails} className="zoomSliderBig" ref={zoomSliderBig}>
                    {imagesPro?.length > 0 &&
                        imagesPro?.map((item, index) => (
                            <div className="item" key={index}>
                                <InnerImageZoom className="w-100" zoomType="hover" zoomScale={1} src={item} />
                            </div>
                        ))}
                </Slider>
            </div>
            <Slider {...settingSliders} className="zoomSlider" ref={zoomSlider}>
                {imagesPro?.length > 0 &&
                    imagesPro?.map((item, index) => (
                        <div key={index} className="item" onClick={() => goto(index)}>
                            <img className="w-100" src={item} alt="Slider" />
                        </div>
                    ))}
            </Slider>
        </div>
    );
};

export default ProductZoom;
