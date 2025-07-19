// Slider
import Slider from 'react-slick';

// Zoom Image
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';

// React
import { useRef } from 'react';

const ProductZoom = () => {
    const zoomSliderBig = useRef();
    const zoomSlider = useRef();

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
                <div className="badge bg-primary">23%</div>
                <Slider {...settingDetails} className="zoomSliderBig" ref={zoomSliderBig}>
                    <div className="item">
                        <InnerImageZoom
                            zoomType="hover"
                            zoomScale={1}
                            src="https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-62.jpg"
                        />
                    </div>

                    <div className="item">
                        <InnerImageZoom
                            zoomType="hover"
                            zoomScale={1}
                            src="https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image2-47.jpg"
                        />
                    </div>

                    <div className="item">
                        <InnerImageZoom
                            zoomType="hover"
                            zoomScale={1}
                            src="https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image3-35.jpg"
                        />
                    </div>
                </Slider>
            </div>
            <Slider {...settingSliders} className="zoomSlider" ref={zoomSlider}>
                <div className="item" onClick={() => goto(0)}>
                    <img
                        className="w-100"
                        src="https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-62.jpg"
                        alt="Slider"
                    />
                </div>
                <div className="item" onClick={() => goto(1)}>
                    <img
                        className="w-100"
                        src="https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image2-47.jpg"
                        alt="Slider"
                    />
                </div>
                <div className="item" onClick={() => goto(2)}>
                    <img
                        className="w-100"
                        src="https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image3-35.jpg"
                        alt="Slider"
                    />
                </div>
            </Slider>
        </div>
    );
};

export default ProductZoom;
