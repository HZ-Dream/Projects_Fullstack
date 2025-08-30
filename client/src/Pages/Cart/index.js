// Icons
import { RiDeleteBin5Line } from 'react-icons/ri';

// Material UI
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';

// React
import { useContext } from 'react';
import { Link } from 'react-router-dom';

// Components
import QuantityCart from '../../Components/QuantityBox/quantityCart';

// Utils
import { fetchDataFromApi, deleteData } from '../../utils/api';

import { MyContext } from '../../App';

const Cart = () => {
    const context = useContext(MyContext);
    const myCart = context.myCart;

    let subTotal = 0;
    myCart.map((item) => (subTotal += item.subTotal));

    const removeItem = (id) => {
        deleteData('/api/cart/', id).then((res) => {
            context.handleClickVariant('Delete item success!', 'success');

            fetchDataFromApi(`/api/cart/${context.userData.userId}`).then((res) => {
                context.setMyCart(res);
            });
        });
    };

    return (
        <>
            <section className="section cartPage">
                <div className="container">
                    <div className="row">
                        <h2 className="hd mb-0">Your Cart</h2>
                        <p>
                            There are &nbsp;
                            <b className="text-red">{context.myCart.length > 0 ? context.myCart.length : 0}</b> &nbsp;
                            products in your cart
                        </p>
                        <div className="col-md-9 pe-5">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th width="15%">Product</th>
                                            <th width="10%">Falvor / Weight</th>
                                            <th width="15%">Unit Price</th>
                                            <th width="15%">Dis Price</th>
                                            <th className="ps-4" width="20%">
                                                Quantity
                                            </th>
                                            <th width="15%">Subtotal</th>
                                            <th width="10%">Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myCart?.length > 0 &&
                                            myCart.map((item, index) => (
                                                <tr key={index}>
                                                    <td width="15%">
                                                        <Link to={`/product/${item.productId}`}>
                                                            <div className="dFlexAli-center cartItemWrapper">
                                                                <div className="imgWrapper">
                                                                    <img
                                                                        className="w-100"
                                                                        src={item.images}
                                                                        alt={item.productTitle}
                                                                    />
                                                                </div>

                                                                <div className="info px-3">
                                                                    <h6>{item.productTitle}</h6>
                                                                    <Rating
                                                                        name="read-only"
                                                                        value={item.rating}
                                                                        readOnly
                                                                        size="small"
                                                                        precision={0.5}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </td>
                                                    <td width="10%">
                                                        {item.flavor ? `${item.flavor} / ${item.weight}` : item.weight}
                                                    </td>
                                                    <td width="15%">${item.priceInit}</td>
                                                    <td className="text-danger" width="15%">
                                                        ${item.priceDiscount}
                                                    </td>
                                                    <td width="20%">
                                                        <QuantityCart data={item} quantity={item.quantity} />
                                                    </td>
                                                    <td width="15%">${item.subTotal}</td>
                                                    <td width="10%">
                                                        <span className="remove" onClick={() => removeItem(item.id)}>
                                                            <RiDeleteBin5Line />
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="card shadow p-3 cartDetails">
                                <h4>CART TOTALS</h4>

                                <div className="dFlexAli-center mb-3">
                                    <span>Subtotal</span>
                                    <span className="ms-auto text-red fw-bold">${subTotal}</span>
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
                                    <span className="ms-auto text-red fw-bold">${subTotal}</span>
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
