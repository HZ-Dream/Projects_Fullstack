import { FaMinus } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa6';
import Button from '@mui/material/Button';
import { useState } from 'react';

const QuantityBox = () => {
    const [inputValue, setInputValue] = useState(1);

    const minusQuantity = () => {
        if (inputValue > 1) {
            setInputValue(inputValue - 1);
        }
    };

    const plusQuantity = () => {
        setInputValue(inputValue + 1);
    };

    return (
        <div className="quantityDrop d-flex align-items-center">
            <Button onClick={minusQuantity}>
                <FaMinus />
            </Button>
            <input
                type="text"
                name="quantiy"
                value={inputValue}
                onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val) && val > 0) {
                        setInputValue(val);
                    } else if (e.target.value === '') {
                        setInputValue('');
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
