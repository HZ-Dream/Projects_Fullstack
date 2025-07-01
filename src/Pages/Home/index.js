// Icons, Button
import { IoIosArrowRoundForward } from 'react-icons/io';
import Button from '@mui/material/Button';

// Img
import banner1 from '../../assets/images/banner1.png';
import banner2 from '../../assets/images/banner2.png';
import banner3 from '../../assets/images/banner3.png';
import banner4 from '../../assets/images/banner4.png';

// React
import Slider from 'react-slick';

// Components
import HomeBanner from '../../Components/HomeBanner';
import ProductItem from '../../Components/ProductItem/ProductItem';
import HomeCat from '../../Components/HomeCat';

// CSS
import styles from './Home.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Home = () => {
    var productItemSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        autoplay: false,
    };

    return (
        <div>
            <HomeBanner />

            <HomeCat />

            <section className={cx('homeProducts')}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <div className={cx('banner')}>
                                <img src={banner1} alt="Banner" className="cursor w-100" />
                            </div>

                            <div className={`${cx('banner')} mt-5`}>
                                <img src={banner2} alt="Banner" className="cursor w-100" />
                            </div>
                        </div>

                        <div className={`col-md-9 ${cx('productRow')}`}>
                            <div className="d-flex align-items-center">
                                <div className="w-75">
                                    <h3 className={cx('hd')}>Top-Rated Quizzes</h3>
                                    <p className="text-light mb-0">Discover Our Top-Rated Quizzes - Loved by Users!</p>
                                </div>

                                <Button className={`${cx('viewAllBtn')} ms-auto`}>
                                    View All <IoIosArrowRoundForward />
                                </Button>
                            </div>

                            <div className={`${cx('product_row')} w-100 mt-4`}>
                                <Slider {...productItemSettings}>
                                    <ProductItem />
                                    <ProductItem />
                                    <ProductItem />
                                    <ProductItem />
                                    <ProductItem />
                                </Slider>
                            </div>

                            <div className="d-flex align-items-center mt-5">
                                <div className="w-75">
                                    <h3 className={cx('hd')}>NEW Quizzes</h3>
                                    <p className="text-light mb-0">Quiz is updated continuously</p>
                                </div>

                                <Button className={`${cx('viewAllBtn')} ms-auto`}>
                                    View All <IoIosArrowRoundForward />
                                </Button>
                            </div>

                            <div className={`${cx('productNew_row')} w-100 mt-4 d-flex`}>
                                <ProductItem className="itemRow_4" />
                                <ProductItem className="itemRow_4" />
                                <ProductItem className="itemRow_4" />
                                <ProductItem className="itemRow_4" />
                                <ProductItem className="itemRow_4" />
                                <ProductItem className="itemRow_4" />
                                <ProductItem className="itemRow_4" />
                                <ProductItem className="itemRow_4" />
                            </div>

                            <div className={`${cx('bannerSec')} d-flex mt-4 mb-5`}>
                                <div className={cx('banner')}>
                                    <img className="w-100" src={banner3} alt="banner" />
                                </div>

                                <div className={cx('banner')}>
                                    <img className="w-100" src={banner4} alt="banner" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
