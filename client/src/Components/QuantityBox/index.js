// Icons
import { FaMinus } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa6';

// Marterial UI
import Button from '@mui/material/Button';

// React
import { useContext } from 'react';

import { MyContext } from '../../App';

const QuantityBox = () => {
    const { quantity, setQuantity } = useContext(MyContext);

    const minusQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const plusQuantity = () => {
        setQuantity(quantity + 1);
    };

    return (
        <div className="quantityDrop d-flex align-items-center">
            <Button onClick={minusQuantity}>
                <FaMinus />
            </Button>
            <input
                type="text"
                name="quantity"
                value={quantity}
                onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val) && val > 0) {
                        setQuantity(val);
                    } else if (e.target.value === '') {
                        setQuantity('');
                    }
                }}
            />
            <Button onClick={plusQuantity}>
                <FaPlus />
            </Button>
        </div>
    );
};

export default QuantityBox;
