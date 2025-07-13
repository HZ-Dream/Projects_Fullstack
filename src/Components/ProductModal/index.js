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
            <h4 className="mb-2 font-weight-bold">All Natural Italian-Style Chicken Meatballs</h4>

            <div className="d-flex align-items-center">
                <span>
                    Brands: <b className="ms-2">Welch's</b>
                </span>

                <Rating className="rateProduct" name="read-only" value={2} readOnly size="small" precision={0.5} />

                <span>
                    SKU: <b className="ms-2">ZU49VOR</b>
                </span>
            </div>

            <hr />

            <div className="row mt-2 productDetailModal">
                <div className="col-md-5">
                    <ProductZoom />
                </div>

                <div className="col-md-7">
                    <div className="d-flex info align-items-center mb-3">
                        <div className="oldPrice lg me-2">$9.35</div>
                        <div className="netPrice lg text-danger">$7.25</div>
                    </div>

                    <span className="badge bg-success">IN STOCK</span>

                    <p className="mt-3">
                        Vivamus adipiscing nisl ut dolor dignissim semper. Nulla luctus malesuada tincidunt. Class
                        aptent taciti sociosqu ad litora torquent
                    </p>

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
                </div>
            </div>
        </Dialog>
    );
};

export default ProductModal;
