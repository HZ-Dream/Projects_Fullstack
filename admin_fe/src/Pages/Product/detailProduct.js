// Icons
import { MdBrandingWatermark } from 'react-icons/md';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import { IoMdPricetags } from 'react-icons/io';
import { IoFastFood } from 'react-icons/io5';
import { FaWeightScale } from 'react-icons/fa6';
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
import { useRef, useState, useEffect } from 'react';
import Slider from 'react-slick';

// Components
import UserAvatarImgComponent from '../../Components/UserAvatarImg';
import { useParams } from 'react-router-dom';

// API
import { fetchDataFromApi } from '../../utils/api';

const ProductDetails = () => {
    let { id } = useParams();
    const [detailData, setDetailData] = useState({});
    const [catData, setCatData] = useState({});
    const [imagesData, setImagesData] = useState([]);
    const [reviewData, setReviewData] = useState([]);
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
        slidesToShow: imagesData.length || 4,
        slidesToScroll: 1,
        arrows: false,
    };

    const productSliderBig = useRef(null);
    const productSliderSml = useRef(null);

    const goToSlide = (index) => {
        productSliderBig.current.slickGoTo(index);
        productSliderSml.current.slickGoTo(index);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        fetchDataFromApi(`/api/product/${id}`).then((res) => {
            setDetailData(res);
            setImagesData(res.images);

            fetchDataFromApi(`/api/category/${res.category}`).then((res) => {
                setCatData(res);
            });

            fetchDataFromApi(`/api/productReview/${id}`).then((res) => {
                setReviewData(res);
            });
        });
    }, [id]);

    return (
        <>
            <section className="right-content w-100">
                <div className="card">
                    <div className="row">
                        <div className="col-md-5">
                            <div className="sliderWrapper py-3 ps-4">
                                <h6 className="mb-3">Product Gallery</h6>
                                <Slider {...productSlider} className="sliderBig mb-2" ref={productSliderBig}>
                                    {imagesData?.length > 0 &&
                                        imagesData.map((item, index) => (
                                            <div key={index} className="item">
                                                <img className="w-100" src={item} alt="ImgDetail" />
                                            </div>
                                        ))}
                                </Slider>
                                <Slider {...productSmlSlider} className="sliderSml" ref={productSliderSml}>
                                    {imagesData?.length > 0 &&
                                        imagesData.map((item, index) => (
                                            <div key={index} className="item" onClick={() => goToSlide(index)}>
                                                <img className="w-100" src={item} alt="ImgDetail" />
                                            </div>
                                        ))}
                                </Slider>
                            </div>
                        </div>

                        <div className="col-md-7 productDetailSection">
                            <div className="py-3 px-4">
                                <h6 className="mb-4">Product Details</h6>
                                <h4 className="mb-4">{detailData.name}</h4>

                                <div className="productInfo">
                                    <div className="row mb-3">
                                        <div className="col-sm-3 dFlexAli-center">
                                            <span className="icon">
                                                <MdBrandingWatermark />
                                            </span>
                                            <span className="name">Brand</span>
                                        </div>
                                        <div className="col-sm-9">
                                            <span>{detailData.brand}</span>
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
                                            <span>{catData.name}</span>
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
                                                        {detailData.tag?.length > 0 &&
                                                            detailData.tag.map((item, index) => (
                                                                <li key={index} className="list-inline-item">
                                                                    <span>{item}</span>
                                                                </li>
                                                            ))}
                                                    </ul>
                                                </div>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-sm-3 dFlexAli-center">
                                            <span className="icon">
                                                <IoFastFood />
                                            </span>
                                            <span className="name">Flavor</span>
                                        </div>
                                        <div className="col-sm-9">
                                            <span>
                                                <div className="row">
                                                    <ul className="list list-inline tags sml">
                                                        {detailData.flavor?.length > 0 &&
                                                            detailData.flavor.map((item, index) => (
                                                                <li key={index} className="list-inline-item">
                                                                    <span>{item}</span>
                                                                </li>
                                                            ))}
                                                    </ul>
                                                </div>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-sm-3 dFlexAli-center">
                                            <span className="icon">
                                                <FaWeightScale />
                                            </span>
                                            <span className="name">Weight</span>
                                        </div>
                                        <div className="col-sm-9">
                                            <span>
                                                <div className="row">
                                                    <ul className="list list-inline tags sml">
                                                        {detailData.weight?.length > 0 &&
                                                            detailData.weight.map((item, index) => (
                                                                <li key={index} className="list-inline-item">
                                                                    <span>{item}</span>
                                                                </li>
                                                            ))}
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
                                            {detailData.priceDiscount > 0 ? (
                                                <span>
                                                    <del className="old me-2">${detailData.priceInit}</del>
                                                    <span className="text-danger fw-bold">
                                                        ${detailData.priceDiscount}
                                                    </span>
                                                </span>
                                            ) : (
                                                <span className="text-danger fw-bold">${detailData.priceInit}</span>
                                            )}
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
                                            <span>{reviewData?.length}</span>
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
                                            <span>{new Date(detailData.dateCreated).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4">
                        <h6 className="mt-4 mb-3">Product Description</h6>
                        <p>{detailData.description}</p>

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
                                <h5>Total Review ({reviewData?.length})</h5>
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
                            {/* <div className="reviewRow">
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
                            </div> */}

                            {reviewData?.length > 0 ? (
                                reviewData.map((item, index) => (
                                    <div key={index} className="reviewRow">
                                        <div className="row">
                                            <div className="col-md-7 d-flex">
                                                <div className="d-flex flex-column">
                                                    <div className="userInfo dFlexAli-center mb-3">
                                                        <UserAvatarImgComponent Img={avatarImg} />
                                                        <div className="info ps-2">
                                                            <h6 className="mb-0">{item.customerName}</h6>
                                                            <span>
                                                                {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <Rating
                                                        name="read-only"
                                                        value={item.rating}
                                                        readOnly
                                                        precision={0.5}
                                                    />
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
                                        <p className="mt-3">{item.review}</p>
                                    </div>
                                ))
                            ) : (
                                <p>At present, there are no comments</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProductDetails;
