import { BsArrowsFullscreen } from "react-icons/bs";
import { IoMdHeartEmpty } from "react-icons/io";
import Button from '@mui/material/Button';

// Rating
import Rating from '@mui/material/Rating';


const ProductItem = () => {
    return (
        <div className="item productItem">
            <div className="imgWrapper">
                <img className="w-100" src="https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-62-346x310.jpg" alt="Product" />

                <span className="badge bg-primary">28%</span>
            </div>

            <div className="actions">
                <Button><BsArrowsFullscreen /></Button>
                <Button><IoMdHeartEmpty style={{fontSize: '20px'}}/></Button>
            </div>

            <div className="info">
                <h4>All Natural Italian-Style Chicken Meatballs</h4>
                <span className="text-success d-block">In Stock</span>
                <Rating className="mt-2 mb-2" name="read-only" value={2} 
                    readOnly size="small" precision={0.5}/>

                <div className="d-flex">
                    <span className="oldPrice">$20.00</span>
                    <span className="netPrice text-danger ms-2">$14.00</span>
                </div>
            </div>
        </div>
    )
}

export default ProductItem;