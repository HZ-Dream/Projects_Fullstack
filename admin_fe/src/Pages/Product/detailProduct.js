// Icons
import { MdBrandingWatermark } from 'react-icons/md';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import { IoMdPricetags } from 'react-icons/io';
import { IoIosColorPalette } from 'react-icons/io';
import { SiZiggo } from 'react-icons/si';
import { HiCurrencyDollar } from 'react-icons/hi2';
import { MdRateReview } from 'react-icons/md';
import { BsFillPatchCheckFill } from 'react-icons/bs';
import { FaReply } from 'react-icons/fa6';

// Material UI
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';

// Images
import avatarImg from '../../assets/images/avatar.jpg';

// React
import { useRef, useState } from 'react';
import Slider from 'react-slick';

// Components
import UserAvatarImgComponent from '../../Components/UserAvatarImg';

const ProductDetails = () => {
    var productSlider = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
    };

    var productSmlSlider = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
    };

    const productSliderBig = useRef(null);
    const productSliderSml = useRef(null);

    const goToSlide = (index) => {
        console.log(index);

        productSliderBig.current.slickGoTo(index);
        productSliderSml.current.slickGoTo(index);
    };

    return (
        <>
            <section className="right-content w-100">
                <div className="card">
                    <div className="row">
                        <div className="col-md-5">
                            <div className="sliderWrapper py-3 ps-4">
                                <h6 className="mb-3">Product Gallery</h6>
                                <Slider {...productSlider} className="sliderBig mb-2" ref={productSliderBig}>
                                    <div className="item">
                                        <img
                                            className="w-100"
                                            src="https://mironcoder-hotash.netlify.app/images/product/single/01.webp"
                                            alt="ImgDetail"
                                        />
                                    </div>
                                    <div className="item">
                                        <img
                                            className="w-100"
                                            src="https://mironcoder-hotash.netlify.app/images/product/single/02.webp"
                                            alt="ImgDetail"
                                        />
                                    </div>
                                    <div className="item">
                                        <img
                                            className="w-100"
                                            src="https://mironcoder-hotash.netlify.app/images/product/single/03.webp"
                                            alt="ImgDetail"
                                        />
                                    </div>
                                    <div className="item">
                                        <img
                                            className="w-100"
                                            src="https://mironcoder-hotash.netlify.app/images/product/single/04.webp"
                                            alt="ImgDetail"
                                        />
                                    </div>
                                    <div className="item">
                                        <img
                                            className="w-100"
                                            src="https://mironcoder-hotash.netlify.app/images/product/single/05.webp"
                                            alt="ImgDetail"
                                        />
                                    </div>
                                </Slider>
                                <Slider {...productSmlSlider} className="sliderSml" ref={productSliderSml}>
                                    <div className="item" onClick={() => goToSlide(0)}>
                                        <img
                                            className="w-100"
                                            src="https://mironcoder-hotash.netlify.app/images/product/single/01.webp"
                                            alt="ImgDetail"
                                        />
                                    </div>
                                    <div className="item" onClick={() => goToSlide(1)}>
                                        <img
                                            className="w-100"
                                            src="https://mironcoder-hotash.netlify.app/images/product/single/02.webp"
                                            alt="ImgDetail"
                                        />
                                    </div>
                                    <div className="item" onClick={() => goToSlide(2)}>
                                        <img
                                            className="w-100"
                                            src="https://mironcoder-hotash.netlify.app/images/product/single/03.webp"
                                            alt="ImgDetail"
                                        />
                                    </div>
                                    <div className="item" onClick={() => goToSlide(3)}>
                                        <img
                                            className="w-100"
                                            src="https://mironcoder-hotash.netlify.app/images/product/single/04.webp"
                                            alt="ImgDetail"
                                        />
                                    </div>
                                    <div className="item" onClick={() => goToSlide(4)}>
                                        <img
                                            className="w-100"
                                            src="https://mironcoder-hotash.netlify.app/images/product/single/05.webp"
                                            alt="ImgDetail"
                                        />
                                    </div>
                                </Slider>
                            </div>
                        </div>

                        <div className="col-md-7 productDetailSection">
                            <div className="py-3 px-4">
                                <h6 className="mb-4">Product Details</h6>
                                <h4 className="mb-4">
                                    Formal suits for men wedding slim fit 3 piece dress business party jacket
                                </h4>

                                <div className="productInfo">
                                    <div className="row mb-3">
                                        <div className="col-sm-3 dFlexAli-center">
                                            <span className="icon">
                                                <MdBrandingWatermark />
                                            </span>
                                            <span className="name">Brand</span>
                                        </div>
                                        <div className="col-sm-9">
                                            <span>Ecstasy</span>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-sm-3 dFlexAli-center">
                                            <span className="icon">
                                                <BiSolidCategoryAlt />
                                            </span>
                                            <span className="name">Category</span>
                                        </div>
                                        <div className="col-sm-9">
                                            <span>Man</span>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-sm-3 dFlexAli-center">
                                            <span className="icon">
                                                <IoMdPricetags />
                                            </span>
                                            <span className="name">Tags</span>
                                        </div>
                                        <div className="col-sm-9">
                                            <span>
                                                <div className="row">
                                                    <ul className="list list-inline tags sml">
                                                        <li className="list-inline-item">
                                                            <span>suite</span>
                                                        </li>
                                                        <li className="list-inline-item">
                                                            <span>party</span>
                                                        </li>
                                                        <li className="list-inline-item">
                                                            <span>dress</span>
                                                        </li>
                                                        <li className="list-inline-item">
                                                            <span>smart</span>
                                                        </li>
                                                        <li className="list-inline-item">
                                                            <span>man</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-sm-3 dFlexAli-center">
                                            <span className="icon">
                                                <IoIosColorPalette />
                                            </span>
                                            <span className="name">Color</span>
                                        </div>
                                        <div className="col-sm-9">
                                            <span>
                                                <div className="row">
                                                    <ul className="list list-inline tags sml">
                                                        <li className="list-inline-item">
                                                            <span>red</span>
                                                        </li>
                                                        <li className="list-inline-item">
                                                            <span>black</span>
                                                        </li>
                                                        <li className="list-inline-item">
                                                            <span>brown</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-sm-3 dFlexAli-center">
                                            <span className="icon">
                                                <SiZiggo />
                                            </span>
                                            <span className="name">Size</span>
                                        </div>
                                        <div className="col-sm-9">
                                            <span>
                                                <div className="row">
                                                    <ul className="list list-inline tags sml">
                                                        <li className="list-inline-item">
                                                            <span>m</span>
                                                        </li>
                                                        <li className="list-inline-item">
                                                            <span>l</span>
                                                        </li>
                                                        <li className="list-inline-item">
                                                            <span>xl</span>
                                                        </li>
                                                        <li className="list-inline-item">
                                                            <span>xxl</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-sm-3 dFlexAli-center">
                                            <span className="icon">
                                                <HiCurrencyDollar />
                                            </span>
                                            <span className="name">Price</span>
                                        </div>
                                        <div className="col-sm-9">
                                            <span>
                                                <del className="old me-2">$23.00</del>
                                                <span className="text-danger fw-bold">$21.00</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-sm-3 dFlexAli-center">
                                            <span className="icon">
                                                <MdRateReview />
                                            </span>
                                            <span className="name">Review</span>
                                        </div>
                                        <div className="col-sm-9">
                                            <span>23</span>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-sm-3 dFlexAli-center">
                                            <span className="icon">
                                                <BsFillPatchCheckFill />
                                            </span>
                                            <span className="name">Published</span>
                                        </div>
                                        <div className="col-sm-9">
                                            <span>02 Feb 2020</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4">
                        <h6 className="mt-4 mb-3">Product Description</h6>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae reprehenderit repellendus
                            expedita esse cupiditate quos doloremque rerum, corrupti ab illum est nihil, voluptate ex
                            dignissimos! Sit voluptatem delectus nam, molestiae, repellendus ab sint quo aliquam debitis
                            amet natus doloremque laudantium? Repudiandae, consequuntur, officiis quidem quo deleniti,
                            autem non laudantium sequi error molestiae ducimus accusamus facere velit consectetur vero
                            dolore natus nihil temporibus aspernatur quia consequatur? Consequuntur voluptate deserunt
                            repellat tenetur debitis molestiae doloribus dicta. In rem illum dolorem atque ratione
                            voluptates asperiores maxime doloremque laudantium magni neque ad quae quos quidem, quaerat
                            rerum ducimus blanditiis reiciendis
                        </p>

                        <br />

                        <h6 className="mt-4 mb-4">Rating Analytics</h6>

                        <div className="ratingSection">
                            <div className="ratingStatus">
                                <div className="ratingRow dFlexAli-center">
                                    <span className="col1">5 Star</span>

                                    <div className="col2">
                                        <div className="progress">
                                            <div className="progress-bar" style={{ width: '70%' }}></div>
                                        </div>
                                    </div>

                                    <span className="col3">(22)</span>
                                </div>

                                <div className="ratingRow dFlexAli-center">
                                    <span className="col1">4 Star</span>

                                    <div className="col2">
                                        <div className="progress">
                                            <div className="progress-bar" style={{ width: '50%' }}></div>
                                        </div>
                                    </div>

                                    <span className="col3">(20)</span>
                                </div>

                                <div className="ratingRow dFlexAli-center">
                                    <span className="col1">3 Star</span>

                                    <div className="col2">
                                        <div className="progress">
                                            <div className="progress-bar" style={{ width: '60%' }}></div>
                                        </div>
                                    </div>

                                    <span className="col3">(42)</span>
                                </div>

                                <div className="ratingRow dFlexAli-center">
                                    <span className="col1">2 Star</span>

                                    <div className="col2">
                                        <div className="progress">
                                            <div className="progress-bar" style={{ width: '20%' }}></div>
                                        </div>
                                    </div>

                                    <span className="col3">(18)</span>
                                </div>

                                <div className="ratingRow dFlexAli-center">
                                    <span className="col1">1 Star</span>

                                    <div className="col2">
                                        <div className="progress">
                                            <div className="progress-bar" style={{ width: '10%' }}></div>
                                        </div>
                                    </div>

                                    <span className="col3">(5)</span>
                                </div>
                            </div>

                            <div className="ratingOverral text-center">
                                <h5>Total Review (38)</h5>
                                <h1>4.5</h1>
                                <Rating name="read-only" value={4.5} readOnly precision={0.5} />
                            </div>
                        </div>

                        <br />

                        <h6 className="mt-4 mb-4">Review Reply Form</h6>

                        <form className="reviewForm">
                            <textarea placeholder="write here"></textarea>
                            <div className="d-flex justify-content-end">
                                <Button className="mt-3 btn-blue w-25">Submit</Button>
                            </div>
                        </form>

                        <br />

                        <h6 className="mt-4 mb-4">Customer Reviews</h6>

                        <div className="reviewSection">
                            <div className="reviewRow">
                                <div className="row">
                                    <div className="col-md-7 d-flex">
                                        <div className="d-flex flex-column">
                                            <div className="userInfo dFlexAli-center mb-3">
                                                <UserAvatarImgComponent Img={avatarImg} />
                                                <div className="info ps-2">
                                                    <h6 className="mb-0">Dream</h6>
                                                    <span>25 minutes ago</span>
                                                </div>
                                            </div>

                                            <Rating name="read-only" value={4.5} readOnly precision={0.5} />
                                        </div>
                                    </div>
                                    <div className="col-md-5 dFlexAli-center">
                                        <div className="ms-auto">
                                            <Button className="btn-big btn-blue">
                                                <FaReply className="me-2" />
                                                Reply
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-3">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis quo nostrum dolore
                                    fugiat ducimus labore debitis unde autem recusandae? Eius harum tempora quis minima,
                                    adipisci natus quod magni omnis quas.
                                </p>
                            </div>

                            <div className="reviewRow reply">
                                <div className="row">
                                    <div className="col-md-7 d-flex">
                                        <div className="d-flex flex-column">
                                            <div className="userInfo dFlexAli-center mb-3">
                                                <UserAvatarImgComponent Img={avatarImg} />
                                                <div className="info ps-2">
                                                    <h6 className="mb-0">Dream</h6>
                                                    <span>25 minutes ago</span>
                                                </div>
                                            </div>

                                            <Rating name="read-only" value={4.5} readOnly precision={0.5} />
                                        </div>
                                    </div>
                                    <div className="col-md-5 dFlexAli-center">
                                        <div className="ms-auto">
                                            <Button className="btn-big btn-blue">
                                                <FaReply className="me-2" />
                                                Reply
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-3">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis quo nostrum dolore
                                    fugiat ducimus labore debitis unde autem recusandae? Eius harum tempora quis minima,
                                    adipisci natus quod magni omnis quas.
                                </p>
                            </div>

                            <div className="reviewRow">
                                <div className="row">
                                    <div className="col-md-7 d-flex">
                                        <div className="d-flex flex-column">
                                            <div className="userInfo dFlexAli-center mb-3">
                                                <UserAvatarImgComponent Img={avatarImg} />
                                                <div className="info ps-2">
                                                    <h6 className="mb-0">Dream</h6>
                                                    <span>25 minutes ago</span>
                                                </div>
                                            </div>

                                            <Rating name="read-only" value={4.5} readOnly precision={0.5} />
                                        </div>
                                    </div>
                                    <div className="col-md-5 dFlexAli-center">
                                        <div className="ms-auto">
                                            <Button className="btn-big btn-blue">
                                                <FaReply className="me-2" />
                                                Reply
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-3">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis quo nostrum dolore
                                    fugiat ducimus labore debitis unde autem recusandae? Eius harum tempora quis minima,
                                    adipisci natus quod magni omnis quas.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProductDetails;
