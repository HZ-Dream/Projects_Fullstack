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

// Components
import ProductZoom from '../../Components/ProductZoom';
import QuantityBox from '../../Components/QuantityBox';
import RelatedProducts from './RelatedProducts';

const ProductDetails = () => {
    const [activeSize, setActiveSize] = useState(50);
    const [activeTabs, setActiveTabs] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <section className="productDetails section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 ps-5">
                            <ProductZoom />
                        </div>

                        <div className="col-md-8 px-5">
                            <h2 className="hd text-capitalize">All Natural Italian-Style Chicken Meatballs</h2>
                            <ul className="list list-inline dFlexAli-center">
                                <li className="list-inline-item">
                                    <div className="dFlexAli-center">
                                        <span className="text-light me-1">Brands:</span>
                                        <span>Welch's</span>
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
                                        <span className="text-light me-1">SKU:</span>
                                        <span>ZU49VOR</span>
                                    </div>
                                </li>
                            </ul>

                            <div className="dFlexAli-center info mb-3">
                                <span className="oldPrice">$20.00</span>
                                <span className="netPrice text-danger ms-2">$15.00</span>
                            </div>

                            <span className="badge bg-success">In Stock</span>

                            <p className="mt-3">
                                Vivamus adipiscing nisl ut dolor dignissim semper. Nulla luctus malesuada tincidunt.
                                Class aptent taciti sociosqu ad litora torquent. Vivamus adipiscing nisl ut dolor
                                dignissim semper. Nulla luctus malesuada tincidunt. Class aptent taciti sociosqu ad
                                litora torquent
                            </p>

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
                                <span>Size / Weight:</span>
                                <ul className="list list-inline mb-0 ps-4">
                                    <li className="list-inline-item" onClick={() => setActiveSize(50)}>
                                        <span className={`tag ${activeSize === 50 ? 'active' : ''}`}>50g</span>
                                    </li>
                                    <li className="list-inline-item" onClick={() => setActiveSize(100)}>
                                        <span className={`tag ${activeSize === 100 ? 'active' : ''}`}>100g</span>
                                    </li>
                                    <li className="list-inline-item" onClick={() => setActiveSize(200)}>
                                        <span className={`tag ${activeSize === 200 ? 'active' : ''}`}>200g</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="dFlexAli-center mt-4">
                                <QuantityBox />

                                <Button className="btn-blue btn-lg btn-big btn-round ms-3">
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
                                    <p>
                                        Quisque varius diam vel metus mattis, id aliquam diam rhoncus. Proin vitae magna
                                        in dui finibus malesuada et at nulla. Morbi elit ex, viverra vitae ante vel,
                                        blandit feugiat ligula. Fusce fermentum iaculis nibh, at sodales leo maximus a.
                                        Nullam ultricies sodales nunc, in pellentesque lorem mattis quis. Cras imperdiet
                                        est in nunc tristique lacinia. Nullam aliquam mauris eu accumsan tincidunt.
                                        Suspendisse velit ex, aliquet vel ornare vel, dignissim a tortor. <br /> <br />
                                        Morbi ut sapien vitae odio accumsan gravida. Morbi vitae erat auctor, eleifend
                                        nunc a, lobortis neque. Praesent aliquam dignissim viverra. Maecenas lacus odio,
                                        feugiat eu nunc sit amet, maximus sagittis dolor. Vivamus nisi sapien, elementum
                                        sit amet eros sit amet, ultricies cursus ipsum. Sed consequat luctus ligula.
                                        Curabitur laoreet rhoncus blandit. Aenean vel diam ut arcu pharetra dignissim ut
                                        sed leo. Vivamus faucibus, ipsum in vestibulum vulputate, lorem orci convallis
                                        quam, sit amet consequat nulla felis pharetra lacus. Duis semper erat mauris,
                                        sed egestas purus commodo vel.
                                    </p>
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
                                            <form className="reviewForm">
                                                <h4>Add a Review</h4>
                                                <div className="form-group">
                                                    <textarea
                                                        className="form-control"
                                                        name="review"
                                                        placeholder="Write a review"
                                                    ></textarea>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                name="userName"
                                                                placeholder="Name"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <Rating
                                                                name="rating"
                                                                value={0}
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

                                            <div className="card p-4 reviewsCard flex-row">
                                                <div className="image">
                                                    <div className="rounded-circle">
                                                        <img
                                                            src="https://wp.alithemes.com/html/nest/demo/assets/imgs/blog/author-2.png"
                                                            alt="User"
                                                        />
                                                    </div>

                                                    <span className="text-g d-block text-center fw-bold">Sienna</span>
                                                </div>

                                                <div className="info ps-5">
                                                    <div className="dFlexAli-center w-100">
                                                        <h5 className="text-light">12/07/2025</h5>
                                                        <div className="ms-auto">
                                                            <Rating
                                                                className="half-rating-read"
                                                                name="read-only"
                                                                value={3.5}
                                                                readOnly
                                                                size="small"
                                                                precision={0.5}
                                                            />
                                                        </div>
                                                    </div>

                                                    <p>
                                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                                        Delectus, suscipit exercitationem accusantium obcaecati quos
                                                        voluptate nesciunt facilis itaque modi commodi dignissimos sequi
                                                        repudiandae minus ab deleniti totam officia id incidunt?
                                                    </p>
                                                </div>
                                            </div>
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
                    <RelatedProducts />
                </div>
            </section>
        </>
    );
};

export default ProductDetails;
