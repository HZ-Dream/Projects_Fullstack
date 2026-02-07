// Icons, Button
import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';
import Button from '@mui/material/Button';

// Img
import UserImg from '../../assets/images/dmm.jpg';

// React
import { useState, useRef, useEffect } from 'react';

// Slider
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// API
import { fetchDataFromApi } from '../../utils/api';

// CSS
import styles from './HomeCat.module.scss';
import classNames from 'classnames/bind';
import 'swiper/css';
import 'swiper/css/navigation';

const cx = classNames.bind(styles);

const HomeCat = () => {
    const [userData, setUserData] = useState([]);
    const swiperRef = useRef();
    const itemBg = ['#feefea', '#fffceb', '#feefea', '#ecffec', '#f2fce4'];

    useEffect(() => {
        fetchDataFromApi('/api/user/getAllUser').then((res) => {
            setUserData(res);
        });
    }, []);

    const sortedUsers = [...userData].sort((a, b) => b.quizCreated - a.quizCreated).slice(0, 21);

    return (
        <section className={cx('homeCat')}>
            <div className="container">
                <h3 className={`${cx('hd')} mb-3`}>Top 20 Contributors</h3>
                <Swiper
                    className="mySwiper"
                    slidesPerView={10}
                    spaceBetween={8}
                    navigation={false}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    slidesPerGroup={3}
                    modules={[Navigation]}
                >
                    {sortedUsers.map((item, index) => {
                        const randomBg = itemBg[Math.floor(Math.random() * itemBg.length)];
                        return (
                            <SwiperSlide key={item.id || index}>
                                <div className={`${cx('item')} text-center cursor`} style={{ background: randomBg }}>
                                    <img src={item.image} alt="HomeCat" />
                                    <h6 className="textOne_line">{item.name}</h6>
                                    <h6>{item.quizCreated} Q</h6>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
                <div className={cx('homeCat_naviBtn')}>
                    <Button className={cx('homeCat_prevBtn')} onClick={() => swiperRef.current?.slidePrev()}>
                        <IoIosArrowBack />
                    </Button>
                    <Button className={cx('homeCat_nextBtn')} onClick={() => swiperRef.current?.slideNext()}>
                        <IoIosArrowForward />
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default HomeCat;
