// Icons, Button
import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';
import Button from '@mui/material/Button';

// Img
import UserImg from '../../assets/images/dmm.jpg';

// React
import { useRef } from 'react';

// Slider
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

// CSS
import styles from './HomeCat.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const HomeCat = () => {
    const swiperRef = useRef();
    const itemBg = [
        '#feefea',
        '#fffceb',
        '#feefea',
        '#ecffec',
        '#f2fce4',
        '#fffceb',
        '#ecffec',
        '#feefea',
        '#fff3ff',
        '#f2fce4',
        '#fffceb',
        '#f2fce4',
        '#feefea',
        '#ecffec',
        '#f2fce4',
        '#fff3ff',
    ];

    return (
        <section className={cx('homeCat')}>
            <div className="container">
                <h3 className={`${cx('hd')} mb-3`}>Top Contributors</h3>
                <Swiper
                    className="mySwiper"
                    slidesPerView={10}
                    spaceBetween={8}
                    navigation={false}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    slidesPerGroup={3}
                    modules={[Navigation]}
                >
                    {itemBg?.map((item, index) => {
                        return (
                            <SwiperSlide>
                                <div className={`${cx('item')} text-center cursor`} style={{ background: item }}>
                                    <img src={UserImg} alt="HomeCat" />

                                    <h6 className="textOne_line">Dream</h6>
                                    <h6>256 Q</h6>
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
