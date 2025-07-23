// Slider
import Slider from 'react-slick';

// Zoom Image
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';

// React
import { useRef } from 'react';

const QuizZoom = () => {
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
                <Slider {...settingDetails} className="zoomSliderBig" ref={zoomSliderBig}>
                    <div className="item">
                        <InnerImageZoom
                            zoomType="hover"
                            zoomScale={0.8}
                            src="https://s3.eduquiz.io.vn/eduquiz/workspace/bi-mat-3/exam/IMG_1749609982.jpg"
                        />
                    </div>
                </Slider>
            </div>
        </div>
    );
};

export default QuizZoom;
