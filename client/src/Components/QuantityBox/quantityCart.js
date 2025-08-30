// Icons
import { FaMinus } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa6';

// Marterial UI
import Button from '@mui/material/Button';

// React
import { useState, useContext, useEffect } from 'react';

// Utils
import { fetchDataFromApi, editData } from '../../utils/api';

import { MyContext } from '../../App';

const QuantityCart = ({ data, quantity: initialQuantity }) => {
    const context = useContext(MyContext);
    const [quantity, setQuantity] = useState(initialQuantity);

    useEffect(() => {
        setQuantity(initialQuantity);
    }, [initialQuantity]);

    const minusQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    const plusQuantity = () => {
        setQuantity((prev) => prev + 1);
    };

    useEffect(() => {
        if (quantity === initialQuantity) return;

        const totalPrice = data?.priceDiscount > 0 ? quantity * data?.priceDiscount : quantity * data?.priceInit;

        const cart = {
            ...data,
            quantity,
            subTotal: totalPrice,
        };

        editData(`/api/cart/${data?.id}`, cart).then(() => {
            context.handleClickVariant('Update quantity success!', 'info');
            fetchDataFromApi(`/api/cart/${context.userData.userId}`).then((res) => {
                context.setMyCart(res);
            });
        });
    }, [quantity]);

    return (
        <div className="quantityDrop d-flex align-items-center">
            <Button onClick={minusQuantity}>
                <FaMinus />
            </Button>
            <input
                type="number"
                min="1"
                name="quantity"
                value={quantity}
                onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val) && val > 0) {
                        setQuantity(val);
                    }
                }}
            />
            <Button onClick={plusQuantity}>
                <FaPlus />
            </Button>
        </div>
    );
};

export default QuantityCart;
