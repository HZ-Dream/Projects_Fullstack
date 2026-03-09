// Icons
import { MdGeneratingTokens } from 'react-icons/md';

// Styles
import classNames from 'classnames/bind';
import styles from './Token.module.scss';

const cx = classNames.bind(styles);

const TokenCard = ({ token, onClick }) => {
    const price = token.priceDiscount > 0 ? token.priceDiscount : token.priceInit;

    return (
        <div className={cx('token-card')} onClick={onClick}>
            <div className={cx('imagePack')}>
                <img src={token.image} alt={token.name} />
            </div>

            <h3>{token.name}</h3>

            <div className={cx('token-amount')}>
                {token.token} Tokens <MdGeneratingTokens />
            </div>

            <div className={cx('token-price')}>
                {token.priceDiscount > 0 && <span className={cx('old-price')}>{token.priceInit}</span>}

                <span className={cx('price')}>{price} VND</span>
            </div>
        </div>
    );
};

export default TokenCard;
