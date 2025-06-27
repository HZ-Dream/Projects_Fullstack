import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

// Slider
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import { useRef } from 'react';
import Button from '@mui/material/Button';



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
    ]

    return (
        <section className="homeCat">
            <div className="container">
                <h3 className="hd mb-3">Featured Categories</h3>
                <Swiper 
                    className="mySwiper"
                    slidesPerView={10}
                    spaceBetween={8}
                    navigation = {false}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    slidesPerGroup={3}
                    modules={[Navigation]}
                >
                    {
                        itemBg?.map((item, index) => {
                            return (
                                <SwiperSlide>
                                    <div className="item text-center cursor" style={{background: item}}>
                                        <img src="https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/cat-4.png" alt="HomeCat" />
                                    
                                        <h6>Black Plum</h6>
                                    </div>
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
                <div className='homeCat_naviBtn'>
                    <Button className='homeCat_prevBtn' onClick={() => swiperRef.current?.slidePrev()}><IoIosArrowBack /></Button>
                    <Button className='homeCat_nextBtn' onClick={() => swiperRef.current?.slideNext()}><IoIosArrowForward /></Button>
                </div>
            </div>
        </section>
    )
}

export default HomeCat;