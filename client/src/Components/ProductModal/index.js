// Icons, Button
import { IoCloseCircleOutline } from 'react-icons/io5';
import { FaHeart } from 'react-icons/fa';
import { GrCompare } from 'react-icons/gr';
import Button from '@mui/material/Button';

// Material UI
import Dialog from '@mui/material/Dialog';
import Rating from '@mui/material/Rating';

// React
import { useState, useContext, useEffect } from 'react';

// Components
import QuantityBox from '../QuantityBox';
import ProductZoom from '../ProductZoom';

import { MyContext } from '../../App';

const ProductModal = (props) => {
    const context = useContext(MyContext);
    const [activeWeight, setActiveWeight] = useState('');
    const [activeFlavor, setActiveFlavor] = useState('');

    useEffect(() => {
        context.setQuantity(1);
    }, [props.firstOpen]);

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

    return (
        <Dialog className="productModal" open={true}>
            <Button className="close_" onClick={() => props.closeProductModal()}>
                <IoCloseCircleOutline />
            </Button>
            <h4 className="mb-2 font-weight-bold">{props.detailPro?.name}</h4>

            <div className="d-flex align-items-center">
                <span>
                    Brands: <b className="ms-2">{props.detailPro?.brand}</b>
                </span>

                <Rating className="rateProduct" name="read-only" value={2} readOnly size="small" precision={0.5} />

                <span>
                    IDPro: <b className="ms-2">{props.detailPro?.id}</b>
                </span>
            </div>

            <hr />

            <div className="row mt-2 productDetailModal">
                <div className="col-md-5">
                    <ProductZoom proDetail={props.detailPro} />
                </div>

                <div className="col-md-7">
                    <div className="d-flex info align-items-center mb-3">
                        {props.detailPro?.priceDiscount > 0 ? (
                            <>
                                <div className="oldPrice lg me-2">${props.detailPro?.priceInit}</div>
                                <div className="netPrice lg text-danger">${props.detailPro?.priceDiscount}</div>
                            </>
                        ) : (
                            <div className="netPrice lg text-danger">${props.detailPro?.priceInit}</div>
                        )}
                    </div>

                    {props.detailPro?.quantity > 0 ? (
                        <span className="badge bg-success">Quantity: &nbsp; {props.detailPro?.quantity}</span>
                    ) : (
                        <span className="badge bg-danger">Quantity: &nbsp; 0</span>
                    )}

                    <p className="mt-3">{props.detailPro?.description}</p>

                    <div className="dFlexAli-center productSize">
                        <span>Flavor:</span>
                        <ul className="list list-inline mb-0 ps-4">
                            {Array.isArray(props.detailPro?.flavor) &&
                                props.detailPro.flavor.length > 0 &&
                                props.detailPro.flavor.map((item, index) => (
                                    <li key={index} className="list-inline-item" onClick={() => setActiveFlavor(item)}>
                                        <span className={`tag ${activeFlavor === item ? 'active' : ''}`}>{item}</span>
                                    </li>
                                ))}
                        </ul>
                    </div>

                    <div className="dFlexAli-center productSize">
                        <span>Weight:</span>
                        <ul className="list list-inline mb-0 ps-4">
                            {Array.isArray(props.detailPro?.weight) &&
                                props.detailPro.weight.length > 0 &&
                                props.detailPro.weight.map((item, index) => (
                                    <li key={index} className="list-inline-item" onClick={() => setActiveWeight(item)}>
                                        <span className={`tag ${activeWeight === item ? 'active' : ''}`}>{item}</span>
                                    </li>
                                ))}
                        </ul>
                    </div>

                    <div className="d-flex align-items-center mt-3">
                        <QuantityBox />

                        <Button
                            onClick={() => addToCart(props.detailPro)}
                            className="btn-blue btn-lg btn-big btn-round ms-3"
                        >
                            Add To Cart
                        </Button>
                    </div>

                    <div className="d-flex align-items-center mt-4 actions">
                        <Button className="btn-round text-capitalize btn-sml" variant="outlined">
                            <FaHeart className="me-2" /> Add Wishlist
                        </Button>

                        <Button className="btn-round text-capitalize btn-sml ms-2" variant="outlined">
                            <GrCompare className="me-2" /> Add Compare
                        </Button>
                    </div>

                    <hr />

                    <div className="dFlexAli-center mt-3">
                        <span className="me-2">Tags:</span>
                        <p className="mb-0">{props.detailPro?.tag.length > 0 && props.detailPro?.tag.join(', ')}</p>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default ProductModal;
