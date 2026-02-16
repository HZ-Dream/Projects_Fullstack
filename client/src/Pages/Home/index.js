// Icons, Button
import { IoIosArrowRoundForward } from 'react-icons/io';
import { IoMailOutline } from 'react-icons/io5';
import Button from '@mui/material/Button';

// Img
import banner1 from '../../assets/images/banner1.png';
import banner2 from '../../assets/images/banner2.png';
import banner3 from '../../assets/images/banner3.png';
import banner4 from '../../assets/images/banner4.png';
import couponImg from '../../assets/images/coupon.png';

// React
import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';

// Components
import HomeBanner from '../../Components/HomeBanner';
import QuizItem from '../../Components/QuizItem';
import HomeCat from '../../Components/HomeCat';

// CSS
import styles from './Home.module.scss';
import classNames from 'classnames/bind';

// API
import { fetchDataFromApi } from '../../utils/api';

const cx = classNames.bind(styles);

const Home = () => {
    const [quizData, setQuizData] = useState([]);
    const [userData, setUserData] = useState([]);

    var quizItemSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        autoplay: false,
    };

    useEffect(() => {
        fetchDataFromApi('/api/quiz/getAllQuizzes').then((res) => {
            setQuizData(res);
        });
    }, []);

    return (
        <div>
            <HomeBanner />

            <hr />

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
                                    <Link to="/quiz">
                                        View All <IoIosArrowRoundForward />
                                    </Link>
                                </Button>
                            </div>

                            <div className={`${cx('product_row')} w-100 mt-4`}>
                                <Slider {...quizItemSettings}>
                                    {quizData?.length > 0 &&
                                        quizData.map((item, index) => {
                                            return <QuizItem key={index} data={item} />;
                                        })}
                                </Slider>
                            </div>

                            <div className="d-flex align-items-center mt-5">
                                <div className="w-75">
                                    <h3 className={cx('hd')}>NEW Quizzes</h3>
                                    <p className="text-light mb-0">Quiz is updated continuously</p>
                                </div>

                                <Button className={`${cx('viewAllBtn')} ms-auto`}>
                                    <Link to="/quiz">
                                        View All <IoIosArrowRoundForward />
                                    </Link>
                                </Button>
                            </div>

                            <div className={`${cx('productNew_row')} w-100 mt-4 d-flex`}>
                                {quizData?.length > 0 &&
                                    quizData.slice(0, 8).map((item, index) => {
                                        return <QuizItem key={index} className="itemRow_4" data={item} />;
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={`${cx('newsLetterSection')} mt-3 d-flex align-items-center`}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <p className="text-white mb-1">$20 discount for your first order</p>
                            <h3 className="text-white">Join our newsletter and get...</h3>
                            <p className="text-gray fz13">
                                Join our email subscription now to get updates <br /> on promotions and coupons.
                            </p>

                            <form action="">
                                <IoMailOutline />
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Your email address"
                                    spellCheck="false"
                                />
                                <Button>Subscribe</Button>
                            </form>
                        </div>

                        <div className="col-md-6">
                            <img src={couponImg} alt="coupon" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
