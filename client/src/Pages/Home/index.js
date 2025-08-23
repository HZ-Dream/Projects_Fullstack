// Icons
import { IoIosArrowRoundForward } from 'react-icons/io';
import { IoMailOutline } from 'react-icons/io5';
import Button from '@mui/material/Button';

// Images
import banner1 from '../../assets/images/banner1.png';
import banner2 from '../../assets/images/banner2.png';
import banner3 from '../../assets/images/banner3.png';
import banner4 from '../../assets/images/banner4.png';
import couponImg from '../../assets/images/coupon.png';

// React
import { useEffect, useState, useContext } from 'react';
import Slider from 'react-slick';

// Components
import HomeBanner from '../../Components/HomeBanner';
import ProductItem from '../../Components/ProductItem';
import HomeCat from '../../Components/HomeCat';

// Context
import { MyContext } from '../../App';

// Utils
import { fetchDataFromApi } from '../../utils/api';

const Home = () => {
    const context = useContext(MyContext);

    const catData = context.catData;
    const featuredProData = context.featuredProData;
    const [newProData, setNewProData] = useState([]);

    var productItemSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        autoplay: false,
    };

    useEffect(() => {
        fetchDataFromApi('/api/product?perPage=8').then((res) => {
            setNewProData(res.productList);
        });
    }, []);

    return (
        <div>
            <HomeBanner />
            {catData?.length !== 0 && <HomeCat catData={catData} />}

            <section className="homeProducts">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="sticky">
                                <div className="banner">
                                    <img src={banner1} alt="Banner" className="cursor w-100" />
                                </div>

                                <div className="banner mt-5">
                                    <img src={banner2} alt="Banner" className="cursor w-100" />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-9 productRow">
                            <div className="d-flex align-items-center">
                                <div className="info w-75">
                                    <h3 className="hd mb-0">BEST SELLERS</h3>
                                    <p className="text-light mb-0">
                                        Do not miss the current offers until the end of March.
                                    </p>
                                </div>

                                <Button className="viewAllBtn ms-auto">
                                    View All <IoIosArrowRoundForward />
                                </Button>
                            </div>

                            <div className="product_row w-100 mt-4">
                                <Slider {...productItemSettings}>
                                    {featuredProData?.length !== 0 &&
                                        featuredProData?.map((data) => <ProductItem productData={data} />)}
                                </Slider>
                            </div>

                            <div className="d-flex align-items-center mt-5">
                                <div className="info w-75">
                                    <h3 className="hd mb-0">NEW PRODUCTS</h3>
                                    <p className="text-light mb-0">New products with updated stocks.</p>
                                </div>

                                <Button className="viewAllBtn ms-auto">
                                    View All <IoIosArrowRoundForward />
                                </Button>
                            </div>

                            <div className="product_row productNew_row w-100 mt-4 d-flex">
                                {newProData?.length !== 0 &&
                                    newProData?.map((data, index) => <ProductItem key={index} productData={data} />)}
                            </div>

                            <div className="bannerSec d-flex mt-4 mb-5">
                                <div className="banner">
                                    <img className="w-100" src={banner3} alt="banner" />
                                </div>

                                <div className="banner">
                                    <img className="w-100" src={banner4} alt="banner" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="newsLetterSection mt-3 d-flex align-items-center">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <p className="text-white mb-1">$20 discount for your first order</p>
                            <h3 className="text-white">Join our newsletter and get...</h3>
                            <p className="text-light">
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
