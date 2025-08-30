// Icons, Button
import { FaShoppingCart } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa';
import { GrCompare } from 'react-icons/gr';
import Button from '@mui/material/Button';

// Material UI
import Rating from '@mui/material/Rating';
import Tooltip from '@mui/material/Tooltip';

// React
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Components
import ProductZoom from '../../Components/ProductZoom';
import QuantityBox from '../../Components/QuantityBox';
import RelatedProducts from './RelatedProducts';

// React
import { useContext } from 'react';

// Utils
import { fetchDataFromApi, postData } from '../../utils/api';

import { MyContext } from '../../App';

const ProductDetails = () => {
    const context = useContext(MyContext);
    let { id } = useParams();
    const [activeWeight, setActiveWeight] = useState('');
    const [activeFlavor, setActiveFlavor] = useState('');
    const [activeTabs, setActiveTabs] = useState(0);

    const [proData, setProData] = useState({});
    const [categoryRelated, setCategoryRelated] = useState('');
    const [brandRelated, setBrandRelated] = useState('');
    const [relatedProData, setRelatedProData] = useState([]);

    const [reviewData, setReviewData] = useState([]);
    const [rating, setRating] = useState(1);
    const [reviews, setReviews] = useState({
        productId: id,
        customerId: '',
        customerName: '',
        review: '',
        rating: 1,
    });

    useEffect(() => {
        window.scrollTo(0, 0);

        fetchDataFromApi(`/api/product/${id}`).then((res) => {
            setProData(res);
            setCategoryRelated(res.category);
            setBrandRelated(res.brand);
            context.setQuantity(1);
        });

        fetchDataFromApi(`/api/productReview/${id}`).then((res) => {
            setReviewData(res);
        });
    }, [id]);

    useEffect(() => {
        const updatedPro = context.proData.filter(
            (item) => item.category === categoryRelated || item.brand === brandRelated,
        );
        setRelatedProData(updatedPro);
    }, [categoryRelated, brandRelated]);

    const onChangeInput = (e) => {
        setReviews(() => ({
            ...reviews,
            [e.target.name]: e.target.value,
        }));
    };

    const addToCart = (data) => {
        if (data?.quantity === 0) {
            context.handleClickVariant('Out of stock Products!', 'warning');
            return;
        }
        if (activeWeight === '') {
            context.handleClickVariant('You must select weight!', 'warning');
            return;
        }

        const totalPrice =
            data?.priceDiscount > 0 ? context.quantity * data.priceDiscount : context.quantity * data.priceInit;

        const cart = {
            productTitle: data?.name,
            images: data?.images[0],
            rating: '4',
            flavor: activeFlavor.trim() || '',
            weight: activeWeight.trim(),
            priceInit: data?.priceInit,
            priceDiscount: data?.priceDiscount || 0,
            quantity: context.quantity,
            subTotal: totalPrice,
            productId: data?.id,
            userId: context.userData.userId,
        };

        context.addToCart(cart);
    };

    const addReview = (e) => {
        e.preventDefault();
        if (Object.keys(context.userData).length === 0) {
            context.handleClickVariant('You need sign in!', 'error');
            return;
        }

        console.log(context.userData);

        reviews.customerId = context.userData.userId;
        reviews.rating = rating;

        postData('/api/productReview/add', reviews).then((res) => {
            context.handleClickVariant('Submit review success!', 'success');
            setReviews({
                ...reviews,
                review: '',
            });
            setRating(1);
            fetchDataFromApi(`/api/productReview/${id}`).then((res) => {
                setReviewData(res);
            });
        });
    };

    return (
        <>
            <section className="productDetails section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 ps-5">
                            <ProductZoom proDetail={proData} />
                        </div>

                        <div className="col-md-8 px-5">
                            <h2 className="hd text-capitalize">{proData?.name}</h2>
                            <ul className="list list-inline dFlexAli-center">
                                <li className="list-inline-item">
                                    <div className="dFlexAli-center">
                                        <span className="text-light me-1">Brands:</span>
                                        <span>{proData?.brand}</span>
                                    </div>
                                </li>

                                <li className="list-inline-item">
                                    <div className="dFlexAli-center rateProduct">
                                        <Rating
                                            className="me-1"
                                            name="read-only"
                                            value={3.5}
                                            readOnly
                                            size="small"
                                            precision={0.5}
                                        />
                                        <span className="text-light">1 Review</span>
                                    </div>
                                </li>

                                <li className="list-inline-item">
                                    <div className="dFlexAli-center">
                                        <span className="text-light me-1">IDPro:</span>
                                        <span>{proData?.id}</span>
                                    </div>
                                </li>
                            </ul>

                            <div className="dFlexAli-center info mb-3">
                                {proData?.priceDiscount > 0 ? (
                                    <>
                                        <span className="oldPrice">${proData?.priceInit}.00</span>
                                        <span className="netPrice text-danger ms-2">${proData?.priceDiscount}.00</span>
                                    </>
                                ) : (
                                    <span className="netPrice text-danger">${proData?.priceInit}.00</span>
                                )}
                            </div>

                            <span className="badge bg-success">Quantity: &nbsp; {proData?.quantity}</span>

                            <div className="dFlexAli-center mt-3 actions">
                                <Tooltip title="Add to Wishlist" placement="top">
                                    <Button className="btn-gray btn-round text-capitalize btn-sml" variant="outlined">
                                        <FaHeart className="me-2" /> Add Wishlist
                                    </Button>
                                </Tooltip>

                                <Tooltip title="Add to Compare" placement="top">
                                    <Button
                                        className="btn-gray btn-round text-capitalize btn-sml ms-2"
                                        variant="outlined"
                                    >
                                        <GrCompare className="me-2" /> Add Compare
                                    </Button>
                                </Tooltip>
                            </div>

                            <div className="dFlexAli-center productSize">
                                <span>Tag:</span>
                                <ul className="list list-inline mb-0 ps-4">
                                    {Array.isArray(proData?.tag) &&
                                        proData.tag.length > 0 &&
                                        proData.tag.map((item, index) => (
                                            <li key={index} className="list-inline-item tag">
                                                <span className="tag">{item}</span>
                                            </li>
                                        ))}
                                </ul>
                            </div>

                            <div className="dFlexAli-center productSize">
                                <span>Flavor:</span>
                                <ul className="list list-inline mb-0 ps-4">
                                    {Array.isArray(proData?.flavor) &&
                                        proData.flavor.length > 0 &&
                                        proData.flavor.map((item, index) => (
                                            <li
                                                key={index}
                                                className="list-inline-item"
                                                onClick={() => setActiveFlavor(item)}
                                            >
                                                <span className={`tag ${activeFlavor === item ? 'active' : ''}`}>
                                                    {item}
                                                </span>
                                            </li>
                                        ))}
                                </ul>
                            </div>

                            <div className="dFlexAli-center productSize">
                                <span>Weight:</span>
                                <ul className="list list-inline mb-0 ps-4">
                                    {Array.isArray(proData?.weight) &&
                                        proData.weight.length > 0 &&
                                        proData.weight.map((item, index) => (
                                            <li
                                                key={index}
                                                className="list-inline-item"
                                                onClick={() => setActiveWeight(item)}
                                            >
                                                <span className={`tag ${activeWeight === item ? 'active' : ''}`}>
                                                    {item}
                                                </span>
                                            </li>
                                        ))}
                                </ul>
                            </div>

                            <div className="dFlexAli-center mt-4">
                                <QuantityBox />

                                <Button
                                    onClick={() => addToCart(proData)}
                                    className="btn-blue btn-lg btn-big btn-round ms-3"
                                >
                                    Add To Cart <FaShoppingCart className="ms-2" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <br />

                    <div className="card mt-5 p-5 detailsPageTabs">
                        <div className="customTabs">
                            <ul className="list list-inline">
                                <li className="list-inline-item">
                                    <Button
                                        className={`${activeTabs === 0 ? 'active' : ''}`}
                                        onClick={() => setActiveTabs(0)}
                                    >
                                        Description
                                    </Button>
                                </li>

                                <li className="list-inline-item">
                                    <Button
                                        className={`${activeTabs === 1 ? 'active' : ''}`}
                                        onClick={() => setActiveTabs(1)}
                                    >
                                        Additional Information
                                    </Button>
                                </li>

                                <li className="list-inline-item">
                                    <Button
                                        className={`${activeTabs === 2 ? 'active' : ''}`}
                                        onClick={() => setActiveTabs(2)}
                                    >
                                        Reviews
                                    </Button>
                                </li>
                            </ul>

                            <br />

                            {activeTabs === 0 && (
                                <div className="tabContent">
                                    <p>{proData?.description}</p>
                                </div>
                            )}

                            {activeTabs === 1 && (
                                <div className="tabContent">
                                    <div className="table-responsive">
                                        <table className="table table-bordered">
                                            <tbody>
                                                <tr className="table-item">
                                                    <th>Brands</th>
                                                    <td>
                                                        <p>Frito Lay, Oreo, Welch's</p>
                                                    </td>
                                                </tr>
                                                <tr className="table-item">
                                                    <th>Amount</th>
                                                    <td>
                                                        <p>250 grams, 500 Grams, 1 KG</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTabs === 2 && (
                                <div className="tabContent">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <form onSubmit={addReview} className="reviewForm">
                                                <h4>Add a Review</h4>
                                                <div className="form-group">
                                                    <textarea
                                                        value={reviews.review}
                                                        onChange={onChangeInput}
                                                        className="form-control"
                                                        name="review"
                                                        placeholder="Write a review"
                                                        required
                                                    ></textarea>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <input
                                                                onChange={onChangeInput}
                                                                name="customerName"
                                                                className="form-control"
                                                                type="text"
                                                                placeholder="Name"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <Rating
                                                                onChange={(event, newValue) => setRating(newValue)}
                                                                name="rating"
                                                                value={rating}
                                                                size="small"
                                                                precision={0.5}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <Button
                                                        type="submit"
                                                        className="btn-green btn-lg btn-big btn-round"
                                                    >
                                                        Submit Review
                                                    </Button>
                                                </div>
                                            </form>

                                            <br />
                                            <h4 className="text-uppercase">Customer questions & answers</h4>
                                            <br />

                                            {reviewData.length > 0 ? (
                                                reviewData.map((item) => (
                                                    <div key={item.id} className="card p-4 reviewsCard flex-row">
                                                        <div className="image">
                                                            <div className="rounded-circle">
                                                                <img
                                                                    src="https://wp.alithemes.com/html/nest/demo/assets/imgs/blog/author-2.png"
                                                                    alt="User"
                                                                />
                                                            </div>

                                                            <span className="mt-2 text-g d-block text-center fw-bold">
                                                                {item.customerName}
                                                            </span>
                                                        </div>

                                                        <div className="info ps-5">
                                                            <div className="dFlexAli-center w-100">
                                                                <h5 className="text-light">
                                                                    {new Date(item.createdAt).toLocaleDateString(
                                                                        'vi-VN',
                                                                    )}
                                                                </h5>

                                                                <div className="ms-auto">
                                                                    <Rating
                                                                        className="half-rating-read"
                                                                        name="read-only"
                                                                        value={item.rating}
                                                                        readOnly
                                                                        size="small"
                                                                        precision={0.5}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <p>{item.review}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <h5 className="text-light">There are currently no comments</h5>
                                            )}
                                        </div>

                                        <div className="col-md-4">
                                            <h4 className="mb-3">Customer Reviews</h4>
                                            <div className="d-flex mb-3">
                                                <Rating
                                                    className="me-1"
                                                    name="read-only"
                                                    value={4.5}
                                                    readOnly
                                                    size="small"
                                                    precision={0.5}
                                                />
                                                <h6>4.5 out of 5</h6>
                                            </div>
                                            <div className="progressBarBox dFlexAli-center">
                                                <span className="me-3">5 star</span>
                                                <div className="progress" style={{ width: '78%', height: '20px' }}>
                                                    <div
                                                        className="progress-bar bg-success"
                                                        style={{ width: '78%', height: '20px' }}
                                                    >
                                                        78%
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="progressBarBox dFlexAli-center">
                                                <span className="me-3">4 star</span>
                                                <div className="progress" style={{ width: '78%', height: '20px' }}>
                                                    <div
                                                        className="progress-bar bg-success"
                                                        style={{ width: '85%', height: '20px' }}
                                                    >
                                                        85%
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="progressBarBox dFlexAli-center">
                                                <span className="me-3">3 star</span>
                                                <div className="progress" style={{ width: '78%', height: '20px' }}>
                                                    <div
                                                        className="progress-bar bg-success"
                                                        style={{ width: '70%', height: '20px' }}
                                                    >
                                                        70%
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="progressBarBox dFlexAli-center">
                                                <span className="me-3">2 star</span>
                                                <div className="progress" style={{ width: '78%', height: '20px' }}>
                                                    <div
                                                        className="progress-bar bg-success"
                                                        style={{ width: '40%', height: '20px' }}
                                                    >
                                                        40%
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="progressBarBox dFlexAli-center mb-3">
                                                <span className="me-3">1 star</span>
                                                <div className="progress" style={{ width: '78%', height: '20px' }}>
                                                    <div
                                                        className="progress-bar bg-success"
                                                        style={{ width: '18%', height: '20px' }}
                                                    >
                                                        18%
                                                    </div>
                                                </div>
                                            </div>
                                            <a href="#" className="font-xs text-muted">
                                                How are ratings calculated?
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <br />
                    {relatedProData?.length > 6 && <RelatedProducts proData={relatedProData} />}
                </div>
            </section>
        </>
    );
};

export default ProductDetails;
