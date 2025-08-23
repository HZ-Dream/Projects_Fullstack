// Icons
import { BsArrowsFullscreen } from 'react-icons/bs';
import { IoMdHeartEmpty } from 'react-icons/io';
import Button from '@mui/material/Button';

// Rating
import Rating from '@mui/material/Rating';

// React
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Components
import ProductModal from '../ProductModal';

const ProductItem = (props) => {
    const [isOpenModal, setIsOpenModal] = useState(false);

    const viewProductDetails = (id) => {
        setIsOpenModal(true);
    };

    const closeProductModal = () => {
        setIsOpenModal(false);
    };

    const handlePercent = () => {
        const { priceInit, priceDiscount } = props.productData || {};
        if (!priceInit || !priceDiscount || priceDiscount >= priceInit) return null;
        return Math.round(((priceInit - priceDiscount) / priceInit) * 100);
    };

    return (
        <div className={`item productItem ${props.itemView}`}>
            <Link to={`/product/${props.productData?.id}`}>
                <div className="imgWrapper">
                    <img className="w-100" src={props.productData?.images[0]} alt={props.productData?.name} />
                    {props.productData?.priceDiscount > 0 && handlePercent() ? (
                        <span className="badge bg-primary">{handlePercent()}%</span>
                    ) : null}
                </div>

                <div className="info">
                    <h4>{props.productData?.name}</h4>
                    <span className="text-success d-block">
                        {props.productData?.quantity > 0 ? 'In Stock' : 'Out Stock'}
                    </span>
                    <Rating className="mt-2 mb-2" name="read-only" value={2} readOnly size="small" precision={0.5} />

                    <div className="d-flex">
                        {props.productData?.priceDiscount > 0 ? (
                            <>
                                <span className="oldPrice">${props.productData?.priceInit}.00</span>
                                <span className="netPrice text-danger ms-2">
                                    ${props.productData?.priceDiscount}.00
                                </span>
                            </>
                        ) : (
                            <span className="netPrice text-danger">${props.productData?.priceInit}.00</span>
                        )}
                    </div>
                </div>
            </Link>
            <div className="actions">
                <Button onClick={() => viewProductDetails(1)}>
                    <BsArrowsFullscreen />
                </Button>
                <Button>
                    <IoMdHeartEmpty style={{ fontSize: '20px' }} />
                </Button>
            </div>
            {isOpenModal === true && (
                <ProductModal detailPro={props.productData} closeProductModal={closeProductModal} />
            )}
        </div>
    );
};

export default ProductItem;
