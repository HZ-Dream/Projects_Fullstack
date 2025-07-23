// React
import Slider from 'react-slick';

// CSS
import styles from './HomeBanner.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const HomeBanner = () => {
    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        autoplay: false,
    };

    return (
        <div className="container">
            <div className={cx('homeBannerSection')}>
                <Slider {...settings}>
                    <div className={cx('item')}>
                        <img
                            className="w-100"
                            src="https://img.freepik.com/premium-vector/yellow-quiz-time-banner-with-comic-style-background-suitable-use-promotional-designs_626143-308.jpg"
                            alt="Slider"
                        />
                    </div>
                    <div className={cx('item')}>
                        <img
                            className="w-100"
                            src="https://static.vecteezy.com/system/resources/thumbnails/007/343/548/small/memphis-style-yellow-quiz-time-banner-design-for-promotion-vector.jpg"
                            alt="Slider"
                        />
                    </div>
                </Slider>
            </div>
        </div>
    );
};

export default HomeBanner;
