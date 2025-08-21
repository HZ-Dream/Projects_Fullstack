// Icons
import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';

// Slider
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

// React
import { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';

const HomeCat = (props) => {
    const swiperRef = useRef();
    const [catData, setCatData] = useState([]);

    useEffect(() => {
        setCatData(props.catData);
    }, []);

    return (
        <section className="homeCat">
            <div className="container">
                <h3 className="hd mb-3">Featured Categories</h3>
                <Swiper
                    className="mySwiper"
                    slidesPerView={10}
                    spaceBetween={8}
                    navigation={false}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    slidesPerGroup={3}
                    modules={[Navigation]}
                >
                    {catData?.map((cat) => {
                        return (
                            <SwiperSlide key={cat.id}>
                                <div className="item text-center cursor" style={{ background: cat.color }}>
                                    <img src={cat.images[0]} alt={cat.name} />

                                    <h6>{cat.name}</h6>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
                <div className="homeCat_naviBtn">
                    <Button className="homeCat_prevBtn" onClick={() => swiperRef.current?.slidePrev()}>
                        <IoIosArrowBack />
                    </Button>
                    <Button className="homeCat_nextBtn" onClick={() => swiperRef.current?.slideNext()}>
                        <IoIosArrowForward />
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default HomeCat;
