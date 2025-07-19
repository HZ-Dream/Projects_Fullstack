// Icons
import { RiDeleteBin5Line } from 'react-icons/ri';

// Material UI
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';

// React
import { Link } from 'react-router-dom';

// Components
import QuantityBox from '../../Components/QuantityBox';

const Cart = () => {
    return (
        <>
            <section className="section cartPage">
                <div className="container">
                    <div className="row">
                        <h2 className="hd mb-0">Your Cart</h2>
                        <p>
                            There are <b className="text-red">3</b> products in your cart
                        </p>
                        <div className="col-md-9 pe-5">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th width="35%">Product</th>
                                            <th width="15%">Unit Price</th>
                                            <th className="ps-4" width="25%">
                                                Quantity
                                            </th>
                                            <th width="15%">Subtotal</th>
                                            <th width="10%">Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td width="35%">
                                                <Link to="/product/1">
                                                    <div className="dFlexAli-center cartItemWrapper">
                                                        <div className="imgWrapper">
                                                            <img
                                                                className="w-100"
                                                                src="https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/product-1-1.jpg"
                                                                alt="Cart Item"
                                                            />
                                                        </div>

                                                        <div className="info px-3">
                                                            <h6>Field Roast Chao Cheese Creamy Original</h6>
                                                            <Rating
                                                                name="read-only"
                                                                value={3.5}
                                                                readOnly
                                                                size="small"
                                                                precision={0.5}
                                                            />
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td width="15%">$7.25</td>
                                            <td width="25%">
                                                <QuantityBox />
                                            </td>
                                            <td width="15%">$7.25</td>
                                            <td width="10%">
                                                <span className="remove">
                                                    <RiDeleteBin5Line />
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="35%">
                                                <Link to="/product/1">
                                                    <div className="dFlexAli-center cartItemWrapper">
                                                        <div className="imgWrapper">
                                                            <img
                                                                className="w-100"
                                                                src="https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/product-1-1.jpg"
                                                                alt="Cart Item"
                                                            />
                                                        </div>

                                                        <div className="info px-3">
                                                            <h6>Field Roast Chao Cheese Creamy Original</h6>
                                                            <Rating
                                                                name="read-only"
                                                                value={3.5}
                                                                readOnly
                                                                size="small"
                                                                precision={0.5}
                                                            />
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td width="15%">$7.25</td>
                                            <td width="25%">
                                                <QuantityBox />
                                            </td>
                                            <td width="15%">$7.25</td>
                                            <td width="10%">
                                                <span className="remove">
                                                    <RiDeleteBin5Line />
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="35%">
                                                <Link to="/product/1">
                                                    <div className="dFlexAli-center cartItemWrapper">
                                                        <div className="imgWrapper">
                                                            <img
                                                                className="w-100"
                                                                src="https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/product-1-1.jpg"
                                                                alt="Cart Item"
                                                            />
                                                        </div>

                                                        <div className="info px-3">
                                                            <h6>Field Roast Chao Cheese Creamy Original</h6>
                                                            <Rating
                                                                name="read-only"
                                                                value={3.5}
                                                                readOnly
                                                                size="small"
                                                                precision={0.5}
                                                            />
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td width="15%">$7.25</td>
                                            <td width="25%">
                                                <QuantityBox />
                                            </td>
                                            <td width="15%">$7.25</td>
                                            <td width="10%">
                                                <span className="remove">
                                                    <RiDeleteBin5Line />
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="card shadow p-3 cartDetails">
                                <h4>CART TOTALS</h4>

                                <div className="dFlexAli-center mb-3">
                                    <span>Subtotal</span>
                                    <span className="ms-auto text-red fw-bold">$21.75</span>
                                </div>

                                <div className="dFlexAli-center mb-3">
                                    <span>Shipping</span>
                                    <span className="ms-auto">
                                        <b>Free</b>
                                    </span>
                                </div>

                                <div className="dFlexAli-center mb-3">
                                    <span>Estimate For</span>
                                    <span className="ms-auto">
                                        <b>United Kingdom</b>
                                    </span>
                                </div>

                                <div className="dFlexAli-center">
                                    <span>Total</span>
                                    <span className="ms-auto text-red fw-bold">$21.75</span>
                                </div>

                                <Button className="btn-red btn-lg btn-big mt-4">Checkout</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Cart;
