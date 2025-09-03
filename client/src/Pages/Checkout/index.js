// Icons
import { IoBagCheckOutline } from 'react-icons/io5';
import { IoBagHandleOutline } from 'react-icons/io5';

// Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// React
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

// API
import { postData, deleteData } from '../../utils/api';

import { MyContext } from '../../App';

const Checkout = () => {
    const context = useContext(MyContext);
    const myCart = Array.isArray(context.myCart) ? context.myCart : [];
    const [formFields, setFormFields] = useState({
        userId: '',
        fullName: '',
        phone: '',
        email: '',
        coupon: '',
        address: '',
        note: '',
        method: '',
        orders: [],
    });

    let subTotal = 0;
    let subQuantity = 0;
    myCart.map((item) => (subTotal += item.subTotal));
    myCart.map((item) => (subQuantity += item.quantity));

    const onChangeInput = (e) => {
        setFormFields((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const placeOrder = (e) => {
        e.preventDefault();

        formFields.userId = context.userData.userId;
        formFields.method = 'COD';
        formFields.orders = myCart;

        console.log(formFields);

        postData('/api/order/create', formFields).then((res) => {
            if (res !== null && res !== undefined && res !== '') {
                context.handleClickVariant('Successfully checkout!', 'success');

                deleteData('/api/cart/clear/', context.userData.userId).then((res) => {
                    context.setMyCart(res);

                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                });
            }
        });
    };

    return (
        <section className="section">
            <div className="container">
                <form onSubmit={placeOrder}>
                    <div className="row">
                        <h2 className="hd">BILLING DETAILS</h2>
                        <div className="col-md-8">
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <TextField
                                            onChange={onChangeInput}
                                            name="fullName"
                                            className="w-100"
                                            label="Full name"
                                            variant="outlined"
                                            size="small"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <TextField
                                            onChange={onChangeInput}
                                            name="phone"
                                            className="w-100"
                                            label="Phone"
                                            variant="outlined"
                                            size="small"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 mt-3">
                                    <div className="form-group">
                                        <TextField
                                            onChange={onChangeInput}
                                            name="email"
                                            className="w-100"
                                            label="Email"
                                            variant="outlined"
                                            size="small"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 mt-3">
                                    <div className="form-group">
                                        <TextField
                                            onChange={onChangeInput}
                                            name="coupon"
                                            className="w-100"
                                            label="Coupon"
                                            variant="outlined"
                                            size="small"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 mt-3">
                                    <div className="form-group">
                                        <TextField
                                            onChange={onChangeInput}
                                            name="address"
                                            className="w-100"
                                            label="Address"
                                            variant="outlined"
                                            size="small"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 mt-3">
                                    <div className="form-group">
                                        <TextField
                                            onChange={onChangeInput}
                                            name="note"
                                            className="w-100"
                                            label="Note"
                                            variant="outlined"
                                            size="small"
                                            multiline
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card order-info mt-3">
                                <h6 className="hd">YOUR ORDER</h6>

                                <div className="table-responsive mt-3">
                                    <table className="table table-borderless">
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {myCart?.length > 0 &&
                                                myCart.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <span className="me-1">{item.productTitle}</span>
                                                            <b>x{item.quantity}</b>
                                                        </td>
                                                        <td>${item.subTotal}</td>
                                                    </tr>
                                                ))}
                                            <tr className="divide">
                                                <td>
                                                    <span className="me-1">Subtotal</span>
                                                    <b>x{subQuantity}</b>
                                                </td>
                                                <td className="text-danger fw-bold">${subTotal}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="dFlexAli-center mt-3">
                                    <Button className="w-100 btn-blue me-2 text-capitalize">
                                        <Link to="/cart">
                                            <IoBagHandleOutline className="me-2" />
                                            View Cart
                                        </Link>
                                    </Button>
                                    <Button type="submit" className="w-100 btn-red text-capitalize">
                                        <IoBagCheckOutline className="me-2" />
                                        Place an Order
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Checkout;
