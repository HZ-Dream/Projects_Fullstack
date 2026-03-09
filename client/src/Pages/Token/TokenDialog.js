// Icons
import { MdGeneratingTokens } from 'react-icons/md';

// MUI
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';

// Styles
import classNames from 'classnames/bind';
import styles from './Token.module.scss';

const cx = classNames.bind(styles);

const TokenDialog = ({ open, handleClose, token }) => {
    if (!token) return null;

    const price = token.priceDiscount > 0 ? token.priceDiscount : token.priceInit;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <div className={cx('token-dialog')}>
                <h2 className="text-center">{token.name}</h2>

                <div className="d-flex">
                    <span className="me-2">Description:</span>
                    <span className={cx('title')}> {token.description}</span>
                </div>

                <span>
                    Quantity:
                    <span className={cx('token')}>
                        {token.token} Tokens <MdGeneratingTokens />
                    </span>
                </span>

                <div className={cx('dialog-price')}>
                    <span>Price: </span>
                    {token.priceDiscount > 0 && <span className={cx('old-price')}>${token.priceInit}</span>}

                    <span className={cx('price')}>${price}</span>
                </div>

                <Button className="mt-2" variant="contained" fullWidth size="large">
                    Buy Now
                </Button>
            </div>
        </Dialog>
    );
};

export default TokenDialog;
