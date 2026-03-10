// React
import { useEffect, useState, useContext, useRef } from 'react';

import { MyContext } from '../../App';

// Components
import TokenCard from './TokenCard';
import TokenDialog from './TokenDialog';

// API
import { fetchDataFromApi, postData } from '../../utils/api';

// Styles
import classNames from 'classnames/bind';
import styles from './Token.module.scss';

const cx = classNames.bind(styles);

const Token = () => {
    const context = useContext(MyContext);
    const didRun = useRef(false);
    const [tokens, setTokens] = useState([]);
    const [filter, setFilter] = useState('default');

    const [selectedToken, setSelectedToken] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchTokens();

        if (didRun.current) return;

        didRun.current = true;

        const params = new URLSearchParams(window.location.search);

        const payment = params.get('payment');

        if (payment === 'success') {
            context.handleClickVariant('Payment success!', 'success');
        }

        if (payment === 'failed') {
            context.handleClickVariant('Payment failed!', 'error');
        }
    }, []);

    const fetchTokens = async () => {
        try {
            fetchDataFromApi('/api/token/all').then((res) => {
                setTokens(res.tokenList);
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleOpen = (token) => {
        setSelectedToken(token);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const sortedTokens = [...tokens].sort((a, b) => {
        if (filter === 'high') return b.priceInit - a.priceInit;
        if (filter === 'low') return a.priceInit - b.priceInit;
        return 0;
    });

    const handleVNPay = (pack) => {
        if (!context.userData.userId) {
            context.handleClickVariant('You need to log in!', 'warning');
            return;
        }

        const pricePack = pack.priceDiscount > 0 ? pack.priceDiscount : pack.priceInit;

        const formVNPay = {
            userId: context.userData.userId,
            namePack: pack.name,
            pricePack: pricePack,
            tokenPack: pack.token,
        };

        postData('/api/vnpay/create', formVNPay).then((res) => {
            window.location.href = res;
        });
    };

    return (
        <div className={cx('token-shop')}>
            <div className={cx('token-header')}>
                <h1>Token Shop</h1>

                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="default">Default</option>
                    <option value="high">Price High → Low</option>
                    <option value="low">Price Low → High</option>
                </select>
            </div>

            <div className={cx('token-grid')}>
                {sortedTokens.map((token) => (
                    <TokenCard key={token.id} token={token} onClick={() => handleOpen(token)} />
                ))}
            </div>

            <TokenDialog open={open} handleClose={handleClose} token={selectedToken} handleVNPay={handleVNPay} />
        </div>
    );
};

export default Token;
