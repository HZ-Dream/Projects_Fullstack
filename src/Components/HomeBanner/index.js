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
                        src="https://images.unsplash.com/photo-1744848279507-f6e20e647792?q=80&w=1363&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Slider"
                    />
                </div>
            </Slider>
        </div>
    );
};

export default HomeBanner;
