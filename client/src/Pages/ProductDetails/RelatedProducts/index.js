// React
import Slider from 'react-slick';

// Components
import ProductItem from '../../../Components/ProductItem';

const RelatedProducts = () => {
    var productItemSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        arrows: true,
        autoplay: false,
    };

    return (
        <>
            <div className="d-flex align-items-center mt-5">
                <div className="info w-75">
                    <h3 className="hd mb-0 text-capitalize">Related Products</h3>
                </div>
            </div>

            <div className="product_row w-100 mt-4">
                <Slider {...productItemSettings}>
                    <ProductItem />
                    <ProductItem />
                    <ProductItem />
                    <ProductItem />
                    <ProductItem />
                    <ProductItem />
                </Slider>
            </div>
        </>
    );
};

export default RelatedProducts;
