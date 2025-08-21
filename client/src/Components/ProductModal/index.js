// Icons, Button
import { IoCloseCircleOutline } from 'react-icons/io5';
import { FaHeart } from 'react-icons/fa';
import { GrCompare } from 'react-icons/gr';
import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';

// Rating
import Rating from '@mui/material/Rating';

// Components
import QuantityBox from '../QuantityBox';
import ProductZoom from '../ProductZoom';

const ProductModal = (props) => {
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
                    <ProductZoom proImages={props.detailPro?.images} />
                </div>

                <div className="col-md-7">
                    <div className="d-flex info align-items-center mb-3">
                        <div className="oldPrice lg me-2">${props.detailPro?.priceInit}</div>
                        <div className="netPrice lg text-danger">${props.detailPro?.priceDiscount}</div>
                    </div>

                    {props.detailPro?.quantity > 0 ? (
                        <span className="badge bg-success">Quantity: &nbsp; {props.detailPro?.quantity}</span>
                    ) : (
                        <span className="badge bg-danger">Quantity: &nbsp; 0</span>
                    )}

                    <p className="mt-3">{props.detailPro?.description}</p>

                    <div className="d-flex align-items-center">
                        <QuantityBox />

                        <Button className="btn-blue btn-lg btn-big btn-round ms-3">Add To Cart</Button>
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
